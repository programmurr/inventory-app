#! /usr/bin/env node

console.log('This script populates some test genres and films to the database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true');

// Get arguments passed on command line
const userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
const async = require('async')
const Genre = require('./models/genre');
const Film = require('./models/film');


const mongoose = require('mongoose');
const mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const genres = [];
const films = [];

function genreCreate (name, description, cb) {
  const genreDetail = { name: name, description: description };
  
  const genre = new Genre(genreDetail);
       
  genre.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Category: ' + genre);
    genres.push(genre);
    cb(null, genre);
  } );
}

function filmCreate (name, description, year, genre, price, quantity, cb) {
  const film = new Film({ 
    name: name,
    description: description,
    year: year,
    genre: genre,
    price: price,
    quantity: quantity,
  });
       
  film.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Film: ' + film);
    films.push(film);
    cb(null, film);
  });
}

function createGenres(cb) {
    async.series([
        function(callback) {
          genreCreate(
            "Action", 
            "A film genre in which the protagonist or protagonists are thrust into a series of events that typically include violence, extended fighting, physical feats, rescues and frantic chases. Action films tend to feature a mostly resourceful hero struggling against incredible odds, which include life-threatening situations, a dangerous villain, or a pursuit which usually concludes in victory for the hero.",
            callback
            );
        },
        function(callback) {
          genreCreate(
            "Adventure",
            "An adventure film is form of adventure fiction, and is a genre of film. Subgenres of adventure films include swashbuckler films, pirate films, and survival films. Adventure films may also be combined with other film genres such as action, animation, comedy, drama, fantasy, science fiction, family, horror, or war.", 
            callback
            );
        },
        function(callback) {
          genreCreate(
            "Comedy",
            "A comedy film is a category of film which emphasizes humor. These films are designed to make the audience laugh through amusement. Films in this style traditionally have a happy ending (black comedy being an exception).", 
            callback
            );
        },
        function(callback) {
          genreCreate(
            "Crime",
            "Crime films, in the broadest sense, is a film genre inspired by and analogous to the crime fiction literary genre. Films of this genre generally involve various aspects of crime and its detection. Stylistically, the genre may overlap and combine with many other genres, such as drama or gangster film, but also include comedy, and, in turn, is divided into many sub-genres, such as mystery, suspense or noir.",
            callback
          );
        }
        ],
        // optional callback
        cb);
}


