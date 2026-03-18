import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem("orli_cart") || "[]"));
  }, []);

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  const checkout = () => {
    if (cart.length > 0) navigate("/checkout");
  };

  const removeItem = (index) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
    localStorage.setItem("orli_cart", JSON.stringify(newCart));
  };

  return (
    <div style={{ padding: "40px 5%", fontFamily: '"Poppins", sans-serif', maxWidth: "900px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "2.5rem", color: "#1a1a1a", borderBottom: "1px solid #e5e5e5", paddingBottom: "16px" }}>Your Cart</h1>
      
      {cart.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 0" }}>
          <p style={{ color: "#666", fontSize: "1.2rem", marginBottom: "24px" }}>Your cart is empty.</p>
          <Link to="/shop" style={{ padding: "12px 24px", background: "#1a1a1a", color: "#fff", textDecoration: "none", borderRadius: "8px", fontWeight: "600" }}>
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div>
          {cart.map((item, idx) => (
            <div key={idx} style={{ display: "flex", gap: "24px", padding: "24px 0", borderBottom: "1px solid #e5e5e5", alignItems: "center" }}>
              <div style={{ width: "100px", height: "100px", background: "#f0f0f0", borderRadius: "8px", overflow: "hidden" }}>
                <img src={item.image} alt="Product" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: "0 0 8px 0", color: "#1a1a1a" }}>{item.title}</h3>
                <p style={{ margin: 0, color: "#666" }}>Qty: {item.quantity}</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ fontSize: "1.2rem", fontWeight: "700", margin: "0 0 8px 0", color: "#1a1a1a" }}>${item.price.toFixed(2)}</p>
                <button 
                  onClick={() => removeItem(idx)}
                  style={{ background: "none", border: "none", color: "#d13030", cursor: "pointer", fontSize: "0.9rem", padding: 0 }}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <div style={{ marginTop: "40px", padding: "32px", background: "#f9f9f9", borderRadius: "12px", border: "1px solid #e5e5e5", textAlign: "right" }}>
            <p style={{ fontSize: "1.2rem", color: "#666", margin: "0 0 12px 0" }}>Subtotal: <span style={{ color: "#1a1a1a", fontWeight: "600" }}>${total.toFixed(2)}</span></p>
            <h2 style={{ fontSize: "2rem", color: "#1a1a1a", margin: "0 0 24px 0" }}>Total: ${total.toFixed(2)}</h2>
            <button 
              onClick={checkout}
              style={{ padding: "16px 40px", background: "#1a1a1a", color: "#fff", border: "none", borderRadius: "8px", fontSize: "1.1rem", fontWeight: "600", cursor: "pointer" }}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
