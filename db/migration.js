const fs = require('fs');
const { Sequelize } = require('sequelize');

const migrationType = process.env.MIGRATION_TYPE;

const sequelize = new Sequelize(
  process.env.DATABASE_DB || 'postgres',
  process.env.DATABASE_USER || 'postgres',
  process.env.DATABASE_PASSWORD || 'postgres',
  {
    dialect: 'postgres',
    host: process.env.DATABASE_HOST || 'localhost',
    dialectOptions: {
      multipleStatements: true,
    },
  }
);

sequelize
  .authenticate()
  .then(() => {
    console.log('The database connection has been established successfully.');
    const fileName =
      migrationType == 'up' ? './migration.up.sql' : './migration.down.sql';
    const sql_string = fs.readFileSync(fileName, 'utf8');
    return sequelize.query(sql_string);
  })
  .then(() => {
    console.log(
      migrationType == 'up'
        ? 'The database was initialized.'
        : 'The database was droped'
    );
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    if (err.name === "SequelizeDatabaseError") {
      process.exit(0);
    }
    process.exit(1);
  });
