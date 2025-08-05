"use client";
import { useEffect, useState } from "react";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import Link from "next/link";

const AllProductsPage = () => {
  const { addToCart, cartItems } = useAppContext();

  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Toast states
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const loadProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const query = new URLSearchParams({
        search: searchTerm,
        page: page.toString(),
        limit: "12",
      });
      const res = await fetch(`http://localhost:3001/api/products?${query.toString()}`);

      if (!res.ok) {
        // Extract error message from backend if available
        let errorMsg = `Failed to fetch products: ${res.status}`;
        try {
          const errorData = await res.json();
          if (errorData.message) errorMsg = errorData.message;
        } catch {}
        setError(errorMsg);
        setProducts([]);
        setTotalPages(1);
        setLoading(false);
        return;
      }

      const data = await res.json();

      if (Array.isArray(data.products)) {
        setProducts(data.products);
        setTotalPages(data.totalPages || 1);
      } else {
        setError("Invalid response format from server");
        setProducts([]);
        setTotalPages(1);
      }
    } catch (err) {
      setError("Network error: Failed to fetch products");
      setProducts([]);
      setTotalPages(1);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadProducts();
  }, [searchTerm, page]);

  // Auto-hide toast after 2.5 seconds
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 2500);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const handleAddToCart = (product) => {
  if (!product || !product._id) {
    setToastMessage("Invalid product");
    setShowToast(true);
    return;
  }
  const alreadyInCart = cartItems.some(
    (item) => String(item.productId) === String(product._id)
  );
  if (alreadyInCart) {
    setToastMessage("Item is already in your cart");
    setShowToast(true);
    return;
  }
  addToCart(product, 1);
  setToastMessage("Product added to cart");
  setShowToast(true);
};


  return (
    <div className="px-6 md:px-16 lg:px-32 py-10 relative">
      {/* Toast notification at top center */}
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

      <h1 className="text-3xl font-semibold mb-6">Shop All Products</h1>

      <input
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setPage(1); // reset to first page when search changes
        }}
        className="mb-6 p-2 border rounded w-full max-w-md"
      />

      {loading && <p className="mb-4 text-center">Loading products...</p>}
      {error && (
        <p className="mb-4 text-center text-red-600 font-semibold">{error}</p>
      )}

      {!loading && !error && products.length === 0 && (
        <p className="mb-4 text-center">No products found.</p>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product, index) => (
          <div key={product._id} className="border rounded shadow p-4 flex flex-col">
            <Link href={`/product/${product._id}`}>
              <Image
                src={product.image}
                alt={product.name}
                width={300}
                height={200}
                className="rounded object-cover w-full h-48"
                priority={index === 0}
              />
              <h2 className="mt-2 text-lg font-semibold">{product.name}</h2>
            </Link>
            <p className="text-orange-500 font-bold mt-1">₹{product.price}</p>
            <button
              onClick={() => handleAddToCart(product)}
              className="mt-auto w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-center items-center gap-4 mt-8">
        <button
          disabled={page <= 1}
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Previous
        </button>

        <span>
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page >= totalPages}
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AllProductsPage;
