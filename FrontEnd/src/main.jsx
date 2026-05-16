import React from "react";
import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import {Provider} from "react-redux";
import './theme.css';
import App from "./App.jsx";
import "./index.css";
import { store } from "./app/store.js";
import { ToastContainer } from "react-toastify";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <App />
      <ToastContainer/>
      </Provider>
  </StrictMode>
);