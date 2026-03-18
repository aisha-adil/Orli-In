import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const userId = user.id || "";
        
        const [prodRes, recRes] = await Promise.all([
          axios.get("http://localhost:5000/api/products"),
          axios.get(`http://localhost:5000/api/products/recommendations?userId=${userId}`)
        ]);
        
        setProducts(prodRes.data);
        setRecommendations(recRes.data);
      } catch (err) {
        console.error("Failed to fetch products", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div style={{ padding: "40px", textAlign: "center", fontFamily: '"Poppins", sans-serif' }}>Loading collection...</div>;

  return (
    <div style={{ padding: "40px 5%", fontFamily: '"Poppins", sans-serif', maxWidth: "1400px", margin: "0 auto" }}>
      
      {/* RECOMMENDATIONS HERO */}
      {recommendations.length > 0 && (
        <section style={{ marginBottom: "60px" }}>
          <h2 style={{ fontSize: "2rem", marginBottom: "8px", color: "#1a1a1a" }}>Suggested for You</h2>
          <p style={{ color: "#666", marginBottom: "24px" }}>Based on your style preferences and browsing history.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "24px" }}>
            {recommendations.map(p => <ProductCard key={`rec-${p._id}`} product={p} />)}
          </div>
        </section>
      )}

      {/* ALL PRODUCTS */}
      <section>
        <h2 style={{ fontSize: "2rem", marginBottom: "8px", color: "#1a1a1a" }}>The Common Store</h2>
        <p style={{ color: "#666", marginBottom: "24px" }}>Explore all designs from our global community.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "24px" }}>
          {products.map(p => <ProductCard key={p._id} product={p} />)}
        </div>
      </section>

    </div>
  );
}

function ProductCard({ product }) {
  const variant = product.variants?.[0] || {};
  return (
    <div style={{ border: "1px solid #e5e5e5", borderRadius: "12px", background: "#fff", overflow: "hidden", transition: "transform 0.2s, box-shadow 0.2s", position: "relative" }}>
      
      <div style={{ background: "#f9f9f9", height: "240px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {product.images?.[0] ? (
          <img src={product.images[0]} alt={product.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <span style={{ color: "#999" }}>No Image</span>
        )}
      </div>
      
      <div style={{ padding: "20px" }}>
        <h3 style={{ margin: "0 0 8px 0", fontSize: "1.1rem", color: "#1a1a1a" }}>{product.title}</h3>
        <p style={{ margin: "0 0 16px 0", color: "#666", fontSize: "0.9rem" }}>By {product.manufacturer?.fullName || "Unknown Designer"}</p>
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontWeight: "700", fontSize: "1.2rem", color: "#1a1a1a" }}>${variant.cost || "0.00"}</span>
          <Link to={`/products/${product._id}`} style={{ background: "#1a1a1a", color: "#fff", padding: "8px 16px", borderRadius: "8px", textDecoration: "none", fontSize: "0.9rem", fontWeight: "600" }}>
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
