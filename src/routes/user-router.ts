import express, { Router } from 'express';

import { UserService } from '../services/user-service';
import { UserController } from '../controllers/user-controller';
import { UserValidator } from '../utils/user-validator';

const router: Router = Router();

const userController: UserController = new UserController(new UserService(), new UserValidator());

router
  .use(express.json())
  .get('/', userController.getAll.bind(userController))
  .get('/auto-suggest', userController.getAutoSuggestUsers.bind(userController))
  .get('/:id', userController.getUser.bind(userController))
  .put('/:id', userController.updateUser.bind(userController))
  .post('/', userController.createUser.bind(userController))
  .delete('/:id', userController.deleteUser.bind(userController));

export default router;
