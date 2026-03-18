import { useEffect, useState } from "react"
import axios from "axios"
import "./DesignerHome.css"

const DesignerHome = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}")
  const [portfolio, setPortfolio] = useState([])
  const [storeName, setStoreName] = useState("")

  useEffect(() => {
    axios.get(`http://localhost:5000/api/designer/portfolio/${user.id}`)
      .then(r => { setPortfolio(r.data.portfolio); setStoreName(r.data.storeName) })
      .catch(console.error)
  }, [])

  const published = portfolio.filter(p => p.published).length
  const drafts = portfolio.length - published

  // Mock analytics
  const stats = [
    { label: "Total Designs", value: portfolio.length, icon: "🎨", trend: "+3 this month" },
    { label: "Published", value: published, icon: "🌐", trend: "Live on store" },
    { label: "Drafts", value: drafts, icon: "📝", trend: "Awaiting publish" },
    { label: "Total Views", value: 1248, icon: "👁️", trend: "+12.5% vs last month" },
    { label: "Total Sales", value: 34, icon: "💰", trend: "$1,420 revenue" },
    { label: "Avg Rating", value: "4.8", icon: "⭐", trend: "Based on 22 reviews" },
  ]

  const recentOrders = [
    { id: "ORD-201", product: "Neon Cyber Kitty Tee", customer: "Jane Doe", status: "Pending", total: "$24.99" },
    { id: "ORD-198", product: "Retro Wave Sun Hoodie", customer: "Mike Parker", status: "Accepted", total: "$42.00" },
    { id: "ORD-195", product: "Abstract Bloom Mug", customer: "Sarah Kim", status: "Shipped", total: "$14.50" },
  ]

  const statusColor = { Pending: "#f59e0b", Accepted: "#3b82f6", Shipped: "#06b6d4", Delivered: "#22c55e", Rejected: "#ef4444" }

  return (
    <div className="ds-home">
      <div className="ds-home-header">
        <div>
          <h1>Welcome back, {user.fullName || "Designer"} 👋</h1>
          <p>{storeName || "Your Design Studio"}</p>
        </div>
      </div>

      <div className="ds-stats-grid">
        {stats.map((s, i) => (
          <div className="ds-stat-card" key={i}>
            <div className="ds-stat-icon">{s.icon}</div>
            <div className="ds-stat-info">
              <span className="ds-stat-label">{s.label}</span>
              <span className="ds-stat-value">{s.value}</span>
              <span className="ds-stat-trend">{s.trend}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="ds-home-grid">
        <div className="ds-card">
          <h3>Recent Orders</h3>
          <table className="ds-table">
            <thead><tr><th>Order</th><th>Product</th><th>Customer</th><th>Status</th><th>Total</th></tr></thead>
            <tbody>
              {recentOrders.map(o => (
                <tr key={o.id}>
                  <td className="ds-mono">{o.id}</td>
                  <td>{o.product}</td>
                  <td>{o.customer}</td>
                  <td><span className="ds-badge" style={{ background: statusColor[o.status] }}>{o.status}</span></td>
                  <td className="ds-bold">{o.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="ds-card">
          <h3>Quick Actions</h3>
          <div className="ds-quick-actions">
            <a href="/designer/canvas" className="ds-action-card"><span className="ds-action-icon">🎨</span><strong>Open Canvas</strong><p>Create a new design</p></a>
            <a href="/designer/storefront" className="ds-action-card"><span className="ds-action-icon">🏪</span><strong>Manage Store</strong><p>Update your storefront</p></a>
            <a href="/designer/orders" className="ds-action-card"><span className="ds-action-icon">📦</span><strong>View Orders</strong><p>Review incoming orders</p></a>
            <a href="/designer/analytics" className="ds-action-card"><span className="ds-action-icon">📊</span><strong>Analytics</strong><p>Track performance</p></a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DesignerHome
