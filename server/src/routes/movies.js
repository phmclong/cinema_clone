const express = require('express');
const auth = require('../middlewares/auth');
const upload = require('../utils/multer');
const Movie = require('../models/movie');
const userModeling = require('../utils/userModeling');
const Reservation = require('../models/reservation');
const Showtime = require('../models/showtime');

const router = new express.Router();

// Get all movies
router.get('/movies', async (req, res) => {
  try {
    const movies = await Movie.find({});
    res.send(movies);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Get movie by id
router.get('/movies/:id', async (req, res) => {
  try {
    const movieId = req.params.id;
    const movie = await Movie.findById(movieId);
    if (!movie) return res.sendStatus(404);
    return res.send(movie);
  } catch (e) {
    return res.status(400).send(e);
  }
});

// Create a movie
router.post('/movies', auth.is_auth, auth.is_admin_or_superadmin, async (req, res) => {
  const movie = new Movie(req.body);
  try {
    await movie.save();
    res.status(201).send(movie);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Create a movie (save phpto)
router.post(
  '/movies/photo/:id',
  auth.is_auth, auth.is_admin_or_superadmin,
  upload('movies').single('file'),
  async (req, res, next) => {
    const url = `${req.protocol}://${req.get('host')}`;
    const { file } = req;
    const movieId = req.params.id;

    try {
      if (!file) {
        const error = new Error('Please upload a file');
        error.httpStatusCode = 422;
        return next(error);
      }
      const movie = await Movie.findById(movieId);
      if (!movie) return res.sendStatus(404);
      movie.image = `${url}/${file.path}`;
      await movie.save();
      res.send({ movie, file });
    } catch (e) {
      res.sendStatus(400).send(e);
    }
  }
);

// Update movie by id
router.put('/movies/:id', auth.is_auth, auth.is_admin_or_superadmin, async (req, res) => {
  const _id = req.params.id;
  const updates = Object.keys(req.body);
  const allowedUpdates = [
    'title',
    'image',
    'language',
    'genre',
    'director',
    'cast',
    'description',
    'duration',
    'releaseDate',
    'endDate',
  ];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) return res.status(400).send({ error: 'Invalid updates!' });

  try {
    const movie = await Movie.findById(_id);
    updates.forEach((update) => (movie[update] = req.body[update]));
    await movie.save();
    if (!movie) {
      res.sendStatus(404) 
    } else {
      res.send(movie);
    }
  } catch (e) {
    res.status(400).send(e);
  }
});

// Delete movie by id
router.delete('/movies/:id', auth.is_auth, auth.is_admin_or_superadmin, async (req, res) => {
  const _id = req.params.id;
  try {
    const movie = await Movie.findByIdAndDelete(_id);
    await Reservation.deleteMany({"movieId": _id})
    await Showtime.deleteMany({"movieId": _id})
    return !movie ? res.sendStatus(404) : res.send(movie);
  } catch (e) {
    return res.sendStatus(400);
  }
});

// Movies User modeling (Get Movies Suggestions)
router.get('/movies/usermodeling/:username', async (req, res) => {
  const { username } = req.params;
  try {
    const cinemasUserModeled = await userModeling.moviesUserModeling(username);
    res.send(cinemasUserModeled);
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;
