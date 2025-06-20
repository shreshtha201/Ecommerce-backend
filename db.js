require('dotenv').config();
const mongoose = require("mongoose");


const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://dixitshreshtha88:YWkvSKROgX4KyOqX@ecommerce.dtayhyp.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=ecommerce');
    console.log("MongoDB connected");
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
