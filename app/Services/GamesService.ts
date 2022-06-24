import Game, { ID as GAME_ID } from 'App/Models/Game';
import Deck from 'App/Models/Deck';
import { resourceAlreadyInUse, resourceNotFound, resourceNotBelongsTo } from 'App/Helpers/expection';
import Player, { ID as PLAYER_ID } from 'App/Models/Player';

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
    
    public static async delete(id: GAME_ID): Promise<boolean> {
        const game = await Game.find(id);

        if (!game)
            return false;

        try {
            await game.delete();
            return true;
        } catch (err) {
            throw err;
        }
    }

    public static addDeck(game: Game, deck: Deck): Promise<Deck> {
        if (deck.gameId)
            throw resourceAlreadyInUse('Deck already in a game deck');

        deck.gameId = game.id;

        return deck.save();
    }

    public static async allPlayers(gameId: GAME_ID): Promise<Player[]> {
        try {
            return (
                    await Game.findOrFail(gameId)
                )
                .related('players')
                .query();
        } catch (err) {
            throw resourceNotFound();
        }
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
}
