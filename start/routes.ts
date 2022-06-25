import Route from '@ioc:Adonis/Core/Route'

Route
  .group(() => {
    Route
      .group(() => {
        Route.get('/', async () => {
          return 'running';
        })
        
        Route
          .resource('/games', 'GamesController')
          .paramFor('games', 'uuid')
          .where('uuid', Route.matchers.uuid())
          .apiOnly()
          .except(['update']);

        Route
          .resource('/decks', 'DecksController')
          .where('id', Route.matchers.number())
          .apiOnly()
          .only(['store']);
          
        Route
          .resource('games.players', 'PlayersController')
          .paramFor('games', 'game_uuid')
          .where('game_uuid', Route.matchers.uuid())
          .where('id', Route.matchers.number())
          .apiOnly()
          .except(['update']);
        
        Route
          .post('/games/:game_uuid/decks', 'GamesController.addDeck')
          .where('game_uuid', Route.matchers.uuid());
          
        Route
          .post('/games/:game_uuid/deal-cards', 'GamesController.dealCards')
          .where('game_uuid', Route.matchers.uuid());

        Route
          .get('/games/:game_uuid/undealt-suits', 'GamesController.getUndealtSuitsCount')
          .where('game_uuid', Route.matchers.uuid());
        
        Route
          .get('/games/:game_uuid/undealt-cards', 'GamesController.getUndealtCardsCount')
          .where('game_uuid', Route.matchers.uuid());
        
        Route
          .post('/games/:game_uuid/shuffle', 'GamesController.shuffle')
          .where('game_uuid', Route.matchers.uuid());

        Route
          .get('/players/:id/cards', 'PlayersController.getCards')
          .where('id', Route.matchers.number());
      })
      .prefix('v1');
  })
  .prefix('/api');
