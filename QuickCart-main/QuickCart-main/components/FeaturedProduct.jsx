"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";

const FeaturedProduct = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchMostSoldProducts = async () => {
      try {
        const res = await axios.get("http://localhost:3001/api/products/most-sold");
        setProducts(res.data);
      } catch (error) {
        console.error("Error fetching most sold products:", error);
      }
    };
    fetchMostSoldProducts();
  }, []);

  return (
    <div className="mt-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center">
        <p className="text-3xl font-medium">Featured Products</p>
        <div className="w-28 h-0.5 bg-orange-600 mt-2"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-14 mt-12">
        {products.map(({ product }) => (
          <div
            key={product._id}
            className="relative group rounded-lg overflow-hidden shadow-lg"
          >
            <div className="relative w-full h-72">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="group-hover:brightness-75 transition duration-300 object-cover"
                sizes="(max-width: 768px) 100vw, 400px"
              />
            </div>
            <div className="absolute bottom-6 left-6 right-6 p-4 rounded-lg text-white space-y-2 transform group-hover:-translate-y-4 transition duration-300">
              <p className="font-semibold text-lg lg:text-xl drop-shadow-md">{product.name}</p>
              <p className="text-sm lg:text-base drop-shadow-md line-clamp-3">{product.description}</p>
              <button className="bg-orange-600 px-4 py-2 rounded hover:bg-orange-700 transition">
                Buy now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedProduct;
