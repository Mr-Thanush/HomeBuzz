import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import { store } from "./app/store.js";
import App from "./App.jsx";

import "./theme.css";
import "./index.css";
import "react-toastify/dist/ReactToastify.css";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <StrictMode>
    <Provider store={store}>
      <App />
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar={false} />
    </Provider>
  </StrictMode>
);