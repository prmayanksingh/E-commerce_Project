import React from "react";
import MainRoute from "./routes/MainRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CartProvider } from "./context/CartContext";

const App = () => (
  <CartProvider>
    <ToastContainer position="top-right" autoClose={2000} />
    <div className="bg-[#F0EFFE]">
      <MainRoute />
    </div>
  </CartProvider>
);

export default App;