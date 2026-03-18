"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { Plus, Search, MoreVertical } from "lucide-react"
import axios from "axios"
import "./ProductsList.css"

const ProductsList = () => {
  const [products, setProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [selectedProducts, setSelectedProducts] = useState(new Set())
  const [openMenuId, setOpenMenuId] = useState(null)
  const menuRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      navigate("/login")
      return
    }
    fetchProducts()
  }, [navigate])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenuId(null)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get("http://localhost:5000/api/products", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setProducts(response.data)
    } catch (err) {
      console.error("Failed to fetch products:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectProduct = (productId) => {
    const newSelected = new Set(selectedProducts)
    if (newSelected.has(productId)) {
      newSelected.delete(productId)
    } else {
      newSelected.add(productId)
    }
    setSelectedProducts(newSelected)
  }

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedProducts(new Set(products.map((p) => p._id)))
    } else {
      setSelectedProducts(new Set())
    }
  }

  const handleEdit = (product) => {
    navigate(`/products/edit/${product._id}`, { state: { product } })
  }

  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return
    try {
      const token = localStorage.getItem("token")
      await axios.delete(`http://localhost:5000/api/products/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setProducts(products.filter((p) => p._id !== productId))
      setOpenMenuId(null)
    } catch (err) {
      console.error("Failed to delete product:", err)
    }
  }

  const handleDuplicate = async (product) => {
    try {
      const token = localStorage.getItem("token")
      const { _id, createdAt, updatedAt, ...productData } = product
      console.log("Duplicating product:", productData)

      // Send as FormData to match the expected multipart format
      const formData = new FormData()
      formData.append("title", `${product.title} - copy`)
      formData.append("description", productData.description || "")
      formData.append("tags", JSON.stringify(productData.tags || []))
      formData.append("variants", JSON.stringify(productData.variants || []))

      // Include existing images and size table URLs
      if (productData.images && productData.images.length > 0) {
        formData.append("existingImages", JSON.stringify(productData.images))
      }
      if (productData.sizeTable) {
        formData.append("existingSizeTable", productData.sizeTable)
      }
      if (productData.designFiles && productData.designFiles.length > 0) {
        formData.append("existingDesignFiles", JSON.stringify(productData.designFiles))
      }

      const response = await axios.post(
        "http://localhost:5000/api/products",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      )
      setProducts([...products, response.data])
      setOpenMenuId(null)
    } catch (err) {
      console.error("Failed to duplicate product:", err)
      console.error("Error response:", err.response?.data)
      console.error("Error status:", err.response?.status)
    }
  }

  const handleTogglePublish = async (product) => {
    try {
      const token = localStorage.getItem("token")
      await axios.patch(
        `http://localhost:5000/api/products/${product._id}`,
        { published: !product.published },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      setProducts(products.map((p) => (p._id === product._id ? { ...p, published: !p.published } : p)))
      setOpenMenuId(null)
    } catch (err) {
      console.error("Failed to update product:", err)
    }
  }

  const getLowestInventory = (variants) => {
    if (!variants || variants.length === 0) return 0
    return Math.min(...variants.map((v) => v.inventory || 0))
  }

  const getUniqueCount = (field) => (product) => {
    if (!product.variants) return 0
    const unique = new Set(product.variants.map((v) => v[field]))
    return unique.size
  }

  const filteredProducts = products.filter((p) => p.title.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="products-list">
      <div className="products-list-header">
        <div>
          <h1>Products</h1>
          <p>Manage and organize all your products</p>
        </div>
        <button className="btn-create" onClick={() => navigate("/products/create")}>
          <Plus size={18} />
          Create New Product
        </button>
      </div>

      <div className="products-container">
        <div className="search-bar">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="loading">Loading products...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="empty-state">
            <p>No products found. Start by creating your first product!</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="products-table">
              <thead>
                <tr>
                  <th className="checkbox-col">
                    <input
                      type="checkbox"
                      checked={selectedProducts.size === products.length && products.length > 0}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th>Product</th>
                  <th>Sizes</th>
                  <th>Colors</th>
                  <th>Inventory</th>
                  <th>Status</th>
                  <th className="actions-col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product._id} className={selectedProducts.has(product._id) ? "selected" : ""}>
                    <td className="checkbox-col">
                      <input
                        type="checkbox"
                        checked={selectedProducts.has(product._id)}
                        onChange={() => handleSelectProduct(product._id)}
                      />
                    </td>
                    <td className="product-cell">
                      <div className="product-info">
                        <div className="product-image">
                          {product.images && product.images.length > 0 ? (
                            <img src={product.images[0] || "/placeholder.svg"} alt={product.title} />
                          ) : (
                            <div className="placeholder-image"></div>
                          )}
                        </div>
                        <div className="product-details">
                          <p className="product-title">{product.title}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge">{getUniqueCount("size")(product)}</span>
                    </td>
                    <td>
                      <span className="badge">{getUniqueCount("color")(product)}</span>
                    </td>
                    <td>
                      <span className="inventory">{getLowestInventory(product.variants)}</span>
                    </td>
                    <td>
                      <span className={`status ${product.published ? "published" : "unpublished"}`}>
                        {product.published ? "Published" : "Unpublished"}
                      </span>
                    </td>
                    <td className="actions-cell">
                      <div className="action-menu-wrapper" ref={menuRef}>
                        <button
                          className="action-menu-btn"
                          onClick={() => setOpenMenuId(openMenuId === product._id ? null : product._id)}
                        >
                          <MoreVertical size={16} />
                        </button>
                        {openMenuId === product._id && (
                          <div className="action-dropdown">
                            <button className="dropdown-item edit" onClick={() => handleEdit(product)}>
                              Edit
                            </button>
                            <button className="dropdown-item duplicate" onClick={() => handleDuplicate(product)}>
                              Duplicate
                            </button>
                            <button className="dropdown-item publish" onClick={() => handleTogglePublish(product)}>
                              {product.published ? "Unpublish" : "Publish"}
                            </button>
                            <button className="dropdown-item delete" onClick={() => handleDelete(product._id)}>
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductsList
