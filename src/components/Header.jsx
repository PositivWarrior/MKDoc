import { Menu, X, Phone, Mail } from 'lucide-react';
import { useState } from 'react';
import PropTypes from 'prop-types';

const Header = ({ user, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      <div className="w-full px-4 md:px-8">
        {/* Desktop Header */}
        <div className="flex h-16 items-center justify-between">
          <h1 className="text-xl font-bold text-slate-800 md:text-2xl">
            LukMeg Verdivurdering
          </h1>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex md:items-center md:gap-8">
            <a 
              href="tel:+4799854333" 
              className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors"
            >
              <Phone size={18} />
              <span>+47 998 54 333</span>
            </a>
            <a 
              href="mailto:lukmegnorge@gmail.com" 
              className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors"
            >
              <Mail size={18} />
              <span>lukmegnorge@gmail.com</span>
            </a>
          </nav>

          {/* User Info and Logout Button */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {user.photoURL ? (
                <img 
                  src={user.photoURL} 
                  alt={user.displayName || 'User'} 
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                  <span className="text-gray-600 text-sm">
                    {user.displayName ? user.displayName[0].toUpperCase() : 'U'}
                  </span>
                </div>
              )}
              <span className="text-gray-700">{user.displayName || user.email}</span>
            </div>
            <button
              onClick={onLogout}
              className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
            >
              Logout
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-slate-600 hover:text-blue-600 md:hidden"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="border-t border-slate-100 py-4 md:hidden">
            <div className="flex flex-col gap-4">
              <a 
                href="tel:+4799854333" 
                className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors"
              >
                <Phone size={18} />
                <span>+47 998 54 333</span>
              </a>
              <a 
                href="mailto:lukmegnorge@gmail.com" 
                className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors"
              >
                <Mail size={18} />
                <span>lukmegnorge@gmail.com</span>
              </a>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

Header.propTypes = {
  user: PropTypes.object.isRequired,
  onLogout: PropTypes.func.isRequired,
};

export default Header; 