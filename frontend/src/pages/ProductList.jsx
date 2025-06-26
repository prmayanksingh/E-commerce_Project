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
    <div className="w-full min-h-screen bg-pink-100 p-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-extrabold text-blue-800 tracking-tight drop-shadow">
            Products
          </h2>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold shadow"
          >
            Logout
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  className="bg-white rounded-xl shadow-md p-4 border border-blue-100 flex flex-col items-center transform transition-all duration-200 hover:scale-105 hover:-translate-y-1 hover:shadow-pink-200 hover:shadow-lg hover:border-pink-300"
                >
                  <img
                    src={product.imageURL}
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
                    Seller: {product.sellerId?.name || "Unknown"}
                  </p>
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
