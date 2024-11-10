import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaStar, FaList, FaFilm, FaUser, FaVideo, FaCog, FaInfoCircle } from 'react-icons/fa';
import './Sidebar.css';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <button className="close-btn" onClick={onClose}>✕</button>
      <nav>
        <Link to="/" onClick={onClose}><FaHome /> Home</Link>
        <Link to="/favorites" onClick={onClose}><FaStar /> Favorites</Link>
        <Link to="/watchlist" onClick={onClose}><FaList /> Watchlist</Link>
        <Link to="/genres" onClick={onClose}><FaFilm /> Genres</Link>
        <Link to="/actors" onClick={onClose}><FaUser /> Actors</Link>
        <Link to="/directors" onClick={onClose}><FaVideo /> Directors</Link>
        <Link to="/settings" onClick={onClose}><FaCog /> Settings</Link>
        <Link to="/about" onClick={onClose}><FaInfoCircle /> About</Link>
      </nav>
    </div>
  );
};

export default Sidebar;
