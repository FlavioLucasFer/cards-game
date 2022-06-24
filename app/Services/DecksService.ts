import Deck, { ID } from 'App/Models/Deck';

export default class DeckService {
	public static async find(id: ID): Promise<Deck|null> {
		return Deck.find(id);
	}

	public static async create(): Promise<Deck> {
		const deck = new Deck();
		return deck.save();
	}
}
