import express from "express";
import cookieParser from "cookie-parser";
import productRoute from "./routes/productRoute.js";
import cartRoute from "./routes/cartRoute.js";
import userRoute from "./routes/userRoute.js";

const app = express();

// Body parser
app.use(express.json());

// Cookie parser (correct place)
app.use(cookieParser());

// Routes
app.use("/api/v0/products", productRoute);
app.use("/api/v0/cart", cartRoute);
app.use("/api/v0", userRoute);

export default app;
