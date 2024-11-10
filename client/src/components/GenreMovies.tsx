import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './GenreMovies.css';

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  overview: string;
  release_date: string;
  vote_average: number;
}

const GenreMovies: React.FC = () => {
  const { genreId } = useParams<{ genreId: string }>();
  const [movies, setMovies] = useState<Movie[]>([]);
  const apiKey = 'ce08d866531db79a3a3f6c6fa0728fc7';

  useEffect(() => {
    if (genreId) {
      axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genreId}`)
        .then(response => {
          setMovies(response.data.results);
        })
        .catch(err => console.error('Error fetching movies:', err));
    }
  }, [genreId]);

  return (
    <div className="genre-movies">
      <h1>Movies in this Genre</h1>
      <div className="movies-grid">
        {movies.map(movie => (
          <div key={movie.id} className="movie-card">
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="movie-poster"
            />
            <h3>{movie.title}</h3>
            <p className="movie-overview">{movie.overview}</p>
            <p><strong>Release Date:</strong> {movie.release_date}</p>
            <p><strong>Rating:</strong> {movie.vote_average}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GenreMovies;
