import express from "express";
import bcrypt from "bcryptjs";
import { OAuth2Client } from "google-auth-library";
import User from "../models/User.js";
import { signToken, authRequired } from "../middleware/auth.js";

const router = express.Router();
const googleClient = new OAuth2Client();

function sendAuthCookie(res, token) {
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
}

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Missing fields" });
    }
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash: hash });
    const token = signToken(user);
    sendAuthCookie(res, token);
    res.status(201).json({ user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error("Register error", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !user.passwordHash) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = signToken(user);
    sendAuthCookie(res, token);
    res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error("Login error", err);
    res.status(500).json({ message: "Server error" });
  }
});

// For demo, we just generate a resetToken and return it (no email)
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ message: "If that email exists, a reset link was generated." });
    }
    const token = Math.random().toString(36).slice(2);
    user.resetToken = token;
    user.resetTokenExpire = new Date(Date.now() + 60 * 60 * 1000);
    await user.save();
    res.json({
      message: "Reset token generated (demo only).",
      resetToken: token
    });
  } catch (err) {
    console.error("Forgot password error", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    const { token, password } = req.body;
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpire: { $gt: new Date() }
    });
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }
    const hash = await bcrypt.hash(password, 10);
    user.passwordHash = hash;
    user.resetToken = undefined;
    user.resetTokenExpire = undefined;
    await user.save();
    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error("Reset password error", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Google login - expects idToken from frontend
router.post("/google", async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) {
      return res.status(400).json({ message: "idToken required" });
    }
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: undefined
    });
    const payload = ticket.getPayload();
    const email = payload.email;
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name: payload.name || email.split("@")[0],
        email,
        googleId: payload.sub,
        avatar: payload.picture
      });
    }
    const token = signToken(user);
    sendAuthCookie(res, token);
    res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error("Google login error", err);
    res.status(500).json({ message: "Google login failed" });
  }
});

router.get("/me", authRequired, async (req, res) => {
  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      wishlist: user.wishlist,
      address: user.address
    }
  });
});

router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
});

router.put("/profile", authRequired, async (req, res) => {
  try {
    const { name, address } = req.body;
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (name) user.name = name;
    if (address) user.address = address;

    await user.save();
    res.json({ message: "Profile updated" });
  } catch (err) {
    console.error("Profile update error", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Wishlist toggle
router.post("/wishlist/:productId", authRequired, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const pid = req.params.productId;
    const exists = user.wishlist.some((id) => id.toString() === pid);
    if (exists) {
      user.wishlist = user.wishlist.filter((id) => id.toString() !== pid);
    } else {
      user.wishlist.push(pid);
    }
    await user.save();
    res.json({ wishlist: user.wishlist });
  } catch (err) {
    console.error("Wishlist error", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/wishlist", authRequired, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate("wishlist");
    res.json({ items: user.wishlist });
  } catch (err) {
    console.error("Wishlist fetch error", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
