import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import axios from "axios";
import { Eye } from "lucide-react";
import Logo from "../assets/Logo.png";
import "./Auth.css";

export default function Register() {
  const [form, setForm] = useState({ fullName: "", email: "", password: "", role: "customer" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // The backend requires extensive fields (address, cnic, phone, etc). 
      // For the demo, we inject them automatically here so registration succeeds.
      const payload = {
        fullName: form.fullName,
        email: form.email,
        password: form.password,
        role: form.role,
        phone: "+1234567890",
        cnic: "12345-6789012-3",
        dob: "2000-01-01",
        address: { country: "US", city: "New York", address: "123 Main St" }
      };

      if (form.role === "designer") {
        payload.designerInfo = { storeName: `${form.fullName}'s Designs` };
      }
      if (form.role === "manufacturer") {
        payload.manufacturerInfo = { 
          businessName: `${form.fullName} Manufacturing`, 
          ntn: "1234567-8",
          businessAddress: payload.address,
          productionTypes: ["Garments", "Accessories"]
        };
      }

      await axios.post("http://localhost:5000/api/auth/register", payload);
      navigate("/verify-email", { state: { email: form.email } });
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors && Array.isArray(data.errors)) {
        setError(data.errors.join(", "));
      } else {
        setError(data?.message || err.message || "Registration failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-bg">
      <div className="auth-card">
        <div className="auth-logo">
          <img src={Logo} alt="Orli" />
        </div>
        <h1 className="auth-title">Create your account</h1>
        <p className="auth-subtitle">Join the Orli marketplace</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input id="fullName" type="text" placeholder="Your name" value={form.fullName} onChange={update("fullName")} required />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" placeholder="you@example.com" value={form.email} onChange={update("email")} required />
          </div>
          <div className="form-group" style={{ position: "relative" }}>
            <label htmlFor="password">Password</label>
            <input 
              id="password" 
              type={showPassword ? "text" : "password"} 
              placeholder="Min 8 characters" 
              value={form.password} 
              onChange={update("password")} 
              required 
              minLength={8} 
              style={{ paddingRight: "40px" }}
            />
            <button 
              type="button" 
              className="btn-text"
              onClick={() => setShowPassword(!showPassword)}
              style={{ position: "absolute", right: "12px", bottom: "10px", color: "#666", display: "flex", alignItems: "center" }}
            >
              <Eye size={18} />
            </button>
          </div>
          <div className="form-group">
            <label htmlFor="role">I am a…</label>
            <select id="role" value={form.role} onChange={update("role")}>
              <option value="customer">Customer</option>
              <option value="designer">Designer</option>
              <option value="manufacturer">Manufacturer / Supplier</option>
            </select>
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="auth-footer-text">
          Already have an account?{" "}
          <Link to="/login" className="auth-link">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
