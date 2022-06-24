import Database from '@ioc:Adonis/Lucid/Database';
import { resourceNotBelongsTo, resourceNotFound } from 'App/Helpers/expection';
import Card, { CardFace, CardSuit } from 'App/Models/Card';
import Deck, { ID } from 'App/Models/Deck';
import Player, { ID as PLAYER_ID } from 'App/Models/Player';

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

	public static async dealCards(
		deckId: ID, 
		playerId: PLAYER_ID, 
		quantity: number = 1
	): Promise<Card[]> {
		let deck: Deck;
		let player: Player;

		try {
			deck = await Deck.findOrFail(deckId);
			player = await Player.findOrFail(playerId);
		} catch (err) {
			throw resourceNotFound();
		}

		if (player.gameId !== deck.gameId)
			throw resourceNotBelongsTo('Player and deck must belongs to the same game');
		
		try {
			const cardsToDeal = await Card
				.query()
				.where('deck_id', deckId)
				.whereNull('player_id')
				.orderBy('index')
				.limit(quantity);

			await Database.transaction(async trx => {
				for (const card of cardsToDeal) {
					card.useTransaction(trx);
					card.playerId = playerId;
					await card.save();
				}
			});

			return cardsToDeal;
		} catch (err) {
			throw err;
		}
	}

	public static async getUndealtCardsCountBySuit(deckId: ID): Promise<Object> {
		let deck: Deck;

		try {
			deck = await Deck.findOrFail(deckId);
		} catch (err) {
			throw resourceNotFound();
		}

		
		const cards: Card[] = await deck
			.related('cards')
			.query();

		const suits = {
			hearts: 0,
			spades: 0,
			clubs: 0,
			diamonds: 0,
		}

		cards.forEach(card => {
			if (card.dealt)
				return;

			switch (card.suit) {
				case 'Hearts':
					suits.hearts++;
					break;
				case 'Spades':
					suits.spades++;
					break;
				case 'Clubs':
					suits.clubs++;
					break;
				case 'Diamonds':
					suits.diamonds++;
					break;
				default:
					break;
			}
		});

		return suits;
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
