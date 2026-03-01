const pool = require('../config/db');

const initDatabase = async () => {
  console.log('Initializing database...');
  
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('Users table ready');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS movies (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        poster_url VARCHAR(500),
        duration INT,
        genre VARCHAR(50),
        language VARCHAR(50),
        release_date DATE,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('Movies table ready');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS theaters (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        location VARCHAR(255),
        total_seats INT DEFAULT 100
      )
    `);
    console.log('Theaters table ready');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS shows (
        id SERIAL PRIMARY KEY,
        movie_id INT REFERENCES movies(id) ON DELETE CASCADE,
        theater_id INT REFERENCES theaters(id) ON DELETE CASCADE,
        show_time TIME,
        show_date DATE,
        price DECIMAL(10,2),
        available_seats INT DEFAULT 100,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('Shows table ready');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS seats (
        id SERIAL PRIMARY KEY,
        show_id INT REFERENCES shows(id) ON DELETE CASCADE,
        seat_number VARCHAR(10),
        seat_row CHAR(1),
        seat_col INT,
        status VARCHAR(20) DEFAULT 'available',
        price DECIMAL(10,2),
        UNIQUE(show_id, seat_number)
      )
    `);
    console.log('Seats table ready');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        show_id INT REFERENCES shows(id) ON DELETE CASCADE,
        seat_ids INT[],
        total_amount DECIMAL(10,2),
        status VARCHAR(20) DEFAULT 'confirmed',
        payment_id VARCHAR(255),
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('Bookings table ready');

    const result = await pool.query('SELECT COUNT(*) FROM movies');
    const count = parseInt(result.rows[0].count);
    
    if (count === 0) {
      console.log('Inserting sample data...');
      
      await pool.query(`INSERT INTO movies (title, description, poster_url, duration, genre, language, release_date) VALUES
        ('Avengers: Endgame', 'The Avengers assemble once more.', 'https://m.media-amazon.com/images/M/MV5BMTc5MDE2ODcwNV5BMl5BanBnXkFtZTgwMzI2NzQ2NzM@._V1_.jpg', 181, 'Action', 'English', '2019-04-26'),
        ('Inception', 'A thief who steals corporate secrets.', 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_.jpg', 148, 'Sci-Fi', 'English', '2010-07-16'),
        ('The Dark Knight', 'Batman vs Joker.', 'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg', 152, 'Action', 'English', '2008-07-18')`);

      await pool.query(`INSERT INTO theaters (name, location, total_seats) VALUES
        ('PVR Cinemas', 'Mall', 100),
        ('INOX', 'City Center', 80)`);

      const movies = await pool.query('SELECT id FROM movies');
      const theaters = await pool.query('SELECT id FROM theaters');

      for (const movie of movies.rows) {
        for (const theater of theaters.rows) {
          const showTimes = ['10:00:00', '14:00:00', '18:00:00'];
          const prices = [250, 350, 450];
          
          for (let i = 0; i < showTimes.length; i++) {
            const showDate = new Date();
            showDate.setDate(showDate.getDate() + i);
            
            const showResult = await pool.query(
              `INSERT INTO shows (movie_id, theater_id, show_time, show_date, price, available_seats) VALUES ($1, $2, $3, $4, $5, 100) RETURNING id`,
              [movie.id, theater.id, showTimes[i], showDate.toISOString().split('T')[0], prices[i]]
            );

            for (const row of ['A','B','C','D','E']) {
              for (let col = 1; col <= 10; col++) {
                await pool.query(
                  `INSERT INTO seats (show_id, seat_number, seat_row, seat_col, status, price) VALUES ($1, $2, $3, $4, 'available', $5)`,
                  [showResult.rows[0].id, `${row}${col}`, row, col, row <= 'B' ? prices[i] + 50 : prices[i]]
                );
              }
            }
          }
        }
      }
      console.log('Sample data inserted!');
    }

    console.log('Database initialization complete!');
  } catch (error) {
    console.error('Database init error:', error.message);
    throw error;
  }
};

module.exports = initDatabase;
