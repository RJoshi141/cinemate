import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaSearch, FaTimes } from 'react-icons/fa';
import './DirectorsList.css';

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/320x480?text=No+Image';
const MIN_SEARCH_LENGTH = 2;
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

interface Director {
  id: number;
  name: string;
  profile_path: string | null;
  known_for_department?: string;
  known_for?: KnownForItem[];
  popularity?: number;
}

interface ViewResult {
  people: Director[];
  totalResults?: number;
}

interface ViewOption {
  key: 'popular' | 'trending_week';
  label: string;
  description: string;
  fetch: (apiKey: string, signal: AbortSignal) => Promise<ViewResult>;
}

const collectUnique = (source: Director[], target: Map<number, Director>) => {
  source.forEach((person) => {
    if (!target.has(person.id)) {
      target.set(person.id, person);
    }
  });
};

const fetchDirectorsFromEndpoint = async (
  apiKey: string,
  signal: AbortSignal,
  buildUrl: (page: number) => string,
  maxPages = 6,
): Promise<ViewResult> => {
  const directorsMap = new Map<number, Director>();
  let reportedTotal: number | undefined;

  for (let page = 1; page <= maxPages && directorsMap.size < MAX_RESULTS; page += 1) {
    const response = await axios.get(buildUrl(page), { signal });
    const pageResults = filterDirectors((response.data.results || []) as Director[]);

    collectUnique(pageResults, directorsMap);

    if (typeof response.data.total_results === 'number') {
      reportedTotal = response.data.total_results;
    }

    if (!response.data.results?.length) {
      break;
    }
  }

  const people = Array.from(directorsMap.values()).slice(0, MAX_RESULTS);

  return {
    people,
    totalResults: reportedTotal ?? directorsMap.size,
  };
};

const VIEW_OPTIONS: ViewOption[] = [
  {
    key: 'popular',
    label: 'Popular',
    description: 'Celebrated directors shaping modern cinema.',
    fetch: (apiKey, signal) =>
      fetchDirectorsFromEndpoint(
        apiKey,
        signal,
        (page) =>
          `https://api.themoviedb.org/3/person/popular?api_key=${apiKey}&language=en-US&page=${page}`,
        8,
      ),
  },
  {
    key: 'trending_week',
    label: 'Trending',
    description: 'Visionaries gaining buzz this week.',
    fetch: (apiKey, signal) =>
      fetchDirectorsFromEndpoint(
        apiKey,
        signal,
        (page) => `https://api.themoviedb.org/3/trending/person/week?api_key=${apiKey}&page=${page}`,
        4,
      ),
  },
];

type ViewKey = ViewOption['key'];

const formatKnownFor = (items?: KnownForItem[]) => {
  if (!items?.length) return '';
  const titles = items
    .map((item) => item.title || item.name)
    .filter(Boolean)
    .slice(0, 2);
  return titles.join(' • ');
};

const filterDirectors = (people: Director[]) =>
  people.filter(
    (person) => person.known_for_department?.toLowerCase() === 'directing' || !person.known_for_department,
  );

const DirectorsList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewKey>('popular');
  const [directors, setDirectors] = useState<Director[]>([]);
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

    const fetchDirectors = async () => {
      setIsLoading(true);
      setMessage(null);

      try {
        if (isSearching) {
          const response = await axios.get(
            `https://api.themoviedb.org/3/search/person?api_key=${apiKey}&query=${encodeURIComponent(
              debouncedQuery,
            )}&include_adult=false&language=en-US&page=1`,
            { signal: controller.signal },
          );
          if (!isActive) return;

          const people = filterDirectors((response.data.results || []) as Director[]);
          setDirectors(people.slice(0, MAX_RESULTS));
          setTotalResults(people.length);

          if (!people.length) {
            setMessage({
              kind: 'info',
              text: `No directors found for “${debouncedQuery}”.`,
            });
          }
          return;
        }

        const { people, totalResults: fetchedTotal } = await activeView.fetch(
          apiKey,
          controller.signal,
        );
        if (!isActive) return;

        setDirectors(people);
        setTotalResults(fetchedTotal ?? people.length);

        if (!people.length) {
          setMessage({
            kind: 'info',
            text: 'No directors available right now. Please try again soon.',
          });
        }
      } catch (error: unknown) {
        if (!isActive || axios.isCancel(error)) return;
        console.error('Error fetching directors:', error);
        setMessage({
          kind: 'error',
          text: 'Something went wrong while fetching directors. Please try again.',
        });
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    fetchDirectors();

    return () => {
      isActive = false;
      controller.abort();
    };
  }, [activeView, apiKey, debouncedQuery, isSearching]);

  const subtitle = useMemo(() => {
    if (isSearching) {
      return debouncedQuery
        ? `Search results for “${debouncedQuery}”.`
        : 'From classics to modern masterpieces.';
    }
    return activeView.description;
  }, [activeView.description, debouncedQuery, isSearching]);

  const summary = useMemo(() => {
    if (isLoading || !directors.length) return '';

    if (isSearching) {
      const count = totalResults ?? directors.length;
      return `Showing top ${directors.length} of ${count} match${count === 1 ? '' : 'es'}.`;
    }
    return `Showcasing ${directors.length} ${activeView.label.toLowerCase()} filmmakers.`;
  }, [activeView.label, directors.length, isLoading, isSearching, totalResults]);

  const handleViewChange = (key: ViewKey) => {
    if (key === viewMode) return;
    setViewMode(key);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setDebouncedQuery('');
  };

  return (
    <div className="people-page people-page--directors">
      <div className="people-page__header">
        <div className="people-page__headline">
          <h1 className="people-page__title">Visionary Directors</h1>
          <p className="people-page__subtitle">{subtitle}</p>
          {summary && <span className="people-page__summary">{summary}</span>}
        </div>
        <div className="people-page__controls">
          <div className="people-search">
            <FaSearch className="people-search__icon" aria-hidden="true" />
            <input
              type="search"
              placeholder="Search for a director..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="people-search__input"
              aria-label="Search directors"
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
          <div className="people-pills" role="tablist" aria-label="Director lists">
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
          {directors.map((director) => {
            const knownFor = formatKnownFor(director.known_for);

            return (
              <div key={director.id} className="person-card">
                <Link to={`/director/${director.id}`} className="person-card__link">
                  <div className="person-card__media">
                    <img
                      src={
                        director.profile_path
                          ? `${IMAGE_BASE_URL}${director.profile_path}`
                          : PLACEHOLDER_IMAGE
                      }
                      alt={director.name}
                      className="person-card__image"
                      loading="lazy"
                    />
                  </div>
                  <div className="person-card__info">
                    <h3 className="person-card__name">{director.name}</h3>
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

export default DirectorsList;
