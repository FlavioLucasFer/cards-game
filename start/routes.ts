import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.group(() => {
    Route.get('/', async () => {
      return 'running';
    })
    
    Route
      .resource('/games', 'GamesController')
      .where('id', {
        match: /^[1-9]+$/,
        cast: id => Number(id),
      });
    
    Route
      .resource('/decks', 'DecksController')
      .where('id', {
        match: /^[1-9]+$/,
        cast: id => Number(id),
      });
  })
  .prefix('v1');
})
.prefix('/api');
