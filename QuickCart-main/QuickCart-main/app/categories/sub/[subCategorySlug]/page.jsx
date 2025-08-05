"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import debounce from "lodash.debounce";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { useAppContext } from "@/context/AppContext";

export default function SubCategoryProductsPage() {
  const { subCategorySlug } = useParams();
  const { addToCart, cartItems } = useAppContext();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("default"); // default, asc, desc
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const limit = 6;

  const fetchProducts = async (searchTerm = "") => {
    setLoading(true);
    try {
      const params = {
        subcategory: subCategorySlug,
        search: searchTerm,
        page,
        limit,
      };

      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;

      if (sort === "asc") params.sort = "asc";
      else if (sort === "desc") params.sort = "desc";

      const res = await axios.get("http://localhost:3001/api/products", {
        params,
      });

      setProducts(res.data.products || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (error) {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetch = useMemo(() => debounce(fetchProducts, 500), [
    subCategorySlug,
    page,
    minPrice,
    maxPrice,
    sort,
  ]);

  useEffect(() => {
    debouncedFetch(search);
    return () => debouncedFetch.cancel();
  }, [search, subCategorySlug, page, minPrice, maxPrice, sort, debouncedFetch]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleMinPriceChange = (e) => {
    setMinPrice(e.target.value);
    setPage(1);
  };

  const handleMaxPriceChange = (e) => {
    setMaxPrice(e.target.value);
    setPage(1);
  };

  const handleSortChange = (e) => {
    setSort(e.target.value);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages && totalPages > 0) {
      setPage(newPage);
    }
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 capitalize">
        {subCategorySlug.replace(/-/g, " ")}
      </h1>

      {/* Search input (1st line) */}
      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="Search products..."
          className="px-4 py-2 border rounded w-full max-w-md"
        />
      </div>

      {/* Filters (2nd line) */}
      <div className="flex flex-wrap gap-4 mb-6 max-w-full items-center">
        <input
          type="number"
          min="0"
          placeholder="Min Price"
          value={minPrice}
          onChange={handleMinPriceChange}
          className="px-3 py-2 border rounded w-32"
        />

        <input
          type="number"
          min="0"
          placeholder="Max Price"
          value={maxPrice}
          onChange={handleMaxPriceChange}
          className="px-3 py-2 border rounded w-32"
        />
        <label className="flex items-center space-x-2">
        <span>Sort by Price:</span>
        <select
          value={sort}
          onChange={handleSortChange}
          className="px-3 py-2 border rounded w-48"
        >
          <option value="default">Default</option>
          <option value="asc">Low to High</option>
          <option value="desc">High to Low</option>
        </select>
        </label>
      </div>

      {/* Products */}
      {loading ? (
        <p>Loading products...</p>
      ) : products.length === 0 ? (
        <p>No products found in this subcategory.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                className="border p-4 rounded shadow hover:shadow-lg"
              >
                <Link href={`/product/${product._id}`}>
                  <img
                    src={product.image || "/placeholder.png"}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded cursor-pointer"
                  />
                </Link>

                <div className="flex items-center justify-between mt-2">
                  <div>
                    <h2 className="text-lg font-semibold">{product.name}</h2>
                    <p>₹{product.price}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      if (
                        cartItems.some(
                          (item) => String(item.productId) === String(product._id)
                        )
                      ) {
                        toast.error(`${product.name} is already in your cart!`);
                      } else {
                        addToCart(product);
                      }
                    }}
                    className="px-3 py-1 bg-orange-500 text-white text-sm rounded hover:bg-orange-600 transition"
                  >
                    Add to Cart
                  </button>
                </div>
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
