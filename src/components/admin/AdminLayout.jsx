import { NavLink, Outlet, useNavigate } from "react-router-dom"
import {
  FaChartLine,
  FaEnvelopeOpenText,
  FaHome,
  FaSignOutAlt,
  FaUsers,
  FaWhatsapp,
} from "react-icons/fa"
import { useAdminAuth } from "../../context/AdminAuthContext"

const navItems = [
  {
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: <FaChartLine />,
  },
  {
    label: "Leads",
    path: "/admin/leads",
    icon: <FaUsers />,
  },
  {
    label: "WhatsApp Logs",
    path: "/admin/whatsapp",
    icon: <FaWhatsapp />,
  },
  {
    label: "Contact Inquiries",
    path: "/admin/contact-inquiries",
    icon: <FaEnvelopeOpenText />,
  },
]

const navClass = ({ isActive }) =>
  `flex items-center gap-3 rounded-[10px] px-4 py-3 font-poppins text-sm font-semibold transition ${
    isActive
      ? "bg-[#FF6B00] text-white shadow-[0_14px_30px_rgba(255,107,0,0.25)]"
      : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
  }`

const AdminLayout = () => {
  const navigate = useNavigate()
  const { admin, logout } = useAdminAuth()

  const handleLogout = () => {
    logout()
    navigate("/admin/login")
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-poppins text-slate-900">
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-[260px] border-r border-slate-200 bg-white p-5 lg:block">
        <div>
          <p className="font-fredoka text-[26px] font-semibold text-slate-950">
            TravelEx
          </p>
          <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.08em] text-[#00AEEF]">
            Admin CRM
          </p>
        </div>

        <nav className="mt-8 grid gap-2">
          {navItems.map((item) => (
            <NavLink key={item.path} to={item.path} className={navClass}>
              <span className="text-[15px]">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-5 left-5 right-5">
          <NavLink
            to="/"
            className="mb-2 flex items-center gap-3 rounded-[10px] px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
          >
            <FaHome />
            View Website
          </NavLink>

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-[10px] px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </aside>

      <div className="lg:pl-[260px]">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 px-4 py-4 backdrop-blur-xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-fredoka text-xl font-semibold text-slate-950 sm:text-2xl">
                Admin Dashboard
              </p>
              <p className="mt-0.5 text-xs font-medium text-slate-500">
                Manage TravelEx leads, inquiries and CRM activity.
              </p>
            </div>

            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-slate-900">
                {admin?.name || "Admin"}
              </p>
              <p className="text-xs font-medium text-slate-500">
                {admin?.email || "TravelEx Admin"}
              </p>
            </div>
          </div>

          <div className="mt-4 flex gap-2 overflow-x-auto pb-1 lg:hidden">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `shrink-0 rounded-full px-4 py-2 text-xs font-semibold ${
                    isActive
                      ? "bg-[#FF6B00] text-white"
                      : "bg-slate-100 text-slate-700"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}

            <button
              type="button"
              onClick={handleLogout}
              className="shrink-0 rounded-full bg-red-50 px-4 py-2 text-xs font-semibold text-red-600"
            >
              Logout
            </button>
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