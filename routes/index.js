var express = require('express');
var router = express.Router();

var genreController = require('../controllers/genreController');
var filmController = require('../controllers/filmController');
/* GET home page. */
router.get('/', genreController.index);

// GENRE ROUTES //

router.get('/genre/create', genreController.genre_create_get);
router.post('/genre/create', genreController.genre_create_post);

router.get('/genre/:id/delete', genreController.genre_delete_get);
router.post('/genre/:id/delete', genreController.genre_delete_post);

router.get('/genre/:id/update', genreController.genre_update_get);
router.post('/genre/:id/update', genreController.genre_update_post);

router.get('/genre/:id', genreController.genre_detail);

router.get('/genres', genreController.genre_list);

// FILM ROUTES //

router.get('/film/create', filmController.film_create_get);
router.post('/film/create', filmController.film_create_post);

router.get('/film/:id/delete', filmController.film_delete_get);
router.post('/film/:id/delete', filmController.film_delete_post);

router.get('/film/:id/update', filmController.film_update_get);
router.post('/film/:id/update', filmController.film_update_post);

router.get('/film/:id', filmController.film_detail);

router.get('/films', filmController.film_list);

module.exports = router;
