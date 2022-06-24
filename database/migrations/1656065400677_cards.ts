import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class extends BaseSchema {
  protected tableName = 'cards';

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .integer('player_id')
        .unsigned()
        .nullable();

      table
        .foreign('player_id')
        .references('players.id')
    });
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign('player_id');
      table.dropColumn('player_id');
    });
  }
}
