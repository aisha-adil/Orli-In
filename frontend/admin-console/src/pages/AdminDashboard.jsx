import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  LineChart, Line, AreaChart, Area
} from "recharts";
import Logo from "../assets/Logo.png";

const COLORS = ["#1a1a1a", "#666666", "#999999", "#cccccc"];
const monthlyRevenue = [
  { month: "Oct", revenue: 4200 }, { month: "Nov", revenue: 5800 }, { month: "Dec", revenue: 7200 },
  { month: "Jan", revenue: 6100 }, { month: "Feb", revenue: 8400 }, { month: "Mar", revenue: 9600 },
];
const ordersByStatus = [
  { name: "Pending", value: 12 }, { name: "In Production", value: 8 },
  { name: "Shipped", value: 15 }, { name: "Delivered", value: 42 },
];
const userGrowth = [
  { month: "Oct", users: 18 }, { month: "Nov", users: 24 }, { month: "Dec", users: 31 },
  { month: "Jan", users: 38 }, { month: "Feb", users: 45 }, { month: "Mar", users: 52 },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("overview");

  // Complaints state
  const [complaints] = useState([
    { id: 1, user: "customer@orli.com", type: "Delayed Delivery", status: "Open", date: "2026-03-15", details: "Order #1042 has not arrived in 7 days." },
    { id: 2, user: "jane@example.com", type: "Defective Product", status: "Under Review", date: "2026-03-12", details: "T-shirt printing was misaligned." },
    { id: 3, user: "mark@example.com", type: "Wrong Item", status: "Resolved", date: "2026-03-08", details: "Received a hoodie instead of a mug." },
    { id: 4, user: "sarah@example.com", type: "Refund Request", status: "Open", date: "2026-03-16", details: "Customer wants full refund for damaged goods." },
  ]);
  const [mediations] = useState([
    { id: 1, between: "Customer ↔ Manufacturer", issue: "Refund dispute on order #1042", status: "In Progress", date: "2026-03-14" },
    { id: 2, between: "Designer ↔ Customer", issue: "Design copyright claim", status: "Resolved", date: "2026-03-10" },
    { id: 3, between: "Manufacturer ↔ Designer", issue: "Production quality disagreement", status: "Pending", date: "2026-03-17" },
  ]);

  useEffect(() => {
    const load = async () => {
      try {
        const [s, u] = await Promise.all([
          axios.get("http://localhost:5000/api/admin/stats"),
          axios.get("http://localhost:5000/api/admin/users"),
        ]);
        setStats(s.data);
        setUsers(u.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const handleLogout = () => { localStorage.clear(); navigate("/login"); };

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/users/${id}`);
      setUsers(users.filter(u => u._id !== id));
    } catch (err) { console.error(err); }
  };

  if (loading) return <div style={S.loading}>Loading dashboard...</div>;

  const kpis = [
    { label: "Total Users", value: stats?.totalUsers || 0, icon: "👤" },
    { label: "Customers", value: stats?.customers || 0, icon: "🛍️" },
    { label: "Designers", value: stats?.designers || 0, icon: "🎨" },
    { label: "Manufacturers", value: stats?.manufacturers || 0, icon: "🧵" },
    { label: "Products", value: stats?.totalProducts || 0, icon: "📦" },
    { label: "Orders", value: stats?.totalOrders || 0, icon: "🧾" },
  ];

  const badge = (status) => {
    const c = { Open: "#f59e0b", "Under Review": "#3b82f6", "In Progress": "#8b5cf6", Resolved: "#22c55e", Pending: "#f59e0b" };
    return <span style={{ background: c[status] || "#999", color: "#fff", padding: "3px 10px", borderRadius: "12px", fontSize: "0.78rem", fontWeight: 600 }}>{status}</span>;
  };

  const tabs = [
    { key: "overview", label: "📊 Overview" },
    { key: "users", label: "👥 Users" },
    { key: "complaints", label: "📋 Complaints" },
    { key: "mediation", label: "⚖️ Mediation" },
  ];

  return (
    <div style={S.page}>
      <nav style={S.nav}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <img src={Logo} alt="Orli" style={{ height: "32px" }} />
          <h2 style={{ margin: 0, fontSize: "1.1rem" }}>Admin Console</h2>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <span style={{ color: "#999" }}>{user.fullName || "Admin"}</span>
          <button onClick={handleLogout} style={S.logoutBtn}>Logout</button>
        </div>
      </nav>

      {/* Tab Bar */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e5e5e5", padding: "0 5%", display: "flex", gap: "8px" }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{ padding: "12px 20px", border: "none", background: "none", cursor: "pointer", fontWeight: tab === t.key ? "700" : "500", color: tab === t.key ? "#1a1a1a" : "#999", borderBottom: tab === t.key ? "2px solid #1a1a1a" : "2px solid transparent", fontSize: "0.9rem", fontFamily: "inherit" }}>
            {t.label}
          </button>
        ))}
      </div>

      <div style={S.container}>
        {/* KPIs always visible */}
        <div style={S.kpiGrid}>
          {kpis.map((c, i) => (
            <div key={i} style={S.kpiCard}>
              <span style={{ fontSize: "1.5rem" }}>{c.icon}</span>
              <p style={{ color: "#666", margin: "6px 0 2px", fontSize: "0.8rem" }}>{c.label}</p>
              <h2 style={{ margin: 0, fontSize: "2rem", color: "#1a1a1a" }}>{c.value}</h2>
            </div>
          ))}
        </div>

        {/* OVERVIEW TAB */}
        {tab === "overview" && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px", marginBottom: "32px" }}>
              <div style={S.card}>
                <h3 style={S.cardTitle}>Monthly Revenue</h3>
                <ResponsiveContainer width="100%" height={260}>
                  <AreaChart data={monthlyRevenue}>
                    <defs><linearGradient id="rg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#1a1a1a" stopOpacity={0.15} /><stop offset="95%" stopColor="#1a1a1a" stopOpacity={0} /></linearGradient></defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" /><XAxis dataKey="month" /><YAxis /><Tooltip formatter={v => [`$${v}`, "Revenue"]} />
                    <Area type="monotone" dataKey="revenue" stroke="#1a1a1a" fill="url(#rg)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div style={S.card}>
                <h3 style={S.cardTitle}>Orders by Status</h3>
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart><Pie data={ordersByStatus} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>{ordersByStatus.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Legend /><Tooltip /></PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
              <div style={S.card}>
                <h3 style={S.cardTitle}>User Growth</h3>
                <ResponsiveContainer width="100%" height={220}><LineChart data={userGrowth}><CartesianGrid strokeDasharray="3 3" stroke="#eee" /><XAxis dataKey="month" /><YAxis /><Tooltip /><Line type="monotone" dataKey="users" stroke="#1a1a1a" strokeWidth={2} dot={{ r: 4 }} /></LineChart></ResponsiveContainer>
              </div>
              <div style={S.card}>
                <h3 style={S.cardTitle}>Revenue Bars</h3>
                <ResponsiveContainer width="100%" height={220}><BarChart data={monthlyRevenue}><CartesianGrid strokeDasharray="3 3" stroke="#eee" /><XAxis dataKey="month" /><YAxis /><Tooltip formatter={v => [`$${v}`, "Revenue"]} /><Bar dataKey="revenue" fill="#1a1a1a" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer>
              </div>
            </div>
          </>
        )}

        {/* USERS TAB */}
        {tab === "users" && (
          <div style={S.card}>
            <h3 style={S.cardTitle}>All Platform Users</h3>
            <div style={{ overflowX: "auto" }}>
              <table style={S.table}>
                <thead><tr style={S.tHead}><th style={S.th}>Name</th><th style={S.th}>Email</th><th style={S.th}>Role</th><th style={S.th}>Verified</th><th style={S.th}>Actions</th></tr></thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u._id} style={S.tr}>
                      <td style={S.td}>{u.fullName}</td>
                      <td style={{ ...S.td, color: "#666" }}>{u.email}</td>
                      <td style={S.td}><span style={{ background: u.role === "admin" ? "#1a1a1a" : "#e5e5e5", color: u.role === "admin" ? "#fff" : "#1a1a1a", padding: "3px 10px", borderRadius: "14px", fontSize: "0.78rem", fontWeight: 600 }}>{u.role}</span></td>
                      <td style={S.td}>{u.isVerified ? "✅" : "❌"}</td>
                      <td style={S.td}>
                        {u.role !== "admin" && <button onClick={() => deleteUser(u._id)} style={{ background: "none", border: "1px solid #e5e5e5", color: "#d13030", padding: "4px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "0.8rem" }}>Remove</button>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* COMPLAINTS TAB */}
        {tab === "complaints" && (
          <div style={S.card}>
            <h3 style={S.cardTitle}>Customer Complaints</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {complaints.map(c => (
                <div key={c.id} style={{ border: "1px solid #e5e5e5", borderRadius: "12px", padding: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <div><strong>{c.type}</strong> <span style={{ color: "#999", fontSize: "0.85rem" }}>— {c.user}</span></div>
                    {badge(c.status)}
                  </div>
                  <p style={{ color: "#666", margin: "0 0 8px", fontSize: "0.9rem" }}>{c.details}</p>
                  <span style={{ color: "#999", fontSize: "0.8rem" }}>Filed: {c.date}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MEDIATION TAB */}
        {tab === "mediation" && (
          <div style={S.card}>
            <h3 style={S.cardTitle}>Mediation Cases</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {mediations.map(m => (
                <div key={m.id} style={{ border: "1px solid #e5e5e5", borderRadius: "12px", padding: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <div><strong>{m.between}</strong></div>
                    {badge(m.status)}
                  </div>
                  <p style={{ color: "#666", margin: "0 0 8px", fontSize: "0.9rem" }}>{m.issue}</p>
                  <span style={{ color: "#999", fontSize: "0.8rem" }}>Filed: {m.date}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const S = {
  page: { fontFamily: '"Poppins", sans-serif', minHeight: "100vh", background: "#f9f9f9" },
  loading: { padding: "40px", fontFamily: '"Poppins", sans-serif' },
  nav: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 5%", background: "#1a1a1a", color: "#fff" },
  logoutBtn: { background: "none", border: "1px solid #666", color: "#fff", padding: "6px 16px", borderRadius: "6px", cursor: "pointer" },
  container: { padding: "32px 5%", maxWidth: "1400px", margin: "0 auto" },
  kpiGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "16px", marginBottom: "32px" },
  kpiCard: { background: "#fff", border: "1px solid #e5e5e5", borderRadius: "12px", padding: "20px", textAlign: "center" },
  card: { background: "#fff", border: "1px solid #e5e5e5", borderRadius: "12px", padding: "24px", marginBottom: "24px" },
  cardTitle: { margin: "0 0 16px 0", fontSize: "1rem", color: "#1a1a1a" },
  table: { width: "100%", borderCollapse: "collapse" },
  tHead: { background: "#f0f0f0" },
  th: { padding: "10px 14px", textAlign: "left", fontSize: "0.82rem", color: "#666", fontWeight: 600 },
  tr: { borderBottom: "1px solid #f0f0f0" },
  td: { padding: "10px 14px", fontSize: "0.88rem" },
};
