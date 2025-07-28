'use client'
import React from "react";
import Banner from "@/components/Banner";
import NewsLetter from "@/components/NewsLetter";
import FeaturedProduct from "@/components/FeaturedProduct";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import OfferProductsCarousel from "@/components/OfferProductsCarousel";
import CategoryList from "@/components/CategoryList";

const Home = () => {
  return (
    <>
      <Navbar/>
      <div className="px-6 md:px-16 lg:px-32">
        <OfferProductsCarousel />
        <CategoryList />
        <FeaturedProduct />
        <Banner />
        <NewsLetter />
      </div>
      <Footer />
    </>
  );
};

export default Home;
