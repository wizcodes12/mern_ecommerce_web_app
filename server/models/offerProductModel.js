const mongoose = require('mongoose');

const offerProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  specialDiscountedPrice: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('OfferProduct', offerProductSchema);