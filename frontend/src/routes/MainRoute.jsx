import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ProductList from "../pages/ProductList";
import SellerProductManager from "../components/SellerProductManager";
import AddProduct from "../pages/AddProduct";
import EditProduct from "../pages/EditProduct";

const MainRoute = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<SellerProductManager />} />
      <Route path="/add-product" element={<AddProduct />} />
      <Route path="/edit-product/:id" element={<EditProduct />} />
      <Route path="/products" element={<ProductList />} />
    </Routes>
  );
};

export default MainRoute;