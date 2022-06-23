import Game, { ID } from "App/Models/Game";

export default class GamesService {
    public static all(): Promise<Game[]> {
        return Game.all();
    }

    public static create(): Promise<Game> {
        const game = new Game();
        return game.save();
    }
    
    public static async delete(id: ID): Promise<boolean> {
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
}
