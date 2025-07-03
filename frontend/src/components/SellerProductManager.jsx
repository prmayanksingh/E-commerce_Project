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

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <SellerNavBar />
      <div className="max-w-6xl mx-auto px-6 pt-10 pb-16">
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

        <div className="flex flex-wrap justify-center gap-6">
          {filteredProducts.map((product, idx) => (
            <SellerProductCard
              key={product._id || idx}
              product={product}
              onEdit={() => handleEdit(idx)}
              onDelete={() => handleDelete(idx)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SellerProductManager;
