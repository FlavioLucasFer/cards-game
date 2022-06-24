import Database from '@ioc:Adonis/Lucid/Database';
import { test } from '@japa/runner';
import Card from 'App/Models/Card';
import Deck from 'App/Models/Deck';

const { group } = test;

const RESOURCE_ROUTE = 'api/v1/decks';

group('endpoint to create a deck', group => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction();
    return () => Database.rollbackGlobalTransaction();
  });

  test('should return a 201 status', async ({ client }) => {
    const res = await client.post(RESOURCE_ROUTE);

    res.assertStatus(201);
  });

  test('should return the created deck', async ({ client, assert }) => {
    const res = await client.post(RESOURCE_ROUTE);
    const resBody: Deck = res.body();
    const deck = await Deck.find(resBody.id);

    assert.isNotNull(deck);
  });
  
  test('should persist 52 different cards to the created deck', async ({ client, assert }) => {
    const res = await client.post(RESOURCE_ROUTE);
    const { cards }: { cards: Card[] } = res.body();
    
    assert.isArray(cards);
    assert.lengthOf(cards, 52);

    const check: Card[] = [cards[0]];

    for (let i = 1; i < 52; i++) {
      assert.isFalse(check.includes(cards[i]));
      check.push(cards[i]);
    }
  });
});
