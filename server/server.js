import dotenv from "dotenv";
dotenv.config();
import { connectDB } from "./config/db.js";
import app from "./app.js";        // <-- USE app.js, do not create new app()

// Connecting to Database
connectDB();

// Starting the server
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT} 🚀`);
});
// Unhandled Promise Rejection Handling
process.on("unhandledRejection", (err) => {
    console.log(`Error: ${err.message}`);
    console.log("Shutting down the server due to Unhandled Promise Rejection");
    server.close(() => {
        process.exit(1);
    });
});