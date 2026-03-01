import axios from 'axios';

const API_URL = 'https://movie-tickets-booking-platform-1-ad9z.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authService = {
  signup: async (name, email, password) => {
    const response = await api.post('/auth/signup', { name, email, password });
    return response.data;
  },

  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

export const movieService = {
  getAllMovies: async () => {
    const response = await api.get('/movies');
    return response.data;
  },

  getMovieById: async (id) => {
    const response = await api.get(`/movies/${id}`);
    return response.data;
  },
};

export const showService = {
  getShowsByMovie: async (movieId, date) => {
    const params = date ? { date } : {};
    const response = await api.get(`/shows/${movieId}`, { params });
    return response.data;
  },
};

export const seatService = {
  getSeatsByShow: async (showId) => {
    const response = await api.get(`/seats/${showId}`);
    return response.data;
  },
};

export const bookingService = {
  createBooking: async (showId, seatIds, paymentId) => {
    const response = await api.post('/bookings', {
      show_id: showId,
      seat_ids: seatIds,
      payment_id: paymentId,
    });
    return response.data;
  },

  getUserBookings: async () => {
    const response = await api.get('/bookings/user');
    return response.data;
  },
};

export const paymentService = {
  createPayment: async (amount) => {
    const response = await api.post('/payments/create', { amount });
    return response.data;
  },

  verifyPayment: async (paymentId) => {
    const response = await api.post('/payments/verify', { paymentId });
    return response.data;
  },
};

export default api;
