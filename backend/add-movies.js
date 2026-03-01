const pool = require('./config/db');

const addMovies = async () => {
  console.log('Adding more movies...');
  
  const movies = [
    { title: 'Spider-Man: No Way Home', description: 'Spider-Man seeks help from Doctor Strange to make his identity secret.', poster_url: 'https://m.media-amazon.com/images/M/MV5BNjk1Y2Q4NTQtZWZlNy00MjlkLWIxYzUtNDk4ZTBhYjlmNzgyXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_.jpg', duration: 148, genre: 'Action', language: 'English', release_date: '2021-12-17' },
    { title: 'Jawan', description: 'A man embarks on a journey to bring justice to society.', poster_url: 'https://m.media-amazon.com/images/M/MV5BMTA3MDgxOTg4NDBeQTJeQWpwZ15BbWU4MDE0ODkxMzEx._V1_.jpg', duration: 165, genre: 'Action', language: 'Hindi', release_date: '2023-09-07' },
    { title: 'Pathaan', description: 'An Indian spy battles a terrorist organization.', poster_url: 'https://m.media-amazon.com/images/M/MV5BN2NmN2VhMTQtMDNiOS00NDlhLTliMjgtODE2ZTY0ODQyNDRiXkEyXkFqcGdeQXVyMTUzMDgzNTM1._V1_.jpg', duration: 146, genre: 'Action', language: 'Hindi', release_date: '2023-01-25' },
    { title: 'Animal', description: 'A son undergoes a transformation after his father goes missing.', poster_url: 'https://m.media-amazon.com/images/M/MV5BZTJjSjrLTo1NTYtYjUyZS00MjkzLThmMzUtZDQ4ZTY2ZThmNjk2XkEyXkFqcGdeQXVyMTUzMDgzNTM1._V1_.jpg', duration: 180, genre: 'Action', language: 'Hindi', release_date: '2023-12-01' },
    { title: 'Dune: Part Two', description: 'Paul Atreides unites with Chani and the Fremen.', poster_url: 'https://m.media-amazon.com/images/M/MV5BNzEwNGE1NzgtMWU0OC00MzJmLWFlNzAtZjRkNjEwMmU1ZWM2XkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_.jpg', duration: 166, genre: 'Sci-Fi', language: 'English', release_date: '2024-03-01' },
    { title: 'Oppenheimer', description: 'The story of American scientist J. Robert Oppenheimer.', poster_url: 'https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg', duration: 180, genre: 'Drama', language: 'English', release_date: '2023-07-21' },
    { title: 'Barbie', description: 'Barbie and Ken experience a series of adventures.', poster_url: 'https://m.media-amazon.com/images/M/MV5BNjU4Njk2NDMtM2UyNS00NDlhLTliMjgtODE2ZTY0ODQyNDRiXkEyXkFqcGdeQXVyMTkzMDgzNTM1._V1_.jpg', duration: 114, genre: 'Comedy', language: 'English', release_date: '2023-07-21' },
    { title: 'Pushpa 2', description: 'Pushpa continues his journey in the smuggling world.', poster_url: 'https://m.media-amazon.com/images/M/MV5BZTk0ZThhYjUtOWU0Ny00ZDBlLThkMGUtZmM1ZjQ1NDg1YzE5XkEyXkFqcGdeQXVyMTUzMDgzNTM1._V1_.jpg', duration: 165, genre: 'Action', language: 'Telugu', release_date: '2024-08-15' },
    { title: 'Doctor Strange 2', description: 'Doctor Strange enters the Multiverse of Madness.', poster_url: 'https://m.media-amazon.com/images/M/MV5BNWM0ZGJlMzMtZmYwOS00MDAwLThkMzctNDRkNjk0ZjRhZTM2XkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_.jpg', duration: 126, genre: 'Action', language: 'English', release_date: '2022-05-06' },
    { title: 'RRR', description: 'Two Indian revolutionaries fight for independence.', poster_url: 'https://m.media-amazon.com/images/M/MV5BODM0NmYxOWUtMzcyZC00ZmM5LTg5NWYtZDg0ZjAyNGNmZWFiXkEyXkFqcGdeQXVyMTUzMDgzNTM1._V1_.jpg', duration: 187, genre: 'Action', language: 'Telugu', release_date: '2022-03-25' },
    { title: 'Top Gun: Maverick', description: 'Maverick trains graduates for a dangerous mission.', poster_url: 'https://m.media-amazon.com/images/M/MV5BMmMyNTY1NTEtMzZlNi00ZGYyLWIwZmYtNWMyY2NmZjMwZjE2XkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_.jpg', duration: 131, genre: 'Action', language: 'English', release_date: '2022-05-27' },
    { title: 'Mission: Impossible 7', description: 'Ethan Hunt faces his most dangerous mission yet.', poster_url: 'https://m.media-amazon.com/images/M/MV5BMTcxOGEzNzY2M15BMl5BanBnXkFtZTcwMTc3Mjk3OQ@@._V1_.jpg', duration: 163, genre: 'Action', language: 'English', release_date: '2023-07-12' },
  ];

  for (const movie of movies) {
    try {
      await pool.query(
        `INSERT INTO movies (title, description, poster_url, duration, genre, language, release_date) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [movie.title, movie.description, movie.poster_url, movie.duration, movie.genre, movie.language, movie.release_date]
      );
      console.log(`Added: ${movie.title}`);
    } catch(e) {
      if (!e.message.includes('duplicate')) {
        console.log(`Error: ${movie.title} - ${e.message}`);
      }
    }
  }
  
  console.log('Done adding movies!');
  await pool.end();
  process.exit(0);
};

setTimeout(addMovies, 5000);
