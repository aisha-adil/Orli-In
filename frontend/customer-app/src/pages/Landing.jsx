import { Link } from "react-router-dom";
import Logo from "../assets/Logo.png";
import "./Landing.css";

export default function Landing() {
  return (
    <div className="landing-page">
      <nav className="landing-nav">
        <div className="nav-logo"><img src={Logo} alt="Orli" /></div>
        <div className="nav-links">
          <a href="#about" className="nav-link">About</a>
          <a href="#features" className="nav-link">Features</a>
          <Link to="/shop" className="nav-link">Explore Store</Link>
          <Link to="/login" className="nav-link">Log In</Link>
          <Link to="/register" className="btn-primary nav-btn">Get Started</Link>
        </div>
      </nav>

      <header className="hero-section">
        <div className="hero-content">
          <div className="badge-pill">✨ The Future of Custom Fashion</div>
          <h1 className="hero-title">
            Where <span className="highlight">Designers</span> Meet <span className="highlight">Makers</span>
          </h1>
          <p className="hero-subtitle">
            Orli bridges the gap between creative vision and premium manufacturing. 
            Whether you are an independent artist, a world-class supplier, or a trendsetting customer — your marketplace awaits.
          </p>
          <div className="hero-actions">
            <Link to="/shop" className="btn-primary hero-btn">Explore the Store</Link>
            <Link to="/register" className="btn-secondary hero-btn">Join the Revolution</Link>
          </div>
        </div>
        <div className="hero-graphics">
          <div className="glass-card float-1"><div className="g-icon">🎨</div><h3>Design</h3><p>Upload your SVGs</p></div>
          <div className="glass-card float-2"><div className="g-icon">🧵</div><h3>Manufacture</h3><p>Premium suppliers</p></div>
          <div className="glass-card float-3"><div className="g-icon">🛍️</div><h3>Sell</h3><p>Global storefronts</p></div>
        </div>
      </header>

      {/* ABOUT SECTION */}
      <section id="about" className="landing-section">
        <div className="section-inner">
          <h2 className="section-title">About <span className="highlight">Orli</span></h2>
          <p className="section-text">
            Orli is a multi-sided e-commerce platform that connects independent designers, premium manufacturers, 
            and fashion-forward customers in one seamless ecosystem. Designers upload their creations, choose from 
            vetted manufacturing partners (like Printify or Gelato), publish to their personal storefronts, and 
            customers discover unique, on-demand products — all without middlemen.
          </p>
          <div className="about-stats">
            <div className="stat-card"><h3>50+</h3><p>Active Designers</p></div>
            <div className="stat-card"><h3>10K+</h3><p>Products Listed</p></div>
            <div className="stat-card"><h3>99%</h3><p>Satisfaction Rate</p></div>
            <div className="stat-card"><h3>24/7</h3><p>Support Available</p></div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="features" className="landing-section alt-bg">
        <div className="section-inner">
          <h2 className="section-title">How It Works</h2>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-num">01</div>
              <h3>Designers Create</h3>
              <p>Upload SVG/PNG designs, use the built-in canvas tool, and build a stunning portfolio.</p>
            </div>
            <div className="step-card">
              <div className="step-num">02</div>
              <h3>Choose a Manufacturer</h3>
              <p>Pick from vetted manufacturing partners to produce your designs on premium materials.</p>
            </div>
            <div className="step-card">
              <div className="step-num">03</div>
              <h3>Publish & Sell</h3>
              <p>Launch your personal storefront and let customers discover your unique creations.</p>
            </div>
            <div className="step-card">
              <div className="step-num">04</div>
              <h3>Customers Shop</h3>
              <p>Browse curated collections, get AI-powered recommendations, and checkout seamlessly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="landing-section cta-section">
        <div className="section-inner" style={{ textAlign: "center" }}>
          <h2 className="section-title">Ready to Get Started?</h2>
          <p className="section-text">Join thousands of creators and shoppers on the Orli platform.</p>
          <div className="hero-actions" style={{ justifyContent: "center" }}>
            <Link to="/register" className="btn-primary hero-btn">Create Free Account</Link>
            <Link to="/shop" className="btn-secondary hero-btn">Browse the Store</Link>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="footer-inner">
          <img src={Logo} alt="Orli" style={{ height: "32px", opacity: 0.6 }} />
          <p>© 2026 Orli. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
