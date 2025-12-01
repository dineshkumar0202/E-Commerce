import express from "express";
import productRoute from "./routes/productRoute.js";
import user from "./routes/userRoute.js";
// import handleError from "./middleWare/error.js";

const app = express();

app.use(express.json());

// Routes
app.use("/api/v0", productRoute);
app.use("/api/v0", user);



// app.use(errorHandle);
// app.use(handleError);

export default app;
