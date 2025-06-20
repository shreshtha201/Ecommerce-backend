const Razorpay = require('razorpay');
const Order = require('../models/order');
const crypto = require('crypto');

// Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay order & save to DB
exports.createOrder = async (req, res) => {
  try {
    const { amount, currency = 'INR', products } = req.body;

    if (!amount || !products || products.length === 0) {
      return res.status(400).json({ message: 'Amount and products are required' });
    }

    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: 'Unauthorized: Missing user ID' });
    }

    const options = {
      amount: amount * 100, // in paise
      currency,
      receipt: `receipt_order_${Date.now()}`,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    const newOrder = await Order.create({
      user: req.user.userId,
      products,
      amount,
      currency,
      orderId: razorpayOrder.id,
      status: 'processing',
      paymentStatus: 'pending',
    });

    res.status(201).json({ razorpayOrder, order: newOrder });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ message: 'Error creating order', error: error.message });
  }
};

// Verify Razorpay payment signature
exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = req.body;

    console.log('Verifying payment with:', {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    });

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      console.warn('Signature mismatch', { expectedSignature });
      return res.status(400).json({ message: 'Invalid payment signature' });
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      {
        paymentId: razorpay_payment_id,
        paymentStatus: 'completed',
        status: 'processing',
      },
      { new: true }
    );

    if (!order) {
      console.warn(' Order not found in DB');
      return res.status(404).json({ message: 'Order not found' });
    }

    console.log(' Payment verified for order:', order._id);
    res.status(200).json({ message: 'Payment verified', order });
  } catch (error) {
    console.error(' Payment verification error:', error);
    res.status(500).json({ message: 'Error verifying payment', error: error.message });
  }
};


// Get all orders (admin only)
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name email');
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
};

// Get single order
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.status(200).json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Error fetching order', error: error.message });
  }
};
// Get all orders of a specific user
exports.getOrdersByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: 'No orders found for this user' });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ message: 'Error fetching user orders', error: error.message });
  }
};


// Update order status (admin only)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = ['processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) return res.status(404).json({ message: 'Order not found' });

    res.status(200).json({ message: 'Order status updated', order });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Error updating order status', error: error.message });
  }
};

// Delete order
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.status(200).json({ message: 'Order deleted successfully', order });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ message: 'Error deleting order', error: error.message });
  }
};
