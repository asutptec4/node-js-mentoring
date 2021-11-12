import express, { Application } from 'express';

import config from './config';
import { UserController } from './controllers/user-controller';
import Orm from './db/orm';
import { UserModel } from './models/user';
import { UserService } from './services/user-service';
import { UserRouter } from './routes/user-router';
import { UserValidator } from './utils/user-validator';

const app: Application = express();
app.use(express.json());

const userController: UserController = new UserController(
  new UserService(Orm.getRepository(UserModel)),
  new UserValidator()
);
app.use('/api/users', new UserRouter(userController).instance);

const port = config.port;
app.listen(port, (): void => {
  console.log(`Server Running on http://localhost:${port}`);
});
