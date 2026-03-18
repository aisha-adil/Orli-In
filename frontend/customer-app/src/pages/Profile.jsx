import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user") || "{}"));
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ fullName: user.fullName || "", phone: user.phone || "" });
  const [msg, setMsg] = useState("");

  const save = async (e) => {
    e.preventDefault();
    setMsg("Profile updated successfully!");
    const updated = { ...user, ...form };
    localStorage.setItem("user", JSON.stringify(updated));
    setUser(updated);
    setEditing(false);
  };

  return (
    <div style={{ padding: "40px 5%", fontFamily: '"Poppins", sans-serif', maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "2rem", color: "#1a1a1a", marginBottom: "8px" }}>My Profile</h1>
      <p style={{ color: "#666", marginBottom: "32px" }}>Manage your account settings and preferences.</p>

      {msg && <div style={{ background: "#f0f0f0", border: "1px solid #e5e5e5", padding: "12px 16px", borderRadius: "8px", marginBottom: "24px", color: "#1a1a1a" }}>{msg}</div>}

      <div style={{ background: "#fff", border: "1px solid #e5e5e5", borderRadius: "12px", padding: "32px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <h3 style={{ margin: 0 }}>Account Information</h3>
          <button onClick={() => setEditing(!editing)} style={{ background: editing ? "#e5e5e5" : "#1a1a1a", color: editing ? "#1a1a1a" : "#fff", border: "none", padding: "8px 16px", borderRadius: "8px", cursor: "pointer", fontWeight: "600", fontSize: "0.9rem" }}>
            {editing ? "Cancel" : "Edit Profile"}
          </button>
        </div>

        {!editing ? (
          <div style={{ display: "grid", gap: "16px" }}>
            <div><label style={{ color: "#999", fontSize: "0.85rem" }}>Full Name</label><p style={{ margin: "4px 0 0", fontWeight: "600" }}>{user.fullName || "—"}</p></div>
            <div><label style={{ color: "#999", fontSize: "0.85rem" }}>Email</label><p style={{ margin: "4px 0 0" }}>{user.email || "—"}</p></div>
            <div><label style={{ color: "#999", fontSize: "0.85rem" }}>Role</label><p style={{ margin: "4px 0 0" }}>{user.role || "—"}</p></div>
            <div><label style={{ color: "#999", fontSize: "0.85rem" }}>Phone</label><p style={{ margin: "4px 0 0" }}>{user.phone || "—"}</p></div>
          </div>
        ) : (
          <form onSubmit={save} style={{ display: "grid", gap: "16px" }}>
            <div>
              <label style={{ color: "#666", fontSize: "0.9rem", fontWeight: "600" }}>Full Name</label>
              <input type="text" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} style={{ width: "100%", padding: "10px 14px", border: "1px solid #e5e5e5", borderRadius: "8px", marginTop: "4px", background: "#f9f9f9" }} />
            </div>
            <div>
              <label style={{ color: "#666", fontSize: "0.9rem", fontWeight: "600" }}>Phone</label>
              <input type="text" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} style={{ width: "100%", padding: "10px 14px", border: "1px solid #e5e5e5", borderRadius: "8px", marginTop: "4px", background: "#f9f9f9" }} />
            </div>
            <button type="submit" style={{ padding: "12px", background: "#1a1a1a", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}>Save Changes</button>
          </form>
        )}
      </div>

      {/* Quick links */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginTop: "32px" }}>
        <button onClick={() => navigate("/orders")} style={{ padding: "20px", background: "#fff", border: "1px solid #e5e5e5", borderRadius: "12px", cursor: "pointer", textAlign: "left" }}>
          <h4 style={{ margin: "0 0 4px", color: "#1a1a1a" }}>📦 My Orders</h4>
          <p style={{ margin: 0, color: "#666", fontSize: "0.9rem" }}>Track and manage your purchases</p>
        </button>
        <button onClick={() => navigate("/shop")} style={{ padding: "20px", background: "#fff", border: "1px solid #e5e5e5", borderRadius: "12px", cursor: "pointer", textAlign: "left" }}>
          <h4 style={{ margin: "0 0 4px", color: "#1a1a1a" }}>🛍️ Continue Shopping</h4>
          <p style={{ margin: 0, color: "#666", fontSize: "0.9rem" }}>Browse the latest collections</p>
        </button>
      </div>
    </div>
  );
}
