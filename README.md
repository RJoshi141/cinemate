# Cinemate

<img src="client/assets/cinemate_demo_logo.gif" alt="Cinemate Logo" width="200" height="300">


**Cinemate** is your ultimate movie companion, designed for film enthusiasts who love exploring, discovering, and organizing their favorite films. Dive into a seamless and engaging experience with Cinemate's clean interface and robust features.

---

## 🌟 Website Demo

### Popular Movies, Favorites, and Recommendations
<img src="client/assets/cinemate_demo_popular_fav_recos.gif" alt="Popular Movies, Favorites, and Recommendations" width="600" />

### Directors and Movie Quiz
<img src="client/assets/cinemate_demo_directors_moviequiz.gif" alt="Directors and Movie Quiz" width="600" />

### Actor and Their Movies
<img src="client/assets/cinemate_demo_actormovies.gif" alt="Actor and Their Movies" width="600" />

---

## 🎥 Features

### **Movie Discovery**
- Search for movies by title, genre, or actors.
- View detailed movie information, including ratings, release dates, and overviews.

### **Personalized Experience**
- Add movies to your Watchlist for future viewing.
- Mark favorites to keep track of your top picks.

### **Rich Media Integration**
- Watch trailers directly on the movie details page.
- Enjoy high-quality images of movies and cast members.

### **Advanced Search Options**
- Filter movies by genres, actors, and ratings.
- Discover films based on your unique interests.

---

## 🛠️ Technologies Used

### Frontend
- **React**: Dynamic and responsive user interface.
- **React Router**: Seamless navigation between pages.
- **Axios**: Fetches data from The Movie Database (TMDb) API.
- **Tailwind CSS**: Modern and responsive styling.

### API
- **The Movie Database (TMDb)**: Fetches movie details, trailers, and images.

---

## 🚀 Installation

Follow these steps to set up Cinemate locally:

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

## 🌐 Deployment

Deploy Cinemate on GitHub Pages:

1. **Build the Project:**
   ```bash
   npm run build
   ```

2. **Navigate to the Build Folder:**
   ```bash
   cd build
   ```

3. **Push to `gh-pages` Branch:**
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

## 🤝 Contributing

Contributions are welcome! Follow these steps:

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

## 📜 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **The Movie Database (TMDb)** for providing API and data.
- React and Tailwind CSS for a seamless development experience.

---

## 📧 Contact

For questions or feedback, feel free to reach out:

- **Ritika Joshi** - [GitHub](https://github.com/RJoshi141)

Happy movie exploring with Cinemate! 🎬

