import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator';
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

export default class DealCardValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    player_id: schema.number(),
    quantity: schema.number.optional([
      rules.unsigned(),
    ]),
  });

  public messages: CustomMessages = {
    required: 'The {{ field }} is required to deal cards',
    number: 'The {{ field }} must be of type number',
  };
}
