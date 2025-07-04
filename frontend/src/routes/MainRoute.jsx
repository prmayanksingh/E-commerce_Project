import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ProductList from "../pages/ProductList";
import SellerProductManager from "../components/SellerProductManager";
import AddProduct from "../pages/AddProduct";
import EditProduct from "../pages/EditProduct";
import BrowseLanding from "../pages/BrowseLanding";
import ProductDetailsBuyer from "../pages/ProductDetailsBuyer";
import ProductDetailsSeller from "../pages/ProductDetailsSeller";
import CartPage from "../pages/CartPage";

const MainRoute = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<SellerProductManager />} />
      <Route path="/add-product" element={<AddProduct />} />
      <Route path="/edit-product/:id" element={<EditProduct />} />
      <Route path="/seller/product/:id" element={<ProductDetailsSeller />} />
      <Route path="/product/:id" element={<ProductDetailsBuyer />} />
      <Route path="/browse" element={<BrowseLanding />} />
      <Route path="/products" element={<ProductList />} />
      <Route path="/cart" element={<CartPage />} />
    </Routes>
  );
};

export default MainRoute;
