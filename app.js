
require('dotenv').config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./db");

const app = express();
connectDB();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.get('/health', (req, res) => {
  res.send('OK');
});
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Add this line

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use('/api/users', require("./routes/userRoutes"));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/wishlist', require('./routes/wishlistRoutes'));
app.use("/api/categories",  require("./routes/categoryRoutes"));
app.use("/uploads", express.static("uploads")); 
app.use("/api/reviews", require("./routes/reviewRoutes"));
app.use("/api/brands", require("./routes/brandRoutes"));
app.use("/api/coupons", require("./routes/couponRoutes"));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
