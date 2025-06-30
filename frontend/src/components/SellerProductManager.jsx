import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SellerNavBar from "./SellerNavBar";
import SellerProductCard from "./SellerProductCard";

const SellerProductManager = () => {
  const [products, setProducts] = useState([]);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <SellerNavBar/>
      <div className="max-w-6xl mx-auto px-6 pt-10 pb-16">
        {/* CARDS */}
        <div className="flex flex-wrap justify-center gap-6">
          {products.map((product, idx) => (
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
