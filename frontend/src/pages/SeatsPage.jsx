import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { seatService, paymentService, bookingService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const SeatsPage = () => {
  const { id: showId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [show, setShow] = useState(null);
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchSeats();
  }, [showId, user]);

  const fetchSeats = async () => {
    try {
      const data = await seatService.getSeatsByShow(showId);
      setShow(data.show);
      setSeats(data.seats);
    } catch (error) {
      console.error('Error fetching seats:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSeat = (seat) => {
    if (seat.status !== 'available') return;
    
    setSelectedSeats((prev) => {
      const isSelected = prev.find((s) => s.id === seat.id);
      if (isSelected) {
        return prev.filter((s) => s.id !== seat.id);
      }
      return [...prev, seat];
    });
  };

  const getTotalAmount = () => {
    return selectedSeats.reduce((sum, seat) => sum + parseFloat(seat.price), 0);
  };

  const handleBooking = async () => {
    if (selectedSeats.length === 0) return;
    
    setProcessing(true);
    try {
      const seatIds = selectedSeats.map((s) => s.id);
      const amount = getTotalAmount();

      const paymentData = await paymentService.createPayment(amount);
      const paymentId = paymentData.paymentId;

      const verifyResult = await paymentService.verifyPayment(paymentId);
      
      if (verifyResult.verified) {
        await bookingService.createBooking(parseInt(showId), seatIds, paymentId);
        alert('Booking successful!');
        navigate('/my-bookings');
      } else {
        alert('Payment failed. Please try again.');
      }
    } catch (error) {
      console.error('Booking error:', error);
      alert('Booking failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const formatTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const rows = [...new Set(seats.map((s) => s.seat_row))].sort();
  const columns = Math.max(...seats.map((s) => s.seat_col));

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
        {show && (
          <div className="bg-gray-900 rounded-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold">{show.movie_title}</h1>
                <p className="text-gray-400">{show.theater_name}</p>
              </div>
              <div className="text-right">
                <p className="text-lg">{new Date(show.show_date).toLocaleDateString()}</p>
                <p className="text-red-500 font-bold">{formatTime(show.show_time)}</p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-gray-900 rounded-lg p-8 mb-8">
          <div className="flex justify-center mb-8">
            <div className="w-3/4 bg-gray-800 rounded-t-lg py-2 text-center text-gray-400">
              SCREEN
            </div>
          </div>

          <div className="flex justify-center mb-8">
            <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
              {rows.map((row) => (
                <div key={row} className="contents">
                  {Array.from({ length: columns }, (_, i) => i + 1).map((col) => {
                    const seat = seats.find((s) => s.seat_row === row && s.seat_col === col);
                    if (!seat) return <div key={`empty-${row}-${col}`} />;

                    const isSelected = selectedSeats.find((s) => s.id === seat.id);
                    const isBooked = seat.status === 'booked';

                    return (
                      <button
                        key={seat.id}
                        onClick={() => toggleSeat(seat)}
                        disabled={isBooked}
                        className={`w-10 h-10 rounded-t-lg text-xs font-medium transition-all ${
                          isBooked
                            ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                            : isSelected
                            ? 'bg-red-600 text-white'
                            : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                        }`}
                      >
                        {seat.seat_number}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gray-700 rounded"></div>
              <span className="text-gray-400 text-sm">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-red-600 rounded"></div>
              <span className="text-gray-400 text-sm">Selected</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gray-700 rounded opacity-50"></div>
              <span className="text-gray-400 text-sm">Booked</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <p className="text-gray-400">Selected Seats: {selectedSeats.length}</p>
              <p className="text-2xl font-bold">₹{getTotalAmount()}</p>
            </div>
            <button
              onClick={handleBooking}
              disabled={selectedSeats.length === 0 || processing}
              className="bg-red-600 hover:bg-red-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-lg transition-colors"
            >
              {processing ? 'Processing...' : 'Book Now'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatsPage;
