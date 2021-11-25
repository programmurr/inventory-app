var mongoose = require('mongoose');
const { Schema } = mongoose;

const FilmSchema = new Schema({
  name: { 
    type: String, 
    required: true, 
    unique: true, 
    minlength: 1, 
    maxlength: 100, 
  },
  description: {
    type: String, 
    required: true, 
    minlength: 1, 
    maxlength: 500 
  },
  year: {
    type: Number,
    required: true,
    min: 1880,
  },
  genre: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'Genre' 
  }],
  price: { 
    type: Number, 
    min: 0, 
    set: v => Math.round(v), 
    required: true 
  },
  quantity: { 
    type: Number, 
    required: true,
    min: 1, 
    get: v => Math.round(v), 
    set: v => Math.round(v)
  }
});

FilmSchema
  .virtual('url')
  .get(function() {
    return `/film/${this._id}`;
  });

FilmSchema
  .virtual('price_pounds')
  .get(function() {
    const pound = this.price / 100;
    return pound.toLocaleString("en-GB", { style: "currency", currency: "GBP" });
  })

module.exports = mongoose.model('Film', FilmSchema);

