import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ProductList from "../pages/ProductList";
import SellerProductManager from "../components/SellerProductManager";
import EditProduct from "../pages/EditProduct";

const MainRoute = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<SellerProductManager />} />
      <Route path="/products" element={<ProductList />} />
      <Route path="/edit-product/:id" element={<EditProduct />} />
    </Routes>
  );
};

export default MainRoute;