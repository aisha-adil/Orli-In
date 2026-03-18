import { useRef, useState, useEffect, useCallback } from "react"
import "./DesignCanvas.css"

const TOOLS = [
  { key: "select", icon: "🔲", label: "Select" },
  { key: "brush", icon: "🖌️", label: "Brush" },
  { key: "eraser", icon: "🧹", label: "Eraser" },
  { key: "text", icon: "T", label: "Text" },
  { key: "rect", icon: "⬜", label: "Rectangle" },
  { key: "circle", icon: "⭕", label: "Circle" },
  { key: "line", icon: "📏", label: "Line" },
]

const DesignCanvas = () => {
  const canvasRef = useRef(null)
  const fileInputRef = useRef(null)
  const [tool, setTool] = useState("brush")
  const [color, setColor] = useState("#1a1a1a")
  const [brushSize, setBrushSize] = useState(4)
  const [isDrawing, setIsDrawing] = useState(false)
  const [history, setHistory] = useState([])
  const [historyIdx, setHistoryIdx] = useState(-1)
  const [layers, setLayers] = useState([{ id: 1, name: "Background", visible: true }, { id: 2, name: "Layer 1", visible: true }])
  const [activeLayer, setActiveLayer] = useState(2)
  const [textInput, setTextInput] = useState("")
  const [fontSize, setFontSize] = useState(24)
  const [saved, setSaved] = useState(false)
  const [startPos, setStartPos] = useState(null)

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.width = canvas.parentElement.clientWidth
    canvas.height = canvas.parentElement.clientHeight - 4
    const ctx = canvas.getContext("2d")
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    saveState()
  }, [])

  const saveState = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const data = canvas.toDataURL()
    setHistory(prev => {
      const newH = prev.slice(0, historyIdx + 1)
      newH.push(data)
      return newH
    })
    setHistoryIdx(prev => prev + 1)
  }, [historyIdx])

  const undo = () => {
    if (historyIdx <= 0) return
    const newIdx = historyIdx - 1
    setHistoryIdx(newIdx)
    restoreState(history[newIdx])
  }

  const redo = () => {
    if (historyIdx >= history.length - 1) return
    const newIdx = historyIdx + 1
    setHistoryIdx(newIdx)
    restoreState(history[newIdx])
  }

  const restoreState = (dataUrl) => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    const img = new Image()
    img.onload = () => { ctx.clearRect(0, 0, canvas.width, canvas.height); ctx.drawImage(img, 0, 0) }
    img.src = dataUrl
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handleKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z") { e.preventDefault(); undo() }
      if ((e.ctrlKey || e.metaKey) && e.key === "y") { e.preventDefault(); redo() }
      if ((e.ctrlKey || e.metaKey) && e.key === "s") { e.preventDefault(); handleSave() }
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [historyIdx, history])

  // Autosave every 30s
  useEffect(() => {
    const interval = setInterval(() => {
      const canvas = canvasRef.current
      if (canvas) {
        localStorage.setItem("orli_canvas_autosave", canvas.toDataURL())
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
      }
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  const getPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect()
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  const startDraw = (e) => {
    const pos = getPos(e)
    setIsDrawing(true)
    setStartPos(pos)

    if (tool === "text") {
      const ctx = canvasRef.current.getContext("2d")
      ctx.font = `${fontSize}px Poppins, sans-serif`
      ctx.fillStyle = color
      ctx.fillText(textInput || "Double-click to edit", pos.x, pos.y)
      saveState()
      setIsDrawing(false)
      return
    }

    if (tool === "brush" || tool === "eraser") {
      const ctx = canvasRef.current.getContext("2d")
      ctx.beginPath()
      ctx.moveTo(pos.x, pos.y)
    }
  }

  const draw = (e) => {
    if (!isDrawing) return
    const pos = getPos(e)
    const ctx = canvasRef.current.getContext("2d")

    if (tool === "brush") {
      ctx.strokeStyle = color
      ctx.lineWidth = brushSize
      ctx.lineCap = "round"
      ctx.lineJoin = "round"
      ctx.lineTo(pos.x, pos.y)
      ctx.stroke()
    } else if (tool === "eraser") {
      ctx.strokeStyle = "#ffffff"
      ctx.lineWidth = brushSize * 3
      ctx.lineCap = "round"
      ctx.lineTo(pos.x, pos.y)
      ctx.stroke()
    }
  }

  const endDraw = (e) => {
    if (!isDrawing) return
    setIsDrawing(false)
    const pos = getPos(e)
    const ctx = canvasRef.current.getContext("2d")

    if (tool === "rect" && startPos) {
      ctx.strokeStyle = color
      ctx.lineWidth = brushSize
      ctx.strokeRect(startPos.x, startPos.y, pos.x - startPos.x, pos.y - startPos.y)
    } else if (tool === "circle" && startPos) {
      const rx = Math.abs(pos.x - startPos.x) / 2
      const ry = Math.abs(pos.y - startPos.y) / 2
      const cx = startPos.x + (pos.x - startPos.x) / 2
      const cy = startPos.y + (pos.y - startPos.y) / 2
      ctx.beginPath()
      ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2)
      ctx.strokeStyle = color
      ctx.lineWidth = brushSize
      ctx.stroke()
    } else if (tool === "line" && startPos) {
      ctx.beginPath()
      ctx.moveTo(startPos.x, startPos.y)
      ctx.lineTo(pos.x, pos.y)
      ctx.strokeStyle = color
      ctx.lineWidth = brushSize
      ctx.stroke()
    }

    saveState()
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const img = new Image()
      img.onload = () => {
        const ctx = canvasRef.current.getContext("2d")
        const scale = Math.min(canvasRef.current.width / img.width, canvasRef.current.height / img.height, 1)
        const w = img.width * scale
        const h = img.height * scale
        const x = (canvasRef.current.width - w) / 2
        const y = (canvasRef.current.height - h) / 2
        ctx.drawImage(img, x, y, w, h)
        saveState()
      }
      img.src = ev.target.result
    }
    reader.readAsDataURL(file)
    e.target.value = ""
  }

  const handleSave = () => {
    const canvas = canvasRef.current
    localStorage.setItem("orli_canvas_autosave", canvas.toDataURL())
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleExport = () => {
    const canvas = canvasRef.current
    const link = document.createElement("a")
    link.download = "orli-design.png"
    link.href = canvas.toDataURL()
    link.click()
  }

  const clearCanvas = () => {
    const ctx = canvasRef.current.getContext("2d")
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height)
    saveState()
  }

  const addLayer = () => {
    const newId = Math.max(...layers.map(l => l.id)) + 1
    setLayers([...layers, { id: newId, name: `Layer ${newId}`, visible: true }])
    setActiveLayer(newId)
  }

  return (
    <div className="dc-container">
      {/* Top toolbar */}
      <div className="dc-toolbar-top">
        <div className="dc-toolbar-group">
          <button onClick={undo} className="dc-tool-btn" title="Undo (Ctrl+Z)">↩️</button>
          <button onClick={redo} className="dc-tool-btn" title="Redo (Ctrl+Y)">↪️</button>
          <div className="dc-divider" />
          <button onClick={() => fileInputRef.current.click()} className="dc-tool-btn" title="Upload Image">📁 Upload</button>
          <input ref={fileInputRef} type="file" accept=".png,.jpg,.jpeg,.svg" onChange={handleFileUpload} style={{ display: "none" }} />
          <button onClick={handleSave} className="dc-tool-btn" title="Save (Ctrl+S)">💾 Save</button>
          <button onClick={handleExport} className="dc-tool-btn" title="Export as PNG">📥 Export</button>
          <button onClick={clearCanvas} className="dc-tool-btn dc-danger" title="Clear Canvas">🗑️ Clear</button>
        </div>
        <div className="dc-toolbar-group">
          {saved && <span className="dc-saved-badge">✓ Saved</span>}
          <span className="dc-info">Canvas {canvasRef.current?.width}×{canvasRef.current?.height}</span>
        </div>
      </div>

      <div className="dc-workspace">
        {/* Left tool sidebar */}
        <div className="dc-tool-sidebar">
          {TOOLS.map(t => (
            <button key={t.key} onClick={() => setTool(t.key)} className={`dc-sidebar-btn ${tool === t.key ? "active" : ""}`} title={t.label}>
              <span className="dc-sidebar-icon">{t.icon}</span>
              <span className="dc-sidebar-label">{t.label}</span>
            </button>
          ))}
          <div className="dc-divider-h" />
          <div className="dc-tool-option">
            <label>Color</label>
            <input type="color" value={color} onChange={e => setColor(e.target.value)} className="dc-color-picker" />
          </div>
          <div className="dc-tool-option">
            <label>Size</label>
            <input type="range" min="1" max="30" value={brushSize} onChange={e => setBrushSize(+e.target.value)} />
            <span>{brushSize}px</span>
          </div>
          {tool === "text" && (
            <>
              <div className="dc-tool-option">
                <label>Text</label>
                <input type="text" value={textInput} onChange={e => setTextInput(e.target.value)} placeholder="Type here…" className="dc-text-input" />
              </div>
              <div className="dc-tool-option">
                <label>Font Size</label>
                <input type="range" min="12" max="72" value={fontSize} onChange={e => setFontSize(+e.target.value)} />
                <span>{fontSize}px</span>
              </div>
            </>
          )}
        </div>

        {/* Canvas area */}
        <div className="dc-canvas-area">
          <canvas
            ref={canvasRef}
            onMouseDown={startDraw}
            onMouseMove={draw}
            onMouseUp={endDraw}
            onMouseLeave={endDraw}
            className="dc-canvas"
            style={{ cursor: tool === "brush" ? "crosshair" : tool === "eraser" ? "cell" : tool === "text" ? "text" : "default" }}
          />
        </div>

        {/* Right panel — layers */}
        <div className="dc-layers-panel">
          <div className="dc-panel-header">
            <h4>Layers</h4>
            <button onClick={addLayer} className="dc-add-layer" title="Add Layer">+</button>
          </div>
          <div className="dc-layers-list">
            {layers.map(l => (
              <div key={l.id} className={`dc-layer-item ${activeLayer === l.id ? "active" : ""}`} onClick={() => setActiveLayer(l.id)}>
                <button onClick={(e) => { e.stopPropagation(); setLayers(layers.map(la => la.id === l.id ? { ...la, visible: !la.visible } : la)) }} className="dc-layer-vis">
                  {l.visible ? "👁️" : "🚫"}
                </button>
                <span>{l.name}</span>
              </div>
            ))}
          </div>

          <div className="dc-panel-header" style={{ marginTop: "24px" }}>
            <h4>AI Tools</h4>
          </div>
          <div className="dc-ai-tools">
            <button className="dc-ai-btn">✨ Auto-fill Background</button>
            <button className="dc-ai-btn">🎨 Color Suggest</button>
            <button className="dc-ai-btn">📐 Smart Align</button>
            <button className="dc-ai-btn">🖼️ Generate Mockup</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DesignCanvas
