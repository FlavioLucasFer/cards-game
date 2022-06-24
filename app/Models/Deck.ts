import { DateTime } from 'luxon';
import { BaseModel, beforeUpdate, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm';
import type { ID as GAME_ID } from './Game';
import Game from './Game';

export type ID = number;

export default class Deck extends BaseModel {
  @column({ isPrimary: true })
  readonly id: number;

  @column({ columnName: 'game_id' })
  private _gameId: GAME_ID | null;

  @column.dateTime({ autoCreate: true })
  readonly createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  readonly updatedAt: DateTime;

  @belongsTo(() => Game)
  public game: BelongsTo<typeof Game>;

  public get gameId(): GAME_ID | null {
    return this._gameId;
  }

  public set gameId(gameId: GAME_ID | null) {
    this._gameId = gameId;
  }

  @beforeUpdate()
  protected static async setGameId(deck: Deck) {
    const dirtyGameId = deck.$dirty._gameId;
    const originalGameId = deck.$original._gameId;

    if (!dirtyGameId && originalGameId != null) {
      deck._gameId = originalGameId;
      return;
    }
    
    const game = await Game.find(dirtyGameId);

    if (!game) {
      deck._gameId = originalGameId;
      return;
    }
  } 
}
