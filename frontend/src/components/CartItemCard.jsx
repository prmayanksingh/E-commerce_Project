import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const CartItemCard = ({ product }) => {
  const navigate = useNavigate();
  const { removeFromCart } = useCart();

  const handleRemove = (e) => {
    e.stopPropagation();
    removeFromCart(product._id);
  };

  return (
    <div
      onClick={() => navigate(`/product/${product._id}`)}
      className="cursor-pointer hover:scale-105 transition duration-300 bg-[#1e293b] bg-opacity-90 backdrop-blur-md rounded-xl overflow-hidden shadow-md border border-white/10 mb-4 relative"
      style={{ width: "280px" }}
    >
      <div className="h-60">
        <img
          src={product.imageURL}
          alt={product.name}
          className="w-full h-full object-cover block"
        />
      </div>
      <div className="p-4 pt-3 text-center">
        <h3 className="capitalize text-xl font-bold text-white mb-1">
          {product.name}
        </h3>
        <p className="text-sm text-gray-300 mb-1">
          ₹{product.price}
        </p>
        <p className="text-sm text-pink-400 font-medium mb-2">
          {product.category}
        </p>
        <p className="text-sm text-green-400 font-medium">
          Quantity: {product.quantity || 1}
        </p>
        <p className="text-xs text-gray-400 italic mt-2">
          Seller: {product.sellerId?.name || "Unknown"}
        </p>
        <button
          onClick={handleRemove}
          className="mt-3 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm transition-colors"
        >
          Remove from Cart
        </button>
      </div>
    </div>
  );
};

export default CartItemCard;
