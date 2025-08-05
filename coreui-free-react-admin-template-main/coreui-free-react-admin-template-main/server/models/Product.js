const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: Number,
  quantity: Number,
  description: String,
  image: String,

  subCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SubCategory',
    required: true,
  },
  masterCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MasterCategory',
  },
  }, { timestamps: true });
//   category: {
//     type: mongoose.Schema.Types.ObjectId,  // <-- category stores ObjectId
//     ref: 'Category',                      // <-- reference to Category model
//     required: true,
//   },
// })

const ProductModel = mongoose.model('Product', ProductSchema)
module.exports = ProductModel
