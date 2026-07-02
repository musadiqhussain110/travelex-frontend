import { useEffect, useMemo, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import {
  FaArchive,
  FaArrowRight,
  FaBell,
  FaCheckCircle,
  FaClipboardList,
  FaEnvelope,
  FaExclamationCircle,
  FaEye,
  FaInbox,
  FaSearch,
  FaTimes,
} from "react-icons/fa"

import { adminApi } from "../../services/api"

const readStatusOptions = [
  { value: "all", label: "All Status" },
  { value: "unread", label: "Unread" },
  { value: "read", label: "Read" },
]

const typeOptions = [
  { value: "all", label: "All Types" },
  { value: "lead", label: "Lead" },
  { value: "contact-inquiry", label: "Contact Inquiry" },
  { value: "umrah-package", label: "Umrah Package" },
  { value: "tour", label: "Tour" },
  { value: "visa-service", label: "Visa Service" },
  { value: "blog", label: "Blog" },
  { value: "faq", label: "FAQ" },
  { value: "media", label: "Media" },
  { value: "system", label: "System" },
]

const priorityOptions = [
  { value: "all", label: "All Priority" },
  { value: "low", label: "Low" },
  { value: "normal", label: "Normal" },
  { value: "high", label: "High" },
]

const formatDate = (date) => {
  if (!date) return "-"
  return new Date(date).toLocaleString()
}

const getTypeLabel = (type = "") => {
  const item = typeOptions.find((option) => option.value === type)
  return item?.label || type || "Notification"
}

const getPriorityClass = (priority = "normal") => {
  const classes = {
    high: "bg-orange-50 text-[#FF6B00]",
    normal: "bg-sky-50 text-[#00AEEF]",
    low: "bg-slate-100 text-slate-600",
  }

  return classes[priority] || classes.normal
}

const getTypeClass = (type = "") => {
  const classes = {
    lead: "bg-[#00AEEF]/10 text-[#00AEEF]",
    "contact-inquiry": "bg-emerald-50 text-emerald-700",
    system: "bg-slate-100 text-slate-700",
    blog: "bg-purple-50 text-purple-700",
    faq: "bg-amber-50 text-amber-700",
    media: "bg-indigo-50 text-indigo-700",
  }

  return classes[type] || "bg-slate-100 text-slate-700"
}

const StatCard = ({ label, value, tone = "default" }) => {
  const toneClasses = {
    default: "bg-white text-slate-950",
    blue: "bg-sky-50 text-[#00AEEF]",
    orange: "bg-orange-50 text-[#FF6B00]",
    green: "bg-emerald-50 text-emerald-700",
    slate: "bg-slate-100 text-slate-700",
  }

  return (
    <div className="rounded-[5px] border border-slate-100 bg-white px-4 py-3 shadow-sm">
      <p className="font-poppins text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">
        {label}
      </p>

      <p
        className={`mt-1 inline-flex rounded-[5px] px-2 font-fredoka text-[24px] font-semibold ${
          toneClasses[tone] || toneClasses.default
        }`}
      >
        {value}
      </p>
    </div>
  )
}

const SelectBox = ({ value, onChange, options }) => {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="h-11 w-full rounded-[5px] border border-slate-200 bg-[#F8FAFC] px-3 font-poppins text-sm font-semibold text-slate-700 outline-none transition focus:border-[#00AEEF] focus:bg-white"
    >
      {options.map((item) => (
        <option key={item.value} value={item.value}>
          {item.label}
        </option>
      ))}
    </select>
  )
}

const LoadingSkeleton = () => {
  return (
    <div className="grid gap-4">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="h-44 animate-pulse rounded-[5px] border border-slate-100 bg-white shadow-sm"
        />
      ))}
    </div>
  )
}

