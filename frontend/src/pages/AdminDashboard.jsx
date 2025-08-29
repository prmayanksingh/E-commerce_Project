import React, { useEffect, useState } from "react";
import AdminNavBar from "../components/AdminNavBar";
import SearchBar from "../components/SearchBar";
import ProductCard from "../components/ProductCard";
import API from "../utils/api";
import { useNavigate } from "react-router-dom";

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

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedPriceRange, setSelectedPriceRange] = useState("all");
  const [sortOrder, setSortOrder] = useState("none");
  const [panelOpen, setPanelOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await API.get("/admin/products");
        setProducts(res.data);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

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

  const hasRealProducts =
    filteredProducts &&
    filteredProducts.length > 0 &&
    filteredProducts.some((p) => p.name && p.price && p.stock);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <AdminNavBar />
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
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
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
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
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
        {/* Product Cards */}
        <div className="flex flex-wrap justify-center gap-6 mt-4">
          {loading ? (
            <div className="text-center text-gray-400 text-lg">Loading...</div>
          ) : !hasRealProducts ? (
            <div className="text-center text-gray-400 text-lg">No matching products.</div>
          ) : (
            sortedProducts.map((product, idx) => (
              <div key={product._id || idx} className="flex flex-col items-center">
                <ProductCard product={product} onCardClick={() => navigate(`/admin/product/${product._id}`)} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 