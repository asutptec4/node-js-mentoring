import { Router } from 'express';

import { UserController } from '../controllers/user-controller';

export class UserRouter {
  public instance: Router;

  constructor(userController: UserController) {
    this.instance = Router();
    this.instance
      .get('/', userController.getAll.bind(userController))
      .get('/suggest', userController.getAutoSuggestUsers.bind(userController))
      .get('/:id', userController.getUser.bind(userController))
      .put('/:id', [
        userController.validateUser.bind(userController),
        userController.updateUser.bind(userController),
      ])
      .post('/', [
        userController.validateUser.bind(userController),
        userController.createUser.bind(userController),
      ])
      .delete('/:id', userController.deleteUser.bind(userController));
  }
}
