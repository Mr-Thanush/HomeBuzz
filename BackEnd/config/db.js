import mongoose from "mongoose";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envCandidates = [
    path.resolve(__dirname, "config.env"),
    path.resolve(process.cwd(), "BackEnd/config/config.env"),
    path.resolve(process.cwd(), "config.env"),
];

const resolvedEnvPath = envCandidates.find((candidate) => fs.existsSync(candidate));

dotenv.config({ path: resolvedEnvPath || envCandidates[0] });

const parseMySQLUrl = (url) => {
    if (!url) return null;
    try {
        const parsed = new URL(url);
        return {
            host: parsed.hostname,
            port: parsed.port ? parseInt(parsed.port, 10) : 3306,
            user: parsed.username,
            password: decodeURIComponent(parsed.password),
            database: parsed.pathname.substring(1), // Removes the leading slash
        };
    } catch (error) {
        console.error("⚠️ Failed to parse MYSQLURL, falling back to standard config:", error.message);
        return null;
    }
};

const mysqlUrlConfig = parseMySQLUrl(process.env.MYSQLURL || process.env.MYSQL_URL || process.env.MYSQL_URI);

const mysqlConfig = {
    host: mysqlUrlConfig?.host || process.env.MYSQL_HOST || process.env.MYSQLHOST || "localhost",
    port: mysqlUrlConfig?.port || Number(process.env.MYSQL_PORT || process.env.MYSQLPORT || 3306),
    user: mysqlUrlConfig?.user || process.env.MYSQL_USER || process.env.MYSQLUSER || "root",
    password: mysqlUrlConfig?.password || process.env.MYSQL_PASSWORD || process.env.MYSQLPASSWORD || "",
    database: mysqlUrlConfig?.database || process.env.MYSQL_DB_NAME || process.env.MYSQL_DATABASE || "homebuzz",
};

const createMySQLDatabaseAndSchema = async () => {
    let connection;

    try {
        // FIX: Connect directly targeting the schema. Cloud DBs block root access that doesn't target a DB.
        connection = await mysql.createConnection({
            host: mysqlConfig.host,
            port: mysqlConfig.port,
            user: mysqlConfig.user,
            password: mysqlConfig.password,
            database: mysqlConfig.database, 
        });

        // FIXED: Removed CREATE DATABASE and USE queries which cause permission crashes in production.
        await connection.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                role ENUM('user', 'seller', 'admin') DEFAULT 'user',
                profile_pic_id VARCHAR(255) DEFAULT 'profile id',
                profile_pic_url VARCHAR(255) DEFAULT 'profile url',
                store_name VARCHAR(255) DEFAULT NULL,
                store_description TEXT DEFAULT NULL,
                phone VARCHAR(50) DEFAULT NULL,
                alt_phone VARCHAR(50) DEFAULT NULL,
                address TEXT DEFAULT NULL,
                seller_status ENUM('none', 'pending', 'approved', 'rejected') DEFAULT 'none',
                reset_password_token VARCHAR(255) DEFAULT NULL,
                reset_password_expire BIGINT DEFAULT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);
        console.log(`🗄️ MySQL database '${mysqlConfig.database}' and users table are ready.`);
    } catch (error) {
        const code = error && error.code ? error.code : undefined;
        const message = error && error.message ? error.message : String(error);
        const isConnectionIssue = ["ECONNREFUSED", "ENOTFOUND", "ETIMEDOUT", "ECONNRESET", "ER_ACCESS_DENIED_ERROR"].includes(code);

        // If the environment mandates MySQL availability, fail fast.
        if (process.env.REQUIRE_MYSQL === "true") {
            console.error(`❌ MySQL is required but initialization failed (code: ${code || 'unknown'} - ${message}). Exiting.`);
            process.exit(1);
        }

        if (isConnectionIssue) {
            console.warn(`⚠️ MySQL is unavailable at startup (code: ${code || 'unknown'}, message: ${message}). Continuing without MySQL initialization.`);
            return;
        }

        console.error("MySQL Initialization Error:", code ? `${code} - ${message}` : message, error);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
};

export const connectDB = async () => {
    try {
        const data = await mongoose.connect(process.env.DB_URL);
        console.log(`🍃 MongoDB is connected to server: ${data.connection.host}`);
        return data;
    } catch (error) {
        console.error("MongoDB connection error:", error.message);
        throw error;
    }
};

// Initialize DB and Schema
if (process.env.REQUIRE_MYSQL === "true") {
    await createMySQLDatabaseAndSchema();
} else if (process.env.SKIP_MYSQL_INIT === "true") {
    console.log("ℹ️ SKIP_MYSQL_INIT=true, skipping MySQL initialization at startup.");
} else {
    await createMySQLDatabaseAndSchema();
}

// Export the pool with the resolved configuration
const pool = mysql.createPool({
    ...mysqlConfig,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export const mysqlPool = pool;