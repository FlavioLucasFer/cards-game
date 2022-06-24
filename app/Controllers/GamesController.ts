import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Logger from '@ioc:Adonis/Core/Logger';
import DeckService from 'App/Services/DecksService';
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
      const success = await GamesService.delete(id);

      if (!success)
        return response.noContent();
      
      return response.status(200);
    } catch (err) {
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

    const { id } = params;
    const { deck_id: deckId } = request.only(['deck_id']);

    try {
      const game = await GamesService.find(id);
      const deck = await DeckService.find(deckId);
      
      if (!game || !deck)
        return response.noContent();

      return await GamesService.addDeck(game, deck);
    } catch (err: any) {
      if (err?.type) {
        if (err.type === 'RESOURCE_ALREADY_IN_USE')
          return response.badRequest(err);
      }

      Logger.error(err);
      return response.internalServerError();
    }
  }
}
