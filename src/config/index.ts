export default () => ({
  port: process.env.PORT || 5000,
  dbName: process.env.DATABASE_DB || 'postgres',
  dbUser: process.env.DATABASE_USER || 'postgres',
  dbPassword: process.env.DATABASE_PASSWORD || 'postgres',
  dbHost: process.env.DATABASE_HOST || 'localhost',
  mongoDbHost: process.env.MONGO_HOST || 'localhost',
  mongoDbUser: process.env.MONGO_DATABASE_USER || 'mongo',
  mongoDbPassword: process.env.MONGO_DATABASE_DB || 'mongo',
  jwtSecret: process.env.JWT_SECRET || 'superSecret',
  jwtExpTime: process.env.JWT_EXP_TIME || '2m',
});
