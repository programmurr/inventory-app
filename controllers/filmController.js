var Genre = require('../models/genre');
var Film = require('../models/film');

var async = require('async');

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

exports.film_detail = function(req, res, next) {
  res.send('NOT IMPLEMENTED YET: film_detail ' + req.params.id);
}

exports.film_list = function(req, res, next) {
  res.send('NOT IMPLEMENTED YET: film_list');
}