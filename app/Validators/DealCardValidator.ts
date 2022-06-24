import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator';
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

export default class DealCardValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    quantity: schema.number.optional([
      rules.range(1, 52),
    ]),
  });

  public messages: CustomMessages = {
    number: 'The {{ field }} must be of type number',
  };
}
