import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { movieService } from '../services/api';

const fallbackImages = [
  'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=300&h=450&fit=crop',
  'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=300&h=450&fit=crop',
  'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300&h=450&fit=crop',
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
              <div className="flex items-center gap-2 text-white text-sm">
                <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
                <span>HD</span>
              </div>
            </div>
          </div>

          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-red-600 transition-colors">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd"/>
              </svg>
            </button>
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
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
              </svg>
              {movie.duration ? `${movie.duration} min` : 'N/A'}
            </span>
            <span className="px-2 py-0.5 bg-white/10 rounded text-xs">
              {movie.genre}
            </span>
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

export default MovieCard;
