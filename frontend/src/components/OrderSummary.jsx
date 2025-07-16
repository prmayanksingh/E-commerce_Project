import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../utils/api";

const OrderSummary = ({ cart, totalPrice, onClose }) => {
  const navigate = useNavigate();
  const { refreshCart } = useCart();
  const [localCart, setLocalCart] = useState(cart.map(item => ({ ...item })));

  const updateQuantity = (index, delta) => {
    setLocalCart(prev => prev.map((item, i) => {
      if (i === index) {
        const newQty = Math.max(1, (item.quantity || 1) + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const calcTotalPrice = () =>
    localCart.reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0);

  const confirmOrder = async () => {
    try {
      const products = localCart.map((item) => ({
        product: item._id,
        quantity: item.quantity || 1,
      }));

      await API.post("/orders", {
        products,
        totalAmount: calcTotalPrice(),
      });

      toast.success("Order placed successfully ✅");
      await refreshCart();
      onClose(); // close the modal
      navigate("/products"); // navigate to products page
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Failed to place order");
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-70 z-50 flex items-center justify-center">
      <div className="bg-white text-black p-6 rounded-lg w-[90%] max-w-lg shadow-lg space-y-4">
        <h2 className="text-2xl font-bold text-center">Order Summary</h2>

        <ul className="max-h-64 overflow-y-auto">
          {localCart.map((item, idx) => (
            <li key={item._id} className="border-b py-2">
              <div className="font-semibold">{item.name}</div>
              <div className="flex items-center gap-2">
                <button
                  className="px-2 py-1 bg-gray-300 rounded text-black font-bold"
                  onClick={() => updateQuantity(idx, -1)}
                  disabled={item.quantity <= 1}
                >
                  -
                </button>
                <span>Quantity: {item.quantity || 1}</span>
                <button
                  className="px-2 py-1 bg-gray-300 rounded text-black font-bold"
                  onClick={() => updateQuantity(idx, 1)}
                >
                  +
                </button>
              </div>
              <div>Price: ₹{item.price}</div>
              <div>
                Total: ₹{(item.price * (item.quantity || 1)).toFixed(2)}
              </div>
            </li>
          ))}
        </ul>

        <div className="text-lg font-semibold">Total Amount: ₹{calcTotalPrice()}</div>

        <div className="flex justify-between mt-4">
          <button
            onClick={onClose}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            onClick={confirmOrder}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            Confirm Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
