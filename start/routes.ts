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
          .where('id', Route.matchers.number())
          .apiOnly();

        Route
          .resource('/decks', 'DecksController')
          .where('id', Route.matchers.number())
          .apiOnly();
          
        Route
          .resource('games.players', 'PlayersController')
          .where('game_id', Route.matchers.number())
          .where('id', Route.matchers.number())
          .apiOnly();
        
        Route
          .post('/games/:game_id/decks', 'GamesController.addDeck')
          .where('game_id', Route.matchers.number());
          
        Route
          .post('/games/:game_id/deal-cards', 'GamesController.dealCards')
          .where('game_id', Route.matchers.number());

        Route
          .get('/games/:game_id/undealt-suits', 'GamesController.getUndealtSuitsCount')
          .where('game_id', Route.matchers.number());
        
        Route
          .get('/games/:game_id/undealt-cards', 'GamesController.getUndealtCardsCount')
          .where('game_id', Route.matchers.number());
        
        Route
          .post('/games/:game_id/shuffle', 'GamesController.shuffle')
          .where('game_id', Route.matchers.number());

        Route
          .get('/players/:id/cards', 'PlayersController.getCards')
          .where('id', Route.matchers.number());
      })
      .prefix('v1');
  })
  .prefix('/api');
