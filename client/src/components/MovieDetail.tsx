import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  overview: string;
  release_date: string;
  vote_average: number;
  genres: { name: string }[];
  original_language: string;
}

interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

const MovieDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Extract the movie id from the URL
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [cast, setCast] = useState<Cast[]>([]);
  const [rating, setRating] = useState<string | null>(null);
  const [trailer, setTrailer] = useState<string | null>(null);

  useEffect(() => {
    const apiKey = 'ce08d866531db79a3a3f6c6fa0728fc7';

    // Fetch movie details
    axios
      .get(`https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}`)
      .then((response) => {
        setMovie(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching movie details:', err);
        setError('Failed to fetch movie details');
        setLoading(false);
      });

    // Fetch movie recommendations
    axios
      .get(`https://api.themoviedb.org/3/movie/${id}/recommendations?api_key=${apiKey}`)
      .then((response) => {
        setRecommendations(response.data.results);
      })
      .catch((err) => {
        console.error('Error fetching recommendations:', err);
      });

    // Fetch movie credits for cast information
    axios
      .get(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${apiKey}`)
      .then((response) => {
        setCast(response.data.cast.slice(0, 5)); // Get the first 5 cast members
      })
      .catch((err) => {
        console.error('Error fetching cast:', err);
      });

    // Fetch movie rating
    axios
      .get(`https://api.themoviedb.org/3/movie/${id}/release_dates?api_key=${apiKey}`)
      .then((response) => {
        const usRating = response.data.results.find((r: any) => r.iso_3166_1 === 'US');
        const certification = usRating?.release_dates[0]?.certification || 'N/A';
        setRating(certification);
      })
      .catch((err) => {
        console.error('Error fetching movie rating:', err);
      });

    // Fetch movie trailer
    axios
      .get(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${apiKey}`)
      .then((response) => {
        const trailerVideo = response.data.results.find(
          (video: any) => video.type === 'Trailer' && video.site === 'YouTube'
        );
        if (trailerVideo) {
          setTrailer(`https://www.youtube.com/embed/${trailerVideo.key}`);
        }
      })
      .catch((err) => {
        console.error('Error fetching trailer:', err);
      });
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!movie) return <div>No movie data found</div>;

  return (
    <div className="movie-detail">
      <div className="movie-detail-content" style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start' }}>
        {/* Movie Poster */}
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className="movie-poster"
          style={{ width: '300px', height: 'auto', marginRight: '20px' }}
        />

        {/* Movie Info */}
        <div className="movie-info" style={{ maxWidth: '600px' }}>
          <h1>{movie.title}</h1>
          <p className="overview">{movie.overview || 'No overview available'}</p>
          <div className="details">
            <p><strong>Release Date:</strong> {movie.release_date}</p>
            <p><strong>Rating:</strong> {movie.vote_average}</p>
            <p><strong>Certification:</strong> {rating}</p>
            <p><strong>Genres:</strong> {movie.genres.map((genre) => genre.name).join(', ')}</p>
            <p><strong>Language:</strong> {movie.original_language}</p>
          </div>
        </div>
      </div>

      {/* Trailer Section */}
      {trailer && (
        <div className="trailer-section">
          <h2>Trailer</h2>
          <iframe
            width="560"
            height="315"
            src={trailer}
            title="Movie Trailer"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      )}

      {/* Cast Section */}
      {cast.length > 0 && (
        <div className="cast-section">
          <h2>Cast</h2>
          <ul>
            {cast.map((member) => (
              <li key={member.id}>
                {member.profile_path && (
                  <img
                    src={`https://image.tmdb.org/t/p/w200${member.profile_path}`}
                    alt={member.name}
                    className="cast-image"
                  />
                )}
                <p><strong>{member.name}</strong> as {member.character}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recommendations Section */}
      {recommendations.length > 0 && (
        <div className="recommendations">
          <h2>Recommended Movies</h2>
          <div className="recommendations-list">
            {recommendations.map((recommendedMovie) => (
              <div key={recommendedMovie.id} className="movie-card">
                <Link to={`/movie/${recommendedMovie.id}`}>
                  <img
                    src={`https://image.tmdb.org/t/p/w500${recommendedMovie.poster_path}`}
                    alt={recommendedMovie.title}
                    className="movie-poster"
                  />
                </Link>
                <h3>{recommendedMovie.title}</h3>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetail;
