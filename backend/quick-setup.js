const pool = require('./config/db');

const setup = async () => {
  console.log('Creating tables...');
  try {
    await pool.query(`CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, name VARCHAR(100), email VARCHAR(255) UNIQUE, password VARCHAR(255), role VARCHAR(20) DEFAULT 'user')`);
    console.log('users OK');
    await pool.query(`CREATE TABLE IF NOT EXISTS movies (id SERIAL PRIMARY KEY, title VARCHAR(255), description TEXT, poster_url VARCHAR(500), duration INT, genre VARCHAR(50), language VARCHAR(50), release_date DATE)`);
    console.log('movies OK');
    await pool.query(`CREATE TABLE IF NOT EXISTS theaters (id SERIAL PRIMARY KEY, name VARCHAR(255), location VARCHAR(255), total_seats INT DEFAULT 100)`);
    console.log('theaters OK');
    await pool.query(`CREATE TABLE IF NOT EXISTS shows (id SERIAL PRIMARY KEY, movie_id INT, theater_id INT, show_time TIME, show_date DATE, price DECIMAL(10,2), available_seats INT DEFAULT 100)`);
    console.log('shows OK');
    await pool.query(`CREATE TABLE IF NOT EXISTS seats (id SERIAL PRIMARY KEY, show_id INT, seat_number VARCHAR(10), seat_row CHAR(1), seat_col INT, status VARCHAR(20) DEFAULT 'available', price DECIMAL(10,2))`);
    console.log('seats OK');
    await pool.query(`CREATE TABLE IF NOT EXISTS bookings (id SERIAL PRIMARY KEY, user_id INT, show_id INT, seat_ids INT[], total_amount DECIMAL(10,2), status VARCHAR(20) DEFAULT 'confirmed', payment_id VARCHAR(255))`);
    console.log('bookings OK');
    console.log('All tables created!');
  } catch(e) {
    console.log('Error:', e.message);
  }
  await pool.end();
  process.exit(0);
};

setTimeout(setup, 3000);
