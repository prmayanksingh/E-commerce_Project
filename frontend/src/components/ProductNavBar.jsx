import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const ProductNavBar = () => {
  const navigate = useNavigate();
  const { cart } = useCart();

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="w-full px-13 py-4 bg-gray-900/70 backdrop-blur-md border-b border-white/10 shadow-sm sticky top-0 z-10">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 max-w-6xl mx-auto">
        <Link to="/browse" className="text-4xl archivo-black-regular bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent tracking-wide cursor-pointer">
          CART HIVE
        </Link>

        <div className="flex gap-3 items-center">
          <button
            onClick={() => navigate("/cart")}
            className="relative bg-gray-800 hover:bg-gray-700 text-white px-4 py-1.5 rounded-md font-medium shadow flex items-center"
          >
            <span role="img" aria-label="cart" className="mr-2">🛒</span>
            Cart
            {cart.length > 0 && (
              <span className="ml-2 bg-pink-500 text-white rounded-full px-2 py-0.5 text-xs">{cart.length}</span>
            )}
          </button>

          <button
            onClick={() => navigate("/orders")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-md font-medium shadow"
          >
            Orders
          </button>

          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-md font-medium shadow"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductNavBar;
