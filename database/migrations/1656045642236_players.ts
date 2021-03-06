import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class extends BaseSchema {
  protected tableName = 'players';

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table
        .increments('id')
        .unsigned();
      table
        .integer('game_id')
        .unsigned()
        .notNullable();
      table
        .string('nickname', 100)
        .notNullable();
      table.timestamps();

      table
        .foreign('game_id')
        .references('games.id')
        .onDelete('CASCADE');
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName);
  }
}
