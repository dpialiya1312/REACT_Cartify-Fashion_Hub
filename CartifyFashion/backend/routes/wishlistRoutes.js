import express from "express";
import Wishlist from "../models/Wishlist.js";

const router = express.Router();

/* ADD TO WISHLIST */
router.post("/", async (req, res) => {
  try {
    const { userId, productId, name, price, image } = req.body;

    const exists = await Wishlist.findOne({ userId, productId });

    if (exists) {
      return res.json({ message: "Already in wishlist" });
    }

    const item = new Wishlist({ userId, productId, name, price, image });
    await item.save();

    res.json({ message: "Added to wishlist" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* GET USER WISHLIST */
router.get("/:userId", async (req, res) => {
  try {
    const data = await Wishlist.find({ userId: req.params.userId });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* DELETE */
router.delete("/:id", async (req, res) => {
  await Wishlist.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

/* ADMIN - ALL WISHLIST */
router.get("/", async (req, res) => {
  const data = await Wishlist.find().sort({ createdAt: -1 });
  res.json(data);
});

export default router;