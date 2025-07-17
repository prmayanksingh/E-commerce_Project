import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import SellerNavBar from "../components/SellerNavBar";
import { toast } from "react-toastify";

const renderStars = (rating) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  return (
    <span className="flex items-center gap-1">
      {[...Array(fullStars)].map((_, i) => (
        <span key={"full-" + i} className="text-yellow-400 text-xl">★</span>
      ))}
      {halfStar && <span className="text-yellow-400 text-xl">☆</span>}
      {[...Array(emptyStars)].map((_, i) => (
        <span key={"empty-" + i} className="text-gray-500 text-xl">★</span>
      ))}
    </span>
  );
};

const ProductDetailsSeller = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [avgRating, setAvgRating] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    // Fetch product details (with avgRating)
    axios
      .get(`http://localhost:5000/api/products/${id}`)
      .then((res) => {
        setProduct(res.data);
        setAvgRating(res.data.avgRating);
      })
      .catch(() => setProduct(null));
    // Fetch reviews
    axios
      .get(`http://localhost:5000/api/products/${id}/reviews`)
      .then((res) => setReviews(res.data))
      .catch(() => setReviews([]));
  }, [id]);

  const handleEdit = () => {
    navigate(`/edit-product/${id}`);
  };

  const handleDelete = async () => {
    const token = sessionStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Product deleted successfully");
      navigate("/dashboard");
    } catch (err) {
      toast.error("Failed to delete product");
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <SellerNavBar />

      <div className="max-w-7xl mx-auto px-4 pt-6 pb-16">
        <div className="mb-6">
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded"
          >
            ← Back
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 items-start">
          <div className="w-full lg:w-[45%]">
            <img
              src={product.imageURL}
              alt={product.name}
              className="w-full h-[420px] object-cover rounded-xl shadow-xl"
            />
          </div>

          <div className="w-full lg:w-[55%] space-y-3">
            <div>
              <h2 className="text-4xl font-bold capitalize">{product.name}</h2>
              {/* Average rating display */}
              <div className="flex items-center gap-2 mt-2">
                {avgRating ? (
                  <>
                    <span className="text-yellow-400 font-bold text-xl">{avgRating}</span>
                    {renderStars(Number(avgRating))}
                    <span className="text-gray-400 text-sm">({reviews.length} reviews)</span>
                  </>
                ) : (
                  <span className="text-gray-400 text-sm">No ratings yet</span>
                )}
              </div>
            </div>

            <p className="text-2xl font-semibold text-green-300 mb-5">
              ₹{product.price}
            </p>

            <div className="flex flex-wrap gap-4">
              <div className="px-4 py-2 bg-[#00ffc3]/10 border border-[#00ffc3] rounded shadow shadow-[#00ffc3] w-fit">
                <p className="text-white text-sm font-medium">
                  Stock: {product.stock}
                </p>
              </div>

              <div className="px-4 py-2 bg-[#ff6bff]/10 border border-[#ff6bff] rounded shadow shadow-[#ff6bff] w-fit">
                <p className="text-white text-sm font-medium">
                  {product.category}
                </p>
              </div>

              <div className="px-4 py-2 bg-[#00bfff]/10 border border-[#00bfff] rounded shadow shadow-[#00bfff] w-fit">
                <p className="text-white text-sm font-medium">
                  {product.sellerId?.name || "Unknown"}
                </p>
              </div>
            </div>

            {product.description && (
              <div className="bg-gray-700 p-5 mt-8 rounded-xl text-sm leading-relaxed text-gray-100 shadow-md border border-gray-600">
                <p className="font-semibold text-white mb-2">Description:</p>
                <p>{product.description}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 mt-8">
              <button
                onClick={handleEdit}
                className="bg-yellow-400 hover:bg-yellow-500 text-black px-5 py-2 rounded-md font-semibold transition duration-200"
              >
                Edit Product
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-md font-semibold transition duration-200"
              >
                Delete Product
              </button>
            </div>
          </div>
        </div>
        {/* Review section - read only */}
        <div className="w-full max-w-3xl mx-auto mt-12">
          <h3 className="text-2xl font-bold mb-4">Reviews</h3>
          <div className="space-y-6">
            {reviews.length === 0 && (
              <div className="text-gray-400 text-center">No reviews yet.</div>
            )}
            {reviews.map((review) => (
              <div
                key={review._id}
                className="bg-gray-800 rounded-xl p-5 border border-gray-700 shadow flex flex-col gap-2"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-white">
                    {review.userId?.name || "Unknown"}
                  </span>
                  <span className="text-gray-400 text-xs">
                    {new Date(review.updatedAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {renderStars(review.rating)}
                  <span className="text-gray-300 text-sm">{review.rating}/5</span>
                </div>
                <div className="text-gray-200 text-base mt-1">
                  {review.feedback || <span className="italic text-gray-500">No feedback</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsSeller;
