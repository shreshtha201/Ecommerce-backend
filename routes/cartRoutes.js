const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');  // middleware import
const cartController = require('../controllers/cartController'); // controller import

// Use authMiddleware consistently, and use cartController functions with prefix
router.post('/cart/add', authMiddleware, cartController.addToCart);
router.put('/update', authMiddleware, cartController.updateCartItem);
router.delete('/remove/:productId', authMiddleware, cartController.removeFromCart);
router.get('/', authMiddleware, cartController.getCart);

module.exports = router;
