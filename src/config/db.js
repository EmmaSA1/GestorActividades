require('dotenv').config();
const knex = require('knex');

const db = knex({
  client: 'mysql2',
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  },
  pool: { min: 0, max: 7 }
});

// Verificar conexión
db.raw('SELECT 1')
  .then(() => console.log('Conexión a la BD establecida'))
  .catch(err => {
    console.error('Error al conectar a la BD:', err);
    process.exit(1);
  });

module.exports = db;