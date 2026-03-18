"use client"

import { useState } from "react"
import "./CustomCalendar.css"

const CustomCalendar = ({ onDateRangeChange }) => {
  const [startDate, setStartDate] = useState(new Date(2024, 0, 1))
  const [endDate, setEndDate] = useState(new Date(2024, 0, 15))
  const [selectingStart, setSelectingStart] = useState(true)

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const handleDateClick = (day, month) => {
    const newDate = new Date(new Date().getFullYear(), month, day)
    if (selectingStart) {
      setStartDate(newDate)
      setSelectingStart(false)
    } else {
      if (newDate < startDate) {
        setStartDate(newDate)
        setEndDate(endDate)
      } else {
        setEndDate(newDate)
      }
      setSelectingStart(true)
      onDateRangeChange(startDate, newDate)
    }
  }

  const renderCalendar = (monthOffset) => {
    const month = new Date()
    month.setMonth(month.getMonth() + monthOffset)

    const daysInMonth = getDaysInMonth(month)
    const firstDay = getFirstDayOfMonth(month)
    const monthName = month.toLocaleString("default", { month: "long", year: "numeric" })
    const days = []

    for (let i = 0; i < firstDay; i++) {
      days.push(null)
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i)
    }

    return { monthName, days, month }
  }

  const { monthName: monthName1, days: days1 } = renderCalendar(0)
  const { monthName: monthName2, days: days2 } = renderCalendar(1)

  const isDateInRange = (day, month) => {
    const date = new Date(new Date().getFullYear(), month, day)
    return date >= startDate && date <= endDate
  }

  const isDateSelected = (day, month) => {
    const date = new Date(new Date().getFullYear(), month, day)
    return (
      (date.toDateString() === startDate.toDateString() || date.toDateString() === endDate.toDateString()) &&
      day !== null
    )
  }

  return (
    <div className="custom-calendar">
      <div className="calendar-container">
        <div className="calendar-month">
          <h4>{monthName1}</h4>
          <div className="calendar-grid">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="calendar-day-header">
                {day}
              </div>
            ))}
            {days1.map((day, idx) => (
              <button
                key={idx}
                className={`calendar-day ${day ? "active" : "empty"} ${
                  isDateInRange(day, 0) ? "in-range" : ""
                } ${isDateSelected(day, 0) ? "selected" : ""}`}
                onClick={() => day && handleDateClick(day, 0)}
                disabled={!day}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        <div className="calendar-month">
          <h4>{monthName2}</h4>
          <div className="calendar-grid">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="calendar-day-header">
                {day}
              </div>
            ))}
            {days2.map((day, idx) => (
              <button
                key={idx}
                className={`calendar-day ${day ? "active" : "empty"} ${
                  isDateInRange(day, 1) ? "in-range" : ""
                } ${isDateSelected(day, 1) ? "selected" : ""}`}
                onClick={() => day && handleDateClick(day, 1)}
                disabled={!day}
              >
                {day}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="calendar-selected">
        <p>
          {startDate.toDateString()} - {endDate.toDateString()}
        </p>
      </div>
    </div>
  )
}

export default CustomCalendar
