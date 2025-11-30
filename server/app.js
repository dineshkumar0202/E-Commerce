import express from "express";
import productRoute from "./routes/productRoute.js";
import handleError from "./middleWare/error.js";

const app = express();

app.use(express.json());
app.use("/api/v0", productRoute);

// app.use(errorHandle);
export default app;
