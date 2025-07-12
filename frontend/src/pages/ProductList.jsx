import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ProductNavBar from "../components/ProductNavBar";
import ProductCard from "../components/ProductCard";
import SearchBar from "../components/SearchBar";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedPriceRange, setSelectedPriceRange] = useState("all");

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/products/all")
      .then((res) => setProducts(res.data))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
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

  const hasRealProducts =
    filteredProducts &&
    filteredProducts.length > 0 &&
    filteredProducts.some((p) => p.name && p.price && p.stock);

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <ProductNavBar />

      <div className="max-w-8xl mx-auto px-6 pt-10 pb-16">
        {/* Search and Filters */}
        <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-center gap-8 mb-10">
          <div className="flex-1 max-w-md">
            <SearchBar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
            {/* Category Filter */}
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

            {/* Price Filter */}
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

        {/* Product Cards */}
        <div className="flex flex-wrap justify-center gap-6 mt-4">
          {loading ? (
            <div className="text-center text-gray-400 text-lg">Loading...</div>
          ) : !hasRealProducts ? (
            <div className="text-center text-gray-400 text-lg">No matching products.</div>
          ) : (
            filteredProducts.map((product, idx) => (
              <ProductCard
                key={product._id || idx}
                product={product}
                onCardClick={() => navigate(`/product/${product._id}`)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
