import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHeart,
  faGhost,
  faLaughBeam,
  faDragon,
  faRocket,
  faGun,
  faTheaterMasks,
  faGuitar,
  faHatCowboy,
  faUserSecret,
  faMusic,
  faLandmark,
  faBrain,
  faPalette,
  faMagic,
  faChild,
  faBookOpen,
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import './GenreList.css';

interface Genre {
  id: number;
  name: string;
}

const genreIconMap: Record<number, any> = {
  28: faGun, // Action
  12: faHatCowboy, // Adventure
  16: faChild, // Animation
  35: faLaughBeam, // Comedy
  80: faUserSecret, // Crime
  99: faBookOpen, // Documentary
  18: faTheaterMasks, // Drama
  10751: faChild, // Family
  14: faMagic, // Fantasy
  36: faLandmark, // History
  27: faGhost, // Horror
  10402: faMusic, // Music
  9648: faBrain, // Mystery
  10749: faHeart, // Romance
  878: faRocket, // Science Fiction
  10770: faPalette, // TV Movie
  53: faDragon, // Thriller
  10752: faGun, // War
  37: faHatCowboy, // Western
};

const GenreList: React.FC = () => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const apiKey = 'ce08d866531db79a3a3f6c6fa0728fc7';

  useEffect(() => {
    axios
      .get(`https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}`)
      .then((response) => {
        setGenres(response.data.genres);
      })
      .catch((err) => console.error('Error fetching genres:', err));
  }, []);

  const sortedGenres = useMemo(() => [...genres].sort((a, b) => a.name.localeCompare(b.name)), [genres]);

  return (
    <div className="genre-list">
      <h1>Browse by Genre</h1>
      <div className="genre-cards">
        {sortedGenres.map((genre) => (
          <Link key={genre.id} to={`/genre/${genre.id}`} className="genre-card">
            <div className="genre-card-icon">
              <FontAwesomeIcon icon={genreIconMap[genre.id] || faPalette} />
            </div>
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
