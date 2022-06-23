import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export type ID = number;

export default class Deck extends BaseModel {
  @column({ isPrimary: true })
  readonly id: number

  @column.dateTime({ autoCreate: true })
  readonly createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  readonly updatedAt: DateTime
}
