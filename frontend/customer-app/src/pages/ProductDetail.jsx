import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  const addToCart = () => {
    setAdding(true);
    setTimeout(() => {
      const cart = JSON.parse(localStorage.getItem("orli_cart") || "[]");
      cart.push({
        id: product._id,
        title: product.title,
        price: product.variants?.[0]?.cost || 0,
        image: product.images?.[0],
        quantity: 1
      });
      localStorage.setItem("orli_cart", JSON.stringify(cart));
      setAdding(false);
      navigate("/cart");
    }, 500);
  };

  if (loading) return <div style={{ padding: "40px", fontFamily: '"Poppins", sans-serif' }}>Loading product...</div>;
  if (!product) return <div style={{ padding: "40px", fontFamily: '"Poppins", sans-serif' }}>Product not found.</div>;

  const variant = product.variants?.[0] || {};

  return (
    <div style={{ padding: "40px 5%", fontFamily: '"Poppins", sans-serif', maxWidth: "1200px", margin: "0 auto", display: "flex", gap: "40px", flexWrap: "wrap" }}>
      
      {/* Image Gallery */}
      <div style={{ flex: "1 1 400px", background: "#f0f0f0", borderRadius: "16px", height: "500px", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        {product.images?.[0] ? (
          <img src={product.images[0]} alt={product.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <span style={{ color: "#999" }}>No Image</span>
        )}
      </div>

      {/* Details */}
      <div style={{ flex: "1 1 400px", padding: "20px 0" }}>
        <p style={{ color: "#666", textTransform: "uppercase", fontSize: "0.85rem", letterSpacing: "1px", marginBottom: "8px" }}>
          By {product.manufacturer?.fullName || "Avery Designs"}
        </p>
        <h1 style={{ fontSize: "2.5rem", margin: "0 0 16px 0", color: "#1a1a1a" }}>{product.title}</h1>
        <p style={{ fontSize: "1.5rem", fontWeight: "700", color: "#1a1a1a", margin: "0 0 24px 0" }}>${variant.cost || "0.00"}</p>
        
        <p style={{ color: "#666", lineHeight: "1.6", marginBottom: "32px", fontSize: "1.05rem" }}>
          {product.description || "A high-quality boutique item crafted with precision. Perfect for your specific aesthetic needs."}
        </p>

        <div style={{ marginBottom: "32px" }}>
          <h4 style={{ margin: "0 0 12px 0", color: "#1a1a1a" }}>Tags</h4>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {product.metadata?.map((tag, i) => (
              <span key={i} style={{ background: "#e5e5e5", padding: "6px 12px", borderRadius: "20px", fontSize: "0.85rem", color: "#1a1a1a" }}>{tag}</span>
            ))}
          </div>
        </div>

        <button 
          onClick={addToCart}
          disabled={adding}
          style={{ 
            width: "100%", 
            padding: "16px", 
            background: "#1a1a1a", 
            color: "#fff", 
            border: "none", 
            borderRadius: "12px", 
            fontSize: "1.1rem", 
            fontWeight: "600", 
            cursor: adding ? "not-allowed" : "pointer",
            transition: "opacity 0.2s"
          }}
        >
          {adding ? "Adding to Cart..." : `Add to Cart — $${variant.cost || "0.00"}`}
        </button>
      </div>

    </div>
  );
}
