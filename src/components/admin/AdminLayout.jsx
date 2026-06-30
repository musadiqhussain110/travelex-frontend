import { useEffect, useRef, useState } from "react"
import { NavLink, Outlet, useNavigate } from "react-router-dom"
import {
  FaBars,
  FaBell,
  FaCar,
  FaChartLine,
  FaEnvelopeOpenText,
  FaGlobeAsia,
  FaHome,
  FaHotel,
  FaPassport,
  FaPlane,
  FaSignOutAlt,
  FaTicketAlt,
  FaTimes,
  FaUsers,
} from "react-icons/fa"

import AdminNotificationBell from "./AdminNotificationBell"
import { useAdminAuth } from "../../context/AdminAuthContext"
import logo from "../../assets/logo.webp"

const mainNavItems = [
  {
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: <FaChartLine />,
    end: true,
  },
  {
    label: "Notifications",
    path: "/admin/notifications",
    icon: <FaBell />,
  },
]

const leadNavItems = [
  {
    label: "All Leads",
    path: "/admin/leads",
    icon: <FaUsers />,
    end: true,
  },
  {
    label: "Umrah Leads",
    path: "/admin/leads/umrah",
    icon: <FaPlane />,
  },
  {
    label: "Tour Leads",
    path: "/admin/leads/tour",
    icon: <FaGlobeAsia />,
  },
  {
    label: "Visa Leads",
    path: "/admin/leads/visa",
    icon: <FaPassport />,
  },
  {
    label: "Air Ticket Leads",
    path: "/admin/leads/ticket",
    icon: <FaTicketAlt />,
  },
  {
    label: "Hotel Leads",
    path: "/admin/leads/hotel",
    icon: <FaHotel />,
  },
  {
    label: "Car Rental Leads",
    path: "/admin/leads/car-rental",
    icon: <FaCar />,
  },
]

const communicationNavItems = [
  {
    label: "Contact Inquiries",
    path: "/admin/contact-inquiries",
    icon: <FaEnvelopeOpenText />,
  },
]

const navClass = ({ isActive }) =>
  `flex items-center gap-3 rounded-[5px] px-4 py-2.5 font-poppins text-sm font-semibold transition ${
    isActive
      ? "bg-[#FF6B00] text-white shadow-[0_12px_26px_rgba(255,107,0,0.2)]"
      : "text-slate-600 hover:bg-[#FF6B00]/10 hover:text-[#FF6B00]"
  }`

const serviceNavClass = ({ isActive }) =>
  `flex items-center gap-3 rounded-[5px] px-4 py-2.5 font-poppins text-[13px] font-semibold transition ${
    isActive
      ? "bg-[#00AEEF] text-white shadow-[0_10px_22px_rgba(0,174,239,0.18)]"
      : "text-slate-600 hover:bg-[#00AEEF]/10 hover:text-[#00AEEF]"
  }`

const mobileDrawerNavClass = ({ isActive }) =>
  `flex items-center gap-3 rounded-[5px] px-4 py-3 font-poppins text-sm font-semibold transition ${
    isActive
      ? "bg-[#FF6B00] text-white shadow-[0_12px_26px_rgba(255,107,0,0.18)]"
      : "bg-white text-slate-700 hover:bg-[#FF6B00]/10 hover:text-[#FF6B00]"
  }`

const mobileDrawerServiceClass = ({ isActive }) =>
  `flex items-center gap-3 rounded-[5px] px-4 py-3 font-poppins text-sm font-semibold transition ${
    isActive
      ? "bg-[#00AEEF] text-white shadow-[0_10px_22px_rgba(0,174,239,0.16)]"
      : "bg-white text-slate-700 hover:bg-[#00AEEF]/10 hover:text-[#00AEEF]"
  }`

