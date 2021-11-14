const fs = require('fs');
const { Sequelize } = require('sequelize');

const migrationType = process.env.MIGRATION_TYPE;

const sequelize = new Sequelize('postgres', 'postgres', 'postgres', {
  dialect: 'postgres',
  dialectOptions: {
    multipleStatements: true,
  },
});

sequelize
  .authenticate()
  .then(() => {
    console.log('The database connection has been established successfully.');
    const fileName =
      migrationType == 'up'
        ? './db/migration.up.sql'
        : './db/migration.down.sql';
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
