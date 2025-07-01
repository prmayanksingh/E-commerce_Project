import { useNavigate } from "react-router-dom";

const BrowseLanding = () => {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-black bg-cover"
      style={{
        backgroundImage: "url('/assets/browse-hero.jpg')",
        backgroundPosition: "center 8%", // ⬅️ Moves the light spot upward slightly
        backgroundSize: "cover",
      }}
    >
      <div className="text-center px-6 sm:px-10 py-10 sm:py-16 bg-black/30 backdrop-blur-md rounded-lg shadow-lg w-full max-w-2xl mx-4 sm:mx-auto">
        <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-pink-500 mb-6">
          Discover Exclusive Products
        </h1>
        <p className="text-lg sm:text-xl text-gray-200 mb-8 max-w-xl mx-auto">
          Explore our curated selection of top-quality items just for you.
        </p>
        <button
          onClick={() => navigate("/products")}
          className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded shadow focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
        >
          Browse Products
        </button>
      </div>
    </div>
  );
};

export default BrowseLanding;
