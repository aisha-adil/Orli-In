"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import "./Login.css"
import Logo from "../assets/Logo.png"

const Register = () => {
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const onFinish = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        name,
        email,
        password,
      })
      navigate("/login")
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed")
    }
    setLoading(false)
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <img
            src={Logo}
            alt="Logo"
            style={{ height: 100 }}
          />
          <h1>Create Account</h1>
          <p className="subtitle">Join Orli and start managing your products</p>
        </div>

        <form onSubmit={onFinish} className="auth-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="name">Business Name</label>
            <input
              id="name"
              type="text"
              placeholder="Your business name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Create a strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{" "}
            <a href="#" onClick={() => navigate("/login")}>
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register
