var mongoose = require('mongoose');
const { Schema } = mongoose;

const GenreSchema = new Schema({
  name: { type: String, required: true, minlength: 1, maxlength: 100 }, 
  description: { type: String, required: true, minlength: 1, maxlength: 500 },
});

GenreSchema
  .virtual('url')
  .get(function() {
    return `/categories/${this._id}`;
  })

module.exports = mongoose.model('Genre', GenreSchema);