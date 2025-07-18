import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ProductNavBar from "../components/ProductNavBar";
import { useCart } from "../context/CartContext";
import OrderSummary from "../components/OrderSummary";
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

const getUserId = () => {
  try {
    const token = sessionStorage.getItem("token");
    if (!token) return null;
    // JWT decode (naive, for demo)
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.id || payload._id || payload.userId;
  } catch {
    return null;
  }
};

const ProductDetailsBuyer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [showBuyNow, setShowBuyNow] = useState(false);
  const [avgRating, setAvgRating] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [myReview, setMyReview] = useState(null);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editFeedback, setEditFeedback] = useState("");
  const [editRating, setEditRating] = useState(0);
  const [editId, setEditId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const { addToCart, removeFromCart, isInCart } = useCart();
  const userId = getUserId();

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
      .then((res) => {
        setReviews(res.data);
      })
      .catch(() => setReviews([]));
  }, [id, userId]);

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        Loading...
      </div>
    );
  }

  const inCart = isInCart(product?._id);
  const handleCartClick = () => {
    inCart ? removeFromCart(product._id) : addToCart(product);
  };

  // Submit a new review
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!rating) {
      toast.error("Rating is required");
      return;
    }
    try {
      const res = await axios.post(
        `http://localhost:5000/api/products/${id}/review`,
        { rating, feedback },
        { headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` } }
      );
      toast.success("Review submitted!");
      setRating(0);
      setFeedback("");
      // Refresh reviews
      const reviewsRes = await axios.get(`http://localhost:5000/api/products/${id}/reviews`);
      setReviews(reviewsRes.data);
    } catch (err) {
      toast.error("Failed to submit review");
    }
  };

  // Edit review
  const handleEdit = (review) => {
    setEditMode(true);
    setEditFeedback(review.feedback || "");
    setEditRating(review.rating);
    setEditId(review._id);
  };
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editRating) {
      toast.error("Rating is required");
      return;
    }
    try {
      const res = await axios.put(
        `http://localhost:5000/api/products/review/${editId}`,
        { rating: editRating, feedback: editFeedback },
        { headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` } }
      );
      toast.success("Review updated!");
      setEditMode(false);
      setEditId(null);
      // Refresh reviews
      const reviewsRes = await axios.get(`http://localhost:5000/api/products/${id}/reviews`);
      setReviews(reviewsRes.data);
      setMyReview(res.data);
    } catch (err) {
      toast.error("Failed to update review");
    }
  };

  // Delete review
  const handleDelete = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete your review?")) return;
    setDeletingId(reviewId);
    try {
      await axios.delete(
        `http://localhost:5000/api/products/review/${reviewId}`,
        { headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` } }
      );
      toast.success("Review deleted!");
      // Refresh reviews
      const reviewsRes = await axios.get(`http://localhost:5000/api/products/${id}/reviews`);
      setReviews(reviewsRes.data);
      setMyReview(null);
      setRating(0);
      setFeedback("");
    } catch (err) {
      toast.error("Failed to delete review");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <ProductNavBar />
      <div className="max-w-7xl mx-auto px-4 pt-6 pb-16">
        <div className="mb-6 flex justify-start">
          <button
            onClick={() => navigate("/products")}
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
            <h2 className="text-4xl font-bold capitalize">{product.name}</h2>
            {product.stock === 0 && (
              <div className="text-red-400 font-bold text-lg mb-2">Out of Stock</div>
            )}
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
            <p className="text-2xl font-semibold text-green-300 mb-5">
              ₹{product.price}
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="px-4 py-2 bg-[#ff6bff]/10 border border-[#ff6bff] rounded">
                <p className="text-white text-sm font-medium">
                  {product.category}
                </p>
              </div>
              <div className="px-4 py-2 bg-[#00bfff]/10 border border-[#00bfff] rounded">
                <p className="text-white text-sm font-medium">
                  {product.sellerId?.name || "Unknown"}
                </p>
              </div>
            </div>
            {product.description && (
              <div className="bg-gray-700 p-5 mt-8 rounded-xl text-gray-100 border border-gray-600">
                <p className="font-semibold text-white mb-2">Description:</p>
                <p>{product.description}</p>
              </div>
            )}
            <div className="flex gap-4 mt-6">
              <button
                className={`${
                  inCart
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-blue-600 hover:bg-blue-700"
                } text-white px-6 py-2 rounded-md`}
                onClick={() => {
                  if (product.stock === 0) {
                    toast.error("Product is out of stock");
                    return;
                  }
                  handleCartClick();
                }}
                disabled={product.stock === 0}
              >
                {inCart ? "Remove from Cart" : "Add to Cart"} 🛒
              </button>
              <button
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md"
                onClick={() => {
                  if (product.stock === 0) {
                    toast.error("Product is out of stock");
                    return;
                  }
                  setShowBuyNow(true);
                }}
                disabled={product.stock === 0}
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
        {/* Review section - only this should be max-w-3xl */}
        <div className="w-full max-w-3xl mx-auto mt-12">
          <h3 className="text-2xl font-bold mb-4">Reviews</h3>
          {/* Review form (only for buyers, not sellers) */}
          {userId && (
            <div className="bg-gray-800 rounded-xl p-6 mb-8 border border-gray-700">
              <form onSubmit={handleReviewSubmit} className="space-y-3">
                <div>
                  <label className="block text-sm mb-1 text-gray-300 font-medium">Your Rating <span className="text-red-400">*</span></label>
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        className={
                          star <= rating
                            ? "text-yellow-400 text-2xl focus:outline-none"
                            : "text-gray-500 text-2xl focus:outline-none"
                        }
                        onClick={() => setRating(star)}
                        aria-label={`Rate ${star}`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm mb-1 text-gray-300 font-medium">Feedback (optional)</label>
                  <textarea
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2 text-white min-h-[60px]"
                    value={feedback}
                    onChange={e => setFeedback(e.target.value)}
                    placeholder="Share your experience..."
                  />
                </div>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md font-semibold"
                >
                  Submit Review
                </button>
              </form>
            </div>
          )}
          {/* Reviews list */}
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
                  {review.userId && review.userId._id === userId && !editMode && (
                    <>
                      <button
                        className="ml-2 text-blue-400 hover:underline text-xs disabled:opacity-60"
                        onClick={() => handleEdit(review)}
                        disabled={deletingId === review._id}
                      >
                        Edit
                      </button>
                      <button
                        className="ml-2 text-red-400 hover:underline text-xs disabled:opacity-60"
                        onClick={() => handleDelete(review._id)}
                        disabled={deletingId === review._id}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {renderStars(review.rating)}
                  <span className="text-gray-300 text-sm">{review.rating}/5</span>
                </div>
                {editMode && editId === review._id ? (
                  <form onSubmit={handleEditSubmit} className="space-y-2 mt-2">
                    <div className="flex gap-1">
                      {[1,2,3,4,5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          className={
                            star <= editRating
                              ? "text-yellow-400 text-2xl focus:outline-none"
                              : "text-gray-500 text-2xl focus:outline-none"
                          }
                          onClick={() => setEditRating(star)}
                          aria-label={`Edit rate ${star}`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                    <textarea
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2 text-white min-h-[60px]"
                      value={editFeedback}
                      onChange={e => setEditFeedback(e.target.value)}
                      placeholder="Edit your feedback..."
                    />
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-md text-sm"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-1 rounded-md text-sm"
                        onClick={() => setEditMode(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="text-gray-200 text-base mt-1">
                    {review.feedback || <span className="italic text-gray-500">No feedback</span>}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        {showBuyNow && (
          <OrderSummary
            cart={[{ ...product, quantity: 1 }]}
            totalPrice={product.price}
            onClose={() => setShowBuyNow(false)}
          />
        )}
      </div>
    </div>
  );
};

export default ProductDetailsBuyer;
