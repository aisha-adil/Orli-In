"use client"

import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  BarChart3,
  LogOut,
  ChevronLeft,
  ChevronRight
} from "lucide-react"

import "./Layout.css"
import Logo from "../assets/Logo.png"

const AppLayout = ({ children }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const manufacturer = JSON.parse(localStorage.getItem("manufacturer") || "{}")

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("manufacturer")
    navigate("/login")
  }

  const menuItems = [
    { path: "/manufacturer", label: "Dashboard", icon: LayoutDashboard },
    { path: "/manufacturer/products", label: "Products", icon: Package },
    { path: "/manufacturer/orders", label: "Orders", icon: ShoppingCart },
    { path: "/manufacturer/analytics", label: "Analytics", icon: BarChart3 },
  ]

  return (
    <div className="layout">

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "expanded" : "collapsed"}`}>

        {/* Logo (stays same size) */}
        <div className="sidebar-logo">
          <img src={Logo} alt="Logo" className="sidebar-logo-img" />
        </div>

        {/* Center Toggle Button */}
        <button
          className="sidebar-toggle-btn"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>

        {/* Nav Items */}
        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${isActive ? "active" : ""}`}
                title={!sidebarOpen ? item.label : ""}
              >
                <Icon size={20} />
                <span className="nav-label">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Logout Button */}
        <div className="sidebar-footer">
          <button className="logout-btn-sidebar" onClick={handleLogout}>
            <LogOut size={18} />
            <span className="nav-label">Logout</span>
          </button>
        </div>

      </aside>

      {/* Content */}
      <main className="main-content">
        {children}
      </main>
    </div>
  )
}

export default AppLayout
