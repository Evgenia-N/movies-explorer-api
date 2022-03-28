const express = require('express');

const movieRoutes = express.Router();

// const auth = require('../middlewares/auth');

// const { validateMovieInfo, validateMovieId } = require('../middlewares/validation');

const { getMovies, createMovie, deleteMovie } = require('../controllers/movies');

movieRoutes.get('/movies', auth, getMovies);
movieRoutes.post('/movies', auth, express.json(), validateMovieInfo, createMovie);
movieRoutes.delete('/movies/_id', auth, validateMovieId, deleteMovie);

module.exports = movieRoutes;
