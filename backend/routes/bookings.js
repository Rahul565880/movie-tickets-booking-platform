const express = require('express');
const pool = require('../config/db');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// POST /api/bookings - Create booking
router.post('/', authMiddleware, async (req, res) => {
  const client = await pool.connect();
  
  try {
    const { show_id, seat_ids, payment_id } = req.body;
    const userId = req.user.id;

    if (!show_id || !seat_ids || seat_ids.length === 0) {
      return res.status(400).json({ message: 'Please provide show and seats' });
    }

    await client.query('BEGIN');

    // Check if seats are available
    const seatCheck = await client.query(
      'SELECT id, price FROM seats WHERE id = ANY($1) AND status = $2 FOR UPDATE',
      [seat_ids, 'available']
    );

    if (seatCheck.rows.length !== seat_ids.length) {
      await client.query('ROLLBACK');
      return res.status(400).json({ message: 'Some seats are not available' });
    }

    // Calculate total amount
    const totalAmount = seatCheck.rows.reduce((sum, seat) => sum + parseFloat(seat.price), 0);

    // Update seat status to booked
    await client.query(
      'UPDATE seats SET status = $1 WHERE id = ANY($2)',
      ['booked', seat_ids]
    );

    // Create booking
    const bookingResult = await client.query(
      `INSERT INTO bookings (user_id, show_id, seat_ids, total_amount, status, payment_id)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [userId, show_id, seat_ids, totalAmount, 'confirmed', payment_id]
    );

    // Update available seats in show
    await client.query(
      'UPDATE shows SET available_seats = available_seats - $1 WHERE id = $2',
      [seat_ids.length, show_id]
    );

    await client.query('COMMIT');

    res.status(201).json({
      message: 'Booking created successfully',
      booking: bookingResult.rows[0]
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Create booking error:', error);
    res.status(500).json({ message: 'Server error' });
  } finally {
    client.release();
  }
});

// GET /api/bookings/user - Get user bookings
router.get('/user', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT b.*, s.show_date, s.show_time, t.name as theater_name, m.title as movie_title, m.poster_url
       FROM bookings b
       JOIN shows s ON b.show_id = s.id
       JOIN theaters t ON s.theater_id = t.id
       JOIN movies m ON s.movie_id = m.id
       WHERE b.user_id = $1
       ORDER BY b.created_at DESC`,
      [userId]
    );

    res.json({ bookings: result.rows });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
