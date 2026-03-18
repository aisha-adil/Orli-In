"use client"

import { useState } from "react"
import "./ColorPicker.css"

const ColorPicker = ({ value, onChange }) => {
  const [showPicker, setShowPicker] = useState(false)

  const presetColors = [
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#FFA07A",
    "#98D8C8",
    "#F7DC6F",
    "#BB8FCE",
    "#85C1E2",
    "#F8B88B",
    "#52C5A5",
    "#2952A1",
    "#000000",
    "#FFFFFF",
  ]

  return (
    <div className="color-picker-wrapper">
      <div className="color-picker-display">
        <div className="color-preview" style={{ backgroundColor: value }} onClick={() => setShowPicker(!showPicker)} />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#000000"
          className="color-input"
        />
      </div>

      {showPicker && (
        <div className="color-picker-dropdown">
          <div className="preset-colors">
            {presetColors.map((color) => (
              <button
                key={color}
                className={`preset-color ${value === color ? "active" : ""}`}
                style={{ backgroundColor: color }}
                onClick={() => {
                  onChange(color)
                  setShowPicker(false)
                }}
                title={color}
              />
            ))}
          </div>

          <div className="custom-color-input">
            <input type="color" value={value} onChange={(e) => onChange(e.target.value)} />
            <span>Custom Color</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default ColorPicker
