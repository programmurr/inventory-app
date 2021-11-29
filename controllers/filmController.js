var Genre = require('../models/genre');
var Film = require('../models/film');

exports.film_create_get = function(req, res, next) {
  res.send('NOT IMPLEMENTED YET: film_create_get ');
}

exports.film_create_post = function(req, res, next) {
  res.send('NOT IMPLEMENTED YET: film_create_post ');
}

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
    const films = await Film.find().sort({ title: 1 }).populate('genre').exec();
    res.render('film_list', { page: 'All Films', filmList: films });
  } catch (err) {
    return next(err);
  }
}