import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  genre_ids?: number[];
  overview: string;
  release_date: string;
  vote_average: number;
}

const ActorMovies: React.FC = () => {
  const { actorId, actorName } = useParams<{ actorId: string; actorName: string }>();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<{ id: number; name: string }[]>([]);
  const [genre, setGenre] = useState<string>('');
  const [actorBio, setActorBio] = useState<string>('');
  const [actorDetails, setActorDetails] = useState<any>(null); // Store actor details
  const [isBioExpanded, setIsBioExpanded] = useState<boolean>(false); // Track bio expansion state

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

  // Fetch actor biography and profile details
  useEffect(() => {
    axios
      .get(`https://api.themoviedb.org/3/person/${actorId}?api_key=${apiKey}`)
      .then((response) => {
        setActorDetails(response.data); // Store actor details
        setActorBio(response.data.biography); // Store actor bio
      })
      .catch((error) => console.error('Error fetching actor biography:', error));
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

  // Toggle bio expanded/collapsed
  const toggleBio = () => {
    setIsBioExpanded(!isBioExpanded);
  };

  return (
    <div className="actor-movies">
      <div className="actor-details">
        <div className="actor-info">
          <h2>{actorName}</h2>
          <p><strong>Born:</strong> Huntsville, Alabama, USA</p>

          <div className="bio-container">
            {/* Actor Bio with truncation */}
            <p className={isBioExpanded ? 'bio-expanded' : 'bio-truncated'}>
              {actorBio}
            </p>
            {/* Read More / Less Toggle */}
            {actorBio.length > 200 && (
              <span className="read-more" onClick={toggleBio}>
                {isBioExpanded ? 'Read Less' : 'Read More'}
              </span>
            )}
          </div>
        </div>
        
        {/* Actor's Image moved to the right */}
        <div className="actor-image">
          {actorDetails && actorDetails.profile_path && (
            <img 
              src={`https://image.tmdb.org/t/p/w200${actorDetails.profile_path}`} 
              alt={actorName} 
              className="actor-profile-img"
            />
          )}
        </div>
      </div>
      <h2>{actorName}'s Movies</h2>
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
