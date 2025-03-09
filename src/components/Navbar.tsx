
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Menu, X, User, LogOut, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Change navbar style on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Candidates', path: '/candidates' },
    user?.isAdmin 
      ? { name: 'Admin Dashboard', path: '/admin' }
      : { name: 'Vote Now', path: '/voting-booth' },
    { name: 'Results', path: '/results' },
  ];

  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/80 backdrop-blur-md shadow-sm' 
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indian-blue to-indian-green flex items-center justify-center">
              <span className="text-white font-bold text-sm">ECI</span>
            </div>
            <span className="font-display font-semibold text-xl text-indian-blue">
              E-<span className="text-indian-orange">Vote</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-indian-blue ${
                  location.pathname === link.path
                    ? 'text-indian-blue'
                    : 'text-gray-600'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Auth Buttons / User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="flex items-center space-x-2 hover:bg-gray-100"
                  >
                    <div className="w-8 h-8 rounded-full bg-indian-blue/10 flex items-center justify-center">
                      <User size={16} className="text-indian-blue" />
                    </div>
                    <span className="font-medium text-sm">{user?.name?.split(' ')[0]}</span>
                    <ChevronDown size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer">
                    Voter ID: {user?.voterId}
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    {user?.hasVoted ? 'Vote Status: Cast' : 'Vote Status: Not Cast'}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer text-red-500" onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost">Log in</Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-indian-blue hover:bg-indian-blue/90 text-white">
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden rounded-md p-2 inline-flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
            onClick={toggleMenu}
          >
            <span className="sr-only">Open main menu</span>
            {isOpen ? (
              <X className="block h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="block h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white/90 backdrop-blur-md shadow-sm">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                location.pathname === link.path
                  ? 'bg-gray-100 text-indian-blue'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-indian-blue'
              }`}
            >
              {link.name}
            </Link>
          ))}
          
          {isAuthenticated ? (
            <>
              <div className="px-3 py-2 text-sm text-gray-500">
                Signed in as <span className="font-medium">{user?.name}</span>
              </div>
              <button
                onClick={logout}
                className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
              >
                Log out
              </button>
            </>
          ) : (
            <div className="pt-4 pb-3 border-t border-gray-200">
              <Link
                to="/login"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-indian-blue"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="mt-1 block px-3 py-2 rounded-md text-base font-medium bg-indian-blue text-white hover:bg-indian-blue/90"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
