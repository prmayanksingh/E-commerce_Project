import React from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

const categories = [
  "Electronics",
  "Clothing",
  "Books",
  "Home & Kitchen",
  "Beauty & Personal Care",
  "Sports & Outdoors",
  "Toys & Games",
  "Automotive",
  "Grocery",
  "Health",
  "Jewelry",
  "Shoes",
  "Watches",
  "Office Supplies",
  "Pet Supplies",
];

const AddProduct = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const token = sessionStorage.getItem("token");
    if (!token) return;
    try {
      await axios.post(
        "http://localhost:5000/api/products",
        {
          ...data,
          price: Number(data.price),
          stock: Number(data.stock),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Product added successfully");
      reset();
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add product");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="backdrop-blur-md bg-gray-800 bg-opacity-90 rounded-lg shadow-lg p-8 w-full max-w-lg mx-4">
        <h2 className="text-2xl font-bold text-center text-white mb-6">
          Add Product
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <input
            {...register("name", { required: "Product name is required" })}
            placeholder="Product Name"
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none"
          />
          {errors.name && (
            <p className="text-sm text-red-400">{errors.name.message}</p>
          )}

          <textarea
            {...register("description", { required: "Description is required" })}
            placeholder="Description"
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none"
          />
          {errors.description && (
            <p className="text-sm text-red-400">{errors.description.message}</p>
          )}

          <div className="flex gap-4">
            <input
              type="number"
              {...register("price", {
                required: "Price is required",
                min: { value: 0, message: "Price must be >= 0" },
              })}
              placeholder="Price"
              className="w-1/2 px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none"
            />
            <input
              type="number"
              {...register("stock", {
                required: "Stock is required",
                min: { value: 0, message: "Stock must be >= 0" },
              })}
              placeholder="Stock"
              className="w-1/2 px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none"
            />
          </div>
          <div className="flex gap-4">
            {errors.price && (
              <p className="text-sm text-red-400">{errors.price.message}</p>
            )}
            {errors.stock && (
              <p className="text-sm text-red-400">{errors.stock.message}</p>
            )}
          </div>

          {/* Category as select */}
          <select
            {...register("category", { required: "Category is required" })}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none"
            defaultValue=""
          >
            <option value="" disabled>
              Select Category
            </option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="text-sm text-red-400">{errors.category.message}</p>
          )}

          <input
            type="url"
            {...register("imageURL", { required: "Image URL is required" })}
            placeholder="Image URL"
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none"
          />
          {errors.imageURL && (
            <p className="text-sm text-red-400">{errors.imageURL.message}</p>
          )}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 text-white font-semibold"
              onClick={() => navigate("/dashboard")}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold"
            >
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
