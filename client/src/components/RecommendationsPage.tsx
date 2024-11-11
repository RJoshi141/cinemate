import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './RecommendationsPage.css';

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  overview: string;
  release_date: string;
  vote_average: number;
}

const RecommendationsPage: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]); // List of recommended movies
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>(''); // Search query for filtering movies
  const [currentPage, setCurrentPage] = useState<number>(1); // Current page number
  const [totalPages, setTotalPages] = useState<number>(1); // Total number of pages

  useEffect(() => {
    const apiKey = 'ce08d866531db79a3a3f6c6fa0728fc7';

    // Fetch movie data based on the current page
    axios
      .get(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&page=${currentPage}`)
      .then((response) => {
        setMovies(response.data.results);
        setTotalPages(response.data.total_pages); // Set total pages from API response
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching movies:', err);
        setError('Failed to fetch movie data');
        setLoading(false);
      });
  }, [currentPage]); // Trigger the useEffect whenever the currentPage changes

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handlePageChange = (direction: 'next' | 'prev') => {
    setCurrentPage((prevPage) => {
      if (direction === 'next' && currentPage < totalPages) {
        return prevPage + 1;
      } else if (direction === 'prev' && currentPage > 1) {
        return prevPage - 1;
      }
      return prevPage;
    });
  };

  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="recommendations-page">
      <h1 className="recommendations-header">You might like these</h1>

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search for a movie..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="search-input"
        />
      </div>

      <div className="movies-grid">
        {filteredMovies.length > 0 ? (
          filteredMovies.map((movie) => (
            <div key={movie.id} className="movie-card">
              <Link to={`/movie/${movie.id}`}>
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="movie-poster"
                />
              </Link>
              <h3>{movie.title}</h3>
              <p><strong>Release Date:</strong> {movie.release_date}</p>
              <p className="movie-overview">{movie.overview}</p>
            </div>
          ))
        ) : (
          <div>No movies found matching your search.</div>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="pagination">
        <button 
          onClick={() => handlePageChange('prev')} 
          disabled={currentPage === 1}>
          Previous
        </button>

        <div className="page-info">
          Page {currentPage} of {totalPages}
        </div>

        <button 
          onClick={() => handlePageChange('next')} 
          disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
};

export default RecommendationsPage;
