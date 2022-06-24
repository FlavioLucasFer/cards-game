import { CardFace, CardSuit } from 'App/Models/Card';
import Deck, { ID } from 'App/Models/Deck';

type CreateCard = {
	deckId: ID,
	face: string,
	suit: string,
	index: number,
};

export default class DeckService {
	public static async find(id: ID): Promise<Deck|null> {
		return Deck.find(id);
	}

	public static async create(): Promise<Deck> {
		const deck = new Deck();
		return await deck.save();
	}

	public static generateDeckCards(deckId: ID, startIndex: number) {
		const cards: CreateCard[] = [];
		const faces = Object.keys(CardFace).filter(key => !isNaN(Number(CardFace[key])));
		const suits = Object.keys(CardSuit).filter(key => !isNaN(Number(CardSuit[key])));
		let index = startIndex;
		
		faces.forEach(async face => {
			suits.forEach(async suit => {
				cards.push({
					deckId,
					face,
					suit,
					index,
				});
				index++;
			});
		});

		return cards;
	}
}
