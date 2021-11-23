import Ajv, { DefinedError, JSONSchemaType, ValidateFunction } from 'ajv';

import { Group } from '../models/group';

type GroupJson = Omit<Group, 'id' | 'users'>;

export class GroupValidator {
  private schema: JSONSchemaType<GroupJson> = {
    type: 'object',
    properties: {
      name: { type: 'string', minLength: 4 },
      permissions: {
        type: 'array',
        items: {
          type: 'string',
          enum: ['READ', 'WRITE', 'DETETE', 'SHARE', 'UPLOAD_FILES'],
        },
      },
    },
    required: ['name', 'permissions'],
    additionalProperties: true,
  };

  private groupValidator: ValidateFunction<GroupJson>;

  constructor() {
    const ajv = new Ajv();
    this.groupValidator = ajv.compile(this.schema);
  }

  validate(group: { [key: string]: string | number }): boolean {
    return this.groupValidator(group);
  }

  getValidationMessage(): string {
    const messages: string[] = [];
    for (const err of this.groupValidator.errors as DefinedError[]) {
      switch (err.keyword) {
        case 'required':
          messages.push(`${err.message}`);
          break;
        case 'type':
        case 'minLength':
          messages.push(`Property ${err.instancePath} ${err.message}`);
          break;
        default:
          messages.push('Unknown input error.');
      }
    }
    return messages.join('\n');
  }
}
