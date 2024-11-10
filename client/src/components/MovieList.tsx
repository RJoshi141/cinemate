import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

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
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedGenre, setSelectedGenre] = useState<string>(''); // New state for genre
  const [genres, setGenres] = useState<{ id: number; name: string }[]>([]); // State for genres list

  useEffect(() => {
    const apiKey = 'ce08d866531db79a3a3f6c6fa0728fc7';

    // Fetch genres
    axios
      .get(`${process.env.REACT_APP_API_URL}/genre/movie/list?api_key=${apiKey}`)
      .then((response) => setGenres(response.data.genres))
      .catch((err) => console.error('Error fetching genres:', err));

    // Build URL based on search query and selected genre
    let url = `${process.env.REACT_APP_API_URL}/movie/popular?api_key=${apiKey}`;
    if (searchQuery) {
      url = `${process.env.REACT_APP_API_URL}/search/movie?api_key=${apiKey}&query=${searchQuery}`;
    } else if (selectedGenre) {
      url = `${process.env.REACT_APP_API_URL}/discover/movie?api_key=${apiKey}&with_genres=${selectedGenre}`;
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
  }, [searchQuery, selectedGenre]);

  // Handle changes in the search input
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  // Handle genre selection
  const handleGenreChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedGenre(event.target.value);
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="movie-list">
      <h1>Popular Movies</h1>

      {/* Search and Filter Section */}
      <div className="search-filter">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          className="search-input"
          placeholder="Search for a movie..."
        />
        
        {/* Genre Dropdown */}
        <select value={selectedGenre} onChange={handleGenreChange} className="genre-dropdown">
          <option value="">All Genres</option>
          {genres.map((genre) => (
            <option key={genre.id} value={genre.id}>{genre.name}</option>
          ))}
        </select>
      </div>

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
              <p><strong>Release Date:</strong> {movie.release_date}</p>
              <p><strong>Rating:</strong> {movie.vote_average}</p>
              <p className="movie-overview">{movie.overview}</p>
            </div>
          ))
        ) : (
          <div>No movies found. Try a different search or filter.</div>
        )}
      </div>
    </div>
  );
};

export default MovieList;
