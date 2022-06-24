import { resourceNotFound } from "App/Helpers/expection";
import Card from "App/Models/Card";
import Player, { ID as PLAYER_ID } from "App/Models/Player";

export default class PlayerService {
    static async getCards(playerId: PLAYER_ID): Promise<Card[]> {
        let player: Player;

        try {
            player = await Player.findOrFail(playerId);
        } catch (err) {
            throw resourceNotFound();
        }

        return player
            .related('cards')
            .query();
    }
}
