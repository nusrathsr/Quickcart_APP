const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const ProductModel = require('./models/Product')
const OfferProductModel = require('./models/OfferProduct')
const CategoryModel = require('./models/Category')
const MasterCategoryModel = require('./models/MasterCategory');
const SubCategoryModel = require('./models/SubCategory');
const UserModel = require('./models/User');
const OrderModel = require('./models/Order')
const StatusModel = require('./models/OrderStatus');
const PaymentStatusModel = require('./models/PaymentStatus');
const razorpay = require('./utils/razorpay');

const app = express()
app.use(cors())
app.use(express.json())

mongoose.connect("mongodb+srv://nusrathsr:12345@cluster0.v2nukit.mongodb.net/productdb")
  .then(() => {
    console.log('MongoDB connected');
    seedDefaultStatuses();
  })
  .catch(err => console.error('MongoDB connection error:', err));

async function seedDefaultStatuses() {
  const defaultStatuses = ['Pending', 'Confirmed', 'Accepted', 'Delivered'];
  for (let status of defaultStatuses) {
    const exists = await StatusModel.findOne({ name: status });
    if (!exists) {
      await StatusModel.create({ name: status });
      console.log(`Inserted order status: ${status}`);
    }
  }
  const defaultPaymentStatuses = ['Unpaid', 'Paid', 'Failed'];
  for (let paymentStatus of defaultPaymentStatuses) {
    const exists = await PaymentStatusModel.findOne({ name: paymentStatus });
    if (!exists) {
      await PaymentStatusModel.create({ name: paymentStatus });
      console.log(`Inserted payment status: ${paymentStatus}`);
    }
  }
}

