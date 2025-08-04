const mongoose = require('mongoose');

const SubCategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  image: { type: String },
  masterCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MasterCategory',
    required: true,
  },
}, { timestamps: true });

// Automatically create slug if not provided
SubCategorySchema.pre('save', function (next) {
  if (!this.slug && this.name) {
    this.slug = this.name.toLowerCase().replace(/\s+/g, '-');
  }
  next();
});

module.exports = mongoose.model('SubCategory', SubCategorySchema);
