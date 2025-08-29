import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SellerNavBar = () => {
  const navigate = useNavigate();
  const [outOfStock, setOutOfStock] = useState([]);
  const [notifSeen, setNotifSeen] = useState(false);

  useEffect(() => {
    // Fetch out-of-stock products for this seller
    const fetchOutOfStock = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/products/out-of-stock", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOutOfStock(res.data || []);
      } catch (err) {
        setOutOfStock([]);
      }
    };
    fetchOutOfStock();
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    navigate("/");
  };

  const handleNotifClick = () => {
    setNotifSeen(true);
    navigate("/notifications");
  };

  return (
    <div className="w-full px-13 py-4 backdrop-blur-md bg-gray-900/70 border-b border-white/10 shadow-sm sticky top-0 z-10">
      <div className="max-full mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 onClick={() => navigate("/dashboard")} className="text-3xl sm:text-4xl text-center bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400 bg-clip-text text-transparent drop-shadow-md tracking-wide archivo-black-regular cursor-pointer">
          CART HIVE
        </h1>
        <div className="flex gap-3 items-center">
          <button
            onClick={handleNotifClick}
            className="relative bg-gray-800 hover:bg-gray-700 text-white font-medium py-1.5 px-4 rounded-md text-sm flex items-center"
            title="Out of Stock Notifications"
          >
            <span className="material-icons">🔔</span>
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white font-medium py-1.5 px-4 rounded-md text-sm"
          >
            Logout
          </button>
          <button
            onClick={() => navigate("/add-product")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-1.5 px-4 rounded-md text-sm"
          >
            + Add Product
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellerNavBar;
