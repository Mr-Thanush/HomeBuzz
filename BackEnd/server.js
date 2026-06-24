import dotenv from "dotenv";
if(process.env.NODE_ENV!=="Production"){
    dotenv.config({path: "BackEnd/config/config.env"});
}

import app from "./app.js";
import { connectDB } from "./config/db.js";
import cloudinary from "./config/cloudinary.js";

// Uncaught Exceptions
process.on("uncaughtException", (err) => {
    console.error(`Uncaught Exception: ${err.message}`);
    console.error(err.stack);
    process.exit(1);
});

const startServer = async () => {
    try {
        await connectDB();

        const port = process.env.PORT || 8080;
        const server = app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });

        // Unhandled Promise Rejections
        process.on("unhandledRejection", (err) => {
            console.error(`Unhandled Rejection: ${err?.message || err}`);
            server.close(() => process.exit(1));
        });
    } catch (err) {
        console.error("Failed to start server due to error:", err.message);
        process.exit(1);
    }
};

startServer();


