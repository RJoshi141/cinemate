import logo from './logo.svg';
import React from 'react';
import './App.css';
import MovieList from './components/MovieList'; // Import MovieList component

function App() {
  return (
    <div className="App">
      <h1>Cinemate</h1>
      <MovieList /> {/* Render MovieList here */}
    </div>
  );
}

export default App;