const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
} = require('../controllers/userController');

// Only Admin can access all users
router.get('/', authMiddleware, roleMiddleware('admin'), getAllUsers);

// Get single user
router.get('/:id', authMiddleware, getUserById);

// Update user (admin or self)
router.put('/:id', authMiddleware, updateUser);

// Delete user (admin only)
router.delete('/:id', authMiddleware, roleMiddleware('admin'), deleteUser);

module.exports = router;
