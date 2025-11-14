import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as faSolidHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faRegularHeart } from '@fortawesome/free-regular-svg-icons';
import { useFavorites } from '../context/FavoritesContext';
import './ActorMovies.css';

interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  genre_ids?: number[];
  overview: string;
  release_date: string;
  vote_average: number;
}

interface ActorDetails {
  id: number;
  name: string;
  biography: string;
  profile_path: string | null;
  birthday: string | null;
  place_of_birth: string | null;
  popularity?: number;
  known_for_department?: string;
}

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

const ActorMovies: React.FC = () => {
  const { actorId, actorName } = useParams<{ actorId: string; actorName: string }>();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<{ id: number; name: string }[]>([]);
  const [genre, setGenre] = useState<string>('');
  const [actorBio, setActorBio] = useState<string>('');
  const [actorDetails, setActorDetails] = useState<ActorDetails | null>(null);
  const [isBioExpanded, setIsBioExpanded] = useState<boolean>(false); // Track bio expansion state
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const apiKey = 'ce08d866531db79a3a3f6c6fa0728fc7';
  const { isFavorite, toggleFavorite } = useFavorites();

  // Fetch genres list
  useEffect(() => {
    axios
      .get(`https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}`)
      .then((response) => setGenres(response.data.genres))
      .catch((error) => console.error('Error fetching genres:', error));
  }, []);

  // Fetch movies by actor ID
  useEffect(() => {
    if (!actorId) return;

    const controller = new AbortController();
    let isActive = true;

    const fetchMovies = async () => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/person/${actorId}/movie_credits?api_key=${apiKey}&language=en-US`,
          { signal: controller.signal },
        );
        if (!isActive) return;

        const moviesData = (response.data.cast || [])
          .map((movie: any) => ({
            id: movie.id,
            title: movie.title,
            poster_path: movie.poster_path,
            genre_ids: movie.genre_ids,
            overview: movie.overview,
            release_date: movie.release_date,
            vote_average: movie.vote_average,
          }))
          .filter((movie: Movie) => movie.title);

        const unique = new Map<number, Movie>();
        moviesData.forEach((movie: Movie) => {
          if (!unique.has(movie.id)) {
            unique.set(movie.id, movie);
          }
        });

        const sorted = Array.from(unique.values()).sort((a, b) => {
          const dateA = a.release_date ? new Date(a.release_date).getTime() : 0;
          const dateB = b.release_date ? new Date(b.release_date).getTime() : 0;
          return dateB - dateA;
        });

        setMovies(sorted);

        if (!sorted.length) {
          setErrorMessage('We could not find any films featuring this actor.');
        }
      } catch (error: unknown) {
        if (!isActive || axios.isCancel(error)) return;
        console.error('Error fetching actor movies:', error);
        setErrorMessage('Something went wrong while loading this filmography. Please try again.');
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    fetchMovies();

    return () => {
      isActive = false;
      controller.abort();
    };
  }, [actorId]);

  // Fetch actor biography and profile details
  useEffect(() => {
    if (!actorId) return;

    axios
      .get(`https://api.themoviedb.org/3/person/${actorId}?api_key=${apiKey}`)
      .then((response) => {
        const details: ActorDetails = response.data;
        setActorDetails(details);
        setActorBio(details.biography || '');
      })
      .catch((error) => console.error('Error fetching actor biography:', error));
  }, [actorId]);

  const visibleMovies = useMemo(() => {
    const genreId = genre ? parseInt(genre, 10) : null;
    const query = searchTerm.trim().toLowerCase();

    return movies.filter((movie) => {
      const matchesGenre = genreId ? movie.genre_ids?.includes(genreId) : true;
      const matchesQuery = query ? movie.title.toLowerCase().includes(query) : true;
      return matchesGenre && matchesQuery;
    });
  }, [genre, movies, searchTerm]);

  // Toggle bio expanded/collapsed
  const toggleBio = () => {
    setIsBioExpanded(!isBioExpanded);
  };

  const biography = actorBio || 'We are still gathering biography details for this actor.';
  const canToggleBio = biography.length > 220;
  const popularity = actorDetails?.popularity ? Math.round(actorDetails.popularity) : null;
  const birthplace = actorDetails?.place_of_birth;
  const birthday = actorDetails?.birthday ? formatDate(actorDetails.birthday) : null;

  return (
    <div className="actor-filmography">
      <div className="actor-filmography__hero">
        <div className="actor-filmography__media">
          {actorDetails?.profile_path ? (
            <img
              src={`https://image.tmdb.org/t/p/w500${actorDetails.profile_path}`}
              alt={actorName ?? 'Actor profile'}
              className="actor-filmography__image"
              loading="lazy"
            />
          ) : (
            <div className="actor-filmography__image actor-filmography__image--placeholder">
              <span role="img" aria-label="No profile available">
                🎬
              </span>
            </div>
          )}
        </div>
        <div className="actor-filmography__content">
          <span className="actor-filmography__badge">
            {actorDetails?.known_for_department || 'Actor'}
          </span>
          <h1 className="actor-filmography__title">{actorName}</h1>
          <div className="actor-filmography__bio">
            <p className={isBioExpanded ? 'actor-filmography__bio-text actor-filmography__bio-text--expanded' : 'actor-filmography__bio-text'}>
              {biography}
            </p>
            {canToggleBio && (
              <button type="button" className="actor-filmography__bio-toggle" onClick={toggleBio}>
                {isBioExpanded ? 'Read less' : 'Read more'}
              </button>
            )}
          </div>
          <div className="actor-filmography__stats">
            {popularity !== null && (
              <div className="actor-filmography__stat">
                <span className="actor-filmography__stat-label">Popularity</span>
                <span className="actor-filmography__stat-value">{popularity}</span>
              </div>
            )}
            {birthday && (
              <div className="actor-filmography__stat">
                <span className="actor-filmography__stat-label">Born</span>
                <span className="actor-filmography__stat-value">{birthday}</span>
              </div>
            )}
            {birthplace && (
              <div className="actor-filmography__stat">
                <span className="actor-filmography__stat-label">Origin</span>
                <span className="actor-filmography__stat-value">{birthplace}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="actor-filmography__body">
        <div className="actor-filmography__controls">
          <div className="actor-filmography__search">
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search filmography"
              className="actor-filmography__search-input"
              aria-label="Search movies by title"
            />
          </div>
          <select
            value={genre}
            onChange={(event) => setGenre(event.target.value)}
            className="actor-filmography__filter"
            aria-label="Filter by genre"
          >
            <option value="">All genres</option>
            {genres.map((g) => (
              <option key={g.id} value={g.id.toString()}>
                {g.name}
              </option>
            ))}
          </select>
        </div>

        {errorMessage && !isLoading && (
          <div className="actor-filmography__state actor-filmography__state--info">
            {errorMessage}
          </div>
        )}

        {isLoading ? (
          <div className="actor-filmography__grid">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="movie-card movie-card--skeleton">
                <div className="movie-poster skeleton-block" />
                <div className="movie-card__info">
                  <div className="skeleton-line skeleton-line--title" />
                  <div className="skeleton-line skeleton-line--meta" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="actor-filmography__grid">
            {visibleMovies.map((movie) => (
              <div className="movie-card" key={movie.id}>
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
                      loading="lazy"
                    />
                  </Link>
                  <FontAwesomeIcon
                    icon={isFavorite(movie.id) ? faSolidHeart : faRegularHeart}
                    className={`favorite-icon ${isFavorite(movie.id) ? 'favorite' : ''}`}
                    onClick={() =>
                      toggleFavorite({
                        id: movie.id,
                        title: movie.title,
                        poster_path: movie.poster_path ?? null,
                        overview: movie.overview,
                        release_date: movie.release_date,
                        vote_average: movie.vote_average,
                      })
                    }
                  />
                </div>
                <div className="movie-card__info">
                  <h3>{movie.title}</h3>
                  <p className="movie-meta">{formatDate(movie.release_date)}</p>
                </div>
              </div>
            ))}
            {!visibleMovies.length && !errorMessage && (
              <div className="actor-filmography__state actor-filmography__state--hint">
                Try a different search or genre — we couldn’t find a match.
              </div>
            )}
          </div>
        )}
        {visibleMovies.length > 0 && (
          <div className="actor-filmography__summary">
            Showing {visibleMovies.length} film{visibleMovies.length === 1 ? '' : 's'} in{' '}
            {genre ? `${genres.find((g) => g.id.toString() === genre)?.name ?? 'this genre'}` : 'all genres'}
            .
          </div>
        )}
      </div>
    </div>
  );
};

export default ActorMovies;
