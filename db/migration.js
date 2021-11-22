const fs = require('fs');
const { Sequelize } = require('sequelize');

const migrationType = process.env.MIGRATION_TYPE;

const sequelize = new Sequelize(process.env.DATABASE_DB, process.env.DATABASE_USER, process.env.DATABASE_PASSWORD, {
  dialect: 'postgres',
  host: process.env.DATABASE_HOST,
  dialectOptions: {
    multipleStatements: true,
  },
});

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
    process.exit(1);
  });
