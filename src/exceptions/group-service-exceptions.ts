export class GroupServiceException extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class GroupAlreadyExistException extends GroupServiceException {
  constructor(message) {
    super(`Group [${message}] already exist`);
    this.name = this.constructor.name;
  }
}

export class GroupNotExistException extends GroupServiceException {
  constructor(message) {
    super(`Group with id=[${message}] doesn't exist`);
    this.name = this.constructor.name;
  }
}

export class AssignGroupException extends GroupServiceException {
  constructor(message) {
    super(`Cannot assign to group with id=[${message}]`);
    this.name = this.constructor.name;
  }
}
