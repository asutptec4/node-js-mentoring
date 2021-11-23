import Ajv, { DefinedError, JSONSchemaType, ValidateFunction } from 'ajv';

import { User } from '../models/user';

type UserJson = Omit<User, 'id' | 'isDeleted' | 'groups'>;

export class UserValidator {
  private userSchema: JSONSchemaType<UserJson> = {
    type: 'object',
    properties: {
      login: { type: 'string', minLength: 4 },
      password: {
        type: 'string',
        minLength: 8,
        pattern: '^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)',
      },
      age: { type: 'integer', minimum: 4, maximum: 130 },
    },
    required: ['login', 'password', 'age'],
    additionalProperties: true,
  };

  private userValidator: ValidateFunction<UserJson>;

  constructor() {
    const ajv = new Ajv();
    this.userValidator = ajv.compile(this.userSchema);
  }

  validate(user: { [key: string]: string | number }): boolean {
    return this.userValidator(user);
  }

  getValidationMessage(): string {
    const messages: string[] = [];
    for (const err of this.userValidator.errors as DefinedError[]) {
      switch (err.keyword) {
        case 'required':
          messages.push(`${err.message}`);
          break;
        case 'type':
        case 'minLength':
        case 'minimum':
        case 'maximum':
        case 'pattern':
          messages.push(`Property ${err.instancePath} ${err.message}`);
          break;
        default:
          messages.push('Unknown input error.');
      }
    }
    return messages.join('\n');
  }
}
