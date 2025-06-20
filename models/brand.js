const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: String,
   logo: {
    type: String,
    required: false, 
  },
});

module.exports = mongoose.model("Brand", brandSchema);
