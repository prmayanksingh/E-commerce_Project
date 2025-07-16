import React, { useEffect, useState } from "react";
import API from "../utils/api";
import { toast } from "react-toastify";
import ProductNavBar from "../components/ProductNavBar";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const res = await API.get("/orders");
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching orders", err);
    }
  };

  const cancelOrder = async (id) => {
    try {
      await API.delete(`/orders/${id}`);
      toast.info("Order cancelled");
      fetchOrders(); // refresh list
    } catch (err) {
      toast.error("Failed to cancel order");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <ProductNavBar />

      <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
        <h2 className="text-3xl font-bold text-center">Your Orders</h2>

        {orders.length === 0 ? (
          <p className="text-center text-gray-400">No orders yet.</p>
        ) : (
          orders.map((order) => (
            <div key={order._id} className="bg-gray-800 p-5 rounded-lg shadow">
              <div className="flex justify-between">
                <div>
                  <h3 className="text-xl font-semibold">
                    Order ID: {order._id}
                  </h3>
                  <p className="text-sm text-gray-400">
                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => cancelOrder(order._id)}
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white"
                >
                  Cancel Order
                </button>
              </div>

              <ul className="mt-4 space-y-2">
                {order.products.map((item) => (
                  <li key={item.product._id} className="border-b py-2">
                    <div className="font-semibold">{item.product.name}</div>
                    <div>Quantity: {item.quantity}</div>
                    <div>Price: ₹{item.product.price}</div>
                    <div>Total: ₹{item.product.price * item.quantity}</div>
                  </li>
                ))}
              </ul>

              <div className="text-right mt-3 font-bold">
                Total: ₹{order.totalAmount}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
