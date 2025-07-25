import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SellerNavBar from "../components/SellerNavBar";
import AdminNavBar from "../components/AdminNavBar";

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [unblockRequests, setUnblockRequests] = useState([]);
  const [loadingUnblock, setLoadingUnblock] = useState(false);
  const navigate = useNavigate();

  // Helper to check if user is admin
  function isAdmin() {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) return false;
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.role === "admin";
    } catch {
      return false;
    }
  }

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/products/notifications", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotifications(res.data || []);
      } catch (err) {
        setNotifications([]);
      }
    };
    fetchNotifications();
  }, []);

  useEffect(() => {
    if (isAdmin()) {
      setLoadingUnblock(true);
      axios.get("http://localhost:5000/api/admin/unblock-requests", {
        headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
      })
        .then(res => setUnblockRequests(res.data || []))
        .catch(() => setUnblockRequests([]))
        .finally(() => setLoadingUnblock(false));
    }
  }, []);

  const handleResolve = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/api/admin/unblock-requests/${id}/resolve`, {}, {
        headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
      });
      setUnblockRequests(prev => prev.map(r => r._id === id ? { ...r, status: "resolved" } : r));
    } catch {}
  };

  // NEW: Clear all unblock requests
  const handleClearRequests = async () => {
    try {
      await axios.delete("http://localhost:5000/api/admin/unblock-requests/clear", {
        headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
      });
      setUnblockRequests([]);
    } catch {}
  };

  if (isAdmin()) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center">
        <AdminNavBar />
        <div className="w-full max-w-5xl px-4 py-10 flex flex-col items-center">
          <h2 className="text-3xl font-bold mb-4">Notifications</h2>
          <div className="flex gap-4 mb-8">
            <button
              onClick={() => navigate("/admin")}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-md"
            >
              Back to Dashboard
            </button>
            <button
              onClick={handleClearRequests}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md"
            >
              Clear Requests
            </button>
          </div>
          {loadingUnblock ? (
            <div className="text-gray-400 text-lg mb-8">Loading requests...</div>
          ) : unblockRequests.length === 0 ? (
            <div className="text-gray-400 text-lg mb-8">No requests 🎉</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 w-full">
              {unblockRequests.map((req) => (
                <div key={req._id} className="bg-gray-800 rounded-xl p-6 flex flex-col items-start shadow border border-blue-500/30">
                  <div className="mb-2"><span className="font-bold">User:</span> {req.user?.name} ({req.user?.email})</div>
                  <div className="mb-2"><span className="font-bold">Message:</span> {req.message}</div>
                  <div className="mb-2 text-xs text-gray-400">{new Date(req.createdAt).toLocaleString()}</div>
                  <div className="mb-2"><span className="font-bold">Status:</span> {req.status}</div>
                  {req.status === "pending" && (
                    <button
                      onClick={() => handleResolve(req._id)}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded mt-2"
                    >
                      Mark as Resolved
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  const handleClear = async () => {
    try {
      const token = sessionStorage.getItem("token");
      await axios.delete("http://localhost:5000/api/products/notifications/clear", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications([]);
    } catch (err) {
      // Optionally show error
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center">
      <SellerNavBar />
      <div className="w-full max-w-5xl px-4 py-10 flex flex-col items-center">
        <h2 className="text-3xl font-bold mb-4">Notifications</h2>
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-md"
          >
            Back to Dashboard
          </button>
          <button
            onClick={handleClear}
            className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded-md"
          >
            Clear All Notifications
          </button>
        </div>
        {notifications.length === 0 ? (
          <div className="text-gray-400 text-lg mb-8">No notifications 🎉</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8 w-full">
            {notifications.map((n) => (
              <div key={n._id} className="bg-gray-800 rounded-xl p-6 flex flex-col items-center shadow border border-pink-500/30">
                <img src={n.productImage} alt={n.productName} className="w-40 h-40 object-cover rounded mb-4" />
                <h3 className="text-xl font-semibold mb-2">{n.productName}</h3>
                <div className="text-red-400 font-bold text-lg mb-2">Out of Stock</div>
                <div className="text-gray-400 text-sm">{n.message}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationPage; 