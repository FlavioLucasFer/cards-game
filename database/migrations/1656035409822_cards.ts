import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class extends BaseSchema {
  protected tableName = 'cards';

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table
        .increments('id')
        .unsigned();
      table
        .integer('deck_id')
        .unsigned()
        .nullable();
      table
        .string('face', 50)
        .notNullable();
      table
        .string('suit', 50)
        .notNullable();
      table
        .tinyint('index', 52)
        .unsigned()
        .notNullable()
      table.timestamps();
      
      table
        .foreign('deck_id')
        .references('decks.id')
        .onDelete('CASCADE');
      table.unique(['deck_id', 'face', 'suit']);
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
