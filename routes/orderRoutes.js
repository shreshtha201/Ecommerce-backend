const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

const {
  createOrder,
  verifyPayment,
  getOrders,
  getOrderById,
  updateOrderStatus,
  getOrdersByUserId,
  deleteOrder,
} = require('../controllers/orderController');

// Public routes (user)
router.post('/', authMiddleware, createOrder);
router.post('/verify', authMiddleware, verifyPayment);
router.get('/:id', authMiddleware, getOrderById);
router.get('/user/:userId', authMiddleware, getOrdersByUserId);

// Admin routes
router.get('/', authMiddleware, roleMiddleware('admin'), getOrders);

router.put('/:id/status', authMiddleware, roleMiddleware('admin'), updateOrderStatus);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), deleteOrder);

module.exports = router;
