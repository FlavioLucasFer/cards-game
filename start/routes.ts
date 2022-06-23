import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return 'running';
})

Route.resource('/games', 'GamesController');
