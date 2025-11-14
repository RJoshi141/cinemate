import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Route, Routes, useLocation, Navigate } from 'react-router-dom';
import MovieList from './components/MovieList';
import ActorMovies from './components/ActorMovies';
import MovieDetail from './components/MovieDetail';
import GenreList from './components/GenreList';
import GenreMovies from './components/GenreMovies';
import Header from './components/Header';
import DirectorsList from './components/DirectorsList';
import DirectorMovies from './components/DirectorMovies';
import MovieQuiz from './components/MovieQuiz';
import AboutPage from './components/AboutPage';
import ActorList from './components/ActorList';
import LogoAnimation from './components/LogoAnimation';
import FavoritesPage from './components/FavoritesPage';
import WatchlistPage from './components/WatchlistPage';
import { FavoritesProvider } from './context/FavoritesContext';
import './App.css';

// Component to control scroll behavior
const ScrollControl: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    document.body.style.overflow = 'auto';
    document.documentElement.style.overflow = 'auto';

    const scrollToTop = () => {
      window.scrollTo({ top: 0, behavior: 'auto' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    // Wait for the next frame so new layout can render first
    const rafId = requestAnimationFrame(scrollToTop);

    return () => {
      cancelAnimationFrame(rafId);
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [location.pathname]);

  return null;
};

const App: React.FC = () => {
  const [isLogoVisible, setIsLogoVisible] = useState(true);

  useEffect(() => {
    // Hide the logo animation after 5 seconds
    const timer = setTimeout(() => setIsLogoVisible(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <FavoritesProvider>
      <Router>
        {isLogoVisible ? (
          <LogoAnimation />
        ) : (
          <>
            <Header />
            <ScrollControl />
            <Routes>
              <Route path="/" element={<MovieList />} />
              <Route path="/movie/:id" element={<MovieDetail />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="/watchlist" element={<WatchlistPage />} />
              <Route path="/actor/:actorId/:actorName" element={<ActorMovies />} />
              <Route path="/actors" element={<ActorList />} />
              <Route path="/genres" element={<GenreList />} />
              <Route path="/genre/:genreId" element={<GenreMovies />} />
              <Route path="/directors" element={<DirectorsList />} />
              <Route path="/director/:directorId" element={<DirectorMovies />} />
              <Route path="/quiz" element={<MovieQuiz />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </>
        )}
      </Router>
    </FavoritesProvider>
  );
};

export default App;
