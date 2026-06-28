import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"

import Navbar from "./components/Navbar"
import ScrollToTop from "./components/ScrollToTop"
import StickyWhatsApp from "./components/StickyWhatsApp"
import MobileBottomNav from "./components/MobileBottomNav"
import SmoothScroll from "./components/SmoothScroll"

import Home from "./pages/Home"
import UmrahPage from "./pages/UmrahPage"
import PackageDetails from "./pages/PackageDetails"
import UmrahBookingPage from "./pages/UmrahBookingPage"

import ToursPage from "./pages/ToursPage"
import TourDetails from "./pages/TourDetails"
import TourBookingPage from "./pages/TourBookingPage"

import HotelsPage from "./pages/HotelsPage"
import HotelDetailsPage from "./pages/HotelDetailsPage"
import HotelBookingPage from "./pages/HotelBookingPage"

import CarRentalPage from "./pages/CarRentalPage"
import VisaPage from "./pages/VisaPage"
import VisaApplicationPage from "./pages/VisaApplicationPage"
import ServicesPage from "./pages/ServicesPage"

import BlogsPage from "./pages/BlogsPage"
import BlogDetails from "./pages/BlogDetails"
import ContactPage from "./pages/ContactPage"
import FAQPage from "./pages/FAQPage"

import SearchResultsPage from "./pages/SearchResultsPage"
import NotFoundPage from "./pages/NotFoundPage"

import AdminProtectedRoute from "./components/admin/AdminProtectedRoute"
import AdminLayout from "./components/admin/AdminLayout"
import AdminLoginPage from "./pages/admin/AdminLoginPage"
import AdminDashboardPage from "./pages/admin/AdminDashboardPage"
import AdminLeadsPage from "./pages/admin/AdminLeadsPage"
import AdminLeadDetailPage from "./pages/admin/AdminLeadDetailPage"
import AdminWhatsappLogsPage from "./pages/admin/AdminWhatsappLogsPage"
import AdminContactInquiriesPage from "./pages/admin/AdminContactInquiriesPage"
const AppContent = () => {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith("/admin")

  return (
    <>
      <SmoothScroll />
      <ScrollToTop />

      {!isAdminRoute && <Navbar />}

      <main
        className={
          isAdminRoute
            ? "min-h-screen bg-[#F8FAFC]"
            : "pt-[56px] pb-[62px] sm:pt-[78px] lg:pb-0"
        }
      >
        <Routes>
          {/* Admin Login */}
          <Route path="/admin/login" element={<AdminLoginPage />} />

          {/* Protected Admin Routes */}
          <Route element={<AdminProtectedRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboardPage />} />
              <Route path="dashboard" element={<AdminDashboardPage />} />
              <Route path="leads" element={<AdminLeadsPage />} />
              <Route path="leads/:id" element={<AdminLeadDetailPage />} />
              <Route path="whatsapp" element={<AdminWhatsappLogsPage />} />
              <Route
  path="contact-inquiries"
  element={<AdminContactInquiriesPage />}
/>
            </Route>
          </Route>

          {/* Home */}
          <Route path="/" element={<Home />} />

          {/* Search */}
          <Route path="/search" element={<SearchResultsPage />} />

          {/* Umrah */}
          <Route path="/umrah" element={<UmrahPage />} />
          <Route path="/package/:id" element={<PackageDetails />} />
          <Route path="/booking/umrah/:id" element={<UmrahBookingPage />} />

          {/* Tours */}
          <Route path="/tours" element={<ToursPage />} />
          <Route path="/tours/:id" element={<TourDetails />} />
          <Route path="/booking/tours/:id" element={<TourBookingPage />} />

          {/* Hotels */}
          <Route path="/hotels" element={<HotelsPage />} />
          <Route path="/hotels/:id" element={<HotelDetailsPage />} />
          <Route path="/booking/hotels/:id" element={<HotelBookingPage />} />

          {/* Services */}
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/car-rental" element={<CarRentalPage />} />
          <Route path="/visa" element={<VisaPage />} />
          <Route path="/visa/apply" element={<VisaApplicationPage />} />

          {/* Blogs */}
          <Route path="/blogs" element={<BlogsPage />} />
          <Route path="/blogs/:id" element={<BlogDetails />} />

          {/* Static Pages */}
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/faq" element={<FAQPage />} />

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      {!isAdminRoute && <StickyWhatsApp />}
      {!isAdminRoute && <MobileBottomNav />}
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App