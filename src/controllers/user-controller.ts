import { Request, Response } from 'express';

import { UserNotFoundException } from '../services/user-not-found';
import { UserService } from '../services/user-service';
import { UserValidator } from '../utils/user-validator';

export class UserController {
  private userService: UserService;
  private userValidator: UserValidator;

  constructor(service: UserService, validator: UserValidator) {
    this.userService = service;
    this.userValidator = validator;
  }

  createUser(req: Request, res: Response): void {
    this.validateRequest(req, res);
    const { login, password, age } = req.body;
    const user = this.userService.add({ login, password, age });
    res.json(user);
  }

  deleteUser(req: Request, res: Response): void {
    try {
      const { id } = req.params;
      const user = this.userService.delete(id);
      res.json(user);
    } catch (e: unknown) {
      this.handleUserServiceError(e, res);
    }
  }

  getAll(req: Request, res: Response): void {
    const users = this.userService.getAll();
    res.json(users);
  }

  getAutoSuggestUsers(req: Request, res: Response): void {
    const { limit, loginSubstring } = req.query;
    if (limit && loginSubstring) {
      const users = this.userService.getAutoSuggestUsers(
        loginSubstring.toString(),
        Number.parseInt(limit as string)
      );
      res.json(users);
    } else {
      this.sendError(res, 400, 'Bad query params');
    }
  }

  getUser(req: Request, res: Response): void {
    try {
      const { id } = req.params;
      const user = this.userService.findById(id);
      res.json(user);
    } catch (e: unknown) {
      this.handleUserServiceError(e, res);
    }
  }

  updateUser(req: Request, res: Response): void {
    this.validateRequest(req, res);
    try {
      const { id } = req.params;
      const { login, password, age } = req.body;
      const user = this.userService.update({
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
    if (error instanceof UserNotFoundException) {
      this.sendError(res, 404, error.message);
    }
  }

  private sendError(res: Response, code: number, message: string): void {
    res.status(code).json({ error: message });
  }

  private validateRequest(req: Request, res: Response): void {
    const isNotValid = !this.userValidator.validate(req.body);
    if (isNotValid) {
      this.sendError(res, 400, this.userValidator.getValidationMessage());
    }
  }
}
