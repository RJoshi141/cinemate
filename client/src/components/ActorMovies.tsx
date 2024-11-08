import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  genre_ids?: number[];
  overview: string;        // Movie plot/summary
  release_date: string;    // Release date
  vote_average: number;    // Rating
}

const ActorMovies: React.FC = () => {
  const { actorId, actorName } = useParams<{ actorId: string; actorName: string }>();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<{ id: number; name: string }[]>([]);
  const [genre, setGenre] = useState<string>('');

  const apiKey = 'ce08d866531db79a3a3f6c6fa0728fc7';

  // Fetch genres list
  useEffect(() => {
    axios
      .get(`https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}`)
      .then((response) => setGenres(response.data.genres))
      .catch((error) => console.error('Error fetching genres:', error));
  }, []);

  // Fetch movies by actor ID
  useEffect(() => {
    axios
      .get(`https://api.themoviedb.org/3/person/${actorId}/movie_credits?api_key=${apiKey}`)
      .then((response) => {
        // Map the data to include only the needed fields in Movie interface
        const moviesData = response.data.cast.map((movie: any) => ({
          id: movie.id,
          title: movie.title,
          poster_path: movie.poster_path,
          genre_ids: movie.genre_ids,
          overview: movie.overview,
          release_date: movie.release_date,
          vote_average: movie.vote_average,
        }));
        setMovies(moviesData);
      })
      .catch((error) => console.error('Error fetching actor movies:', error));
  }, [actorId]);

  // Filter movies by genre
  useEffect(() => {
    if (genre) {
      const genreId = parseInt(genre);
      setFilteredMovies(movies.filter((movie) => movie.genre_ids?.includes(genreId)));
    } else {
      setFilteredMovies(movies);
    }
  }, [genre, movies]);

  return (
    <div className="actor-movies">
      <h1>{actorName}'s Movies</h1>
      
      {/* Genre Filter Dropdown */}
      <select
        value={genre}
        onChange={(e) => setGenre(e.target.value)}
        className="genre-dropdown"
      >
        <option value="">All Genres</option>
        {genres.map((g) => (
          <option key={g.id} value={g.id.toString()}>
            {g.name}
          </option>
        ))}
      </select>

      {/* Movie Cards */}
      <div className="movies">
        {filteredMovies.map((movie) => (
          <div className="movie-card" key={movie.id}>
            <Link to={`/movie/${movie.id}`}>
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="movie-poster"
              />
            </Link>
            <h3>{movie.title}</h3>
            <p className="movie-release-date"><strong>Release Date:</strong> {movie.release_date}</p>
            <p className="movie-rating"><strong>Rating:</strong>{movie.vote_average}/10</p>
            <p className="movie-overview">{movie.overview}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActorMovies;
