import express, { Application } from 'express';

import config from './config';
import { GroupController, UserController } from './controllers';
import Orm from './db/orm';
import { GroupModel, UserModel } from './models';
import { GroupRouter, UserRouter } from './routes';
import { GroupService, UserService } from './services';
import { GroupValidator, UserValidator } from './utils';

const app: Application = express();
app.use(express.json());

const groupRepository = Orm.getRepository(GroupModel);
const userRepository = Orm.getRepository(UserModel);

const userController: UserController = new UserController(
  new UserService(userRepository, groupRepository),
  new UserValidator()
);
app.use('/api/users', new UserRouter(userController).instance);

const groupController: GroupController = new GroupController(
  new GroupService(groupRepository, userRepository),
  new GroupValidator()
);
app.use('/api/groups', new GroupRouter(groupController).instance);

const port = config.port;
app.listen(port, (): void => {
  console.log(`Server Running on http://localhost:${port}`);
});
