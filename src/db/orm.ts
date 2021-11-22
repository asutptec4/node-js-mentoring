import { Sequelize } from 'sequelize-typescript';

import { GroupModel, UserGroupModel, UserModel } from '../models';
import config from '../config';

const orm = new Sequelize(config.dbName, config.dbUser, config.dbPassword, {
  dialect: 'postgres',
  repositoryMode: true,
  host: config.dbHost,
});

orm
  .authenticate()
  .then(() => {
    console.log('The database connection has been established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
    process.exit(1);
  });

orm.addModels([GroupModel, UserModel, UserGroupModel]);

export default orm;
