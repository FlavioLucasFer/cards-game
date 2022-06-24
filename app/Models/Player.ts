import { DateTime } from 'luxon';
import { BaseModel, BelongsTo, belongsTo, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm';
import Game, { ID as GAME_ID } from './Game';
import Card from './Card';

export type ID = number;

export default class Player extends BaseModel {
  @column({ isPrimary: true })
  readonly id: number;

  @column()
  public gameId: GAME_ID;

  @column()
  public nickname: string;

  @column.dateTime({ autoCreate: true })
  readonly createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  readonly updatedAt: DateTime;

  @belongsTo(() => Game)
  public game: BelongsTo<typeof Game>;

  @hasMany(() => Card)
  public cards: HasMany<typeof Card>;
}
