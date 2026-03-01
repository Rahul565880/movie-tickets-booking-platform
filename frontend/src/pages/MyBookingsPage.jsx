import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { bookingService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchBookings();
  }, [user]);

  const fetchBookings = async () => {
    try {
      const data = await bookingService.getUserBookings();
      setBookings(data.bookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">My Bookings</h1>

        {bookings.length === 0 ? (
          <div className="bg-gray-900 rounded-lg p-12 text-center">
            <p className="text-gray-400 text-xl mb-4">No bookings yet</p>
            <Link
              to="/"
              className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Browse Movies
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-gray-900 rounded-lg overflow-hidden flex flex-col md:flex-row"
              >
                <div className="md:w-48">
                  {booking.poster_url ? (
                    <img
                      src={booking.poster_url}
                      alt={booking.movie_title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-800 flex items-center justify-center">
                      <span className="text-gray-500">No Image</span>
                    </div>
                  )}
                </div>

                <div className="flex-1 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold">{booking.movie_title}</h3>
                      <p className="text-gray-400">{booking.theater_name}</p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        booking.status === 'confirmed'
                          ? 'bg-green-600/20 text-green-500'
                          : 'bg-red-600/20 text-red-500'
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-gray-400 text-sm">Date</p>
                      <p className="font-semibold">{formatDate(booking.show_date)}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Time</p>
                      <p className="font-semibold">{formatTime(booking.show_time)}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Seats</p>
                      <p className="font-semibold">{booking.seat_ids?.length || 0}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Amount</p>
                      <p className="font-semibold text-red-500">₹{booking.total_amount}</p>
                    </div>
                  </div>

                  <p className="text-gray-400 text-sm">
                    Booking ID: #{booking.id} | Payment ID: {booking.payment_id}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookingsPage;
