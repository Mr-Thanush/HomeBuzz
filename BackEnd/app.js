import express from "express";
import product from './Routes/productRoute.js';
import user from './Routes/userRoute.js';
import handleErrorMiddleware from './middleWare/error.js'
import cookieParser from "cookie-parser";
import order from "./Routes/orderRoute.js";
import path from 'path';
import { fileURLToPath } from "url";


const fileName=fileURLToPath(import.meta.url);
const dirName=path.dirname(fileName);

const app=express();


//middleware
app.use(express.json({limit: "10mb"}));
app.use(express.urlencoded({ extended: true , limit: "10mb"}));
app.use(cookieParser());


//Routes
app.use("/api/v1",product);
app.use("/api/v1",user);
app.use("/api/v1",order);

//server static files
app.use(express.static(path.join(dirName,'../FrontEnd/dist')));
app.use((req, res) => {
  res.sendFile(
    path.resolve(dirName, "../FrontEnd/dist/index.html")
  );
});

app.use(handleErrorMiddleware);

export default app;