import { useState } from "react"
import "./DesignerOrders.css"

const DesignerOrders = () => {
  const [orders, setOrders] = useState([
    { id: "ORD-201", product: "Neon Cyber Kitty Tee", customer: "Jane Doe", email: "jane@example.com", qty: 2, total: 49.98, date: "2026-03-17", status: "Pending", note: "Can I get it in blue?" },
    { id: "ORD-198", product: "Retro Wave Sun Hoodie", customer: "Mike Parker", email: "mike@example.com", qty: 1, total: 42.00, date: "2026-03-15", status: "Accepted", note: "" },
    { id: "ORD-195", product: "Abstract Bloom Mug", customer: "Sarah Kim", email: "sarah@example.com", qty: 3, total: 43.50, date: "2026-03-12", status: "Shipped", note: "Gift wrap please" },
    { id: "ORD-190", product: "Minimalist Wave Print", customer: "Alex Brown", email: "alex@example.com", qty: 1, total: 18.00, date: "2026-03-10", status: "Delivered", note: "" },
    { id: "ORD-188", product: "Neon Cyber Kitty Poster", customer: "Emily Chen", email: "emily@example.com", qty: 1, total: 24.99, date: "2026-03-08", status: "Rejected", note: "Out of stock" },
  ])

  const [filter, setFilter] = useState("All")

  const updateStatus = (id, newStatus) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o))
  }

  const statusColor = { Pending: "#f59e0b", Accepted: "#3b82f6", Shipped: "#06b6d4", Delivered: "#22c55e", Rejected: "#ef4444" }
  const filtered = filter === "All" ? orders : orders.filter(o => o.status === filter)

  return (
    <div className="do-container">
      <h1 className="do-title">Order Management</h1>
      <p className="do-subtitle">Review and manage customer orders for your designs.</p>

      {/* Stats */}
      <div className="do-stats">
        {["All", "Pending", "Accepted", "Shipped", "Delivered", "Rejected"].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`do-filter-btn ${filter === f ? "active" : ""}`}>
            {f} ({f === "All" ? orders.length : orders.filter(o => o.status === f).length})
          </button>
        ))}
      </div>

      {/* Orders */}
      <div className="do-orders">
        {filtered.length === 0 ? (
          <p className="do-empty">No orders matching this filter.</p>
        ) : (
          filtered.map(order => (
            <div key={order.id} className="do-order-card">
              <div className="do-order-header">
                <div>
                  <span className="do-order-id">{order.id}</span>
                  <span className="do-order-date">{order.date}</span>
                </div>
                <span className="do-badge" style={{ background: statusColor[order.status] }}>{order.status}</span>
              </div>
              <div className="do-order-body">
                <div className="do-order-info">
                  <h4>{order.product}</h4>
                  <p>Customer: <strong>{order.customer}</strong> ({order.email})</p>
                  <p>Qty: {order.qty} • Total: <strong>${order.total.toFixed(2)}</strong></p>
                  {order.note && <p className="do-note">💬 "{order.note}"</p>}
                </div>
                <div className="do-order-actions">
                  {order.status === "Pending" && (
                    <>
                      <button onClick={() => updateStatus(order.id, "Accepted")} className="do-accept-btn">✓ Accept</button>
                      <button onClick={() => updateStatus(order.id, "Rejected")} className="do-reject-btn">✕ Reject</button>
                    </>
                  )}
                  {order.status === "Accepted" && (
                    <button onClick={() => updateStatus(order.id, "Shipped")} className="do-ship-btn">📦 Mark Shipped</button>
                  )}
                  {order.status === "Shipped" && (
                    <button onClick={() => updateStatus(order.id, "Delivered")} className="do-deliver-btn">✓ Mark Delivered</button>
                  )}
                  {(order.status === "Delivered" || order.status === "Rejected") && (
                    <span className="do-final-status">Final</span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default DesignerOrders
