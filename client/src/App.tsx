// src/App.tsx

import React from 'react';
import './App.css';
import MovieList from './components/MovieList';  // Import MovieList component

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Cinemate</h1>
      </header>
      <MovieList />  {/* Display the MovieList component */}
    </div>
  );
}

export default App;
