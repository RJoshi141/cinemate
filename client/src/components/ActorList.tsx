import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './ActorList.css';

const ActorList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [actors, setActors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const apiKey = 'ce08d866531db79a3a3f6c6fa0728fc7';

  // Fetch actors based on search query
  useEffect(() => {
    if (searchQuery.length < 3) return; // Start searching when at least 3 characters are typed
    setIsLoading(true);

    axios
      .get(`https://api.themoviedb.org/3/search/person?api_key=${apiKey}&query=${searchQuery}`)
      .then((response) => {
        setActors(response.data.results);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching actors:', error);
        setIsLoading(false);
      });
  }, [searchQuery]);

  return (
    <div className="actor-list-page">
      <div className="actor-list-search">
        <input
          type="text"
          placeholder="Search for an actor..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="actor-search-input"
        />
      </div>

      {isLoading && <div className="loading-message">Loading...</div>}

      <div className="actor-cards">
  {actors.length === 0 && !isLoading && <div className="no-actors-message">No actors found</div>}
  {actors.map((actor) => (
    <div key={actor.id} className="actor-card">
      <Link
        to={`/actor/${actor.id}/${actor.name}`}
        className="actor-image-link"
      >
        <div className="actor-image-container">
          {actor.profile_path ? (
            <img
              src={`https://image.tmdb.org/t/p/w500${actor.profile_path}`}
              alt={actor.name}
              className="actor-pic"
            />
          ) : (
            <div className="no-image">No Image</div>
          )}
        </div>
      </Link>
      <h3>{actor.name}</h3>
    </div>
  ))}
</div>

    </div>
  );
};

export default ActorList;
