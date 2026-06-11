import express from "express";
import Review from "../models/Review.js";

const router = express.Router();


// ✅ ADD REVIEW
router.post("/", async (req, res) => {
  try {
    const { productId, productName, userName, rating, comment } = req.body;

    const review = new Review({
      productId,
      productName,
      userName,
      rating,
      comment
    });

    await review.save();

    res.json({ message: "Review added ✅" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ GET ALL REVIEWS (ADMIN)
router.get("/", async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ DELETE REVIEW
router.delete("/:id", async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted ✅" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ GET PRODUCT-WISE REVIEWS
router.get("/product/:productId", async (req, res) => {
  try {
    const reviews = await Review.find({
      productId: req.params.productId
    });

    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;