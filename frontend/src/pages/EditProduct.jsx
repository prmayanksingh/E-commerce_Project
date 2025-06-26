import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const initialForm = {
  name: "",
  description: "",
  price: "",
  stock: "",
  category: "",
  imageURL: "",
};

const EditProduct = () => {
  const { id } = useParams();
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) return;
    axios
      .get(`http://localhost:5000/api/products/my`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const product = res.data.find((p) => p._id === id);
        if (product) setForm(product);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = sessionStorage.getItem("token");
    if (!token) return;
    try {
      await axios.put(
        `http://localhost:5000/api/products/${id}`,
        {
          ...form,
          price: Number(form.price),
          stock: Number(form.stock),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Product updated successfully");
      navigate("/dashboard");
    } catch (err) {
      toast.error("Failed to update product");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="text-gray-500 text-lg">Loading...</span>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 min-h-screen">
      <ToastContainer />
      <h2 className="text-3xl font-extrabold mb-8 text-center text-blue-800 tracking-tight drop-shadow">
        Edit Product
      </h2>
      <form
        className="bg-white shadow-2xl rounded-xl px-8 pt-8 pb-6 mb-10 border border-blue-100 animate-fade-in"
        onSubmit={handleSubmit}
      >
        <div className="mb-5">
          <label className="block text-blue-700 text-sm font-bold mb-2">
            Product Name
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>
        <div className="mb-5">
          <label className="block text-blue-700 text-sm font-bold mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>
        <div className="mb-5 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-blue-700 text-sm font-bold mb-2">
              Price
            </label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
              min="0"
              step="0.01"
            />
          </div>
          <div>
            <label className="block text-blue-700 text-sm font-bold mb-2">
              Stock
            </label>
            <input
              type="number"
              name="stock"
              value={form.stock}
              onChange={handleChange}
              className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
              min="0"
            />
          </div>
          <div>
            <label className="block text-blue-700 text-sm font-bold mb-2">
              Category
            </label>
            <input
              type="text"
              name="category"
              value={form.category}
              onChange={handleChange}
              className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
        </div>
        <div className="mb-5">
          <label className="block text-blue-700 text-sm font-bold mb-2">
            Image URL
          </label>
          <input
            type="url"
            name="imageURL"
            value={form.imageURL}
            onChange={handleChange}
            className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold"
            onClick={() => navigate("/dashboard")}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow hover:scale-105 transition-transform"
          >
            Edit Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;
