var Genre = require('../models/genre');
var Film = require('../models/film');

const { body, validationResult } = require('express-validator');

exports.film_create_get = async function(req, res, next) {
  try {
    const genres = await Genre.find().sort({ name: 1 }).exec();
    res.render('film_form', { page: 'Create a Film', genres})
  } catch (err) {
    return next(err);
  }
}

exports.film_create_post = [
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

exports.film_delete_get = function(req, res, next) {
  res.send('NOT IMPLEMENTED YET: film_delete_get ' + req.params.id);
}

exports.film_delete_post = function(req, res, next) {
  res.send('NOT IMPLEMENTED YET: film_delete_post ' + req.params.id);
}

exports.film_update_get = function(req, res, next) {
  res.send('NOT IMPLEMENTED YET: film_update_get ' + req.params.id);
}

exports.film_update_post = function(req, res, next) {
  res.send('NOT IMPLEMENTED YET: film_update_post ' + req.params.id);
}

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