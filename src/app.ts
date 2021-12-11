import express, { Application } from 'express';

import config from './config';
import { AuthController, GroupController, UserController } from './controllers';
import Orm from './db/orm';
import {
  createErrorHandlerMiddleware,
  createLoggerMiddleware,
} from './middlewares';
import { GroupModel, UserModel } from './models';
import { Logger } from './logger/logger';
import { AuthRouter, GroupRouter, UserRouter } from './routes';
import { AuthService, GroupService, UserService } from './services';
import { GroupValidator, UserValidator } from './utils';

const app: Application = express();
app.use(express.json());
app.use(createLoggerMiddleware(Logger));

const authService = new AuthService();

const groupRepository = Orm.getRepository(GroupModel);
const userRepository = Orm.getRepository(UserModel);

const userService = new UserService(userRepository, groupRepository);
const userController: UserController = new UserController(
  userService,
  new UserValidator()
);
app.use('/api/users', new UserRouter(userController).instance);

const groupController: GroupController = new GroupController(
  new GroupService(groupRepository, userRepository),
  new GroupValidator()
);
app.use('/api/groups', new GroupRouter(groupController).instance);

const authController: AuthController = new AuthController(
  userService,
  authService
);
app.use('/api/login', new AuthRouter(authController).instance);

app.use(createErrorHandlerMiddleware(Logger));
const fatalErrorHandler = (error: Error) => {
  Logger.error({ error });
  process.exit(1);
};
process.on('uncaughtException', fatalErrorHandler);
process.on('unhandledRejection', fatalErrorHandler);

const port = config.port;
app.listen(port, (): void => {
  Logger.info(`Server Running on http://localhost:${port}`);
});
