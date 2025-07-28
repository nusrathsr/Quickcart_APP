import React, { useEffect, useState } from "react";
import { Carousel } from "react-bootstrap";
import axios from "axios";

const Banner = () => {
  const [offerProducts, setOfferProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // const search = '';
  // const page = 1;
  // const limit = 7;

  useEffect(() => {
    const fetchOfferProducts = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/offer-products?&page=1&limit=1000");
        setOfferProducts(response.data.offers);
      } catch (error) {
        console.error("Failed to fetch offer products", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOfferProducts();

  }, [])

  if (loading) return null;

  if (offerProducts.length === 0) {
    return (
      <div className="text-center py-20 text-gray-500">
        No offer products available right now.
      </div>
    );
  }

  return (
    <div className="my-16 max-w-5xl mx-auto rounded-xl overflow-hidden bg-[#E6E9F2]">
      <Carousel>
        {offerProducts.map(({ _id, name, offerPrice, image }) => (
          <Carousel.Item key={_id}>
            <div className="flex flex-col md:flex-row items-center justify-between px-6 md:px-20 py-14 md:py-0 bg-[#E6E9F2] my-16 rounded-xl overflow-hidden">
              <img
                src={image}
                alt={name}
                className="max-w-xs md:max-w-md rounded-lg object-cover ml-4 md:ml-12"
                style={{ maxHeight: "320px" }}
              />
              <div className="mt-6 md:mt-0 md:pl-12 md:pr-20 px-6 text-center md:text-left w-full">
                <h2 className="text-2xl md:text-3xl font-semibold">{name}</h2>
                <p className="text-lg font-medium text-orange-600 mt-2">
                  Offer Price: ${offerPrice}
                </p>
                <button className="mt-6 px-10 py-2.5 bg-orange-600 text-white rounded hover:bg-orange-700 transition">
                  Buy now
                </button>
              </div>
            </div>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
};

export default Banner;