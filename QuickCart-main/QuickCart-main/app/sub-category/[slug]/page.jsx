"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import debounce from "lodash.debounce";
import { toast } from "react-hot-toast";
import { useAppContext } from "@/context/AppContext";

export default function SubCategoryProductsPage() {
  const { slug } = useParams();
  const router = useRouter();
  const { addToCart, cartItems } = useAppContext();

  const [products, setProducts] = useState([]);
  const [subCategoryName, setSubCategoryName] = useState("");
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("default");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const limit = 6;

  // Fetch products with filters
  const fetchProducts = async (searchTerm = "") => {
    setLoading(true);
    try {
      const params = {
        subcategory: slug,
        search: searchTerm,
        page,
        limit,
      };
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      if (sort === "asc") params.sort = "asc";
      else if (sort === "desc") params.sort = "desc";

      const res = await axios.get("http://localhost:3001/api/products", { params });
      setProducts(res.data.products || []);
      setTotalPages(res.data.totalPages || 1);

      if (res.data.products.length > 0) {
        setSubCategoryName(res.data.products[0].subCategory?.name || slug);
      } else {
        const subRes = await axios.get("http://localhost:3001/api/sub-categories");
        const sub = subRes.data.find((s) => s.slug === slug);
        setSubCategoryName(sub ? sub.name : slug);
      }
    } catch (error) {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetch = useMemo(
    () => debounce(fetchProducts, 500),
    [slug, page, minPrice, maxPrice, sort]
  );

  useEffect(() => {
    debouncedFetch(search);
    return () => debouncedFetch.cancel();
  }, [search, slug, page, minPrice, maxPrice, sort, debouncedFetch]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) setPage(newPage);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 capitalize">
        {subCategoryName || slug?.replace(/-/g, " ")}
      </h1>

      {/* Search Input */}
      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search products..."
          className="px-4 py-2 border rounded w-full max-w-md"
        />
      </div>

      {/* Filters in One Line */}
      <div className="flex flex-wrap gap-4 mb-6 items-center">
        <input
          type="number"
          min="0"
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) => {
            setMinPrice(e.target.value);
            setPage(1);
          }}
          className="px-3 py-2 border rounded w-32"
        />
        <input
          type="number"
          min="0"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => {
            setMaxPrice(e.target.value);
            setPage(1);
          }}
          className="px-3 py-2 border rounded w-32"
        />
        <select
          value={sort}
          onChange={(e) => {
            setSort(e.target.value);
            setPage(1);
          }}
          className="px-3 py-2 border rounded w-48"
        >
          <option value="default">Sort by Price: Default</option>
          <option value="asc">Sort by Price: Low to High</option>
          <option value="desc">Sort by Price: High to Low</option>
        </select>
      </div>

      {/* Products Grid */}
      {loading ? (
        <p>Loading products...</p>
      ) : products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                className="border p-4 rounded shadow hover:shadow-lg cursor-pointer"
              >
                {/* Clickable Image & Name */}
                <div
                  onClick={() => {
                    router.push(`/product/${product._id}`);
                    window.scrollTo(0, 0);
                  }}
                >
                  <img
                    src={product.image || "/placeholder.png"}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded"
                  />
                  <h2 className="text-lg font-semibold mt-2">{product.name}</h2>
                  <p>₹{product.price}</p>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (
                      cartItems.some(
                        (item) => String(item.productId) === String(product._id)
                      )
                    ) {
                      toast.error(`${product.name} is already in your cart!`);
                    } else {
                      addToCart(product);
                      toast.success(`${product.name} added to cart!`);
                    }
                  }}
                  className="mt-3 px-3 py-1 bg-orange-500 text-white text-sm rounded hover:bg-orange-600 transition"
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-between mt-6 max-w-md mx-auto">
            <button
              disabled={page === 1}
              onClick={() => handlePageChange(page - 1)}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="flex items-center">
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page === totalPages}
              onClick={() => handlePageChange(page + 1)}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
