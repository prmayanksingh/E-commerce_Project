import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ProductNavBar from "../components/ProductNavBar";
import { useCart } from "../context/CartContext";
import OrderSummary from "../components/OrderSummary";

const ProductDetailsBuyer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [showBuyNow, setShowBuyNow] = useState(false);
  const { addToCart, removeFromCart, isInCart } = useCart();

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/products/all")
      .then((res) => {
        const found = res.data.find((item) => item._id === id);
        setProduct(found || null);
      })
      .catch(() => setProduct(null));
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        Loading...
      </div>
    );
  }

  const inCart = isInCart(product._id);
  const handleCartClick = () => {
    inCart ? removeFromCart(product._id) : addToCart(product);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <ProductNavBar />

      <div className="max-w-7xl mx-auto px-4 pt-6 pb-16">
        <div className="mb-6">
          <button
            onClick={() => navigate("/products")}
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded"
          >
            ← Back
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 items-start">
          <div className="w-full lg:w-[45%]">
            <img
              src={product.imageURL}
              alt={product.name}
              className="w-full h-[420px] object-cover rounded-xl shadow-xl"
            />
          </div>

          <div className="w-full lg:w-[55%] space-y-3">
            <h2 className="text-4xl font-bold capitalize">{product.name}</h2>
            <div className="flex gap-1 mt-2">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-yellow-400 text-xl">
                  ★
                </span>
              ))}
            </div>

            <p className="text-2xl font-semibold text-green-300 mb-5">
              ₹{product.price}
            </p>

            <div className="flex flex-wrap gap-4">
              <div className="px-4 py-2 bg-[#ff6bff]/10 border border-[#ff6bff] rounded">
                <p className="text-white text-sm font-medium">
                  {product.category}
                </p>
              </div>
              <div className="px-4 py-2 bg-[#00bfff]/10 border border-[#00bfff] rounded">
                <p className="text-white text-sm font-medium">
                  {product.sellerId?.name || "Unknown"}
                </p>
              </div>
            </div>

            {product.description && (
              <div className="bg-gray-700 p-5 mt-8 rounded-xl text-gray-100 border border-gray-600">
                <p className="font-semibold text-white mb-2">Description:</p>
                <p>{product.description}</p>
              </div>
            )}

            <div className="flex gap-4 mt-6">
              <button
                className={`${
                  inCart
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-blue-600 hover:bg-blue-700"
                } text-white px-6 py-2 rounded-md`}
                onClick={handleCartClick}
              >
                {inCart ? "Remove from Cart" : "Add to Cart"} 🛒
              </button>
              <button
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md"
                onClick={() => setShowBuyNow(true)}
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>

        {showBuyNow && (
          <OrderSummary
            cart={[{ ...product, quantity: 1 }]}
            totalPrice={product.price}
            onClose={() => setShowBuyNow(false)}
          />
        )}
      </div>
    </div>
  );
};

export default ProductDetailsBuyer;
