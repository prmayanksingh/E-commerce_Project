import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

const register = () => {
    const {register, handleSubmit, reset, formState: { errors }} = useForm();
    const submitHandler = (data)=>{
        if(data.password !== data.confirmPassword) alert("password didnot match")
        else alert("password matched")
    }
    
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4">
      <div className="bg-gray-800 bg-opacity-90 backdrop-blur-md p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-semibold text-center text-white mb-6">
          Create Your Account ✨
        </h2>

        <form onSubmit={handleSubmit(submitHandler)} className="space-y-5">
          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Full Name
            </label>
            <input
              {...register("name")}
              type="text"
              placeholder="Enter Your Name"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Email</label>
            <input
              {...register("email")}
              type="email"
              placeholder="Enter Your Email"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Password</label>
            <input
              {...register("password")}
              type="password"
              placeholder="Create a secure password"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

           <div>
            <label className="block text-sm text-gray-300 mb-1">Confirm Password</label>
            <input
              {...register("confirmPassword")}
              type="password"
              placeholder="Re-enter the password"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 transition-all text-white py-2 rounded-lg text-base font-medium"
          >
            Register
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-gray-400">
          Already have an account?
          <Link to={"/"} className="text-blue-400 hover:underline">
          Login
          </Link>
        </p>
      </div>
    </section>
  );
};

export default register;
