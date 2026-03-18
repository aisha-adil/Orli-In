"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import CustomCalendar from "./CustomCalendar"
import "./Analytics.css"

const Analytics = () => {
  const [showCalendar, setShowCalendar] = useState(false)
  const [dateRange, setDateRange] = useState({
    start: "2024-01-01",
    end: "2024-01-15",
  })
  const [trends, setTrends] = useState([
    { date: "01/01", revenue: 2400, orders: 24 },
    { date: "01/02", revenue: 1398, orders: 13 },
    { date: "01/03", revenue: 2800, orders: 28 },
    { date: "01/04", revenue: 3908, orders: 39 },
    { date: "01/05", revenue: 4800, orders: 48 },
    { date: "01/06", revenue: 3800, orders: 38 },
    { date: "01/07", revenue: 4300, orders: 43 },
    { date: "01/08", revenue: 5100, orders: 51 },
    { date: "01/09", revenue: 3200, orders: 32 },
    { date: "01/10", revenue: 4600, orders: 46 },
    { date: "01/11", revenue: 5800, orders: 58 },
    { date: "01/12", revenue: 4200, orders: 42 },
    { date: "01/13", revenue: 5900, orders: 59 },
    { date: "01/14", revenue: 6200, orders: 62 },
    { date: "01/15", revenue: 5400, orders: 54 },
  ])
  const [topProducts, setTopProducts] = useState([
    { title: "Premium Cotton T-Shirt", revenue: 4500, orders: 150 },
    { title: "Classic Hoodie", revenue: 3800, orders: 76 },
    { title: "Sport Jersey", revenue: 2900, orders: 85 },
    { title: "Denim Jacket", revenue: 3200, orders: 40 },
    { title: "Cotton Polo", revenue: 2100, orders: 70 },
  ])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) navigate("/login")
  }, [navigate])

  const handleDateRangeChange = (startDate, endDate) => {
    const start = startDate.toISOString().split("T")[0]
    const end = endDate.toISOString().split("T")[0]
    setDateRange({ start, end })
    setShowCalendar(false)
  }

  return (
    <div className="analytics">
      <div className="analytics-header">
        <div>
          <h1>Analytics & Insights</h1>
          <p>Track your sales performance and product insights</p>
        </div>
        <div className="date-range-wrapper">
          <button className="date-range-button" onClick={() => setShowCalendar(!showCalendar)}>
            {dateRange.start} to {dateRange.end}
          </button>
          {showCalendar && (
            <div className="calendar-dropdown">
              <CustomCalendar onDateRangeChange={handleDateRangeChange} />
            </div>
          )}
        </div>
      </div>

      <div className="charts-grid">
        {/* Sales Trends */}
        <div className="chart-card">
          <div className="chart-header">
            <h2>Revenue Trend</h2>
            <p>Daily revenue performance</p>
          </div>
          {loading ? (
            <div className="chart-loading">Loading...</div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={trends} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2952A1" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#2952A1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" vertical={false} />
                <XAxis dataKey="date" stroke="#999999" style={{ fontSize: "12px" }} />
                <YAxis stroke="#999999" style={{ fontSize: "12px" }} />
                <Tooltip
                  contentStyle={{
                    background: "white",
                    border: "1px solid #e5e5e5",
                    borderRadius: "8px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  }}
                  labelStyle={{ color: "#333" }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#2952A1"
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                  strokeWidth={2}
                  name="Revenue ($)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Orders Trend */}
        <div className="chart-card">
          <div className="chart-header">
            <h2>Orders Trend</h2>
            <p>Daily order count</p>
          </div>
          {loading ? (
            <div className="chart-loading">Loading...</div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={trends} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" vertical={false} />
                <XAxis dataKey="date" stroke="#999999" style={{ fontSize: "12px" }} />
                <YAxis stroke="#999999" style={{ fontSize: "12px" }} />
                <Tooltip
                  contentStyle={{
                    background: "white",
                    border: "1px solid #e5e5e5",
                    borderRadius: "8px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  }}
                  labelStyle={{ color: "#333" }}
                />
                <Bar dataKey="orders" fill="#4ECDC4" radius={[8, 8, 0, 0]} name="Orders" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="charts-grid">
        {/* Top Products */}
        <div className="chart-card full-width">
          <div className="chart-header">
            <h2>Top Products by Revenue</h2>
            <p>Best performing products</p>
          </div>
          {loading ? (
            <div className="chart-loading">Loading...</div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topProducts} layout="vertical" margin={{ top: 5, right: 30, left: 180, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                <XAxis type="number" stroke="#999999" style={{ fontSize: "12px" }} />
                <YAxis dataKey="title" type="category" stroke="#999999" style={{ fontSize: "12px" }} width={170} />
                <Tooltip
                  contentStyle={{
                    background: "white",
                    border: "1px solid #e5e5e5",
                    borderRadius: "8px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  }}
                  labelStyle={{ color: "#333" }}
                />
                <Bar dataKey="revenue" fill="#2952A1" radius={[0, 8, 8, 0]} name="Revenue ($)" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-label">Total Revenue</div>
          <div className="metric-value">$64,100</div>
          <div className="metric-change positive">
            <span>↑ 12.5%</span> from last period
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Total Orders</div>
          <div className="metric-value">623</div>
          <div className="metric-change positive">
            <span>↑ 8.3%</span> from last period
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Avg Order Value</div>
          <div className="metric-value">$102.89</div>
          <div className="metric-change positive">
            <span>↑ 3.2%</span> from last period
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Conversion Rate</div>
          <div className="metric-value">4.2%</div>
          <div className="metric-change negative">
            <span>↓ 0.8%</span> from last period
          </div>
        </div>
      </div>
    </div>
  )
}

export default Analytics
