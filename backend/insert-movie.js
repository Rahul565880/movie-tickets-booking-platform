const pool = require('./config/db');

const test = async () => {
  console.log('Inserting movie...');
  try {
    await pool.query(`INSERT INTO movies (title, description, poster_url, duration, genre, language, release_date) VALUES 
      ('Avengers: Endgame', 'The Avengers assemble once more.', 'https://m.media-amazon.com/images/M/MV5BMTc5MDE2ODcwNV5BMl5BanBnXkFtZTgwMzI2NzQ2NzM@._V1_.jpg', 181, 'Action', 'English', '2019-04-26')`);
    console.log('Inserted!');
    const res = await pool.query('SELECT * FROM movies');
    console.log('Movies:', JSON.stringify(res.rows));
  } catch(e) {
    console.log('Error:', e.message);
  }
  await pool.end();
  process.exit(0);
};

setTimeout(test, 5000);
