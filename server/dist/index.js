"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const axios_1 = __importDefault(require("axios"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.use((0, cors_1.default)({
    origin: 'http://localhost:3000', // Allow only frontend to access
}));
app.use(express_1.default.json());
// TMDb API URL and key
const TMDB_API_URL = 'https://api.themoviedb.org/3';
const MOVIE_API_KEY = process.env.MOVIE_API_KEY;
app.get('/', (req, res) => {
    res.send('Cinemate server is running!');
});
app.get('/api/movies', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch popular movies from TMDb
        const response = yield axios_1.default.get(`${TMDB_API_URL}/movie/popular?api_key=${MOVIE_API_KEY}&language=en-US&page=1`);
        // Check if data is available
        if (response.data.results) {
            res.json(response.data.results); // Send the movies to the frontend
        }
        else {
            res.status(404).json({ error: 'No movies found!' });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong while fetching movie data.' });
    }
}));
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
