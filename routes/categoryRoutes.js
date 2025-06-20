const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const authMiddleware = require('../middlewares/authMiddleware'); 

const Category = require("../models/category");
const roleMiddleware = require("../middlewares/roleMiddleware");


router.post("/", upload.single("logo"), async (req, res) => {
   
  
  try {
   
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    // Check for duplicate category name
    const existing = await Category.findOne({ name });
    if (existing) {
      return res.status(400).json({ error: "Category name already exists" });
    }

    // If image uploaded, set logo path
    const logoPath = req.file ? "/uploads/" + req.file.filename : null;

    const category = new Category({ name, logo: logoPath });
    await category.save();

    res.status(201).json({ message: "Category created successfully", category });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET all categories
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// UPDATE category (admin only)
router.put("/:id",authMiddleware ,roleMiddleware('admin') , upload.single("logo"), async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    // Find the category
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    // If name is provided, check for duplicates
    if (name && name !== category.name) {
      const existing = await Category.findOne({ name });
      if (existing) {
        return res.status(400).json({ error: "Category name already exists" });
      }
      category.name = name;
    }

    // If new logo uploaded, update logo path
    if (req.file) {
      category.logo = "/uploads/" + req.file.filename;
    }

    await category.save();

    res.json({ message: "Category updated successfully", category });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE category (admin only)
router.delete("/:id", authMiddleware, roleMiddleware('admin'), async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
