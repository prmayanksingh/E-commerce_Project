import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const [showPopup, setShowPopup] = useState(false);

  const isLoggedIn = !!sessionStorage.getItem("token");

  useEffect(() => {
    if (!isLoggedIn) {
      setShowPopup(true);
    }
  }, [isLoggedIn]);

  if (isLoggedIn) {
    return children;
  }

  return (
    <>
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white p-6 rounded-xl shadow-lg w-[90%] max-w-sm text-center">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              You're not logged in!
            </h2>
            <p className="text-gray-600 mb-6">
              Please login to access this page.
            </p>
            <button
              onClick={() => (window.location.href = "/login")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-all"
            >
              Go to Login
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ProtectedRoute;
