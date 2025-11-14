import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as faSolidHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faRegularHeart } from '@fortawesome/free-regular-svg-icons';
import { useFavorites } from '../context/FavoritesContext';
import './GenreMovies.css';

interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  overview: string;
  release_date: string | null;
  vote_average: number;
}

interface Genre {
  id: number;
  name: string;
}

const formatDate = (value?: string | null) => {
  if (!value) return 'Date TBA';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const GenreMovies: React.FC = () => {
  const { genreId } = useParams<{ genreId: string }>();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [genreName, setGenreName] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const apiKey = 'ce08d866531db79a3a3f6c6fa0728fc7';

  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    if (!genreId) return;

    axios
      .get(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genreId}&page=${currentPage}`)
      .then((response) => {
        setMovies(response.data.results);
        setFilteredMovies(response.data.results);
        setTotalPages(response.data.total_pages);
      })
      .catch((err) => console.error('Error fetching movies:', err));

    axios
      .get(`https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}`)
      .then((response) => {
        const genre = response.data.genres.find((g: Genre) => g.id === parseInt(genreId, 10));
        if (genre) {
          setGenreName(genre.name);
        }
      })
      .catch((err) => console.error('Error fetching genre name:', err));
  }, [genreId, currentPage]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = movies.filter(
      (movie) =>
        movie.title.toLowerCase().includes(query) ||
        (movie.release_date ?? '').substring(0, 4).includes(query)
    );

    setFilteredMovies(filtered);
  };

  const handlePageChange = (direction: 'next' | 'prev') => {
    setCurrentPage((prevPage) => {
      if (direction === 'next' && currentPage < totalPages) {
        return prevPage + 1;
      }
      if (direction === 'prev' && currentPage > 1) {
        return prevPage - 1;
      }
      return prevPage;
    });
  };

  return (
    <div className="genre-movies">
      <h1 className="genre-header">{genreName} Movies</h1>

      <div className="search-bar">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search by title or release year"
          className="search-input"
        />
      </div>

      <div className="movies">
        {filteredMovies.length > 0 ? (
          filteredMovies.map((movie) => (
            <div key={movie.id} className="movie-card">
              <div className="movie-poster-container">
                <Link to={`/movie/${movie.id}`}>
                  <img
                    src={
                      movie.poster_path
                        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                        : 'https://via.placeholder.com/200x300?text=No+Image'
                    }
                    alt={movie.title}
                    className="movie-poster"
                  />
                </Link>
                <FontAwesomeIcon
                  icon={isFavorite(movie.id) ? faSolidHeart : faRegularHeart}
                  className={`favorite-icon ${isFavorite(movie.id) ? 'favorite' : ''}`}
                  onClick={() =>
                    toggleFavorite({
                      id: movie.id,
                      title: movie.title,
                      poster_path: movie.poster_path,
                      overview: movie.overview,
                      release_date: movie.release_date ?? undefined,
                      vote_average: movie.vote_average,
                    })
                  }
                />
              </div>
              <div className="movie-card__info">
                <h2>{movie.title}</h2>
                <p className="movie-meta">{formatDate(movie.release_date)}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No movies found</p>
        )}
      </div>

      <div className="pagination">
        <button onClick={() => handlePageChange('prev')} disabled={currentPage === 1} aria-label="Previous page">
          <span aria-hidden="true">‹</span>
        </button>

        <div className="page-info">
          Page {currentPage} of {totalPages}
        </div>

        <button onClick={() => handlePageChange('next')} disabled={currentPage === totalPages} aria-label="Next page">
          <span aria-hidden="true">›</span>
        </button>
      </div>
    </div>
  );
};

export default GenreMovies;
