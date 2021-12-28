var Genre = require('../models/genre');
var Film = require('../models/film');

const { body, check, validationResult } = require('express-validator');
const debug = require('debug');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });

const imageValidation = (value, { req }) => {
  if (req.file) {
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
  }
  return true;
}

const adminCheck = (value, { req }) => {
  if (req.body.admin !== process.env.RUD_PW) {
    return false;
  }
  return true;
}

exports.film_create_get = async function(req, res, next) {
  try {
    const genres = await Genre.find().sort({ name: 1 }).exec();
    res.render('film_form', { page: 'Create a Film', genres});
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
  check('image')
    .custom(imageValidation)
    .withMessage('Please only submit jpg, jpeg or png images less than 5MB.'),
  body('admin')
    .custom(adminCheck)
    .withMessage('Admin password must be correct for Write, Update or Delete operations'),
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
    if (req.file) {
      const image = {};
      image.data = req.file.buffer;
      image.contentType = req.file.mimetype;
      newFilm.image = image;
    } else {
      newFilm.image = { data: '', contentType: '' };
    }
    if (!errors.isEmpty()) {
      try {
        const genres = await Genre.find().sort({ name: 1 }).exec();
        genres.forEach((genre) => {
          if (newFilm.genre.indexOf(genre._id) > -1) {
            genre.checked = 'true';
          }
        })
        res.render('film_form', { page: 'Create a Film', film: newFilm, errors: errors.array(), genres})
      } catch (error) {
        debug('film create/post error: ' + error);
        return next(error);
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
      } catch (error) {
          debug('film create/post error: ' + error);
        return next(error);
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
    debug('film delete/get error: ' + error);
    return next(error);
  }
}

exports.film_delete_post = async function(req, res, next) {
  if (req.body.admin === process.env.RUD_PW) {
    try {
      await Film.findByIdAndRemove(req.body.filmid).exec();
      res.redirect('/films');
    } catch (error) {
      debug('film delete/post error: ' + error);
      return next(error);
    }
  } else {
    const film = await Film.findById(req.params.id).populate('genre').exec();
    res.render('film_delete', { page: 'Delete Film', film, error: "Admin password must be correct for Write, Update or Delete operations" });
  }
}

exports.film_update_get = async function(req, res, next) {
  try {
    const [film, genres] = await Promise.all([
      Film.findById(req.params.id).populate('genre').exec(),
      Genre.find().sort({ name: 1 }).exec()
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
    debug('film update/get error: ' + error);
    return next(error);
  }
}

exports.film_update_post = [
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
  check('image')
    .custom(imageValidation)
    .withMessage('Please only submit jpg, jpeg or png images less than 5MB.'),
  body('admin')
    .custom(adminCheck)
    .withMessage('Admin password must be correct for Write, Update or Delete operations'),
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
    if (req.file) {
      const image = {};
      image.data = req.file.buffer;
      image.contentType = req.file.mimetype;
      newFilm.image = image;
    }
    if (!errors.isEmpty()) {
      try {
        const genres = await Genre.find().sort({ name: 1 }).exec();
        genres.forEach((gen) => {
          if (newFilm.genre.indexOf(gen._id) > -1) {
            genres.checked = 'true';
          }
        });
        res.render('film_form', { page: 'Update Film', genres, film: newFilm, errors: errors.array() });
      } catch (error) {
          debug('film update/post error: ' + error);
        return next(error);
      }
    } else {
      try {
        await Film.findByIdAndUpdate(req.params.id, newFilm, {}).exec();
        res.redirect(newFilm.url);
      } catch (error) {
        debug('film update/post error: ' + error);
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
    res.render('film_detail', { page: film.escapedName, film });
  } catch (err) {
    return next(err);
  }
}

exports.film_list = async function(req, res, next) {
  try {
    const films = await Film.find().sort({ name: 1 }).populate('genre').exec();
    res.render('film_list', { page: 'All Films', filmList: films });
  } catch (error) {
    debug('film list error: ' + error);
    return next(error);
  }
}