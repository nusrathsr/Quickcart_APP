import React, { useEffect, useState } from 'react';
import axios from 'axios';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [orderStatuses, setOrderStatuses] = useState([]);
  const [paymentStatuses, setPaymentStatuses] = useState([]);

  useEffect(() => {
    fetchOrders();
    fetchOrderStatuses();
    fetchPaymentStatuses();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/orders');
      setOrders(res.data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    }
  };

  const fetchOrderStatuses = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/order-statuses');
      setOrderStatuses(res.data);
    } catch (error) {
      console.error('Failed to fetch order statuses:', error);
    }
  };

  const fetchPaymentStatuses = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/payment-statuses');
      setPaymentStatuses(res.data);
    } catch (error) {
      console.error('Failed to fetch payment statuses:', error);
    }
  };

  const handleStatusChange = async (orderId, statusId) => {
    try {
      await axios.put(`http://localhost:3001/api/orders/${orderId}/status`, { statusId });
      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handlePaymentStatusChange = async (orderId, paymentStatusId) => {
    try {
      await axios.put(`http://localhost:3001/api/orders/${orderId}/payment-status`, { paymentStatusId });
      fetchOrders();
    } catch (error) {
      console.error('Error updating payment status:', error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Orders</h2>
      
      <div className="overflow-x-auto w-full">
        <table className="min-w-[1200px] border-collapse border border-gray-300 bg-white shadow-md rounded">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2 text-left">Customer Name</th>
              <th className="border p-2 text-left">Email</th>
              <th className="border p-2 text-left">Address</th>
              <th className="border p-2 text-left">Phone</th>
              <th className="border p-2 text-left">Items</th>
              <th className="border p-2 text-left">Date</th>
              <th className="border p-2 text-left">Order Status</th>
              <th className="border p-2 text-left">Payment Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="border-t hover:bg-gray-50">
                <td className="border p-2">{order.name}</td>
                <td className="border p-2">{order.email}</td>
                <td className="border p-2">
                  {order.address || 'Not Provided'}, {order.city} {order.postalCode}
                </td>
                <td className="border p-2">{order.phone}</td>
                <td className="border p-2">
                  <ul className="list-disc ml-4">
                    {order.cartItems.map((item, i) => {
                      const price = Number(item.price) || 0;
                      const quantity = Number(item.quantity) || 0;
                      return (
                        <li key={i}>
                          {item.name || 'Product'} × {quantity} = ₹{(price * quantity).toFixed(2)}
                        </li>
                      );
                    })}
                  </ul>
                  <div className="mt-2 font-semibold">
                    Total: ₹
                    {order.cartItems
                      .reduce((acc, item) => acc + (Number(item.price) || 0) * (Number(item.quantity) || 0), 0)
                      .toFixed(2)}
                  </div>
                </td>
                <td className="border p-2">{new Date(order.createdAt).toLocaleString()}</td>
                <td className="border p-2">
                  <select
                    value={order.status?._id || ''}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    className="border px-2 py-1 rounded"
                  >
                    {orderStatuses.map((status) => (
                      <option key={status._id} value={status._id}>
                        {status.name}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="border p-2">
                  <select
                    value={order.paymentStatus?._id || ''}
                    onChange={(e) => handlePaymentStatusChange(order._id, e.target.value)}
                    className="border px-2 py-1 rounded"
                  >
                    {paymentStatuses.map((status) => (
                      <option key={status._id} value={status._id}>
                        {status.name}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderList;
