import React from "react";

const ProductCard = ({ product }) => (
  <div
    className="bg-[#1e293b] bg-opacity-90 backdrop-blur-md rounded-xl overflow-hidden shadow-md border border-white/10 mb-4"
    style={{ width: "280px" }}
  >
    <div className="h-60 bg-white flex items-center justify-center">
      <img
        src={product.imageURL}
        alt={product.name}
        className="object-contain w-full h-full"
      />
    </div>
    <div className="p-4 text-center">
      <h3 className="text-lg font-bold text-white mb-1">{product.name}</h3>
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

export default ProductCard;
