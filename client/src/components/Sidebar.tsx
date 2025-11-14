import React, { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FaHome,
  FaHeart,
  FaBookmark,
  FaFilm,
  FaUser,
  FaVideo,
  FaInfoCircle,
  FaQuestionCircle,
  FaTimes,
} from 'react-icons/fa';
import './Sidebar.css';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();

  const items = useMemo(
    () => [
      { to: '/', label: 'Home', icon: <FaHome />, match: (path: string) => path === '/' },
      { to: '/favorites', label: 'Favorites', icon: <FaHeart />, match: (path: string) => path.startsWith('/favorites') },
      { to: '/watchlist', label: 'Watchlist', icon: <FaBookmark />, match: (path: string) => path.startsWith('/watchlist') },
      { to: '/genres', label: 'Genres', icon: <FaFilm />, match: (path: string) => path.startsWith('/genres') || path.startsWith('/genre/') },
      { to: '/actors', label: 'Actors', icon: <FaUser />, match: (path: string) => path.startsWith('/actors') || path.startsWith('/actor/') },
      { to: '/directors', label: 'Directors', icon: <FaVideo />, match: (path: string) => path.startsWith('/directors') || path.startsWith('/director/') },
      { to: '/quiz', label: 'Movie Quiz', icon: <FaQuestionCircle />, match: (path: string) => path.startsWith('/quiz') },
      { to: '/about', label: 'About', icon: <FaInfoCircle />, match: (path: string) => path.startsWith('/about') },
    ],
    []
  );

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-title">
          <span className="sidebar-title__accent">cine</span>mate
        </div>
        <button className="close-btn" onClick={onClose} aria-label="Close navigation menu">
          <FaTimes />
        </button>
      </div>

      <nav className="sidebar-nav">
        <ul>
          {items.map(({ to, label, icon, match }) => (
            <li key={to}>
              <Link
                to={to}
                onClick={onClose}
                className={match(location.pathname) ? 'is-active' : undefined}
              >
                <span className="sidebar-nav__icon">{icon}</span>
                <span className="sidebar-nav__label">{label}</span>
                <span className="sidebar-nav__chevron" aria-hidden="true">›</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
