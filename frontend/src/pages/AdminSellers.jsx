import React, { useEffect, useState } from "react";
import AdminNavBar from "../components/AdminNavBar";
import API from "../utils/api";
import { useNavigate } from "react-router-dom";

const AdminSellers = () => {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchSellers = async () => {
    setLoading(true);
    try {
      const res = await API.get("/admin/users");
      setSellers(res.data.filter((u) => u.role === "seller"));
    } catch {
      setSellers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellers();
  }, []);

  const handleBlockToggle = async (user) => {
    try {
      if (user.isBlocked) {
        await API.patch(`/admin/users/${user._id}/unblock`);
      } else {
        await API.patch(`/admin/users/${user._id}/block`);
      }
      setSellers((prev) =>
        prev.map((u) =>
          u._id === user._id ? { ...u, isBlocked: !user.isBlocked } : u
        )
      );
    } catch {
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <AdminNavBar />
      <div className="max-w-4xl mx-auto px-4 py-10">
        <button
          onClick={() => navigate("/admin")}
          className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded mb-6"
        >
          ← Back
        </button>
        <h2 className="text-3xl font-bold mb-6 text-center">All Sellers</h2>
        {loading ? (
          <div className="text-center">Loading sellers...</div>
        ) : (
          <table className="w-full bg-gray-800 rounded-lg shadow-lg">
            <thead>
              <tr className="bg-gray-700">
                <th className="py-2 px-4 text-center">Name</th>
                <th className="py-2 px-4 text-center">Email</th>
                <th className="py-2 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {sellers.map((user) => (
                <tr key={user._id} className="border-b border-gray-700">
                  <td className="py-2 px-4 text-center">{user.name}</td>
                  <td className="py-2 px-4 text-center">{user.email}</td>
                  <td className="py-2 px-4 text-center">
                    <button
                      onClick={() => handleBlockToggle(user)}
                      className={
                        (user.isBlocked
                          ? "bg-green-600 hover:bg-green-700"
                          : "bg-red-600 hover:bg-red-700") +
                        " text-white px-5 py-1 rounded w-28 text-center font-semibold transition-all duration-150"
                      }
                    >
                      {user.isBlocked ? "Unblock" : "Block"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminSellers; 