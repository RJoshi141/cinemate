import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as faSolidHeart, faBookmark as faSolidBookmark, faPlay } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faRegularHeart, faBookmark as faRegularBookmark } from '@fortawesome/free-regular-svg-icons';
import { useFavorites } from '../context/FavoritesContext';
import './MovieDetail.css';

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  overview: string;
  release_date: string;
  vote_average: number;
  genres: { name: string }[];
  original_language: string;
  runtime?: number;
  budget?: number;
  tagline?: string;
}

interface CrewMember {
  id: number;
  name: string;
  job: string;
}

interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

interface Provider {
  provider_id: number;
  provider_name: string;
  logo_path: string | null;
}

type CreditItem = {
  label: string;
  value?: string | React.ReactNode;
};

interface WatchProviders {
  flatrate?: Provider[]; // Streaming platforms
  rent?: Provider[];     // Rental platforms
  buy?: Provider[];      // Purchase platforms
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

const MovieDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [cast, setCast] = useState<Cast[]>([]);
  const [crew, setCrew] = useState<CrewMember[]>([]);
  const [rating, setRating] = useState<string | null>(null);
  const [trailer, setTrailer] = useState<string | null>(null);
  const [watchProviders, setWatchProviders] = useState<WatchProviders | null>(null);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const { isFavorite, toggleFavorite, isInWatchlist, toggleWatchlist } = useFavorites();

  const apiKey = 'ce08d866531db79a3a3f6c6fa0728fc7';

  useEffect(() => {
    // Fetch movie details
    axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}`)
      .then(response => {
        setMovie(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching movie details:', err);
        setError('Failed to fetch movie details');
        setLoading(false);
      });

    // Fetch recommendations
    axios.get(`https://api.themoviedb.org/3/movie/${id}/recommendations?api_key=${apiKey}`)
      .then(response => setRecommendations(response.data.results))
      .catch(err => console.error('Error fetching recommendations:', err));

    // Fetch cast and crew
    axios.get(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${apiKey}`)
      .then(response => {
        setCast(response.data.cast.slice(0, 5));
        setCrew(response.data.crew);
      })
      .catch(err => console.error('Error fetching cast and crew:', err));

    // Fetch rating
    axios.get(`https://api.themoviedb.org/3/movie/${id}/release_dates?api_key=${apiKey}`)
      .then(response => {
        const usRating = response.data.results.find((r: any) => r.iso_3166_1 === 'US');
        const certification = usRating?.release_dates[0]?.certification || 'N/A';
        setRating(certification);
      })
      .catch(err => console.error('Error fetching movie rating:', err));

    // Fetch trailer
    axios.get(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${apiKey}`)
      .then(response => {
        const trailerVideo = response.data.results.find(
          (video: any) => video.type === 'Trailer' && video.site === 'YouTube'
        );
        if (trailerVideo) setTrailer(`https://www.youtube.com/embed/${trailerVideo.key}`);
      })
      .catch(err => console.error('Error fetching trailer:', err));

    // Fetch where to watch providers
    axios.get(`https://api.themoviedb.org/3/movie/${id}/watch/providers?api_key=${apiKey}`)
      .then(response => {
        const usProviders = response.data.results?.US;
        setWatchProviders(usProviders || null);
      })
      .catch(err => console.error('Error fetching watch providers:', err));
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!movie) return <div>No movie data found</div>;

  const director = crew.find((member) => member.job === 'Director');
  const producers = crew
    .filter((member) => member.job === 'Producer')
    .map((producer) => producer.name)
    .join(', ');

  const providerCategories: (keyof WatchProviders)[] = ['flatrate', 'rent', 'buy'];
  const providerEntries = providerCategories.flatMap(
    (category) => watchProviders?.[category] ?? []
  );
  const uniqueProviders = providerEntries.reduce<Provider[]>((acc, provider) => {
    if (!acc.some((existing) => existing.provider_id === provider.provider_id)) {
      acc.push(provider);
    }
    return acc;
  }, []);

  const formattedReleaseDate = movie.release_date
    ? new Date(movie.release_date).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  const runtimeLabel = movie.runtime
    ? (() => {
        const hours = Math.floor(movie.runtime / 60);
        const minutes = movie.runtime % 60;
        return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
      })()
    : null;

  const voteAverageLabel = movie.vote_average ? `${movie.vote_average.toFixed(1)}/10` : null;
  const certificationLabel = rating && rating !== 'N/A' ? rating : null;

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Image';

  const genres = movie.genres?.map((genre) => genre.name).filter(Boolean) ?? [];

  const directorLink = director ? (
    <Link to={`/director/${director.id}`} className="director-link">
      {director.name}
    </Link>
  ) : undefined;

