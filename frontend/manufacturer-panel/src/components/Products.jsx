"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Plus, Trash2, Upload, X, Bold, Italic, Underline, List, ListOrdered, AlertCircle } from "lucide-react"
import axios from "axios"
import ColorPicker from "./ColorPicker"
import CustomSelect from "./CustomSelect"
import "./Products.css"

const Products = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    sizeTable: null,
    sizeTablePreview: null,
    productionTime: "",
    shippingTime: "",
    tags: [],
    tagInput: "",
    variants: [],
    images: [],
    imagePreview: [],
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [unsavedChanges, setUnsavedChanges] = useState(false)
  const [showDiscardWarning, setShowDiscardWarning] = useState(false)
  const [pendingNavigation, setPendingNavigation] = useState(null)
  const [imageModal, setImageModal] = useState({ visible: false, src: '', alt: '' })
  const navigate = useNavigate()
  const params = useParams()
  const fileInputRef = useRef(null)
  const sizeTableRef = useRef(null)
  const editorRef = useRef(null)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) navigate("/login")
  }, [navigate])

  useEffect(() => {
    if (params.id) {
      fetchProduct(params.id)
    }
  }, [params.id])

  const fetchProduct = async (id) => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get(`http://localhost:5000/api/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const product = response.data
      setFormData({
        title: product.title,
        description: product.description,
        sizeTable: null, // Can't restore file
        sizeTablePreview: product.sizeTable || null, // Show existing size table
        productionTime: product.variants[0]?.productionTime || "",
        shippingTime: product.variants[0]?.shippingTime || "",
        tags: product.tags || [],
        tagInput: "",
        variants: product.variants || [],
        images: [], // Can't restore files
        imagePreview: product.images || [],
      })
      if (editorRef.current) {
        editorRef.current.innerHTML = product.description
      }
    } catch (err) {
      console.error("Failed to fetch product:", err)
    }
  }

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (unsavedChanges) {
        e.preventDefault()
        e.returnValue = ""
      }
    }
    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [unsavedChanges])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setUnsavedChanges(true)
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    const previews = files.map((file) => URL.createObjectURL(file))
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
      imagePreview: [...prev.imagePreview, ...previews],
    }))
    setUnsavedChanges(true)
  }

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
      imagePreview: prev.imagePreview.filter((_, i) => i !== index),
    }))
    setUnsavedChanges(true)
  }

  const handleSizeTableChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const preview = URL.createObjectURL(file)
      setFormData((prev) => ({
        ...prev,
        sizeTable: file,
        sizeTablePreview: preview
      }))
      setUnsavedChanges(true)
    }
  }

  const handleTagInput = (e) => {
    setFormData((prev) => ({ ...prev, tagInput: e.target.value }))
  }

  const addTag = () => {
    const trimmed = formData.tagInput.trim()
    if (trimmed && !formData.tags.includes(trimmed)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, trimmed],
        tagInput: "",
      }))
      setUnsavedChanges(true)
    }
  }

  const removeTag = (index) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }))
    setUnsavedChanges(true)
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addTag()
    }
  }

  const applyFormat = (command, value = null) => {
    document.execCommand(command, false, value)
    editorRef.current?.focus()
    setUnsavedChanges(true)
  }

  const addVariant = () => {
    setFormData((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
        {
          color: "#2952A1",
          size: "M",
          cost: "",
          productionTime: "",
          shippingTime: "",
          inventory: 100,
        },
      ],
    }))
    setUnsavedChanges(true)
  }

  const updateVariant = (index, field, value) => {
    setFormData((prev) => {
      const newVariants = [...prev.variants]
      newVariants[index][field] = value
      return { ...prev, variants: newVariants }
    })
    setUnsavedChanges(true)
  }

  const removeVariant = (index) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }))
    setUnsavedChanges(true)
  }

  const handleNavigate = (path) => {
    if (unsavedChanges) {
      setPendingNavigation(path)
      setShowDiscardWarning(true)
    } else {
      navigate(path)
    }
  }

  const handleDiscard = () => {
    setUnsavedChanges(false)
    setShowDiscardWarning(false)
    if (pendingNavigation) {
      navigate(pendingNavigation)
    }
  }

  const openImageModal = (src, alt = 'Image') => {
    setImageModal({ visible: true, src, alt })
  }

  const closeImageModal = () => {
    setImageModal({ visible: false, src: '', alt: '' })
  }

  const onFinish = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    const formDataToSend = new FormData()
    formDataToSend.append("title", formData.title)
    formDataToSend.append("description", editorRef.current?.innerHTML || "")
    formDataToSend.append("productionTime", formData.productionTime)
    formDataToSend.append("shippingTime", formData.shippingTime)
    formDataToSend.append("tags", JSON.stringify(formData.tags))
    formDataToSend.append("variants", JSON.stringify(formData.variants))

    if (formData.sizeTable) {
      formDataToSend.append("sizeTable", formData.sizeTable)
    }

    formData.images?.forEach((file) => formDataToSend.append("images", file))

    try {
      const token = localStorage.getItem("token")
      const isEdit = !!params.id
      const url = isEdit ? `http://localhost:5000/api/products/${params.id}` : "http://localhost:5000/api/products"
      const method = isEdit ? "put" : "post"

      await axios[method](url, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      })
      setMessage({ type: "success", text: `Product ${isEdit ? 'updated' : 'created'} successfully!` })
      setUnsavedChanges(false)
      setTimeout(() => navigate("/products"), 1500)
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || `Failed to ${params.id ? 'update' : 'create'} product`,
      })
    }
    setLoading(false)
  }

  const tShirtSizes = [
    { label: "Extra Small", value: "XS" },
    { label: "Small", value: "S" },
    { label: "Medium", value: "M" },
    { label: "Large", value: "L" },
    { label: "Extra Large", value: "XL" },
    { label: "XXL", value: "XXL" },
    { label: "XXXL", value: "XXXL" },
  ]

  return (
    <div className="products">
      {showDiscardWarning && (
        <div className="discard-warning-overlay">
          <div className="discard-warning-modal">
            <div className="warning-icon">
              <AlertCircle size={24} />
            </div>
            <h3>Discard changes?</h3>
            <p>You have unsaved changes. Are you sure you want to leave?</p>
            <div className="warning-actions">
              <button className="btn-continue" onClick={() => setShowDiscardWarning(false)}>
                Continue Editing
              </button>
              <button className="btn-discard" onClick={handleDiscard}>
                Discard Changes
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="products-header">
        <h1>{params.id ? 'Edit Product' : 'Create Product'}</h1>
        <p>{params.id ? 'Update your product details' : 'Add a new product to your catalog'}</p>
      </div>

      <div className="product-form-container">
        {message && <div className={`message ${message.type}`}>{message.text}</div>}

        <form onSubmit={onFinish} className="product-form">
          {/* Product Images */}
          <div className="form-section">
            <h2>Product Images</h2>
            <div className="form-group">
              <div className="file-upload" onClick={() => fileInputRef.current?.click()}>
                <Upload size={28} />
                <div>
                  <p>Drag and drop your images here</p>
                  <span>or click to browse</span>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                />
              </div>
              {formData.imagePreview.length > 0 && (
                <div className="image-preview-grid">
                  {formData.imagePreview.map((preview, i) => (
                    <div key={i} className="image-preview-item">
                      <img
                        src={preview || "/placeholder.svg"}
                        alt={`Preview ${i}`}
                        onClick={() => openImageModal(preview, `Product Image ${i + 1}`)}
                        style={{ cursor: 'pointer' }}
                      />
                      <button type="button" className="btn-remove-image" onClick={() => removeImage(i)}>
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Listing Details */}
          <div className="form-section">
            <h2>Listing Details</h2>

            <div className="form-group">
              <label>Product Title</label>
              <input
                type="text"
                name="title"
                placeholder="e.g., Premium Cotton T-Shirt"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <div className="editor-toolbar">
                <button type="button" className="toolbar-btn" onClick={() => applyFormat("bold")} title="Bold">
                  <Bold size={16} />
                </button>
                <button type="button" className="toolbar-btn" onClick={() => applyFormat("italic")} title="Italic">
                  <Italic size={16} />
                </button>
                <button
                  type="button"
                  className="toolbar-btn"
                  onClick={() => applyFormat("underline")}
                  title="Underline"
                >
                  <Underline size={16} />
                </button>
                <div className="toolbar-divider"></div>
                <button
                  type="button"
                  className="toolbar-btn"
                  onClick={() => applyFormat("insertUnorderedList")}
                  title="Bullet List"
                >
                  <List size={16} />
                </button>
                <button
                  type="button"
                  className="toolbar-btn"
                  onClick={() => applyFormat("insertOrderedList")}
                  title="Numbered List"
                >
                  <ListOrdered size={16} />
                </button>
              </div>
              <div
                ref={editorRef}
                className="rich-text-editor"
                contentEditable
                placeholder="Describe your product..."
              />
            </div>

            <div className="form-group">
              <label>Size Table (Optional)</label>
              <div className="file-upload-secondary" onClick={() => sizeTableRef.current?.click()}>
                <Upload size={20} />
                <span>Upload size table image</span>
                <input
                  ref={sizeTableRef}
                  type="file"
                  accept="image/*"
                  onChange={handleSizeTableChange}
                  style={{ display: "none" }}
                />
              </div>
              {formData.sizeTablePreview && (
                <div className="size-table-preview">
                  <div className="size-table-preview-item">
                    <img
                      src={formData.sizeTablePreview}
                      alt="Size table preview"
                      onClick={() => openImageModal(formData.sizeTablePreview, 'Size Table')}
                      style={{ cursor: 'pointer' }}
                    />
                    <button
                      type="button"
                      className="btn-remove-image"
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          sizeTable: null,
                          sizeTablePreview: null
                        }))
                        setUnsavedChanges(true)
                      }}
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="form-group">
              <label>Tags</label>
              <div className="tags-input-group">
                <input
                  type="text"
                  placeholder="Add tags and press Enter..."
                  value={formData.tagInput}
                  onChange={handleTagInput}
                  onKeyPress={handleKeyPress}
                />
                <button type="button" className="btn-add-tag" onClick={addTag}>
                  Add
                </button>
              </div>
              {formData.tags.length > 0 && (
                <div className="tags-display">
                  {formData.tags.map((tag, i) => (
                    <span key={i} className="tag-badge">
                      {tag}
                      <button type="button" className="btn-remove-tag" onClick={() => removeTag(i)}>
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Variants */}
          <div className="form-section">
            <div className="section-header-flex">
              <div>
                <h2>Variants</h2>
                <p>Add color, size, cost and inventory options</p>
              </div>
              <button type="button" className="btn-secondary" onClick={addVariant}>
                <Plus size={18} />
                Add Variant
              </button>
            </div>

            <div className="variants-list">
              {formData.variants.map((variant, index) => (
                <div key={index} className="variant-card">
                  <div className="variant-grid">
                    <div className="form-group">
                      <label>Color</label>
                      <ColorPicker value={variant.color} onChange={(color) => updateVariant(index, "color", color)} />
                    </div>
                    <div className="form-group">
                      <label>Size</label>
                      <CustomSelect
                        value={variant.size}
                        onChange={(size) => updateVariant(index, "size", size)}
                        options={tShirtSizes}
                        placeholder="Select size"
                      />
                    </div>
                    <div className="form-group">
                      <label>Cost ($)</label>
                      <input
                        type="number"
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        value={variant.cost}
                        onChange={(e) => updateVariant(index, "cost", e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>Production Time (days)</label>
                      <input
                        type="number"
                        placeholder="1"
                        min="1"
                        value={variant.productionTime}
                        onChange={(e) => updateVariant(index, "productionTime", e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>Shipping Time (days)</label>
                      <input
                        type="number"
                        placeholder="1"
                        min="1"
                        value={variant.shippingTime}
                        onChange={(e) => updateVariant(index, "shippingTime", e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>Inventory</label>
                      <input
                        type="number"
                        placeholder="100"
                        min="0"
                        value={variant.inventory}
                        onChange={(e) => updateVariant(index, "inventory", e.target.value)}
                      />
                    </div>
                  </div>
                  <button type="button" className="btn-remove" onClick={() => removeVariant(index)}>
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="form-actions">
            <button type="button" className="btn-discard-form" onClick={() => handleNavigate("/products")}>
              Discard
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? (params.id ? "Updating..." : "Creating...") : (params.id ? "Update Product" : "Create Product")}
            </button>
          </div>
        </form>
      </div>

      {/* Image Modal */}
      {imageModal.visible && (
        <div className="image-modal-overlay" onClick={closeImageModal}>
          <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
            <img src={imageModal.src} alt={imageModal.alt}className="image-modal-image" />
          </div>
        </div>
      )}
    </div>
  )
}

export default Products
