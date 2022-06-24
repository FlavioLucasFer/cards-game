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
          .post('/games/:id/decks', 'GamesController.addDeck')
          .where('id', Route.matchers.number());

        Route
          .resource('games.players', 'PlayersController')
          .where('game_id', Route.matchers.number())
          .where('id', Route.matchers.number())
          .apiOnly();
        
        Route
          .resource('/decks', 'DecksController')
          .where('id', Route.matchers.number())
          .apiOnly();
      })
      .prefix('v1');
  })
  .prefix('/api');
