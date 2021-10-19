import bodyParser from 'body-parser';
import { Router } from 'express';

import { UserService } from '../services/user-service';
import { UserController } from '../controllers/user-controller';

const router: Router = Router();

const userController: UserController = new UserController(new UserService());

router
  .use(bodyParser.json())
  .get('/', userController.getAll.bind(userController))
  .get('/:id', userController.getUser.bind(userController))
  .put('/:id', userController.updateUser.bind(userController))
  .post('/', userController.createUser.bind(userController))
  .delete('/:id', userController.deleteUser.bind(userController));

export default router;
