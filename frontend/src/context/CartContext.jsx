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

  // Function to fetch cart
  const fetchCart = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem("token");
      if (!token) {
        setCart([]);
        setLoading(false);
        return;
      }
      const res = await API.get("/cart");
      const products = res.data.products
        ? res.data.products
            .map((p) => p.product)
            .filter((prod) => prod && prod._id)
        : [];
      setCart(products);
    } catch (error) {
      console.error("Error fetching cart:", error);
      setCart([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch cart from backend on mount/login
  useEffect(() => {
    fetchCart();
  }, []);

  // Refetch cart when navigating to cart-related pages
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token && (location.pathname === "/cart" || location.pathname === "/browse")) {
      // Small delay to ensure we're on the new page
      const timer = setTimeout(() => {
        if (cart.length === 0) {
          fetchCart();
        }
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [location.pathname, cart.length]);

  // Listen for storage changes and login events
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "token") {
        fetchCart();
      }
    };

    // Listen for when user returns to the tab
    const handleFocus = () => {
      const token = sessionStorage.getItem("token");
      if (token && cart.length === 0) {
        fetchCart();
      }
    };

    // Listen for login event
    const handleLogin = (e) => {
      if (e.detail.role === "buyer") {
        // Multiple attempts to ensure cart is fetched
        const attemptFetch = () => {
          const token = sessionStorage.getItem("token");
          if (token) {
            fetchCart();
          } else {
            // Retry after a short delay if token isn't set yet
            setTimeout(attemptFetch, 50);
          }
        };
        attemptFetch();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("focus", handleFocus);
    window.addEventListener("userLogin", handleLogin);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("userLogin", handleLogin);
    };
  }, [cart.length]);

  const addToCart = async (product) => {
    try {
      const res = await API.post("/cart/add", { productId: product._id });
      setCart(
        res.data.products
          ? res.data.products
              .map((p) => p.product)
              .filter((prod) => prod && prod._id)
          : []
      );
      toast.success("Added to cart");
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add to cart");
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const res = await API.post("/cart/remove", { productId });
      setCart(
        res.data.products
          ? res.data.products
              .map((p) => p.product)
              .filter((prod) => prod && prod._id)
          : []
      );
      toast.info("Removed from cart");
    } catch (error) {
      console.error("Error removing from cart:", error);
      toast.error("Failed to remove from cart");
    }
  };

  const isInCart = (productId) =>
    cart.some((item) => item && item._id === productId);

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      isInCart, 
      loading, 
      refreshCart: fetchCart 
    }}>
      {children}
    </CartContext.Provider>
  );
};
