import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { movieService, showService } from '../services/api';

const MovieDetailsPage = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMovieAndShows();
  }, [id]);

  const fetchMovieAndShows = async () => {
    try {
      const [movieData, showsData] = await Promise.all([
        movieService.getMovieById(id),
        showService.getShowsByMovie(id),
      ]);
      setMovie(movieData.movie);
      setShows(showsData.shows);
    } catch (error) {
      console.error('Error fetching movie:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const formatTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const groupedShows = shows.reduce((acc, show) => {
    const date = show.show_date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(show);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <p className="text-gray-400">Movie not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16">
      <div className="relative h-[50vh]">
        {movie.poster_url && (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${movie.poster_url})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-40 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/3">
            {movie.poster_url && (
              <img
                src={movie.poster_url}
                alt={movie.title}
                className="w-full rounded-lg shadow-2xl"
              />
            )}
          </div>

          <div className="md:w-2/3">
            <h1 className="text-4xl font-bold mb-4">{movie.title}</h1>

            <div className="flex flex-wrap gap-3 mb-6">
              {movie.genre && (
                <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm">
                  {movie.genre}
                </span>
              )}
              {movie.language && (
                <span className="bg-gray-700 text-white px-3 py-1 rounded-full text-sm">
                  {movie.language}
                </span>
              )}
              {movie.duration && (
                <span className="bg-gray-700 text-white px-3 py-1 rounded-full text-sm">
                  {movie.duration} min
                </span>
              )}
            </div>

            <p className="text-gray-300 text-lg mb-8">{movie.description}</p>

            <h2 className="text-2xl font-bold mb-6">Select Show</h2>

            {Object.keys(groupedShows).length === 0 ? (
              <p className="text-gray-400">No shows available</p>
            ) : (
              Object.entries(groupedShows).map(([date, dateShows]) => (
                <div key={date} className="mb-8">
                  <h3 className="text-xl font-semibold mb-4 text-red-500">{formatDate(date)}</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {dateShows.map((show) => (
                      <Link
                        key={show.id}
                        to={`/seats/${show.id}`}
                        className="bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-red-500 rounded-lg p-4 transition-all"
                      >
                        <div className="text-center">
                          <p className="text-lg font-semibold">{formatTime(show.show_time)}</p>
                          <p className="text-gray-400 text-sm">{show.theater_name}</p>
                          <p className="text-red-500 font-bold mt-2">₹{show.price}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailsPage;
