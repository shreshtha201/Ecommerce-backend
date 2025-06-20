const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  discount: { type: Number, required: true },
  type: { type: String, required: true }, 
  expiryDate: { type: Date, required: true },
});

module.exports = mongoose.model("Coupon", couponSchema);
