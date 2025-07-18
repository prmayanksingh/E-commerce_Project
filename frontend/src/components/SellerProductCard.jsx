import React from "react";
import { useNavigate } from "react-router-dom";

const SellerProductCard = ({ product }) => {
  const navigate = useNavigate();

  const goToDetails = () => {
    navigate(`/seller/product/${product._id}`);
  };

  return (
    <div
      onClick={goToDetails}
      className={`cursor-pointer hover:scale-[1.02] transition-transform duration-200 bg-[#1e293b] bg-opacity-90 backdrop-blur-md rounded-xl overflow-hidden shadow-md border border-white/10 mb-4${product.stock === 0 ? ' opacity-50' : ''}`}
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
        <h2 className="capitalize text-lg font-bold text-white mb-1">
          {product.name}
        </h2>
        <p className="text-sm text-gray-300 mb-1">
          ₹{product.price} • {product.stock === 0 ? 'Out of Stock' : `${product.stock} pcs`}
        </p>
        <p className="text-sm text-pink-400 font-medium mb-2">
          {product.category}
        </p>
      </div>
    </div>
  );
};

export default SellerProductCard;
