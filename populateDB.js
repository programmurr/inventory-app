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
const Genre = require('./models/genre');
const Film = require('./models/film');
var fs = require('fs');
var path = require('path');

const mongoose = require('mongoose');
const mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const genres = {};

async function genreCreate (name, description) {
  const genre = new Genre({ name, description });
  try {
    await genre.save();
    console.log('New Genre: ' + genre);
    genres[genre.name] = genre;
  } catch (err) {
    throw new Error(err);
  }
}

async function filmCreate (name, description, image, year, genre, price, quantity) {
  const film = new Film({ 
    name,
    description,
    image: {
      data: image.data,
      contentType: image.contentType
    },
    year,
    genre,
    price,
    quantity,
  });
       
  try {
    await film.save();  
    console.log('New Film: ', { 
      name, 
      description, 
      image: image.contentType, 
      year, 
      genre, 
      price, 
      quantity 
    });
  } catch (err) {
    console.error('Error saving film: ', err);
  }
}

async function createGenres() {
  return await Promise.all([
    genreCreate(
      "Action", 
      "A film genre in which the protagonist or protagonists are thrust into a series of events that typically include violence, extended fighting, physical feats, rescues and frantic chases. Action films tend to feature a mostly resourceful hero struggling against incredible odds, which include life-threatening situations, a dangerous villain, or a pursuit which usually concludes in victory for the hero."
    ),
    genreCreate(
      "Adventure",
      "An adventure film is form of adventure fiction, and is a genre of film. Subgenres of adventure films include swashbuckler films, pirate films, and survival films. Adventure films may also be combined with other film genres such as action, animation, comedy, drama, fantasy, science fiction, family, horror, or war." 
    ),
    genreCreate(
      "Comedy",
      "A comedy film is a category of film which emphasizes humor. These films are designed to make the audience laugh through amusement. Films in this style traditionally have a happy ending (black comedy being an exception)."
    ),
    genreCreate(
      "Crime",
      "Crime films, in the broadest sense, is a film genre inspired by and analogous to the crime fiction literary genre. Films of this genre generally involve various aspects of crime and its detection. Stylistically, the genre may overlap and combine with many other genres, such as drama or gangster film, but also include comedy, and, in turn, is divided into many sub-genres, such as mystery, suspense or noir."
    )
  ]);
}


