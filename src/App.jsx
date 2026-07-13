import { lazy, Suspense, useEffect } from "react"
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom"

import Navbar from "./components/Navbar"
import ScrollToTop from "./components/ScrollToTop"
import StickyWhatsApp from "./components/StickyWhatsApp"
import MobileBottomNav from "./components/MobileBottomNav"


// Keep homepage eager-loaded.
// It is the main landing route and should not wait for an extra JS request.
import Home from "./pages/Home"

import { captureLeadSource } from "./utils/leadSourceTracker"

/* =========================================================
   PUBLIC PAGES — LAZY LOADED
========================================================= */

const UmrahPage = lazy(() => import("./pages/UmrahPage"))
const PackageDetails = lazy(() => import("./pages/PackageDetails"))
const UmrahBookingPage = lazy(() => import("./pages/UmrahBookingPage"))

const ToursPage = lazy(() => import("./pages/ToursPage"))
const TourDetails = lazy(() => import("./pages/TourDetails"))
const TourBookingPage = lazy(() => import("./pages/TourBookingPage"))

const HotelsPage = lazy(() => import("./pages/HotelsPage"))
const HotelDetailsPage = lazy(() => import("./pages/HotelDetailsPage"))
const HotelBookingPage = lazy(() => import("./pages/HotelBookingPage"))

const CarRentalPage = lazy(() => import("./pages/CarRentalPage"))
const VisaPage = lazy(() => import("./pages/VisaPage"))
const VisaApplicationPage = lazy(() =>
  import("./pages/VisaApplicationPage")
)
const ServicesPage = lazy(() => import("./pages/ServicesPage"))
const TicketsPage = lazy(() => import("./pages/TicketsPage"))

const BlogsPage = lazy(() => import("./pages/BlogsPage"))
const BlogDetails = lazy(() => import("./pages/BlogDetails"))

const ContactPage = lazy(() => import("./pages/ContactPage"))
const FAQPage = lazy(() => import("./pages/FAQPage"))

const SearchResultsPage = lazy(() =>
  import("./pages/SearchResultsPage")
)
const SourceRedirectPage = lazy(() =>
  import("./pages/SourceRedirectPage")
)
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"))

/* =========================================================
   ADMIN / CRM — LAZY LOADED
   Normal public visitors will not download these upfront.
========================================================= */

const AdminProtectedRoute = lazy(() =>
  import("./components/admin/AdminProtectedRoute")
)

const ProtectedAdminRoute = lazy(() =>
  import("./components/admin/ProtectedAdminRoute")
)

const AdminLayout = lazy(() =>
  import("./components/admin/AdminLayout")
)

const AdminLoginPage = lazy(() =>
  import("./pages/admin/AdminLoginPage")
)

const AdminDashboardPage = lazy(() =>
  import("./pages/admin/AdminDashboardPage")
)

const AdminBusinessInsightsPage = lazy(() =>
  import("./pages/admin/AdminBusinessInsightsPage")
)

const AdminLeadsPage = lazy(() =>
  import("./pages/admin/AdminLeadsPage")
)

const AdminLeadDetailPage = lazy(() =>
  import("./pages/admin/AdminLeadDetailPage")
)

const AdminLeadKanbanPage = lazy(() =>
  import("./pages/admin/AdminLeadKanbanPage")
)

const AdminConsultantWorkbenchPage = lazy(() =>
  import("./pages/admin/AdminConsultantWorkbenchPage")
)

const AdminFollowUpsPage = lazy(() =>
  import("./pages/admin/AdminFollowUpsPage")
)

const AdminControlRoomPage = lazy(() =>
  import("./pages/admin/AdminControlRoomPage")
)

const AdminWhatsappLogsPage = lazy(() =>
  import("./pages/admin/AdminWhatsappLogsPage")
)

const AdminContactInquiriesPage = lazy(() =>
  import("./pages/admin/AdminContactInquiriesPage")
)

const AdminContactInquiryDetailPage = lazy(() =>
  import("./pages/admin/AdminContactInquiryDetailPage")
)

const AdminNotificationsPage = lazy(() =>
  import("./pages/admin/AdminNotificationsPage")
)

/* =========================================================
   LIGHTWEIGHT ROUTE LOADER
========================================================= */

const RouteLoader = () => {
  return (
    <div className="flex min-h-[45vh] items-center justify-center px-4">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#E5E7EB] border-t-[#FF6B00]" />

        <p className="font-[Poppins] text-sm text-slate-500">
          Loading...
        </p>
      </div>
    </div>
  )
}

/* =========================================================
   APP CONTENT
========================================================= */

