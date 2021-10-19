import { Request, Response } from 'express';

import { getValidationMessage, userValidator } from '../models/user';
import { UserService } from '../services/user-service';

export class UserController {
  private userService: UserService;

  constructor(service: UserService) {
    this.userService = service;
  }

  createUser(req: Request, res: Response): void {
    if (userValidator(req.body)) {
      const { login, password, age } = req.body;
      const user = this.userService.add({ login, password, age });
      res.json(user);
    } else {
      res.statusCode = 400;
      res.statusMessage = getValidationMessage(userValidator.errors);
      res.end();
    }
  }

  deleteUser(req: Request, res: Response): void {
    const userId = req.params.id;
    try {
      const user = this.userService.delete(userId);
      res.json(user);
    } catch (e: any) {
      res.statusCode = 404;
      res.statusMessage = e.message;
      res.end();
    }
  }

  getAll(req: Request, res: Response): void {
    const users = this.userService.getAll();
    res.json(users);
  }

  getUser(req: Request, res: Response): void {
    const userId = req.params.id;
    try {
      const user = this.userService.findById(userId);
      res.json(user);
    } catch (e: any) {
      res.statusCode = 404;
      res.statusMessage = e.message;
      res.end();
    }
  }

  updateUser(req: Request, res: Response): void {
    const userId = req.params.id;
    if (userValidator(req.body)) {
      const { login, password, age } = req.body;
      try {
        const user = this.userService.update({
          id: userId,
          login,
          password,
          age,
        });
        res.json(user);
      } catch (e: any) {
        res.statusCode = 404;
        res.statusMessage = e.message;
        res.end();
      }
    } else {
      res.statusCode = 400;
      res.statusMessage = getValidationMessage(userValidator.errors);
      res.end();
    }
  }
}
