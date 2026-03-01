const express = require('express');
const pool = require('../config/db');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

// GET /api/movies - Get all movies
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM movies ORDER BY created_at DESC');
    res.json({ movies: result.rows });
  } catch (error) {
    console.error('Get movies error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/movies/:id - Get movie details
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM movies WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    res.json({ movie: result.rows[0] });
  } catch (error) {
    console.error('Get movie error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/movies - Create movie (Admin only)
router.post('/', adminMiddleware, async (req, res) => {
  try {
    const { title, description, poster_url, duration, genre, language, release_date } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const result = await pool.query(
      `INSERT INTO movies (title, description, poster_url, duration, genre, language, release_date)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [title, description, poster_url, duration, genre, language, release_date]
    );

    res.status(201).json({ movie: result.rows[0] });
  } catch (error) {
    console.error('Create movie error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/movies/:id - Update movie (Admin only)
router.put('/:id', adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, poster_url, duration, genre, language, release_date } = req.body;

    const result = await pool.query(
      `UPDATE movies SET title = COALESCE($1, title), description = COALESCE($2, description),
       poster_url = COALESCE($3, poster_url), duration = COALESCE($4, duration),
       genre = COALESCE($5, genre), language = COALESCE($6, language),
       release_date = COALESCE($7, release_date)
       WHERE id = $8 RETURNING *`,
      [title, description, poster_url, duration, genre, language, release_date, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    res.json({ movie: result.rows[0] });
  } catch (error) {
    console.error('Update movie error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/movies/:id - Delete movie (Admin only)
router.delete('/:id', adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM movies WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    res.json({ message: 'Movie deleted successfully' });
  } catch (error) {
    console.error('Delete movie error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
