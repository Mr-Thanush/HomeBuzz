
import express from 'express'
import product from './Routes/productRoutes.js'
import errorHandleMiddleWare from './MiddleWare/error.js'
import user from './Routes/userRoutes.js';
import order from './Routes/orderRoutes.js';
import cookieParser from 'cookie-parser';
import storeRoutes from './Routes/storeRoutes.js';
import cors from 'cors'
import Store from './Models/storeModel.js';
import {verifyUserAuth} from "./MiddleWare/userAuth.js";

const app=express(); 

app.use(cors({
    origin:['http://localhost:5173',
      "homebuzz26.vercel.app"
    ],
    credentials:true
}));
//MiddleWare
app.use(express.json());
app.use(cookieParser());
//Route
app.use('/api/v1',product) 
app.use('/api/v1',user) 
app.use('/api/v1',order)
app.use("/uploads", express.static("uploads"));
app.use("/api/v1/store", storeRoutes);

//Get sign-in user
app.get("/api/v1/me",verifyUserAuth, (req, res) => {
  if (!req.cookies.token) {
    return res.status(401).json({ success: false });
  }
res.json({
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

// POST /api/v1/store/create
app.post("/api/v1/store/create", verifyUserAuth, async (req, res) => {
  const user = req.user;

  if (user.hasStore) {
    return res.status(400).json({
      success: false,
      message: "Store already exists",
    });
  }

  // create store (example)
  const store = await Store.create({
    owner: user._id,
    name: req.body.name,
  });

  user.hasStore = true;
  user.storeId = store._id;
  await user.save();

  res.json({
    success: true,
    store,
  });
});


app.use(errorHandleMiddleWare)
export default app;
