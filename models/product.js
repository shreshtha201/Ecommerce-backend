const mongoose = require("mongoose");

const variationSchema = new mongoose.Schema({
  colorName: { type: String, required: true },
  colorCode: { type: String, required: true },
  image: String,
  attributes: [String],
});

const productSchema = new mongoose.Schema({
  title: { type: String, required: true, maxlength: 70, unique: true },
  description: { type: String, maxlength: 1000 },
  sellingPrice: { type: Number, required: true },
  purchasePrice: { type: Number, required: true },
  gst: { type: Number, default: 0 },
  totalQuantity: { type: Number, required: true },
  minOrderQuantity: { type: Number, default: 1 },
  shippingCost: { type: Number, default: 0 },
  shippingMultiplyWithQuantity: { type: Boolean, default: false },

  productCodeSku: { type: String, required: true, unique: true },
  productId: { type: String, required: true },
  hsnCode: { type: String, required: true },

 
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  subCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  subSubCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },

  brand: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Brand",
  },

  unit: { type: String, default: "kg" },

  image: { type: String, required: true },
  gallery: { type: [String], default: [] },
  altText: String,
  variations: [variationSchema],

  meta: {
    title: String,
    description: String,
    tags: [String],
    image: String,
  },
  totalViews: { type: Number, default: 0 },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Product", productSchema);
