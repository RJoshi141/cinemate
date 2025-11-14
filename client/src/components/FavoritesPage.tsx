import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as faSolidHeart } from '@fortawesome/free-solid-svg-icons';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
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

const FavoritesPage: React.FC = () => {
  const { favorites, toggleFavorite, removeFavorite } = useFavorites();

  if (favorites.length === 0) {
    return (
      <div className="favorites-page empty">
        <h1>Your Favorites</h1>
        <p>You haven't added any movies to your favorites yet.</p>
        <Link to="/" className="back-to-home">
          Browse Movies
        </Link>
      </div>
    );
  }

  return (
    <div className="favorites-page">
      <h1>Your Favorites</h1>
      <div className="movies">
        {favorites.map((movie) => (
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
                icon={faSolidHeart}
                className="favorite-icon favorite"
                onClick={() => toggleFavorite(movie)}
                title="Remove from favorites"
              />
            </div>
            <div className="movie-card__info">
              <h2>{movie.title}</h2>
              <p className="movie-meta">{formatDate(movie.release_date)}</p>
              <button className="remove-favorite-button" onClick={() => removeFavorite(movie.id)}>
                <FontAwesomeIcon icon={faTrashAlt} /> Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoritesPage;

