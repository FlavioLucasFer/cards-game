import TestUtils from '@ioc:Adonis/Core/TestUtils';
import Database from '@ioc:Adonis/Lucid/Database';
import { test } from '@japa/runner';
import Game from 'App/Models/Game';

const { group } = test;

group('endpoint to list all created games', group => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction();
    return () => Database.rollbackGlobalTransaction();
  });

  test('should return a 200 status', async ({ client }) => {
    await TestUtils.db().seed();
    const res = await client.get('/games');

    res.assertStatus(200);
  });

  test('should return a 204 status', async ({ client }) => {
    const res = await client.get('/games');

    res.assertStatus(204);
  });

  test('should return an array of games containing 10 games', async ({ client, assert }) => {
    await TestUtils.db().seed();
    const res = await client.get('/games');
    const resBody: Game[] = res.body();

    assert.lengthOf(resBody, 10);
  });
});

group('endpoint to create a game', group => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction();
    return () => Database.rollbackGlobalTransaction();
  });

  test('should return a 201 status', async ({ client }) => {
    const res = await client.post('/games');

    res.assertStatus(201);
  });

  test('should return the created game', async ({ client, assert }) => {
    const res = await client.post('/games');
    const resBody: Game = res.body();
    const game = await Game.find(resBody.id);

    assert.isNotNull(game);
  });
});
