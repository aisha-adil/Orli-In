import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/Logo.png";

export default function CustomerNav() {
  const navigate = useNavigate();
  const cart = JSON.parse(localStorage.getItem("orli_cart") || "[]");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("orli_cart");
    navigate("/login");
  };

  return (
    <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 5%", background: "#fff", borderBottom: "1px solid #e5e5e5", fontFamily: '"Poppins", sans-serif' }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {/* Back / Forward */}
        <button onClick={() => navigate(-1)} title="Go back" style={navBtn}>←</button>
        <button onClick={() => navigate(1)} title="Go forward" style={navBtn}>→</button>

        {/* Logo → Home */}
        <Link to="/" style={{ display: "flex", alignItems: "center" }}>
          <img src={Logo} alt="Orli" style={{ height: "36px" }} />
        </Link>
      </div>

      <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
        <Link to="/shop" style={linkStyle}>Store</Link>
        <Link to="/orders" style={linkStyle}>Orders</Link>
        <Link to="/cart" style={linkStyle}>Cart ({cart.length})</Link>
        <Link to="/profile" style={{ textDecoration: "none", color: "#666", fontSize: "0.9rem" }}>
          {user.fullName || "Account"}
        </Link>
        <button onClick={handleLogout} style={{ background: "none", border: "1px solid #e5e5e5", color: "#666", cursor: "pointer", fontSize: "0.85rem", padding: "6px 14px", borderRadius: "6px" }}>
          Logout
        </button>
      </div>
    </nav>
  );
}

const linkStyle = { textDecoration: "none", color: "#1a1a1a", fontWeight: "600", fontSize: "0.9rem" };
const navBtn = { background: "none", border: "1px solid #e5e5e5", color: "#1a1a1a", cursor: "pointer", fontSize: "1rem", padding: "4px 10px", borderRadius: "6px", fontWeight: "700", lineHeight: 1 };
