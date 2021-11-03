export default {
  port: process.env.PORT || 3000,
  dbName: process.env.DB_NAME || 'postgres',
  dbUser: process.env.DB_USER || 'postgres',
  dbPassword: process.env.DB_PASSWORD || 'postgres',
};
