const mongoose = require('mongoose');

const orderStatusSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: ['Pending', 'Not Confirmed', 'Confirmed', 'Accepted', 'Delivered'],
  }
});

module.exports = mongoose.model('OrderStatus', orderStatusSchema);
