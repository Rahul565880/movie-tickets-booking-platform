const express = require('express');
const pool = require('../config/db');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// GET /api/seats/:showId - Get seats for show
router.get('/:showId', authMiddleware, async (req, res) => {
  try {
    const { showId } = req.params;

    const showResult = await pool.query(
      `SELECT s.*, t.name as theater_name, m.title as movie_title
       FROM shows s
       JOIN theaters t ON s.theater_id = t.id
       JOIN movies m ON s.movie_id = m.id
       WHERE s.id = $1`,
      [showId]
    );

    if (showResult.rows.length === 0) {
      return res.status(404).json({ message: 'Show not found' });
    }

    const seatsResult = await pool.query(
      'SELECT * FROM seats WHERE show_id = $1 ORDER BY seat_row, seat_col',
      [showId]
    );

    res.json({
      show: showResult.rows[0],
      seats: seatsResult.rows
    });
  } catch (error) {
    console.error('Get seats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
