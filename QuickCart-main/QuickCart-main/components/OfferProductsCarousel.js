import React, { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";

const OfferProductsCarousel = () => {
  const [offers, setOffers] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Fetch offer products once on mount
  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3001/api/offer-products?limit=1000&page=1"
        );
        setOffers(res.data.offers || []);
      } catch (error) {
        console.error("Failed to fetch offer products:", error);
      }
    };
    fetchOffers();
  }, []);

  // Auto-slide every 3 seconds
  useEffect(() => {
    if (!offers.length) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % offers.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [offers]);

  // Click dots to change slide
  const handleSlideChange = (index) => {
    setCurrentSlide(index);
  };

  if (offers.length === 0)
    return <p className="text-center mt-10">No offer products found.</p>;

  return (
    <div className="overflow-hidden relative w-full max-w-6xl mx-auto mt-10 rounded-2xl bg-[#E6E9F2] shadow-lg">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-100 to-transparent opacity-30 pointer-events-none"></div>

      {/* Carousel slides */}
      <div
        className="flex transition-transform duration-700 ease-in-out relative z-10"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {offers.map((product, index) => (
          <div
            key={product._id}
            className="flex flex-col-reverse md:flex-row items-center justify-between py-8 md:px-14 px-5 min-w-full"
          >
            {/* Product Info */}
            <div className="md:pl-10 mt-12 md:mt-0 max-w-lg">
              {/* Offer Subtitle */}
              {product.offerText && (
                <p className="text-orange-600 font-semibold text-sm uppercase tracking-wide mb-2">
                  {product.offerText}
                </p>
              )}

              {/* Banner Title */}
              <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4 drop-shadow-sm">
                {product.title || product.name}
              </h1>

              {/* Prices */}
              <div className="flex items-center gap-4 mb-8">
                <p className="text-gray-400 line-through text-lg md:text-xl font-medium">
                  ₹{product.price}
                </p>
                <p className="text-orange-600 text-4xl md:text-6xl font-extrabold tracking-tight">
                  ₹{product.offerPrice}
                </p>
              </div>

              {/* Buy Now Button */}
              <button className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-12 rounded-full shadow-lg transition-transform transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-orange-300">
                Buy Now
              </button>
            </div>

            {/* Product Image */}
            <div className="flex items-center flex-1 justify-center">
              <div className="relative w-48 h-48 md:w-72 md:h-72">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
                  style={{ objectFit: "contain" }}
                  priority={index === currentSlide}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={() =>
          setCurrentSlide((prev) => (prev - 1 + offers.length) % offers.length)
        }
        className="absolute top-1/2 left-4 -translate-y-1/2 bg-white p-2 rounded-full shadow hover:bg-orange-100 transition z-20"
      >
        ‹
      </button>

      <button
        onClick={() => setCurrentSlide((prev) => (prev + 1) % offers.length)}
        className="absolute top-1/2 right-4 -translate-y-1/2 bg-white p-2 rounded-full shadow hover:bg-orange-100 transition z-20"
      >
        ›
      </button>

      {/* Dots */}
      <div className="flex items-center justify-center gap-2 mt-8 pb-6 relative z-10">
        {offers.map((_, index) => (
          <div
            key={index}
            onClick={() => handleSlideChange(index)}
            className={`h-2 w-2 rounded-full cursor-pointer ${
              currentSlide === index ? "bg-orange-600" : "bg-gray-500/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default OfferProductsCarousel;
