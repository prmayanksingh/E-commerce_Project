import { Route, Routes } from "react-router-dom";
import Register from "../pages/Register";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";

const MainRoute = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </>
  );
};

export default MainRoute;
