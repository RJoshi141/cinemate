import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFilm,
  faCompass,
  faHeart,
  faListCheck,
  faMagicWandSparkles,
  faUsers,
  faServer,
  faLaptopCode,
  faRocket,
  faEnvelope,
  faCodeBranch,
} from '@fortawesome/free-solid-svg-icons';
import './AboutPage.css';

const featureCards = [
  {
    title: 'Curated for You',
    description: 'Discover films tailored to your taste with curated collections, mood filters, and deep metadata.',
    icon: faCompass,
  },
  {
    title: 'Watchlists that Work',
    description: 'Save upcoming releases and timeless classics into a watchlist that stays with you everywhere.',
    icon: faListCheck,
  },
  {
    title: 'Celebrate Cinema',
    description: 'Dive into rich detail pages with cast spotlights, trivia, trailers, and kindred film suggestions.',
    icon: faMagicWandSparkles,
  },
  {
    title: 'Share the Love',
    description: 'Favorite the stories that move you and keep them one tap away when friends ask for a rec.',
    icon: faHeart,
  },
];

const techStack = [
  { label: 'React 18', icon: faLaptopCode },
  { label: 'TypeScript', icon: faLaptopCode },
  { label: 'TMDb API', icon: faServer },
  { label: 'React Router', icon: faRocket },
  { label: 'FontAwesome', icon: faFilm },
];

const contactLinks = [
  {
    label: 'Email',
    href: 'mailto:contact@cinemate.com',
    icon: faEnvelope,
  },
  {
    label: 'GitHub',
    href: 'https://github.com/RJoshi141/cinemate',
    icon: faCodeBranch,
  },
];

const AboutPage: React.FC = () => {
  return (
    <div className="about-page">
      <section className="about-hero">
        <div className="about-hero__content">
          <span className="about-pill">Your Movie Companion</span>
          <h1>Stories that find you.</h1>
          <p>
            Cinemate is a cinematic co-pilot that surfaces what to watch next, keeps your favorites close,
            and turns discovery into a nightly ritual. Settle in—we’ll cue the perfect film.
          </p>
          <div className="about-hero__stats">
            <div>
              <strong>500k+</strong>
              <span>Movies indexed via TMDb</span>
            </div>
            <div>
              <strong>Curated</strong>
              <span>Watchlists & favorites</span>
            </div>
            <div>
              <strong>Realtime</strong>
              <span>Cast & crew insights</span>
            </div>
          </div>
        </div>
        <div className="about-hero__marquee">
          <div className="marquee-card">
            <FontAwesomeIcon icon={faFilm} />
            <h3>Discover</h3>
            <p>New releases, hidden gems, modern classics.</p>
          </div>
          <div className="marquee-card">
            <FontAwesomeIcon icon={faUsers} />
            <h3>Connect</h3>
            <p>Follow the artists who shape the stories you love.</p>
          </div>
          <div className="marquee-card">
            <FontAwesomeIcon icon={faMagicWandSparkles} />
            <h3>Revisit</h3>
            <p>Favorites stay synced across every screen.</p>
          </div>
        </div>
      </section>

      <section className="about-section">
        <h2>Why Cinemate?</h2>
        <div className="about-grid">
          {featureCards.map((card) => (
            <article className="about-card" key={card.title}>
              <div className="about-card__icon">
                <FontAwesomeIcon icon={card.icon} />
              </div>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="about-section about-narrative">
        <h2>Experience the Flow</h2>
        <div className="about-narrative__content">
          <div>
            <h3>Search Less, Watch More</h3>
            <p>
              Cinemate pairs powerful search with deep metadata so you can filter by mood, genre, cast, or release
              window in seconds. Every detail—from trailers to trivia—is stitched into a single cinematic profile.
            </p>
          </div>
          <div>
            <h3>Guided by Data + Taste</h3>
            <p>
              Our discovery tools blend your watch history with cinematic trends so you always land on something that
              resonates. Cinemate evolves alongside your viewing habits and keeps exploring as you do.
            </p>
          </div>
        </div>
      </section>

      <section className="about-section">
        <h2>Built with Modern Tools</h2>
        <div className="about-tech">
          {techStack.map((tech) => (
            <span key={tech.label} className="tech-chip">
              <FontAwesomeIcon icon={tech.icon} />
              {tech.label}
            </span>
          ))}
        </div>
        <p className="about-note">
          Movie data is lovingly sourced from{' '}
          <a href="https://www.themoviedb.org/" target="_blank" rel="noopener noreferrer">
            TMDb
          </a>
          . Without their open platform, this experience would not shine as brightly.
        </p>
      </section>

      <section className="about-section">
        <h2>Stay in Touch</h2>
        <div className="about-contact-grid">
          {contactLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="contact-card"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon icon={link.icon} />
              <span>{link.label}</span>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
