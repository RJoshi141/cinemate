import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MovieList from './components/MovieList';
import ActorMovies from './components/ActorMovies';
import MovieDetail from './components/MovieDetail';
import GenreList from './components/GenreList';
import GenreMovies from './components/GenreMovies';
import Header from './components/Header';
import DirectorsList from './components/DirectorsList';
import DirectorMovies from './components/DirectorMovies';
import MovieQuiz from './components/MovieQuiz';
import RecommendationsPage from './components/RecommendationsPage';
import AboutPage from './components/AboutPage';
import ActorList from './components/ActorList';
import LogoAnimation from './components/LogoAnimation';
import './App.css';

const App: React.FC = () => {
  const [isLogoVisible, setIsLogoVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLogoVisible(false), 5000); // 5 seconds delay
    return () => clearTimeout(timer);
  }, []);

  return isLogoVisible ? (
    <LogoAnimation />
  ) : (
    <Router>
      <Header />
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
