import React from 'react';
import './AboutPage.css';

const AboutPage: React.FC = () => {
  return (
    <div className="about-page">
      <h1 className="about-header">About Cinemate</h1>
      
      <section className="about-introduction">
        <p>
          Welcome to Cinemate, your personalized movie discovery app! Whether you're looking for a new movie to watch, tracking your favorites, or exploring movie trivia, Cinemate is here to help you find the perfect movie.
        </p>
      </section>
      
      <section className="about-features">
        <h2>Features</h2>
        <ul>
          <li>Personalized movie recommendations</li>
          <li>Search by title, genre, or actors</li>
          <li>Watchlist and favorites functionality</li>
          <li>Interactive "Spin the Wheel" movie recommendations</li>
          <li>Detailed movie and actor information</li>
          <li>Trivia and fun facts about your favorite movies</li>
        </ul>
      </section>
      
      <section className="about-how-it-works">
        <h2>How It Works</h2>
        <p>
          Cinemate uses your movie preferences to suggest personalized recommendations. You can explore different genres, search for movies, and even discover interesting trivia. The app also allows you to track your watchlist and favorite movies for easy access.
        </p>
      </section>
      
      <section className="about-technologies">
        <h2>Technologies Used</h2>
        <p>
          Cinemate is built with a modern tech stack including React, TypeScript, and the TMDb API for movie data. The app also uses state-of-the-art UI design practices for an engaging and responsive experience.
        </p>
      </section>
      
      <section className="about-credits">
        <h2>Credits</h2>
        <p>
          Special thanks to <a href="https://www.themoviedb.org/" target="_blank" rel="noopener noreferrer">TMDb</a> for providing the movie data API.
        </p>
      </section>

      <section className="about-contact">
        <h2>Contact</h2>
        <p>
          Have feedback or suggestions? Feel free to reach out via <a href="mailto:contact@cinemate.com">email</a> or visit our <a href="https://github.com/RJoshi141/cinemate">GitHub repo</a>.
        </p>
      </section>
    </div>
  );
};

export default AboutPage;
