import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Logger from '@ioc:Adonis/Core/Logger';
import GamesService from 'App/Services/GamesService';
import AddDeckValidator from 'App/Validators/AddDeckValidator';

export default class GamesController {
  public async index({ response }: HttpContextContract) {
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

  public async store({ response }: HttpContextContract) {
    try {
      return response.created(
        await GamesService.create(),
      );
    } catch (err) {
      Logger.error(err);
      return response.internalServerError();
    }
  }

  public async destroy({ params, response }: HttpContextContract) {
    const { id } = params;

    try {
      await GamesService.delete(id);
      return response.status(200);
    } catch (err) {
      if (err?.type) {
        if (err.type === 'RESOURCE_NOT_FOUND')
          return response.noContent();
      }

      Logger.error(err);
      return response.internalServerError();
    }
  }

  public async addDeck({ request, params, response }: HttpContextContract) {
    try {
      await request.validate(AddDeckValidator);
    } catch (err: any) {
      return response.badRequest(err.messages.errors);
    }

    const { game_id: gameId } = params;
    const { deck_id: deckId } = request.only(['deck_id']);

    try {
      return await GamesService.addDeck(gameId, deckId);
    } catch (err: any) {
      if (err?.type) {
        if (err.type === 'RESOURCE_NOT_FOUND')
          return response.noContent();
        else if (err.type === 'RESOURCE_ALREADY_IN_USE')
          return response.badRequest(err);
      }

      Logger.error(err);
      return response.internalServerError();
    }
  }
}
