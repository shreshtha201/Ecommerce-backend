const Product = require('../models/product');

// Create product
exports.createProduct = async (req, res) => {
  try {
    const {    title,
  description,
  sellingPrice,
  purchasePrice,
  gst,
  totalQuantity,
  minOrderQuantity,
  shippingCost,
  shippingMultiplyWithQuantity,
  image,
  altText,
  productCodeSku,
  productId,
  hsnCode,
  category,
  subCategory,
  subSubCategory,
  brand,
  unit,
  gallery,
  variations,
  meta } = req.body;

    // Validation
    if (  !title ||
  !sellingPrice ||
  !purchasePrice ||
  !image ||
  !productCodeSku ||
  !productId ||
  !hsnCode ||
  !category) {
      return res.status(400).json({ message: 'Title, price, and image are required' });
    }

    const product = await Product.create({
        title,
  description,
  sellingPrice,
  purchasePrice,
  gst,
  totalQuantity,
  minOrderQuantity,
  shippingCost,
  shippingMultiplyWithQuantity,
  image,
  altText,
  productCodeSku,
  productId,
  hsnCode,
  category,
  subCategory,
  subSubCategory,
  brand,
  unit,
  gallery,
  variations,
  meta
});

    res.status(201).json({
      message: "Product created successfully",
      product
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// // Get single product by ID
// exports.getProductById = async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id);
//     if (!product) return res.status(404).json({ message: 'Product not found' });
//     res.status(200).json(product);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const updates = req.body;
    const product = await Product.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
// Get trending products by highest views
// Get trending products by highest views
exports.getTrendingProductsByViews = async (req, res) => {
  try {
    const trendingProducts = await Product.find({
      totalViews: { $gt: 0 } // ✅ Only include products with views > 0
    })
      .sort({ totalViews: -1 }) // 🔥 Sort by views DESC
      .limit(10); // Change limit if needed

    res.status(200).json(trendingProducts);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $inc: { totalViews: 1 } },
      { new: true }
    );
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
