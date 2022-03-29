const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');
const Movie = require('../models/movie');

exports.getMovies = async (req, res, next) => {
  try {
    const movies = await Movie.find({});
    res.status(200).send(movies);
  } catch (err) {
    next(err);
  }
};

exports.createMovie = async (req, res, next) => {
  try {
    const {
      nameRU,
      nameEN,
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      thumbnail,
      movieId,
    } = req.body;
    const newMovie = new Movie({
      nameRU,
      nameEN,
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      thumbnail,
      movieId,
      owner: req.user._id,
    });
    res.status(201).send(await newMovie.save());
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Произошла ошибка при заполнении обязательных полей'));
    } else {
      next(err);
    }
  }
};

exports.deleteMovie = async (req, res, next) => {
  try {
    const deletedMovie = await Movie.findById(req.params.movieId);
    if (deletedMovie) {
      if (req.user._id === deletedMovie.owner._id.toString()) {
        await Movie.findByIdAndRemove(req.params.movieId);
        res.status(200).send({ message: 'Следующие данные были удалены', deletedMovie });
      } else {
        throw new ForbiddenError('Нет прав для удаления данного фильма');
      }
    } else {
      throw new NotFoundError('Фильм не найден');
    }
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestError('Ошибка удаления фильма'));
    } else {
      next(err);
    }
  }
};
