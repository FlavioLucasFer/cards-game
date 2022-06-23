import { DateTime } from 'luxon';
import { BaseModel, beforeCreate, column } from '@ioc:Adonis/Lucid/Orm';
import { v4 as uuidv4 } from 'uuid';

export type ID = number;
export type UUID = string;

export default class Game extends BaseModel {
  @column({ isPrimary: true })
  readonly id: ID;

  @column({ columnName: 'uuid' })
  private _uuid: UUID;

  @column.dateTime({ autoCreate: true })
  readonly createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  readonly updatedAt: DateTime;

  public get uuid (): string {
    return this._uuid;
  };

  @beforeCreate()
  protected static generateUuid(game: Game) {
    game._uuid = uuidv4();
  }
}
