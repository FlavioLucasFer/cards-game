import TestUtils from '@ioc:Adonis/Core/TestUtils';
import Database from '@ioc:Adonis/Lucid/Database';
import { test } from '@japa/runner';
import Card from 'App/Models/Card';
import Game from 'App/Models/Game';
import DeckService from 'App/Services/DecksService';
import GamesService from 'App/Services/GamesService';

const { group } = test;

const RESOURCE_ROUTE = 'api/v1/games';

group('endpoint to get all created games', group => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction();
    return () => Database.rollbackGlobalTransaction();
  });

  test('should return a 200 status', async ({ client }) => {
    await TestUtils.db().seed();
    const res = await client.get(RESOURCE_ROUTE);

    res.assertStatus(200);
  });

  test('should return an array of games containing 10 games', async ({ client, assert }) => {
    await TestUtils.db().seed();
    const res = await client.get(RESOURCE_ROUTE);
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
    const res = await client.post(RESOURCE_ROUTE);

    res.assertStatus(201);
  });

  test('should return the created game', async ({ client, assert }) => {
    const res = await client.post(RESOURCE_ROUTE);
    const resBody: Game = res.body();
    const game = await Game.find(resBody.id);

    assert.isNotNull(game);
  });
});

group('endpoint to delete a game', group => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction();
    return () => Database.rollbackGlobalTransaction();
  });

  test('should delete the game from database and return 200 status', async ({ client, assert }) => {
    const newGame = await GamesService.create();
    const res = await client.delete(`${RESOURCE_ROUTE}/${newGame.uuid}`);

    const game: Game | null = await Game.find(3);

    assert.isNull(game);
    res.assertStatus(200);
  });
  
  test('should return a 204 status', async ({ client }) => {
    const res = await client.delete(`${RESOURCE_ROUTE}/8ab06991-e943-4a8d-9a5f-49aef124d04e`);

    res.assertStatus(204);
  });
});

group('endpoint to add a deck to a game deck', group => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction();
    return () => Database.rollbackGlobalTransaction();
  });

  test('should persist 52 different cards to the created deck', async ({ client, assert }) => {
    const deck = await DeckService.create();
    const game = await GamesService.create();

    const res = await client
      .post(`${RESOURCE_ROUTE}/${game.uuid}/decks`)
      .json({
        deck_id: deck.id,
      });
      
    const { cards }: { cards: Card[] } = res.body();

    assert.isArray(cards);
    assert.lengthOf(cards, 52);

    const check: Card[] = [cards[0]];

    for (let i = 1; i < 52; i++) {
      assert.isFalse(check.includes(cards[i]));
      check.push(cards[i]);
    }
  });
  
  test('should return a 204 status', async ({ client }) => {
    const game = await GamesService.create();
    const deck = await DeckService.create();

    const res = await client
      .post(`${RESOURCE_ROUTE}/8ab06991-e943-4a8d-9a5f-49aef124d04e/decks`)
      .json({
        deck_id: deck.id,
      });
    const res2 = await client
      .post(`${RESOURCE_ROUTE}/${game.uuid}/decks`)
      .json({
        deck_id: 12,
      });

    res.assertStatus(204);
    res2.assertStatus(204);
  });

  test('should return a 400 status and an array of errors', async ({ client }) => {
    const game = await GamesService.create();

    const res = await client
      .post(`${RESOURCE_ROUTE}/${game.uuid}/decks`);

    res.assertStatus(400);
    res.assertBodyContains([{}]);
  });

  test('should return a 400 status and RESOURCE_ALREADY_IN_USE error', async ({ client }) => {
    const game = await GamesService.create();
    const game2 = await GamesService.create();
    const deck = await DeckService.create();

    await client
      .post(`${RESOURCE_ROUTE}/${game.uuid}/decks`)
      .json({
        deck_id: deck.id,
      });
    const res = await client
      .post(`${RESOURCE_ROUTE}/${game2.uuid}/decks`)
      .json({
        deck_id: deck.id,
      });

    res.assertStatus(400);
    res.assertBody({
      type: 'RESOURCE_ALREADY_IN_USE',
      message: 'Deck already in a game deck',
    });
  });
});
