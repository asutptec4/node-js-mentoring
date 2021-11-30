import express, { Application } from 'express';

import config from './config';
import { GroupController, UserController } from './controllers';
import Orm from './db/orm';
import { GroupModel, UserModel } from './models';
import { GroupRouter, UserRouter } from './routes';
import { GroupService, UserService } from './services';
import { GroupValidator, UserValidator } from './utils';
import { Logger } from './logger/logger';
import { createLoggerMiddleware } from './middlewares/logger';
import { errorHandler } from './middlewares/error-handler';

const app: Application = express();
app.use(express.json());
app.use(createLoggerMiddleware(Logger));

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

app.use(errorHandler);
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
