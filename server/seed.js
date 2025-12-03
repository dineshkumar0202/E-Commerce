import dotenv from "dotenv";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import Product from "./src/models/Product.js";
import User from "./src/models/User.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const products = JSON.parse(
  fs.readFileSync(path.join(__dirname, "src/data/products.json"), "utf-8")
);

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/shoppingDB";

async function run() {
  try {
    await mongoose.connect(MONGO_URI, { dbName: "shoppingDB" });
    console.log("MongoDB connected 🌱");

    // Reset products
    await Product.deleteMany({});
    await Product.insertMany(products);
    console.log("Inserted products:", products.length);

    // Admin creation
    const existingAdmin = await User.findOne({ email: "admin@myshopping.com" });
    if (!existingAdmin) {
      const bcrypt = await import("bcryptjs");
      const hash = await bcrypt.default.hash("admin12345", 10);

      await User.create({
        name: "Admin",
        email: "admin@myshopping.com",
        passwordHash: hash,
        role: "admin",
      });

      console.log("Created default admin: admin@myshopping.com / admin12345");
    }

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();
