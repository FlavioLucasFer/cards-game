import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Logger from '@ioc:Adonis/Core/Logger';
import GamesService from 'App/Services/GamesService';
import AddPlayerValidator from 'App/Validators/AddPlayerValidator';

export default class PlayersController {
  public async index({ params, response }: HttpContextContract) {
    const { game_id: gameId } = params;

    try {
      return await GamesService.allPlayers(gameId);
    } catch (err) {
      if (err?.type) {
        if (err.type === 'RESOURCE_NOT_FOUND')
          return response.noContent();
      }

      Logger.error(err);
      return response.internalServerError();
    }
  }

  public async store({ request, params, response }: HttpContextContract) {
    try {
      await request.validate(AddPlayerValidator);
    } catch (err: any) {
      return response.badRequest(err.messages.errors);
    }

    const { game_id: gameId } = params;
    const { nickname }= request.only(['nickname']);

    try {
      return response.created(
        await GamesService.addPlayer(gameId, nickname),
      );
    } catch (err) {
      if (err?.type) {
        if (err.type === 'RESOURCE_NOT_FOUND')
          return response.noContent();
      }

      Logger.error(err);
      return response.internalServerError();
    }
  }

  public async destroy({ params, response }: HttpContextContract) {
    const { 
      game_id: gameId, 
      id,
    } = params;
    
    try {
      return await GamesService.removePlayer(gameId, id);
    } catch (err) {
      if (err?.type) {
        if (err.type === 'RESOURCE_NOT_FOUND')
          return response.noContent();
        else if (err.type === 'RESOURCE_NOT_BELONGS_TO')
          return response.badRequest(err);
      }

      Logger.error(err);
      return response.internalServerError();
    }
  }
}
