import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { search, category, sort } = req.query;
    const filter = {};
    if (category && category !== "All") {
      filter.category = category;
    }
    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }
    let query = Product.find(filter);
    if (sort === "price_asc") query = query.sort({ price: 1 });
    if (sort === "price_desc") query = query.sort({ price: -1 });
    if (sort === "newest") query = query.sort({ createdAt: -1 });

    const products = await query.exec();
    res.json(products);
  } catch (err) {
    console.error("Products fetch error", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/featured", async (_req, res) => {
  try {
    const products = await Product.find({ isFeatured: true }).limit(8);
    res.json(products);
  } catch (err) {
    console.error("Featured fetch error", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const p = await Product.findById(req.params.id);
    if (!p) return res.status(404).json({ message: "Product not found" });
    res.json(p);
  } catch (err) {
    console.error("Product fetch error", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
