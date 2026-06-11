import express from "express";
import Category from "../models/Category.js";

const router = express.Router();

/* GET */
router.get("/", async (req, res) => {
  const data = await Category.find();
  res.json(data);
});

/* POST */
router.post("/", async (req, res) => {
  console.log("POST HIT ✅"); // 👈 DEBUG

  const { category, subcategory } = req.body;

  const newCategory = new Category({
    category,
    subcategory
  });

  await newCategory.save();

  res.json({ message: "Added ✅" });
});

/* ================= DELETE CATEGORY ================= */
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Category.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json({ message: "Deleted successfully ✅" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;