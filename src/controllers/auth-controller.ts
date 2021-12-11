import { Request, Response } from 'express';
import { UserNotFoundException } from '../exceptions';

import { AuthService, UserService } from '../services';
import { AsyncDefaultErrorHandler } from './controller-utils';

export class AuthController {
  private userService: UserService;
  private authService: AuthService;

  constructor(userService: UserService, authService: AuthService) {
    this.userService = userService;
    this.authService = authService;
  }

  @AsyncDefaultErrorHandler()
  async login(req: Request, res: Response): Promise<void> {
    const { login, password } = req.body;
    let user;
    try {
      user = await this.userService.findByLogin(login);
    } catch (e: unknown) {
      this.handleUserServiceError(e, res);
    }
    if (user && user.password === password) {
      const token = this.authService.getToken({ userID: user.id });
      res.status(200).send({ id: user.id, token });
    } else {
      res.status(400).json({ error: 'Login or password is not valid.' });
    }
  }

  private handleUserServiceError(error: unknown, res: Response): void {
    if (error instanceof UserNotFoundException) {
      res.status(400).json({ error: 'Login or password is not valid.' });
    } else {
      throw error;
    }
  }
}
