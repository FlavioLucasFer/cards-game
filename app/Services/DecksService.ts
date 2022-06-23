import Deck from "App/Models/Deck";

export default class DeckService {
	public static async create(): Promise<Deck> {
		const deck = new Deck();
		return deck.save();
	}
}
