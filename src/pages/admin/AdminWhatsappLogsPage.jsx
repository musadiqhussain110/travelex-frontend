import { useEffect, useState } from "react"
import {
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaSearch,
  FaWhatsapp,
} from "react-icons/fa"
import { adminApi } from "../../services/api"

const statuses = ["All", "pending", "sent", "failed", "skipped"]

const purposes = [
  "All",
  "admin_lead_alert",
  "customer_confirmation",
  "follow_up",
  "status_update",
  "manual",
]

const statusStyles = {
  pending: "bg-yellow-50 text-yellow-700",
  sent: "bg-emerald-50 text-emerald-700",
  failed: "bg-red-50 text-red-700",
  skipped: "bg-slate-100 text-slate-600",
}

const purposeLabels = {
  admin_lead_alert: "Admin Lead Alert",
  customer_confirmation: "Customer Confirmation",
  follow_up: "Follow Up",
  status_update: "Status Update",
  manual: "Manual",
}

const statCards = [
  {
    key: "totalLogs",
    label: "Total Logs",
    icon: <FaWhatsapp />,
  },
  {
    key: "sent",
    label: "Sent",
    icon: <FaCheckCircle />,
  },
  {
    key: "failed",
    label: "Failed",
    icon: <FaExclamationTriangle />,
  },
  {
    key: "pending",
    label: "Pending",
    icon: <FaClock />,
  },
]

const AdminWhatsappLogsPage = () => {
  const [logs, setLogs] = useState([])
  const [stats, setStats] = useState(null)
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("All")
  const [purpose, setPurpose] = useState("All")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const loadLogs = async () => {
    setLoading(true)
    setError("")

    try {
      const params = new URLSearchParams()
      params.set("limit", "50")

      if (search.trim()) {
        params.set("search", search.trim())
      }

      if (status !== "All") {
        params.set("status", status)
      }

      if (purpose !== "All") {
        params.set("purpose", purpose)
      }

      const data = await adminApi.getWhatsappLogs(`?${params.toString()}`)
      setLogs(data.logs || data.data?.logs || [])
    } catch (err) {
      setError(err.message || "Failed to load WhatsApp logs.")
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const data = await adminApi.getWhatsappStats()
      setStats(data.stats || data.data?.stats || data)
    } catch {
      setStats(null)
    }
  }

  useEffect(() => {
    loadLogs()
    loadStats()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, purpose])

  const handleSearchSubmit = (event) => {
    event.preventDefault()
    loadLogs()
  }

  const getStatValue = (key) => {
    if (!stats) return 0

    if (key === "sent") return stats.byStatus?.sent || 0
    if (key === "failed") return stats.byStatus?.failed || 0
    if (key === "pending") return stats.byStatus?.pending || 0

    return stats[key] || 0
  }

  return (
    <div className="grid gap-5">
      <div className="rounded-[16px] border border-slate-100 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="font-fredoka text-[28px] font-semibold text-slate-950">
              WhatsApp Logs
            </h1>

            <p className="mt-1 text-sm font-medium text-slate-500">
              Track WhatsApp alerts, confirmations and failed automation
              messages.
            </p>
          </div>

          <form
            onSubmit={handleSearchSubmit}
            className="flex w-full gap-2 lg:max-w-md"
          >
            <div className="flex h-11 flex-1 items-center gap-2 rounded-[10px] border border-slate-200 bg-[#F8FAFC] px-3">
              <FaSearch className="text-xs text-slate-400" />

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search phone, message, error..."
                className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-slate-700 outline-none placeholder:text-slate-400"
              />
            </div>

            <button
              type="submit"
              className="rounded-[10px] bg-[#FF6B00] px-4 text-sm font-semibold text-white transition hover:bg-[#00AEEF]"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => (
          <div
            key={card.key}
            className="rounded-[16px] border border-slate-100 bg-white p-5 shadow-[0_12px_35px_rgba(15,23,42,0.05)]"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.06em] text-slate-400">
                  {card.label}
                </p>

                <p className="mt-2 font-fredoka text-[34px] font-semibold text-slate-950">
                  {getStatValue(card.key)}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-[12px] bg-[#00AEEF]/10 text-[#00AEEF]">
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-[16px] border border-slate-100 bg-white p-5 shadow-sm">
        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.06em] text-slate-400">
              Filter by Status
            </p>

            <div className="flex gap-2 overflow-x-auto pb-1">
              {statuses.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setStatus(item)}
                  className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition ${
                    status === item
                      ? "bg-[#00AEEF] text-white"
                      : "bg-[#F8FAFC] text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {item === "All" ? "All" : item}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.06em] text-slate-400">
              Filter by Purpose
            </p>

            <div className="flex gap-2 overflow-x-auto pb-1">
              {purposes.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setPurpose(item)}
                  className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition ${
                    purpose === item
                      ? "bg-[#FF6B00] text-white"
                      : "bg-[#F8FAFC] text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {item === "All" ? "All" : purposeLabels[item] || item}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="rounded-[16px] bg-white p-6 text-sm font-semibold text-slate-600 shadow-sm">
          Loading WhatsApp logs...
        </div>
      ) : error ? (
        <div className="rounded-[16px] border border-red-100 bg-red-50 p-6 text-sm font-semibold text-red-600">
          {error}
        </div>
      ) : (
        <div className="overflow-hidden rounded-[16px] border border-slate-100 bg-white shadow-sm">
          <div className="hidden grid-cols-[1fr_1fr_1fr_1fr_1.4fr] border-b border-slate-100 bg-[#F8FAFC] px-5 py-3 text-xs font-bold uppercase tracking-[0.06em] text-slate-400 lg:grid">
            <span>Phone</span>
            <span>Purpose</span>
            <span>Status</span>
            <span>Date</span>
            <span>Message</span>
          </div>

          <div className="divide-y divide-slate-100">
            {logs.length === 0 ? (
              <div className="p-6 text-center text-sm font-semibold text-slate-500">
                No WhatsApp logs found.
              </div>
            ) : (
              logs.map((log) => (
                <div
                  key={log._id}
                  className="grid gap-3 px-5 py-4 lg:grid-cols-[1fr_1fr_1fr_1fr_1.4fr] lg:items-start"
                >
                  <div>
                    <p className="text-sm font-bold text-slate-950">
                      {log.phone}
                    </p>

                    {log.lead && (
                      <p className="mt-0.5 text-xs font-medium text-slate-500">
                        Lead: {log.lead.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-bold text-[#00AEEF]">
                      {purposeLabels[log.purpose] || log.purpose}
                    </span>
                  </div>

                  <div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        statusStyles[log.status] || "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {log.status}
                    </span>

                    {log.errorMessage && (
                      <p className="mt-2 text-xs font-semibold leading-5 text-red-500">
                        {log.errorMessage}
                      </p>
                    )}
                  </div>

                  <div className="text-xs font-semibold text-slate-500">
                    {log.createdAt ? new Date(log.createdAt).toLocaleString() : "-"}
                  </div>

                  <div>
                    <p className="line-clamp-4 whitespace-pre-wrap text-xs font-medium leading-5 text-slate-600">
                      {log.message}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminWhatsappLogsPage