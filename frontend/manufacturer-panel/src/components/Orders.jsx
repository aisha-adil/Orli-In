"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "./Orders.css"

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      navigate("/login")
      return
    }
    fetchOrders()
  }, [navigate])

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("http://localhost:5000/api/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await response.json()
      setOrders(data)
    } catch (err) {
      console.error("Failed to fetch orders:", err)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (orderId, status) => {
    try {
      const token = localStorage.getItem("token")
      await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      })
      setOrders(orders.map((o) => (o._id === orderId ? { ...o, status } : o)))
    } catch (err) {
      console.error("Failed to update status:", err)
    }
  }

  const statusColors = {
    Pending: "#f59e0b",
    Accepted: "#3b82f6",
    "In Production": "#8b5cf6",
    Shipped: "#06b6d4",
    Delivered: "#10b981",
    Declined: "#dc2626",
  }

  return (
    <div className="orders">
      <div className="orders-header">
        <h1>Orders</h1>
        <p>Manage and track all customer orders</p>
      </div>

      {loading ? (
        <div className="loading">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="empty-state">
          <p>No orders yet</p>
        </div>
      ) : (
        <div className="orders-table-container">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Product</th>
                <th>Customer</th>
                <th>Variant</th>
                <th>Quantity</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td className="order-id">{order._id.slice(-8).toUpperCase()}</td>
                  <td className="product-name">{order.product?.title}</td>
                  <td className="customer-name">{order.customerInfo?.name}</td>
                  <td className="variant">{order.selectedVariant?.color} - {order.selectedVariant?.size}</td>
                  <td className="quantity">{order.quantity}</td>
                  <td className="amount">${order.orderTotal?.toFixed(2)}</td>
                  <td>
                    <span className="status-badge" style={{ backgroundColor: statusColors[order.status] }}>
                      {order.status}
                    </span>
                  </td>
                  <td className="date">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order._id, e.target.value)}
                      className="status-select"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Accepted">Accepted</option>
                      <option value="In Production">In Production</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Declined">Declined</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default Orders
