import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
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

interface Genre {
  id: number;
  name: string;
}

const GenreMovies: React.FC = () => {
  const { genreId } = useParams<{ genreId: string }>();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genreName, setGenreName] = useState<string>('');
  const apiKey = 'ce08d866531db79a3a3f6c6fa0728fc7';

  useEffect(() => {
    // Fetch movies based on genre
    if (genreId) {
      axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genreId}`)
        .then(response => {
          setMovies(response.data.results);
        })
        .catch(err => console.error('Error fetching movies:', err));
    }

    // Fetch genre name based on genreId
    if (genreId) {
      axios.get(`https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}`)
        .then(response => {
          const genre = response.data.genres.find((genre: Genre) => genre.id === parseInt(genreId));
          if (genre) {
            setGenreName(genre.name);
          }
        })
        .catch(err => console.error('Error fetching genre name:', err));
    }
  }, [genreId]);

  return (
    <div className="genre-movies">
      <h1 className="genre-header">{genreName} Movies</h1>
      <div className="movies-grid">
        {movies.map(movie => (
          <div key={movie.id} className="movie-card">
            <Link to={`/movie/${movie.id}`}>
              <img
                src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'path_to_fallback_image.jpg'}
                alt={movie.title}
                className="movie-poster"
              />
            </Link>
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
