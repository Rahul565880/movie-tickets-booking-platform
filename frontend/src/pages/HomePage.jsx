import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { movieService } from '../services/api';

const fallbackImages = [
  'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=600&fit=crop',
  'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=600&fit=crop',
  'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop',
];

const getFallbackImage = (id) => fallbackImages[id % fallbackImages.length];

const MovieCard = ({ movie }) => {
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <Link to={`/movies/${movie.id}`} className="group block">
      <div className="relative bg-gray-900 rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-red-600/20 border border-white/5 hover:border-red-500/30">
        <div className="aspect-[2/3] relative overflow-hidden bg-gray-800">
          {!imgLoaded && !imgError && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
              <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          
          <img
            src={imgError ? getFallbackImage(movie.id) : movie.poster_url}
            alt={movie.title}
            className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImgLoaded(true)}
            onError={() => {
              setImgError(true);
              setImgLoaded(true);
            }}
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <span className="inline-block px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full mb-2">
                {movie.genre || 'Movie'}
              </span>
            </div>
          </div>

          <div className="absolute top-3 left-3">
            <span className="px-2 py-1 bg-red-600 text-white text-xs font-bold rounded">
              {movie.language}
            </span>
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="text-white font-semibold text-lg truncate group-hover:text-red-500 transition-colors">
            {movie.title}
          </h3>
          <div className="flex items-center justify-between mt-2 text-gray-400 text-sm">
            <span>{movie.duration ? `${movie.duration} min` : 'N/A'}</span>
            <span className="px-2 py-0.5 bg-white/10 rounded text-xs">{movie.genre}</span>
          </div>
          <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between">
            <span className="text-gray-500 text-xs">Starting from</span>
            <span className="text-red-500 font-bold">₹250</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

const FeaturedMovie = ({ movie }) => {
  const [imgError, setImgError] = useState(false);
  
  if (!movie) return null;
  
  return (
    <div className="relative h-[600px] overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center transform scale-110 blur-sm"
        style={{ 
          backgroundImage: `url(${imgError ? fallbackImages[0] : movie.poster_url})`,
          backgroundColor: '#1a1a1a'
        }}
        onError={() => setImgError(true)}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
      
      <div className="relative z-10 h-full flex items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8 items-center w-full">
          <div className="hidden md:block">
            <img
              src={imgError ? fallbackImages[0] : movie.poster_url}
              alt={movie.title}
              className="w-72 rounded-2xl shadow-2xl border-4 border-white/10"
              onError={() => setImgError(true)}
            />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-red-600 text-white text-sm font-bold rounded-full">FEATURED</span>
              <span className="px-3 py-1 bg-white/10 text-white text-sm rounded-full backdrop-blur-sm">{movie.genre}</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{movie.title}</h1>
            <p className="text-gray-300 text-lg mb-6 line-clamp-3">{movie.description}</p>
            <div className="flex items-center gap-4 mb-8 text-gray-400">
              <span>{movie.duration} min</span>
              <span>|</span>
              <span>{movie.language}</span>
            </div>
            <Link
              to={`/movies/${movie.id}`}
              className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold rounded-xl transition-all hover:shadow-lg hover:shadow-red-600/40"
            >
              Book Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const GenreFilter = ({ genres, activeGenre, onGenreChange }) => (
  <div className="flex flex-wrap gap-2 mb-8">
    <button
      onClick={() => onGenreChange('All')}
      className={`px-4 py-2 rounded-full font-medium transition-all ${
        activeGenre === 'All' ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
      }`}
    >
      All
    </button>
    {genres.map((genre) => (
      <button
        key={genre}
        onClick={() => onGenreChange(genre)}
        className={`px-4 py-2 rounded-full font-medium transition-all ${
          activeGenre === genre ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
        }`}
      >
        {genre}
      </button>
    ))}
  </div>
);

const HomePage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeGenre, setActiveGenre] = useState('All');

  useEffect(() => { fetchMovies(); }, []);

  const fetchMovies = async () => {
    try {
      const data = await movieService.getAllMovies();
      setMovies(data.movies);
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const genres = [...new Set(movies.map(m => m.genre).filter(Boolean))];
  const featuredMovie = movies[0];
  
  const filteredMovies = movies.filter(movie => {
    const matchesSearch = movie.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = activeGenre === 'All' || movie.genre === activeGenre;
    return matchesSearch && matchesGenre && movie.id !== featuredMovie?.id;
  });

  return (
    <div className="min-h-screen pt-16">
      <FeaturedMovie movie={featuredMovie} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white">Browse Movies</h2>
            <p className="text-gray-400 mt-1">Find your perfect movie experience</p>
          </div>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"/>
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-80 pl-12 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-xl focus:outline-none focus:border-red-500 text-white"
            />
          </div>
        </div>

        <GenreFilter genres={genres} activeGenre={activeGenre} onGenreChange={setActiveGenre} />

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-16 h-16 border-4 border-gray-700 border-t-red-600 rounded-full animate-spin"></div>
          </div>
        ) : filteredMovies.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-xl">No movies found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-red-900/30 to-purple-900/30 rounded-2xl p-6 border border-white/10">
            <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Instant Booking</h3>
            <p className="text-gray-400">Book your tickets in seconds.</p>
          </div>
          <div className="bg-gradient-to-br from-red-900/30 to-purple-900/30 rounded-2xl p-6 border border-white/10">
            <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Secure Payments</h3>
            <p className="text-gray-400">100% secure transactions.</p>
          </div>
          <div className="bg-gradient-to-br from-red-900/30 to-purple-900/30 rounded-2xl p-6 border border-white/10">
            <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Best Prices</h3>
            <p className="text-gray-400">Exclusive deals on tickets.</p>
          </div>
        </div>
      </div>

      <footer className="border-t border-white/10 bg-black/50 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <span className="text-2xl font-bold">
            <span className="text-red-600">MOVIE</span><span className="text-white">BOOK</span>
          </span>
          <p className="text-gray-500 text-sm mt-2">© 2026 MovieBook. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
