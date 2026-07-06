import dotenv from "dotenv";
// Always load the configuration safely, removing the strict case-sensitive guard block
dotenv.config({ path: "BackEnd/config/config.env" });

import app from "./app.js";
import { connectDB, mysqlPool } from "./config/db.js";
import cloudinary from "./config/cloudinary.js";

// Uncaught Exceptions Handler
process.on("uncaughtException", (err) => {
    console.error(`🔴 Uncaught Exception: ${err.message}`);
    console.error(err.stack);
    process.exit(1);
});

const startServer = async () => {
    try {
        // 1. Initialize MongoDB Connection
        await connectDB();

        // 2. Validate MySQL Pool Connectivity
        console.log("⏳ Connecting to MySQL...");
        const mysqlConnection = await mysqlPool.getConnection();
        console.log("🐬 MySQL Connection Pool verified and ready!");
        mysqlConnection.release(); // Return connection back to pool cleanly

        // 3. Start Express Application Server
        const port = process.env.PORT || 8080;
        const server = app.listen(port, () => {
            console.log(`🚀 Server is running on port ${port} in ${process.env.NODE_ENV || 'development'} mode`);
        });

        // Unhandled Promise Rejections Handler
        process.on("unhandledRejection", (err) => {
            console.error(`⚠️ Unhandled Rejection: ${err?.message || err}`);
            if (err.stack) console.error(err.stack);
            
            // Gracefully close the active server before exiting process execution
            server.close(() => process.exit(1));
        });
        
    } catch (err) {
        console.error("❌ Failed to start server due to database connectivity error:", err.message);
        process.exit(1);
    }
};

startServer();