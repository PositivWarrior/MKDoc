import { Menu, X, Phone, Mail } from 'lucide-react';
import { useState } from 'react';

const Header = () => {
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

export default Header; 