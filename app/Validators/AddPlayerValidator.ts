import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator';
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

export default class AddPlayerValidator {
  constructor(protected ctx: HttpContextContract) {}
  
  public schema = schema.create({
    nickname: schema.string({
      trim: true,
    }, [
      rules.maxLength(100),
      rules.minLength(1),
    ]),
  });

  public messages: CustomMessages = {
    required: 'The {{ field }} is required to add a player',
    number: 'The {{ field }} must be of type number',
  };
}
