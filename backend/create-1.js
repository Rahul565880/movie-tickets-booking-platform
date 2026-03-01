const pool = require('./config/db');

(async () => {
  console.log('Creating users table...');
  await pool.query(`CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, name VARCHAR(100), email VARCHAR(255) UNIQUE, password VARCHAR(255), role VARCHAR(20) DEFAULT 'user')`);
  console.log('Done!');
  process.exit(0);
})();
