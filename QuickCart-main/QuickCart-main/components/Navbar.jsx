"use client";
import React, { useState, useRef, useEffect } from "react";
import { useAppContext } from "@/context/AppContext";
import { useRouter } from 'next/navigation';  // <-- import router
import { assets } from "@/assets/assets";
import Image from "next/image";
import Link from "next/link";
import Swal from 'sweetalert2';

const Navbar = () => {
  const router = useRouter();  // <-- get router here
  const { getCartCount } = useAppContext();  // <-- getCartCount from context

  const [showDropdown, setShowDropdown] = useState(false);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [user, setUser] = useState(null);
  const [toast, setToast] = useState(null);

  const dropdownRef = useRef();
  const accountDropdownRef = useRef();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    setUser(storedUser ? JSON.parse(storedUser) : null);
  }, []);

  const handleLogout = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will be logged out.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, logout'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setUser(null);
        Swal.fire('Logged out!', 'You have been logged out.', 'success').then(() => {
          router.push("/login");
        });
      }
    });
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
      if (accountDropdownRef.current && !accountDropdownRef.current.contains(e.target)) {
        setShowAccountDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Listen for product added event to show toast
  useEffect(() => {
    const handleProductAdded = () => {
      setToast("Product added to cart");
      setTimeout(() => setToast(null), 2500);
    };
    window.addEventListener("product-added", handleProductAdded);
    return () => window.removeEventListener("product-added", handleProductAdded);
  }, []);

  return (
    <>
      <nav className="flex items-center justify-between px-6 md:px-16 lg:px-32 py-3 border-b border-gray-300 text-gray-700">
        <Image
          src={assets.logo}
          alt="logo"
          width={112}
          style={{ height: "auto", cursor: "pointer" }}
          onClick={() => router.push("/")}
        />

        <div className="flex items-center gap-4 lg:gap-8 max-md:hidden">
          <Link href="/" className="hover:text-gray-900 transition no-underline">
            Home
          </Link>
          <Link href="/all-products" className="hover:text-gray-900 transition no-underline">
            Shop
          </Link>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="hover:text-gray-900 transition no-underline"
            >
              Categories ▾
            </button>
            {showDropdown && (
              <div className="absolute bg-white shadow-lg mt-2 rounded z-50">
                {[
                  { name: "Furniture", slug: "furniture" },
                  { name: "Beauty and Health", slug: "beauty-and-health" },
                  { name: "Smartphones", slug: "smartphones" },
                  { name: "Men's Fashion", slug: "men's-fashion" },
                  { name: "Women's Fashion", slug: "women's-fashion" },
                  { name: "Groceries", slug: "groceries" },
                  { name: "Kitchen Appliances", slug: "kitchen-appliances" },
                  { name: "Pet Supplies", slug: "pet-supplies" },
                ].map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/category/${cat.slug}`}
                    className="block px-4 py-2 hover:bg-gray-100 whitespace-nowrap no-underline"
                    onClick={() => setShowDropdown(false)}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link href="/" className="hover:text-gray-900 transition no-underline">
            About Us
          </Link>
          <Link href="/" className="hover:text-gray-900 transition no-underline">
            Contact
          </Link>
        </div>

        <Link href="/cart" className="relative flex items-center gap-1 hover:text-gray-900 no-underline">
          <Image src={assets.cart_icon} alt="Cart" width={22} height={22} />
          <span className="text-sm text-orange-500 font-semibold">({getCartCount()})</span>
        </Link>

        <div className="hidden md:flex items-center gap-4 relative" ref={accountDropdownRef}>
          <Image src={assets.search_icon} alt="Search icon" width={16} height={16} />
          <button
            onClick={() => setShowAccountDropdown(!showAccountDropdown)}
            className="flex items-center gap-2 hover:text-gray-900 transition no-underline"
          >
            <Image src={assets.user_icon} alt="User icon" width={20} height={20} />
            {user ? `${user.name} ▾` : "Account ▾"}
          </button>

          {showAccountDropdown && (
            <div className="absolute right-0 mt-10 bg-white rounded shadow-lg z-50 min-w-[150px]">
              {user ? (
                <>
                  <Link href="/orders">
                    <div
                      className="block px-4 py-2 hover:bg-gray-100 no-underline"
                      onClick={() => setShowAccountDropdown(false)}
                    >
                      My Orders
                    </div>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="block px-4 py-2 hover:bg-gray-100 no-underline"
                    onClick={() => setShowAccountDropdown(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="block px-4 py-2 hover:bg-gray-100 no-underline"
                    onClick={() => setShowAccountDropdown(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          )}

        </div>
      </nav>

      {toast && (
        <div
          style={{
            position: "fixed",
            top: "60px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "rgba(0,0,0,0.8)",
            color: "white",
            padding: "8px 16px",
            borderRadius: "6px",
            zIndex: 9999,
            userSelect: "none",
          }}
        >
          {toast}
        </div>
      )}
    </>
  );
};

export default Navbar;
