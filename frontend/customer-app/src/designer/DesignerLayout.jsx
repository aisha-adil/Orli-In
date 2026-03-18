import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import {
  LayoutDashboard,
  Palette,
  FolderOpen,
  Store,
  ShoppingCart,
  BarChart3,
  LogOut,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import "./DesignerLayout.css"
import Logo from "../assets/Logo.png"

const DesignerLayout = ({ children }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const handleLogout = () => {
    localStorage.clear()
    navigate("/login")
  }

  const menuItems = [
    { path: "/designer", label: "Dashboard", icon: LayoutDashboard },
    { path: "/designer/canvas", label: "Design Canvas", icon: Palette },
    { path: "/designer/portfolio", label: "Portfolio", icon: FolderOpen },
    { path: "/designer/storefront", label: "Storefront", icon: Store },
    { path: "/designer/orders", label: "Orders", icon: ShoppingCart },
    { path: "/designer/analytics", label: "Analytics", icon: BarChart3 },
  ]

  return (
    <div className="ds-layout">
      <aside className={`ds-sidebar ${sidebarOpen ? "expanded" : "collapsed"}`}>
        <div className="ds-sidebar-logo">
          <img src={Logo} alt="Logo" className="ds-sidebar-logo-img" />
        </div>
        <button className="ds-sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
        <nav className="ds-sidebar-nav">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <Link key={item.path} to={item.path} className={`ds-nav-item ${isActive ? "active" : ""}`} title={!sidebarOpen ? item.label : ""}>
                <Icon size={20} />
                <span className="ds-nav-label">{item.label}</span>
              </Link>
            )
          })}
        </nav>
        <div className="ds-sidebar-footer">
          <button className="ds-logout-btn" onClick={handleLogout}>
            <LogOut size={18} />
            <span className="ds-nav-label">Logout</span>
          </button>
        </div>
      </aside>
      <main className="ds-main-content">{children}</main>
    </div>
  )
}

export default DesignerLayout
