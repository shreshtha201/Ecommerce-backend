const express = require("express");
const router = express.Router();
const Brand = require("../models/brand");
const upload = require("../middlewares/upload"); 
const roleMiddleware = require("../middlewares/roleMiddleware");
const authMiddleware = require("../middlewares/authMiddleware");

// Brand create karne ke liye (logo upload ke sath)
router.post("/", upload.single("logo"), async (req, res) => {
  try {
    const brandData = req.body;

    // Agar logo upload hua hai to uska path add karo
    if (req.file) {
      brandData.logo = req.file.path;
    }

    const brand = new Brand(brandData);
    await brand.save();
    res.status(201).json({ message: "Brand created", brand });
  } catch (err) {
    res.status(400).json({ message: "Brand creation failed", error: err.message });
  }
});


router.put("/:id", upload.single("logo"), async (req, res) => {
  try {
    const brandData = req.body;

    if (req.file) {
      brandData.logo = req.file.path;
    }

    const brand = await Brand.findByIdAndUpdate(req.params.id, brandData, { new: true });
    if (!brand) {
      return res.status(404).json({ message: "Brand not found" });
    }

    res.json({ message: "Brand updated", brand });
  } catch (err) {
    res.status(400).json({ message: "Brand update failed", error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const brands = await Brand.find();
    res.json(brands);
  } catch (err) {
    res.status(500).json({ message: "Failed to get brands", error: err.message });
  }
});
// Update brand (only admin)
router.put("/:id", authMiddleware, roleMiddleware('admin'), upload.single("logo"), async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    // Find the brand by id
    const brand = await Brand.findById(id);
    if (!brand) {
      return res.status(404).json({ error: "Brand not found" });
    }

    // Check for duplicate brand name if name is changing
    if (name && name !== brand.name) {
      const existing = await Brand.findOne({ name });
      if (existing) {
        return res.status(400).json({ error: "Brand name already exists" });
      }
      brand.name = name;
    }

    // Update logo if new file uploaded
    if (req.file) {
      brand.logo = "/uploads/" + req.file.filename;
    }

    await brand.save();

    res.json({ message: "Brand updated successfully", brand });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Delete brand (only admin)
router.delete("/:id", authMiddleware, roleMiddleware('admin'), async (req, res) =>{
  try {
    const brand = await Brand.findByIdAndDelete(req.params.id);
    if (!brand) {
      return res.status(404).json({ message: "Brand not found" });
    }
    res.json({ message: "Brand deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Brand delete failed", error: err.message });
  }
});

module.exports = router;
