import React from "react";
import { useCart } from "../context/CartContext";
import CartItemCard from "../components/CartItemCard";
import { useNavigate } from "react-router-dom";
import ProductNavBar from "../components/ProductNavBar";

const CartPage = () => {
  const { cart, loading } = useCart();
  const navigate = useNavigate();

  // Listen for login event
  const handleLogin = (e) => {
    if (e.detail.role === "buyer") {
      // Longer delay to ensure token/session is available and backend is ready
      setTimeout(() => {
        fetchCart();
      }, 500); // 500ms delay
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <ProductNavBar />
      <div className="max-w-7xl mx-auto px-4 pt-6 pb-16">
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded"
          >
            ← Back
          </button>
        </div>
        <h2 className="text-3xl font-bold mb-6">Your Cart</h2>
        <div className="flex flex-wrap justify-center gap-6 mt-4">
          {loading ? (
            <div className="text-center text-gray-400 text-lg">Loading cart...</div>
          ) : cart.length === 0 ? (
            <div className="text-center text-gray-400 text-lg">Your cart is empty.</div>
          ) : (
            cart.map((product) => (
              <CartItemCard
                key={product._id}
                product={product}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CartPage;
