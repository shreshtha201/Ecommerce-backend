const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const {
  createReview,
  getProductReviews,
  deleteReview,
  updateReview,
  getAllReviews,
} = require("../controllers/reviewController");

// POST: Create review
router.post("/", authMiddleware, createReview);

// GET: Get reviews of product
router.get("/product/:productId", getProductReviews);

router.get("/", getAllReviews); 

// PUT: Update review
router.put("/:id", authMiddleware, updateReview);

// DELETE: Delete review
router.delete("/:id", authMiddleware, deleteReview);

module.exports = router;
