import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
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
      if (editingIndex !== null) {
        const productId = products[editingIndex]._id;
        await axios.put(
          `http://localhost:5000/api/products/${productId}`,
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
      } else {
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
        toast.success("Product added successfully");
      }
      setForm(initialForm);
      setShowForm(false);
      setEditingIndex(null);
      fetchProducts();
    } catch (err) {
      toast.error("Failed to add/update product");
    }
  };

  const handleEdit = (idx) => {
    setForm(products[idx]);
    setEditingIndex(idx);
    setShowForm(true);
  };

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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <h1 className="text-3xl sm:text-4xl text-center bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400 bg-clip-text text-transparent drop-shadow-md tracking-wide archivo-black-regular">
            Seller Product Management
          </h1>
          <div className="mt-4 sm:mt-0 flex gap-2">
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md text-sm"
            >
              Logout
            </button>
            <button
              onClick={() => {
                setForm(initialForm);
                setShowForm(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md text-sm"
            >
              + Add Product
            </button>
          </div>
        </div>

        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="bg-[#1e293b] bg-opacity-90 backdrop-blur-md p-6 rounded-lg shadow-md max-w-3xl mx-auto mb-10 space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Product Name"
                className="p-3 rounded-md bg-[#0f172a] border border-gray-600 text-white"
                required
              />
              <input
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder="Category"
                className="p-3 rounded-md bg-[#0f172a] border border-gray-600 text-white"
                required
              />
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="Price"
                className="p-3 rounded-md bg-[#0f172a] border border-gray-600 text-white"
                required
              />
              <input
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                placeholder="Stock"
                className="p-3 rounded-md bg-[#0f172a] border border-gray-600 text-white"
                required
              />
              <input
                type="url"
                name="imageURL"
                value={form.imageURL}
                onChange={handleChange}
                placeholder="Image URL"
                className="p-3 rounded-md bg-[#0f172a] border border-gray-600 text-white col-span-full"
                required
              />
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Description"
                className="p-3 rounded-md bg-[#0f172a] border border-gray-600 text-white col-span-full"
                required
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setForm(initialForm);
                  setEditingIndex(null);
                }}
                className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-md text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-md text-white"
              >
                {editingIndex !== null ? "Update" : "Add"} Product
              </button>
            </div>
          </form>
        )}

        <div className="overflow-x-auto mt-6 bg-[#1e293b] bg-opacity-90 backdrop-blur-md rounded-lg shadow-md">
          <table className="min-w-full text-white text-sm sm:text-base">
            <thead className="bg-[#334155] text-center">
              <tr>
                <th className="py-3 px-4">Image</th>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-gray-400">
                    No products found.
                  </td>
                </tr>
              ) : (
                products.map((product, idx) => (
                  <tr
                    key={idx}
                    className="text-center border-t border-[#334155] hover:bg-[#0f172a]"
                  >
                    <td className="py-2 px-4">
                      <img
                        src={product.imageURL}
                        alt={product.name}
                        className="w-14 h-14 object-cover rounded-md mx-auto"
                      />
                    </td>
                    <td className="py-2 px-4 font-semibold">{product.name}</td>
                    <td className="py-2 px-4 text-green-400">
                      ₹{product.price}
                    </td>
                    <td className="py-2 px-4">{product.stock}</td>
                    <td className="py-2 px-4">{product.category}</td>
                    <td className="py-2 px-4 space-x-2">
                      <button
                        onClick={() => handleEdit(idx)}
                        className="bg-yellow-400 hover:bg-yellow-500 text-black px-3 py-1 rounded-md font-semibold text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(idx)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md font-semibold text-sm"
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