const AppContent = () => {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith("/admin")

  useEffect(() => {
    if (!isAdminRoute) {
      captureLeadSource()
    }
  }, [location.pathname, location.search, isAdminRoute])

  return (
    <>

      <ScrollToTop />

      {!isAdminRoute && <Navbar />}

      <main
        className={
          isAdminRoute
            ? "min-h-screen bg-[#F8FAFC]"
            : "pt-[56px] pb-[62px] sm:pt-[78px] lg:pb-0"
        }
      >
        <Suspense fallback={<RouteLoader />}>
          <Routes>
            {/* =================================================
                ADMIN LOGIN
            ================================================= */}

            <Route
              path="/admin/login"
              element={<AdminLoginPage />}
            />

            {/* =================================================
                SOURCE TRACKING REDIRECT
            ================================================= */}

            <Route
              path="/go/:source/*"
              element={<SourceRedirectPage />}
            />

            {/* =================================================
                PROTECTED ADMIN / CRM ROUTES
            ================================================= */}

            <Route element={<AdminProtectedRoute />}>
              <Route
                path="/admin"
                element={
                  <ProtectedAdminRoute>
                    <AdminLayout />
                  </ProtectedAdminRoute>
                }
              >
                <Route
                  index
                  element={<AdminDashboardPage />}
                />

                <Route
                  path="dashboard"
                  element={<AdminDashboardPage />}
                />

                {/* Admin Main Pages */}

                <Route
                  path="business-insights"
                  element={<AdminBusinessInsightsPage />}
                />

                <Route
                  path="control-room"
                  element={<AdminControlRoomPage />}
                />

                <Route
                  path="workbench"
                  element={<AdminConsultantWorkbenchPage />}
                />

                <Route
                  path="follow-ups"
                  element={<AdminFollowUpsPage />}
                />

                <Route
                  path="notifications"
                  element={<AdminNotificationsPage />}
                />

                {/* Admin Lead Pages */}

                <Route
                  path="leads"
                  element={<AdminLeadsPage />}
                />

                <Route
                  path="leads/kanban"
                  element={<AdminLeadKanbanPage />}
                />

                <Route
                  path="leads/umrah"
                  element={
                    <AdminLeadsPage serviceType="umrah" />
                  }
                />

                <Route
                  path="leads/tour"
                  element={
                    <AdminLeadsPage serviceType="tour" />
                  }
                />

                <Route
                  path="leads/visa"
                  element={
                    <AdminLeadsPage serviceType="visa" />
                  }
                />

                <Route
                  path="leads/ticket"
                  element={
                    <AdminLeadsPage serviceType="ticket" />
                  }
                />

                <Route
                  path="leads/hotel"
                  element={
                    <AdminLeadsPage serviceType="hotel" />
                  }
                />

                <Route
                  path="leads/car-rental"
                  element={
                    <AdminLeadsPage serviceType="carRental" />
                  }
                />

                {/* Keep dynamic route after specific lead routes */}

                <Route
                  path="leads/:id"
                  element={<AdminLeadDetailPage />}
                />

                {/* Communication */}

                <Route
                  path="contact-inquiries"
                  element={<AdminContactInquiriesPage />}
                />

                <Route
                  path="contact-inquiries/:id"
                  element={<AdminContactInquiryDetailPage />}
                />

                {/* Legacy route */}

                <Route
                  path="whatsapp"
                  element={<AdminWhatsappLogsPage />}
                />
              </Route>
            </Route>

            {/* =================================================
                HOME
            ================================================= */}

            <Route path="/" element={<Home />} />

            {/* =================================================
                SEARCH
            ================================================= */}

            <Route
              path="/search"
              element={<SearchResultsPage />}
            />

            {/* =================================================
                UMRAH
            ================================================= */}

            <Route
              path="/umrah"
              element={<UmrahPage />}
            />

            <Route
              path="/package/:id"
              element={<PackageDetails />}
            />

            <Route
              path="/booking/umrah/:id"
              element={<UmrahBookingPage />}
            />

            {/* =================================================
                TOURS
            ================================================= */}

            <Route
              path="/tours"
              element={<ToursPage />}
            />

            <Route
              path="/tours/:id"
              element={<TourDetails />}
            />

            <Route
              path="/booking/tours/:id"
              element={<TourBookingPage />}
            />

            {/* =================================================
                HOTELS
            ================================================= */}

            <Route
              path="/hotels"
              element={<HotelsPage />}
            />

            <Route
              path="/hotels/:id"
              element={<HotelDetailsPage />}
            />

            <Route
              path="/booking/hotels/:id"
              element={<HotelBookingPage />}
            />

            {/* =================================================
                SERVICES
            ================================================= */}

            <Route
              path="/services"
              element={<ServicesPage />}
            />

            <Route
              path="/car-rental"
              element={<CarRentalPage />}
            />

            <Route
              path="/tickets"
              element={<TicketsPage />}
            />

            <Route
              path="/visa"
              element={<VisaPage />}
            />

            <Route
              path="/visa/apply"
              element={<VisaApplicationPage />}
            />

            <Route
              path="/visa-application"
              element={<VisaApplicationPage />}
            />

            {/* =================================================
                BLOGS
            ================================================= */}

            <Route
              path="/blogs"
              element={<BlogsPage />}
            />

            <Route
              path="/blogs/:id"
              element={<BlogDetails />}
            />

            {/* =================================================
                STATIC PAGES
            ================================================= */}

            <Route
              path="/contact"
              element={<ContactPage />}
            />

            <Route
              path="/faq"
              element={<FAQPage />}
            />

            {/* =================================================
                404
            ================================================= */}

            <Route
              path="*"
              element={<NotFoundPage />}
            />
          </Routes>
        </Suspense>
      </main>

      {!isAdminRoute && <StickyWhatsApp />}
      {!isAdminRoute && <MobileBottomNav />}
    </>
  )
}

/* =========================================================
   ROOT APP
========================================================= */

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App