import express from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import product from './Routes/productRoute.js';
import user from './Routes/userRoute.js';
import order from "./Routes/orderRoute.js";
import handleErrorMiddleware from './middleWare/error.js';
import cookieParser from "cookie-parser";
import fs from "fs";
import path from 'path';
import { fileURLToPath } from "url";

const fileName = fileURLToPath(import.meta.url);
const dirName = path.dirname(fileName);
const distPath = path.join(dirName, '../FrontEnd/dist');
const indexPath = path.join(distPath, 'index.html');

const app = express();

app.set("trust proxy", 1);

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later.",
  },
});

app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL?.trim() || "http://localhost:5174",
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());
app.use("/api/v1", apiLimiter);

app.use("/api/v1", product);
app.use("/api/v1", user);
app.use("/api/v1", order);

if (fs.existsSync(indexPath)) {
  app.use(express.static(distPath));
  app.get(/^(?!\/api\/).*/, (req, res) => {
    res.sendFile(indexPath);
  });
}

app.use(handleErrorMiddleware);

export default app;