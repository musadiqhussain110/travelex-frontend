import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { FaBell, FaCheckCircle } from "react-icons/fa"
import { adminApi } from "../../services/api"

const AdminNotificationBell = () => {
  const navigate = useNavigate()
  const dropdownRef = useRef(null)

  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [notifications, setNotifications] = useState([])

  const fetchNotifications = async () => {
    try {
      setLoading(true)

      const data = await adminApi.getNotifications({
        page: 1,
        limit: 6,
        readStatus: "all",
        sort: "-createdAt",
      })

      setNotifications(data.notifications || [])
      setUnreadCount(data.unreadCount || 0)
    } catch (error) {
      console.error("Notification fetch error:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUnreadCount = async () => {
    try {
      const data = await adminApi.getUnreadNotificationCount()
      setUnreadCount(data.unreadCount || 0)
    } catch (error) {
      console.error("Unread count error:", error)
    }
  }

  useEffect(() => {
    fetchUnreadCount()

    const interval = setInterval(fetchUnreadCount, 30000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleOpen = async () => {
    const nextOpen = !open
    setOpen(nextOpen)

    if (nextOpen) {
      await fetchNotifications()
    }
  }

  const handleNotificationClick = async (notification) => {
    try {
      if (!notification.isRead) {
        await adminApi.markNotificationAsRead(notification._id)
        setUnreadCount((prev) => Math.max(0, prev - 1))
      }

      setOpen(false)

      if (notification.actionUrl) {
        navigate(notification.actionUrl)
      } else {
        navigate("/admin/notifications")
      }
    } catch (error) {
      console.error("Mark notification read error:", error)
    }
  }

  const handleMarkAllRead = async () => {
    try {
      await adminApi.markAllNotificationsAsRead()
      setUnreadCount(0)

      setNotifications((prev) =>
        prev.map((item) => ({
          ...item,
          isRead: true,
        }))
      )
    } catch (error) {
      console.error("Mark all notifications read error:", error)
    }
  }

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        onClick={handleOpen}
        className="relative flex h-10 w-10 items-center justify-center rounded-[5px] border border-slate-200 bg-white text-slate-700 transition hover:border-[#00AEEF] hover:text-[#00AEEF]"
      >
        <FaBell className="text-sm" />

        {unreadCount > 0 && (
          <span className="absolute -right-1.5 -top-1.5 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-[#FF6B00] px-1.5 font-poppins text-[10px] font-bold text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 z-50 w-[320px] overflow-hidden rounded-[5px] border border-slate-100 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.16)] sm:w-[380px]">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <div>
              <h3 className="font-fredoka text-[20px] font-semibold text-slate-950">
                Notifications
              </h3>

              <p className="font-poppins text-xs font-medium text-slate-500">
                {unreadCount} unread notification{unreadCount === 1 ? "" : "s"}
              </p>
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="font-poppins text-xs font-semibold text-[#00AEEF] transition hover:text-[#FF6B00]"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-[360px] overflow-y-auto">
            {loading ? (
              <p className="px-4 py-5 font-poppins text-sm font-medium text-slate-500">
                Loading notifications...
              </p>
            ) : notifications.length ? (
              notifications.map((notification) => (
                <button
                  key={notification._id}
                  type="button"
                  onClick={() => handleNotificationClick(notification)}
                  className={`block w-full border-b border-slate-100 px-4 py-3 text-left transition hover:bg-slate-50 ${
                    notification.isRead ? "bg-white" : "bg-sky-50/70"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${
                        notification.isRead ? "bg-slate-300" : "bg-[#FF6B00]"
                      }`}
                    />

                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-1 font-poppins text-sm font-bold text-slate-950">
                        {notification.title}
                      </p>

                      <p className="mt-1 line-clamp-2 font-poppins text-xs font-medium leading-5 text-slate-600">
                        {notification.message}
                      </p>

                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <span className="rounded-[5px] bg-slate-100 px-2 py-1 font-poppins text-[10px] font-bold uppercase text-slate-500">
                          {notification.type}
                        </span>

                        <span
                          className={`rounded-[5px] px-2 py-1 font-poppins text-[10px] font-bold uppercase ${
                            notification.priority === "high"
                              ? "bg-orange-50 text-[#FF6B00]"
                              : notification.priority === "low"
                                ? "bg-slate-100 text-slate-500"
                                : "bg-sky-50 text-[#00AEEF]"
                          }`}
                        >
                          {notification.priority}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <div className="px-4 py-8 text-center">
                <FaCheckCircle className="mx-auto text-2xl text-green-500" />

                <p className="mt-2 font-poppins text-sm font-semibold text-slate-700">
                  No notifications yet
                </p>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => {
              setOpen(false)
              navigate("/admin/notifications")
            }}
            className="block w-full border-t border-slate-100 bg-[#F8FAFC] px-4 py-3 text-center font-poppins text-xs font-bold uppercase tracking-[0.04em] text-[#00AEEF] transition hover:text-[#FF6B00]"
          >
            View all notifications
          </button>
        </div>
      )}
    </div>
  )
}

export default AdminNotificationBell