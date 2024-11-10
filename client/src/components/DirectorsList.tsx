import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './DirectorsList.css';

interface Director {
  id: number;
  name: string;
  profile_path: string;
}

const DirectorsList: React.FC = () => {
  const [directors, setDirectors] = useState<Director[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredDirectors, setFilteredDirectors] = useState<Director[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);
  const apiKey = 'ce08d866531db79a3a3f6c6fa0728fc7';

  useEffect(() => {
    // Fetch available languages from TMDb
    const fetchLanguages = async () => {
      try {
        const response = await axios.get(`https://api.themoviedb.org/3/configuration/languages?api_key=${apiKey}`);
        const languageCodes = response.data.map((lang: any) => lang.iso_639_1);
        setLanguages(languageCodes); // Store language codes
      } catch (error) {
        console.error('Error fetching languages:', error);
      }
    };

    fetchLanguages();
  }, []);

  useEffect(() => {
    const moviePages = Array.from({ length: 10 }, (_, index) => index + 1); // Fetch 10 pages of movies
    const movieIds: number[] = [];

    // Fetch movies from multiple languages
    const fetchMovies = async () => {
      try {
        for (let lang of languages) {
          for (let page of moviePages) {
            const response = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=${lang}&page=${page}`);
            const ids = response.data.results.map((movie: { id: number }) => movie.id);
            movieIds.push(...ids);

            if (movieIds.length === moviePages.length * response.data.results.length) {
              fetchDirectorsFromMovies(movieIds);  // Fetch directors once all movie IDs are collected
            }
          }
        }
      } catch (error) {
        console.error('Error fetching movie data:', error);
      }
    };

    if (languages.length > 0) {
      fetchMovies();
    }
  }, [languages]);

  // Fetch crew for each movie and filter for directors
  const fetchDirectorsFromMovies = (movieIds: number[]) => {
    const directorsMap = new Map<number, Director>(); // Use a map to avoid duplicates

    movieIds.forEach(movieId => {
      axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${apiKey}`)
        .then(response => {
          const directorsFromMovie = response.data.crew.filter((member: { job: string, id: number, name: string, profile_path: string }) => member.job === 'Director');

          directorsFromMovie.forEach((director: { id: number, name: string, profile_path: string }) => {
            // Adding directors to the map (will automatically avoid duplicates)
            directorsMap.set(director.id, director);
          });

          // Convert the map back to an array, sort alphabetically, and set the state
          const directorsArray = Array.from(directorsMap.values());
          directorsArray.sort((a, b) => a.name.localeCompare(b.name)); // Sorting alphabetically
          setDirectors(directorsArray);
          setFilteredDirectors(directorsArray); // Set both directors and filtered list
        })
        .catch(error => console.error('Error fetching credits for movie:', error));
    });
  };

  // Handle the search input change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    // Filter directors based on the search query (case-insensitive)
    const filtered = directors.filter(director =>
      director.name.toLowerCase().includes(query)
    );
    setFilteredDirectors(filtered);
  };

  return (
    <div className="directors-list">
      <div className="search-bar">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search for a director"
          className="search-input"
        />
      </div>

      <div className="director-cards">
        {filteredDirectors.length > 0 ? (
          filteredDirectors.map(director => (
            <div key={director.id} className="director-card">
              <Link to={`/director/${director.id}`}>
                <img
                  src={director.profile_path ? `https://image.tmdb.org/t/p/w500${director.profile_path}` : 'path_to_fallback_image.jpg'}
                  alt={director.name}
                  className="director-photo"
                />
                <h3>{director.name}</h3>
              </Link>
            </div>
          ))
        ) : (
          <p>No directors found.</p>
        )}
      </div>
    </div>
  );
};

export default DirectorsList;
