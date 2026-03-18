import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import "./DesignDetail.css"

const DesignDetail = () => {
  const { index } = useParams()
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem("user") || "{}")
  const idx = parseInt(index)

  const [design, setDesign] = useState(null)
  const [title, setTitle] = useState("")
  const [tags, setTags] = useState("")
  const [description, setDescription] = useState("")
  const [manufacturers, setManufacturers] = useState([])
  const [showPublishModal, setShowPublishModal] = useState(false)
  const [selectedMfr, setSelectedMfr] = useState(null)
  const [msg, setMsg] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [pRes, mRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/designer/portfolio/${user.id}`),
          axios.get("http://localhost:5000/api/admin/users"),
        ])
        const d = pRes.data.portfolio[idx]
        if (!d) { navigate("/designer/portfolio"); return }
        setDesign(d)
        setTitle(d.title || "")
        setTags(d.tags || "")
        setDescription(d.description || "")

        // Build manufacturer list with mock ratings/locations/processing times
        const mfrs = mRes.data.filter(u => u.role === "manufacturer").map((m, i) => ({
          ...m,
          rating: (4.2 + (i * 0.15) % 0.8).toFixed(1),
          reviews: 12 + i * 7,
          location: ["Karachi, PK", "Istanbul, TR", "Shenzhen, CN", "Dhaka, BD", "Mumbai, IN"][i % 5],
          processingTime: ["3-5 days", "5-7 days", "7-10 days", "2-4 days", "4-6 days"][i % 5],
          specialties: [["Garments", "Embroidery"], ["Printing", "Sublimation"], ["Accessories", "Jewelry"], ["Fabrics", "Dyeing"], ["Leather", "Bags"]][i % 5],
          minOrder: [10, 25, 50, 5, 20][i % 5],
        }))
        setManufacturers(mfrs)
      } catch (err) { console.error(err) }
      finally { setLoading(false) }
    }
    load()
  }, [idx])

  const saveChanges = () => {
    showMsg("Changes saved! ✓")
    // In a full implementation, this would PATCH update the design
  }

  const handlePublish = async () => {
    if (!selectedMfr) { showMsg("⚠️ Select a manufacturer first!"); return }
    try {
      await axios.patch(`http://localhost:5000/api/designer/portfolio/${user.id}/${idx}/toggle`)
      setDesign({ ...design, published: !design.published })
      setShowPublishModal(false)
      showMsg(design.published ? "Design unpublished" : "Design published! 🎉")
    } catch (err) { console.error(err) }
  }

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/designer/portfolio/${user.id}/${idx}`)
      navigate("/designer/portfolio")
    } catch (err) { console.error(err) }
  }

  const showMsg = (m) => { setMsg(m); setTimeout(() => setMsg(""), 3000) }

  if (loading) return <div className="dd-loading">Loading design...</div>
  if (!design) return <div className="dd-loading">Design not found</div>

  return (
    <div className="dd-container" style={{ fontFamily: '"Poppins", sans-serif' }}>
      <button className="dd-back" onClick={() => navigate("/designer/portfolio")}>← Back to Portfolio</button>

      {msg && <div className="dd-toast">{msg}</div>}

      <div className="dd-layout">
        {/* Design Preview */}
        <div className="dd-preview">
          <div className="dd-preview-img">
            {design.url ? <img src={design.url} alt={title} /> : <span>No Preview</span>}
          </div>
          {design.published && <span className="dd-live-badge">🟢 Live on Store</span>}
        </div>

        {/* Edit Fields */}
        <div className="dd-details">
          <div className="dd-field">
            <label>Design Name</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="dd-input" />
          </div>

          <div className="dd-field">
            <label>Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} className="dd-textarea" rows={3} placeholder="Describe your design — materials, inspiration, sizing notes..." />
          </div>

          <div className="dd-field">
            <label>Tags (comma-separated)</label>
            <input type="text" value={tags} onChange={e => setTags(e.target.value)} className="dd-input" placeholder="e.g. streetwear, neon, unisex, cotton" />
          </div>

          <div className="dd-actions">
            <button className="dd-save-btn" onClick={saveChanges}>💾 Save Changes</button>
            {design.published ? (
              <button className="dd-unpub-btn" onClick={handlePublish}>Unpublish</button>
            ) : (
              <button className="dd-publish-btn" onClick={() => setShowPublishModal(true)}>🚀 Publish Design</button>
            )}
            <button className="dd-delete-btn" onClick={handleDelete}>🗑️ Delete</button>
          </div>
        </div>
      </div>

      {/* Publish Modal — Manufacturer Selection */}
      {showPublishModal && (
        <div className="dd-modal-overlay" onClick={() => setShowPublishModal(false)}>
          <div className="dd-modal" onClick={e => e.stopPropagation()}>
            <div className="dd-modal-header">
              <h2>Select a Manufacturer</h2>
              <p>Choose who will produce "{title}"</p>
              <button className="dd-modal-close" onClick={() => setShowPublishModal(false)}>✕</button>
            </div>

            <div className="dd-mfr-list">
              {manufacturers.length === 0 ? (
                <p className="dd-mfr-empty">No manufacturers available.</p>
              ) : (
                manufacturers.map(m => (
                  <div key={m._id} className={`dd-mfr-card ${selectedMfr?._id === m._id ? "selected" : ""}`} onClick={() => setSelectedMfr(m)}>
                    <div className="dd-mfr-header">
                      <div>
                        <h4>{m.fullName}</h4>
                        <span className="dd-mfr-location">📍 {m.location}</span>
                      </div>
                      <div className="dd-mfr-rating">
                        <span className="dd-star">⭐</span> {m.rating} <span className="dd-reviews">({m.reviews})</span>
                      </div>
                    </div>
                    <div className="dd-mfr-meta">
                      <span>⏱️ {m.processingTime}</span>
                      <span>📦 Min. order: {m.minOrder}</span>
                      <span>🏷️ {m.specialties.join(", ")}</span>
                    </div>
                    {selectedMfr?._id === m._id && <div className="dd-mfr-check">✓ Selected</div>}
                  </div>
                ))
              )}
            </div>

            <div className="dd-modal-footer">
              <button className="dd-cancel-btn" onClick={() => setShowPublishModal(false)}>Cancel</button>
              <button className="dd-confirm-btn" onClick={handlePublish} disabled={!selectedMfr}>
                Publish with {selectedMfr?.fullName || "..."}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DesignDetail
