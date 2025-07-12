import React from "react";
import { useCart } from "../context/CartContext";
import CartItemCard from "../components/CartItemCard";
import { useNavigate } from "react-router-dom";
import ProductNavBar from "../components/ProductNavBar";

const CartPage = () => {
  const { cart, loading, getTotalItems, getTotalPrice } = useCart();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <ProductNavBar />

      <div className="w-full mx-auto px-10 pt-6 pb-16">
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded"
          >
            ← Back
          </button>
        </div>

        <h2 className="text-3xl font-bold mb-6">Your Cart</h2>

        {loading ? (
          <div className="text-center text-gray-400 text-lg">
            Loading cart...
          </div>
        ) : cart.length === 0 ? (
          <div className="text-center text-gray-400 text-lg">
            Your cart is empty.
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="flex flex-wrap justify-center gap-6 mt-4">
              {cart.map((product) => (
                <CartItemCard key={product._id} product={product} />
              ))}
            </div>

            {/* Summary Section */}
            <div className="mt-12 bg-gray-800 p-6 rounded-xl shadow-lg max-w-md mx-auto text-center">
              <h3 className="text-xl font-semibold mb-4">Cart Summary</h3>
              <p className="text-lg">
                <span className="font-medium text-gray-300">Total Items:</span>{" "}
                <span className="text-blue-400">{getTotalItems()}</span>
              </p>
              <p className="text-lg mt-2">
                <span className="font-medium text-gray-300">Total Price:</span>{" "}
                <span className="text-green-400">₹{getTotalPrice()}</span>
              </p>
              <button className="mt-6 w-full bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded transition">
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartPage;
