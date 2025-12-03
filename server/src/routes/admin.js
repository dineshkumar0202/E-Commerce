import express from "express";
import { authRequired, adminRequired } from "../middleware/auth.js";
import Order from "../models/Order.js";
import User from "../models/User.js";

const router = express.Router();

router.use(authRequired, adminRequired);

router.get("/stats", async (_req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();
    const revenueAgg = await Order.aggregate([
      { $match: { paymentStatus: "paid" } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } }
    ]);
    const totalRevenue = revenueAgg[0]?.total || 0;

    const byStatus = await Order.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    const lastSixMonths = await Order.aggregate([
      { $match: { createdAt: { $gte: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000) } } },
      { $group: { _id: { $substr: ["$createdAt", 0, 7] }, total: { $sum: "$totalAmount" } } },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      totalUsers,
      totalOrders,
      totalRevenue,
      byStatus,
      lastSixMonths
    });
  } catch (err) {
    console.error("Admin stats error", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/orders", async (_req, res) => {
  try {
    const orders = await Order.find().populate("user").sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error("Admin orders error", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.patch("/orders/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    order.status = status || order.status;
    await order.save();
    res.json(order);
  } catch (err) {
    console.error("Order status update error", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
