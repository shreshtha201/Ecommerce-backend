const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware"); // ✅ custom role check

const {
  createCoupon,
  getAllCoupons,
  deleteCoupon,
  updateCoupon,
} = require("../controllers/couponController");


router.post("/", authMiddleware, roleMiddleware("admin"), createCoupon);
router.get("/", authMiddleware, roleMiddleware("admin"), getAllCoupons);
router.delete("/:id", authMiddleware, roleMiddleware("admin"), deleteCoupon);
router.put("/:id", authMiddleware, roleMiddleware("admin"), updateCoupon);


module.exports = router;
