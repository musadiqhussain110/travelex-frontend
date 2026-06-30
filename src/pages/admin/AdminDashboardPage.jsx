import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import {
  FaCalendarDay,
  FaChartLine,
  FaCheckCircle,
  FaUsers,
} from "react-icons/fa"
import { adminApi } from "../../services/api"

const statCards = [
  {
    key: "totalLeads",
    label: "Total Leads",
    icon: <FaUsers />,
  },
  {
    key: "todayLeads",
    label: "Today Leads",
    icon: <FaCalendarDay />,
  },
  {
    key: "confirmed",
    label: "Confirmed",
    icon: <FaCheckCircle />,
  },
  {
    key: "interested",
    label: "Interested",
    icon: <FaChartLine />,
  },
]

const serviceLabels = {
  umrah: "Umrah",
  tour: "Tours",
  visa: "Visa",
  ticket: "Air Tickets",
  hotel: "Hotels",
  carRental: "Car Rental",
  contact: "Contact",
  general: "General",
}

const servicePaths = {
  umrah: "/admin/leads/umrah",
  tour: "/admin/leads/tour",
  visa: "/admin/leads/visa",
  ticket: "/admin/leads/ticket",
  hotel: "/admin/leads/hotel",
  carRental: "/admin/leads/car-rental",
  contact: "/admin/leads",
  general: "/admin/leads",
}

const formatService = (service = "") => {
  return serviceLabels[service] || service || "-"
}

const getServicePath = (service = "") => {
  return servicePaths[service] || "/admin/leads"
}

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await adminApi.getLeadStats()
        setStats(data.stats || data.data?.stats || data)
      } catch (err) {
        setError(err.message || "Failed to load dashboard stats.")
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [])

  const getValue = (key) => {
    if (!stats) return 0

    if (key === "confirmed") {
      return stats.byStatus?.Confirmed || 0
    }

    if (key === "interested") {
      return stats.byStatus?.Interested || 0
    }

    return stats[key] || 0
  }

  if (loading) {
    return (
      <div className="rounded-[5px] bg-white p-6 text-sm font-semibold text-slate-600 shadow-sm">
        Loading dashboard...
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-[5px] border border-red-100 bg-red-50 p-6 text-sm font-semibold text-red-600">
        {error}
      </div>
    )
  }

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => (
          <div
            key={card.key}
            className="rounded-[5px] border border-slate-100 bg-white p-5 shadow-[0_12px_35px_rgba(15,23,42,0.05)]"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.06em] text-slate-400">
                  {card.label}
                </p>
                <p className="mt-2 font-fredoka text-[34px] font-semibold text-slate-950">
                  {getValue(card.key)}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-[5px] bg-[#00AEEF]/10 text-[#00AEEF]">
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[5px] border border-slate-100 bg-white p-5 shadow-sm">
          <h2 className="font-fredoka text-[24px] font-semibold text-slate-950">
            Leads by Status
          </h2>

          <div className="mt-4 grid gap-3">
            {Object.entries(stats?.byStatus || {}).map(([status, count]) => (
              <div
                key={status}
                className="flex items-center justify-between rounded-[5px] bg-[#F8FAFC] px-4 py-3"
              >
                <span className="text-sm font-semibold text-slate-700">
                  {status}
                </span>
                <span className="rounded-[5px] bg-white px-3 py-1 text-xs font-bold text-[#FF6B00]">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[5px] border border-slate-100 bg-white p-5 shadow-sm">
          <h2 className="font-fredoka text-[24px] font-semibold text-slate-950">
            Leads by Service
          </h2>

          <div className="mt-4 grid gap-3">
            {Object.entries(stats?.byServiceType || {}).map(
              ([service, count]) => (
                <Link
                  key={service}
                  to={getServicePath(service)}
                  className="flex items-center justify-between rounded-[5px] bg-[#F8FAFC] px-4 py-3 transition hover:bg-slate-100"
                >
                  <span className="text-sm font-semibold text-slate-700">
                    {formatService(service)}
                  </span>
                  <span className="rounded-[5px] bg-white px-3 py-1 text-xs font-bold text-[#00AEEF]">
                    {count}
                  </span>
                </Link>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboardPage