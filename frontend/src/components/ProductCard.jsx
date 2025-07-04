import React from "react";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/product/${product._id}`)}
      className="cursor-pointer hover:scale-105 transition duration-300 bg-[#1e293b] bg-opacity-90 backdrop-blur-md rounded-xl overflow-hidden shadow-md border border-white/10 mb-4"
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
          ₹{product.price} • {product.stock} pcs
        </p>
        <p className="text-sm text-pink-400 font-medium mb-2">
          {product.category}
        </p>
        <p className="text-xs text-gray-400 italic mt-2">
          Seller: {product.sellerId?.name || "Unknown"}
        </p>
      </div>
    </div>
  );
};

export default ProductCard;
