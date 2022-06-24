import Game, { ID as GAME_ID } from 'App/Models/Game';
import Deck from 'App/Models/Deck';
import { resourceAlreadyInUse } from 'App/Helpers/expection';

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

    public static async addDeck(game: Game, deck: Deck): Promise<{
        game: Game,
        deck: Deck,
    }> {
        if (deck.gameId)
            throw resourceAlreadyInUse('Deck already in a game deck');

        deck.gameId = game.id;
        await deck.save();
        
        return {
            game,
            deck,
        };
    }
}
