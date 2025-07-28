"use client";

import Link from "next/link";

const OrderSuccessPage = () => {
  return (
    <div className="max-w-xl mx-auto p-8 text-center">
      <h1 className="text-3xl font-bold mb-4">Thank you for your order!</h1>
      <p>Your order has been placed successfully.</p>
      <Link href="/">
        <button className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Continue Shopping
        </button>
      </Link>
    </div>
  );
};

export default OrderSuccessPage;
