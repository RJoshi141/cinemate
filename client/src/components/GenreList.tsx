import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './GenreList.css';

interface Genre {
  id: number;
  name: string;
}

const GenreList: React.FC = () => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const apiKey = 'ce08d866531db79a3a3f6c6fa0728fc7';

  useEffect(() => {
    axios.get(`https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}`)
      .then(response => {
        setGenres(response.data.genres);
      })
      .catch(err => console.error('Error fetching genres:', err));
  }, []);

  return (
    <div className="genre-list">
      <h1>Browse by Genre</h1>
      <div className="genre-cards">
        {genres.map(genre => (
          <Link key={genre.id} to={`/genre/${genre.id}`} className="genre-card">
            <div className="genre-card-content">
              <h3>{genre.name}</h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default GenreList;
