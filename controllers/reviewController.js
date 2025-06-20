const Review = require("../models/review");

exports.createReview = async (req, res) => {
  try {
    // console.log('Request body:', req.body);
    
    // ✅ Get userId from middleware (same pattern as cart)
    const userId = req.user.userId || req.user._id;
    const { productId, rating, comment } = req.body;
    
    // ✅ Validation
    if (!productId || !rating || rating <= 0 || rating > 5) {
      return res.status(400).json({ message: 'Invalid productId or rating (1-5 required)' });
    }
    
    // console.log('Creating review for:', { userId, productId, rating });
    
    // ✅ Check if user already reviewed this product
    const existingReview = await Review.findOne({ 
      userId: userId, 
      productId: productId 
    });
    
    if (existingReview) {
      // Update existing review instead of creating new
      existingReview.rating = rating;
      existingReview.comment = comment || existingReview.comment;
      await existingReview.save();
      
      // console.log('Review updated successfully');
      return res.status(200).json({
        message: 'Review updated successfully',
        review: existingReview
      });
    }
    
    // ✅ Create new review
    const newReview = new Review({
      userId: userId,
      productId: productId,
      rating: rating,
      comment: comment || ""
    });
    
    await newReview.save();
    
    console.log('Review created successfully');
    return res.status(201).json({
      message: 'Review created successfully',
      review: newReview
    });
    
  } catch (error) {
    console.error('Create review error:', error.message);
    return res.status(500).json({ 
      message: 'Server error while creating review',
      error: error.message 
    });
  }
};


exports.updateReview = async (req, res) => {
  try {
    const userId = req.user.userId || req.user._id;
    const { id } = req.params;
    const { rating, comment } = req.body;

    // Validation for rating if provided
    if (rating && (rating <= 0 || rating > 5)) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    // Find the review by id
    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user is owner or admin
    const isOwner = review.userId.toString() === userId.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'You are not allowed to update this review' });
    }

    // Update the fields if provided
    if (rating) review.rating = rating;
    if (comment) review.comment = comment;

    await review.save();

    return res.status(200).json({
      message: 'Review updated successfully',
      review,
    });
  } catch (error) {
    console.error('Update review error:', error.message);
    return res.status(500).json({
      message: 'Server error while updating review',
      error: error.message,
    });
  }
};


// ✅ Get all reviews for a product (same pattern)
exports.getProductReviews = async (req, res) => {
  try {
    console.log('Getting reviews for product:', req.params.productId);
    
    const { productId } = req.params;
    
    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }
    
    const reviews = await Review.find({ productId })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    
    console.log(`Found ${reviews.length} reviews`);
    
    return res.status(200).json({
      message: 'Reviews fetched successfully',
      count: reviews.length,
      reviews: reviews
    });
    
  } catch (error) {
    console.error('Get reviews error:', error.message);
    return res.status(500).json({ 
      message: 'Server error while fetching reviews',
      error: error.message 
    });
  }
};
exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("userId", "name email")
      .populate("productId", "name price images")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "All reviews fetched successfully",
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    console.error("Get all reviews error:", error.message);
    res.status(500).json({
      message: "Server error while fetching reviews",
      error: error.message,
    });
  }
};

// ✅ Delete review (same pattern)
exports.deleteReview = async (req, res) => {
  try {
    console.log('Deleting review:', req.params.id);
    
    const userId = req.user.userId || req.user._id;
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ message: 'Review ID is required' });
    }
    
    const review = await Review.findById(id);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    // ✅ Check if user owns this review or is admin
    const isOwner = review.userId.toString() === userId.toString();
    const isAdmin = req.user.role === 'admin';
    
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ 
        message: 'You are not authorized to delete this review' 
      });
    }
    
    await Review.findByIdAndDelete(id);
    
    console.log('Review deleted successfully');
    return res.status(200).json({ 
      message: 'Review deleted successfully' 
    });
    
  } catch (error) {
    console.error('Delete review error:', error.message);
    return res.status(500).json({ 
      message: 'Server error while deleting review',
      error: error.message 
    });
  }
};

// ✅ Get user's own reviews
exports.getUserReviews = async (req, res) => {
  try {
    console.log('Getting user reviews');
    
    const userId = req.user.userId || req.user._id;
    
    const reviews = await Review.find({ userId })
      .populate('productId', 'name price images')
      .sort({ createdAt: -1 });
    
    console.log(`Found ${reviews.length} user reviews`);
    
    return res.status(200).json({
      message: 'User reviews fetched successfully',
      count: reviews.length,
      reviews: reviews
    });
    
  } catch (error) {
    console.error('Get user reviews error:', error.message);
    return res.status(500).json({ 
      message: 'Server error while fetching user reviews',
      error: error.message 
    });
  }
};