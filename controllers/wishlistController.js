const Wishlist = require('../models/Wishlist');
exports.addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.userId; // Correct here

    if (!userId) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    let wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) wishlist = new Wishlist({ user: userId, items: [] });

    if (!wishlist.items.includes(productId)) {
      wishlist.items.push(productId);
      await wishlist.save();
    }

    res.status(200).json({ message: 'Product added to wishlist', wishlist });
  } catch (error) {
    console.error('Add to wishlist error:', error);
    res.status(500).json({ message: 'Server error while adding to wishlist' });
  }
};


exports.removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.userId;

    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    const wishlist = await Wishlist.findOneAndUpdate(
      { user: userId },
      { $pull: { items: productId } },
      { new: true }
    );

    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }

    res.status(200).json({ message: 'Product removed from wishlist', wishlist });
  } catch (error) {
    console.error('Remove from wishlist error:', error);
    res.status(500).json({ message: 'Server error while removing from wishlist' });
  }
};


exports.getWishlist = async (req, res) => {
  try {
    const userId = req.user.userId;
    const wishlist = await Wishlist.findOne({ user: userId }).populate('items'); // populate product details if needed

    if (!wishlist) {
      return res.status(200).json({ items: [] });
    }

    res.status(200).json(wishlist);
  } catch (error) {
    console.error('Get wishlist error:', error);
    res.status(500).json({ message: 'Server error while fetching wishlist' });
  }
};
