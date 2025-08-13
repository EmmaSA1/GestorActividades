require('dotenv').config();
const knex = require('knex');

const db = knex({
  client: 'mysql2',
  connection: {
      host: 'emadb.c7iugeqkucqa.us-east-2.rds.amazonaws.com',
      user: 'admin',
      password: 'Ema12345',
      database: 'todoapp', // Reemplaza con el nombre real de tu BD
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