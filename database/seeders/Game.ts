import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Game from 'App/Models/Game'

export default class GameSeeder extends BaseSeeder {
  public async run () {
    for (let i = 1; i <= 10; i++) {
      const game = new Game();
      await game.save();
    }
  }
}
