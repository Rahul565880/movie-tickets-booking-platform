import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"/>
              </svg>
            </div>
            <span className="text-2xl font-bold">
              <span className="text-red-600">MOVIE</span>
              <span className="text-white">BOOK</span>
            </span>
          </Link>

          <div className="flex items-center space-x-1">
            <Link
              to="/"
              className="px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all font-medium"
            >
              Home
            </Link>

            {user ? (
              <>
                <Link
                  to="/my-bookings"
                  className="px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all font-medium"
                >
                  My Bookings
                </Link>
                <div className="flex items-center space-x-3 ml-2">
                  <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 bg-white/5 rounded-full">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center">
                      <span className="text-white text-sm font-bold">{user.name?.charAt(0).toUpperCase()}</span>
                    </div>
                    <span className="text-white text-sm font-medium">{user.name}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all hover:shadow-lg hover:shadow-red-600/30"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2 ml-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-gray-300 hover:text-white font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-5 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-lg font-medium transition-all hover:shadow-lg hover:shadow-red-600/30"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
