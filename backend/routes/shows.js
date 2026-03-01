const express = require('express');
const pool = require('../config/db');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

// GET /api/shows/:movieId - Get shows by movie
router.get('/:movieId', async (req, res) => {
  try {
    const { movieId } = req.params;
    const { date } = req.query;

    let query = `
      SELECT s.*, t.name as theater_name, t.location, m.title as movie_title
      FROM shows s
      JOIN theaters t ON s.theater_id = t.id
      JOIN movies m ON s.movie_id = m.id
      WHERE s.movie_id = $1
    `;
    
    const params = [movieId];

    if (date) {
      query += ` AND s.show_date = $2`;
      params.push(date);
    }

    query += ` ORDER BY s.show_date, s.show_time`;

    const result = await pool.query(query, params);

    res.json({ shows: result.rows });
  } catch (error) {
    console.error('Get shows error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/shows - Create show (Admin only)
router.post('/', adminMiddleware, async (req, res) => {
  try {
    const { movie_id, theater_id, show_time, show_date, price } = req.body;

    if (!movie_id || !theater_id || !show_time || !show_date || !price) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const result = await pool.query(
      `INSERT INTO shows (movie_id, theater_id, show_time, show_date, price, available_seats)
       VALUES ($1, $2, $3, $4, $5, (SELECT total_seats FROM theaters WHERE id = $2)) RETURNING *`,
      [movie_id, theater_id, show_time, show_date, price]
    );

    res.status(201).json({ show: result.rows[0] });
  } catch (error) {
    console.error('Create show error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
