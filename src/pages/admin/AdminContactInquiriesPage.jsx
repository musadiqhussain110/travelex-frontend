import { useEffect, useMemo, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import {
  FaArrowRight,
  FaCheckCircle,
  FaDownload,
  FaEnvelope,
  FaEye,
  FaInbox,
  FaPhoneAlt,
  FaReply,
  FaSearch,
  FaTimes,
  FaUser,
  FaWhatsapp,
} from "react-icons/fa"
import { adminApi } from "../../services/api"

const statuses = ["All", "New", "Read", "Replied", "Closed"]

const statusStyles = {
  New: "bg-orange-50 text-[#FF6B00]",
  Read: "bg-sky-50 text-[#00AEEF]",
  Replied: "bg-emerald-50 text-emerald-700",
  Closed: "bg-slate-100 text-slate-600",
}

const formatDate = (date) => {
  if (!date) return "-"
  return new Date(date).toLocaleString()
}

const getWhatsappUrl = (phone = "") => {
  const cleanPhone = String(phone).replace(/[^\d]/g, "")
  return cleanPhone ? `https://wa.me/${cleanPhone}` : "https://wa.me/"
}

const getStatusClass = (status = "New") => {
  return statusStyles[status] || "bg-slate-100 text-slate-600"
}

const StatCard = ({ label, value, tone = "default" }) => {
  const toneClasses = {
    default: "bg-white text-slate-950",
    orange: "bg-orange-50 text-[#FF6B00]",
    blue: "bg-sky-50 text-[#00AEEF]",
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

const AdminContactInquiriesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const searchParamsString = searchParams.toString()

  const [inquiries, setInquiries] = useState([])
  const [search, setSearch] = useState(searchParams.get("search") || "")
  const [status, setStatus] = useState(searchParams.get("status") || "All")
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const stats = useMemo(() => {
    return {
      total: inquiries.length,
      new: inquiries.filter((item) => item.status === "New").length,
      read: inquiries.filter((item) => item.status === "Read").length,
      replied: inquiries.filter((item) => item.status === "Replied").length,
      closed: inquiries.filter((item) => item.status === "Closed").length,
    }
  }, [inquiries])

  const updateUrlFilters = (nextFilters = {}) => {
    const params = new URLSearchParams()

    const nextSearch = nextFilters.search ?? search
    const nextStatus = nextFilters.status ?? status

    if (nextSearch.trim()) params.set("search", nextSearch.trim())
    if (nextStatus !== "All") params.set("status", nextStatus)

    setSearchParams(params)
  }

  const loadInquiries = async (override = {}) => {
    setLoading(true)
    setError("")

    try {
      const activeSearch = override.search ?? search
      const activeStatus = override.status ?? status

      const params = new URLSearchParams()
      params.set("limit", "100")
      params.set("sort", "-createdAt")

      if (activeSearch.trim()) {
        params.set("search", activeSearch.trim())
      }

      if (activeStatus !== "All") {
        params.set("status", activeStatus)
      }

      const data = await adminApi.getContactInquiries(`?${params.toString()}`)

      setInquiries(
        data.inquiries ||
          data.contactInquiries ||
          data.data?.inquiries ||
          data.data?.contactInquiries ||
          []
      )
    } catch (err) {
      setError(err.message || "Failed to load contact inquiries.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const urlStatus = searchParams.get("status") || "All"
    const urlSearch = searchParams.get("search") || ""

    setStatus(urlStatus)
    setSearch(urlSearch)

    loadInquiries({
      status: urlStatus,
      search: urlSearch,
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParamsString])

  const handleSearchSubmit = (event) => {
    event.preventDefault()
    updateUrlFilters({ search, status })
  }

  const handleStatusFilterChange = (nextStatus) => {
    setStatus(nextStatus)
    updateUrlFilters({ status: nextStatus })
  }

  const clearFilters = () => {
    setSearch("")
    setStatus("All")
    setSearchParams({})
  }

  const refreshCurrentList = async () => {
    await loadInquiries({ search, status })
  }

  const handleStatusChange = async (id, nextStatus, name = "Inquiry") => {
    const loadingKey = `${id}-${nextStatus}`

    setActionLoading(loadingKey)
    setError("")
    setSuccess("")

    try {
      await adminApi.updateContactInquiryStatus(id, nextStatus)
      setSuccess(`${name} marked as ${nextStatus}.`)
      await refreshCurrentList()
    } catch (err) {
      setError(err.message || "Failed to update inquiry status.")
    } finally {
      setActionLoading("")
    }
  }

  const exportCsv = () => {
    if (!inquiries.length) return

    const columns = [
      "Name",
      "Phone",
      "Email",
      "Subject",
      "Status",
      "Message",
      "Created At",
    ]

    const rows = inquiries.map((inquiry) => [
      inquiry.name || "",
      inquiry.phone || "",
      inquiry.email || "",
      inquiry.subject || "Contact Inquiry",
      inquiry.status || "New",
      inquiry.message || "",
      formatDate(inquiry.createdAt),
    ])

    const csvContent = [columns, ...rows]
      .map((row) =>
        row
          .map((value) => `"${String(value).replaceAll('"', '""')}"`)
          .join(",")
      )
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")

    link.href = url
    link.download = "travelex-contact-inquiries.csv"
    link.click()

    URL.revokeObjectURL(url)
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
                TravelEx Contact CRM
              </p>

              <h1 className="mt-2 font-fredoka text-[34px] font-semibold leading-tight text-white sm:text-[46px]">
                Contact Inquiries
              </h1>

              <p className="mt-2 max-w-3xl font-poppins text-sm font-medium leading-7 text-white/70 sm:text-base">
                Manage customer messages submitted through the TravelEx contact
                page, reply faster, and keep every inquiry organized.
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={exportCsv}
                disabled={!inquiries.length}
                className="inline-flex items-center justify-center gap-2 rounded-[5px] bg-white/10 px-4 py-3 font-poppins text-sm font-semibold text-white backdrop-blur transition hover:bg-[#00AEEF] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <FaDownload />
                Export CSV
              </button>

              <Link
                to="/admin/dashboard"
                className="inline-flex items-center justify-center gap-2 rounded-[5px] bg-[#FF6B00] px-4 py-3 font-poppins text-sm font-semibold text-white transition hover:bg-[#00AEEF]"
              >
                Dashboard
                <FaArrowRight className="text-xs" />
              </Link>
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
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <form
            onSubmit={handleSearchSubmit}
            className="flex w-full gap-2 xl:max-w-2xl"
          >
            <div className="flex h-11 flex-1 items-center gap-2 rounded-[5px] border border-slate-200 bg-[#F8FAFC] px-3">
              <FaSearch className="text-xs text-slate-400" />

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by name, phone, email, subject..."
                className="min-w-0 flex-1 bg-transparent font-poppins text-sm font-semibold text-slate-700 outline-none placeholder:text-slate-400"
              />
            </div>

            <button
              type="submit"
              className="rounded-[5px] bg-[#FF6B00] px-5 font-poppins text-sm font-semibold text-white transition hover:bg-[#00AEEF]"
            >
              Search
            </button>
          </form>

          <div className="flex flex-wrap gap-2">
            {statuses.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => handleStatusFilterChange(item)}
                className={`rounded-[5px] px-4 py-2.5 font-poppins text-xs font-bold transition ${
                  status === item
                    ? "bg-[#00AEEF] text-white"
                    : "bg-[#F8FAFC] text-slate-700 hover:bg-slate-100"
                }`}
              >
                {item}
              </button>
            ))}

            {(search || status !== "All") && (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center gap-2 rounded-[5px] border border-slate-200 bg-white px-4 py-2.5 font-poppins text-xs font-bold text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
              >
                <FaTimes />
                Clear
              </button>
            )}
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Shown Messages" value={stats.total} />
          <StatCard label="New" value={stats.new} tone="orange" />
          <StatCard label="Read" value={stats.read} tone="blue" />
          <StatCard label="Replied" value={stats.replied} tone="green" />
        </div>

        <p className="mt-4 font-poppins text-xs font-semibold text-slate-500">
          Filter:{" "}
          <span className="font-bold text-slate-800">
            {status === "All" ? "All contact inquiries" : status}
          </span>
        </p>
      </section>

      {loading ? (
        <LoadingSkeleton />
      ) : inquiries.length === 0 ? (
        <div className="rounded-[5px] border border-slate-100 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[5px] bg-[#00AEEF]/10 text-[#00AEEF]">
            <FaInbox />
          </div>

          <h2 className="mt-5 font-fredoka text-[30px] font-semibold text-slate-950">
            No contact inquiries found
          </h2>

          <p className="mx-auto mt-2 max-w-xl font-poppins text-sm font-medium leading-7 text-slate-500">
            No customer message matches your current search or status filter.
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
          {inquiries.map((inquiry) => {
            const currentStatus = inquiry.status || "New"
            const name = inquiry.name || "Customer"

            return (
              <article
                key={inquiry._id}
                className="rounded-[5px] border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[#00AEEF]/30 hover:shadow-[0_18px_45px_rgba(15,23,42,0.08)]"
              >
                <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-fredoka text-[25px] font-semibold leading-tight text-slate-950">
                        {name}
                      </h2>

                      <span
                        className={`rounded-[5px] px-3 py-1 font-poppins text-xs font-bold ${getStatusClass(
                          currentStatus
                        )}`}
                      >
                        {currentStatus}
                      </span>
                    </div>

                    <p className="mt-1.5 font-poppins text-sm font-semibold leading-6 text-slate-500">
                      {inquiry.subject || "Contact Inquiry"}
                    </p>

                    <div className="mt-3 grid gap-2 font-poppins text-sm font-medium text-slate-600 sm:grid-cols-2 xl:grid-cols-3">
                      <p className="flex min-w-0 items-center gap-2">
                        <FaPhoneAlt className="shrink-0 text-[#FF6B00]" />
                        <span className="break-words">
                          {inquiry.phone || "-"}
                        </span>
                      </p>

                      <p className="flex min-w-0 items-center gap-2">
                        <FaEnvelope className="shrink-0 text-[#00AEEF]" />
                        <span className="break-all">
                          {inquiry.email || "-"}
                        </span>
                      </p>

                      <p className="flex min-w-0 items-center gap-2">
                        <FaUser className="shrink-0 text-slate-400" />
                        <span>{formatDate(inquiry.createdAt)}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-wrap gap-2">
                    <a
                      href={getWhatsappUrl(inquiry.phone)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-[5px] bg-[#25D366] px-4 py-2.5 font-poppins text-xs font-semibold text-white transition hover:bg-[#00AEEF]"
                    >
                      <FaWhatsapp />
                      WhatsApp
                    </a>

                    <a
                      href={`tel:${inquiry.phone || ""}`}
                      className="inline-flex items-center justify-center gap-2 rounded-[5px] bg-[#F8FAFC] px-4 py-2.5 font-poppins text-xs font-semibold text-slate-700 transition hover:bg-slate-950 hover:text-white"
                    >
                      <FaPhoneAlt />
                      Call
                    </a>

                    <a
                      href={`mailto:${inquiry.email || ""}`}
                      className="inline-flex items-center justify-center gap-2 rounded-[5px] border border-slate-200 bg-white px-4 py-2.5 font-poppins text-xs font-semibold text-slate-700 transition hover:border-[#00AEEF] hover:text-[#00AEEF]"
                    >
                      <FaEnvelope />
                      Email
                    </a>

                    <Link
                      to={`/admin/contact-inquiries/${inquiry._id}`}
                      className="inline-flex items-center justify-center gap-2 rounded-[5px] bg-slate-950 px-4 py-2.5 font-poppins text-xs font-semibold text-white transition hover:bg-[#FF6B00]"
                    >
                      <FaEye />
                      View Details
                    </Link>
                  </div>
                </div>

                {inquiry.message && (
                  <div className="mt-4 rounded-[5px] border border-slate-100 bg-[#F8FAFC] px-4 py-3">
                    <p className="font-poppins text-[10px] font-bold uppercase tracking-[0.08em] text-slate-400">
                      Message Preview
                    </p>

                    <p className="mt-1 max-h-28 overflow-hidden whitespace-pre-wrap font-poppins text-sm font-medium leading-6 text-slate-600">
                      {inquiry.message}
                    </p>
                  </div>
                )}

                <div className="mt-4 rounded-[5px] border border-slate-100 bg-white p-3">
                  <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                    <div>
                      <p className="font-poppins text-[10px] font-bold uppercase tracking-[0.08em] text-slate-400">
                        Quick CRM Actions
                      </p>

                      <p className="mt-0.5 font-poppins text-xs font-semibold text-slate-500">
                        Update message status without opening the full inquiry.
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          handleStatusChange(inquiry._id, "Read", name)
                        }
                        disabled={actionLoading || currentStatus === "Read"}
                        className="inline-flex items-center justify-center gap-2 rounded-[5px] bg-sky-50 px-3 py-2 font-poppins text-xs font-bold text-[#00AEEF] transition hover:bg-[#00AEEF] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <FaEye />
                        {actionLoading === `${inquiry._id}-Read`
                          ? "Updating..."
                          : "Mark Read"}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleStatusChange(inquiry._id, "Replied", name)
                        }
                        disabled={actionLoading || currentStatus === "Replied"}
                        className="inline-flex items-center justify-center gap-2 rounded-[5px] bg-emerald-50 px-3 py-2 font-poppins text-xs font-bold text-emerald-700 transition hover:bg-emerald-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <FaReply />
                        {actionLoading === `${inquiry._id}-Replied`
                          ? "Updating..."
                          : "Mark Replied"}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleStatusChange(inquiry._id, "Closed", name)
                        }
                        disabled={actionLoading || currentStatus === "Closed"}
                        className="inline-flex items-center justify-center gap-2 rounded-[5px] bg-slate-100 px-3 py-2 font-poppins text-xs font-bold text-slate-700 transition hover:bg-slate-950 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <FaCheckCircle />
                        {actionLoading === `${inquiry._id}-Closed`
                          ? "Updating..."
                          : "Close"}
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default AdminContactInquiriesPage