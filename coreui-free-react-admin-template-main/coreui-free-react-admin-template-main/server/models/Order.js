const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  name: String,
  email: String,
  address: String,
  city: String,         
  postalCode: String,
  phone: String,
  cartItems: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    },
  ],
  status: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'OrderStatus',
    required: true,
  },
  paymentStatus: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PaymentStatus',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


module.exports = mongoose.model("Order", orderSchema);
