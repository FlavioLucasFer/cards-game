import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator';
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

export default class AddDeckValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    deck_id: schema.number(),
  })

  public messages: CustomMessages = {
    required: 'The {{ field }} is required to add a deck',
    number: 'The {{ field }} must be of type number',
  }
}
