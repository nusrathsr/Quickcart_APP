const mongoose = require('mongoose');

const MasterCategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  image: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('MasterCategory', MasterCategorySchema);
