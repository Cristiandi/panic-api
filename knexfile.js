const environment = require('./environment');

const config = {
  client: environment.DATABASE_CLIENT,
  connection: {
    host: environment.DATABASE_HOST,
    user: environment.DATABASE_USER,
    password: environment.DATABASE_PASSWORD,
    database: environment.DATABASE_NAME,
    port: environment.DATABASE_PORT
  },
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    tableName: 'knex_migrations',
    directory: './migrations'
  }
};

module.exports = {

  local: { ...config },

  development: { ...config },

  staging: { ...config },

  production: { ...config }

};
