import Database from '@ioc:Adonis/Lucid/Database';
import { test } from '@japa/runner';
import Game from 'App/Models/Game';

test.group('Games resource', group => {  
  group.each.setup(async () => {
    await Database.beginGlobalTransaction();
    return () => Database.rollbackGlobalTransaction();
  });

  test('should return a 201 status', async ({ client }) => {
    const res = await client.post('/games');

    res.assertStatus(201);
  });

  test('should return the created game', async ({ client }) => {
    const res = await client.post('/games');
    const resBody: Game = res.body();
    const game = await Game.find(resBody.id);
    
    res.assert?.isNotNull(game);
  });
});
