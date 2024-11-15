import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import MovieList from './components/MovieList';
import ActorMovies from './components/ActorMovies';
import MovieDetail from './components/MovieDetail';
import GenreList from './components/GenreList'; // Import the GenreList component
import GenreMovies from './components/GenreMovies'; // Import the GenreMovies component
import Header from './components/Header';
import DirectorsList from './components/DirectorsList'; // Import DirectorsList component
import DirectorMovies from './components/DirectorMovies'; // Import DirectorMovies component
import MovieQuiz from './components/MovieQuiz'; // Import the MovieQuiz component
import RecommendationsPage from './components/RecommendationsPage';
import AboutPage from './components/AboutPage';
import ActorList from './components/ActorList'; // Import the ActorList component
import './App.css';

// Component to control scroll behavior
const ScrollControl: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    // Disable scroll for the Genre List page only
    if (location.pathname === '/genres') {
      document.body.style.overflow = 'hidden';  // Disable scroll on genre list page
    } else {
      document.body.style.overflow = 'auto';  // Enable scroll on all other pages
    }
  }, [location]);

  return null;
};

const App: React.FC = () => {
  return (
    <Router>
      <Header />
      <ScrollControl /> {/* Add ScrollControl here to manage scroll behavior */}
      <Routes>
        <Route path="/" element={<MovieList />} />
        <Route path="/movie/:id" element={<MovieDetail />} />
        <Route path="/actor/:actorId/:actorName" element={<ActorMovies />} />
        <Route path="/actors" element={<ActorList />} />
        <Route path="/genres" element={<GenreList />} /> 
        <Route path="/genre/:genreId" element={<GenreMovies />} />
        <Route path="/directors" element={<DirectorsList />} /> 
        <Route path="/director/:directorId" element={<DirectorMovies />} />
        <Route path="/quiz" element={<MovieQuiz />} />
        <Route path="/recommendations" element={<RecommendationsPage />} />
        <Route path="/about" element={<AboutPage />} /> 

      </Routes>
    </Router>
  );
};

export default App;
