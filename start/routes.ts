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
          .post('/decks/:deck_id/deal-cards/:player_id', 'DecksController.dealCards')
          .where('deck_id', Route.matchers.number())
          .where('player_id', Route.matchers.number());

        Route
          .get('/players/:id/cards', 'PlayersController.getCards')
          .where('id', Route.matchers.number());
      })
      .prefix('v1');
  })
  .prefix('/api');
