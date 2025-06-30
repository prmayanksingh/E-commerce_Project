import React from "react";

const SellerProductCard = ({ product, onEdit, onDelete }) => (
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
      <h2 className="text-lg font-bold text-white mb-1">{product.name}</h2>
      <p className="text-sm text-gray-300 mb-1">
        ₹{product.price} • {product.stock} pcs
      </p>
      <p className="text-sm text-pink-400 font-medium mb-2">
        {product.category}
      </p>
      <div className="flex justify-center gap-2 mt-2">
        <button
          onClick={onEdit}
          className="bg-yellow-400 hover:bg-yellow-500 text-black px-3 py-1 rounded-md text-sm font-semibold"
        >
          Edit
        </button>
        <button
          onClick={onDelete}
          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm font-semibold"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
);

export default SellerProductCard;
