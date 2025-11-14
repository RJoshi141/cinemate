// src/components/DirectorMovies.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import './DirectorMovies.css';

interface MovieCredit {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string | null;
  job?: string;
  department?: string;
}

interface Movie extends MovieCredit {
  formattedDate: string;
}

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/200x300?text=No+Image';

const formatDate = (value?: string | null) => {
  if (!value) return 'Date TBA';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const DirectorMovies: React.FC = () => {
  const { directorId } = useParams<{ directorId: string }>();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [directorName, setDirectorName] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const apiKey = 'ce08d866531db79a3a3f6c6fa0728fc7';

  useEffect(() => {
    if (!directorId) return;
    const controller = new AbortController();
    let isActive = true;

    const fetchDirectorMovies = async () => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const [detailsResponse, creditsResponse] = await Promise.all([
          axios.get(`https://api.themoviedb.org/3/person/${directorId}?api_key=${apiKey}&language=en-US`, {
            signal: controller.signal,
          }),
          axios.get(
            `https://api.themoviedb.org/3/person/${directorId}/movie_credits?api_key=${apiKey}&language=en-US`,
            { signal: controller.signal },
          ),
        ]);

        if (!isActive) return;

        setDirectorName(detailsResponse.data?.name ?? 'Unknown Director');

        const crew: MovieCredit[] = creditsResponse.data?.crew ?? [];
        const directedMovies = crew.filter(
          (credit) =>
            credit.job?.toLowerCase() === 'director' || credit.department?.toLowerCase() === 'directing',
        );

        const uniqueMovies = new Map<number, Movie>();

        directedMovies.forEach((movie) => {
          if (!uniqueMovies.has(movie.id)) {
            uniqueMovies.set(movie.id, {
              ...movie,
              formattedDate: formatDate(movie.release_date),
            });
          }
        });

        const sortedMovies = Array.from(uniqueMovies.values()).sort((a, b) => {
          const dateA = a.release_date ? new Date(a.release_date).getTime() : 0;
          const dateB = b.release_date ? new Date(b.release_date).getTime() : 0;
          return dateB - dateA;
        });

        setMovies(sortedMovies);

        if (!sortedMovies.length) {
          setErrorMessage('We could not find any directed films for this creator.');
        }
      } catch (error: unknown) {
        if (!isActive || axios.isCancel(error)) return;
        console.error('Error fetching director movies:', error);
        setErrorMessage('Something went wrong while loading this filmography. Please try again.');
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    fetchDirectorMovies();

    return () => {
      isActive = false;
      controller.abort();
    };
  }, [apiKey, directorId]);

  const filteredMovies = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return movies;
    return movies.filter((movie) => movie.title.toLowerCase().includes(query));
  }, [movies, searchQuery]);

  return (
    <div className="director-movies">
      <div className="director-movies__header">
        <h1 className="director-movies__title">
          Directed by {directorName || 'Loading…'}
        </h1>
        <p className="director-movies__subtitle">
          Explore every feature-length film {directorName || 'this director'} has helmed.
        </p>
        <div className="director-movies__search">
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="director-movies__search-input"
            placeholder="Search movies by title"
            aria-label="Search movies by title"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="director-movies__grid">
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
        <>
          {errorMessage && (
            <div className="director-movies__state">
              {errorMessage}
            </div>
          )}
          <div className="director-movies__grid">
            {filteredMovies.map((movie) => (
              <div key={movie.id} className="movie-card">
                <Link to={`/movie/${movie.id}`} className="movie-poster-container">
                  <img
                    src={movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : PLACEHOLDER_IMAGE}
                    alt={movie.title}
                    className="movie-poster"
                    loading="lazy"
                  />
                </Link>
                <div className="movie-card__info">
                  <h3>{movie.title}</h3>
                  <p className="movie-meta">{movie.formattedDate}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default DirectorMovies;
