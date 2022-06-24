import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class extends BaseSchema {
  protected tableName = 'cards';

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .integer('index')
        .unsigned()
        .notNullable()
        .alter();
      table
        .tinyint('face_value', 13)
        .unsigned()
        .notNullable();
    })
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .tinyint('index', 52)
        .unsigned()
        .notNullable()
        .alter();
      table.dropColumn('face_value');
    })
  }
}
