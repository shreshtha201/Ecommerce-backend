const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  logo: {
    type: String,
    required: false, // optional field for image path
  },
});

module.exports = mongoose.model("Category", categorySchema);
