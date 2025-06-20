const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,  // Add index for faster queries by user
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      quantity: {
        type: Number,
        default: 1,
        min: [1, 'Quantity can not be less than 1']  // validation for quantity
      }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Cart', cartSchema);
