const pool = require('./config/db');

const updatePosters = async () => {
  console.log('Updating movie posters...');
  
  const updates = [
    { id: 15, title: 'Doctor Strange 2', poster_url: 'https://image.tmdb.org/t/p/w500/9Gtg2DzBhmYamXBS1hKAhiwbBKS.jpg' },
    { id: 18, title: 'Mission: Impossible 7', poster_url: 'https://image.tmdb.org/t/p/w500/r2J02Z2OpNTctfOSN1Ydgii51I3.jpg' },
  ];

  for (const movie of updates) {
    try {
      await pool.query(
        `UPDATE movies SET poster_url = $1 WHERE id = $2`,
        [movie.poster_url, movie.id]
      );
      console.log(`Updated: ${movie.title}`);
    } catch(e) {
      console.log(`Error: ${movie.title} - ${e.message}`);
    }
  }
  
  console.log('Done!');
  await pool.end();
  process.exit(0);
};

setTimeout(updatePosters, 5000);
