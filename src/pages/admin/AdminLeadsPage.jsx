import { useEffect, useMemo, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import {
  FaAngleLeft,
  FaAngleRight,
  FaArrowRight,
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
  FaDownload,
  FaEnvelope,
  FaEye,
  FaFilter,
  FaPhoneAlt,
  FaSearch,
  FaSortAmountDown,
  FaTable,
  FaTimes,
  FaUserCheck,
  FaUserClock,
  FaWhatsapp,
} from "react-icons/fa"

import { adminApi } from "../../services/api"
import { useAdminAuth } from "../../context/AdminAuthContext"
import SmartLeadScore from "../../components/admin/SmartLeadScore"
import { getSmartLeadScore } from "../../utils/leadScoring"

const statuses = [
  "All",
  "New",
  "Contacted",
  "Interested",
  "Awaiting Documents",
  "Payment Pending",
  "Booked",
  "Lost",
  "Cancelled",
]

const priorities = ["All", "low", "medium", "high", "urgent"]

const serviceFilters = [
  { value: "All", label: "All Services" },
  { value: "umrah", label: "Umrah" },
  { value: "tour", label: "Tours" },
  { value: "visa", label: "Visa" },
  { value: "ticket", label: "Air Tickets" },
  { value: "hotel", label: "Hotels" },
  { value: "carRental", label: "Airport Transfers" },
  { value: "contact", label: "Contact" },
  { value: "general", label: "General" },
]

const followUpFilters = [
  { value: "All", label: "All Follow-ups" },
  { value: "today", label: "Today" },
  { value: "overdue", label: "Overdue" },
  { value: "upcoming", label: "Upcoming" },
  { value: "none", label: "No Follow-up" },
]

const sortOptions = [
  { value: "-createdAt", label: "Newest First" },
  { value: "createdAt", label: "Oldest First" },
  { value: "followUpDate", label: "Follow-up Date" },
  { value: "-followUpDate", label: "Latest Follow-up" },
  { value: "name", label: "Name A-Z" },
  { value: "-name", label: "Name Z-A" },
  { value: "status", label: "Status A-Z" },
  { value: "priority", label: "Priority A-Z" },
]

const pageSizes = [25, 50, 100]

const serviceConfig = {
  all: {
    title: "All Leads",
    description:
      "Server-paginated CRM table for managing TravelEx customer inquiries at scale.",
    eyebrow: "CRM Lead Center",
  },
  umrah: {
    title: "Umrah Leads",
    description:
      "Manage Umrah package inquiries, passenger details, and booking requests.",
    eyebrow: "Umrah CRM",
  },
  tour: {
    title: "Tour Leads",
    description:
      "Manage tour package inquiries, destinations, dates, and customer requirements.",
    eyebrow: "Tours CRM",
  },
  visa: {
    title: "Visa Leads",
    description:
      "Manage visa service inquiries, applicant details, and documentation flow.",
    eyebrow: "Visa CRM",
  },
  ticket: {
    title: "Air Ticket Leads",
    description: "Manage domestic and international air ticket inquiries.",
    eyebrow: "Tickets CRM",
  },
  hotel: {
    title: "Hotel Leads",
    description:
      "Manage hotel booking inquiries, stay details, guests, and room requirements.",
    eyebrow: "Hotels CRM",
  },
  carRental: {
    title: "Airport Transfer Leads",
    description:
      "Manage airport pick-up, drop-off, flight details, passengers, and luggage.",
    eyebrow: "Transfers CRM",
  },
}

const serviceLabels = {
  umrah: "Umrah",
  tour: "Tour",
  visa: "Visa",
  hotel: "Hotel",
  carRental: "Airport Transfer",
  ticket: "Air Ticket",
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

const parsePositiveInt = (value, fallback = 1) => {
  const number = Number(value)

  if (!Number.isFinite(number) || number < 1) {
    return fallback
  }

  return Math.floor(number)
}

const parsePageSize = (value) => {
  const size = parsePositiveInt(value, 25)
  return pageSizes.includes(size) ? size : 25
}

const formatService = (serviceType = "") => {
  return serviceLabels[serviceType] || serviceType || "-"
}

const formatDate = (date) => {
  if (!date) return "-"
  return new Date(date).toLocaleString()
}

const formatShortDate = (date) => {
  if (!date) return "-"
  return new Date(date).toLocaleDateString()
}

const getWhatsappUrl = (phone = "") => {
  const cleanPhone = String(phone).replace(/[^\d]/g, "")

  if (!cleanPhone) {
    return "https://wa.me/"
  }

  return `https://wa.me/${cleanPhone}`
}

const getServicePath = (serviceType = "") => {
  return servicePaths[serviceType] || "/admin/leads"
}

const getServiceBadgeClass = (serviceType = "") => {
  const classes = {
    umrah: "bg-orange-50 text-[#FF6B00]",
    tour: "bg-sky-50 text-[#00AEEF]",
    visa: "bg-purple-50 text-purple-700",
    ticket: "bg-emerald-50 text-emerald-700",
    hotel: "bg-amber-50 text-amber-700",
    carRental: "bg-indigo-50 text-indigo-700",
    general: "bg-slate-100 text-slate-700",
    contact: "bg-blue-50 text-blue-700",
  }

  return classes[serviceType] || "bg-slate-100 text-slate-700"
}

const getStatusBadgeClass = (status = "") => {
  const classes = {
    New: "bg-orange-50 text-[#FF6B00]",
    Contacted: "bg-sky-50 text-[#00AEEF]",
    Interested: "bg-emerald-50 text-emerald-700",
    "Awaiting Documents": "bg-amber-50 text-amber-700",
    "Payment Pending": "bg-yellow-50 text-yellow-700",
    Booked: "bg-green-50 text-green-700",
    Lost: "bg-red-50 text-red-700",
    Cancelled: "bg-red-50 text-red-700",
  }

  return classes[status] || "bg-slate-100 text-slate-700"
}

const getPriorityBadgeClass = (priority = "") => {
  const classes = {
    low: "bg-slate-100 text-slate-600",
    medium: "bg-sky-50 text-[#00AEEF]",
    high: "bg-orange-50 text-[#FF6B00]",
    urgent: "bg-red-50 text-red-700",
  }

  return classes[priority] || "bg-slate-100 text-slate-600"
}

const getFollowUpBadgeClass = (status = "") => {
  const classes = {
    "Not Set": "bg-slate-100 text-slate-600",
    Scheduled: "bg-sky-50 text-[#00AEEF]",
    Completed: "bg-emerald-50 text-emerald-700",
    Cancelled: "bg-red-50 text-red-700",
  }

  return classes[status] || "bg-slate-100 text-slate-600"
}

const getPriorityLabel = (priority = "") => {
  if (!priority) return "-"
  return priority.charAt(0).toUpperCase() + priority.slice(1)
}

const isFollowUpOverdue = (lead) => {
  if (!lead?.followUpDate || lead.followUpStatus !== "Scheduled") return false

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const followUpDate = new Date(lead.followUpDate)
  followUpDate.setHours(0, 0, 0, 0)

  return followUpDate < today
}

const isFollowUpToday = (lead) => {
  if (!lead?.followUpDate || lead.followUpStatus !== "Scheduled") return false

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const followUpDate = new Date(lead.followUpDate)

  return followUpDate >= today && followUpDate < tomorrow
}

const getFollowUpLabel = (lead) => {
  if (!lead?.followUpDate) return "No follow-up"

  const date = formatShortDate(lead.followUpDate)
  const time = lead.followUpTime ? ` • ${lead.followUpTime}` : ""

  if (isFollowUpOverdue(lead)) {
    return `Overdue • ${date}${time}`
  }

  if (isFollowUpToday(lead)) {
    return `Today • ${date}${time}`
  }

  return `${date}${time}`
}

const getLeadSubtitle = (lead) => {
  if (!lead) return ""

  if (lead.serviceType === "umrah") {
    return [
      lead.city,
      lead.preferredDepartureCity || lead.departureCity,
      formatShortDate(lead.travelDate),
      lead.packageRequired,
    ]
      .filter(Boolean)
      .join(" • ")
  }

  if (lead.serviceType === "tour") {
    return [
      lead.city,
      lead.destination,
      formatShortDate(lead.travelDate),
      lead.interestedIn,
    ]
      .filter(Boolean)
      .join(" • ")
  }

  if (lead.serviceType === "ticket") {
    const route = [lead.departureCity, lead.destinationCity || lead.destination]
      .filter(Boolean)
      .join(" → ")

    return [
      route,
      formatShortDate(lead.travelDate),
      lead.returnDate ? `Return: ${formatShortDate(lead.returnDate)}` : "",
      lead.travelClass,
    ]
      .filter(Boolean)
      .join(" • ")
  }

  if (lead.serviceType === "visa") {
    return [
      lead.city,
      lead.nationality,
      lead.destinationCountry || lead.destination,
      lead.visaType,
    ]
      .filter(Boolean)
      .join(" • ")
  }

  if (lead.serviceType === "hotel") {
    return [
      lead.city,
      lead.preferredHotel,
      lead.destination,
      lead.checkInDate ? `Check-in: ${formatShortDate(lead.checkInDate)}` : "",
      lead.checkOutDate
        ? `Check-out: ${formatShortDate(lead.checkOutDate)}`
        : "",
    ]
      .filter(Boolean)
      .join(" • ")
  }

  if (lead.serviceType === "carRental") {
    return [
      lead.rentalType,
      lead.bookingReference ? `Flight: ${lead.bookingReference}` : "",
      lead.destination ? `Airport: ${lead.destination}` : "",
      lead.pickupDate ? `Date: ${formatShortDate(lead.pickupDate)}` : "",
      lead.pickupTime ? `Time: ${lead.pickupTime}` : "",
    ]
      .filter(Boolean)
      .join(" • ")
  }

  return [lead.city, lead.destination].filter(Boolean).join(" • ")
}

const doesLeadMatchCurrentView = ({
  lead,
  routeServiceType,
  serviceFilter,
  status,
  priority,
  followUp,
}) => {
  if (!lead) return false

  if (routeServiceType !== "all" && lead.serviceType !== routeServiceType) {
    return false
  }

  if (
    routeServiceType === "all" &&
    serviceFilter !== "All" &&
    lead.serviceType !== serviceFilter
  ) {
    return false
  }

  if (status !== "All" && lead.status !== status) {
    return false
  }

  if (priority !== "All" && lead.priority !== priority) {
    return false
  }

  if (followUp === "today" && !isFollowUpToday(lead)) {
    return false
  }

  if (followUp === "overdue" && !isFollowUpOverdue(lead)) {
    return false
  }

  if (
    followUp === "upcoming" &&
    (!lead.followUpDate ||
      lead.followUpStatus !== "Scheduled" ||
      isFollowUpToday(lead) ||
      isFollowUpOverdue(lead))
  ) {
    return false
  }

  if (
    followUp === "none" &&
    (lead.followUpDate || lead.followUpStatus !== "Not Set")
  ) {
    return false
  }

  return true
}

const StatCard = ({ label, value, tone = "default" }) => {
  const toneClass = {
    default: "bg-white text-slate-950",
    orange: "bg-orange-50 text-[#FF6B00]",
    blue: "bg-sky-50 text-[#00AEEF]",
    green: "bg-emerald-50 text-emerald-700",
    red: "bg-red-50 text-red-700",
  }

  return (
    <div className="rounded-[5px] border border-slate-100 bg-white px-4 py-3 shadow-sm">
      <p className="font-poppins text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">
        {label}
      </p>

      <p
        className={`mt-1 inline-flex rounded-[5px] px-2 font-fredoka text-[24px] font-semibold ${
          toneClass[tone] || toneClass.default
        }`}
      >
        {value}
      </p>
    </div>
  )
}

const SelectBox = ({ icon, value, onChange, children, label }) => {
  return (
    <label className="flex items-center gap-2 rounded-[5px] border border-slate-200 bg-[#F8FAFC] px-3 py-2">
      <span className="text-xs text-slate-400">{icon}</span>

      <span className="sr-only">{label}</span>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-8 bg-transparent font-poppins text-sm font-semibold text-slate-700 outline-none"
      >
        {children}
      </select>
    </label>
  )
}

const LoadingTableSkeleton = () => {
  return (
    <div className="rounded-[5px] border border-slate-100 bg-white shadow-sm">
      <div className="border-b border-slate-100 p-4">
        <div className="h-5 w-56 animate-pulse rounded bg-slate-100" />
      </div>

      <div className="grid gap-3 p-4">
        {[1, 2, 3, 4, 5].map((item) => (
          <div
            key={item}
            className="h-14 animate-pulse rounded-[5px] bg-[#F8FAFC]"
          />
        ))}
      </div>
    </div>
  )
}

const PaginationBar = ({
  pagination,
  limit,
  disabled,
  onPageChange,
  onLimitChange,
}) => {
  const currentPage = pagination?.page || 1
  const totalPages = pagination?.totalPages || 1
  const total = pagination?.total || 0
  const from = pagination?.from || 0
  const to = pagination?.to || 0

  return (
    <div className="flex flex-col gap-3 border-t border-slate-100 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="font-poppins text-xs font-semibold text-slate-500">
        Showing{" "}
        <span className="font-bold text-slate-900">
          {from}-{to}
        </span>{" "}
        of <span className="font-bold text-slate-900">{total}</span> leads
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <label className="flex items-center gap-2 rounded-[5px] bg-[#F8FAFC] px-3 py-2 font-poppins text-xs font-bold text-slate-500">
          Rows
          <select
            value={limit}
            disabled={disabled}
            onChange={(event) => onLimitChange(Number(event.target.value))}
            className="bg-transparent font-poppins text-xs font-bold text-slate-800 outline-none disabled:opacity-50"
          >
            {pageSizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>

        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={disabled || currentPage <= 1}
          className="inline-flex h-9 items-center justify-center gap-2 rounded-[5px] border border-slate-200 bg-white px-3 font-poppins text-xs font-bold text-slate-700 transition hover:border-[#00AEEF] hover:text-[#00AEEF] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <FaAngleLeft />
          Previous
        </button>

        <span className="rounded-[5px] bg-slate-950 px-3 py-2 font-poppins text-xs font-bold text-white">
          Page {currentPage} of {totalPages}
        </span>

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={disabled || currentPage >= totalPages}
          className="inline-flex h-9 items-center justify-center gap-2 rounded-[5px] border border-slate-200 bg-white px-3 font-poppins text-xs font-bold text-slate-700 transition hover:border-[#00AEEF] hover:text-[#00AEEF] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
          <FaAngleRight />
        </button>
      </div>
    </div>
  )
}

const LeadMobileCard = ({
  lead,
  serviceType,
  actionLoading,
  canUpdateLeads,
  onQuickStatusUpdate,
  onMarkFollowUpCompleted,
}) => {
  const contactedLoading = actionLoading === `${lead._id}-Contacted`
  const interestedLoading = actionLoading === `${lead._id}-Interested`
  const followUpCompletedLoading =
    actionLoading === `${lead._id}-followup-completed`

  return (
    <article className="rounded-[5px] border border-slate-100 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="font-fredoka text-[24px] font-semibold leading-tight text-slate-950">
          {lead.name || "Unnamed Customer"}
        </h2>

        {serviceType === "all" && (
          <Link
            to={getServicePath(lead.serviceType)}
            className={`rounded-[5px] px-2.5 py-1 font-poppins text-[10px] font-bold uppercase ${getServiceBadgeClass(
              lead.serviceType
            )}`}
          >
            {formatService(lead.serviceType)}
          </Link>
        )}

        <span
          className={`rounded-[5px] px-2.5 py-1 font-poppins text-[10px] font-bold uppercase ${getStatusBadgeClass(
            lead.status
          )}`}
        >
          {lead.status || "New"}
        </span>

        {isFollowUpOverdue(lead) && (
          <span className="rounded-[5px] bg-red-50 px-2.5 py-1 font-poppins text-[10px] font-bold uppercase text-red-700">
            Overdue
          </span>
        )}
      </div>

      {getLeadSubtitle(lead) && (
        <p className="mt-1.5 font-poppins text-xs font-semibold leading-5 text-slate-500">
          {getLeadSubtitle(lead)}
        </p>
      )}

      <div className="mt-3">
        <SmartLeadScore lead={lead} compact />
      </div>

      <div className="mt-3 grid gap-2 rounded-[5px] bg-[#F8FAFC] p-3 font-poppins text-xs font-semibold text-slate-600">
        <p className="flex min-w-0 items-center gap-2">
          <FaPhoneAlt className="shrink-0 text-[#00AEEF]" />
          <span className="break-words">{lead.phone || "-"}</span>
        </p>

        <p className="flex min-w-0 items-center gap-2">
          <FaEnvelope className="shrink-0 text-[#00AEEF]" />
          <span className="break-all">{lead.email || "-"}</span>
        </p>

        <p className="flex min-w-0 items-center gap-2">
          <FaClock
            className={`shrink-0 ${
              isFollowUpOverdue(lead) ? "text-red-600" : "text-[#FF6B00]"
            }`}
          />
          <span>{getFollowUpLabel(lead)}</span>
        </p>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <a
          href={getWhatsappUrl(lead.phone)}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-[5px] bg-[#25D366] px-3 py-2 font-poppins text-xs font-semibold text-white transition hover:bg-[#00AEEF]"
        >
          <FaWhatsapp />
          WhatsApp
        </a>

        <a
          href={`tel:${lead.phone || ""}`}
          className="inline-flex items-center justify-center gap-2 rounded-[5px] bg-[#F8FAFC] px-3 py-2 font-poppins text-xs font-semibold text-slate-700 transition hover:bg-slate-950 hover:text-white"
        >
          <FaPhoneAlt />
          Call
        </a>

        <Link
          to={`/admin/leads/${lead._id}`}
          className="inline-flex items-center justify-center gap-2 rounded-[5px] bg-slate-950 px-3 py-2 font-poppins text-xs font-semibold text-white transition hover:bg-[#FF6B00]"
        >
          <FaEye />
          View
        </Link>
      </div>

      {canUpdateLeads && (
        <div className="mt-3 flex flex-wrap gap-2 border-t border-slate-100 pt-3">
          <button
            type="button"
            onClick={() => onQuickStatusUpdate(lead, "Contacted")}
            disabled={
              contactedLoading ||
              lead.status === "Contacted" ||
              lead.status === "Booked"
            }
            className="inline-flex items-center justify-center gap-2 rounded-[5px] bg-sky-50 px-3 py-2 font-poppins text-xs font-bold text-[#00AEEF] transition hover:bg-[#00AEEF] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FaUserCheck />
            {contactedLoading ? "Updating..." : "Contacted"}
          </button>

          <button
            type="button"
            onClick={() => onQuickStatusUpdate(lead, "Interested")}
            disabled={
              interestedLoading ||
              lead.status === "Interested" ||
              lead.status === "Booked"
            }
            className="inline-flex items-center justify-center gap-2 rounded-[5px] bg-emerald-50 px-3 py-2 font-poppins text-xs font-bold text-emerald-700 transition hover:bg-emerald-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FaCheckCircle />
            {interestedLoading ? "Updating..." : "Interested"}
          </button>

          <button
            type="button"
            onClick={() => onMarkFollowUpCompleted(lead)}
            disabled={
              followUpCompletedLoading || lead.followUpStatus !== "Scheduled"
            }
            className="inline-flex items-center justify-center gap-2 rounded-[5px] bg-orange-50 px-3 py-2 font-poppins text-xs font-bold text-[#FF6B00] transition hover:bg-[#FF6B00] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FaClock />
            {followUpCompletedLoading ? "Completing..." : "Complete Follow-up"}
          </button>
        </div>
      )}
    </article>
  )
}

const AdminLeadsPage = ({ serviceType = "all" }) => {
  const { admin } = useAdminAuth()

  const canViewLeads =
    admin?.role === "superAdmin" || Boolean(admin?.permissions?.leads?.view)

  const canUpdateLeads =
    admin?.role === "superAdmin" || Boolean(admin?.permissions?.leads?.update)

  const canExportLeads =
    admin?.role === "superAdmin" || Boolean(admin?.permissions?.leads?.export)

  const [searchParams, setSearchParams] = useSearchParams()
  const searchParamsString = searchParams.toString()

  const [leads, setLeads] = useState([])
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 25,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
    from: 0,
    to: 0,
  })

  const [search, setSearch] = useState(searchParams.get("search") || "")
  const [status, setStatus] = useState(searchParams.get("status") || "All")
  const [priority, setPriority] = useState(searchParams.get("priority") || "All")
  const [followUp, setFollowUp] = useState(searchParams.get("followUp") || "All")
  const [serviceFilter, setServiceFilter] = useState(
    serviceType === "all"
      ? searchParams.get("serviceType") || "All"
      : serviceType
  )
  const [sort, setSort] = useState(searchParams.get("sort") || "-createdAt")
  const [page, setPage] = useState(parsePositiveInt(searchParams.get("page"), 1))
  const [limit, setLimit] = useState(parsePageSize(searchParams.get("limit")))

  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState("")
  const [exportLoading, setExportLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const currentConfig = useMemo(() => {
    return serviceConfig[serviceType] || serviceConfig.all
  }, [serviceType])

  const pageStats = useMemo(() => {
    return {
      pageCount: leads.length,
      overdueOnPage: leads.filter((lead) => isFollowUpOverdue(lead)).length,
      todayOnPage: leads.filter((lead) => isFollowUpToday(lead)).length,
      hotOnPage: leads.filter((lead) => getSmartLeadScore(lead).score >= 80)
        .length,
    }
  }, [leads])

  const updateUrlFilters = (nextFilters = {}) => {
    const nextSearch = nextFilters.search ?? search
    const nextStatus = nextFilters.status ?? status
    const nextPriority = nextFilters.priority ?? priority
    const nextFollowUp = nextFilters.followUp ?? followUp
    const nextServiceFilter = nextFilters.serviceFilter ?? serviceFilter
    const nextSort = nextFilters.sort ?? sort
    const nextPage = nextFilters.page ?? page
    const nextLimit = nextFilters.limit ?? limit

    const params = new URLSearchParams()

    params.set("page", String(nextPage))
    params.set("limit", String(nextLimit))

    if (nextSearch.trim()) params.set("search", nextSearch.trim())
    if (nextStatus !== "All") params.set("status", nextStatus)
    if (nextPriority !== "All") params.set("priority", nextPriority)
    if (nextFollowUp !== "All") params.set("followUp", nextFollowUp)

    if (serviceType === "all" && nextServiceFilter !== "All") {
      params.set("serviceType", nextServiceFilter)
    }

    if (nextSort !== "-createdAt") params.set("sort", nextSort)

    setSearchParams(params)
  }

  const loadLeads = async (override = {}) => {
    if (!canViewLeads) {
      setLoading(false)
      setLeads([])
      return
    }

    setLoading(true)
    setError("")

    try {
      const activePage = override.page ?? page
      const activeLimit = override.limit ?? limit
      const activeSearch = override.search ?? search
      const activeStatus = override.status ?? status
      const activePriority = override.priority ?? priority
      const activeFollowUp = override.followUp ?? followUp
      const activeSort = override.sort ?? sort
      const activeServiceFilter = override.serviceFilter ?? serviceFilter

      const params = {
        page: activePage,
        limit: activeLimit,
        sort: activeSort,
      }

      if (serviceType !== "all") {
        params.serviceType = serviceType
      } else if (activeServiceFilter !== "All") {
        params.serviceType = activeServiceFilter
      }

      if (activeSearch.trim()) params.search = activeSearch.trim()
      if (activeStatus !== "All") params.status = activeStatus
      if (activePriority !== "All") params.priority = activePriority
      if (activeFollowUp !== "All") params.followUp = activeFollowUp

      const data = await adminApi.getLeads(params)
      const nextLeads = data.leads || data.data?.leads || []

      const nextPagination =
        data.pagination ||
        data.data?.pagination || {
          total: data.total || nextLeads.length,
          page: data.page || activePage,
          limit: activeLimit,
          totalPages: data.pages || 1,
          hasNextPage: (data.page || activePage) < (data.pages || 1),
          hasPrevPage: (data.page || activePage) > 1,
          from:
            (data.total || nextLeads.length) === 0
              ? 0
              : ((data.page || activePage) - 1) * activeLimit + 1,
          to:
            (data.total || nextLeads.length) === 0
              ? 0
              : ((data.page || activePage) - 1) * activeLimit +
                nextLeads.length,
        }

      setLeads(nextLeads)
      setPagination(nextPagination)
    } catch (err) {
      setError(err.message || "Failed to load leads.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const urlPage = parsePositiveInt(searchParams.get("page"), 1)
    const urlLimit = parsePageSize(searchParams.get("limit"))
    const urlSearch = searchParams.get("search") || ""
    const urlStatus = searchParams.get("status") || "All"
    const urlPriority = searchParams.get("priority") || "All"
    const urlFollowUp = searchParams.get("followUp") || "All"
    const urlSort = searchParams.get("sort") || "-createdAt"
    const urlServiceFilter =
      serviceType === "all"
        ? searchParams.get("serviceType") || "All"
        : serviceType

    setPage(urlPage)
    setLimit(urlLimit)
    setSearch(urlSearch)
    setStatus(urlStatus)
    setPriority(urlPriority)
    setFollowUp(urlFollowUp)
    setSort(urlSort)
    setServiceFilter(urlServiceFilter)

    loadLeads({
      page: urlPage,
      limit: urlLimit,
      search: urlSearch,
      status: urlStatus,
      priority: urlPriority,
      followUp: urlFollowUp,
      sort: urlSort,
      serviceFilter: urlServiceFilter,
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serviceType, searchParamsString, canViewLeads])

  const handleSearch = (event) => {
    event.preventDefault()
    updateUrlFilters({ search, page: 1 })
  }

  const handleStatusChange = (value) => {
    setStatus(value)
    updateUrlFilters({ status: value, page: 1 })
  }

  const handlePriorityChange = (value) => {
    setPriority(value)
    updateUrlFilters({ priority: value, page: 1 })
  }

  const handleFollowUpChange = (value) => {
    setFollowUp(value)
    updateUrlFilters({ followUp: value, page: 1 })
  }

  const handleServiceChange = (value) => {
    setServiceFilter(value)
    updateUrlFilters({ serviceFilter: value, page: 1 })
  }

  const handleSortChange = (value) => {
    setSort(value)
    updateUrlFilters({ sort: value, page: 1 })
  }

  const handlePageChange = (nextPage) => {
    updateUrlFilters({ page: nextPage })
  }

  const handleLimitChange = (nextLimit) => {
    setLimit(nextLimit)
    updateUrlFilters({ limit: nextLimit, page: 1 })
  }

  const clearFilters = () => {
    setSearch("")
    setStatus("All")
    setPriority("All")
    setFollowUp("All")
    setServiceFilter(serviceType === "all" ? "All" : serviceType)
    setSort("-createdAt")
    setSearchParams({
      page: "1",
      limit: String(limit),
    })
  }

  const updateLeadInCurrentList = (updatedLead) => {
    setLeads((prev) => {
      if (
        !doesLeadMatchCurrentView({
          lead: updatedLead,
          routeServiceType: serviceType,
          serviceFilter,
          status,
          priority,
          followUp,
        })
      ) {
        return prev.filter((lead) => lead._id !== updatedLead._id)
      }

      return prev.map((lead) =>
        lead._id === updatedLead._id ? { ...lead, ...updatedLead } : lead
      )
    })
  }

  const handleQuickStatusUpdate = async (lead, nextStatus) => {
    if (!canUpdateLeads) {
      setError("You do not have permission to update leads.")
      return
    }

    if (!lead?._id || lead.status === nextStatus) return

    const loadingKey = `${lead._id}-${nextStatus}`

    setActionLoading(loadingKey)
    setError("")
    setSuccess("")

    try {
      const data = await adminApi.updateLeadStatus(lead._id, nextStatus)
      const updatedLead = data.lead || { ...lead, status: nextStatus }

      updateLeadInCurrentList(updatedLead)
      setSuccess(`${lead.name || "Lead"} marked as ${nextStatus}.`)
    } catch (err) {
      setError(err.message || `Failed to mark lead as ${nextStatus}.`)
    } finally {
      setActionLoading("")
    }
  }

  const handleMarkFollowUpCompleted = async (lead) => {
    if (!canUpdateLeads) {
      setError("You do not have permission to update follow-ups.")
      return
    }

    if (!lead?._id || lead.followUpStatus === "Completed") return

    const loadingKey = `${lead._id}-followup-completed`

    setActionLoading(loadingKey)
    setError("")
    setSuccess("")

    try {
      const data = await adminApi.updateLeadFollowUp(lead._id, {
        followUpDate: lead.followUpDate || null,
        followUpTime: lead.followUpTime || "",
        followUpNote: lead.followUpNote || "Follow-up completed from lead list.",
        followUpStatus: "Completed",
      })

      const updatedLead = data.lead || {
        ...lead,
        followUpStatus: "Completed",
      }

      updateLeadInCurrentList(updatedLead)
      setSuccess(`Follow-up completed for ${lead.name || "lead"}.`)
    } catch (err) {
      setError(err.message || "Failed to complete follow-up.")
    } finally {
      setActionLoading("")
    }
  }

  const exportAllMatchingLeadsCsv = async () => {
    if (!canExportLeads) {
      setError("You do not have permission to export leads.")
      return
    }

    if (!pagination.total) return

    setExportLoading(true)
    setError("")
    setSuccess("")

    try {
      const params = {
        sort,
      }

      if (serviceType !== "all") {
        params.serviceType = serviceType
      } else if (serviceFilter !== "All") {
        params.serviceType = serviceFilter
      }

      if (search.trim()) params.search = search.trim()
      if (status !== "All") params.status = status
      if (priority !== "All") params.priority = priority
      if (followUp !== "All") params.followUp = followUp

      await adminApi.exportLeadsCsv(params)

      setSuccess("CSV export downloaded for all matching leads.")
    } catch (err) {
      setError(err.message || "Failed to export leads CSV.")
    } finally {
      setExportLoading(false)
    }
  }

  if (!canViewLeads) {
    return (
      <div className="rounded-[5px] border border-red-100 bg-red-50 p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[5px] bg-white text-red-600">
          <FaEye />
        </div>

        <h1 className="mt-5 font-fredoka text-[32px] font-semibold text-slate-950">
          Access Restricted
        </h1>

        <p className="mx-auto mt-2 max-w-xl font-poppins text-sm font-semibold leading-7 text-red-600">
          You do not have permission to view CRM leads. Please contact a Super
          Admin or Admin to update your access.
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-5">
      <section className="rounded-[5px] border border-slate-100 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="font-poppins text-[10px] font-bold uppercase tracking-[0.1em] text-[#00AEEF] sm:text-xs">
              {currentConfig.eyebrow}
            </p>

            <h1 className="mt-1 font-fredoka text-[32px] font-semibold leading-tight text-slate-950 sm:text-[40px]">
              {currentConfig.title}
            </h1>

            <p className="mt-1 max-w-3xl font-poppins text-sm font-medium leading-6 text-slate-500">
              {currentConfig.description}
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            {canExportLeads && (
              <button
                type="button"
                onClick={exportAllMatchingLeadsCsv}
                disabled={exportLoading || !pagination.total}
                className="inline-flex items-center justify-center gap-2 rounded-[5px] border border-slate-200 bg-white px-4 py-2.5 font-poppins text-sm font-semibold text-slate-700 transition hover:border-[#00AEEF] hover:text-[#00AEEF] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <FaDownload />
                {exportLoading ? "Exporting..." : "Export All Matching"}
              </button>
            )}

            <Link
              to="/admin/control-room"
              className="inline-flex items-center justify-center gap-2 rounded-[5px] bg-[#FF6B00] px-4 py-2.5 font-poppins text-sm font-semibold text-white transition hover:bg-[#00AEEF]"
            >
              Control Room
              <FaArrowRight className="text-xs" />
            </Link>
          </div>
        </div>
      </section>

      {!canUpdateLeads && (
        <div className="rounded-[5px] border border-sky-100 bg-sky-50 px-5 py-4 font-poppins text-sm font-semibold text-[#00AEEF]">
          Read-only access active. You can view leads, but update/export actions
          are hidden based on your permissions.
        </div>
      )}

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

      <section className="rounded-[5px] border border-slate-100 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <form onSubmit={handleSearch} className="flex w-full gap-2 xl:max-w-2xl">
            <div className="flex h-11 flex-1 items-center gap-2 rounded-[5px] border border-slate-200 bg-[#F8FAFC] px-3">
              <FaSearch className="text-xs text-slate-400" />

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search name, phone, email, city, destination..."
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

          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
            {serviceType === "all" && (
              <SelectBox
                label="Service filter"
                icon={<FaTable />}
                value={serviceFilter}
                onChange={handleServiceChange}
              >
                {serviceFilters.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </SelectBox>
            )}

            <SelectBox
              label="Status filter"
              icon={<FaFilter />}
              value={status}
              onChange={handleStatusChange}
            >
              {statuses.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </SelectBox>

            <SelectBox
              label="Priority filter"
              icon={<FaUserClock />}
              value={priority}
              onChange={handlePriorityChange}
            >
              {priorities.map((item) => (
                <option key={item} value={item}>
                  {item === "All" ? "All Priority" : getPriorityLabel(item)}
                </option>
              ))}
            </SelectBox>

            <SelectBox
              label="Follow-up filter"
              icon={<FaClock />}
              value={followUp}
              onChange={handleFollowUpChange}
            >
              {followUpFilters.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </SelectBox>

            <SelectBox
              label="Sort"
              icon={<FaSortAmountDown />}
              value={sort}
              onChange={handleSortChange}
            >
              {sortOptions.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </SelectBox>

            {(search ||
              status !== "All" ||
              priority !== "All" ||
              followUp !== "All" ||
              sort !== "-createdAt" ||
              (serviceType === "all" && serviceFilter !== "All")) && (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center justify-center gap-2 rounded-[5px] border border-slate-200 bg-white px-4 py-2.5 font-poppins text-sm font-semibold text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
              >
                <FaTimes className="text-xs" />
                Clear
              </button>
            )}
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Matching Leads"
            value={pagination.total || 0}
            tone="blue"
          />
          <StatCard label="This Page" value={pageStats.pageCount} />
          <StatCard
            label="Overdue On Page"
            value={pageStats.overdueOnPage}
            tone="red"
          />
          <StatCard label="Hot On Page" value={pageStats.hotOnPage} tone="orange" />
        </div>

        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-poppins text-xs font-semibold text-slate-500">
            Server-side pagination active. Page{" "}
            <span className="font-bold text-slate-900">
              {pagination.page || page}
            </span>{" "}
            of{" "}
            <span className="font-bold text-slate-900">
              {pagination.totalPages || 1}
            </span>
            .
          </p>

          <p className="font-poppins text-xs font-semibold text-slate-400">
            {canExportLeads
              ? "Export downloads all matching leads from backend."
              : "Export disabled for your current role."}
          </p>
        </div>
      </section>

      {loading ? (
        <LoadingTableSkeleton />
      ) : leads.length === 0 ? (
        <div className="rounded-[5px] border border-slate-100 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[5px] bg-[#00AEEF]/10 text-[#00AEEF]">
            <FaSearch />
          </div>

          <h2 className="mt-5 font-fredoka text-[30px] font-semibold text-slate-950">
            No leads found
          </h2>

          <p className="mx-auto mt-2 max-w-xl font-poppins text-sm font-medium leading-7 text-slate-500">
            No inquiry matches this service, status, priority, search, or
            follow-up filter. Try clearing filters or checking another service
            category.
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
        <section className="overflow-hidden rounded-[5px] border border-slate-100 bg-white shadow-sm">
          <div className="hidden lg:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1180px] border-collapse">
                <thead className="sticky top-0 z-10 bg-[#F8FAFC]">
                  <tr className="border-b border-slate-100">
                    <th className="px-4 py-3 text-left font-poppins text-[10px] font-bold uppercase tracking-[0.08em] text-slate-400">
                      Customer
                    </th>

                    <th className="px-4 py-3 text-left font-poppins text-[10px] font-bold uppercase tracking-[0.08em] text-slate-400">
                      Contact
                    </th>

                    <th className="px-4 py-3 text-left font-poppins text-[10px] font-bold uppercase tracking-[0.08em] text-slate-400">
                      Service
                    </th>

                    <th className="px-4 py-3 text-left font-poppins text-[10px] font-bold uppercase tracking-[0.08em] text-slate-400">
                      Status
                    </th>

                    <th className="px-4 py-3 text-left font-poppins text-[10px] font-bold uppercase tracking-[0.08em] text-slate-400">
                      Score
                    </th>

                    <th className="px-4 py-3 text-left font-poppins text-[10px] font-bold uppercase tracking-[0.08em] text-slate-400">
                      Follow-up
                    </th>

                    <th className="px-4 py-3 text-left font-poppins text-[10px] font-bold uppercase tracking-[0.08em] text-slate-400">
                      Created
                    </th>

                    <th className="px-4 py-3 text-right font-poppins text-[10px] font-bold uppercase tracking-[0.08em] text-slate-400">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {leads.map((lead) => {
                    const smart = getSmartLeadScore(lead)
                    const contactedLoading =
                      actionLoading === `${lead._id}-Contacted`
                    const interestedLoading =
                      actionLoading === `${lead._id}-Interested`
                    const followUpCompletedLoading =
                      actionLoading === `${lead._id}-followup-completed`

                    return (
                      <tr
                        key={lead._id}
                        className="border-b border-slate-100 transition hover:bg-[#F8FAFC]"
                      >
                        <td className="px-4 py-4 align-top">
                          <div className="max-w-[260px]">
                            <Link
                              to={`/admin/leads/${lead._id}`}
                              className="font-poppins text-sm font-bold text-slate-950 transition hover:text-[#FF6B00]"
                            >
                              {lead.name || "Unnamed Customer"}
                            </Link>

                            <p className="mt-1 line-clamp-2 font-poppins text-xs font-semibold leading-5 text-slate-500">
                              {getLeadSubtitle(lead) || "No service detail"}
                            </p>
                          </div>
                        </td>

                        <td className="px-4 py-4 align-top">
                          <div className="grid gap-1 font-poppins text-xs font-semibold text-slate-600">
                            <p className="flex min-w-0 items-center gap-1.5">
                              <FaPhoneAlt className="text-[#00AEEF]" />
                              <span>{lead.phone || "-"}</span>
                            </p>

                            <p className="flex min-w-0 items-center gap-1.5">
                              <FaEnvelope className="text-[#00AEEF]" />
                              <span className="max-w-[190px] truncate">
                                {lead.email || "-"}
                              </span>
                            </p>
                          </div>
                        </td>

                        <td className="px-4 py-4 align-top">
                          <div className="grid gap-2">
                            <Link
                              to={getServicePath(lead.serviceType)}
                              className={`w-fit rounded-[5px] px-2.5 py-1 font-poppins text-[10px] font-bold uppercase ${getServiceBadgeClass(
                                lead.serviceType
                              )}`}
                            >
                              {formatService(lead.serviceType)}
                            </Link>

                            <span
                              className={`w-fit rounded-[5px] px-2.5 py-1 font-poppins text-[10px] font-bold uppercase ${getPriorityBadgeClass(
                                lead.priority
                              )}`}
                            >
                              {getPriorityLabel(lead.priority || "medium")}
                            </span>
                          </div>
                        </td>

                        <td className="px-4 py-4 align-top">
                          <div className="grid gap-2">
                            <span
                              className={`w-fit rounded-[5px] px-2.5 py-1 font-poppins text-[10px] font-bold uppercase ${getStatusBadgeClass(
                                lead.status
                              )}`}
                            >
                              {lead.status || "New"}
                            </span>

                            <span
                              className={`w-fit rounded-[5px] px-2.5 py-1 font-poppins text-[10px] font-bold uppercase ${getFollowUpBadgeClass(
                                lead.followUpStatus || "Not Set"
                              )}`}
                            >
                              {lead.followUpStatus || "Not Set"}
                            </span>
                          </div>
                        </td>

                        <td className="px-4 py-4 align-top">
                          <div className="w-[92px]">
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-fredoka text-[24px] font-semibold leading-none text-slate-950">
                                {smart.score}
                              </span>

                              <span
                                className={`rounded-[5px] px-2 py-1 font-poppins text-[9px] font-bold uppercase ${smart.temperature.className}`}
                              >
                                {smart.temperature.label}
                              </span>
                            </div>

                            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-[#00AEEF] to-[#FF6B00]"
                                style={{ width: `${smart.score}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-4 align-top">
                          <div className="max-w-[210px]">
                            <p
                              className={`font-poppins text-xs font-bold ${
                                isFollowUpOverdue(lead)
                                  ? "text-red-600"
                                  : isFollowUpToday(lead)
                                    ? "text-[#00AEEF]"
                                    : "text-slate-700"
                              }`}
                            >
                              {getFollowUpLabel(lead)}
                            </p>

                            {lead.followUpNote && (
                              <p className="mt-1 line-clamp-2 font-poppins text-[11px] font-medium leading-4 text-slate-400">
                                {lead.followUpNote}
                              </p>
                            )}
                          </div>
                        </td>

                        <td className="px-4 py-4 align-top">
                          <p className="font-poppins text-xs font-semibold text-slate-600">
                            {formatDate(lead.createdAt)}
                          </p>
                        </td>

                        <td className="px-4 py-4 align-top">
                          <div className="flex justify-end gap-1.5">
                            <a
                              href={getWhatsappUrl(lead.phone)}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex h-9 w-9 items-center justify-center rounded-[5px] bg-[#25D366] text-white transition hover:bg-[#00AEEF]"
                              title="WhatsApp"
                            >
                              <FaWhatsapp />
                            </a>

                            <a
                              href={`tel:${lead.phone || ""}`}
                              className="inline-flex h-9 w-9 items-center justify-center rounded-[5px] bg-[#F8FAFC] text-slate-700 transition hover:bg-slate-950 hover:text-white"
                              title="Call"
                            >
                              <FaPhoneAlt />
                            </a>

                            <Link
                              to={`/admin/leads/${lead._id}`}
                              className="inline-flex h-9 w-9 items-center justify-center rounded-[5px] bg-slate-950 text-white transition hover:bg-[#FF6B00]"
                              title="View Details"
                            >
                              <FaEye />
                            </Link>
                          </div>

                          {canUpdateLeads && (
                            <div className="mt-2 flex justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() =>
                                  handleQuickStatusUpdate(lead, "Contacted")
                                }
                                disabled={
                                  contactedLoading ||
                                  lead.status === "Contacted" ||
                          
                                  lead.status === "Booked"
                                }
                                className="inline-flex items-center justify-center gap-1 rounded-[5px] bg-sky-50 px-2.5 py-1.5 font-poppins text-[10px] font-bold text-[#00AEEF] transition hover:bg-[#00AEEF] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                <FaUserCheck />
                                {contactedLoading ? "..." : "Contacted"}
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  handleQuickStatusUpdate(lead, "Interested")
                                }
                                disabled={
                                  interestedLoading ||
                                  lead.status === "Interested" ||
                            
                                  lead.status === "Booked"
                                }
                                className="inline-flex items-center justify-center gap-1 rounded-[5px] bg-emerald-50 px-2.5 py-1.5 font-poppins text-[10px] font-bold text-emerald-700 transition hover:bg-emerald-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                <FaCheckCircle />
                                {interestedLoading ? "..." : "Interested"}
                              </button>

                              <button
                                type="button"
                                onClick={() => handleMarkFollowUpCompleted(lead)}
                                disabled={
                                  followUpCompletedLoading ||
                                  lead.followUpStatus !== "Scheduled"
                                }
                                className="inline-flex items-center justify-center gap-1 rounded-[5px] bg-orange-50 px-2.5 py-1.5 font-poppins text-[10px] font-bold text-[#FF6B00] transition hover:bg-[#FF6B00] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                <FaClock />
                                {followUpCompletedLoading ? "..." : "Done"}
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <PaginationBar
              pagination={pagination}
              limit={limit}
              disabled={loading}
              onPageChange={handlePageChange}
              onLimitChange={handleLimitChange}
            />
          </div>

          <div className="grid gap-3 p-4 lg:hidden">
            {leads.map((lead) => (
              <LeadMobileCard
                key={lead._id}
                lead={lead}
                serviceType={serviceType}
                actionLoading={actionLoading}
                canUpdateLeads={canUpdateLeads}
                onQuickStatusUpdate={handleQuickStatusUpdate}
                onMarkFollowUpCompleted={handleMarkFollowUpCompleted}
              />
            ))}

            <PaginationBar
              pagination={pagination}
              limit={limit}
              disabled={loading}
              onPageChange={handlePageChange}
              onLimitChange={handleLimitChange}
            />
          </div>
        </section>
      )}
    </div>
  )
}

export default AdminLeadsPage