// src/components/MovieList.tsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Update the Movie interface to reflect the data structure from the backend
interface Movie {
  id: number;
  title: string;
  poster_path: string;
  overview: string;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
}

const MovieList: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      axios
        .get(`${process.env.REACT_APP_API_URL}/movies`)  // Using the environment variable
        .then((response) => {
          setMovies(response.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);  // Log the actual error to see details
          setError('Failed to fetch movie data');
          setLoading(false);
        });
    }, []);
    

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="movie-list">
      <h1>Popular Movies</h1>
      <div className="movies">
        {movies.map((movie) => (
          <div key={movie.id} className="movie-card">
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="movie-poster"
            />
            <h2>{movie.title}</h2>
            <p>{movie.overview}</p>
            <p><strong>Release Date:</strong> {movie.release_date}</p>
            <p><strong>Rating:</strong> {movie.vote_average}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovieList;
