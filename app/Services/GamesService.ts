import Game from "App/Models/Game";

export default class GamesService {
    public static create(): Promise<Game> {
        const game = new Game();
        return game.save();
    }
}
