import { Sequelize } from 'sequelize-typescript';

import { GroupModel, UserGroupModel, UserModel } from '../models';
import config from '../config';
import { Logger } from '../logger/logger';

const orm = new Sequelize(config.dbName, config.dbUser, config.dbPassword, {
  dialect: 'postgres',
  repositoryMode: true,
  host: config.dbHost,
  logging: false,
});

orm
  .authenticate()
  .then(() => {
    Logger.info('The database connection has been established successfully.');
  })
  .catch((err) => {
    Logger.error('Unable to connect to the database:', err);
    process.exit(1);
  });

orm.addModels([GroupModel, UserModel, UserGroupModel]);

export default orm;
