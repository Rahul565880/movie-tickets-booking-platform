const express = require('express');
const pool = require('../config/db');

const router = express.Router();

// GET /api/theaters - Get all theaters
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM theaters');
    res.json({ theaters: result.rows });
  } catch (error) {
    console.error('Get theaters error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/theaters/:id - Get theater details
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM theaters WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Theater not found' });
    }

    res.json({ theater: result.rows[0] });
  } catch (error) {
    console.error('Get theater error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