function createFilms(cb) {
    async.parallel([
        function(callback) {
          filmCreate(
            'The Terminator', 
            'The Terminator is a 1984 American science fiction action film directed by James Cameron. It stars Arnold Schwarzenegger as the Terminator, a cyborg assassin sent back in time from 2029 to 1984 to kill Sarah Connor (Linda Hamilton), whose unborn son will one day save mankind from extinction by a hostile artificial intelligence in a post-apocalyptic future.', 
            1984, 
            [genres[0]], 
            599,
            3,
            callback
          );
        },
        function(callback) {
          filmCreate(
            'Die Hard', 
            'Die Hard is a 1988 American action film directed by John McTiernan and written by Jeb Stuart and Steven E. de Souza. It is based on the 1979 novel Nothing Lasts Forever by Roderick Thorp, and it stars Bruce Willis, Alan Rickman, Alexander Godunov, and Bonnie Bedelia. Die Hard follows New York City police detective John McClane (Willis) who is caught up in a terrorist takeover of a Los Angeles skyscraper while visiting his estranged wife.', 
            1988, 
            [genres[0]], 
            499,
            2,
            callback
          );
        },
        function(callback) {
          filmCreate(
            'Hard Boiled', 
            'Hard Boiled is a 1992 Hong Kong action film directed by John Woo and from a screenplay by Barry Wong. The film stars Chow Yun-fat as Inspector "Tequila" Yuen, Tony Leung Chiu-wai as Alan, an undercover cop, and Anthony Wong as Johnny Wong, a leader of the criminal triads.', 
            1992, 
            [genres[0]], 
            699,
            1,
            callback
          );
        },
        function(callback) {
          filmCreate(
            'The Lord of the Rings: The Fellowship of the Ring', 
            "The Lord of the Rings: The Fellowship of the Ring is a 2001 epic fantasy adventure film directed by Peter Jackson, based on the 1954 novel The Fellowship of the Ring, the first volume of J. R. R. Tolkien's The Lord of the Rings. The film is the first installment in the Lord of the Rings trilogy.", 
            2001, 
            [genres[1]], 
            549,
            4,
            callback
          );
        },
        function(callback) {
          filmCreate(
            'Raiders of the Lost Ark', 
            "Raiders of the Lost Ark is a 1981 American action-adventure film directed by Steven Spielberg and written by Lawrence Kasdan, based on a story by George Lucas and Philip Kaufman. It stars Harrison Ford, Karen Allen, Paul Freeman, Ronald Lacey, John Rhys-Davies, and Denholm Elliott. Ford portrays Indiana Jones, a globe-trotting archaeologist vying with Nazi German forces in 1936 to recover the long-lost Ark of the Covenant, a relic said to make an army invincible.", 
            1981, 
            [genres[1]], 
            449,
            6,
            callback
          );
        },
        function(callback) {
          filmCreate(
            'Apocalypto', 
            "Apocalypto (/əˌpɒkəˈlɪptoʊ/) is a 2006 American epic historical adventure film produced, co-written, and directed by Mel Gibson. The film features a cast of Native American and Indigenous Mexican actors consisting of Rudy Youngblood, Raoul Trujillo, Mayra Sérbulo, Dalia Hernández, Ian Uriel, Gerardo Taracena, Rodolfo Palacios, Bernardo Ruiz Juarez, Ammel Rodrigo Mendoza, Ricardo Diaz Mendoza, and Israel Contreras.", 
            2006, 
            [genres[1]], 
            599,
            3,
            callback
          );
        },
        function(callback) {
          filmCreate(
            'Monty Python and the Holy Grail', 
            "Monty Python and the Holy Grail is a 1975 British comedy film inspired by the Arthurian legend, written and performed by the Monty Python comedy group (Chapman, Cleese, Gilliam, Idle, Jones and Palin), directed by Gilliam and Jones. It was conceived during the hiatus between the third and fourth series of their BBC television series Monty Python's Flying Circus.", 
            1975, 
            [genres[1], genres[2]], 
            399,
            1,
            callback
          );
        },
        function(callback) {
          filmCreate(
            'Airplane!', 
            "Airplane! (alternatively titled Flying High!) is a 1980 American parody film written and directed by David and Jerry Zucker and Jim Abrahams in their directorial debuts,[6] and produced by Jon Davison.", 
            1980, 
            [genres[2]], 
            349,
            8,
            callback
          );
        },
        function(callback) {
          filmCreate(
            'Dr. Strangelove or: How I Learned to Stop Worrying and Love the Bomb', 
            "Dr. Strangelove or: How I Learned to Stop Worrying and Love the Bomb, more commonly known simply as Dr. Strangelove, is a 1964 black comedy film that satirizes the Cold War fears of a nuclear conflict between the Soviet Union and the United States. The film was directed, produced, and co-written by Stanley Kubrick and stars Peter Sellers, George C. Scott, Sterling Hayden, and Slim Pickens. The film was made in the United Kingdom.", 
            1964, 
            [genres[2]], 
            1099,
            1,
            callback
          );
        },
        function(callback) {
          filmCreate(
            'Goodfellas', 
            "Goodfellas (stylized GoodFellas) is a 1990 American biographical crime film directed by Martin Scorsese, written by Nicholas Pileggi and Scorsese, and produced by Irwin Winkler. It is a film adaptation of the 1985 nonfiction book Wiseguy by Pileggi. Starring Robert De Niro, Ray Liotta, Joe Pesci, Lorraine Bracco and Paul Sorvino, the film narrates the rise and fall of mob associate Henry Hill and his friends and family from 1955 to 1980.", 
            1990, 
            [genres[3]], 
            399,
            4,
            callback
          );
        },
        ],
        // optional callback
        cb);
}

async.series([
    createGenres,
    createFilms,
],
// Optional callback - `results` can be second parameter
function(err) {
    if (err) {
        console.log('FINAL ERR: '+ err);
    }
    else {
        console.log('Films: '+ films);
    }
    // All done, disconnect from database
    mongoose.connection.close();
});