const AdminLayout = () => {
  const navigate = useNavigate()
  const sidebarRef = useRef(null)
  const bodyScrollYRef = useRef(0)
  const { admin, logout } = useAdminAuth()

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    if (mobileMenuOpen) {
      bodyScrollYRef.current = window.scrollY

      document.body.style.position = "fixed"
      document.body.style.top = `-${bodyScrollYRef.current}px`
      document.body.style.left = "0"
      document.body.style.right = "0"
      document.body.style.width = "100%"
      document.body.style.overflow = "hidden"
    } else {
      const scrollY = bodyScrollYRef.current

      document.body.style.position = ""
      document.body.style.top = ""
      document.body.style.left = ""
      document.body.style.right = ""
      document.body.style.width = ""
      document.body.style.overflow = ""

      window.scrollTo(0, scrollY)
    }

    return () => {
      document.body.style.position = ""
      document.body.style.top = ""
      document.body.style.left = ""
      document.body.style.right = ""
      document.body.style.width = ""
      document.body.style.overflow = ""
    }
  }, [mobileMenuOpen])

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setMobileMenuOpen(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  const handleLogout = () => {
    closeMobileMenu()
    logout()
    navigate("/admin/login")
  }

  const handleSidebarWheel = (event) => {
    const sidebar = sidebarRef.current
    if (!sidebar) return

    const canScroll = sidebar.scrollHeight > sidebar.clientHeight
    if (!canScroll) return

    event.preventDefault()
    sidebar.scrollTop += event.deltaY
  }

  const renderMobileLinks = (items, className) =>
    items.map((item) => (
      <NavLink
        key={item.path}
        to={item.path}
        end={item.end}
        onClick={closeMobileMenu}
        className={className}
      >
        <span className="text-[15px]">{item.icon}</span>
        {item.label}
      </NavLink>
    ))

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-poppins text-slate-900">
      <style>
        {`
          .admin-sidebar-scroll {
            scrollbar-width: thin;
            scrollbar-color: transparent transparent;
          }

          .admin-sidebar-scroll:hover {
            scrollbar-color: #FF6B00 transparent;
          }

          .admin-sidebar-scroll::-webkit-scrollbar {
            width: 7px;
          }

          .admin-sidebar-scroll::-webkit-scrollbar-track {
            background: transparent;
          }

          .admin-sidebar-scroll::-webkit-scrollbar-thumb {
            background: transparent;
            border-radius: 999px;
          }

          .admin-sidebar-scroll:hover::-webkit-scrollbar-thumb {
            background: linear-gradient(180deg, #00AEEF, #FF6B00);
          }

          .admin-mobile-drawer-scroll {
            overflow-y: auto !important;
            overscroll-behavior: contain !important;
            -webkit-overflow-scrolling: touch !important;
            scrollbar-width: none !important;
            -ms-overflow-style: none !important;
            touch-action: pan-y !important;
          }

          .admin-mobile-drawer-scroll::-webkit-scrollbar {
            width: 0 !important;
            height: 0 !important;
            display: none !important;
            background: transparent !important;
          }

          .admin-mobile-drawer-scroll::-webkit-scrollbar-track,
          .admin-mobile-drawer-scroll::-webkit-scrollbar-thumb {
            display: none !important;
            background: transparent !important;
            border: 0 !important;
          }
        `}
      </style>

      {/* Desktop Sidebar */}
      <aside
        ref={sidebarRef}
        onWheel={handleSidebarWheel}
        className="admin-sidebar-scroll fixed left-0 top-0 z-40 hidden h-screen w-[270px] overflow-y-auto overscroll-contain border-r border-slate-200 bg-white lg:block"
      >
        <div className="sticky top-0 z-20 border-b border-slate-100 bg-white px-5 py-3">
          <img
            src={logo}
            alt="TravelEx"
            className="h-12 w-auto object-contain"
          />
        </div>

        <div className="px-4 py-4">
          <nav className="grid gap-4">
            <div className="grid gap-1.5">
              {mainNavItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  className={navClass}
                >
                  <span className="text-[15px]">{item.icon}</span>
                  {item.label}
                </NavLink>
              ))}
            </div>

            <div>
              <p className="mb-2 px-4 font-poppins text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                Lead Management
              </p>

              <div className="grid gap-1">
                {leadNavItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.end}
                    className={serviceNavClass}
                  >
                    <span className="text-[14px]">{item.icon}</span>
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 px-4 font-poppins text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                Communication
              </p>

              <div className="grid gap-1.5">
                {communicationNavItems.map((item) => (
                  <NavLink key={item.path} to={item.path} className={navClass}>
                    <span className="text-[15px]">{item.icon}</span>
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </div>
          </nav>
        </div>

        <div className="border-t border-slate-100 px-4 py-3">
          <NavLink
            to="/"
            className="mb-1.5 flex items-center gap-3 rounded-[5px] px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-[#00AEEF]/10 hover:text-[#00AEEF]"
          >
            <FaHome />
            View Website
          </NavLink>

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-[5px] px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <button
          type="button"
          aria-label="Close admin menu"
          onClick={closeMobileMenu}
          className="fixed inset-0 z-50 bg-slate-950/45 backdrop-blur-[2px] lg:hidden"
        />
      )}

      {/* Mobile Right Drawer */}
      <aside
        className={`fixed right-0 top-0 z-[60] h-screen w-[86vw] max-w-[360px] border-l border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.24)] transition-transform duration-300 ease-out lg:hidden ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4">
          <img
            src={logo}
            alt="TravelEx"
            className="h-10 w-auto object-contain"
          />

          <button
            type="button"
            onClick={closeMobileMenu}
            className="flex h-10 w-10 items-center justify-center rounded-[5px] border border-slate-200 bg-white text-slate-700 transition hover:border-[#FF6B00] hover:text-[#FF6B00]"
            aria-label="Close menu"
          >
            <FaTimes />
          </button>
        </div>

        <div
          className="admin-mobile-drawer-scroll h-[calc(100vh-73px)] px-4 py-4"
          onWheel={(event) => event.stopPropagation()}
          onTouchMove={(event) => event.stopPropagation()}
        >
          <div className="mb-4 rounded-[5px] bg-[#F8FAFC] p-4">
            <p className="font-poppins text-sm font-bold text-slate-950">
              {admin?.name || "Admin"}
            </p>

            <p className="mt-0.5 break-words font-poppins text-xs font-medium text-slate-500">
              {admin?.email || "TravelEx Admin"}
            </p>
          </div>

          <nav className="grid gap-5">
            <div>
              <p className="mb-2 px-1 font-poppins text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                Main
              </p>

              <div className="grid gap-2">
                {renderMobileLinks(mainNavItems, mobileDrawerNavClass)}
              </div>
            </div>

            <div>
              <p className="mb-2 px-1 font-poppins text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                Lead Management
              </p>

              <div className="grid gap-2">
                {renderMobileLinks(leadNavItems, mobileDrawerServiceClass)}
              </div>
            </div>

            <div>
              <p className="mb-2 px-1 font-poppins text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                Communication
              </p>

              <div className="grid gap-2">
                {renderMobileLinks(communicationNavItems, mobileDrawerNavClass)}
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4">
              <NavLink
                to="/"
                onClick={closeMobileMenu}
                className="mb-2 flex items-center gap-3 rounded-[5px] bg-white px-4 py-3 font-poppins text-sm font-semibold text-slate-700 transition hover:bg-[#00AEEF]/10 hover:text-[#00AEEF]"
              >
                <FaHome />
                View Website
              </NavLink>

              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-[5px] bg-red-50 px-4 py-3 font-poppins text-sm font-semibold text-red-600 transition hover:bg-red-100"
              >
                <FaSignOutAlt />
                Logout
              </button>
            </div>
          </nav>
        </div>
      </aside>

      <div className="lg:pl-[270px]">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur-xl sm:px-6 sm:py-4 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <img
                src={logo}
                alt="TravelEx"
                className="h-9 w-auto object-contain lg:hidden"
              />

              <div className="min-w-0">
                <p className="truncate font-fredoka text-lg font-semibold text-slate-950 sm:text-2xl">
                  Admin Dashboard
                </p>

                <p className="mt-0.5 hidden text-xs font-medium text-slate-500 sm:block">
                  Manage TravelEx leads, inquiries and CRM activity.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <AdminNotificationBell />

              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="flex h-10 w-10 items-center justify-center rounded-[5px] border border-slate-200 bg-white text-slate-700 transition hover:border-[#FF6B00] hover:text-[#FF6B00] lg:hidden"
                aria-label="Open admin menu"
              >
                <FaBars />
              </button>

              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold text-slate-900">
                  {admin?.name || "Admin"}
                </p>

                <p className="text-xs font-medium text-slate-500">
                  {admin?.email || "TravelEx Admin"}
                </p>
              </div>
            </div>
          </div>
        </header>

        <main className="px-4 py-5 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout