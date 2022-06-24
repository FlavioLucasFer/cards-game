import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import Deck, { ID as DECK_ID } from './Deck';

export enum CardFace {
  King = 13,
  Queen = 12,
  Jack = 11,
  Ten = 10,
  Nine = 9,
  Eight = 8,
  Seven = 7,
  Six = 6,
  Five = 5,
  Four = 4,
  Three = 3,
  Two = 2,
  A = 1,
};

export enum CardSuit {
  Hearts = 1,
  Spades = 2,
  Clubs = 3,
  Diamonds = 4,
};

export default class Card extends BaseModel {
  @column({ isPrimary: true })
  readonly id: number;

  @column()
  public deckId: DECK_ID;

  @column()
  public face: string;

  @column()
  public suit: string;

  @column()
  public index: number;

  @column.dateTime({ autoCreate: true })
  readonly createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  readonly updatedAt: DateTime;

  @belongsTo(() => Deck)
  public deck: BelongsTo<typeof Deck>;
}
