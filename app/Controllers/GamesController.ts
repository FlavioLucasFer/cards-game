import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Logger from '@ioc:Adonis/Core/Logger';
import GamesService from 'App/Services/GamesService';

export default class GamesController {
  public async index({response}: HttpContextContract) {
    try {
      const games = await GamesService.all();

      if (games.length == 0)
        return response.noContent();
      
      return games;
    } catch (err) {
      Logger.error(err);
      return response.internalServerError();
    }
  }

  public async store({response}: HttpContextContract) {
    try {
      return response.created(
        await GamesService.create(),
      );
    } catch (err) {
      Logger.error(err);
      return response.internalServerError();
    }
  }

  public async destroy({}: HttpContextContract) {}
}
