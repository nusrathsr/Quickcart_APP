"use client";
import React, { useEffect, useState } from "react";
import { useAppContext } from "@/context/AppContext";

const OrdersPage = () => {
  const { user } = useAppContext();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!user?.email) return;

    const fetchOrders = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/orders/user/${user.email}`);
        const data = await res.json();
        setOrders(data);
      } catch (error) {
        console.error("Failed to fetch orders", error);
      }
    };

    fetchOrders();
  }, [user?.email]);

  if (!user)
    return (
      <div className="text-center mt-10 text-gray-600">
        Please login to view your orders.
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto mt-10 px-6">
      {/* User Info */}
      <div className="mb-10 p-6 bg-blue-50 border border-blue-200 rounded-xl shadow-sm">
        <h2 className="text-2xl font-bold mb-4 text-blue-700">User Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
          <p>
            <span className="font-semibold">Name:</span> {user.name}
          </p>
          <p>
            <span className="font-semibold">Email:</span> {user.email}
          </p>
          <p>
            <span className="font-semibold">Address:</span> {user.address || "Not provided"}
          </p>
        </div>
      </div>

      {/* Orders Table */}
      <h1 className="text-3xl font-bold mb-6 text-gray-800">My Orders</h1>
      {orders.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">No orders found.</p>
      ) : (
        <div className="overflow-x-auto shadow rounded-lg border border-gray-200">
          <table className="min-w-full bg-white text-sm text-left text-gray-700">
            <thead className="text-xs uppercase bg-gray-100 text-gray-600">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Items</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Payment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order, i) => {
                const total = order.cartItems?.reduce((acc, item) => {
                  const price = Number(item.price) || 0;
                  const qty = Number(item.quantity) || 0;
                  return acc + price * qty;
                }, 0);

                return (
                  <tr
                    key={order._id}
                    className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="px-6 py-4 font-mono text-xs">{order._id}</td>
                    <td className="px-6 py-4">{new Date(order.createdAt).toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <ul className="space-y-1">
                        {order.cartItems?.length > 0 ? (
                          order.cartItems.map((item, idx) => (
                            <li key={idx}>
                              {item.name} × {item.quantity} = ₹{(item.price * item.quantity).toFixed(2)}
                            </li>
                          ))
                        ) : (
                          <li>No items</li>
                        )}
                      </ul>
                    </td>
                    <td className="px-6 py-4 font-semibold text-green-700">
                      ₹{total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs">
                        {order.status?.name || "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs ${order.paymentStatus?.name === "Paid"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                          }`}
                      >
                        {order.paymentStatus?.name || "Unknown"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>

          </table>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
