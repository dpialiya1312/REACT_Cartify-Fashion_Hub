import express from "express";
import Product from "../models/Product.js";
import multer from "multer";  // ✅ ONLY HERE
import path from "path";

const router = express.Router();

// ✅ MULTER (ONLY in routes)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }
});

// 🟢 GET ALL
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔴 POST (Image Upload)
router.post("/", upload.single("image"), async (req, res) => {
  try {
    console.log("📁 File:", req.file?.filename);
    console.log("📄 Body:", req.body);

    const { name, price, category, subcategory, trending } = req.body;
    
    if (!name || !price || !category || !subcategory) {
      return res.status(400).json({ error: "All fields required" });
    }

    const imagePath = req.file ? `/uploads/${req.file.filename}` : "";

    const product = new Product({
      name, price: Number(price), category, subcategory,
      image: imagePath,
      trending: trending === "Yes"
    });

    await product.save();
    res.json({ message: "Product added ✅" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🟢 PUT (Update)
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (req.file) updateData.image = `/uploads/${req.file.filename}`;

    const product = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json({ message: "Updated ✅", product });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🟢 DELETE & SINGLE
router.delete("/:id", async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted ✅" });
});

router.get("/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.json(product || { error: "Not found" });
});

export default router;