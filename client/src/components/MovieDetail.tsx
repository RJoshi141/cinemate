import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

interface MovieDetailProps {
  id: number;
}

const MovieDetail: React.FC = () => {
  const { id } = useParams(); // Extract the movie id from the URL
  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const apiKey = 'ce08d866531db79a3a3f6c6fa0728fc7'; // TMDb API key
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
    }
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  if (!movie) return <div>No movie data found</div>;

  return (
    <div className="movie-detail">
      <h1>{movie.title}</h1>
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
      />
      <p>{movie.overview ? movie.overview : 'No overview available'}</p>
      <p><strong>Release Date:</strong> {movie.release_date}</p>
      <p><strong>Rating:</strong> {movie.vote_average}</p>
      <p><strong>Genres:</strong> {movie.genres ? movie.genres.map((genre: any) => genre.name).join(', ') : 'No genres available'}</p>
      <p><strong>Language:</strong> {movie.original_language ? movie.original_language : 'N/A'}</p>
    </div>
  );
};

export default MovieDetail;
