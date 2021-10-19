import Ajv, { DefinedError, JSONSchemaType, ValidateFunction } from 'ajv';

export interface User {
  id: string;
  login: string;
  password: string;
  age: number;
  isDeleted: boolean;
}

export type UserJson = Omit<User, 'id' | 'isDeleted'>;

const ajv = new Ajv();
const userSchema: JSONSchemaType<UserJson> = {
  type: 'object',
  properties: {
    login: { type: 'string', minLength: 4 },
    password: { type: 'string', minLength: 8, pattern: '^[a-zA-Z0-9]+' },
    age: { type: 'integer', minimum: 4, maximum: 130 },
  },
  required: ['login', 'password', 'age'],
  additionalProperties: true,
};

export const getValidationMessage = (
  errors: any
) => {
  if (errors) {
    for (const err of errors as DefinedError[]) {
      console.log(err);
    }
  }
  return 'unknown validation message';
};

export const userValidator: ValidateFunction<UserJson> =
  ajv.compile(userSchema);
