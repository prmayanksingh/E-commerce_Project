import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import API from "../utils/api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";

const Login = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [blocked, setBlocked] = useState(false);
  const [unblockMessage, setUnblockMessage] = useState("");
  const [unblockSent, setUnblockSent] = useState(false);
  const [unblockLoading, setUnblockLoading] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");

  const submitHandler = async (data) => {
    setLoginEmail(data.email);
    setUnblockLoading(false);
    setBlocked(false);
    setUnblockSent(false);
    try {
      const res = await API.post("/login", data);
      sessionStorage.setItem("token", res.data.token);
      // Remove unblock request flag if login is successful
      localStorage.removeItem(`unblockRequestSent:${data.email}`);
      if (res.data.user.role === "admin") {
        navigate("/admin");
      } else if (res.data.user.role === "seller") {
        navigate("/dashboard");
      } else {
        navigate("/browse");
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent("userLogin", { detail: { role: res.data.user.role } }));
        }, 100);
      }
    } catch (error) {
      if (error.response?.status === 403 && error.response?.data?.message === "Your account is blocked by the admin.") {
        setBlocked(true);
        // If a request was sent for this email, show the request sent message
        if (localStorage.getItem(`unblockRequestSent:${data.email}`)) {
          setUnblockSent(true);
        } else {
          setUnblockSent(false);
        }
      } else {
        setBlocked(false);
        setUnblockSent(false);
        // Remove flag if error is not blocked
        localStorage.removeItem(`unblockRequestSent:${data.email}`);
        toast.error(error.response?.data?.message || "Login Failed");
      }
    }
  };

  const handleUnblockRequest = async (e) => {
    e.preventDefault();
    setUnblockLoading(true);
    try {
      await API.post("/unblock-request", { email: loginEmail, message: unblockMessage });
      setUnblockSent(true);
      localStorage.setItem(`unblockRequestSent:${loginEmail}`, "true");
      toast.success("Unblock request sent");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send request");
    } finally {
      setUnblockLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4">
      <div className="bg-gray-800 bg-opacity-90 backdrop-blur-md p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-semibold text-center text-white mb-6">
          Welcome Back 👋
        </h2>
        {blocked ? (
          <div className="space-y-5">
            <div className="text-red-400 text-center font-semibold">Your account is blocked by the admin.</div>
            {unblockSent ? (
              <div className="text-green-400 text-center">Your request has been sent. Please wait for admin response.</div>
            ) : (
              <form onSubmit={handleUnblockRequest} className="space-y-4">
                <label className="block text-gray-300">Email</label>
                <input
                  type="email"
                  value={loginEmail}
                  readOnly
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none"
                />
                <label className="block text-gray-300">Why should you be unblocked?</label>
                <textarea
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  value={unblockMessage}
                  onChange={e => setUnblockMessage(e.target.value)}
                  required
                  disabled={unblockLoading}
                />
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 transition-all text-white py-2 rounded-lg text-base font-medium"
                  disabled={unblockLoading || !unblockMessage.trim()}
                >
                  {unblockLoading ? "Sending..." : "Send Request"}
                </button>
              </form>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit(submitHandler)} className="space-y-5">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Email</label>
              <input
                {...register("email", { required: "Email is required" })}
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.email && (
                <p className="text-sm text-red-400">{errors.email.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Password</label>
              <input
                {...register("password", { required: "Password is required" })}
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.password && (
                <p className="text-sm text-red-400">{errors.password.message}</p>
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 transition-all text-white py-2 rounded-lg text-base font-medium"
            >
              Login
            </button>
          </form>
        )}
        <p className="mt-5 text-center text-sm text-gray-400">
          Don’t have an account?{" "}
          <Link to={"/register"} className="text-blue-400 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </section>
  );
};

export default Login;
