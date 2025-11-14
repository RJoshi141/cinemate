import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaSearch, FaTimes } from 'react-icons/fa';
import './ActorList.css';

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/320x480?text=No+Image';
const MIN_SEARCH_LENGTH = 3;
const MAX_RESULTS = 30;

type MessageKind = 'info' | 'hint' | 'error';

interface PageMessage {
  kind: MessageKind;
  text: string;
}

interface KnownForItem {
  id: number;
  title?: string;
  name?: string;
  media_type?: string;
}

interface Actor {
  id: number;
  name: string;
  profile_path: string | null;
  known_for?: KnownForItem[];
  popularity?: number;
}

const VIEW_OPTIONS = [
  {
    key: 'popular',
    label: 'Popular',
    description: 'Worldwide fan favourites making waves on the big screen.',
    buildUrl: (apiKey: string) =>
      `https://api.themoviedb.org/3/person/popular?api_key=${apiKey}&language=en-US&page=1`,
  },
  {
    key: 'trending_week',
    label: 'Trending',
    description: 'Actors everyone is talking about this week.',
    buildUrl: (apiKey: string) =>
      `https://api.themoviedb.org/3/trending/person/week?api_key=${apiKey}`,
  },
] as const;

type ViewOption = (typeof VIEW_OPTIONS)[number];
type ViewKey = ViewOption['key'];

const formatKnownFor = (items?: KnownForItem[]) => {
  if (!items?.length) return '';
  const titles = items
    .map((item) => item.title || item.name)
    .filter(Boolean)
    .slice(0, 2);
  return titles.join(' • ');
};

const ActorList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewKey>('popular');
  const [actors, setActors] = useState<Actor[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalResults, setTotalResults] = useState<number | null>(null);
  const [message, setMessage] = useState<PageMessage | null>(null);

  const apiKey = 'ce08d866531db79a3a3f6c6fa0728fc7';
  const isSearching = debouncedQuery.length >= MIN_SEARCH_LENGTH;
  const activeView = useMemo<ViewOption>(
    () => VIEW_OPTIONS.find((option) => option.key === viewMode) ?? VIEW_OPTIONS[0],
    [viewMode],
  );

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedQuery(searchQuery.trim());
    }, 350);

    return () => window.clearTimeout(timeoutId);
  }, [searchQuery]);

  useEffect(() => {
    const controller = new AbortController();
    let isActive = true;

    if (debouncedQuery && debouncedQuery.length < MIN_SEARCH_LENGTH) {
      setMessage({
        kind: 'hint',
        text: `Keep typing to search (min ${MIN_SEARCH_LENGTH} characters).`,
      });
      setTotalResults(null);
      return () => {
        isActive = false;
        controller.abort();
      };
    }

    const fetchActors = async () => {
      setIsLoading(true);
      setMessage(null);

      try {
        const requestUrl = isSearching
          ? `https://api.themoviedb.org/3/search/person?api_key=${apiKey}&query=${encodeURIComponent(
              debouncedQuery,
            )}&include_adult=false&language=en-US&page=1`
          : activeView.buildUrl(apiKey);

        const response = await axios.get(requestUrl, { signal: controller.signal });
        if (!isActive) return;

        const results = ((response.data.results || []) as Actor[]).slice(0, MAX_RESULTS);
        setActors(results);
        setTotalResults(response.data.total_results ?? results.length);

        if (!results.length) {
          setMessage({
            kind: 'info',
            text: isSearching
              ? `No actors found for “${debouncedQuery}”.`
              : 'No actors available right now. Please try again soon.',
          });
        }
      } catch (error: unknown) {
        if (!isActive || axios.isCancel(error)) return;

        console.error('Error fetching actors:', error);
        setMessage({
          kind: 'error',
          text: 'Something went wrong while fetching actors. Please try again.',
        });
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    fetchActors();

    return () => {
      isActive = false;
      controller.abort();
    };
  }, [activeView, apiKey, debouncedQuery, isSearching]);

  const subtitle = useMemo(() => {
    if (isSearching) {
      return debouncedQuery
        ? `Search results for “${debouncedQuery}”.`
        : 'Discover artists loved around the globe.';
    }
    return activeView.description;
  }, [activeView.description, debouncedQuery, isSearching]);

  const summary = useMemo(() => {
    if (isLoading || !actors.length) return '';

    if (isSearching) {
      const count = totalResults ?? actors.length;
      return `Showing top ${actors.length} of ${count} match${count === 1 ? '' : 'es'}.`;
    }
    return `Showing ${actors.length} ${activeView.label.toLowerCase()} talents.`;
  }, [actors.length, activeView.label, isLoading, isSearching, totalResults]);

  const handleViewChange = (key: ViewKey) => {
    if (key === viewMode) return;
    setViewMode(key);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setDebouncedQuery('');
  };

  return (
    <div className="people-page people-page--actors">
      <div className="people-page__header">
        <div className="people-page__headline">
          <h1 className="people-page__title">Discover Actors</h1>
          <p className="people-page__subtitle">{subtitle}</p>
          {summary && <span className="people-page__summary">{summary}</span>}
        </div>
        <div className="people-page__controls">
          <div className="people-search">
            <FaSearch className="people-search__icon" aria-hidden="true" />
            <input
              type="search"
              placeholder="Search for an actor..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="people-search__input"
              aria-label="Search actors"
            />
            {searchQuery && (
              <button
                type="button"
                className="people-search__clear"
                onClick={handleClearSearch}
                aria-label="Clear search"
              >
                <FaTimes />
              </button>
            )}
          </div>
          <div className="people-pills" role="tablist" aria-label="Actor lists">
            {VIEW_OPTIONS.map((option) => (
              <button
                key={option.key}
                type="button"
                className={`people-pill ${viewMode === option.key ? 'people-pill--active' : ''}`}
                onClick={() => handleViewChange(option.key)}
                disabled={isSearching}
                aria-pressed={viewMode === option.key}
                aria-label={option.label}
                title={isSearching ? 'Clear search to change list' : option.label}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {message && !isLoading && (
        <div className={`people-state people-state--${message.kind}`}>{message.text}</div>
      )}

      {isLoading ? (
        <div className="people-grid">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="person-card person-card--skeleton">
              <div className="person-card__media" />
              <div className="person-card__info">
                <div className="skeleton-line skeleton-line--title" />
                <div className="skeleton-line skeleton-line--meta" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="people-grid">
          {actors.map((actor) => {
            const knownFor = formatKnownFor(actor.known_for);
            const popularity = typeof actor.popularity === 'number' ? Math.round(actor.popularity) : null;

            return (
              <div key={actor.id} className="person-card">
                <Link to={`/actor/${actor.id}/${actor.name}`} className="person-card__link">
                  <div className="person-card__media">
                    {popularity !== null && (
                      <span className="person-card__meta-pill">
                        <span role="img" aria-hidden="true">
                          ⭐
                        </span>
                        {popularity}
                      </span>
                    )}
                    <img
                      src={
                        actor.profile_path ? `${IMAGE_BASE_URL}${actor.profile_path}` : PLACEHOLDER_IMAGE
                      }
                      alt={actor.name}
                      className="person-card__image"
                      loading="lazy"
                    />
                  </div>
                  <div className="person-card__info">
                    <h3 className="person-card__name">{actor.name}</h3>
                    {knownFor ? (
                      <p className="person-card__meta">Known for: {knownFor}</p>
                    ) : (
                      <p className="person-card__meta">Tap to explore their filmography.</p>
                    )}
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ActorList;
