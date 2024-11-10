import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MovieList from './components/MovieList';
import ActorMovies from './components/ActorMovies';
import MovieDetail from './components/MovieDetail';
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
      </Routes>
    </Router>
  );
};

export default App;
