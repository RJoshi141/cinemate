import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Cinemate server is running!');
});

app.get('/api/movies', (req, res) => {
  try {
    // Your logic to fetch movie data will go here
    res.json({ message: "This is a placeholder for movie data" });
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong!' });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
