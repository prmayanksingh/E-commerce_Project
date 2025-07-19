import React from "react";
import { useNavigate } from "react-router-dom";

const AdminNavBar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="w-full px-15 sm:px-7 py-4 bg-gray-900/70 backdrop-blur-md border-b border-white/10 shadow-sm sticky top-0 z-10">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 w-full px-8">
        <h2 className="text-4xl archivo-black-regular bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent tracking-wide cursor-pointer">
          ADMIN DASHBOARD
        </h2>
        <div className="flex gap-3 items-center">
          <button
            onClick={() => navigate("/admin/buyers")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-md font-medium shadow"
          >
            Buyers
          </button>
          <button
            onClick={() => navigate("/admin/sellers")}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-1.5 rounded-md font-medium shadow"
          >
            Sellers
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-md font-medium shadow"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminNavBar; 