const mongoose = require('mongoose')

const CategorySchema = new mongoose.Schema({
    name: { type: String, required: true },
  slug: { type: String, required: true, unique: true }, 
    image: String,
})

CategorySchema.pre('save', function (next) {
  this.slug = this.name.toLowerCase().replace(/\s+/g, '-');
  next();
});

const CategoryModel = mongoose.model("Category", CategorySchema)
module.exports = CategoryModel