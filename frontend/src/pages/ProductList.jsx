import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/products/all")
      .then((res) => setProducts(res.data))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    navigate("/");
  };

  const hasRealProducts =
    products &&
    products.length > 0 &&
    products.some((p) => p.name && p.price && p.stock);

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-4xl archivo-black-regular bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent drop-shadow-md tracking-wide">
            All Products
          </h2>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-medium shadow"
          >
            Logout
          </button>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full text-center text-gray-400 text-lg">
              Loading...
            </div>
          ) : !hasRealProducts ? (
            <div className="col-span-full text-center text-gray-400 text-lg">
              No products available.
            </div>
          ) : (
            products.map((product, idx) =>
              product.name && product.price && product.stock ? (
                <div
                  key={idx}
                  className="bg-[#1e293b] bg-opacity-90 backdrop-blur-md rounded-xl overflow-hidden shadow-lg transition-all hover:scale-[1.02] hover:shadow-pink-300/30 border border-white/10 flex flex-col"
                >
                  {/* Image Section */}
                  <div className="h-64 sm:h-72 bg-white flex items-center justify-center overflow-hidden">
                    <img
                      src={product.imageURL}
                      alt={product.name}
                      className="object-contain w-full h-full"
                    />
                  </div>

                  {/* Details */}
                  <div className="p-4 flex flex-col gap-1">
                    <h3 className="text-xl font-bold text-white">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-300">
                      ₹{product.price} • Stock: {product.stock}
                    </p>
                    <p className="text-sm text-pink-400 font-medium">
                      {product.category}
                    </p>
                    <p className="text-xs text-gray-400 italic mt-2">
                      Seller: {product.sellerId?.name || "Unknown"}
                    </p>
                  </div>
                </div>
              ) : null
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
