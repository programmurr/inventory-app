var Genre = require('../models/genre');
var Film = require('../models/film');

const { body, check, validationResult } = require('express-validator');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });

exports.film_create_get = async function(req, res, next) {
  try {
    const genres = await Genre.find().sort({ name: 1 }).exec();
    res.render('film_form', { page: 'Create a Film', genres})
  } catch (err) {
    return next(err);
  }
}

exports.film_create_post = [
  upload.single('image'),
  body('name', 'Film name required')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Name must be between 1 and 100 characters')
    .escape(),
  body('description', 'Description required')
    .trim()
    .isLength({ min: 1, max: 500})
    .withMessage('Description must be between 1 and 500 characters')
    .escape(),
  body('year')
    .isInt({ min: 1880, max: new Date().getFullYear() })
    .withMessage('Year must be between 1880 and the current year'),
  body('genre.*')
    .escape(),
  body('price')
    .isInt({ min: 0 })
    .withMessage('Price must be an integer higher than zero'),
  body('quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be an integer higher than one'),
  check('name')
    .custom((value, { req }) => {
      if (req.file.size > 5000000) {
        return false;
      }
      if (
        req.file.mimetype === 'image/jpg'
        || req.file.mimetype === 'image/jpeg'
        || req.file.mimetype === 'image/png'
        ) {
          return true;
        } else {
          return false;
        }
    })
    .withMessage('Please only submit jpg, jpeg or png images less than 5MB.'),
  async (req, res, next) => {
    const { name, description, year, genre, price, quantity } = req.body;
    const errors = validationResult(req);
    const newFilm = new Film({
      name,
      description,
      image: {
        data: req.file.buffer,
        contentType: req.file.mimetype
      },
      year, 
      genre, 
      price, 
      quantity
    });
    if (!errors.isEmpty()) {
      try {
        const genres = await Genre.find().sort({ name: 1 }).exec();
        genres.forEach((genre) => {
          if (newFilm.genre.indexOf(genre._id) > -1) {
            genre.checked = 'true';
          }
        })
        res.render('film_form', { page: 'Create a Film', film: newFilm, errors: errors.array(), genres})
      } catch (err) {
        return next(err);
      }
    } else {
      try {
        const foundFilm = await Film.findOne({ 'name': name }).exec();
        if (foundFilm) {
          res.redirect(foundFilm.url);
        } else {
          await newFilm.save();
          res.redirect(newFilm.url);
        }
      } catch (err) {
        return next(err);
      }
    }
  }
]

exports.film_delete_get = async function(req, res, next) {
  try {
    const film = await Film.findById(req.params.id).populate('genre').exec();
    if (film == null) {
      res.redirect('/films');
    }
    res.render('film_delete', { page: 'Delete Film', film });
  } catch (error) {
    return next(error);
  }
}

exports.film_delete_post = async function(req, res, next) {
  try {
    await Film.findByIdAndRemove(req.body.filmid).exec();
    res.redirect('/films');
  } catch (error) {
    return next(error);
  }
}

exports.film_update_get = async function(req, res, next) {
  try {
    const [film, genres] = await Promise.all([
      Film.findById(req.params.id).populate('genre').exec(),
      Genre.find().exec()
    ]);
    if (film == null) {
      const error = new Error('Film not found');
      error.status = 404;
      return next(error);
    }
    genres.forEach((genre) => {
      film.genre.forEach((filmGenre) => {
        if (genre._id.toString() === filmGenre._id.toString()) {
          genre.checked = 'true';
        }
      });
    });
    res.render('film_form', { title: 'Update Film', film, genres });
  } catch (error) {
    return next(error);
  }
}

exports.film_update_post = [
  body('name', 'Film name required')
  .trim()
  .isLength({ min: 1, max: 100 })
  .withMessage('Name must be between 1 and 100 characters')
  .escape(),
  body('description', 'Description required')
    .trim()
    .isLength({ min: 1, max: 500})
    .withMessage('Description must be between 1 and 500 characters')
    .escape(),
  body('year')
    .isInt({ min: 1880, max: new Date().getFullYear() })
    .withMessage('Year must be between 1880 and the current year'),
  body('genre.*')
    .escape(),
  body('price')
    .isInt({ min: 0 })
    .withMessage('Price must be an integer higher than zero'),
  body('quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be an integer higher than one'),
  async (req, res, next) => {
    const { name, description, year, genre, price, quantity } = req.body;
    const errors = validationResult(req);
    const newFilm = new Film({
      name,
      description,
      year, 
      genre,
      price, 
      quantity,
      _id: req.params.id
    });
    if (!errors.isEmpty()) {
      try {
        const genres = await Genre.find().exec();
        genres.forEach((gen) => {
          if (newFilm.genre.indexOf(gen._id) > -1) {
            genres.checked = 'true';
          }
        });
        res.render('film_form', { page: 'Update Film', genres, film: newFilm, errors: errors.array() });
      } catch (error) {
        return next(error);
      }
    } else {
      try {
        await Film.findByIdAndUpdate(req.params.id, newFilm, {}).exec();
        res.redirect(newFilm.url);
      } catch (error) {
        return next(error);
      }
    }
  }
]

exports.film_detail = async function(req, res, next) {
  try {
    const film = await Film.findById(req.params.id).populate('genre').exec();
    if (film == null) {
      const err = new Error('Film not found');
      err.status = 404;
      return next(err);
    }
    res.render('film_detail', { page: film.name, film });
  } catch (err) {
    return next(err);
  }
}

exports.film_list = async function(req, res, next) {
  try {
    const films = await Film.find().sort({ name: 1 }).populate('genre').exec();
    res.render('film_list', { page: 'All Films', filmList: films });
  } catch (err) {
    return next(err);
  }
}