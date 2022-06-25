import { resourceAlreadyInUse, resourceNotFound, resourceNotBelongsTo } from 'App/Helpers/expection';
import Player, { ID as PLAYER_ID } from 'App/Models/Player';
import Game from 'App/Models/Game';
import Deck, { ID as DECK_ID } from 'App/Models/Deck';
import PlayerService from './PlayerService';
import Card, { CardFace } from 'App/Models/Card';
import Database from '@ioc:Adonis/Lucid/Database';
import DeckService from './DecksService';

export default class GamesService {
    public static all(): Promise<Game[]> {
        return Game.all();
    }

    public static async find(gameUuid: string): Promise<Game|null> {
        return Game.findBy('uuid', gameUuid);
    }

    public static async findOrFail(gameUuid: string): Promise<Game> {
        return Game.findByOrFail('uuid', gameUuid);
    }

    public static create(): Promise<Game> {
        const game = new Game();
        return game.save();
    }
    
    public static async delete(gameUuid: string) {
        let game: Game;
        
        try {
            game = await this.findOrFail(gameUuid);
        } catch (err) {
            throw resourceNotFound();
        }

        try {
            await game.delete();
            return true;
        } catch (err) {
            throw err;
        }
    }

    public static async addDeck(gameUuid: string, deckId: DECK_ID): Promise<Deck> {
        let game: Game;
        let deck: Deck;
        
        try {
            game = await this.findOrFail(gameUuid);
            deck = await Deck.findOrFail(deckId);
        } catch (err) {
            throw resourceNotFound();
        }

        if (deck.gameId)
            throw resourceAlreadyInUse('Deck already in a game deck');

        let gameDecksCount: number;

        try {
            gameDecksCount = (
                await game
                    .related('decks')
                    .query()
            ).length;

            await Database.transaction(async trx => {
                deck.useTransaction(trx);

                deck.gameId = game.id;
                await deck.save();

                await deck
                    .related('cards')
                    .createMany(
                        DeckService.generateDeckCards(deckId, 52*gameDecksCount),
                    );
            });
        } catch (err) {
            throw err;
        }

        return await Deck
            .query()
            .preload('cards', query => {
                query.orderBy('index');
            })
            .where('id', deck.id)
            .firstOrFail();
    }

    public static async allPlayers(gameUuid: string) {
        let game: Game;

        try {
            game = await this.findOrFail(gameUuid);
        } catch (err) {
            throw resourceNotFound();
        }

        const players: Player[] = await game
            .related('players')
            .query();

        const mutatedPlayers = await Promise.all(
            players.map(async player => {
                const mutated = {
                    ...player.toJSON(),
                    hand_value: 0,
                };
                
                const cards = await PlayerService.getCards(player.id);
                
                if (cards && cards.length > 0)
                    mutated.hand_value = await cards
                        .map(card => CardFace[card.face])
                        .reduce((prev, next) => prev + next);
                else
                    mutated.hand_value = 0;
                    
                return mutated;
            })
            ,
        );

        mutatedPlayers.sort((a, b) => b.hand_value - a.hand_value);

        return mutatedPlayers;
    }

    public static async addPlayer(gameUuid: string, nickname: string): Promise<Player> {
        let game: Game;
        
        try {
            game = await this.findOrFail(gameUuid);
        } catch (err) {
            throw resourceNotFound();
        }
        
        const player = new Player();

        player.gameId = game.id;
        player.nickname = nickname;

        return player.save();
    }

    public static async removePlayer(gameUuid: string, playerId: PLAYER_ID): Promise<void> {
        let game: Game;
        let player: Player;

        try {
            game = await this.findOrFail(gameUuid);
            player = await Player.findOrFail(playerId);
        } catch (err) {
            throw resourceNotFound();
        }
        
        if (player.gameId !== game.id)
            throw resourceNotBelongsTo('The given player not belongs to the given game');

        try {
            await player.delete();
        } catch (err) {
            throw err;
        }
    }

