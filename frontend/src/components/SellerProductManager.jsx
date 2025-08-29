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
  const [sortOrder, setSortOrder] = useState("none");
  const [panelOpen, setPanelOpen] = useState(false);

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

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOrder === "priceAsc") return (a.price || 0) - (b.price || 0);
    if (sortOrder === "priceDesc") return (b.price || 0) - (a.price || 0);
    return 0;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <SellerNavBar />

      <div className="max-w-8xl mx-auto px-6 pt-10 pb-16">
        {/* Search + Filters (Responsive) */}
        <div className="w-full mb-6">
          {/* Mobile toggle */}
          <div className="flex items-center justify-between sm:hidden mb-3">
            <div className="flex-1 mr-3">
              <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            </div>
            <button onClick={() => setPanelOpen(v => !v)} className="bg-gray-800 text-white px-3 py-2 rounded whitespace-nowrap">
              {panelOpen ? "Hide Filters" : "Filters & Sort"}
            </button>
          </div>

          {/* Desktop inline controls */}
          <div className="hidden sm:flex w-full flex-row items-center justify-center gap-4 mb-6">
            <div className="flex-1 max-w-md">
              <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            </div>
            <select className="bg-gray-800 text-white px-3 py-2 rounded" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
              <option value="">All Categories</option>
              <option value="Electronics">Electronics</option>
              <option value="Clothing">Clothing</option>
              <option value="Books">Books</option>
              <option value="Home & Kitchen">Home & Kitchen</option>
              <option value="Beauty & Personal Care">Beauty & Personal Care</option>
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
            <select className="bg-gray-800 text-white px-3 py-2 rounded" value={selectedPriceRange} onChange={(e) => setSelectedPriceRange(e.target.value)}>
              <option value="all">All Prices</option>
              <option value="0-500">₹0 - ₹500</option>
              <option value="501-2000">₹501 - ₹2000</option>
              <option value="2001-5000">₹2001 - ₹5000</option>
              <option value="5001-10000">₹5001 - ₹10000</option>
              <option value="10000">₹10000+</option>
            </select>
            <select className="bg-gray-800 text-white px-3 py-2 rounded" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
              <option value="none">Sort: None</option>
              <option value="priceAsc">Price: Low to High</option>
              <option value="priceDesc">Price: High to Low</option>
            </select>
          </div>

          {/* Mobile expanded panel */}
          {panelOpen && (
            <div className="sm:hidden grid grid-cols-1 gap-3 bg-gray-800/40 p-3 rounded">
              <select className="bg-gray-800 text-white px-3 py-2 rounded" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                <option value="">All Categories</option>
                <option value="Electronics">Electronics</option>
                <option value="Clothing">Clothing</option>
                <option value="Books">Books</option>
                <option value="Home & Kitchen">Home & Kitchen</option>
                <option value="Beauty & Personal Care">Beauty & Personal Care</option>
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
              <select className="bg-gray-800 text-white px-3 py-2 rounded" value={selectedPriceRange} onChange={(e) => setSelectedPriceRange(e.target.value)}>
                <option value="all">All Prices</option>
                <option value="0-500">₹0 - ₹500</option>
                <option value="501-2000">₹501 - ₹2000</option>
                <option value="2001-5000">₹2001 - ₹5000</option>
                <option value="5001-10000">₹5001 - ₹10000</option>
                <option value="10000">₹10000+</option>
              </select>
              <select className="bg-gray-800 text-white px-3 py-2 rounded" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                <option value="none">Sort: None</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
              </select>
            </div>
          )}
        </div>

        <div className="flex flex-wrap justify-center gap-6 mt-4">
          {sortedProducts.length === 0 ? (
            <p className="text-gray-400 text-lg text-center w-full">
              No matching products.
            </p>
          ) : (
            sortedProducts.map((product) => (
              <div key={product._id} onClick={() => handleCardClick(product._id)} className="cursor-pointer hover:scale-105 transition-transform duration-200">
                <SellerProductCard product={product} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerProductManager;
