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
import ProtectedRoute from "./ProtectedRoute";
import OrdersPage from "../pages/OrdersPage";
import NotificationPage from "../pages/NotificationPage";
import AdminDashboard from "../pages/AdminDashboard";
import AdminProductDetails from "../pages/AdminProductDetails";
import AdminBuyers from "../pages/AdminBuyers";
import AdminSellers from "../pages/AdminSellers";

const MainRoute = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <SellerProductManager />
          </ProtectedRoute>
        }
      />
      <Route
        path="/add-product"
        element={
          <ProtectedRoute>
            <AddProduct />
          </ProtectedRoute>
        }
      />
      <Route
        path="/edit-product/:id"
        element={
          <ProtectedRoute>
            <EditProduct />
          </ProtectedRoute>
        }
      />
      <Route
        path="/seller/product/:id"
        element={
          <ProtectedRoute>
            <ProductDetailsSeller />
          </ProtectedRoute>
        }
      />
      <Route
        path="/product/:id"
        element={
          <ProtectedRoute>
            <ProductDetailsBuyer />
          </ProtectedRoute>
        }
      />
      <Route
        path="/browse"
        element={
          <ProtectedRoute>
            <BrowseLanding />
          </ProtectedRoute>
        }
      />
      <Route
        path="/products"
        element={
          <ProtectedRoute>
            <ProductList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/cart"
        element={
          <ProtectedRoute>
            <CartPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <OrdersPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/seller/notifications"
        element={
          <ProtectedRoute>
            <NotificationPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/product/:id"
        element={
          <ProtectedRoute>
            <AdminProductDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/buyers"
        element={
          <ProtectedRoute>
            <AdminBuyers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/sellers"
        element={
          <ProtectedRoute>
            <AdminSellers />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default MainRoute;
