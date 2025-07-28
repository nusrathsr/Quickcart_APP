const mongoose = require('mongoose');

const paymentStatusSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: ['Unpaid', 'Paid', 'Failed']
  }
});

module.exports = mongoose.model('PaymentStatus', paymentStatusSchema);
