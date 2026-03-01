const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_npo1kP0gZDOV@ep-snowy-sound-aizsqpin-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require',
  ssl: { rejectUnauthorized: false }
});

(async () => {
  console.log('Testing...');
  const res = await pool.query('SELECT 1');
  console.log('Query worked!');
  await pool.end();
})();
