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

const MovieDetail: React.FC = () => {
  const { id } = useParams(); // Extract the movie id from the URL
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<Movie[]>([]);

  useEffect(() => {
    if (id) {
      const apiKey = 'ce08d866531db79a3a3f6c6fa0728fc7'; // TMDb API key
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
    }
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!movie) return <div>No movie data found</div>;

  return (
    <div className="movie-detail">
      {/* Movie Details */}
      <h1>{movie.title}</h1>
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
        className="movie-poster"
      />
      <p>{movie.overview ? movie.overview : 'No overview available'}</p>
      <p><strong>Release Date:</strong> {movie.release_date}</p>
      <p><strong>Rating:</strong> {movie.vote_average}</p>
      <p><strong>Genres:</strong> {movie.genres ? movie.genres.map((genre) => genre.name).join(', ') : 'No genres available'}</p>
      <p><strong>Language:</strong> {movie.original_language ? movie.original_language : 'N/A'}</p>

      {/* Movie Recommendations Section */}
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
