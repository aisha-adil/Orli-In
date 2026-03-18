import { useState } from "react"
import "./DesignerAnalytics.css"

const DesignerAnalytics = () => {
  const [period, setPeriod] = useState("30d")

  // Mock analytics data
  const kpis = [
    { label: "Total Revenue", value: "$1,420", change: "+18.5%", positive: true },
    { label: "Total Sales", value: "34", change: "+12 this month", positive: true },
    { label: "Store Visitors", value: "1,248", change: "+22.3%", positive: true },
    { label: "Conversion Rate", value: "2.7%", change: "-0.3%", positive: false },
    { label: "Avg Order Value", value: "$41.76", change: "+$4.20", positive: true },
    { label: "Return Rate", value: "1.2%", change: "Excellent", positive: true },
  ]

  const topProducts = [
    { name: "Neon Cyber Kitty Tee", sales: 14, revenue: "$349.86", views: 342 },
    { name: "Retro Wave Sun Hoodie", sales: 8, revenue: "$336.00", views: 218 },
    { name: "Abstract Bloom Mug", sales: 6, revenue: "$87.00", views: 156 },
    { name: "Minimalist Wave Print", sales: 4, revenue: "$72.00", views: 98 },
    { name: "Cosmic Owl Poster", sales: 2, revenue: "$39.98", views: 64 },
  ]

  const monthlySales = [
    { month: "Oct", sales: 4, revenue: 160 },
    { month: "Nov", sales: 6, revenue: 240 },
    { month: "Dec", sales: 9, revenue: 420 },
    { month: "Jan", sales: 7, revenue: 310 },
    { month: "Feb", sales: 12, revenue: 540 },
    { month: "Mar", sales: 14, revenue: 620 },
  ]

  const milestones = [
    { icon: "🎉", text: "First Sale!", achieved: true },
    { icon: "🔥", text: "10 Sales", achieved: true },
    { icon: "💎", text: "25 Sales", achieved: true },
    { icon: "🚀", text: "50 Sales", achieved: false },
    { icon: "👑", text: "$1,000 Revenue", achieved: true },
    { icon: "🌟", text: "$5,000 Revenue", achieved: false },
  ]

  const maxRevenue = Math.max(...monthlySales.map(m => m.revenue))

  return (
    <div className="da-container">
      <div className="da-header">
        <div>
          <h1 className="da-title">Trend Analytics</h1>
          <p className="da-subtitle">Track your store performance and growth</p>
        </div>
        <div className="da-period-tabs">
          {["7d", "30d", "90d", "1y"].map(p => (
            <button key={p} onClick={() => setPeriod(p)} className={`da-period-btn ${period === p ? "active" : ""}`}>{p}</button>
          ))}
        </div>
      </div>

      {/* KPIs */}
      <div className="da-kpi-grid">
        {kpis.map((k, i) => (
          <div key={i} className="da-kpi-card">
            <span className="da-kpi-label">{k.label}</span>
            <span className="da-kpi-value">{k.value}</span>
            <span className={`da-kpi-change ${k.positive ? "positive" : "negative"}`}>{k.change}</span>
          </div>
        ))}
      </div>

      <div className="da-grid-2">
        {/* Revenue chart (CSS bar chart) */}
        <div className="da-card">
          <h3>Monthly Revenue</h3>
          <div className="da-bar-chart">
            {monthlySales.map((m, i) => (
              <div key={i} className="da-bar-col">
                <div className="da-bar" style={{ height: `${(m.revenue / maxRevenue) * 160}px` }}>
                  <span className="da-bar-val">${m.revenue}</span>
                </div>
                <span className="da-bar-label">{m.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Milestones */}
        <div className="da-card">
          <h3>Milestones</h3>
          <div className="da-milestones">
            {milestones.map((m, i) => (
              <div key={i} className={`da-milestone ${m.achieved ? "achieved" : "locked"}`}>
                <span className="da-milestone-icon">{m.icon}</span>
                <span className="da-milestone-text">{m.text}</span>
                {m.achieved ? <span className="da-milestone-check">✓</span> : <span className="da-milestone-lock">🔒</span>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Products Table */}
      <div className="da-card">
        <h3>Top Selling Products</h3>
        <table className="da-table">
          <thead>
            <tr><th>#</th><th>Product</th><th>Sales</th><th>Revenue</th><th>Views</th><th>Conv. Rate</th></tr>
          </thead>
          <tbody>
            {topProducts.map((p, i) => (
              <tr key={i}>
                <td className="da-rank">{i + 1}</td>
                <td className="da-product-name">{p.name}</td>
                <td>{p.sales}</td>
                <td className="da-bold">{p.revenue}</td>
                <td>{p.views}</td>
                <td>{((p.sales / p.views) * 100).toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default DesignerAnalytics
