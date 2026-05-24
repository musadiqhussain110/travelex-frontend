import { BrowserRouter, Routes, Route } from "react-router-dom"

import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import ScrollToTop from "./components/ScrollToTop"

import Home from "./pages/Home"
import UmrahPage from "./pages/UmrahPage"
import ToursPage from "./pages/ToursPage"
import PackageDetails from "./pages/PackageDetails"
import BlogsPage from "./pages/BlogsPage"
import BlogDetails from "./pages/BlogDetails"
import ContactPage from "./pages/ContactPage"
import FAQPage from "./pages/FAQPage"
import ServicesPage from "./pages/ServicesPage"
import TourDetails from "./pages/TourDetails"
import StickyWhatsApp from "./components/StickyWhatsApp"
import HotelsPage from "./pages/HotelsPage"
import FlightsPage from "./pages/FlightsPage"
import BookingPage from "./pages/BookingPage"
import CarRentalPage from "./pages/CarRentalPage"
import VisaPage from "./pages/VisaPage"
function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Navbar />
<div className="pt-20">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/umrah" element={<UmrahPage />} />
        <Route path="/package/:id" element={<PackageDetails />} />
        <Route path="/tours" element={<ToursPage />} />
        <Route path="/blogs" element={<BlogsPage />} />
        <Route path="/blogs/:id" element={<BlogDetails />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/faq" element={<FAQPage />} />

        <Route path="/tours/:id" element={<TourDetails />} />
        <Route path="/hotels" element={<HotelsPage />} />
        <Route path="/flights" element={<FlightsPage />} />
        <Route path="/booking/:serviceType/:bookingId" element={<BookingPage />} />
        <Route path="/car-rental" element={<CarRentalPage />} />
        <Route path="/visa" element={<VisaPage />} />
      </Routes>
      </div>
<StickyWhatsApp />
      <Footer />
    </BrowserRouter>
  )
}

export default App