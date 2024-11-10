import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MovieList from './components/MovieList';
import ActorMovies from './components/ActorMovies';
import MovieDetail from './components/MovieDetail';
import GenreList from './components/GenreList'; // Import the GenreList component
import GenreMovies from './components/GenreMovies'; // Import the GenreMovies component
import Header from './components/Header';
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<MovieList />} />
        <Route path="/movie/:id" element={<MovieDetail />} />
        <Route path="/actor/:actorId/:actorName" element={<ActorMovies />} />
        <Route path="/genres" element={<GenreList />} /> {/* Route to the genre list page */}
        <Route path="/genre/:genreId" element={<GenreMovies />} /> {/* Route to show movies for a selected genre */}
      </Routes>
    </Router>
  );
};

export default App;
