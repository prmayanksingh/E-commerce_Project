import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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

const SellerProductManager = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingIndex, setEditingIndex] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    navigate("/");
  };

  // Load products from API on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    const token = sessionStorage.getItem("token");
    if (!token) return;
    axios
      .get("http://localhost:5000/api/products/my", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setProducts(res.data))
      .catch(() => setProducts([]));
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = sessionStorage.getItem("token");
    if (!token) return;
    try {
      const res = await axios.post(
        "http://localhost:5000/api/products",
        {
          ...form,
          price: Number(form.price),
          stock: Number(form.stock),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setProducts([...products, res.data.product]);
      setForm(initialForm);
      setShowForm(false);
      toast.success("Product added successfully");
    } catch (err) {
      toast.error("Failed to add product");
    }
  };

  const handleEdit = (idx) => {
    const productId = products[idx]._id;
    navigate(`/edit-product/${productId}`);
  };

  // Remove product from DB and refresh list
  const handleDelete = async (idx) => {
    const token = sessionStorage.getItem("token");
    if (!token) return;
    const productId = products[idx]._id;
    try {
      await axios.delete(`http://localhost:5000/api/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProducts();
      toast.success("Product deleted successfully");
    } catch (err) {
      toast.error("Failed to delete product");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 min-h-screen bg-gradient-to-br from-blue-50 to-purple-100">
      <ToastContainer />
      <div className="mx-auto p-4 max-w-5xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-extrabold text-blue-800 tracking-tight drop-shadow">
            Seller Product Management
          </h2>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold shadow"
          >
            Logout
          </button>
        </div>
        <div className="flex justify-end mb-6">
          <button
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg shadow hover:scale-105 transition-transform font-semibold"
            onClick={() => {
              setForm(initialForm);
              setShowForm(true);
            }}
          >
            + Add Product
          </button>
        </div>
        {showForm && (
          <form
            className="bg-white shadow-2xl rounded-xl px-8 pt-8 pb-6 mb-10 border border-blue-100 max-w-2xl mx-auto animate-fade-in"
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
                onClick={() => {
                  setShowForm(false);
                  setForm(initialForm);
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow hover:scale-105 transition-transform"
              >
                {editingIndex !== null ? "Update" : "Add"} Product
              </button>
            </div>
          </form>
        )}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-xl shadow-lg border border-blue-100">
            <thead className="bg-gradient-to-r from-blue-100 to-purple-100">
              <tr>
                <th className="py-3 px-4 text-blue-700">Image</th>
                <th className="py-3 px-4 text-blue-700">Name</th>
                <th className="py-3 px-4 text-blue-700">Description</th>
                <th className="py-3 px-4 text-blue-700">Price</th>
                <th className="py-3 px-4 text-blue-700">Stock</th>
                <th className="py-3 px-4 text-blue-700">Category</th>
                <th className="py-3 px-4 text-blue-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-6 text-gray-400">
                    No products added yet.
                  </td>
                </tr>
              ) : (
                products.map((product, idx) => (
                  <tr key={idx} className="hover:bg-blue-50 transition-colors">
                    <td className="py-2 px-4">
                      <img
                        src={product.imageURL}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded-lg border border-blue-100 shadow"
                      />
                    </td>
                    <td className="py-2 px-4 font-semibold text-blue-800">
                      {product.name}
                    </td>
                    <td className="py-2 px-4 text-gray-600 line-clamp-2 max-w-xs">
                      {product.description}
                    </td>
                    <td className="py-2 px-4 text-green-700 font-bold">
                      ₹{product.price}
                    </td>
                    <td className="py-2 px-4">{product.stock}</td>
                    <td className="py-2 px-4">{product.category}</td>
                    <td className="py-2 px-4 flex gap-2">
                      <button
                        className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-lg font-semibold shadow"
                        onClick={() => handleEdit(idx)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg font-semibold shadow"
                        onClick={() => handleDelete(idx)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SellerProductManager;
