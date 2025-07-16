import React, { createContext, useContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import API from "../utils/api";
import { toast } from "react-toastify";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const fetchCart = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem("token");
      if (!token) {
        setCart([]);
        return;
      }

      const res = await API.get("/cart");
      const products = res.data.products || [];

      const parsed = products
        .filter((p) => p.product && p.product._id)
        .map((p) => ({
          ...p.product,
          quantity: p.quantity,
        }));

      setCart(parsed);
    } catch (error) {
      console.error("Error fetching cart:", error);
      setCart([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) fetchCart();
  }, []);

  // 🔄 Listen to login event and refetch cart
  useEffect(() => {
    const handleLogin = () => {
      fetchCart();
    };

    window.addEventListener("userLogin", handleLogin);
    return () => {
      window.removeEventListener("userLogin", handleLogin);
    };
  }, []);

  const addToCart = async (product) => {
    try {
      const res = await API.post("/cart/add", { productId: product._id });
      const updated = res.data.products
        .filter((p) => p.product && p.product._id)
        .map((p) => ({
          ...p.product,
          quantity: p.quantity,
        }));
      setCart(updated);
      toast.success("Added to cart");
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add to cart");
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const res = await API.post("/cart/remove", { productId });
      const updated = res.data.products
        .filter((p) => p.product && p.product._id)
        .map((p) => ({
          ...p.product,
          quantity: p.quantity,
        }));
      setCart(updated);
      toast.info("Removed from cart");
    } catch (error) {
      console.error("Error removing from cart:", error);
      toast.error("Failed to remove from cart");
    }
  };

  const getTotalItems = () =>
    cart.reduce((acc, item) => acc + (item.quantity || 1), 0);

  const getTotalPrice = () =>
    cart.reduce((acc, item) => acc + (item.price * item.quantity || 0), 0);

  const isInCart = (productId) =>
    cart.some((item) => item && item._id === productId);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        isInCart,
        getTotalItems,
        getTotalPrice,
        loading,
        refreshCart: fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
