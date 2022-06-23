import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Logger from '@ioc:Adonis/Core/Logger';
import DeckService from 'App/Services/DecksService';

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

  public async destroy({}: HttpContextContract) {}
}
