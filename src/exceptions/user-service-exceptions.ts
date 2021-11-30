export class UserServiceException extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class UserAlreadyExistException extends UserServiceException {
  constructor(message) {
    super(`User [${message}] already exist`);
    this.name = this.constructor.name;
  }
}

export class UserNotExistException extends UserServiceException {
  constructor(message) {
    super(`User with id=[${message}] doesn't exist`);
    this.name = this.constructor.name;
  }
}
