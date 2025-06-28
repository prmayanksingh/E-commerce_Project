import React from "react";
import MainRoute from "./routes/MainRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => (
  <>
    <ToastContainer position="top-right" autoClose={2000} />
    <div className="bg-[#F0EFFE]">
      <MainRoute />
    </div>
  </>
);

export default App;