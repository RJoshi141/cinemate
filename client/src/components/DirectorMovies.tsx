// src/components/DirectorMovies.tsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './DirectorMovies.css';

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
}

const DirectorMovies: React.FC = () => {
  const { directorId } = useParams<{ directorId: string }>();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const apiKey = 'ce08d866531db79a3a3f6c6fa0728fc7';

  useEffect(() => {
    if (directorId) {
      axios.get(`https://api.themoviedb.org/3/person/${directorId}/movie_credits?api_key=${apiKey}&language=en-US`)
        .then(response => {
          setMovies(response.data.crew);
        })
        .catch(err => console.error('Error fetching director movies:', err));
    }
  }, [directorId]);

  const filteredMovies = movies.filter(movie =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="director-movies">
      <h1 className="director-header">Movies by Director</h1>
      <div className="search-bar">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search Movies by Title"
          className="search-input"
        />
      </div>
      <div className="movies-grid">
        {filteredMovies.map(movie => (
          <div key={movie.id} className="movie-card">
            <img
              src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'path_to_fallback_image.jpg'}
              alt={movie.title}
              className="movie-poster"
            />
            <h3>{movie.title}</h3>
            <p><strong>Release Date:</strong> {movie.release_date}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DirectorMovies;
