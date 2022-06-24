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
          .where('id', Route.matchers.number());

        Route
          .group(() => {
            Route
              .post('/:id/decks', 'GamesController.addDeck');
          })
          .prefix('/games')
          .where('id', Route.matchers.number());
        
        Route
          .resource('/decks', 'DecksController')
          .where('id', Route.matchers.number());
      })
      .prefix('v1');
  })
  .prefix('/api');
