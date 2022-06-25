import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Logger from '@ioc:Adonis/Core/Logger';
import GamesService from 'App/Services/GamesService';
import PlayerService from 'App/Services/PlayerService';
import AddPlayerValidator from 'App/Validators/AddPlayerValidator';

export default class PlayersController {
  public async index({ params, response }: HttpContextContract) {
    const { game_uuid: gameUuid } = params;

    try {
      return await GamesService.allPlayers(gameUuid);
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

    const { game_uuid: gameUuid } = params;
    const { nickname }= request.only(['nickname']);

    try {
      return response.created(
        await GamesService.addPlayer(gameUuid, nickname),
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
      game_uuid: gameUuid, 
      id,
    } = params;
    
    try {
      return await GamesService.removePlayer(gameUuid, id);
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

  public async getCards({ params, response }: HttpContextContract) {
    const { id } = params;

    try {
      return await PlayerService.getCards(id);
    } catch (err) {
      if (err?.type) {
        if (err.type === 'RESOURCE_NOT_FOUND')
          return response.noContent();
      }

      Logger.error(err);
      return response.internalServerError();
    }
  }
}
