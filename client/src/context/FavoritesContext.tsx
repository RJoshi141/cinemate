import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';

export interface FavoriteMovie {
  id: number;
  title: string;
  poster_path: string | null;
  overview?: string;
  release_date?: string;
  vote_average?: number;
  genre_ids?: number[];
}

interface FavoritesContextValue {
  favorites: FavoriteMovie[];
  watchlist: FavoriteMovie[];
  isFavorite: (id: number) => boolean;
  toggleFavorite: (movie: FavoriteMovie) => void;
  removeFavorite: (id: number) => void;
  isInWatchlist: (id: number) => boolean;
  toggleWatchlist: (movie: FavoriteMovie) => void;
  removeFromWatchlist: (id: number) => void;
}

const FavoritesContext = createContext<FavoritesContextValue | undefined>(undefined);
const FAVORITES_STORAGE_KEY = 'cinemate:favorites';
const WATCHLIST_STORAGE_KEY = 'cinemate:watchlist';

const getInitialList = (storageKey: string): FavoriteMovie[] => {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const stored = window.localStorage.getItem(storageKey);
    if (!stored) {
      return [];
    }
    const parsed = JSON.parse(stored) as FavoriteMovie[];
    if (Array.isArray(parsed)) {
      return parsed;
    }
  } catch (error) {
    console.warn('Failed to parse favorites from storage', error);
  }
  return [];
};

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<FavoriteMovie[]>(() => getInitialList(FAVORITES_STORAGE_KEY));
  const [watchlist, setWatchlist] = useState<FavoriteMovie[]>(() => getInitialList(WATCHLIST_STORAGE_KEY));

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    }
  }, [favorites]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(watchlist));
    }
  }, [watchlist]);

  const isFavorite = useCallback(
    (id: number) => favorites.some((movie) => movie.id === id),
    [favorites]
  );

  const toggleFavorite = useCallback((movie: FavoriteMovie) => {
    setFavorites((prev) => {
      if (prev.some((item) => item.id === movie.id)) {
        return prev.filter((item) => item.id !== movie.id);
      }
      return [...prev, movie];
    });
  }, []);

  const removeFavorite = useCallback((id: number) => {
    setFavorites((prev) => prev.filter((movie) => movie.id !== id));
  }, []);

  const isInWatchlist = useCallback(
    (id: number) => watchlist.some((movie) => movie.id === id),
    [watchlist]
  );

  const toggleWatchlist = useCallback((movie: FavoriteMovie) => {
    setWatchlist((prev) => {
      if (prev.some((item) => item.id === movie.id)) {
        return prev.filter((item) => item.id !== movie.id);
      }
      return [...prev, movie];
    });
  }, []);

  const removeFromWatchlist = useCallback((id: number) => {
    setWatchlist((prev) => prev.filter((movie) => movie.id !== id));
  }, []);

  const value = useMemo(
    () => ({
      favorites,
      watchlist,
      isFavorite,
      toggleFavorite,
      removeFavorite,
      isInWatchlist,
      toggleWatchlist,
      removeFromWatchlist,
    }),
    [
      favorites,
      watchlist,
      isFavorite,
      toggleFavorite,
      removeFavorite,
      isInWatchlist,
      toggleWatchlist,
      removeFromWatchlist,
    ]
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
};

export const useFavorites = (): FavoritesContextValue => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

