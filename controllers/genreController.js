var Genre = require('../models/genre');
var Film = require('../models/film');

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
    return next(err);
  }
};

exports.genre_create_get = function(req, res, next) {
  res.send('NOT IMPLEMENTED YET: genre_create_get');
}

exports.genre_create_post = function(req, res, next) {
  res.send('NOT IMPLEMENTED YET: genre_create_post');
}

exports.genre_delete_get = function(req, res, next) {
  res.send('NOT IMPLEMENTED YET: genre_delete_get ' + req.params.id);
}

exports.genre_delete_post = function(req, res, next) {
  res.send('NOT IMPLEMENTED YET: genre_delete_post ' + req.params.id);
}

exports.genre_update_get = function(req, res, next) {
  res.send('NOT IMPLEMENTED YET: genre_update_get ' + req.params.id);
}

exports.genre_update_post = function(req, res, next) {
  res.send('NOT IMPLEMENTED YET: genre_update_post ' + req.params.id);
}

exports.genre_detail = async function(req, res, next) {
  try {
    const genre = Genre.findById(req.params.id);
    const genreFilms = Film.find({ 'genre': req.params.id }).populate('genre');
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
    return next(err);
  }
}

exports.genre_list = async function(req, res, next) {
  try {
    const genres = await Genre.find().sort({ name: 1 }).exec();
    res.render('genre_list', { page: 'All Genres', genreList: genres });
  } catch (err) {
    return next(err);
  }
}