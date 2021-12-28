var Genre = require('../models/genre');
var Film = require('../models/film');

const { body, validationResult } = require('express-validator');
var debug = require('debug')('genre');

const adminCheck = (value, { req }) => {
  if (req.body.admin !== process.env.RUD_PW) {
    return false;
  }
  return true;
}

exports.index = async function(req, res, next) {
  try {
    const genres = Genre.find().sort({ name: 1 });
    const filmCount = Film.countDocuments({});
    const results = await Promise.all([genres.exec(), filmCount.exec()]);

    res.render('index', {
      page: 'Ye Olde DVD Shoppe', 
      genres: results[0], 
      filmCount: results[1]
    })
  } catch (err) {
    debug('index error: ' + err);
    return next(err);
  }
};

exports.genre_create_get = function(req, res) {
  res.render('genre_form', { page: 'Create Genre' });
}

exports.genre_create_post = [
  body('name', 'Genre name required')
    .trim()
    .isLength({ min: 1, max: 100 }).withMessage('Name must be between 1 and 100 characters')
    .escape(),
  body('description', 'Description required')
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Description must be between 1 and 500 characters')
    .escape(),
  body('admin')
    .custom(adminCheck)
    .withMessage('Admin password must be correct for Write, Update or Delete operations'),
  async (req, res, next) => {
    const errors = validationResult(req);
    const newGenre = new Genre({
      name: req.body.name,
      description: req.body.description
    });
    if (!errors.isEmpty()) {
      res.render('genre_form', { page: 'Create Genre', genre: newGenre, errors: errors.array() });
      return;
    } else {
      try {
        const foundGenre = await Genre.findOne({ 'name': req.body.name }).exec();
        if (foundGenre) {
          res.redirect(foundGenre.url);
        } else {
          await newGenre.save();
          res.redirect(newGenre.url);
        }
      } catch (error) {
        debug('genre create/post error: ' + error);
        return next(error);
      }
    }
  }
]

exports.genre_delete_get = async function(req, res, next) {
  try {
    const [genre, genreFilms] = await Promise.all([
      Genre.findById(req.params.id).exec(), 
      Film.find({ 'genre': req.body.genreid }).exec()
    ]);
    if (genre == null) {
      res.redirect('/genres');
    }
    res.render('genre_delete', { page: 'Delete Genre', genre, genreFilms });
  } catch (error) {
    debug('genre delete/get error: ' + error);
    return next(error);
  }
  res.send('NOT IMPLEMENTED YET: genre_delete_get ' + req.params.id);
}

exports.genre_delete_post = async function(req, res, next) {
  try {
    const [genre, genreFilms] = await Promise.all([
      Genre.findById(req.body.genreid).exec(), 
      Film.find({ 'genre': req.body.genreid }).exec()
    ]);

    if (genreFilms > 0) {
      res.render('genre_delete', { page: 'Delete Genre', genre, genreFilms })
    } else if (req.body.admin !== process.env.RUD_PW) {
      res.render('genre_delete', { page: 'Delete Genre', genre, genreFilms, error: "Admin password must be correct for Write, Update or Delete operations" })
    } else {
      try {
        await Genre.findByIdAndRemove(req.body.genreid).exec();
        res.redirect('/genres');
      } catch (error) {
        debug('genre delete/post error: ' + error);
        return next(error);
      }
    }
  } catch (error) {
    debug('genre delete/post error: ' + error);
    return next(error);
  }
}

exports.genre_update_get = async function(req, res, next) {
  try {
    const genre = await Genre.findById(req.params.id).exec();
    if (genre == null) {
      var err = new Error('Genre not found');
      err.status = 404;
      return next(err);
    }
    res.render('genre_form', { page: 'Update Genre', genre });
  } catch (error) {
    debug('genre update/get error: ' + err);
    return next(error);
  }
}

exports.genre_update_post = [
  body('name', 'Genre name required')
    .trim()
    .isLength({ min: 1, max: 100 }).withMessage('Name must be between 1 and 100 characters')
    .escape(),
  body('description', 'Description required')
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Description must be between 1 and 500 characters')
    .escape(),
  body('admin')
    .custom(adminCheck)
    .withMessage('Admin password must be correct for Write, Update or Delete operations'),
  async (req, res, next) => {
    const errors = validationResult(req);
    const updatedGenre = new Genre({
      name: req.body.name,
      description: req.body.description,
      _id: req.params.id
    });
    if (!errors.isEmpty()) {
      res.render('genre_form', { page: 'Update Genre' , genre: updatedGenre, errors: errors.array() });
    } else {
      try {
        await Genre.findByIdAndUpdate(req.params.id, updatedGenre, {}).exec();
        res.redirect(updatedGenre.url);
      } catch (error) {
        debug('genre update/post error: ' + error);
        return next(error);
      }
    }
  }
]

exports.genre_detail = async function(req, res, next) {
  try {
    const genre = Genre.findById(req.params.id);
    const genreFilms = Film.find({ 'genre': req.params.id }).sort({ name: 1 }).populate('genre');
    const results = await Promise.all([genre.exec(), genreFilms.exec()]);

    if (results[0] == null) {
      const err = new Error('Genre not found');
      err.status = 404;
      return next(err);
    }
    
    res.render('genre_detail', { 
      page: results[0].name, 
      genre: results[0], 
      films: results[1] 
    });
  } catch (err) {
    debug('genre detail error: ' + err);
    return next(err);
  }
}

exports.genre_list = async function(req, res, next) {
  try {
    const genres = await Genre.find().sort({ name: 1 }).exec();
    res.render('genre_list', { page: 'All Genres', genreList: genres });
  } catch (err) {
    debug('genre list error: ' + err);
    return next(err);
  }
}