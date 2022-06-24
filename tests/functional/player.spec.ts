import TestUtils from '@ioc:Adonis/Core/TestUtils';
import Database from '@ioc:Adonis/Lucid/Database';
import { test } from '@japa/runner';
import Player from 'App/Models/Player';

const { group } = test;

const RESOURCE_ROUTE = 'api/v1/games';

group('endpoint to get all the players from a game', group => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction();
    return () => Database.rollbackGlobalTransaction();
  });

  test('should return a 200 status and return an array of players', async ({ client, assert }) => {
    await TestUtils.db().seed();
    const res = await client.get(`${RESOURCE_ROUTE}/1/players`);
    const body: Player[] = res.body();

    res.assertStatus(200);
    assert.isArray(body);
  });

  test('should return a 204 status', async ({ client }) => {
    await TestUtils.db().seed();
    const res = await client.get(`${RESOURCE_ROUTE}/23/players`);

    res.assertStatus(204);
  });
});

group('endpoint to add a player to a game', group => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction();
    return () => Database.rollbackGlobalTransaction();
  });

  test('should return a 201 status', async ({ client }) => {
    await TestUtils.db().seed();
    const res = await client
      .post(`${RESOURCE_ROUTE}/1/players`)
      .json({
        nickname: 'test player',
      });

    res.assertStatus(201);
  });

  test('should return a 204 status', async ({ client }) => {
    await TestUtils.db().seed();
    const res = await client
      .post(`${RESOURCE_ROUTE}/12/players`)
      .json({
        nickname: 'test player',
      });

    res.assertStatus(204);
  });

  test('should return a 400 status and an array of errors', async ({ client }) => {
    await TestUtils.db().seed();
    const res = await client
      .post(`${RESOURCE_ROUTE}/1/players`);

    res.assertStatus(400);
    res.assertBodyContains([{}]);
  });
});

group('endpoint to remove a player from a game', group => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction();
    return () => Database.rollbackGlobalTransaction();
  });

  test('should return a 200 status', async ({ client }) => {
    await TestUtils.db().seed();
    await client
      .post(`${RESOURCE_ROUTE}/1/players`)
      .json({
        nickname: 'test player',
      });
    const res = await client.delete(`${RESOURCE_ROUTE}/1/players/1`);

    res.assertStatus(200);
  });

  test('should return a 204 status', async ({ client }) => {
    await TestUtils.db().seed();
    const res = await client.delete(`${RESOURCE_ROUTE}/1/players/13`);
    const res2 = await client.delete(`${RESOURCE_ROUTE}/13/players/1`);

    res.assertStatus(204);
    res2.assertStatus(204);
  });

  test('should return a 400 status and RESOURCE_NOT_BELONGS_TO error', async ({ client }) => {
    await TestUtils.db().seed();
    await client
      .post(`${RESOURCE_ROUTE}/1/players`)
      .json({
        nickname: 'test player',
      });
    const res = await client.delete(`${RESOURCE_ROUTE}/2/players/1`);

    res.assertStatus(400);
    res.assertBody({
      type: 'RESOURCE_NOT_BELONGS_TO',
      message: 'The given player not belongs to the given game',
    });
  });
});