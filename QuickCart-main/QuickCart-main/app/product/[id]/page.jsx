"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import Loading from "@/components/Loading";
import { useAppContext } from "@/context/AppContext";
import React from "react";
import { Rate } from "antd";

const Product = () => {
  const { id } = useParams();
  const { addToCart, cartItems } = useAppContext();
  const [productData, setProductData] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Fetch product data by id
  const fetchProductData = async () => {
    try {
      const res = await fetch(`http://localhost:3001/products/${id}`);
      const data = await res.json();
      setProductData(data.product);
    } catch (err) {
      console.error("Failed to fetch product:", err);
    }
  };

  // Load product on id change
  useEffect(() => {
    fetchProductData();
  }, [id]);

  // Hide toast after 2.5 seconds
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 2500);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  if (!productData) return <Loading />;

  // Handler for Add to Cart with duplicate check and toast
  const handleAddToCart = () => {
    const exists = cartItems.some(item => item.productId === productData._id);
    if (exists) {
      setToastMessage("Item is already in your cart");
      setShowToast(true);
      return;
    }
    addToCart(productData._id, 1);
    setToastMessage("Product added to cart");
    setShowToast(true);
  };

  return (
    <div className="px-6 md:px-16 lg:px-32 pt-14 space-y-10">
      {/* Toast notification */}
      {showToast && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "rgba(0,0,0,0.8)",
            color: "white",
            padding: "12px 24px",
            borderRadius: "6px",
            zIndex: 9999,
            boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
            fontWeight: "500",
            userSelect: "none",
          }}
        >
          {toastMessage}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        <div className="px-5 lg:px-16 xl:px-20">
          <div className="rounded-lg overflow-hidden bg-gray-100 mb-4">
            <Image
              src={mainImage || productData.image}
              alt={productData.name}
              className="w-full h-auto object-cover mix-blend-multiply"
              width={1280}
              height={720}
              priority
            />
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div
              onClick={() => setMainImage(productData.image)}
              className="cursor-pointer rounded-lg overflow-hidden bg-gray-100"
            >
              <Image
                src={productData.image}
                alt="Product thumbnail"
                className="w-full h-auto object-cover mix-blend-multiply"
                width={1280}
                height={720}
                priority
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          <h1 className="text-3xl font-medium text-gray-800 mb-4">
            {productData.name}
          </h1>

          <div className="flex items-center gap-2 mt-2">
            <Rate disabled allowHalf defaultValue={productData.rating || 4.5} />
            <span className="text-gray-600">({productData.rating || 4.5})</span>
          </div>

          <p className="text-gray-600 mt-4">
            {productData.description || "No description available"}
          </p>

          <p className="text-3xl font-medium mt-6">₹{productData.price}</p>

          <div className="flex items-center mt-10 gap-4">
            <button
              onClick={handleAddToCart}
              className="w-full py-3.5 bg-gray-100 text-gray-800/80 hover:bg-gray-200 transition"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
