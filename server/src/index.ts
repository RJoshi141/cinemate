import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: 'http://localhost:3000',  // Allow only frontend to access
}));
app.use(express.json());

// TMDb API URL and key
const TMDB_API_URL = 'https://api.themoviedb.org/3';
const MOVIE_API_KEY = process.env.MOVIE_API_KEY;

app.get('/', (req, res) => {
  res.send('Cinemate server is running!');
});

app.get('/api/movies', async (req, res) => {
  try {
    // Fetch popular movies from TMDb
    const response = await axios.get(
      `${TMDB_API_URL}/movie/popular?api_key=${MOVIE_API_KEY}&language=en-US&page=1`
    );
    
    // Check if data is available
    if (response.data.results) {
      res.json(response.data.results); // Send the movies to the frontend
    } else {
      res.status(404).json({ error: 'No movies found!' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong while fetching movie data.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
