import React from "react";
import { useNavigate } from "react-router-dom";

const SellerNavBar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="w-full px-6 py-4 backdrop-blur-md bg-gray-900/70 border-b border-white/10 shadow-sm sticky top-0 z-10">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl sm:text-4xl text-center bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400 bg-clip-text text-transparent drop-shadow-md tracking-wide archivo-black-regular">
          Seller Product Management
        </h1>
        <div className="flex gap-2">
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md text-sm"
          >
            Logout
          </button>
          <button
            onClick={() => navigate("/add-product")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md text-sm"
          >
            + Add Product
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellerNavBar;
