import { NextFunction, Request, Response } from 'express';
import {
  UserAlreadyExistException,
  UserNotExistException,
} from '../exceptions';

import { UserService } from '../services/user-service';
import { AsyncDefaultErrorHandler } from './controller-utils';
import { UserValidator } from '../utils/user-validator';

export class UserController {
  private userService: UserService;
  private userValidator: UserValidator;

  constructor(service: UserService, validator: UserValidator) {
    this.userService = service;
    this.userValidator = validator;
  }

  @AsyncDefaultErrorHandler()
  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const { login, password, age } = req.body;
      const user = await this.userService.add({ login, password, age });
      res.json(user);
    } catch (e: unknown) {
      this.handleUserServiceError(e, res);
    }
  }

  @AsyncDefaultErrorHandler()
  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await this.userService.delete(id);
      res.status(204).end();
    } catch (e: unknown) {
      this.handleUserServiceError(e, res);
    }
  }

  @AsyncDefaultErrorHandler()
  async getAll(req: Request, res: Response): Promise<void> {
    res.json(await this.userService.getAll());
  }

  @AsyncDefaultErrorHandler()
  async getAutoSuggestUsers(req: Request, res: Response): Promise<void> {
    const { limit, loginSubstring } = req.query;
    if (limit && loginSubstring) {
      const users = await this.userService.getSuggestedUsers(
        loginSubstring.toString(),
        Number.parseInt(limit as string)
      );
      res.json(users);
    } else {
      this.sendError(res, 400, 'Bad query params');
    }
  }

  @AsyncDefaultErrorHandler()
  async getUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = await this.userService.findById(id);
      res.json(user);
    } catch (e: unknown) {
      this.handleUserServiceError(e, res);
    }
  }

  @AsyncDefaultErrorHandler()
  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { login, password, age } = req.body;
      const user = await this.userService.update({
        id,
        login,
        password,
        age,
      });
      res.json(user);
    } catch (e: unknown) {
      this.handleUserServiceError(e, res);
    }
  }

  private handleUserServiceError(error: unknown, res: Response): void {
    if (error instanceof UserNotExistException) {
      this.sendError(res, 404, error.message);
    } else if (error instanceof UserAlreadyExistException) {
      this.sendError(res, 400, (error as Error).message);
    } else {
      throw error;
    }
  }

  private sendError(res: Response, code: number, message: string): void {
    res.status(code).json({ error: message });
  }

  validateUser(req: Request, res: Response, next: NextFunction): void {
    const isValid = this.userValidator.validate(req.body);
    if (isValid) {
      next();
    } else {
      this.sendError(res, 400, this.userValidator.getValidationMessage());
    }
  }
}
