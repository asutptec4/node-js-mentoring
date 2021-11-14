import { Sequelize } from 'sequelize-typescript';

import { GroupModel, UserModel } from '../models';
import config from '../config';

const orm = new Sequelize(config.dbName, config.dbUser, config.dbPassword, {
  dialect: 'postgres',
  repositoryMode: true,
});

orm
  .authenticate()
  .then(() => {
    console.log('The database connection has been established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

orm.addModels([UserModel, GroupModel]);

export default orm;
