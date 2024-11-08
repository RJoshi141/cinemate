import React, { useEffect, useState } from 'react';

const MovieList: React.FC = () => {
  const [movies, setMovies] = useState<string>('');

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/movies`)
      .then((response) => response.json())
      .then((data) => setMovies(data.message)) // or use `data.results` depending on the API response
      .catch((error) => console.error('Error fetching movies:', error));
  }, []);

  return <div>{movies}</div>;
};

export default MovieList;
