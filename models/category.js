var mongoose = require('mongoose');
const { Schema } = mongoose;

const CategorySchema = new Schema({
  name: { type: String, required: true, minlength: 1, maxlength: 100 }, 
  description: { type: String, required: true, minlength: 1, maxlength: 500 },
});

CategorySchema
  .virtual('url')
  .get(function() {
    return `/categories/${this._id}`;
  })

module.exports = mongoose.model('Category', CategorySchema);