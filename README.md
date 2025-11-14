<div align="center">
  <img src="client/assets/logo.gif" alt="Cinemate logo animation" width="320" height="320">
  <p><strong>Cinemate</strong> is a movie companion for film lovers who want a fast, rich way to browse, discover, and organize what to watch next.</p>
</div>

## Highlights
- Search by title, genre, actor, or director and view rich metadata at a glance.
- Build personalised watchlists and mark favorites across devices.
- Stream trailers, browse posters, and explore related recommendations in one place.

### Favorites + Watchlist
<img src="client/assets/fav-watch.gif" alt="Mark favorites and watchlist" width="640">

### Director Filmographies
<img src="client/assets/watch-direct.gif" alt="Browse a director's movies" width="640">

### Genre Discovery & Cast Deep-Dives
<img src="client/assets/genre-actor.gif" alt="Explore by genre and view actor filmography" width="640">

## Tech Stack
- **React + TypeScript** UI with modular components.
- **React Router** for client-side navigation.
- **Axios** integration with **TMDb** for data and media.
- **Tailwind CSS** plus custom styles for a responsive layout.

## Getting Started
1. **Clone the repo**
   ```bash
   git clone https://github.com/RJoshi141/cinemate.git
   cd cinemate/client
   ```
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Configure API access**
   - Create a `.env` file in `client/`.
   - Add your TMDb key:
     ```env
     REACT_APP_TMDB_API_KEY=your_api_key_here
     ```
4. **Run the app**
   ```bash
   npm start
   ```
   Visit [http://localhost:3000](http://localhost:3000) to explore Cinemate.

## Contributing
- Fork the project and create a feature branch.
- Keep commits scoped and descriptive.
- Submit a pull request with context and screenshots when relevant.

## License
Released under the MIT License. See `LICENSE` for details.

## Acknowledgments
- **The Movie Database (TMDb)** for powering data and imagery.
- The React and Tailwind CSS communities for their tooling and inspiration.

## Thanks!
<div align=>
  <img src="client/assets/leo.gif" alt="High-five from Leo" width="420">
  <p>Enjoy, share it with friends, and keep chasing that next great story.</p>
</div>