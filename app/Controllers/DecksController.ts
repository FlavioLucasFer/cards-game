import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Logger from '@ioc:Adonis/Core/Logger';
import DeckService from 'App/Services/DecksService';
import DealCardValidator from 'App/Validators/DealCardValidator';

export default class DecksController {
  public async store({ response }: HttpContextContract) {
    try {
      return response.created(
        await DeckService.create(),
      );
    } catch (err) {
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
    
    const { 
      deck_id: deckId,
      player_id: playerId,
    } = params;
    const { quantity } = request.only(['quantity']);

    try {
      return response.ok(
        await DeckService.dealCards(deckId, playerId, quantity || 1),
      );
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

  public async destroy({}: HttpContextContract) {}
}
