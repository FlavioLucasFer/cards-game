import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class extends BaseSchema {
  protected tableName = 'decks';

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .integer('game_id')
        .unsigned()
        .nullable();
      table
        .foreign('game_id')
        .references('games.id')
        .onDelete('CASCADE');
    })
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign('game_id');
      table.dropColumn('game_id');
    })
  }
}
