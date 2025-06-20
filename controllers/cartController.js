const Cart = require('../models/Cart');



exports.addToCart = async (req, res) => {
  try {
    console.log('Request body:', req.body);


    const userId = req.user.userId;

    const { productId, quantity } = req.body;

    if (!productId || !quantity || quantity <= 0) {
      return res.status(400).json({ message: 'Invalid productId or quantity' });
    }

    // ✅ Find or create cart for user
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    const existingItem = cart.items.find(item => item.product.toString() === productId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    return res.status(200).json(cart);
  } catch (error) {
    console.error('Add to cart error:', error.message);
    return res.status(500).json({ message: 'Server error while adding to cart' });
  }
};




exports.updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.userId; // ✅ Use `userId` from token payload

    if (!productId || !quantity || quantity <= 0) {
      return res.status(400).json({ message: 'Invalid productId or quantity' });
    }

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const item = cart.items.find(item => item.product.toString() === productId);
    if (!item) return res.status(404).json({ message: 'Item not found in cart' });

    item.quantity = quantity;
    await cart.save();

    return res.status(200).json({
      message: 'Cart item updated successfully ✅',
      cart
    });
  } catch (error) {
    console.error('Update cart item error:', error);
    return res.status(500).json({ message: 'Server error while updating cart item' });
  }
};


exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.userId; // ✅ Use `userId` from token

    if (!productId) {
      return res.status(400).json({ message: 'ProductId parameter is required' });
    }

    const cart = await Cart.findOneAndUpdate(
      { user: userId },
      { $pull: { items: { product: productId } } },
      { new: true }
    );

    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    return res.status(200).json({
      message: 'Item removed from cart successfully ✅',
      cart
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    return res.status(500).json({ message: 'Server error while removing from cart' });
  }
};


exports.getCart = async (req, res) => {
  try {
    const userId = req.user.userId; // Extracted from token by authMiddleware

    const cart = await Cart.findOne({ user: userId }).populate('items.product');

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    return res.status(200).json(cart);
  } catch (error) {
    console.error('Get cart error:', error);
    return res.status(500).json({ message: 'Server error while fetching cart' });
  }
};
