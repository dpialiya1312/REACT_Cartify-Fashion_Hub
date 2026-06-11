import express from "express";
import Cart from "../models/Cart.js";

const router = express.Router();

/* ================= ADD TO CART ================= */
router.post("/", async (req, res) => {
  try {
    const { userId, productId, name, price, image } = req.body;

    const exist = await Cart.findOne({ userId, productId });

    if (exist) {
      exist.qty += 1;
      await exist.save();
      return res.json({ message: "Cart updated" });
    }

    const newItem = new Cart({
      userId,
      productId,
      name,
      price,
      image
    });

    await newItem.save();

    res.json({ message: "Added to cart" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================= GET ALL CART (ADMIN) ================= */
router.get("/", async (req, res) => {
  try {
    const data = await Cart.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================= GET USER CART ================= */
router.get("/:userId", async (req, res) => {
  try {
    const data = await Cart.find({ userId: req.params.userId });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================= DELETE ================= */
router.delete("/:id", async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;