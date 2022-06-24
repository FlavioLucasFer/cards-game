import { DateTime } from 'luxon';
import { 
  BaseModel, 
  beforeUpdate, 
  BelongsTo, 
  belongsTo, 
  column, 
  HasMany, 
  hasMany, 
} from '@ioc:Adonis/Lucid/Orm';
import type { ID as GAME_ID } from './Game';
import Game from './Game';
import Card from './Card';

export type ID = number;

export default class Deck extends BaseModel {
  @column({ isPrimary: true })
  readonly id: number;

  @column()
  public gameId: GAME_ID | null;

  @column.dateTime({ autoCreate: true })
  readonly createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  readonly updatedAt: DateTime;

  @belongsTo(() => Game)
  public game: BelongsTo<typeof Game>;

  @hasMany(() => Card)
  public cards: HasMany<typeof Card>;

  @beforeUpdate()
  protected static async setGameId(deck: Deck) {
    const dirtyGameId = deck.$dirty.gameId;
    const originalGameId = deck.$original.gameId;

    if (!dirtyGameId || originalGameId) {
      deck.gameId = originalGameId;
      return;
    }
    
    const game = await Game.find(dirtyGameId);

    if (!game) {
      deck.gameId = originalGameId;
      return;
    }
  } 
}
