import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import CustomerNav from "./components/CustomerNav";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";
import ProductList from "./pages/ProductList";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";

// Manufacturer components
import MfLayout from "./manufacturer/Layout";
import MfDashboard from "./manufacturer/Dashboard";
import MfProducts from "./manufacturer/Products";
import MfProductsList from "./manufacturer/ProductsList";
import MfOrders from "./manufacturer/Orders";
import MfAnalytics from "./manufacturer/Analytics";

// Designer components
import DsLayout from "./designer/DesignerLayout";
import DsHome from "./designer/DesignerHome";
import DsCanvas from "./designer/DesignCanvas";
import DsPortfolio from "./designer/Portfolio";
import DsDesignDetail from "./designer/DesignDetail";
import DsStorefront from "./designer/Storefront";
import DsOrders from "./designer/DesignerOrders";
import DsAnalytics from "./designer/DesignerAnalytics";

// Customer layout wrapper
const CL = ({ children }) => (<><CustomerNav />{children}</>);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />

        {/* Admin */}
        <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />

        {/* Manufacturer */}
        <Route path="/manufacturer" element={<ProtectedRoute><MfLayout><MfDashboard /></MfLayout></ProtectedRoute>} />
        <Route path="/manufacturer/products" element={<ProtectedRoute><MfLayout><MfProductsList /></MfLayout></ProtectedRoute>} />
        <Route path="/manufacturer/products/create" element={<ProtectedRoute><MfLayout><MfProducts /></MfLayout></ProtectedRoute>} />
        <Route path="/manufacturer/products/edit/:id" element={<ProtectedRoute><MfLayout><MfProducts /></MfLayout></ProtectedRoute>} />
        <Route path="/manufacturer/orders" element={<ProtectedRoute><MfLayout><MfOrders /></MfLayout></ProtectedRoute>} />
        <Route path="/manufacturer/analytics" element={<ProtectedRoute><MfLayout><MfAnalytics /></MfLayout></ProtectedRoute>} />

        {/* Designer */}
        <Route path="/designer" element={<ProtectedRoute><DsLayout><DsHome /></DsLayout></ProtectedRoute>} />
        <Route path="/designer/canvas" element={<ProtectedRoute><DsLayout><DsCanvas /></DsLayout></ProtectedRoute>} />
        <Route path="/designer/portfolio" element={<ProtectedRoute><DsLayout><DsPortfolio /></DsLayout></ProtectedRoute>} />
        <Route path="/designer/portfolio/:index" element={<ProtectedRoute><DsLayout><DsDesignDetail /></DsLayout></ProtectedRoute>} />
        <Route path="/designer/storefront" element={<ProtectedRoute><DsLayout><DsStorefront /></DsLayout></ProtectedRoute>} />
        <Route path="/designer/orders" element={<ProtectedRoute><DsLayout><DsOrders /></DsLayout></ProtectedRoute>} />
        <Route path="/designer/analytics" element={<ProtectedRoute><DsLayout><DsAnalytics /></DsLayout></ProtectedRoute>} />

        {/* Customer */}
        <Route path="/shop" element={<ProtectedRoute><CL><ProductList /></CL></ProtectedRoute>} />
        <Route path="/products/:id" element={<ProtectedRoute><CL><ProductDetail /></CL></ProtectedRoute>} />
        <Route path="/cart" element={<ProtectedRoute><CL><Cart /></CL></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute><CL><Checkout /></CL></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><CL><Orders /></CL></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><CL><Profile /></CL></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