// --- AUTH ROUTES ---
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new UserModel({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || "your_jwt_secret", { expiresIn: "1d" });

    res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- ORDER ROUTES ---
app.post('/api/orders', async (req, res) => {
  try {
    const { name, email, address, city, postalCode, phone, cartItems } = req.body;

    let formattedCartItems = [];
    if (Array.isArray(cartItems)) {
      formattedCartItems = cartItems;
    } else if (typeof cartItems === 'object' && cartItems !== null) {
      formattedCartItems = Object.entries(cartItems).map(([productId, quantity]) => ({ product: productId, quantity }));
    } else {
      return res.status(400).json({ error: 'Invalid cartItems format' });
    }

    const detailedCartItems = [];

    for (let item of formattedCartItems) {
      const product = await ProductModel.findById(item.product);
      if (!product) {
        return res.status(400).json({ error: `Product not found: ${item.product}` });
      }

      detailedCartItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
      });
    }

    const pendingStatus = await StatusModel.findOne({ name: "Pending" });
    const unpaidStatus = await PaymentStatusModel.findOne({ name: "Unpaid" });

    const order = new OrderModel({
      name,
      email,
      address,
      city,
      postalCode,
      phone,
      cartItems: detailedCartItems,
      status: pendingStatus?._id || null,
      paymentStatus: unpaidStatus?._id || null,
    });

    await order.save();
    res.status(201).json({ message: 'Order placed successfully', orderId: order._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to place order' });
  }
});

app.get('/api/orders', async (req, res) => {
  try {
    const orders = await OrderModel.find()
      .sort({ createdAt: -1 })
      .populate('status')
      .populate('paymentStatus')
      .populate('cartItems.product');  // <--- added this line to get product details

    const enrichedOrders = orders.map(order => {
      let cartItemsArray = [];
      if (Array.isArray(order.cartItems)) {
        cartItemsArray = order.cartItems.map(item => ({
          name: item.name || (item.product ? item.product.name : 'Unknown Product'),
          quantity: item.quantity,
          price: item.product?.price ?? item.price ?? 0,  // use product price if available, else saved price
        }));
      }
      return { ...order.toObject(), cartItems: cartItemsArray };
    });

    res.json(enrichedOrders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

app.get('/api/products/most-sold', async (req, res) => {
  try {
    const orders = await OrderModel.find().populate('cartItems.product');
    const productSales = {};

    for (let order of orders) {
      for (let item of order.cartItems) {
        if (!item.product) continue; // Skip if product is missing

        const productId = item.product._id.toString();
        if (!productSales[productId]) {
          productSales[productId] = {
            product: item.product,
            totalSold: 0,
          };
        }
        productSales[productId].totalSold += item.quantity;
      }
    }

    const sortedProducts = Object.values(productSales)
      .sort((a, b) => b.totalSold - a.totalSold)
      .slice(0, 8);

    res.json(sortedProducts);
  } catch (err) {
    console.error("Error in /api/products/most-sold:", err.message);
    res.status(500).json({ error: 'Failed to fetch most sold products' });
  }
});

app.get('/api/orders/:email', async (req, res) => {
  const { email } = req.params;

  try {
    const orders = await OrderModel.find({ email }); // or userEmail, adjust as per your schema
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});
app.get('/api/order-statuses', async (req, res) => {
  try {
    const statuses = await StatusModel.find({});
    res.json(statuses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch order statuses' });
  }
});

app.get('/api/payment-statuses', async (req, res) => {
  try {
    const paymentStatuses = await PaymentStatusModel.find({});
    res.json(paymentStatuses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch payment statuses' });
  }
});
// Update order status
app.put('/api/orders/:orderId/status', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { statusId } = req.body;
    const updatedOrder = await OrderModel.findByIdAndUpdate(orderId, { status: statusId }, { new: true }).populate('status');
    if (!updatedOrder) return res.status(404).json({ message: "Order not found" });
    res.json(updatedOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update payment status
app.put('/api/orders/:orderId/payment-status', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { paymentStatusId } = req.body;
    const order = await OrderModel.findByIdAndUpdate(orderId, { paymentStatus: paymentStatusId }, { new: true });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- CATEGORY ROUTES ---
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await CategoryModel.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/categories', async (req, res) => {
  try {
    const category = new CategoryModel(req.body);
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create category' });
  }
});

app.delete('/api/categories/:id', async (req, res) => {
  try {
    const deletedCategory = await CategoryModel.findByIdAndDelete(req.params.id);
    if (!deletedCategory) return res.status(404).json({ message: 'Category not found' });
    res.json({ message: 'Category deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- MASTER CATEGORY ROUTES ---
app.post('/api/master-categories', async (req, res) => {
  try {
    const { name, slug, image } = req.body;
    const newCategory = await MasterCategoryModel.create({ name, slug, image });
    res.status(201).json(newCategory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/master-categories', async (req, res) => {
  try {
    const categories = await MasterCategoryModel.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get('/api/master-categories/slug/:slug', async (req, res) => {
  try {
    const category = await MasterCategoryModel.findOne({ slug: req.params.slug });
    if (!category) return res.status(404).json({ message: 'Master Category not found' });
    res.json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/master-categories/:id', async (req, res) => {
  try {
    const category = await MasterCategoryModel.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Master Category not found' });
    res.json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/master-categories/:id', async (req, res) => {
  try {
    const { name, image } = req.body;
    const slug = name.toLowerCase().replace(/\s+/g, '-');
    const updatedCategory = await MasterCategoryModel.findByIdAndUpdate(
      req.params.id,
      { name, slug, image },
      { new: true, runValidators: true }
    );
    if (!updatedCategory) return res.status(404).json({ message: 'Master Category not found' });
    res.json({ message: 'Master Category updated successfully', category: updatedCategory });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.delete('/api/master-categories/:id', async (req, res) => {
  try {
    await MasterCategoryModel.findByIdAndDelete(req.params.id);
    res.json({ message: 'Master Category deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- SUBCATEGORY ROUTES ---
app.post('/api/sub-categories', async (req, res) => {
  try {
    const { name, slug, image, masterCategory } = req.body;
    const newSubCategory = await SubCategoryModel.create({ name, slug, image, masterCategory });
    res.status(201).json(newSubCategory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/sub-categories', async (req, res) => {
  try {
    const { masterCategoryId } = req.query;
    const filter = masterCategoryId ? { masterCategory: masterCategoryId } : {};
    const subCategories = await SubCategoryModel.find(filter).populate('masterCategory', 'name');
    res.json(subCategories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.get('/api/sub-categories/:id', async (req, res) => {
  try {
    const subCategory = await SubCategoryModel.findById(req.params.id).populate('masterCategory', 'name');
    if (!subCategory) return res.status(404).json({ message: 'Sub Category not found' });
    res.json(subCategory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.put('/api/sub-categories/:id', async (req, res) => {
  try {
    const { name, image, masterCategory } = req.body;
    const slug = name.toLowerCase().replace(/\s+/g, '-');
    const updatedSubCategory = await SubCategoryModel.findByIdAndUpdate(
      req.params.id,
      { name, slug, image, masterCategory },
      { new: true, runValidators: true }
    );
    if (!updatedSubCategory) return res.status(404).json({ message: 'Sub Category not found' });
    res.json({ message: 'Sub Category updated successfully', subCategory: updatedSubCategory });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get('/api/sub-categories/by-master/:slug', async (req, res) => {
  try {
    const masterCategory = await MasterCategoryModel.findOne({ slug: req.params.slug });
    if (!masterCategory) return res.status(404).json({ message: 'Master Category not found' });

    const subCategories = await SubCategoryModel.find({ masterCategory: masterCategory._id });
    res.json(subCategories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/sub-categories/:id', async (req, res) => {
  try {
    await SubCategoryModel.findByIdAndDelete(req.params.id);
    res.json({ message: 'Subcategory deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// --- PRODUCT ROUTES ---
app.get('/api/products', async (req, res) => {
  try {
    const { subcategory, masterCategory, search, page = 1, limit = 6, minPrice, maxPrice, sort } = req.query;
    const query = {};

    if (subcategory) {
      const subCatDoc = await SubCategoryModel.findOne({ slug: subcategory });
      if (!subCatDoc) return res.status(404).json({ message: 'Subcategory not found' });
      query.subCategory = subCatDoc._id;
    }

    if (masterCategory) {
      const masterCatDoc = await MasterCategoryModel.findOne({ slug: masterCategory });
      if (!masterCatDoc) return res.status(404).json({ message: 'Master category not found' });
      query.masterCategory = masterCatDoc._id;
    }

    if (search) query.name = { $regex: search, $options: 'i' };

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice && !isNaN(Number(minPrice))) query.price.$gte = Number(minPrice);
      if (maxPrice && !isNaN(Number(maxPrice))) query.price.$lte = Number(maxPrice);
      if (Object.keys(query.price).length === 0) delete query.price;
    }

    const skip = (Number(page) - 1) * Number(limit);
    const sortOption = sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : {};

    const totalProducts = await ProductModel.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / Number(limit));
    const products = await ProductModel.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit))
      .populate('subCategory', 'name slug')
      .populate('masterCategory', 'name slug');

    res.json({ products, totalPages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


app.get('/api/products/by-ids', async (req, res) => {
  try {
    const ids = req.query.ids?.split(',') || [];
    const validIds = ids.filter(id => mongoose.Types.ObjectId.isValid(id));
    if (validIds.length === 0) return res.status(400).json({ message: 'No valid product IDs provided' });
    const products = await ProductModel.find({ _id: { $in: validIds } });
    res.json({ products });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});
app.post('/api/products', async (req, res) => {
  try {
    const { name, price, quantity, description, image, masterCategory, subCategory } = req.body;

    if (!subCategory) return res.status(400).json({ error: "Subcategory is required" });

    const product = await ProductModel.create({
      name,
      price,
      quantity,
      description,
      image,
      masterCategory,
      subCategory
    });

    res.json({ message: "Product created", product });
  } catch (err) {
    console.error('Error in POST /products:', err);  // <=== Add this to see full error
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.id)
      .populate('masterCategory', 'name slug')
      .populate('subCategory', 'name slug');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ product });
  } catch (err) {
    console.error('Error fetching product:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/products/by-sub/:slug', async (req, res) => {
  try {
    const subCategory = await SubCategoryModel.findOne({ slug: req.params.slug });
    if (!subCategory) return res.status(404).json({ message: 'Subcategory not found' });

    // Find products belonging to this subcategory
    const products = await ProductModel.find({ subCategory: subCategory._id });

    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/products/by-master/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const { search = '', minPrice = 0, maxPrice = Infinity, sort = 'asc', page = 1, limit = 10 } = req.query;

    // Find the master category by slug
    const masterCategory = await MasterCategoryModel.findOne({ slug });
    if (!masterCategory) return res.status(404).json({ message: 'Master Category not found' });

    // Build query
    const filter = {
      masterCategory: masterCategory._id,
      name: { $regex: search, $options: 'i' },
      price: { $gte: Number(minPrice), $lte: Number(maxPrice) }
    };

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Fetch products
    const products = await ProductModel.find(filter)
      .sort({ price: sort === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(Number(limit));

    // Count total for pagination
    const totalProducts = await ProductModel.countDocuments(filter);

    res.json({
      products,
      totalProducts,
      totalPages: Math.ceil(totalProducts / limit),
      currentPage: Number(page)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/debug/products/:id', async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.id)
      .populate('masterCategory', 'name slug')
      .populate('subCategory', 'name slug');

    if (!product) return res.status(404).json({ message: 'Product not found' });

    res.json({ product });
  } catch (err) {
    console.error('Debug fetch product error:', err);
    res.status(500).json({ error: err.message, stack: err.stack });
  }
});

app.put('/api/products/:id', async (req, res) => {
  try {
    const updatedProduct = await ProductModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedProduct) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product updated successfully', product: updatedProduct });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    const deletedProduct = await ProductModel.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- OFFER PRODUCTS ROUTES ---
app.get('/api/offer-products', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const search = req.query.search || '';
    const query = { name: { $regex: search, $options: 'i' } };

    const total = await OfferProductModel.countDocuments(query);
    const offers = await OfferProductModel.find(query).skip((page - 1) * limit).limit(limit);

    res.json({
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      offers,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch offer products' });
  }
});

app.post('/api/offer-products', async (req, res) => {
  try {
    const offer = await OfferProductModel.create(req.body);
    res.json({ message: 'Offer product created', offer });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/offer-products/:id', async (req, res) => {
  try {
    const offer = await OfferProductModel.findById(req.params.id);
    if (!offer) return res.status(404).json({ message: 'Offer product not found' });
    res.json({ offer });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

app.put('/api/offer-products/:id', async (req, res) => {
  try {
    const updatedOffer = await OfferProductModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedOffer) return res.status(404).json({ message: 'Offer product not found' });
    res.json({ message: 'Offer product updated successfully', offer: updatedOffer });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/offer-products/:id', async (req, res) => {
  try {
    const deletedOffer = await OfferProductModel.findByIdAndDelete(req.params.id);
    if (!deletedOffer) return res.status(404).json({ message: 'Offer product not found' });
    res.json({ message: 'Offer product deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- USER PROFILE ROUTES ---
app.get('/api/users/profile', async (req, res) => {
  try {
    const email = req.query.email;
    if (!email) return res.status(400).json({ error: "Email is required" });
    const user = await UserModel.findOne({ email }).select('-password');
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/users/update-profile', async (req, res) => {
  try {
    const { email, name, address, phone } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });
    const updatedUser = await UserModel.findOneAndUpdate(
      { email },
      { name, address, phone },
      { new: true, runValidators: true }
    ).select('-password');
    if (!updatedUser) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'Profile updated', user: updatedUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/orders/user/:email', async (req, res) => {
  try {
    const email = req.params.email;
    const orders = await OrderModel.find({ email })
      .sort({ createdAt: -1 })
      .populate('cartItems.product')
      .populate('status')
      .populate('paymentStatus');

    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders by user' });
  }
});
// --- RAZORPAY PAYMENT ---
app.post('/api/create-order', async (req, res) => {
  const { amount, currency = 'INR' } = req.body;
  const options = {
    amount, // amount in paise
    currency,
    receipt: 'receipt_order_74394',
  };
  try {
    const order = await razorpay.orders.create(options);
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ error: "Failed to create Razorpay order" });
  }
});

const crypto = require('crypto');
app.post('/api/verify-payment', (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  const generated_signature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest('hex');

  if (generated_signature === razorpay_signature) {
    res.json({ status: 'success' });
  } else {
    res.status(400).json({ status: 'failure', message: 'Invalid signature' });
  }
});

// --- GOOGLE LOGIN ---
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

app.post('/api/google-login', async (req, res) => {
  try {
    const { token } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { email, name, sub: googleId } = payload;
    let user = await UserModel.findOne({ email });
    if (!user) {
      user = new UserModel({ name, email, password: '', googleId });
      await user.save();
    }
    const jwtToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '1d' });
    res.status(200).json({
      message: 'Google login successful',
      token: jwtToken,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    res.status(401).json({ message: 'Invalid Google token' });
  }
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
