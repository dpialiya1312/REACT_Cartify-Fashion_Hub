import express from "express";
import Order from "../models/Order.js";

const router = express.Router();

/* ================= PLACE ORDER ================= */
router.post("/", async (req, res) => {
  try {
    const { userId, userEmail, items, total, address } = req.body;

    const newOrder = new Order({
      userId,
      userEmail,
      items,
      total,
      address
    });

    await newOrder.save();

    res.json({ message: "Order placed successfully ✅" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================= GET ALL ORDERS ================= */
router.get("/", async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
});

export default router;