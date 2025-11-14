import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBars, FaTimes, FaHeart, FaBookmark } from 'react-icons/fa';
import Sidebar from './Sidebar';
import { useFavorites } from '../context/FavoritesContext';
import './Header.css';

const Header: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const { favorites, watchlist } = useFavorites();
  const location = useLocation();

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  // Close sidebar on clicking outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (isSidebarOpen && !target.closest('.sidebar') && !target.closest('.menu-icon')) {
        setSidebarOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isSidebarOpen]);

  return (
    <>
      <header className={`header ${isSidebarOpen ? 'header--sidebar-open' : ''}`}>
        <div className="header__brand">
          <button onClick={toggleSidebar} className="menu-icon" aria-label="Toggle navigation menu">
            {isSidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
          <Link to="/" className="header__logo" onClick={() => setSidebarOpen(false)}>
            <span className="header__logo-accent">cine</span>mate
          </Link>
          <span className="header__tagline">Your Movie Companion</span>
        </div>

        <div className="header__actions">
          <Link
            to="/favorites"
            className={`header__action ${location.pathname.startsWith('/favorites') ? 'is-active' : ''}`}
            onClick={() => setSidebarOpen(false)}
          >
            <FaHeart />
            <span className="header__action-label">Favorites</span>
            {favorites.length > 0 && <span className="header__badge">{favorites.length}</span>}
          </Link>
          <Link
            to="/watchlist"
            className={`header__action ${location.pathname.startsWith('/watchlist') ? 'is-active' : ''}`}
            onClick={() => setSidebarOpen(false)}
          >
            <FaBookmark />
            <span className="header__action-label">Watchlist</span>
            {watchlist.length > 0 && <span className="header__badge">{watchlist.length}</span>}
          </Link>
        </div>
      </header>
      <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
      <div className={`overlay ${isSidebarOpen ? 'dimmed' : ''}`} />
    </>
  );
};

export default Header;
