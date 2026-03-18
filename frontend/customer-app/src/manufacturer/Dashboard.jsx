"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { TrendingUp, ShoppingBag, DollarSign, Package, ArrowUpRight, ArrowDownRight } from "lucide-react"
import "./Dashboard.css"

const Dashboard = () => {
  const [stats, setStats] = useState({
    products: 12,
    orders: 48,
    revenue: 2840.5,
  })
  const [recentOrders, setRecentOrders] = useState([
    {
      _id: "1",
      orderId: "ORD-001",
      product: { title: "Cotton T-Shirt" },
      customer: "John Doe",
      status: "Delivered",
      amount: 29.99,
      date: "2024-01-15",
    },
    {
      _id: "2",
      orderId: "ORD-002",
      product: { title: "Premium Hoodie" },
      customer: "Sarah Smith",
      status: "In Production",
      amount: 49.99,
      date: "2024-01-14",
    },
    {
      _id: "3",
      orderId: "ORD-003",
      product: { title: "Sport Jersey" },
      customer: "Mike Johnson",
      status: "Shipped",
      amount: 34.99,
      date: "2024-01-13",
    },
    {
      _id: "4",
      orderId: "ORD-004",
      product: { title: "Denim Jacket" },
      customer: "Emily Brown",
      status: "Pending",
      amount: 79.99,
      date: "2024-01-12",
    },
  ])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) navigate("/login")
  }, [navigate])

  const statCards = [
    {
      title: "Total Products",
      value: stats.products,
      icon: Package,
      color: "#2952A1",
      bgColor: "#f0f5ff",
      trend: "+2.5%",
      trendUp: true,
    },
    {
      title: "Total Orders",
      value: stats.orders,
      icon: ShoppingBag,
      color: "#4ECDC4",
      bgColor: "#f0fffe",
      trend: "+12.5%",
      trendUp: true,
    },
    {
      title: "Total Revenue",
      value: `$${stats.revenue.toFixed(2)}`,
      icon: DollarSign,
      color: "#06B6D4",
      bgColor: "#ecfdf5",
      trend: "+8.2%",
      trendUp: true,
    },
  ]

  const statusColors = {
    Pending: "#f59e0b",
    Accepted: "#3b82f6",
    "In Production": "#8b5cf6",
    Shipped: "#06b6d4",
    Delivered: "#10b981",
    Declined: "#dc2626",
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome back! Here's your business overview.</p>
      </div>

      <div className="stats-grid">
        {statCards.map((card, index) => {
          const Icon = card.icon
          return (
            <div key={index} className="stat-card">
              <div className="stat-top">
                <div className="stat-icon" style={{ backgroundColor: card.bgColor }}>
                  <Icon size={20} color={card.color} />
                </div>
                <div className={`trend ${card.trendUp ? "up" : "down"}`}>
                  {card.trendUp ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                  {card.trend}
                </div>
              </div>
              <div className="stat-content">
                <p className="stat-title">{card.title}</p>
                <p className="stat-value">{loading ? "..." : card.value}</p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="dashboard-grid">
        <div className="section recent-orders-section">
          <div className="section-header">
            <h2>Recent Orders</h2>
            <a href="/orders" className="view-all-link">
              View All
            </a>
          </div>

          <div className="orders-mini-table">
            <div className="table-header">
              <div className="col-order">Order</div>
              <div className="col-customer">Customer</div>
              <div className="col-amount">Amount</div>
              <div className="col-status">Status</div>
            </div>
            {recentOrders.map((order) => (
              <div key={order._id} className="table-row">
                <div className="col-order">
                  <span className="order-id">{order.orderId}</span>
                </div>
                <div className="col-customer">{order.customer}</div>
                <div className="col-amount">${order.amount.toFixed(2)}</div>
                <div className="col-status">
                  <span className="status-badge" style={{ backgroundColor: statusColors[order.status] }}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="section quick-actions-section">
          <div className="section-header">
            <h2>Quick Actions</h2>
          </div>
          <div className="quick-actions">
            <a href="/products/create" className="quick-action-card">
              <div className="action-icon">
                <Package size={20} />
              </div>
              <h3>Add Product</h3>
              <p>Create new product</p>
            </a>
            <a href="/orders" className="quick-action-card">
              <div className="action-icon">
                <ShoppingBag size={20} />
              </div>
              <h3>View Orders</h3>
              <p>Manage orders</p>
            </a>
            <a href="/analytics" className="quick-action-card">
              <div className="action-icon">
                <TrendingUp size={20} />
              </div>
              <h3>Analytics</h3>
              <p>View insights</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
