var Genre = require('../models/genre');
var Film = require('../models/film');

var async = require('async');

exports.index = function(req, res, next) {
  async.parallel({
    genres: function(callback) {
      Genre.find().exec(callback);
    },
    film_count: function(callback) {
      Film.countDocuments({}, callback);
    }
  }, function(err, results) {
      if (err) { return next(err); }
      res.render('index', {
        title: 'Ye Olde DVD Shoppe', 
        genres: results.genres, 
        film_count: results.film_count
      });
  })
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

exports.genre_detail = function(req, res, next) {
  res.send('NOT IMPLEMENTED YET: genre_detail ' + req.params.id);
}

exports.genre_list = function(req, res, next) {
  res.send('NOT IMPLEMENTED YET: genre_list ');
}