import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import Login from "./pages/Login"
import Dashboard from "./components/Dashboard"
import Products from "./components/Products"
import ProductsList from "./components/ProductsList"
import Orders from "./components/Orders"
import Analytics from "./components/Analytics"
import Layout from "./components/Layout"
import "./App.css"

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
        <Route path="/products" element={<ProtectedRoute><Layout><ProductsList /></Layout></ProtectedRoute>} />
        <Route path="/products/create" element={<ProtectedRoute><Layout><Products /></Layout></ProtectedRoute>} />
        <Route path="/products/edit/:id" element={<ProtectedRoute><Layout><Products /></Layout></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><Layout><Orders /></Layout></ProtectedRoute>} />
        <Route path="/analytics" element={<ProtectedRoute><Layout><Analytics /></Layout></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  )
}

export default App
