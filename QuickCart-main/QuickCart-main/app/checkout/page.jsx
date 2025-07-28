"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/context/AppContext";

const CheckoutPage = () => {
  const router = useRouter();
  const { cartItems, cartProducts, getCartAmount, clearCart } = useAppContext();

  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
    phone: "",
    paymentMode: "cod",
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!document.getElementById("razorpay-script")) {
      const script = document.createElement("script");
      script.id = "razorpay-script";
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  if (cartItems.length === 0) {
    return (
      <div className="p-8 text-center">
        <h2>Your cart is empty. Please add items before checkout.</h2>
      </div>
    );
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const placeOrder = async () => {
  // Filter cart items to only those with valid product id and quantity > 0
  const filteredCartItems = cartItems
    .filter(item => item.productId && item.quantity > 0)
    .map(item => ({
      product: item.productId,
      quantity: item.quantity,
    }));

  if (filteredCartItems.length === 0) {
    alert("Your cart is empty or contains invalid items.");
    setSubmitting(false);
    return;
  }

  const orderData = {
    name: form.name,
    email: form.email,
    address: form.address,
    city: form.city,
    postalCode: form.postalCode,
    phone: form.phone,
    cartItems: filteredCartItems,
  };

  console.log("Sending order data:", orderData);

  try {
    const res = await fetch("http://localhost:3001/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Failed to place order");
    }

    const data = await res.json();
    clearCart(); // Clear cart after successful order
    alert("Order placed successfully! Your order ID: " + data.orderId);
    router.push("/order-success");
  } catch (error) {
    alert(error.message);
    setSubmitting(false);
  }
};


  const handleSubmit = async (e) => {
    e.preventDefault();

    for (const key in form) {
      if (!form[key]) {
        alert(`Please enter your ${key}`);
        return;
      }
    }

    setSubmitting(true);

    try {
      if (form.paymentMode === "cod") {
        await placeOrder();
        setSubmitting(false);
        return;
      }

      const amountInPaise = Math.round(getCartAmount() * 100);

      const createOrderRes = await fetch("http://localhost:3001/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: amountInPaise }),
      });

      const createOrderData = await createOrderRes.json();

      if (!createOrderRes.ok) throw new Error(createOrderData.error || "Failed to create order");

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: createOrderData.amount,
        currency: createOrderData.currency,
        order_id: createOrderData.id,
        name: "QuickCart",
        description: "Purchase",
        handler: async function (response) {
          const verifyRes = await fetch("http://localhost:3001/api/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response),
          });
          const verifyData = await verifyRes.json();

          if (verifyRes.ok && verifyData.status === "success") {
            await placeOrder();
          } else {
            alert("Payment verification failed. Please try again.");
            setSubmitting(false);
          }
        },
        prefill: {
          name: form.name,
          email: form.email,
          contact: form.phone,
        },
        theme: {
          color: "#3399cc",
        },
        method: {
          netbanking: true,
          card: true,
          upi: true,
          wallet: true,
          emi: true,
          paylater: true,
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      alert(error.message);
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 mt-10 flex flex-col lg:flex-row gap-8 items-start">
      <div className="flex-1 bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-semibold mb-6">Checkout</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
          <textarea
            name="address"
            placeholder="Shipping Address"
            value={form.address}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            rows={3}
            required
          />
          <input
            type="text"
            name="city"
            placeholder="City"
            value={form.city}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
          <input
            type="text"
            name="postalCode"
            placeholder="Postal Code"
            value={form.postalCode}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />

          <div>
            <p className="mb-2 font-semibold">Payment Mode:</p>
            <label className="mr-4 cursor-pointer">
              <input
                type="radio"
                name="paymentMode"
                value="cod"
                checked={form.paymentMode === "cod"}
                onChange={handleChange}
              />{" "}
              Cash on Delivery
            </label>
            <label className="cursor-pointer">
              <input
                type="radio"
                name="paymentMode"
                value="upi"
                checked={form.paymentMode === "upi"}
                onChange={handleChange}
              />{" "}
              UPI / Online Payment
            </label>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition sticky bottom-0"
          >
            {submitting ? "Processing..." : "Place Order"}
          </button>
        </form>
      </div>

      <div className="w-96 bg-white p-6 rounded shadow flex flex-col">
        <h2 className="text-xl font-semibold mb-4">Your Cart</h2>
        <div className="flex-1 overflow-y-auto">
          {cartProducts.filter((product) => {
            const foundItem = cartItems.find(item => item.productId === product._id);
            return foundItem && foundItem.quantity > 0;
          }).length === 0 ? (
            <p>No items in cart</p>
          ) : (
            <ul>
              {cartProducts
                .filter((product) => {
                  const foundItem = cartItems.find(item => item.productId === product._id);
                  return foundItem && foundItem.quantity > 0;
                })
                .map((product) => {
                  const item = cartItems.find(item => item.productId === product._id);
                  const qty = item ? item.quantity : 0;
                  const price = product.offerPrice || product.price || 0;
                  return (
                    <li key={product._id} className="flex justify-between py-2 border-b">
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-gray-600">Qty: {qty}</p>
                      </div>
                      <div>₹{(price * qty).toFixed(2)}</div>
                    </li>
                  );
                })}
            </ul>
          )}
        </div>

        <div className="mt-4 pt-4 border-t font-semibold text-lg flex justify-between">
          <span>Total:</span>
          <span>₹{getCartAmount().toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
