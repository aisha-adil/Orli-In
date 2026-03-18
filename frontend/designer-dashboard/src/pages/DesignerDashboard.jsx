import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Logo from "../assets/Logo.png";

export default function DesignerDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [portfolio, setPortfolio] = useState([]);
  const [manufacturers, setManufacturers] = useState([]);
  const [storeName, setStoreName] = useState("");
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [selectedMfr, setSelectedMfr] = useState("");

  const fetchData = async () => {
    try {
      const [pRes, mRes] = await Promise.all([
        axios.get(`http://localhost:5000/api/designer/portfolio/${user.id}`),
        axios.get("http://localhost:5000/api/admin/users"),
      ]);
      setPortfolio(pRes.data.portfolio);
      setStoreName(pRes.data.storeName);
      setManufacturers(mRes.data.filter(u => u.role === "manufacturer"));
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const addDesign = async (e) => {
    e.preventDefault();
    if (!newTitle) return;
    try {
      await axios.post(`http://localhost:5000/api/designer/portfolio/${user.id}`, {
        title: newTitle,
        url: newUrl || "https://via.placeholder.com/400?text=" + encodeURIComponent(newTitle),
      });
      setNewTitle(""); setNewUrl("");
      fetchData();
    } catch (err) { console.error(err); }
  };

  const togglePublish = async (idx) => {
    if (!portfolio[idx].published && !selectedMfr) {
      alert("Please select a manufacturing partner before publishing!");
      return;
    }
    try {
      await axios.patch(`http://localhost:5000/api/designer/portfolio/${user.id}/${idx}/toggle`);
      fetchData();
    } catch (err) { console.error(err); }
  };

  const deleteDesign = async (idx) => {
    try {
      await axios.delete(`http://localhost:5000/api/designer/portfolio/${user.id}/${idx}`);
      fetchData();
    } catch (err) { console.error(err); }
  };

  const handleLogout = () => { localStorage.clear(); navigate("/login"); };

  if (loading) return <div style={{ padding: "40px", fontFamily: '"Poppins", sans-serif' }}>Loading studio...</div>;

  return (
    <div style={{ fontFamily: '"Poppins", sans-serif', minHeight: "100vh", background: "#f9f9f9" }}>
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 5%", background: "#fff", borderBottom: "1px solid #e5e5e5" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <img src={Logo} alt="Orli" style={{ height: "32px" }} />
          <h2 style={{ margin: 0, fontSize: "1.1rem", color: "#1a1a1a" }}>🎨 {storeName || "Designer Studio"}</h2>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <span style={{ color: "#666" }}>{user.fullName}</span>
          <button onClick={handleLogout} style={{ background: "#1a1a1a", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "6px", cursor: "pointer" }}>Logout</button>
        </div>
      </nav>

      <div style={{ padding: "32px 5%", maxWidth: "1200px", margin: "0 auto" }}>

        {/* Manufacturer Selection */}
        <div style={{ background: "#fff", border: "1px solid #e5e5e5", borderRadius: "12px", padding: "24px", marginBottom: "24px" }}>
          <h3 style={{ margin: "0 0 12px" }}>🧵 Manufacturing Partner</h3>
          <p style={{ color: "#666", marginBottom: "16px", fontSize: "0.9rem" }}>
            Choose a manufacturer to produce your designs (like Printify or Gelato). You must select a partner before publishing.
          </p>
          <select value={selectedMfr} onChange={(e) => setSelectedMfr(e.target.value)} style={{ width: "100%", padding: "12px", border: "1px solid #e5e5e5", borderRadius: "8px", background: "#f9f9f9", fontSize: "0.95rem" }}>
            <option value="">— Select a manufacturer —</option>
            {manufacturers.map(m => (
              <option key={m._id} value={m._id}>{m.fullName} ({m.email})</option>
            ))}
          </select>
        </div>

        {/* Upload */}
        <div style={{ background: "#fff", border: "1px solid #e5e5e5", borderRadius: "12px", padding: "24px", marginBottom: "24px" }}>
          <h3 style={{ margin: "0 0 16px 0" }}>Upload New Design</h3>
          <form onSubmit={addDesign} style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <input type="text" placeholder="Design title" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} required style={{ flex: "1 1 200px", padding: "10px 14px", border: "1px solid #e5e5e5", borderRadius: "8px", background: "#f0f0f0" }} />
            <input type="text" placeholder="Image URL (optional)" value={newUrl} onChange={(e) => setNewUrl(e.target.value)} style={{ flex: "1 1 300px", padding: "10px 14px", border: "1px solid #e5e5e5", borderRadius: "8px", background: "#f0f0f0" }} />
            <button type="submit" style={{ padding: "10px 24px", background: "#1a1a1a", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}>+ Add Design</button>
          </form>
        </div>

        {/* Portfolio Grid */}
        <h3 style={{ marginBottom: "16px" }}>My Portfolio ({portfolio.length} designs)</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
          {portfolio.map((item, idx) => (
            <div key={idx} style={{ background: "#fff", border: "1px solid #e5e5e5", borderRadius: "12px", overflow: "hidden", position: "relative" }}>
              {item.published && <div style={{ position: "absolute", top: "12px", right: "12px", background: "#1a1a1a", color: "#fff", padding: "4px 10px", borderRadius: "16px", fontSize: "0.75rem", fontWeight: "600" }}>Published</div>}
              <div style={{ height: "200px", background: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {item.url ? <img src={item.url} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span style={{ color: "#999" }}>No Preview</span>}
              </div>
              <div style={{ padding: "16px" }}>
                <h4 style={{ margin: "0 0 12px 0", color: "#1a1a1a" }}>{item.title}</h4>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button onClick={() => togglePublish(idx)} style={{ flex: 1, padding: "8px", borderRadius: "6px", border: "1px solid #e5e5e5", cursor: "pointer", fontWeight: "600", fontSize: "0.85rem", background: item.published ? "#fff" : "#1a1a1a", color: item.published ? "#1a1a1a" : "#fff" }}>
                    {item.published ? "Unpublish" : "Publish"}
                  </button>
                  <button onClick={() => deleteDesign(idx)} style={{ padding: "8px 16px", borderRadius: "6px", border: "1px solid #e5e5e5", background: "#fff", color: "#d13030", cursor: "pointer", fontWeight: "600", fontSize: "0.85rem" }}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {portfolio.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#999" }}>
            <p style={{ fontSize: "1.2rem" }}>No designs yet. Upload your first creation above!</p>
          </div>
        )}
      </div>
    </div>
  );
}
