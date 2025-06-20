const Coupon = require('../models/coupon');

exports.createCoupon = async (req, res) => {
  try {
    const { code, discount, type, expiryDate } = req.body;

    if (!code || !discount || !type || !expiryDate) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const couponExists = await Coupon.findOne({ code });
    if (couponExists) {
      return res.status(400).json({ error: "Coupon code already exists" });
    }

    const coupon = new Coupon({
      code,
      discount,
      type,
      expiryDate: new Date(expiryDate),
    });

    await coupon.save();

    res.status(201).json({ message: "Coupon created successfully", coupon });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json({ message: "Coupons fetched", coupons });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) return res.status(404).json({ message: "Coupon not found" });
    res.json({ message: "Coupon deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const { code, discount, type, expiryDate, isActive } = req.body;

    const coupon = await Coupon.findById(id);
    if (!coupon) return res.status(404).json({ message: "Coupon not found" });

    if (code) coupon.code = code;
    if (discount) coupon.discount = discount;
    if (type) coupon.type = type;
    if (expiryDate) coupon.expiryDate = expiryDate;
    if (typeof isActive === 'boolean') coupon.isActive = isActive;

    await coupon.save();

    res.json({ message: "Coupon updated", coupon });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
