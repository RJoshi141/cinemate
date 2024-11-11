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
  const [movies, setMovies] = useState<Movie[]>([]); // List of all movies in the genre
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]); // Filtered list of movies based on search
  const [genreName, setGenreName] = useState<string>(''); // Genre name
  const [searchQuery, setSearchQuery] = useState<string>(''); // Search query
  const [currentPage, setCurrentPage] = useState<number>(1); // Current page number
  const [totalPages, setTotalPages] = useState<number>(1); // Total number of pages
  const apiKey = 'ce08d866531db79a3a3f6c6fa0728fc7';

  useEffect(() => {
    // Fetch movies based on genre and current page
    if (genreId) {
      axios
        .get(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genreId}&page=${currentPage}`)
        .then((response) => {
          setMovies(response.data.results);
          setFilteredMovies(response.data.results); // Initialize filtered movies
          setTotalPages(response.data.total_pages); // Set total pages from API response
        })
        .catch((err) => console.error('Error fetching movies:', err));
    }

    // Fetch genre name based on genreId
    if (genreId) {
      axios
        .get(`https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}`)
        .then((response) => {
          const genre = response.data.genres.find((genre: Genre) => genre.id === parseInt(genreId));
          if (genre) {
            setGenreName(genre.name);
          }
        })
        .catch((err) => console.error('Error fetching genre name:', err));
    }
  }, [genreId, currentPage]); // Trigger useEffect when genreId or currentPage changes

  // Filter movies based on search query
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    // Filter by title or release year (extract year from release_date)
    const filtered = movies.filter(
      (movie) =>
        movie.title.toLowerCase().includes(query) ||
        movie.release_date.substring(0, 4).includes(query) // Compare only the year part of the release date
    );

    setFilteredMovies(filtered); // Update filtered movies
  };

  // Pagination logic
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

  return (
    <div className="genre-movies">
      <h1 className="genre-header">{genreName} Movies</h1>

      {/* Search filter */}
      <div className="search-bar">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search by title or release year"
          className="search-input"
        />
      </div>

      {/* Displaying filtered movies */}
      <div className="movies-grid">
        {filteredMovies.length > 0 ? (
          filteredMovies.map((movie) => (
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
          ))
        ) : (
          <p>No movies found</p>
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

export default GenreMovies;
