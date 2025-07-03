import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SellerNavBar from "./SellerNavBar";
import SellerProductCard from "./SellerProductCard";
import SearchBar from "./SearchBar";

const SellerProductManager = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedPriceRange, setSelectedPriceRange] = useState("all");

  const navigate = useNavigate();

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

  const handleEdit = (idx) => {
    const productId = products[idx]._id;
    navigate(`/edit-product/${productId}`);
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

  const filteredProducts = products
    .filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((product) =>
      selectedCategory ? product.category === selectedCategory : true
    )
    .filter((product) => {
      if (selectedPriceRange === "all") return true;
      const [min, max] = selectedPriceRange.split("-");
      if (max) return product.price >= min && product.price <= max;
      return product.price >= parseInt(min);
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <SellerNavBar />

      <div className="max-w-6xl mx-auto px-6 pt-10 pb-16">
        <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-center gap-8 mb-10">
          <div className="flex-1 max-w-md">
            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
            <select
              className="bg-gray-800 text-white px-3 py-2 rounded w-full sm:w-auto"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="Electronics">Electronics</option>
              <option value="Clothing">Clothing</option>
              <option value="Books">Books</option>
              <option value="Home & Kitchen">Home & Kitchen</option>
              <option value="Beauty & Personal Care">
                Beauty & Personal Care
              </option>
              <option value="Sports & Outdoors">Sports & Outdoors</option>
              <option value="Toys & Games">Toys & Games</option>
              <option value="Automotive">Automotive</option>
              <option value="Grocery">Grocery</option>
              <option value="Health">Health</option>
              <option value="Jewelry">Jewelry</option>
              <option value="Shoes">Shoes</option>
              <option value="Watches">Watches</option>
              <option value="Office Supplies">Office Supplies</option>
              <option value="Pet Supplies">Pet Supplies</option>
            </select>

            <select
              className="bg-gray-800 text-white px-3 py-2 rounded w-full sm:w-auto"
              value={selectedPriceRange}
              onChange={(e) => setSelectedPriceRange(e.target.value)}
            >
              <option value="all">All Prices</option>
              <option value="0-500">₹0 - ₹500</option>
              <option value="501-2000">₹501 - ₹2000</option>
              <option value="2001-5000">₹2001 - ₹5000</option>
              <option value="5001-10000">₹5001 - ₹10000</option>
              <option value="10000">₹10000+</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-6 mt-4">
          {filteredProducts.length === 0 ? (
            <p className="text-gray-400 text-lg text-center w-full">
              No matching products.
            </p>
          ) : (
            filteredProducts.map((product, idx) => (
              <SellerProductCard
                key={product._id || idx}
                product={product}
                onEdit={() => handleEdit(idx)}
                onDelete={() => handleDelete(idx)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerProductManager;
