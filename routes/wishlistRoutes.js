const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController');
const authMiddleware = require('../middlewares/authMiddleware');

// POST - Add to wishlist
router.post('/add', authMiddleware, wishlistController.addToWishlist);

// DELETE - Remove from wishlist
router.delete('/remove/:productId', authMiddleware, wishlistController.removeFromWishlist);

// GET - Get wishlist
router.get('/', authMiddleware, wishlistController.getWishlist);

module.exports = router;
