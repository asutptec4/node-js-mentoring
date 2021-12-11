import { Router } from 'express';

import { AuthController } from '../controllers';

export class AuthRouter {
  public instance: Router;

  constructor(controller: AuthController) {
    this.instance = Router();
    this.instance.post('/', controller.login.bind(controller));
  }
}
