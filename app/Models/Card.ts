import { DateTime } from 'luxon'
import { 
  BaseModel, 
  belongsTo, 
  column, 
  BelongsTo, 
  hasOne, 
  HasOne, 
  computed, 
  beforeUpdate, 
  beforeCreate, 
} from '@ioc:Adonis/Lucid/Orm'
import Deck, { ID as DECK_ID } from './Deck';
import Player, { ID as PLAYER_ID } from './Player';

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
  public playerId: PLAYER_ID | null;

  @column()
  public face: string;

  @column()
  public face_value: number;

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

  @hasOne(() => Player)
  public player: HasOne<typeof Player>;

  @computed()
  public get dealt(): boolean {
    return this.playerId !== null;
  }

  @beforeCreate()
  @beforeUpdate()
  protected static async setFaceValue(card: Card) {
    if (!card.face_value)
      card.face_value = CardFace[card.face];
  }
}
