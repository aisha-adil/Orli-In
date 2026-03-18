"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import "./CustomSelect.css"

const CustomSelect = ({ value, onChange, options, placeholder = "Select..." }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="custom-select-wrapper">
      <button type="button" className="custom-select-button" onClick={() => setIsOpen(!isOpen)}>
        <span>{value ? options.find((o) => o.value === value)?.label : placeholder}</span>
        <ChevronDown size={18} />
      </button>

      {isOpen && (
        <div className="custom-select-dropdown">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`custom-select-item ${value === option.value ? "active" : ""}`}
              onClick={() => {
                onChange(option.value)
                setIsOpen(false)
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default CustomSelect
