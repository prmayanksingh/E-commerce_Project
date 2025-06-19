import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import API from "../utils/api";

const Login = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const submitHandler = async (data) => {
    try {
      const res = await API.post("/login", data);
      console.log("Login Successfully", res.data);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/dashbord");
    } catch (error) {
      console.error(error.response?.data?.message);
      alert(error.response?.data?.message || "Login Failed");
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4">
      <div className="bg-gray-800 bg-opacity-90 backdrop-blur-md p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-semibold text-center text-white mb-6">
          Welcome Back 👋
        </h2>

        <form onSubmit={handleSubmit(submitHandler)} className="space-y-5">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Email</label>
            <input
              {...register("email", { required: "Email is required" })}
              type="email"
              placeholder="Enter you email"
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

        <p className="mt-5 text-center text-sm text-gray-400">
          Don’t have an account?
          <Link to={"/register"} className="text-blue-400 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </section>
  );
};

export default Login;
