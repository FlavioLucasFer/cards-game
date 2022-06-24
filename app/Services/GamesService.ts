import { resourceAlreadyInUse, resourceNotFound, resourceNotBelongsTo } from 'App/Helpers/expection';
import Player, { ID as PLAYER_ID } from 'App/Models/Player';
import Game, { ID as GAME_ID } from 'App/Models/Game';
import Deck, { ID as DECK_ID } from 'App/Models/Deck';
import PlayerService from './PlayerService';
import Card, { CardFace } from 'App/Models/Card';
import Database from '@ioc:Adonis/Lucid/Database';
import DeckService from './DecksService';

export default class GamesService {
    public static all(): Promise<Game[]> {
        return Game.all();
    }

    public static async find(id: GAME_ID): Promise<Game|null> {
        return Game.find(id);
    }

    public static create(): Promise<Game> {
        const game = new Game();
        return game.save();
    }
    
    public static async delete(id: GAME_ID) {
        let game: Game;
        
        try {
            game = await Game.findOrFail(id);
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

    public static async addDeck(gameId: GAME_ID, deckId: DECK_ID): Promise<Deck> {
        let game: Game;
        let deck: Deck;
        
        try {
            game = await Game.findOrFail(gameId);
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

                deck.gameId = gameId;
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

    public static async allPlayers(gameId: GAME_ID) {
        let game: Game;

        try {
            game = await Game.findOrFail(gameId);
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
                
                mutated.hand_value = await cards
                    .map(card => CardFace[card.face])
                    .reduce((prev, next) => prev + next);
                    
                return mutated;
            })
            ,
        );

        mutatedPlayers.sort((a, b) => b.hand_value - a.hand_value);

        return mutatedPlayers;
    }

    public static async addPlayer(gameId: GAME_ID, nickname: string): Promise<Player> {
        try {
            await Game.findOrFail(gameId);
        } catch (err) {
            throw resourceNotFound();
        }
        
        const player = new Player();

        player.gameId = gameId;
        player.nickname = nickname;

        return player.save();
    }

    public static async removePlayer(gameId: GAME_ID, playerId: PLAYER_ID): Promise<void> {
        let game: Game;
        let player: Player;

        try {
            game = await Game.findOrFail(gameId);
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
        gameId: GAME_ID,
        playerId: PLAYER_ID,
        quantity: number = 1
    ): Promise<Card[]> {
        let game: Game;
        let player: Player;

        try {
            game = await Game.findOrFail(gameId);
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
                .where('g.id', gameId)
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

    public static async getUndealtSuitsCount(gameId: GAME_ID): Promise<Object> {
        let game: Game;

        try {
            game = await Game.findOrFail(gameId);
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
            .where('g.id', gameId)
            .whereNull('cards.player_id');
        
        return suits[0].$extras;
    }
}
