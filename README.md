# Cinemate

![Cinemate](client/assets/cinemate_demo_popular_fav_recos.gif)
**Cinemate** is a user-friendly React-based web application for movie enthusiasts. It provides a seamless browsing experience for discovering, exploring, and organizing your favorite films. With its clean interface and engaging features, Cinemate is your perfect companion for navigating the world of cinema.

---
### Website Demo - Popular Movies, Favourites and Recommendations
![Website Demo](client/assets/cinemate_demo_popular_fav_recos.gif)

---

## Features

### 🎥 **Movie Discovery**

- Search for movies by title, genre, or actors.
- View detailed information about movies, including ratings, release dates, and overviews.

### ⭐ **Personalized Experience**

- Add movies to your Watchlist for future viewing.
- Mark favorites to keep track of your top picks.

### 📽️ **Rich Media Integration**

- Watch trailers directly on the movie details page.
- View high-quality images of movies and cast members.

### 🔍 **Advanced Search Options**

- Filter movies by genres, actors, and ratings.
- Discover films based on your specific interests.

---

## Technologies Used

### Frontend

- **React**: For building a dynamic and responsive user interface.
- **React Router**: For seamless navigation between pages.
- **Axios**: For fetching data from The Movie Database (TMDb) API.
- **Tailwind CSS**: For modern and responsive styling.

### API

- **The Movie Database (TMDb)**: Fetch movie data including details, trailers, and images.

---

## Installation

Follow these steps to set up the project locally:

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/RJoshi141/cinemate.git
   ```

2. **Navigate to the Client Directory:**

   ```bash
   cd cinemate/client
   ```

3. **Install Dependencies:**

   ```bash
   npm install
   ```

4. **Add API Key:**

   - Create a `.env` file in the `client` folder.
   - Add your TMDb API key:
     ```env
     REACT_APP_TMDB_API_KEY=your_api_key_here
     ```

5. **Run the Application:**

   ```bash
   npm start
   ```

   Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

6. **Build for Production:**

   ```bash
   npm run build
   ```

---

## Deployment

Cinemate is deployed on GitHub Pages. To deploy:

1. **Build the Project:**

   ```bash
   npm run build
   ```

2. **Navigate to the Build Folder:**

   ```bash
   cd build
   ```

3. **Initialize Git and Push to ********`gh-pages`******** Branch:**

   ```bash
   git init
   git checkout -b gh-pages
   git add .
   git commit -m "Deploy updated build"
   git remote add origin https://github.com/RJoshi141/cinemate.git
   git push origin gh-pages --force
   ```

4. **Verify Deployment:**
   Visit [https://RJoshi141.github.io/cinemate](https://RJoshi141.github.io/cinemate).

---

## Contributing

Contributions are welcome! Follow these steps to contribute:

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add feature description"
   ```
4. Push to your branch:
   ```bash
   git push origin feature-name
   ```
5. Open a pull request.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- **The Movie Database (TMDb)** for providing the API and data.
- React and Tailwind CSS for enabling a seamless development experience.

---

## Contact

If you have any questions or feedback, feel free to reach out:

- **Ritika Joshi** - [GitHub](https://github.com/RJoshi141)

Happy movie exploring with Cinemate! 🎬

