import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductNavBar from "../components/ProductNavBar";
import ProductCard from "../components/ProductCard";
import SearchBar from "../components/SearchBar";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/products/all")
      .then((res) => setProducts(res.data))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const hasRealProducts =
    filteredProducts &&
    filteredProducts.length > 0 &&
    filteredProducts.some((p) => p.name && p.price && p.stock);

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <ProductNavBar />
      <div className="w-full mx-auto px-6 pt-10 pb-16">
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

        <div className="flex flex-wrap justify-center gap-6">
          {loading ? (
            <div className="col-span-full text-center text-gray-400 text-lg">
              Loading...
            </div>
          ) : !hasRealProducts ? (
            <div className="col-span-full text-center text-gray-400 text-lg">
              No matching products.
            </div>
          ) : (
            filteredProducts.map(
              (product, idx) =>
                product.name &&
                product.price &&
                product.stock && (
                  <ProductCard key={product._id || idx} product={product} />
                )
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
