import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import axios from "axios";
import Logo from "../assets/Logo.png";
import "./Auth.css";

export default function VerifyEmail() {
  const { state } = useLocation();
  const [email, setEmail] = useState(state?.email || "");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/auth/verify-email", { email, otp });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/resend-otp", { email });
      alert("OTP resent — check your email (or backend console)");
    } catch (err) {
      setError("Could not resend OTP");
    }
  };

  return (
    <div className="auth-bg">
      <div className="auth-card">
        <div className="auth-logo"><img src={Logo} alt="Orli" /></div>
        <h1 className="auth-title">Verify your email</h1>
        <p className="auth-subtitle">Enter the code we sent to <strong>{email}</strong></p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          {!state?.email && (
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
          )}
          <div className="form-group">
            <label htmlFor="otp">OTP Code</label>
            <input id="otp" type="text" placeholder="6-digit code" value={otp} onChange={(e) => setOtp(e.target.value)} required maxLength={6} />
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Verifying…" : "Verify email"}
          </button>
        </form>

        <p className="auth-footer-text">
          Didn't get the code?{" "}
          <button className="auth-link btn-text" onClick={resend}>Resend OTP</button>
        </p>
        <p className="auth-footer-text">
          <Link to="/login" className="auth-link">Back to sign in</Link>
        </p>
      </div>
    </div>
  );
}
