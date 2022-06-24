import Database from '@ioc:Adonis/Lucid/Database';
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
		
		try {
			await Database.transaction(async trx => {
				deck.useTransaction(trx);

				await deck.save();

				await deck
					.related('cards')
					.createMany(this.generateDeckCards(deck.id));
			});
		} catch (err) {
			throw err;
		}

		return Deck
			.query()
			.preload('cards', query => {
				query.orderBy('index');
			})
			.where('id', deck.id)
			.firstOrFail();
	}

	private static generateDeckCards(deckId: ID) {
		const cards: CreateCard[] = [];
		const faces = Object.keys(CardFace).filter(key => !isNaN(Number(CardFace[key])));
		const suits = Object.keys(CardSuit).filter(key => !isNaN(Number(CardSuit[key])));
		let index = 0;
		
		
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
