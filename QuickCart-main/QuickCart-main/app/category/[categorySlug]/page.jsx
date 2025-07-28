'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import debounce from 'lodash.debounce';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { useAppContext } from '@/context/AppContext';

const CategoryProductsPage = () => {
  const { categorySlug } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { addToCart, cartItems } = useAppContext();

  const limit = 6;

  const fetchProducts = async (searchTerm = '') => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:3001/products`, {
        params: {
          category: categorySlug,
          search: searchTerm,
          page,
          limit,
          minPrice,
          maxPrice,
          sort: sortOrder,
        },
      });
      setProducts(response.data.products || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetch = React.useMemo(
    () => debounce((term) => fetchProducts(term), 500),
    [categorySlug, page, minPrice, maxPrice, sortOrder]
  );

  useEffect(() => {
    debouncedFetch(search);
    return () => debouncedFetch.cancel();
  }, [search, categorySlug, page, minPrice, maxPrice, sortOrder, debouncedFetch]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 capitalize">
        Products in {categorySlug?.replace(/-/g, ' ') || 'Category'}
      </h1>

      <input
        type="text"
        value={search}
        onChange={handleSearchChange}
        placeholder="Search products..."
        className="mb-4 px-4 py-2 border rounded w-full max-w-md"
      />

      <div className="flex flex-wrap gap-4 mb-6 items-center">
        <label className="flex items-center gap-2">
          Min Price:
          <input
            type="number"
            value={minPrice}
            onChange={(e) => {
              setMinPrice(e.target.value);
              setPage(1);
            }}
            className="border px-2 py-1 rounded w-24"
          />
        </label>
        <label className="flex items-center gap-2">
          Max Price:
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => {
              setMaxPrice(e.target.value);
              setPage(1);
            }}
            className="border px-2 py-1 rounded w-24"
          />
        </label>

        <label className="flex items-center gap-2">
          Sort by Price:
          <select
            value={sortOrder}
            onChange={(e) => {
              setSortOrder(e.target.value);
              setPage(1);
            }}
            className="border px-3 py-1 rounded"
          >
            <option value="">Default</option>
            <option value="asc">Low to High</option>
            <option value="desc">High to Low</option>
          </select>
        </label>
      </div>

      {loading ? (
        <p className="text-center mt-8">Loading products...</p>
      ) : products.length === 0 ? (
        <p className="text-center">No products found in this category.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                className="border rounded p-4 shadow hover:shadow-lg transition flex flex-col min-h-[420px]"
              >
                <Link href={`/product/${product._id}`} className="flex-grow block">
                  <div className="w-full h-60 flex items-center justify-center bg-white rounded overflow-hidden mb-4">
                    <img
                      src={product.image || '/placeholder.png'}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </Link>

                <div className="flex items-start justify-between mt-auto gap-4">
                  <div className="flex-1 min-w-0">
                    <h2 className="text-base font-semibold leading-tight line-clamp-2">{product.name}</h2>
                    <p className="text-sm text-gray-700 font-medium">₹{product.price}</p>
                  </div>

                  <button
                    onClick={() => {
                      if (cartItems.some(item => String(item.productId) === String(product._id))) {
                        toast.error(`${product.name} is already in your cart!`);
                      } else {
                        addToCart(product);
                      }
                    }}
                    className="flex-shrink-0 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition text-sm"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center mt-8">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Previous
            </button>

            <span>
              Page {page} of {totalPages}
            </span>

            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CategoryProductsPage;
