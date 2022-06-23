import Game from "App/Models/Game";

export default class GamesService {
    public static all(): Promise<Game[]> {
        return Game.all();
    }

    public static create(): Promise<Game> {
        const game = new Game();
        return game.save();
    }
}
