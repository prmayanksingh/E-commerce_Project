import React, { useState, useEffect } from "react";

const initialForm = {
  name: "",
  description: "",
  price: "",
  stock: "",
  category: "",
  imageUrl: "",
};

const SellerProductManager = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingIndex, setEditingIndex] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [seller, setSeller] = useState({ name: "Unknown", email: "" });

  // Get seller info from localStorage
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      try {
        const parsed = JSON.parse(user);
        setSeller({ name: parsed.name, email: parsed.email });
      } catch {}
    }
  }, []);

  // Load products from localStorage on mount, filter by seller
  useEffect(() => {
    const saved = localStorage.getItem("seller_products");
    if (saved) {
      const allProducts = JSON.parse(saved);
      setProducts(
        allProducts.filter(
          (p) => p.sellerEmail === seller.email
        )
      );
    }
  }, [seller.email]);

  // Save products to localStorage whenever they change (merge with others)
  useEffect(() => {
    const saved = localStorage.getItem("seller_products");
    let allProducts = [];
    if (saved) allProducts = JSON.parse(saved);
    // Remove old products from this seller
    const filtered = allProducts.filter((p) => p.sellerEmail !== seller.email);
    // Add current seller's products
    localStorage.setItem(
      "seller_products",
      JSON.stringify([...filtered, ...products])
    );
  }, [products, seller.email]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const sellerName = seller.name;
    const sellerEmail = seller.email;
    if (editingIndex !== null) {
      // Edit product
      const updated = [...products];
      updated[editingIndex] = { ...form, sellerName, sellerEmail };
      setProducts(updated);
      setEditingIndex(null);
    } else {
      // Add product
      setProducts([...products, { ...form, sellerName, sellerEmail }]);
    }
    setForm(initialForm);
    setShowForm(false);
  };

  const handleEdit = (idx) => {
    setForm(products[idx]);
    setEditingIndex(idx);
    setShowForm(true);
  };

  const handleDelete = (idx) => {
    setProducts(products.filter((_, i) => i !== idx));
  };

  return (
    <div className="max-w-5xl mx-auto p-4 min-h-screen bg-gradient-to-br from-blue-50 to-purple-100">
      <div className="mx-auto p-4 max-w-5xl">
        <h2 className="text-3xl font-extrabold mb-8 text-center text-blue-800 tracking-tight drop-shadow">
          Seller Product Management
        </h2>
        <div className="mb-2 text-right text-blue-700 font-semibold">
          Seller: {seller.name}
        </div>
        <div className="flex justify-end mb-6">
          <button
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg shadow hover:scale-105 transition-transform font-semibold"
            onClick={() => {
              setForm(initialForm);
              setEditingIndex(null);
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
                name="imageUrl"
                value={form.imageUrl}
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
                  setEditingIndex(null);
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
                <th className="py-3 px-4 text-blue-700">Seller</th>
                <th className="py-3 px-4 text-blue-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-6 text-gray-400">
                    No products added yet.
                  </td>
                </tr>
              ) : (
                products.map((product, idx) => (
                  <tr key={idx} className="hover:bg-blue-50 transition-colors">
                    <td className="py-2 px-4">
                      <img
                        src={product.imageUrl}
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
                    <td className="py-2 px-4">{product.sellerName}</td>
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
