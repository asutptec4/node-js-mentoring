import { Sequelize } from 'sequelize-typescript';

import { UserModel } from '../models/user';
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

orm.addModels([UserModel]);

export default orm;
