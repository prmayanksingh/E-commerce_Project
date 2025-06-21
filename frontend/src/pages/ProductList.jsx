import React, { useEffect, useState } from "react";

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("seller_products");
    if (saved) setProducts(JSON.parse(saved));
  }, []);

  return (
    <div className="w-full min-h-screen bg-pink-100 p-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-extrabold mb-8 text-center text-blue-800 tracking-tight drop-shadow">
          Products
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.length === 0 ? (
            <div className="col-span-full text-center text-gray-400 text-lg">
              No products available.
            </div>
          ) : (
            products.map((product, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl shadow-md p-4 border border-blue-100 flex flex-col items-center transform transition-all duration-200 hover:scale-105 hover:-translate-y-1 hover:shadow-pink-200 hover:shadow-lg hover:border-pink-300"
              >
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-32 h-32 object-cover rounded mb-4"
                />
                <h3 className="text-xl font-bold text-blue-700 mb-2">
                  {product.name}
                </h3>
                <p className="text-gray-600 mb-2">{product.description}</p>
                <p className="text-green-700 font-bold mb-2">
                  ₹{product.price}
                </p>
                <p className="text-sm text-gray-500 mb-2">
                  Stock: {product.stock}
                </p>
                <p className="text-sm text-purple-500 mb-1">
                  Category: {product.category}
                </p>
                <p className="text-xs text-gray-400 italic">
                  Seller: {product.sellerName || "Unknown"}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
