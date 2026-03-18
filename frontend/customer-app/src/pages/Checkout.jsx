import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [step, setStep] = useState(1); // 1=form, 2=success
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("visa");

  const [shipping, setShipping] = useState({ fullName: "", email: "", phone: "", address: "", city: "", state: "", zip: "", country: "US" });
  const [billing, setBilling] = useState({ sameAsShipping: true, address: "", city: "", state: "", zip: "" });

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("orli_cart") || "[]");
    if (items.length === 0) navigate("/shop");
    setCart(items);
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setShipping(s => ({ ...s, fullName: user.fullName || "", email: user.email || "" }));
  }, [navigate]);

  const subtotal = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
  const shippingCost = 5.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shippingCost + tax;

  const handlePayment = (e) => {
    e.preventDefault();
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setStep(2);
      localStorage.removeItem("orli_cart");
    }, 2500);
  };

  if (step === 2) {
    return (
      <div style={{ padding: "80px 20px", textAlign: "center", fontFamily: '"Poppins", sans-serif' }}>
        <div style={{ fontSize: "4rem", marginBottom: "16px" }}>🎉</div>
        <h1 style={{ color: "#1a1a1a", marginBottom: "8px" }}>Order Confirmed!</h1>
        <p style={{ color: "#666", marginBottom: "8px", fontSize: "1.1rem" }}>Your payment of <strong>${total.toFixed(2)}</strong> was processed successfully via <strong>{paymentMethod.toUpperCase()}</strong>.</p>
        <p style={{ color: "#999", marginBottom: "32px" }}>A confirmation email has been sent. Your order will ship within 3-5 business days.</p>
        <div style={{ background: "#f0f0f0", borderRadius: "12px", padding: "24px", maxWidth: "400px", margin: "0 auto 32px", textAlign: "left" }}>
          <h4 style={{ margin: "0 0 12px" }}>📦 Estimated Delivery</h4>
          <p style={{ margin: "0 0 4px", color: "#666" }}>Processing: 1-2 business days</p>
          <p style={{ margin: "0 0 4px", color: "#666" }}>Shipping: 3-5 business days</p>
          <p style={{ margin: 0, fontWeight: "700", color: "#1a1a1a" }}>Expected: Mar 25 – Mar 28, 2026</p>
        </div>
        <button onClick={() => navigate("/shop")} style={S.btnPrimary}>Continue Shopping</button>
      </div>
    );
  }

  const payMethods = [
    { key: "visa", label: "Visa", icon: "💳" },
    { key: "mastercard", label: "Mastercard", icon: "💳" },
    { key: "paypal", label: "PayPal", icon: "🅿️" },
    { key: "cod", label: "Cash on Delivery", icon: "💵" },
  ];

  return (
    <div style={{ padding: "32px 5%", fontFamily: '"Poppins", sans-serif', maxWidth: "1100px", margin: "0 auto", display: "flex", gap: "40px", flexWrap: "wrap" }}>
      
      {/* LEFT: Forms */}
      <div style={{ flex: "1 1 550px" }}>
        <h1 style={{ fontSize: "2rem", marginBottom: "24px", color: "#1a1a1a" }}>Checkout</h1>
        
        <form onSubmit={handlePayment}>
          {/* SHIPPING ADDRESS */}
          <div style={S.section}>
            <h3 style={S.sectionTitle}>📍 Shipping Address</h3>
            <div style={S.grid2}>
              <div style={S.field}><label style={S.label}>Full Name</label><input type="text" required value={shipping.fullName} onChange={e => setShipping({...shipping, fullName: e.target.value})} style={S.input} /></div>
              <div style={S.field}><label style={S.label}>Email</label><input type="email" required value={shipping.email} onChange={e => setShipping({...shipping, email: e.target.value})} style={S.input} /></div>
            </div>
            <div style={S.field}><label style={S.label}>Phone Number</label><input type="tel" required placeholder="+1 (555) 000-0000" value={shipping.phone} onChange={e => setShipping({...shipping, phone: e.target.value})} style={S.input} /></div>
            <div style={S.field}><label style={S.label}>Street Address</label><input type="text" required placeholder="123 Main Street, Apt 4B" value={shipping.address} onChange={e => setShipping({...shipping, address: e.target.value})} style={S.input} /></div>
            <div style={S.grid3}>
              <div style={S.field}><label style={S.label}>City</label><input type="text" required value={shipping.city} onChange={e => setShipping({...shipping, city: e.target.value})} style={S.input} /></div>
              <div style={S.field}><label style={S.label}>State</label><input type="text" required value={shipping.state} onChange={e => setShipping({...shipping, state: e.target.value})} style={S.input} /></div>
              <div style={S.field}><label style={S.label}>ZIP Code</label><input type="text" required value={shipping.zip} onChange={e => setShipping({...shipping, zip: e.target.value})} style={S.input} /></div>
            </div>
          </div>

          {/* BILLING ADDRESS */}
          <div style={S.section}>
            <h3 style={S.sectionTitle}>🏦 Billing Address</h3>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", marginBottom: "16px" }}>
              <input type="checkbox" checked={billing.sameAsShipping} onChange={() => setBilling({...billing, sameAsShipping: !billing.sameAsShipping})} />
              <span style={{ fontSize: "0.9rem", color: "#666" }}>Same as shipping address</span>
            </label>
            {!billing.sameAsShipping && (
              <>
                <div style={S.field}><label style={S.label}>Street Address</label><input type="text" required value={billing.address} onChange={e => setBilling({...billing, address: e.target.value})} style={S.input} /></div>
                <div style={S.grid3}>
                  <div style={S.field}><label style={S.label}>City</label><input type="text" required value={billing.city} onChange={e => setBilling({...billing, city: e.target.value})} style={S.input} /></div>
                  <div style={S.field}><label style={S.label}>State</label><input type="text" required value={billing.state} onChange={e => setBilling({...billing, state: e.target.value})} style={S.input} /></div>
                  <div style={S.field}><label style={S.label}>ZIP</label><input type="text" required value={billing.zip} onChange={e => setBilling({...billing, zip: e.target.value})} style={S.input} /></div>
                </div>
              </>
            )}
          </div>

          {/* SHIPPING METHOD */}
          <div style={S.section}>
            <h3 style={S.sectionTitle}>🚚 Shipping Method</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <label style={{ ...S.radioCard, border: "2px solid #1a1a1a" }}>
                <input type="radio" name="shippingMethod" defaultChecked style={{ marginRight: "12px" }} />
                <div style={{ flex: 1 }}>
                  <strong>Standard Shipping</strong>
                  <p style={{ margin: "2px 0 0", color: "#666", fontSize: "0.85rem" }}>5-7 business days</p>
                </div>
                <span style={{ fontWeight: "700" }}>$5.99</span>
              </label>
              <label style={S.radioCard}>
                <input type="radio" name="shippingMethod" style={{ marginRight: "12px" }} />
                <div style={{ flex: 1 }}>
                  <strong>Express Shipping</strong>
                  <p style={{ margin: "2px 0 0", color: "#666", fontSize: "0.85rem" }}>2-3 business days</p>
                </div>
                <span style={{ fontWeight: "700" }}>$14.99</span>
              </label>
            </div>
          </div>

          {/* PAYMENT METHOD */}
          <div style={S.section}>
            <h3 style={S.sectionTitle}>💳 Payment Method</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "12px", marginBottom: "20px" }}>
              {payMethods.map(pm => (
                <button key={pm.key} type="button" onClick={() => setPaymentMethod(pm.key)} style={{ padding: "16px 12px", border: paymentMethod === pm.key ? "2px solid #1a1a1a" : "1px solid #e5e5e5", borderRadius: "10px", background: paymentMethod === pm.key ? "#f9f9f9" : "#fff", cursor: "pointer", textAlign: "center", transition: "all 0.2s" }}>
                  <div style={{ fontSize: "1.5rem", marginBottom: "4px" }}>{pm.icon}</div>
                  <div style={{ fontWeight: "600", fontSize: "0.85rem", color: "#1a1a1a" }}>{pm.label}</div>
                </button>
              ))}
            </div>

            {paymentMethod !== "cod" && paymentMethod !== "paypal" && (
              <>
                <div style={S.field}><label style={S.label}>Cardholder Name</label><input type="text" required placeholder="John Doe" style={S.input} /></div>
                <div style={S.field}><label style={S.label}>Card Number</label><input type="text" required placeholder="•••• •••• •••• ••••" style={S.input} /></div>
                <div style={S.grid2}>
                  <div style={S.field}><label style={S.label}>Expiry Date</label><input type="text" required placeholder="MM/YY" style={S.input} /></div>
                  <div style={S.field}><label style={S.label}>CVV</label><input type="text" required placeholder="123" style={S.input} /></div>
                </div>
              </>
            )}
            {paymentMethod === "paypal" && (
              <div style={{ background: "#f0f0f0", borderRadius: "10px", padding: "20px", textAlign: "center", color: "#666" }}>
                <p style={{ margin: 0 }}>🅿️ You will be redirected to PayPal to complete your payment.</p>
              </div>
            )}
            {paymentMethod === "cod" && (
              <div style={{ background: "#f0f0f0", borderRadius: "10px", padding: "20px", textAlign: "center", color: "#666" }}>
                <p style={{ margin: 0 }}>💵 Pay with cash when your order is delivered.</p>
              </div>
            )}
          </div>

          <button type="submit" disabled={processing} style={{ ...S.btnPrimary, width: "100%", opacity: processing ? 0.7 : 1 }}>
            {processing ? "Processing Payment..." : `Place Order — $${total.toFixed(2)}`}
          </button>
        </form>
      </div>

      {/* RIGHT: Order Summary */}
      <div style={{ flex: "0 0 340px" }}>
        <div style={{ background: "#fff", border: "1px solid #e5e5e5", borderRadius: "12px", padding: "24px", position: "sticky", top: "24px" }}>
          <h3 style={{ margin: "0 0 20px", fontSize: "1.1rem" }}>Order Summary</h3>
          {cart.map((item, idx) => (
            <div key={idx} style={{ display: "flex", gap: "12px", marginBottom: "16px", paddingBottom: "16px", borderBottom: "1px solid #f0f0f0" }}>
              <div style={{ width: "56px", height: "56px", background: "#f0f0f0", borderRadius: "8px", overflow: "hidden" }}>
                {item.image && <img src={item.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: "0 0 2px", fontWeight: "600", fontSize: "0.9rem" }}>{item.title}</p>
                <p style={{ margin: 0, color: "#999", fontSize: "0.8rem" }}>Qty: {item.quantity || 1}</p>
              </div>
              <span style={{ fontWeight: "600" }}>${item.price.toFixed(2)}</span>
            </div>
          ))}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.9rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "#666" }}>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "#666" }}>Shipping</span><span>${shippingCost.toFixed(2)}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "#666" }}>Tax (8%)</span><span>${tax.toFixed(2)}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #e5e5e5", paddingTop: "12px", marginTop: "8px" }}>
              <span style={{ fontWeight: "700", fontSize: "1.1rem" }}>Total</span>
              <span style={{ fontWeight: "700", fontSize: "1.1rem" }}>${total.toFixed(2)}</span>
            </div>
          </div>

          {/* Shipping Info */}
          <div style={{ marginTop: "20px", padding: "16px", background: "#f9f9f9", borderRadius: "8px" }}>
            <p style={{ margin: "0 0 8px", fontWeight: "600", fontSize: "0.85rem", color: "#1a1a1a" }}>📦 Shipping Details</p>
            <p style={{ margin: "0 0 4px", color: "#666", fontSize: "0.82rem" }}>Processing: 1-2 business days</p>
            <p style={{ margin: "0 0 4px", color: "#666", fontSize: "0.82rem" }}>Transit: 3-5 business days</p>
            <p style={{ margin: 0, color: "#1a1a1a", fontSize: "0.82rem", fontWeight: "600" }}>Est. delivery: Mar 25 – Mar 28</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const S = {
  section: { background: "#fff", border: "1px solid #e5e5e5", borderRadius: "12px", padding: "24px", marginBottom: "20px" },
  sectionTitle: { margin: "0 0 16px", fontSize: "1rem", color: "#1a1a1a" },
  field: { display: "flex", flexDirection: "column", gap: "4px", marginBottom: "14px" },
  label: { fontWeight: "600", fontSize: "0.85rem", color: "#666" },
  input: { padding: "11px 14px", borderRadius: "8px", border: "1px solid #e5e5e5", background: "#f9f9f9", fontSize: "0.95rem" },
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" },
  grid3: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "14px" },
  radioCard: { display: "flex", alignItems: "center", padding: "14px 16px", border: "1px solid #e5e5e5", borderRadius: "10px", cursor: "pointer" },
  btnPrimary: { padding: "16px", background: "#1a1a1a", color: "#fff", border: "none", borderRadius: "10px", fontSize: "1.05rem", fontWeight: "600", cursor: "pointer" },
};
