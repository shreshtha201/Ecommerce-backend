const express = require('express');
const router = express.Router();
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getTrendingProductsByViews,
 
} = require("../controllers/productController");

// 🔁 Correct order: specific routes first
router.post('/', createProduct);
router.get('/', getProducts);

// ✅ Trending route must come before dynamic ID routes
router.get("/trending/views", getTrendingProductsByViews);

// ✅ Only ONE :id route
router.get('/:id', getProductById);


router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;
