import { useEffect, useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import "./Portfolio.css"

const Portfolio = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}")
  const navigate = useNavigate()
  const [portfolio, setPortfolio] = useState([])
  const [newTitle, setNewTitle] = useState("")
  const [newUrl, setNewUrl] = useState("")
  const [uploadMode, setUploadMode] = useState("file")
  const [previewSrc, setPreviewSrc] = useState("")
  const [msg, setMsg] = useState("")
  const fileInputRef = useRef(null)

  const fetchData = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/designer/portfolio/${user.id}`)
      setPortfolio(res.data.portfolio)
    } catch (err) { console.error(err) }
  }

  useEffect(() => { fetchData() }, [])

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    // auto-fill title from filename if empty
    if (!newTitle) {
      const name = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ")
      setNewTitle(name.charAt(0).toUpperCase() + name.slice(1))
    }
    const reader = new FileReader()
    reader.onload = (ev) => { setPreviewSrc(ev.target.result); setNewUrl(ev.target.result) }
    reader.readAsDataURL(file)
  }

  const addDesign = async (e) => {
    e.preventDefault()
    if (!newTitle) return
    try {
      await axios.post(`http://localhost:5000/api/designer/portfolio/${user.id}`, {
        title: newTitle,
        url: newUrl || `https://via.placeholder.com/400?text=${encodeURIComponent(newTitle)}`,
      })
      setNewTitle(""); setNewUrl(""); setPreviewSrc("")
      if (fileInputRef.current) fileInputRef.current.value = ""
      showMsg("Design added!")
      fetchData()
    } catch (err) { console.error(err) }
  }

  const showMsg = (m) => { setMsg(m); setTimeout(() => setMsg(""), 3000) }

  return (
    <div className="pf-container" style={{ fontFamily: '"Poppins", sans-serif' }}>
      <h1 className="pf-title">My Portfolio</h1>
      <p className="pf-subtitle">Upload and manage your designs</p>

      {msg && <div className="pf-toast">{msg}</div>}

      {/* Upload Section */}
      <div className="pf-section pf-upload-section">
        <form onSubmit={addDesign} className="pf-upload-row">
          <div className="pf-upload-left">
            <div className="pf-upload-toggle">
              <button type="button" className={`pf-toggle-btn ${uploadMode === "file" ? "active" : ""}`} onClick={() => setUploadMode("file")}>📁 Upload File</button>
              <button type="button" className={`pf-toggle-btn ${uploadMode === "url" ? "active" : ""}`} onClick={() => setUploadMode("url")}>🔗 URL</button>
            </div>

            {uploadMode === "file" ? (
              <input ref={fileInputRef} type="file" accept=".png,.jpg,.jpeg,.jfif,.svg,image/png,image/jpeg,image/svg+xml" onChange={handleFileChange} className="pf-file-input" />
            ) : (
              <input type="text" value={newUrl} onChange={e => { setNewUrl(e.target.value); setPreviewSrc(e.target.value) }} className="pf-input" placeholder="Paste image URL..." />
            )}

            <input type="text" value={newTitle} onChange={e => setNewTitle(e.target.value)} required className="pf-input" placeholder="Design name" />
            <button type="submit" className="pf-add-btn">+ Add to Portfolio</button>
          </div>

          {previewSrc && (
            <div className="pf-upload-preview">
              <img src={previewSrc} alt="Preview" />
            </div>
          )}
        </form>
      </div>

      {/* Designs Grid */}
      <h3 className="pf-section-title">Designs ({portfolio.length})</h3>
      {portfolio.length === 0 ? (
        <p className="pf-empty">No designs yet. Upload your first creation above!</p>
      ) : (
        <div className="pf-grid">
          {portfolio.map((item, idx) => (
            <div key={idx} className="pf-card" onClick={() => navigate(`/designer/portfolio/${idx}`)}>
              {item.published && <span className="pf-pub-badge">Live</span>}
              <div className="pf-card-img">
                {item.url ? <img src={item.url} alt={item.title} /> : <span>No Preview</span>}
              </div>
              <div className="pf-card-body">
                <h4>{item.title}</h4>
                <p className="pf-card-status">{item.published ? "Published" : "Draft"}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Portfolio
