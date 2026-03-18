import { useEffect, useState, useRef } from "react"
import "./Storefront.css"

const Storefront = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}")
  const [storeName, setStoreName] = useState("")
  const [storeDesc, setStoreDesc] = useState("Welcome to my design store! Browse unique creations.")
  const [storeLogo, setStoreLogo] = useState("")
  const [seoTitle, setSeoTitle] = useState("")
  const [seoKeywords, setSeoKeywords] = useState("")
  const [msg, setMsg] = useState("")
  const logoInputRef = useRef(null)

  useEffect(() => {
    import("axios").then(({ default: axios }) => {
      axios.get(`http://localhost:5000/api/designer/portfolio/${user.id}`)
        .then(r => setStoreName(r.data.storeName || ""))
        .catch(console.error)
    })
  }, [])

  const handleLogoUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setStoreLogo(ev.target.result)
    reader.readAsDataURL(file)
  }

  const showMsg = (m) => { setMsg(m); setTimeout(() => setMsg(""), 3000) }

  return (
    <div className="sf-container">
      <h1 className="sf-title">Storefront Settings</h1>
      <p className="sf-subtitle">Customize how your store appears to customers</p>

      {msg && <div className="sf-toast">{msg}</div>}

      {/* Store Identity */}
      <div className="sf-section">
        <h3>🏪 Store Identity</h3>
        <div className="sf-form-grid">
          <div className="sf-field">
            <label>Store Name</label>
            <input type="text" value={storeName} onChange={e => setStoreName(e.target.value)} className="sf-input" placeholder="Your store name" />
          </div>
          <div className="sf-field">
            <label>Store Logo (PNG upload)</label>
            <div className="sf-logo-upload">
              <input ref={logoInputRef} type="file" accept=".png,image/png" onChange={handleLogoUpload} className="sf-file-input" />
              {storeLogo && (
                <div className="sf-logo-preview">
                  <img src={storeLogo} alt="Store Logo" />
                  <button className="sf-logo-remove" onClick={() => { setStoreLogo(""); if (logoInputRef.current) logoInputRef.current.value = "" }}>✕</button>
                </div>
              )}
            </div>
          </div>
          <div className="sf-field sf-full">
            <label>Store Description</label>
            <textarea value={storeDesc} onChange={e => setStoreDesc(e.target.value)} className="sf-textarea" rows={3} placeholder="Tell customers about your brand..." />
          </div>
        </div>
      </div>

      {/* SEO Settings */}
      <div className="sf-section">
        <h3>🔍 SEO Settings</h3>
        <p className="sf-hint">Optimize how your store appears in search results.</p>
        <div className="sf-form-grid">
          <div className="sf-field sf-full">
            <label>SEO Title</label>
            <input type="text" value={seoTitle} onChange={e => setSeoTitle(e.target.value)} className="sf-input" placeholder="e.g. Neon Streetwear Designs — Orli Store" />
          </div>
          <div className="sf-field sf-full">
            <label>SEO Keywords (comma-separated)</label>
            <input type="text" value={seoKeywords} onChange={e => setSeoKeywords(e.target.value)} className="sf-input" placeholder="e.g. streetwear, neon, custom designs, t-shirts" />
          </div>
        </div>
      </div>

      {/* Store Appearance Preview */}
      <div className="sf-section">
        <h3>🎨 Store Preview</h3>
        <p className="sf-hint">This is how your storefront will look to visitors.</p>
        <div className="sf-store-preview">
          <div className="sf-store-preview-header">
            {storeLogo && <img src={storeLogo} alt="Logo" className="sf-preview-logo" />}
            <h2>{storeName || "Your Store"}</h2>
          </div>
          <p>{storeDesc || "No description yet."}</p>
        </div>
      </div>

      <button className="sf-save-btn" onClick={() => showMsg("Store settings saved! ✓")}>Save All Settings</button>
    </div>
  )
}

export default Storefront
