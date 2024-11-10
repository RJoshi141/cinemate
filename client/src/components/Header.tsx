import React, { useState, useEffect } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import Sidebar from './Sidebar';
import './Header.css';

const Header: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

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
      <header className="header">
        <button onClick={toggleSidebar} className="menu-icon">
          {isSidebarOpen ? <FaTimes /> : <FaBars />}
        </button>
        <div className="logo">Cinemate</div>
        <div className="tagline">Your Movie Companion</div>
      </header>
      <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
      <div className={`overlay ${isSidebarOpen ? 'dimmed' : ''}`} />
    </>
  );
};

export default Header;
