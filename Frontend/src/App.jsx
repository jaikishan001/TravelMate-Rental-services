import "./App.css";
import Home from "./pages/Home";
import About from "./pages/About";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import ScrollToTop from "../ScrollToTop";
import Contact from "./pages/Contact";
import Register from "./pages/Register";
import { VehiclePage } from "./pages/Vehiclepage";
import { Signin } from "./pages/Signin";
import { Book } from "./components/Book";
import BookingHistory from "./pages/BookingHistory";
import Checkout from "./pages/Checkout";
import AIVerification from "./pages/AIVerification";
import DamageInspection from "./pages/DamageInspection";
import AdminDashboard from "./pages/AdminDashboard";
import ModeratorDashboard from "./pages/ModeratorDashboard";
import UserDashboard from "./pages/UserDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/register" element={<Register />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/vehicle" element={<VehiclePage />} />
          <Route path="/booking" element={<Book />} />
          <Route path="/history" element={<BookingHistory />} />
          <Route path="/verify" element={<AIVerification />} />
          <Route path="/inspect" element={<DamageInspection />} />
          <Route path="/checkout" element={<Checkout />} />
          
          {/* RBAC Protected Routes */}
          <Route 
            path="/user/dashboard" 
            element={
              <ProtectedRoute allowedRoles={["USER", "ADMIN", "MODERATOR"]}>
                <UserDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/moderator/dashboard" 
            element={
              <ProtectedRoute allowedRoles={["MODERATOR", "ADMIN"]}>
                <ModeratorDashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
