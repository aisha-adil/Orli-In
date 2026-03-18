import React from "react";
import { Link } from "react-router-dom";

export default function Orders() {
  // Mock orders from localStorage for demo
  const mockOrders = [
    { id: "ORD-1042", product: "Premium Cotton T-Shirt", date: "2026-03-15", status: "Shipped", total: 15.00 },
    { id: "ORD-1038", product: "Classic Hoodie", date: "2026-03-10", status: "Delivered", total: 25.00 },
    { id: "ORD-1035", product: "Minimalist Mug", date: "2026-03-05", status: "Delivered", total: 12.00 },
  ];

  const statusColors = { Pending: "#f59e0b", Shipped: "#3b82f6", Delivered: "#22c55e", Cancelled: "#ef4444" };

  return (
    <div style={{ padding: "40px 5%", fontFamily: '"Poppins", sans-serif', maxWidth: "900px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "2rem", color: "#1a1a1a", marginBottom: "8px" }}>My Orders</h1>
      <p style={{ color: "#666", marginBottom: "32px" }}>Track and manage your purchases.</p>

      {mockOrders.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <p style={{ color: "#666", fontSize: "1.1rem", marginBottom: "16px" }}>No orders yet.</p>
          <Link to="/shop" style={{ padding: "12px 24px", background: "#1a1a1a", color: "#fff", textDecoration: "none", borderRadius: "8px" }}>Start Shopping</Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {mockOrders.map(order => (
            <div key={order.id} style={{ background: "#fff", border: "1px solid #e5e5e5", borderRadius: "12px", padding: "24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
              <div>
                <h3 style={{ margin: "0 0 4px", fontSize: "1.1rem" }}>{order.product}</h3>
                <p style={{ margin: 0, color: "#999", fontSize: "0.85rem" }}>Order {order.id} • {order.date}</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <span style={{ background: statusColors[order.status] || "#999", color: "#fff", padding: "4px 12px", borderRadius: "20px", fontSize: "0.8rem", fontWeight: "600" }}>{order.status}</span>
                <p style={{ margin: "8px 0 0", fontWeight: "700", fontSize: "1.1rem" }}>${order.total.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
