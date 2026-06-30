import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  FaArchive,
  FaBell,
  FaCheckCircle,
  FaSearch,
} from "react-icons/fa"

import AppSelect from "../../components/common/AppSelect"
import { adminApi } from "../../services/api"

const readStatusOptions = ["all", "unread", "read"]
const typeOptions = [
  "all",
  "lead",
  "contact-inquiry",
  "umrah-package",
  "tour",
  "visa-service",
  "blog",
  "faq",
  "media",
  "system",
]
const priorityOptions = ["all", "low", "normal", "high"]

const inputClass =
  "h-11 w-full rounded-[5px] border border-slate-200 bg-white pl-10 pr-3 font-poppins text-xs font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#00AEEF] focus:ring-2 focus:ring-[#00AEEF]/10 sm:h-12 sm:pl-11 sm:pr-4 sm:text-sm"

const AdminNotificationsPage = () => {
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [unreadCount, setUnreadCount] = useState(0)

  const [filters, setFilters] = useState({
    search: "",
    readStatus: "all",
    type: "all",
    priority: "all",
  })

  const fetchNotifications = async () => {
    try {
      setLoading(true)

      const params = {
        page,
        limit: 12,
        sort: "-createdAt",
        search: filters.search,
        readStatus: filters.readStatus,
      }

      if (filters.type !== "all") params.type = filters.type
      if (filters.priority !== "all") params.priority = filters.priority

      const data = await adminApi.getNotifications(params)

      setNotifications(data.notifications || [])
      setPages(data.pages || 1)
      setUnreadCount(data.unreadCount || 0)
    } catch (error) {
      console.error("Notifications fetch error:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNotifications()
  }, [page, filters.readStatus, filters.type, filters.priority])

  const handleSearchSubmit = (event) => {
    event.preventDefault()
    setPage(1)
    fetchNotifications()
  }

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }))

    setPage(1)
  }

  const markAsRead = async (notification) => {
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

      if (notification.actionUrl) {
        navigate(notification.actionUrl)
      }
    } catch (error) {
      console.error("Mark as read error:", error)
    }
  }

  const markAllRead = async () => {
    try {
      await adminApi.markAllNotificationsAsRead()

      setNotifications((prev) =>
        prev.map((item) => ({
          ...item,
          isRead: true,
        }))
      )

      setUnreadCount(0)
    } catch (error) {
      console.error("Mark all read error:", error)
    }
  }

  const archiveNotification = async (id) => {
    try {
      await adminApi.archiveNotification(id)
      setNotifications((prev) => prev.filter((item) => item._id !== id))
    } catch (error) {
      console.error("Archive notification error:", error)
    }
  }

  return (
    <main className="bg-[#F8FAFC]">
      <section className="px-4 py-5 sm:px-6 lg:px-8">
        <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <p className="font-poppins text-[10px] font-bold uppercase tracking-[0.08em] text-[#00AEEF]">
              Admin Notifications
            </p>

            <h1 className="mt-1 font-fredoka text-[28px] font-semibold leading-tight text-slate-950 sm:text-[38px]">
              Notifications
            </h1>

            <p className="mt-1 font-poppins text-sm font-medium text-slate-500">
              {unreadCount} unread notification{unreadCount === 1 ? "" : "s"}
            </p>
          </div>

          <button
            type="button"
            onClick={markAllRead}
            disabled={!unreadCount}
            className="inline-flex items-center justify-center gap-2 rounded-[5px] bg-[#FF6B00] px-5 py-3 font-poppins text-xs font-semibold text-white transition hover:bg-[#00AEEF] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FaCheckCircle />
            Mark All Read
          </button>
        </div>

        <div className="mb-5 rounded-[5px] border border-slate-100 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
          <div className="grid gap-3 lg:grid-cols-[1fr_190px_190px_190px]">
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
                className={inputClass}
              />
            </form>

            <AppSelect
              label=""
              value={filters.readStatus}
              onChange={(value) => handleFilterChange("readStatus", value)}
              options={readStatusOptions}
              placeholder="Read Status"
            />

            <AppSelect
              label=""
              value={filters.type}
              onChange={(value) => handleFilterChange("type", value)}
              options={typeOptions}
              placeholder="Type"
            />

            <AppSelect
              label=""
              value={filters.priority}
              onChange={(value) => handleFilterChange("priority", value)}
              options={priorityOptions}
              placeholder="Priority"
            />
          </div>
        </div>

        <div className="grid gap-3">
          {loading ? (
            <div className="rounded-[5px] border border-slate-100 bg-white p-6 text-center font-poppins text-sm font-semibold text-slate-500">
              Loading notifications...
            </div>
          ) : notifications.length ? (
            notifications.map((notification) => (
              <article
                key={notification._id}
                className={`rounded-[5px] border p-4 shadow-[0_10px_30px_rgba(15,23,42,0.04)] transition ${
                  notification.isRead
                    ? "border-slate-100 bg-white"
                    : "border-[#00AEEF]/20 bg-sky-50"
                }`}
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <button
                    type="button"
                    onClick={() => markAsRead(notification)}
                    className="flex flex-1 gap-3 text-left"
                  >
                    <span
                      className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-[5px] ${
                        notification.isRead
                          ? "bg-slate-100 text-slate-500"
                          : "bg-[#00AEEF] text-white"
                      }`}
                    >
                      <FaBell />
                    </span>

                    <span className="min-w-0">
                      <span className="block font-fredoka text-[22px] font-semibold leading-tight text-slate-950">
                        {notification.title}
                      </span>

                      <span className="mt-1 block font-poppins text-sm font-medium leading-6 text-slate-600">
                        {notification.message}
                      </span>

                      <span className="mt-3 flex flex-wrap gap-2">
                        <span className="rounded-[5px] bg-white px-3 py-1 font-poppins text-[10px] font-bold uppercase text-slate-500">
                          {notification.type}
                        </span>

                        <span
                          className={`rounded-[5px] px-3 py-1 font-poppins text-[10px] font-bold uppercase ${
                            notification.priority === "high"
                              ? "bg-orange-50 text-[#FF6B00]"
                              : notification.priority === "low"
                                ? "bg-slate-100 text-slate-500"
                                : "bg-sky-50 text-[#00AEEF]"
                          }`}
                        >
                          {notification.priority}
                        </span>

                        <span className="rounded-[5px] bg-white px-3 py-1 font-poppins text-[10px] font-bold uppercase text-slate-500">
                          {new Date(notification.createdAt).toLocaleString()}
                        </span>
                      </span>
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => archiveNotification(notification._id)}
                    className="inline-flex items-center justify-center gap-2 rounded-[5px] border border-slate-200 bg-white px-4 py-2.5 font-poppins text-xs font-semibold text-slate-600 transition hover:border-red-200 hover:text-red-600"
                  >
                    <FaArchive />
                    Archive
                  </button>
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-[5px] border border-slate-100 bg-white p-10 text-center shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
              <FaBell className="mx-auto text-3xl text-slate-300" />

              <h3 className="mt-3 font-fredoka text-[24px] font-semibold text-slate-950">
                No notifications found
              </h3>

              <p className="mt-1 font-poppins text-sm font-medium text-slate-500">
                New lead and system notifications will appear here.
              </p>
            </div>
          )}
        </div>

        {pages > 1 && (
          <div className="mt-5 flex items-center justify-between rounded-[5px] border border-slate-100 bg-white p-3">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
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
              onClick={() => setPage((prev) => Math.min(pages, prev + 1))}
              className="rounded-[5px] border border-slate-200 px-4 py-2 font-poppins text-xs font-semibold text-slate-700 transition hover:border-[#00AEEF] hover:text-[#00AEEF] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </section>
    </main>
  )
}

export default AdminNotificationsPage