    public static async dealCards(
        gameUuid: string,
        playerId: PLAYER_ID,
        quantity: number = 1
    ): Promise<Card[]> {
        let game: Game;
        let player: Player;

        try {
            game = await this.findOrFail(gameUuid);
            player = await Player.findOrFail(playerId);
        } catch (err) {
            throw resourceNotFound();
        }

        if (player.gameId !== game.id)
            throw resourceNotBelongsTo('The given player does not belongs to the given game');

        try {
            const cardsToDeal: Card[] = await Card
                .query()
                .select(['cards.*'])
                .innerJoin('decks AS dk', 'dk.id', 'cards.deck_id')
                .innerJoin('games AS g', 'g.id', 'dk.game_id')
                .where('g.id', game.id)
                .andWhereNull('cards.player_id')
                .orderBy('cards.index')
                .limit(quantity);

            await Database.transaction(async trx => {
                for (const card of cardsToDeal) {
                    card.useTransaction(trx);
                    card.playerId = playerId;
                    await card.save();
                }
            });

            return cardsToDeal;
        } catch (err) {
            throw err;
        }
    }

    public static async getUndealtSuitsCount(gameUuid: string): Promise<Object> {
        let game: Game;
        
        try {
            game = await this.findOrFail(gameUuid);
        } catch (err) {
            throw resourceNotFound();
        }

        const suitCounterQuery = (suit: string) => Database.raw(`
                IFNULL(SUM(
                    CASE
                        WHEN cards.suit = '${suit}' THEN 1
                        ELSE 0
                    END
                ), 0) AS ${suit.toLowerCase()}
            `);

        try {
            const suits: Card[] = await Card
                .query()
                .select([
                    suitCounterQuery('Hearts'),
                    suitCounterQuery('Spades'),
                    suitCounterQuery('Clubs'),
                    suitCounterQuery('Diamonds'),
                ])
                .innerJoin('decks AS dk', 'dk.id', 'cards.deck_id')
                .innerJoin('games AS g', 'g.id', 'dk.game_id')
                .where('g.id', game.id)
                .whereNull('cards.player_id');
            
            return suits[0].$extras;
        } catch (err) {
            throw err;
        }
    }

    public static async getUndealtCardsCount(gameUuid: string) {
        let game: Game;

        try {
            game = await this.findOrFail(gameUuid);
        } catch (err) {
            throw resourceNotFound();
        }

        try {
            return await Database
                .from('cards AS c')
                .select([
                    'c.face',
                    'c.suit',
                    'c.face_value',
                    Database.raw(`(
                        SELECT 
                            COUNT(*)
                        FROM cards
                        WHERE cards.suit = c.suit
                            AND cards.face = c.face
                            AND cards.player_id IS NULL
                    ) AS remaining`),
                ])
                .innerJoin('decks AS dk', 'dk.id', 'c.deck_id')
                .innerJoin('games AS g', 'g.id', 'dk.game_id')
                .where('g.id', game.id)
                .groupBy('c.face')
                .groupBy('c.suit')
                .orderByRaw(`
                    CASE c.suit
                        WHEN 'Hearts'   THEN 1
                        WHEN 'Spades'   THEN 2
                        WHEN 'Clubs'    THEN 3
                        WHEN 'Diamonds' THEN 4
                    END
                `)
                .orderBy('c.face_value', 'desc');
        } catch (err) {
            throw err;
        }
    }

    public static async shuffle(gameUuid: string) {
        let game: Game;

        try {
            game = await this.findOrFail(gameUuid);
        } catch (err) {
            throw resourceNotFound();
        }

        const cards: Card[] = await Card
            .query()
            .select(['cards.*'])
            .innerJoin('decks AS dk', 'dk.id', 'cards.deck_id')
            .innerJoin('games AS g', 'g.id', 'dk.game_id')
            .where('g.id', game.id)
            .whereNull('cards.player_id');

        if (cards.length === 0)
            throw resourceNotFound();

        const maxIndex = cards.length - 1;

        try {
            await Database.transaction(async trx => {
                for (const card of cards) {
                    const randomNumber = Math.floor(Math.random() * (maxIndex + 1));
                    const card2 = cards[randomNumber];
    
                    const aux = card.index;
                    card.index = card2.index;
                    card2.index = aux;
                    
                    card.useTransaction(trx);
                    card2.useTransaction(trx);
    
                    await card.save();
                    await card2.save();
                }
            });
        } catch (err) {
            throw err;
        }
    }
}
