import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

// Movie interface
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
  const [searchQuery, setSearchQuery] = useState<string>(''); // New state for search query

  useEffect(() => {
    const apiKey = 'ce08d866531db79a3a3f6c6fa0728fc7';
    let url = `${process.env.REACT_APP_API_URL}/movie/popular?api_key=${apiKey}`;

    // If searchQuery is not empty, update the URL to search for movies
    if (searchQuery) {
      url = `${process.env.REACT_APP_API_URL}/search/movie?api_key=${apiKey}&query=${searchQuery}`;
    }

    axios
      .get(url)
      .then((response) => {
        setMovies(response.data.results);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching movies:', err);
        setError('Failed to fetch movie data');
        setLoading(false);
      });
  }, [searchQuery]); // Re-fetch data whenever the searchQuery changes

  // Handle changes in the search input
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="movie-list">
      <h1>Popular Movies</h1>

      {/* Search Bar */}
      <input
        type="text"
        value={searchQuery}
        onChange={handleSearchChange}
        className="search-input"
        placeholder="Search for a movie..."
      />

      <div className="movies">
        {movies.length > 0 ? (
          movies.map((movie) => (
            <div key={movie.id} className="movie-card">
              <Link to={`/movie/${movie.id}`}>
                <img
                  src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'path_to_fallback_image.jpg'}
                  alt={movie.title}
                  className="movie-poster"
                />
              </Link>
              <h2>{movie.title}</h2>
              <p className="movie-overview">{movie.overview}</p>
              <p><strong>Release Date:</strong> {movie.release_date}</p>
              <p><strong>Rating:</strong> {movie.vote_average}</p>
            </div>
          ))
        ) : (
          <div>No movies found. Try a different search.</div>
        )}
      </div>
    </div>
  );
};

export default MovieList;
