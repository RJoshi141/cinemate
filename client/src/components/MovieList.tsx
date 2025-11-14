import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as faSolidHeart, faMagnifyingGlass, faSliders } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faRegularHeart } from '@fortawesome/free-regular-svg-icons';
import { faCircleXmark } from '@fortawesome/free-regular-svg-icons';
import { useFavorites } from '../context/FavoritesContext';

interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  overview: string;
  release_date: string | null;
  vote_average: number;
  genre_ids: number[];
}

interface QuizRecommendation {
  params: Record<string, string>;
  tags: string[];
  headline: string;
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

const MovieList: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [genres, setGenres] = useState<{ id: number; name: string }[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [quizRecommendation, setQuizRecommendation] = useState<QuizRecommendation | null>(null);
  const { isFavorite, toggleFavorite } = useFavorites();
  const location = useLocation();
  const navigate = useNavigate();

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleGenreChange = (value: string) => {
    setSelectedGenre(value);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedGenre('');
    setQuizRecommendation(null);
    setCurrentPage(1);
  };

  const handleClearQuiz = () => {
    setQuizRecommendation(null);
    setCurrentPage(1);
  };

  useEffect(() => {
    const state = location.state as { quizRecommendation?: QuizRecommendation } | null;
    if (state?.quizRecommendation) {
      const incoming = state.quizRecommendation;
      setQuizRecommendation(incoming);
      setSearchQuery('');
      setSelectedGenre('');
      setCurrentPage(1);
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  useEffect(() => {
    const apiKey = 'ce08d866531db79a3a3f6c6fa0728fc7';

    setLoading(true);
    setError(null);

    // Fetch genres
    axios
      .get(`${process.env.REACT_APP_API_URL}/genre/movie/list?api_key=${apiKey}`)
      .then((response) => setGenres(response.data.genres))
      .catch((err) => console.error('Error fetching genres:', err));

    const params = new URLSearchParams({
      api_key: apiKey,
      page: currentPage.toString(),
    });

    let endpoint = '/movie/popular';

    if (quizRecommendation) {
      endpoint = '/discover/movie';
      Object.entries(quizRecommendation.params).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        }
      });
    } else if (searchQuery) {
      endpoint = '/search/movie';
      params.set('query', searchQuery);
    } else if (selectedGenre) {
      endpoint = '/discover/movie';
      params.set('with_genres', selectedGenre);
    }

    if (!params.has('include_adult')) {
      params.set('include_adult', 'false');
    }

    // Fetch movies based on URL
    axios
      .get(`${process.env.REACT_APP_API_URL}${endpoint}?${params.toString()}`)
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
  }, [searchQuery, selectedGenre, currentPage, quizRecommendation]);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="movie-list">
      <div className="movie-list-header">
        <h1>Now Streaming</h1>
        <p className="intro-copy">
          Discover the films everyone is talking about. Refine by genre or search for a title to dive deeper into the world of cinema.
        </p>
      </div>

      {/* Search and Filter Section */}
      <div className="search-filter">
        <div className="search-group">
          <FontAwesomeIcon icon={faMagnifyingGlass} className="search-icon" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="search-input"
            placeholder="Search for a movie or keyword"
            aria-label="Search movies"
          />
          {searchQuery && (
            <button type="button" className="clear-search" onClick={() => handleSearchChange('')}>
              <FontAwesomeIcon icon={faCircleXmark} />
              <span className="sr-only">Clear search</span>
            </button>
          )}
        </div>

        {/* Genre Dropdown */}
        <div className="filter-group">
          <FontAwesomeIcon icon={faSliders} className="filter-icon" />
          <select
            value={selectedGenre}
            onChange={(e) => handleGenreChange(e.target.value)}
            className="genre-dropdown"
            aria-label="Filter by genre"
          >
            <option value="">All Genres</option>
            {genres.map((genre) => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
              </option>
            ))}
          </select>
          {(searchQuery || selectedGenre) && (
            <button type="button" className="reset-filters" onClick={handleResetFilters}>
              Reset
            </button>
          )}
        </div>
      </div>

      {(searchQuery || selectedGenre) && (
        <div className="active-filters" aria-live="polite">
          {searchQuery && <span className="filter-pill">Search: {searchQuery}</span>}
          {selectedGenre && (
            <span className="filter-pill">
              Genre:{' '}
              {genres.find((genre) => `${genre.id}` === selectedGenre)?.name ?? selectedGenre}
            </span>
          )}
        </div>
      )}

      {quizRecommendation && (
        <div className="quiz-recommendation-banner" aria-live="polite">
          <div className="quiz-recommendation-copy">
            <span className="quiz-recommendation-title">{quizRecommendation.headline}</span>
            {quizRecommendation.tags.length > 0 && (
              <span className="quiz-recommendation-tags">{quizRecommendation.tags.join(' • ')}</span>
            )}
          </div>
          <button type="button" className="quiz-recommendation-clear" onClick={handleClearQuiz}>
            Clear quiz picks
          </button>
        </div>
      )}

      {/* Movies Section */}
      <div className="movies">
        {movies.length > 0 ? (
          movies.map((movie) => (
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
                      genre_ids: movie.genre_ids,
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
          <div>No movies found. Try a different search or filter.</div>
        )}
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button
          onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
          className="pagination-button pagination-button--nav"
          aria-label="Previous page"
        >
          <span aria-hidden="true">‹</span>
        </button>
        <span>
          {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
          className="pagination-button pagination-button--nav"
          aria-label="Next page"
        >
          <span aria-hidden="true">›</span>
        </button>
      </div>
    </div>
  );
};

export default MovieList;
