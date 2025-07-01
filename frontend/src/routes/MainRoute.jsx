import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ProductList from "../pages/ProductList";
import SellerProductManager from "../components/SellerProductManager";
import AddProduct from "../pages/AddProduct";
import EditProduct from "../pages/EditProduct";
import BrowseLanding from "../pages/BrowseLanding"; // ✅ NEW COMPONENT

const MainRoute = () => {
  return (
    <Routes>
      {/* Default route */}
      <Route path="/" element={<Navigate to="/login" />} />

      {/* Authentication */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Seller routes */}
      <Route path="/dashboard" element={<SellerProductManager />} />
      <Route path="/add-product" element={<AddProduct />} />
      <Route path="/edit-product/:id" element={<EditProduct />} />

      {/* Buyer routes */}
      <Route path="/browse" element={<BrowseLanding />} /> {/* 👈 Landing page for buyers */}
      <Route path="/products" element={<ProductList />} />
    </Routes>
  );
};

export default MainRoute;
