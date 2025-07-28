const mongoose = require('mongoose')

const offerProductSchema = new mongoose.Schema({
  name: String,
  price: Number,
  offerPrice: Number,
  quantity: Number,
  image: String,
  title: String, 
   offerText: String
})

module.exports = mongoose.model('OfferProduct', offerProductSchema)