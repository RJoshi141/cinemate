import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { faBookmark as faSolidBookmark } from '@fortawesome/free-solid-svg-icons';
import { useFavorites } from '../context/FavoritesContext';

const formatDate = (value?: string) => {
  if (!value) return 'Date TBA';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const WatchlistPage: React.FC = () => {
  const { watchlist, toggleWatchlist, removeFromWatchlist } = useFavorites();

  if (watchlist.length === 0) {
    return (
      <div className="favorites-page empty">
        <h1>Your Watchlist</h1>
        <p>You haven't added any movies to your watchlist yet.</p>
        <Link to="/" className="back-to-home">
          Browse Movies
        </Link>
      </div>
    );
  }

  return (
    <div className="favorites-page watchlist-page">
      <h1>Your Watchlist</h1>
      <div className="movies">
        {watchlist.map((movie) => (
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
                icon={faSolidBookmark}
                className="favorite-icon favorite"
                onClick={() => toggleWatchlist(movie)}
                title="Remove from watchlist"
              />
            </div>
            <div className="movie-card__info">
              <h2>{movie.title}</h2>
              <p className="movie-meta">{formatDate(movie.release_date)}</p>
              <button className="remove-favorite-button" onClick={() => removeFromWatchlist(movie.id)}>
                <FontAwesomeIcon icon={faTrashAlt} /> Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WatchlistPage;