async function createFilms() {
  return await Promise.all([
    filmCreate(
      'The Terminator', 
      'The Terminator is a 1984 American science fiction action film directed by James Cameron. It stars Arnold Schwarzenegger as the Terminator, a cyborg assassin sent back in time from 2029 to 1984 to kill Sarah Connor (Linda Hamilton), whose unborn son will one day save mankind from extinction by a hostile artificial intelligence in a post-apocalyptic future.', 
      {
        data: fs.readFileSync(path.join(__dirname + '/public/images/terminator.jpg')),
        contentType: 'image/jpg'
      },
      1984, 
      [genres['Action']], 
      599,
      3
    ),
    filmCreate(
      'Die Hard', 
      'Die Hard is a 1988 American action film directed by John McTiernan and written by Jeb Stuart and Steven E. de Souza. It is based on the 1979 novel Nothing Lasts Forever by Roderick Thorp, and it stars Bruce Willis, Alan Rickman, Alexander Godunov, and Bonnie Bedelia. Die Hard follows New York City police detective John McClane (Willis) who is caught up in a terrorist takeover of a Los Angeles skyscraper while visiting his estranged wife.', 
      {
        data: fs.readFileSync(path.join(__dirname + '/public/images/diehard.jpg')),
        contentType: 'image/jpg'
      },
      1988, 
      [genres['Action']], 
      499,
      2
    ),
    filmCreate(
      'Hard Boiled', 
      'Hard Boiled is a 1992 Hong Kong action film directed by John Woo and from a screenplay by Barry Wong. The film stars Chow Yun-fat as Inspector "Tequila" Yuen, Tony Leung Chiu-wai as Alan, an undercover cop, and Anthony Wong as Johnny Wong, a leader of the criminal triads.', 
      {
        data: fs.readFileSync(path.join(__dirname + '/public/images/hardboiled.jpg')),
        contentType: 'image/jpg'
      },
      1992, 
      [genres['Action']], 
      699,
      1
    ),
    filmCreate(
      'The Lord of the Rings: The Fellowship of the Ring', 
      "The Lord of the Rings: The Fellowship of the Ring is a 2001 epic fantasy adventure film directed by Peter Jackson, based on the 1954 novel The Fellowship of the Ring, the first volume of J. R. R. Tolkien's The Lord of the Rings. The film is the first installment in the Lord of the Rings trilogy.", 
      {
        data: fs.readFileSync(path.join(__dirname + '/public/images/lotr.jpg')),
        contentType: 'image/jpg'
      },
      2001, 
      [genres['Adventure']], 
      549,
      4
    ),
    filmCreate(
      'Raiders of the Lost Ark', 
      "Raiders of the Lost Ark is a 1981 American action-adventure film directed by Steven Spielberg and written by Lawrence Kasdan, based on a story by George Lucas and Philip Kaufman. It stars Harrison Ford, Karen Allen, Paul Freeman, Ronald Lacey, John Rhys-Davies, and Denholm Elliott. Ford portrays Indiana Jones, a globe-trotting archaeologist vying with Nazi German forces in 1936 to recover the long-lost Ark of the Covenant, a relic said to make an army invincible.", 
      {
        data: fs.readFileSync(path.join(__dirname + '/public/images/raiders.jpg')),
        contentType: 'image/jpg'
      },
      1981, 
      [genres['Adventure']], 
      449,
      6
    ),
    filmCreate(
      'Apocalypto', 
      "Apocalypto (/əˌpɒkəˈlɪptoʊ/) is a 2006 American epic historical adventure film produced, co-written, and directed by Mel Gibson. The film features a cast of Native American and Indigenous Mexican actors consisting of Rudy Youngblood, Raoul Trujillo, Mayra Sérbulo, Dalia Hernández, Ian Uriel, Gerardo Taracena, Rodolfo Palacios, Bernardo Ruiz Juarez, Ammel Rodrigo Mendoza, Ricardo Diaz Mendoza, and Israel Contreras.", 
      {
        data: fs.readFileSync(path.join(__dirname + '/public/images/apocalypto.jpg')),
        contentType: 'image/jpg'
      },
      2006, 
      [genres['Adventure']], 
      599,
      3
    ),
    filmCreate(
      'Monty Python and the Holy Grail', 
      "Monty Python and the Holy Grail is a 1975 British comedy film inspired by the Arthurian legend, written and performed by the Monty Python comedy group (Chapman, Cleese, Gilliam, Idle, Jones and Palin), directed by Gilliam and Jones. It was conceived during the hiatus between the third and fourth series of their BBC television series Monty Python's Flying Circus.", 
      {
        data: fs.readFileSync(path.join(__dirname + '/public/images/montypython.jpg')),
        contentType: 'image/jpg'
      },
      1975, 
      [genres['Adventure'], genres['Comedy']], 
      399,
      1
    ),
    filmCreate(
      'Airplane!', 
      "Airplane! (alternatively titled Flying High!) is a 1980 American parody film written and directed by David and Jerry Zucker and Jim Abrahams in their directorial debuts,[6] and produced by Jon Davison.", 
      { data: "", contentType: "" },
      1980, 
      [genres['Comedy']], 
      349,
      8
    ),
    filmCreate(
      'Dr. Strangelove or: How I Learned to Stop Worrying and Love the Bomb', 
      "Dr. Strangelove or: How I Learned to Stop Worrying and Love the Bomb, more commonly known simply as Dr. Strangelove, is a 1964 black comedy film that satirizes the Cold War fears of a nuclear conflict between the Soviet Union and the United States. The film was directed, produced, and co-written by Stanley Kubrick and stars Peter Sellers, George C. Scott, Sterling Hayden, and Slim Pickens. The film was made in the United Kingdom.", 
      {
        data: fs.readFileSync(path.join(__dirname + '/public/images/drstrangelove.jpg')),
        contentType: 'image/jpg'
      },
      1964, 
      [genres['Comedy']], 
      1099,
      1
    ),
    filmCreate(
      'Goodfellas', 
      "Goodfellas (stylized GoodFellas) is a 1990 American biographical crime film directed by Martin Scorsese, written by Nicholas Pileggi and Scorsese, and produced by Irwin Winkler. It is a film adaptation of the 1985 nonfiction book Wiseguy by Pileggi. Starring Robert De Niro, Ray Liotta, Joe Pesci, Lorraine Bracco and Paul Sorvino, the film narrates the rise and fall of mob associate Henry Hill and his friends and family from 1955 to 1980.", 
      {
        data: fs.readFileSync(path.join(__dirname + '/public/images/goodfellas.jpg')),
        contentType: 'image/jpg'
      },
      1990, 
      [genres['Crime']], 
      399,
      4
    )
  ]);
}

async function launch() {
  try {
    await createGenres();
    console.log('GENRES COMPLETE');
    await createFilms();
    console.log('FILMS COMPLETE');
    await mongoose.connection.close();
    console.log('DONE');
  } catch(err) {
    throw new Error(err);
  }
}

try {
  launch();
} catch(err) {
  console.log('FINAL ERR: '+ err);
}