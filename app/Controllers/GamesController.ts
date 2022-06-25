import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Logger from '@ioc:Adonis/Core/Logger';
import GamesService from 'App/Services/GamesService';
import AddDeckValidator from 'App/Validators/AddDeckValidator';
import DealCardValidator from 'App/Validators/DealCardValidator';

export default class GamesController {
  public async index({ response }: HttpContextContract) {
    try {
      return await GamesService.all();
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
    const { uuid } = params;

    try {
      await GamesService.delete(uuid);
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

    const { game_uuid: gameUuid } = params;
    const { deck_id: deckId } = request.only(['deck_id']);

    try {
      return await GamesService.addDeck(gameUuid, deckId);
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

  public async dealCards({ request, params, response }: HttpContextContract) {
    try {
      await request.validate(DealCardValidator);
    } catch (err: any) {
      return response.badRequest(err.messages.errors);
    }

    const { game_uuid: gameUuid } = params;
    const { 
      player_id: playerId,
      quantity,
    } = request.only(['player_id', 'quantity']);

    try {
      return await GamesService.dealCards(gameUuid, playerId, quantity || 1);
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

  public async getUndealtSuitsCount({ params, response }: HttpContextContract) {
    const { game_uuid: gameUuid } = params;

    try {
      return await GamesService.getUndealtSuitsCount(gameUuid);
    } catch (err) {
      if (err?.type) {
        if (err.type === 'RESOURCE_NOT_FOUND')
          return response.noContent();
      }

      Logger.error(err);
      return response.internalServerError();
    }
  }

  public async getUndealtCardsCount({ params, response }: HttpContextContract) {
    const { game_uuid: gameUuid } = params;

    try {
      return await GamesService.getUndealtCardsCount(gameUuid);
    } catch (err) {
      if (err?.type) {
        if (err.type === 'RESOURCE_NOT_FOUND')
          return response.noContent();
      }

      Logger.error(err);
      return response.internalServerError();
    }
  }

  public async shuffle({ params, response }: HttpContextContract) {
    const { game_uuid: gameUuid } = params;

    try {
      return await GamesService.shuffle(gameUuid);
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
