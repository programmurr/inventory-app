var mongoose = require('mongoose');
const { Schema } = mongoose;
const he = require('he');

const GenreSchema = new Schema({
  name: { type: String, required: true, minlength: 1, maxlength: 100 }, 
  description: { type: String, required: true, minlength: 1, maxlength: 500 },
});

GenreSchema
  .virtual('url')
  .get(function() {
    return `/genre/${this._id}`;
  })

GenreSchema
  .virtual('escapedName')
  .get(function() {
    return he.decode(this.name);
  })

GenreSchema
  .virtual('escapedDescription')
  .get(function() {
    return he.decode(this.description);
  })


module.exports = mongoose.model('Genre', GenreSchema);