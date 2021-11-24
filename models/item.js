var mongoose = require('mongoose');
const { Schema } = mongoose;

const ItemSchema = new Schema({
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
  category: { 
    type: Schema.Types.ObjectId, 
    ref: 'Category', 
    required: true 
  },
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

ItemSchema
  .virtual('url')
  .get(function() {
    return `/item/${this._id}`;
  });

ItemSchema
  .virtual('price_pounds')
  .get(function() {
    const pound = this.price / 100;
    return pound.toLocaleString("en-GB", { style: "currency", currency: "GBP" });
  })

module.exports = mongoose.model('Item', ItemSchema);

