import React from "react";
import { useNavigate } from "react-router-dom";

const ProductNavBar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="w-full px-20 py-4 backdrop-blur-md bg-gray-900/70 border-b border-white/10 shadow-sm sticky top-0 z-10">
      <div className="w-full mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-4xl archivo-black-regular bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent drop-shadow-md tracking-wide">
          CART HIVE
        </h2>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-medium shadow"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProductNavBar;