  const creditItems: CreditItem[] = [
    { label: 'Director', value: directorLink },
    { label: 'Producers', value: producers || undefined },
    { label: 'Language', value: movie.original_language ? movie.original_language.toUpperCase() : undefined },
    { label: 'Budget', value: movie.budget ? `$${movie.budget.toLocaleString()}` : undefined },
    {
      label: 'Available on',
      value: uniqueProviders.length ? (
        <div className="platform-logos">
          {uniqueProviders.map((provider) => (
            <div
              key={provider.provider_id}
              className="platform-logos__item"
              title={provider.provider_name}
            >
              {provider.logo_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w92${provider.logo_path}`}
                  alt={provider.provider_name}
                />
              ) : (
                <span>{provider.provider_name}</span>
              )}
            </div>
          ))}
        </div>
      ) : undefined,
    },
  ];

  const displayCreditItems = creditItems.filter(
    (item): item is Required<CreditItem> => item.value !== undefined && item.value !== null
  );

  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((part) => part.charAt(0))
      .filter(Boolean)
      .slice(0, 2)
      .join('')
      .toUpperCase();

  const handleFavoriteToggle = () => {
    toggleFavorite({
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      overview: movie.overview,
      release_date: movie.release_date,
      vote_average: movie.vote_average,
    });
  };

  const isMovieFavorite = isFavorite(movie.id);
  const isMovieInWatchlist = isInWatchlist(movie.id);

  const handleWatchlistToggle = () => {
    toggleWatchlist({
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      overview: movie.overview,
      release_date: movie.release_date,
      vote_average: movie.vote_average,
    });
  };

  return (
    <div className="movie-detail">
      <section className="movie-hero">
        <div className="movie-hero__poster">
          <div className="movie-hero__poster-frame">
            <img src={posterUrl} alt={movie.title} className="movie-hero__poster-image" />
            <FontAwesomeIcon
              icon={isMovieFavorite ? faSolidHeart : faRegularHeart}
              className={`favorite-icon ${isMovieFavorite ? 'favorite' : ''}`}
              onClick={handleFavoriteToggle}
            />
          </div>
        </div>

        <div className="movie-hero__body">
          <div className="movie-hero__heading">
            <h1>{movie.title}</h1>
            {movie.tagline && movie.tagline.trim() !== '' && (
              <p className="movie-hero__tagline">{movie.tagline}</p>
            )}
          </div>

          <div className="movie-hero__meta">
            {formattedReleaseDate && <span className="meta-pill">{formattedReleaseDate}</span>}
            {runtimeLabel && <span className="meta-pill">{runtimeLabel}</span>}
            {certificationLabel && <span className="meta-pill">{certificationLabel}</span>}
            {voteAverageLabel && <span className="meta-pill meta-pill--accent">{voteAverageLabel}</span>}
          </div>

          <p className="movie-hero__overview">{movie.overview || 'No overview available.'}</p>

          {genres.length > 0 && (
            <div className="movie-hero__tags">
              {genres.map((genre) => (
                <span key={genre}>{genre}</span>
              ))}
            </div>
          )}

          <div className="movie-hero__actions">
            <button
              type="button"
              className={`watchlist-button ${isMovieInWatchlist ? 'is-watchlisted' : ''}`}
              onClick={handleWatchlistToggle}
            >
              <FontAwesomeIcon icon={isMovieInWatchlist ? faSolidBookmark : faRegularBookmark} />
              {isMovieInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
            </button>
            {trailer && (
              <button
                type="button"
                className="watchlist-button trailer-button"
                onClick={() => setIsTrailerOpen(true)}
              >
                <FontAwesomeIcon icon={faPlay} />
                Play Trailer
              </button>
            )}
          </div>

          {displayCreditItems.length > 0 && (
          <div className="movie-hero__credits">
              {displayCreditItems.map((item) => (
                <div key={item.label}>
                  <span className="label">{item.label}</span>
                  <span className="value">{item.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {trailer && isTrailerOpen && (
        <div className="trailer-modal" onClick={() => setIsTrailerOpen(false)}>
          <div className="trailer-modal__content" onClick={(e) => e.stopPropagation()}>
            <button className="trailer-modal__close" onClick={() => setIsTrailerOpen(false)}>
              ×
            </button>
            <iframe
              src={trailer}
              title="Movie Trailer"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}

      {cast.length > 0 && (
        <section className="movie-section">
          <div className="movie-section__header">
            <h2>Cast</h2>
          </div>
          <div className="cast-rail">
            {cast.map((member) => {
              const profileUrl = member.profile_path
                ? `https://image.tmdb.org/t/p/w185${member.profile_path}`
                : null;

              return (
                <Link
                  key={member.id}
                  to={`/actor/${member.id}/${member.name}`}
                  className="cast-chip"
                >
                  <div className="cast-chip__avatar">
                    {profileUrl ? (
                      <img src={profileUrl} alt={member.name} />
                    ) : (
                      <span className="cast-chip__initials">{getInitials(member.name)}</span>
                    )}
                  </div>
                  <div className="cast-chip__info">
                    <span className="cast-chip__name">{member.name}</span>
                    <span className="cast-chip__role">{member.character || 'Cast'}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {recommendations.length > 0 && (
        <section className="movie-section recommendations">
          <div className="movie-section__header">
            <h2>More Like This</h2>
          </div>
          <div className="recommendations-strip">
            {recommendations.map((recommendedMovie) => {
              const posterSrc = recommendedMovie.poster_path
                ? `https://image.tmdb.org/t/p/w500${recommendedMovie.poster_path}`
                : 'https://via.placeholder.com/200x300?text=No+Image';

              return (
                <div key={recommendedMovie.id} className="recommendations-item movie-card">
                  <Link to={`/movie/${recommendedMovie.id}`} className="recommendations-poster-link">
                    <img src={posterSrc} alt={recommendedMovie.title} className="recommendations-poster" />
                  </Link>
                  <div className="movie-card__info recommendations-info">
                    <span className="recommendations-title">{recommendedMovie.title}</span>
                    <span className="movie-meta">{formatDate(recommendedMovie.release_date)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
};

export default MovieDetail;
