import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import product from "./Routes/productRoutes.js";
import user from "./Routes/userRoutes.js";
import order from "./Routes/orderRoutes.js";
import storeRoutes from "./Routes/storeRoutes.js";

import errorHandleMiddleWare from "./MiddleWare/error.js";
import { verifyUserAuth } from "./MiddleWare/userAuth.js";
import Store from "./Models/storeModel.js";

const app = express();

// 1 CORS 
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://homebuzz26.vercel.app",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

//  Required for preflight requests
app.options("*", cors());

//2 BODY & COOKIE PARSERS

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//  3 API ROUTES
app.use("/api/v1", product);
app.use("/api/v1", user);
app.use("/api/v1", order);
app.use("/api/v1/store", storeRoutes);


  // 4 AUTH CHECK ROUTE
app.get("/api/v1/me", verifyUserAuth, (req, res) => {
  res.status(200).json({
    success: true,
    user: {
      name: req.user.name,
      email: req.user.email,
      about: req.user.about,
      image: req.user.image,
      hasStore: req.user.hasStore,
    },
  });
});


  // 5 CREATE STORE
app.post("/api/v1/store/create", verifyUserAuth, async (req, res, next) => {
  try {
    const user = req.user;

    if (user.hasStore) {
      return res.status(400).json({
        success: false,
        message: "Store already exists",
      });
    }

    const store = await Store.create({
      owner: user._id,
      name: req.body.name,
    });

    user.hasStore = true;
    user.storeId = store._id;
    await user.save();

    res.status(201).json({
      success: true,
      store,
    });
  } catch (error) {
    next(error);
  }
});

//6 ERROR HANDLER (LAST)
app.use(errorHandleMiddleWare);

export default app;