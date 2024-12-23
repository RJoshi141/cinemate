import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as faSolidHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faRegularHeart } from '@fortawesome/free-regular-svg-icons';

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
  const [favorites, setFavorites] = useState<number[]>([]); // State to track favorite movies
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [genres, setGenres] = useState<{ id: number; name: string }[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    const apiKey = 'ce08d866531db79a3a3f6c6fa0728fc7';

    // Fetch genres
    axios
      .get(`${process.env.REACT_APP_API_URL}/genre/movie/list?api_key=${apiKey}`)
      .then((response) => setGenres(response.data.genres))
      .catch((err) => console.error('Error fetching genres:', err));

    // Build URL based on search query, selected genre, and pagination
    let url = `${process.env.REACT_APP_API_URL}/movie/popular?api_key=${apiKey}&page=${currentPage}`;
    if (searchQuery) {
      url = `${process.env.REACT_APP_API_URL}/search/movie?api_key=${apiKey}&query=${searchQuery}&page=${currentPage}`;
    } else if (selectedGenre) {
      url = `${process.env.REACT_APP_API_URL}/discover/movie?api_key=${apiKey}&with_genres=${selectedGenre}&page=${currentPage}`;
    }

    // Fetch movies based on URL
    axios
      .get(url)
      .then((response) => {
        setMovies(response.data.results);
        setTotalPages(response.data.total_pages);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching movies:', err);
        setError('Failed to fetch movie data');
        setLoading(false);
      });
  }, [searchQuery, selectedGenre, currentPage]);

  // Handle toggle favorite
  const toggleFavorite = (id: number) => {
    setFavorites((prevFavorites) =>
      prevFavorites.includes(id)
        ? prevFavorites.filter((favId) => favId !== id)
        : [...prevFavorites, id]
    );
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
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
          placeholder="Search for a movie..."
        />

        {/* Genre Dropdown */}
        <select value={selectedGenre} onChange={(e) => setSelectedGenre(e.target.value)} className="genre-dropdown">
          <option value="">All Genres</option>
          {genres.map((genre) => (
            <option key={genre.id} value={genre.id}>
              {genre.name}
            </option>
          ))}
        </select>
      </div>

      {/* Movies Section */}
      <div className="movies">
        {movies.length > 0 ? (
          movies.map((movie) => (
            <div key={movie.id} className="movie-card">
              <div className="movie-poster-container">
                <Link to={`/movie/${movie.id}`}>
                  <img
                    src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'path_to_fallback_image.jpg'}
                    alt={movie.title}
                    className="movie-poster"
                  />
                </Link>
                <FontAwesomeIcon
                  icon={favorites.includes(movie.id) ? faSolidHeart : faRegularHeart}
                  className={`favorite-icon ${favorites.includes(movie.id) ? 'favorite' : ''}`}
                  onClick={() => toggleFavorite(movie.id)}
                />
              </div>
              <h2>{movie.title}</h2>
              <p>
                <strong>Release Date:</strong> {movie.release_date}
              </p>
              <p>
                <strong>Rating:</strong> {movie.vote_average}
              </p>
              <p className="movie-overview">{movie.overview}</p>
            </div>
          ))
        ) : (
          <div>No movies found. Try a different search or filter.</div>
        )}
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)} className="pagination-button">
          Previous
        </button>
        <span>
          {currentPage} of {totalPages}
        </span>
        <button onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)} className="pagination-button">
          Next
        </button>
      </div>
    </div>
  );
};

export default MovieList;