const AdminNotificationsPage = () => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const searchParamsString = searchParams.toString()

  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState("")
  const [notifications, setNotifications] = useState([])
  const [page, setPage] = useState(Number(searchParams.get("page") || 1))
  const [pages, setPages] = useState(1)
  const [unreadCount, setUnreadCount] = useState(0)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    readStatus: searchParams.get("readStatus") || "all",
    type: searchParams.get("type") || "all",
    priority: searchParams.get("priority") || "all",
  })

  const stats = useMemo(() => {
    return {
      shown: notifications.length,
      unread: notifications.filter((item) => !item.isRead).length,
      read: notifications.filter((item) => item.isRead).length,
      high: notifications.filter((item) => item.priority === "high").length,
    }
  }, [notifications])

  const updateUrl = (nextFilters = filters, nextPage = page) => {
    const params = new URLSearchParams()

    if (nextFilters.search.trim()) params.set("search", nextFilters.search.trim())
    if (nextFilters.readStatus !== "all") {
      params.set("readStatus", nextFilters.readStatus)
    }
    if (nextFilters.type !== "all") params.set("type", nextFilters.type)
    if (nextFilters.priority !== "all") {
      params.set("priority", nextFilters.priority)
    }
    if (nextPage > 1) params.set("page", String(nextPage))

    setSearchParams(params)
  }

  const fetchNotifications = async (override = {}) => {
    setLoading(true)
    setError("")

    try {
      const activePage = override.page ?? page
      const activeFilters = override.filters ?? filters

      const params = {
        page: activePage,
        limit: 12,
        sort: "-createdAt",
        search: activeFilters.search,
        readStatus: activeFilters.readStatus,
      }

      if (activeFilters.type !== "all") params.type = activeFilters.type
      if (activeFilters.priority !== "all") {
        params.priority = activeFilters.priority
      }

      const data = await adminApi.getNotifications(params)

      setNotifications(data.notifications || data.data?.notifications || [])
      setPages(data.pages || data.data?.pages || 1)
      setUnreadCount(data.unreadCount || data.data?.unreadCount || 0)
    } catch (err) {
      setError(err.message || "Failed to load notifications.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const nextPage = Number(searchParams.get("page") || 1)

    const nextFilters = {
      search: searchParams.get("search") || "",
      readStatus: searchParams.get("readStatus") || "all",
      type: searchParams.get("type") || "all",
      priority: searchParams.get("priority") || "all",
    }

    setPage(nextPage)
    setFilters(nextFilters)

    fetchNotifications({
      page: nextPage,
      filters: nextFilters,
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParamsString])

  const handleSearchSubmit = (event) => {
    event.preventDefault()
    setPage(1)
    updateUrl(filters, 1)
  }

  const handleFilterChange = (name, value) => {
    const nextFilters = {
      ...filters,
      [name]: value,
    }

    setFilters(nextFilters)
    setPage(1)
    updateUrl(nextFilters, 1)
  }

  const clearFilters = () => {
    const nextFilters = {
      search: "",
      readStatus: "all",
      type: "all",
      priority: "all",
    }

    setFilters(nextFilters)
    setPage(1)
    setSearchParams({})
  }

  const refreshCurrentList = async () => {
    await fetchNotifications({
      page,
      filters,
    })
  }

  const markAsRead = async (notification, shouldOpen = false) => {
    if (!notification?._id) return

    const loadingKey = `${notification._id}-read`

    setActionLoading(loadingKey)
    setError("")
    setSuccess("")

    try {
      if (!notification.isRead) {
        await adminApi.markNotificationAsRead(notification._id)

        setNotifications((prev) =>
          prev.map((item) =>
            item._id === notification._id ? { ...item, isRead: true } : item
          )
        )

        setUnreadCount((prev) => Math.max(0, prev - 1))
      }

      if (shouldOpen && notification.actionUrl) {
        navigate(notification.actionUrl)
        return
      }

      setSuccess("Notification marked as read.")
    } catch (err) {
      setError(err.message || "Failed to mark notification as read.")
    } finally {
      setActionLoading("")
    }
  }

  const openNotification = async (notification) => {
    if (notification.actionUrl) {
      await markAsRead(notification, true)
      return
    }

    await markAsRead(notification, false)
  }

  const markAllRead = async () => {
    setActionLoading("mark-all")
    setError("")
    setSuccess("")

    try {
      await adminApi.markAllNotificationsAsRead()

      setNotifications((prev) =>
        prev.map((item) => ({
          ...item,
          isRead: true,
        }))
      )

      setUnreadCount(0)
      setSuccess("All notifications marked as read.")
    } catch (err) {
      setError(err.message || "Failed to mark all notifications as read.")
    } finally {
      setActionLoading("")
    }
  }

  const archiveNotification = async (id) => {
    setActionLoading(`${id}-archive`)
    setError("")
    setSuccess("")

    try {
      await adminApi.archiveNotification(id)
      setNotifications((prev) => prev.filter((item) => item._id !== id))
      setSuccess("Notification archived successfully.")
    } catch (err) {
      setError(err.message || "Failed to archive notification.")
    } finally {
      setActionLoading("")
    }
  }

  const handlePageChange = (nextPage) => {
    setPage(nextPage)
    updateUrl(filters, nextPage)
  }

  return (
    <div className="grid gap-5">
      {/* Header */}
      <section className="overflow-hidden rounded-[5px] bg-slate-950 shadow-[0_20px_60px_rgba(15,23,42,0.16)]">
        <div className="relative p-5 sm:p-7">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#00AEEF]/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 left-10 h-64 w-64 rounded-full bg-[#FF6B00]/20 blur-3xl" />

          <div className="relative z-10 flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p className="font-poppins text-[10px] font-bold uppercase tracking-[0.1em] text-[#00AEEF] sm:text-xs">
                TravelEx CRM Alerts
              </p>

              <h1 className="mt-2 font-fredoka text-[34px] font-semibold leading-tight text-white sm:text-[46px]">
                Notifications
              </h1>

              <p className="mt-2 max-w-3xl font-poppins text-sm font-medium leading-7 text-white/70 sm:text-base">
                Track new leads, contact inquiries, system activity, and staff
                alerts from one organized notification center.
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={markAllRead}
                disabled={!unreadCount || actionLoading === "mark-all"}
                className="inline-flex items-center justify-center gap-2 rounded-[5px] bg-white/10 px-4 py-3 font-poppins text-sm font-semibold text-white backdrop-blur transition hover:bg-[#00AEEF] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <FaCheckCircle />
                {actionLoading === "mark-all" ? "Updating..." : "Mark All Read"}
              </button>

              <button
                type="button"
                onClick={refreshCurrentList}
                className="inline-flex items-center justify-center gap-2 rounded-[5px] bg-[#FF6B00] px-4 py-3 font-poppins text-sm font-semibold text-white transition hover:bg-[#00AEEF]"
              >
                Refresh
                <FaArrowRight className="text-xs" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {success && (
        <div className="rounded-[5px] border border-emerald-100 bg-emerald-50 px-5 py-4 font-poppins text-sm font-semibold text-emerald-700">
          {success}
        </div>
      )}

      {error && (
        <div className="rounded-[5px] border border-red-100 bg-red-50 px-5 py-4 font-poppins text-sm font-semibold text-red-600">
          {error}
        </div>
      )}

      {/* Filters */}
      <section className="rounded-[5px] border border-slate-100 bg-white p-5 shadow-sm">
        <div className="grid gap-3 lg:grid-cols-[1fr_180px_190px_180px_auto] lg:items-center">
          <form onSubmit={handleSearchSubmit} className="relative">
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400" />

            <input
              type="search"
              value={filters.search}
              onChange={(event) =>
                setFilters((prev) => ({
                  ...prev,
                  search: event.target.value,
                }))
              }
              placeholder="Search notifications..."
              className="h-11 w-full rounded-[5px] border border-slate-200 bg-[#F8FAFC] pl-10 pr-3 font-poppins text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#00AEEF] focus:bg-white"
            />
          </form>

          <SelectBox
            value={filters.readStatus}
            onChange={(value) => handleFilterChange("readStatus", value)}
            options={readStatusOptions}
          />

          <SelectBox
            value={filters.type}
            onChange={(value) => handleFilterChange("type", value)}
            options={typeOptions}
          />

          <SelectBox
            value={filters.priority}
            onChange={(value) => handleFilterChange("priority", value)}
            options={priorityOptions}
          />

          {(filters.search ||
            filters.readStatus !== "all" ||
            filters.type !== "all" ||
            filters.priority !== "all") && (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-[5px] border border-slate-200 bg-white px-4 font-poppins text-sm font-semibold text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
            >
              <FaTimes className="text-xs" />
              Clear
            </button>
          )}
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Shown" value={stats.shown} />
          <StatCard label="Total Unread" value={unreadCount} tone="orange" />
          <StatCard label="Unread Shown" value={stats.unread} tone="blue" />
          <StatCard label="High Priority" value={stats.high} tone="green" />
        </div>
      </section>

      {loading ? (
        <LoadingSkeleton />
      ) : notifications.length === 0 ? (
        <div className="rounded-[5px] border border-slate-100 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[5px] bg-[#00AEEF]/10 text-[#00AEEF]">
            <FaInbox />
          </div>

          <h2 className="mt-5 font-fredoka text-[30px] font-semibold text-slate-950">
            No notifications found
          </h2>

          <p className="mx-auto mt-2 max-w-xl font-poppins text-sm font-medium leading-7 text-slate-500">
            New lead alerts, contact inquiry alerts, and system notifications
            will appear here.
          </p>

          <button
            type="button"
            onClick={clearFilters}
            className="mt-5 rounded-[5px] bg-[#FF6B00] px-5 py-2.5 font-poppins text-sm font-semibold text-white transition hover:bg-[#00AEEF]"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {notifications.map((notification) => {
            const readLoading = actionLoading === `${notification._id}-read`
            const archiveLoading = actionLoading === `${notification._id}-archive`

            return (
              <article
                key={notification._id}
                className={`rounded-[5px] border p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-[0_18px_45px_rgba(15,23,42,0.08)] ${
                  notification.isRead
                    ? "border-slate-100 bg-white"
                    : "border-[#00AEEF]/20 bg-sky-50"
                }`}
              >
                <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                  <button
                    type="button"
                    onClick={() => openNotification(notification)}
                    className="flex flex-1 gap-4 text-left"
                  >
                    <span
                      className={`mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-[5px] ${
                        notification.isRead
                          ? "bg-slate-100 text-slate-500"
                          : "bg-[#00AEEF] text-white"
                      }`}
                    >
                      {notification.priority === "high" ? (
                        <FaExclamationCircle />
                      ) : notification.type === "lead" ? (
                        <FaClipboardList />
                      ) : notification.type === "contact-inquiry" ? (
                        <FaEnvelope />
                      ) : (
                        <FaBell />
                      )}
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-2">
                        <span className="font-fredoka text-[25px] font-semibold leading-tight text-slate-950">
                          {notification.title || "Notification"}
                        </span>

                        {!notification.isRead && (
                          <span className="rounded-[5px] bg-[#FF6B00] px-2.5 py-1 font-poppins text-[10px] font-bold uppercase text-white">
                            New
                          </span>
                        )}
                      </span>

                      <span className="mt-1 block font-poppins text-sm font-medium leading-6 text-slate-600">
                        {notification.message || "No notification message."}
                      </span>

                      <span className="mt-3 flex flex-wrap gap-2">
                        <span
                          className={`rounded-[5px] px-3 py-1 font-poppins text-[10px] font-bold uppercase ${getTypeClass(
                            notification.type
                          )}`}
                        >
                          {getTypeLabel(notification.type)}
                        </span>

                        <span
                          className={`rounded-[5px] px-3 py-1 font-poppins text-[10px] font-bold uppercase ${getPriorityClass(
                            notification.priority
                          )}`}
                        >
                          {notification.priority || "normal"}
                        </span>

                        <span className="rounded-[5px] bg-white px-3 py-1 font-poppins text-[10px] font-bold uppercase text-slate-500">
                          {formatDate(notification.createdAt)}
                        </span>
                      </span>
                    </span>
                  </button>

                  <div className="flex shrink-0 flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => markAsRead(notification)}
                      disabled={notification.isRead || readLoading}
                      className="inline-flex items-center justify-center gap-2 rounded-[5px] bg-[#F8FAFC] px-4 py-2.5 font-poppins text-xs font-semibold text-slate-700 transition hover:bg-[#00AEEF] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <FaCheckCircle />
                      {readLoading ? "Updating..." : "Mark Read"}
                    </button>

                    {notification.actionUrl && (
                      <button
                        type="button"
                        onClick={() => openNotification(notification)}
                        className="inline-flex items-center justify-center gap-2 rounded-[5px] bg-slate-950 px-4 py-2.5 font-poppins text-xs font-semibold text-white transition hover:bg-[#FF6B00]"
                      >
                        <FaEye />
                        Open
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => archiveNotification(notification._id)}
                      disabled={archiveLoading}
                      className="inline-flex items-center justify-center gap-2 rounded-[5px] border border-slate-200 bg-white px-4 py-2.5 font-poppins text-xs font-semibold text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <FaArchive />
                      {archiveLoading ? "Archiving..." : "Archive"}
                    </button>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}

      {pages > 1 && (
        <div className="flex items-center justify-between rounded-[5px] border border-slate-100 bg-white p-3 shadow-sm">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => handlePageChange(Math.max(1, page - 1))}
            className="rounded-[5px] border border-slate-200 px-4 py-2 font-poppins text-xs font-semibold text-slate-700 transition hover:border-[#00AEEF] hover:text-[#00AEEF] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>

          <p className="font-poppins text-xs font-semibold text-slate-500">
            Page {page} of {pages}
          </p>

          <button
            type="button"
            disabled={page >= pages}
            onClick={() => handlePageChange(Math.min(pages, page + 1))}
            className="rounded-[5px] border border-slate-200 px-4 py-2 font-poppins text-xs font-semibold text-slate-700 transition hover:border-[#00AEEF] hover:text-[#00AEEF] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}

export default AdminNotificationsPage