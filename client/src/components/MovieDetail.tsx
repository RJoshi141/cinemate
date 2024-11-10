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
  runtime?: number;
  budget?: number;
}

interface CrewMember {
  id: number;
  name: string;
  job: string;
}

interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

interface WatchProviders {
  flatrate?: { provider_name: string }[]; // Streaming platforms
  rent?: { provider_name: string }[];     // Rental platforms
  buy?: { provider_name: string }[];      // Purchase platforms
}

const MovieDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [cast, setCast] = useState<Cast[]>([]);
  const [crew, setCrew] = useState<CrewMember[]>([]);
  const [rating, setRating] = useState<string | null>(null);
  const [trailer, setTrailer] = useState<string | null>(null);
  const [watchProviders, setWatchProviders] = useState<WatchProviders | null>(null);

  const apiKey = 'ce08d866531db79a3a3f6c6fa0728fc7';

  useEffect(() => {
    // Fetch movie details
    axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}`)
      .then(response => {
        setMovie(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching movie details:', err);
        setError('Failed to fetch movie details');
        setLoading(false);
      });

    // Fetch recommendations
    axios.get(`https://api.themoviedb.org/3/movie/${id}/recommendations?api_key=${apiKey}`)
      .then(response => setRecommendations(response.data.results))
      .catch(err => console.error('Error fetching recommendations:', err));

    // Fetch cast and crew
    axios.get(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${apiKey}`)
      .then(response => {
        setCast(response.data.cast.slice(0, 5));
        setCrew(response.data.crew);
      })
      .catch(err => console.error('Error fetching cast and crew:', err));

    // Fetch rating
    axios.get(`https://api.themoviedb.org/3/movie/${id}/release_dates?api_key=${apiKey}`)
      .then(response => {
        const usRating = response.data.results.find((r: any) => r.iso_3166_1 === 'US');
        const certification = usRating?.release_dates[0]?.certification || 'N/A';
        setRating(certification);
      })
      .catch(err => console.error('Error fetching movie rating:', err));

    // Fetch trailer
    axios.get(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${apiKey}`)
      .then(response => {
        const trailerVideo = response.data.results.find(
          (video: any) => video.type === 'Trailer' && video.site === 'YouTube'
        );
        if (trailerVideo) setTrailer(`https://www.youtube.com/embed/${trailerVideo.key}`);
      })
      .catch(err => console.error('Error fetching trailer:', err));

    // Fetch where to watch providers
    axios.get(`https://api.themoviedb.org/3/movie/${id}/watch/providers?api_key=${apiKey}`)
      .then(response => {
        const usProviders = response.data.results?.US;
        setWatchProviders(usProviders || null);
      })
      .catch(err => console.error('Error fetching watch providers:', err));
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!movie) return <div>No movie data found</div>;

  // Extract director and producers from the crew list
  const director = crew.find((member) => member.job === 'Director');
  const producers = crew.filter((member) => member.job === 'Producer').map((p) => p.name).join(', ');

  return (
    <div className="movie-detail">
      <div className="movie-detail-content" style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start' }}>
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
            <p><strong>Release Date:</strong> {movie.release_date}<br></br>
            <strong>Rating:</strong> {movie.vote_average}<br></br>
            <strong>Certification:</strong> {rating}<br></br>
            <strong>Genres:</strong> {movie.genres.map((genre) => genre.name).join(', ')}<br></br>
            <strong>Language:</strong> {movie.original_language}<br></br>
            <strong>Duration:</strong> {movie.runtime ? `${movie.runtime} min` : 'N/A'}<br></br>
            <strong>Budget:</strong> {movie.budget ? `$${movie.budget.toLocaleString()}` : 'N/A'}<br></br>
            <strong>Director:</strong> {director ? director.name : 'N/A'}<br></br>
            <strong>Producers:</strong> {producers || 'N/A'}<br></br>
            <strong>Available on: </strong>
              {watchProviders?.flatrate ? (
                watchProviders.flatrate.map((provider) => provider.provider_name).join(', ')
              ) : 'N/A'}
            </p>
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
                <Link to={`/actor/${member.id}/${member.name}`}>
                  {member.profile_path && (
                    <img
                      src={`https://image.tmdb.org/t/p/w200${member.profile_path}`}
                      alt={member.name}
                      className="cast-image"
                    />
                  )}
                </Link>
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
