const pool = require('./config/db');

const createTables = async () => {
  const tables = ['users', 'movies', 'theaters', 'shows', 'seats', 'bookings'];
  
  for (const table of tables) {
    try {
      await pool.query(`SELECT 1 FROM ${table} LIMIT 1`);
      console.log(`${table} exists`);
    } catch {
      console.log(`Creating ${table}...`);
    }
  }
  console.log('Done checking tables');
  await pool.end();
  process.exit(0);
};

createTables();
