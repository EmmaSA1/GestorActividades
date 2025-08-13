/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  development: {
    client: 'mysql2',
    connection: {
      host: 'emadb.c7iugeqkucqa.us-east-2.rds.amazonaws.com',
      user: 'admin',
      password: 'Ema12345',
      database: 'todoapp', // Reemplaza con el nombre real de tu BD
      port: 3306,
      ssl: { rejectUnauthorized: false } // Necesario para conexiones seguras con RDS
    },
    migrations: {
      directory: './db/migrations',
      tableName: 'knex_migrations'
    },
    seeds: {
      directory: './db/seeds'
    }
  },

  production: {
    client: 'mysql2',
    connection: {
      host: 'emadb.c7iugeqkucqa.us-east-2.rds.amazonaws.com',
      user: 'admin',
      password: 'Ema12345',
      database: 'todoapp', // Reemplaza con el nombre real de tu BD
      port: 3306,
      ssl: { rejectUnauthorized: false }
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: './db/migrations',
      tableName: 'knex_migrations'
    }
  }
};