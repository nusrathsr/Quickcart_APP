const mongoose = require('mongoose')
const slugify = require('slugify')
const CategoryModel = require('./models/Category')  // adjust if needed

mongoose.connect('mongodb+srv://nusrathsr:12345@cluster0.v2nukit.mongodb.net/productdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('✅ Connected to MongoDB')
  updateSlugs()
}).catch(err => {
  console.error('❌ DB connection error:', err)
})

async function updateSlugs() {
  const categories = await CategoryModel.find()

  for (let cat of categories) {
    if (!cat.slug) {
      cat.slug = slugify(cat.name, { lower: true, strict: true })
      await cat.save()
      console.log(`Updated slug: ${cat.name} → ${cat.slug}`)
    }
  }

  console.log('🎉 All category slugs updated!')
  process.exit()
}
