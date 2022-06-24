import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Deck from 'App/Models/Deck';

export default class extends BaseSeeder {
  public async run () {
    for (let i = 1; i <= 10; i++) {
      const deck = new Deck();
      await deck.save();
    }
  }
}
