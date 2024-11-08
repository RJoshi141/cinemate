import React, { useEffect, useState } from 'react';

const MovieList: React.FC = () => {
  const [movies, setMovies] = useState<string>('');

  useEffect(() => {
    fetch('http://localhost:5000/api/movies')
      .then((response) => response.json())
      .then((data) => setMovies(data.message));
  }, []);

  return <div>{movies}</div>;
};

export default MovieList;
