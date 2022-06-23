import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class extends BaseSchema {
  protected tableName = 'games';

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table
        .increments('id')
        .unsigned();
      table
        .uuid('uuid')
        .unique()
        .notNullable();
      table.timestamps();
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName);
  }
}
