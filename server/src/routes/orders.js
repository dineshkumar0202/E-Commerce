import express from "express";
import Stripe from "stripe";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { authRequired } from "../middleware/auth.js";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_dummy");

router.post("/create-payment-intent", authRequired, async (req, res) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Items required" });
    }

    let amount = 0;
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) continue;
      amount += product.price * item.qty;
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: "inr",
      automatic_payment_methods: { enabled: true }
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error("Payment intent error", err);
    res.status(500).json({ message: "Payment error" });
  }
});

router.post("/", authRequired, async (req, res) => {
  try {
    const { items, totalAmount, paymentIntentId } = req.body;
    if (!items || !totalAmount) {
      return res.status(400).json({ message: "Missing fields" });
    }
    const order = await Order.create({
      user: req.userId,
      items: items.map((i) => ({
        product: i.productId,
        qty: i.qty,
        price: i.price
      })),
      totalAmount,
      status: "paid",
      paymentStatus: "paid",
      paymentIntentId
    });
    res.status(201).json(order);
  } catch (err) {
    console.error("Order create error", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/my", authRequired, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.userId }).populate("items.product").sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error("My orders error", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
