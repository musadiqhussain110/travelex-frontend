import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import {
  FaArrowRight,
  FaBolt,
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
  FaCrown,
  FaExclamationTriangle,
  FaEye,
  FaFilter,
  FaFire,
  FaGripVertical,
  FaPhoneAlt,
  FaPlaneDeparture,
  FaSearch,
  FaSyncAlt,
  FaTimes,
  FaUserClock,
  FaWhatsapp,
} from "react-icons/fa"
import { adminApi } from "../../services/api"

const pipelineStatuses = [
  "New",
  "Contacted",
  "Interested",
  "Awaiting Documents",
  "Payment Pending",
  "Booked",
  "Lost",
  "Cancelled",
]

const mainPipelineStatuses = [
  "New",
  "Contacted",
  "Interested",
  "Awaiting Documents",
  "Payment Pending",
  "Booked",
]

const serviceOptions = [
  { value: "all", label: "All Services" },
  { value: "umrah", label: "Umrah" },
  { value: "tour", label: "Tours" },
  { value: "visa", label: "Visa" },
  { value: "ticket", label: "Air Tickets" },
  { value: "hotel", label: "Hotels" },
  { value: "carRental", label: "Airport Transfers" },
]

const priorityOptions = [
  { value: "all", label: "All Priority" },
  { value: "urgent", label: "Urgent" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
]

const serviceLabels = {
  umrah: "Umrah",
  tour: "Tour",
  visa: "Visa",
  ticket: "Air Ticket",
  hotel: "Hotel",
  carRental: "Airport Transfer",
  contact: "Contact",
  general: "General",
}

const statusStyles = {
  New: "bg-[#FF6B00]",
  Contacted: "bg-[#00AEEF]",
  Interested: "bg-emerald-500",
  "Awaiting Documents": "bg-amber-500",
  "Payment Pending": "bg-yellow-500",
  Booked: "bg-teal-500",
  Lost: "bg-red-500",
  Cancelled: "bg-slate-500",
}

const formatService = (serviceType = "") => {
  return serviceLabels[serviceType] || serviceType || "-"
}

const formatShortDate = (date) => {
  if (!date) return "-"
  return new Date(date).toLocaleDateString()
}

const formatDateTime = (date) => {
  if (!date) return "-"
  return new Date(date).toLocaleString()
}

const getWhatsappUrl = (phone = "") => {
  const cleanPhone = String(phone).replace(/[^\d]/g, "")
  return cleanPhone ? `https://wa.me/${cleanPhone}` : "https://wa.me/"
}

const getPriorityClass = (priority = "") => {
  const classes = {
    urgent: "bg-red-50 text-red-700",
    high: "bg-orange-50 text-[#FF6B00]",
    medium: "bg-sky-50 text-[#00AEEF]",
    low: "bg-slate-100 text-slate-600",
  }

  return classes[priority] || "bg-slate-100 text-slate-600"
}

const getServiceClass = (serviceType = "") => {
  const classes = {
    umrah: "bg-orange-50 text-[#FF6B00]",
    tour: "bg-sky-50 text-[#00AEEF]",
    visa: "bg-purple-50 text-purple-700",
    ticket: "bg-emerald-50 text-emerald-700",
    hotel: "bg-amber-50 text-amber-700",
    carRental: "bg-indigo-50 text-indigo-700",
  }

  return classes[serviceType] || "bg-slate-100 text-slate-700"
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

const getTravelUrgency = (lead) => {
  const date =
    lead.travelDate ||
    lead.departureDate ||
    lead.pickupDate ||
    lead.checkInDate ||
    lead.intendedTravelDate

  if (!date) return null

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const travelDate = new Date(date)
  travelDate.setHours(0, 0, 0, 0)

  const diffDays = Math.ceil((travelDate - today) / (1000 * 60 * 60 * 24))

  if (diffDays < 0) return "Past Date"
  if (diffDays <= 3) return "Very Urgent"
  if (diffDays <= 10) return "Soon"
  return "Planned"
}

const getLeadScore = (lead) => {
  let score = 35

  if (lead.priority === "urgent") score += 30
  if (lead.priority === "high") score += 20
  if (lead.priority === "medium") score += 10

  if (
  ["Interested", "Awaiting Documents", "Payment Pending"].includes(
    lead.status
  )
) {
    score += 25
  }

if (lead.status === "Booked") {
    score += 35
  }

  if (isFollowUpOverdue(lead)) score += 20
  if (isFollowUpToday(lead)) score += 15

  if (lead.phone) score += 8
  if (lead.email) score += 5
  if (lead.additionalRequirements || lead.message) score += 7

  const urgency = getTravelUrgency(lead)
  if (urgency === "Very Urgent") score += 18
  if (urgency === "Soon") score += 10

  return Math.min(100, score)
}

const getLeadTemperature = (lead) => {
  const score = getLeadScore(lead)

  if (score >= 80) {
    return {
      label: "Hot Lead",
      icon: <FaFire />,
      className: "bg-red-50 text-red-700",
    }
  }

  if (score >= 60) {
    return {
      label: "Warm Lead",
      icon: <FaBolt />,
      className: "bg-orange-50 text-[#FF6B00]",
    }
  }

  return {
    label: "Cold Lead",
    icon: <FaClock />,
    className: "bg-slate-100 text-slate-600",
  }
}

const getLeadSubtitle = (lead) => {
  if (!lead) return ""

  if (lead.serviceType === "umrah") {
    return [
      lead.city,
      lead.preferredDepartureCity || lead.departureCity,
      lead.packageRequired,
      lead.durationOfStay,
    ]
      .filter(Boolean)
      .join(" • ")
  }

  if (lead.serviceType === "tour") {
    return [lead.city, lead.destination, lead.interestedIn]
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

  if (lead.serviceType === "ticket") {
    return [
      [lead.departureCity, lead.destinationCity || lead.destination]
        .filter(Boolean)
        .join(" → "),
      lead.travelClass,
      lead.preferredAirline,
    ]
      .filter(Boolean)
      .join(" • ")
  }

  if (lead.serviceType === "hotel") {
    return [
      lead.city,
      lead.destination,
      lead.preferredHotel,
      lead.hotelCategory,
    ]
      .filter(Boolean)
      .join(" • ")
  }

  if (lead.serviceType === "carRental") {
    return [
      lead.rentalType,
      lead.destination,
      lead.bookingReference,
      lead.pickupTime,
    ]
      .filter(Boolean)
      .join(" • ")
  }

  return [lead.city, lead.destination].filter(Boolean).join(" • ")
}

const getNextStatus = (status) => {
  const index = mainPipelineStatuses.indexOf(status)
  if (index === -1 || index === mainPipelineStatuses.length - 1) return null
  return mainPipelineStatuses[index + 1]
}

const PipelineMetric = ({ icon, label, value, tone = "blue" }) => {
  const tones = {
    blue: "bg-[#00AEEF]/10 text-[#00AEEF]",
    orange: "bg-[#FF6B00]/10 text-[#FF6B00]",
    red: "bg-red-50 text-red-700",
    green: "bg-emerald-50 text-emerald-700",
    purple: "bg-purple-50 text-purple-700",
  }

  return (
    <div className="rounded-[5px] border border-slate-100 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <span
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[5px] ${
            tones[tone] || tones.blue
          }`}
        >
          {icon}
        </span>

        <div>
          <p className="font-poppins text-[10px] font-bold uppercase tracking-[0.08em] text-slate-400">
            {label}
          </p>

          <p className="font-fredoka text-[28px] font-semibold leading-none text-slate-950">
            {value}
          </p>
        </div>
      </div>
    </div>
  )
}

const KanbanCard = ({ lead, onDragStart, onMoveStatus, actionLoading }) => {
  const score = getLeadScore(lead)
  const temperature = getLeadTemperature(lead)
  const nextStatus = getNextStatus(lead.status)
  const urgency = getTravelUrgency(lead)
  const overdue = isFollowUpOverdue(lead)
  const today = isFollowUpToday(lead)

  return (
    <article
      draggable
      onDragStart={(event) => onDragStart(event, lead)}
      className="group rounded-[5px] border border-slate-100 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:border-[#00AEEF]/30 hover:shadow-[0_18px_45px_rgba(15,23,42,0.10)]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 rounded-[5px] px-2.5 py-1 font-poppins text-[10px] font-bold uppercase ${temperature.className}`}
            >
              {temperature.icon}
              {temperature.label}
            </span>

            {overdue && (
              <span className="inline-flex items-center gap-1 rounded-[5px] bg-red-50 px-2.5 py-1 font-poppins text-[10px] font-bold uppercase text-red-700">
                <FaExclamationTriangle />
                Overdue
              </span>
            )}

            {today && (
              <span className="inline-flex items-center gap-1 rounded-[5px] bg-sky-50 px-2.5 py-1 font-poppins text-[10px] font-bold uppercase text-[#00AEEF]">
                <FaCalendarAlt />
                Today
              </span>
            )}
          </div>

          <h3 className="mt-3 break-words font-fredoka text-[24px] font-semibold leading-tight text-slate-950">
            {lead.name || "Unnamed Customer"}
          </h3>

          <p className="mt-1 line-clamp-2 font-poppins text-xs font-semibold leading-5 text-slate-500">
            {getLeadSubtitle(lead) || "No extra details available"}
          </p>
        </div>

        <span className="mt-1 shrink-0 text-slate-300 transition group-hover:text-[#00AEEF]">
          <FaGripVertical />
        </span>
      </div>

      <div className="mt-4 grid grid-cols-[1fr_auto] items-center gap-3">
        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#00AEEF] to-[#FF6B00]"
            style={{ width: `${score}%` }}
          />
        </div>

        <span className="font-poppins text-[11px] font-bold text-slate-500">
          {score}%
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <span
          className={`rounded-[5px] px-2.5 py-1 font-poppins text-[10px] font-bold uppercase ${getServiceClass(
            lead.serviceType
          )}`}
        >
          {formatService(lead.serviceType)}
        </span>

        <span
          className={`rounded-[5px] px-2.5 py-1 font-poppins text-[10px] font-bold uppercase ${getPriorityClass(
            lead.priority
          )}`}
        >
          {lead.priority || "medium"}
        </span>

        {urgency && (
          <span className="rounded-[5px] bg-slate-100 px-2.5 py-1 font-poppins text-[10px] font-bold uppercase text-slate-600">
            {urgency}
          </span>
        )}
      </div>

      <div className="mt-4 grid gap-2 rounded-[5px] bg-[#F8FAFC] p-3">
        <p className="flex items-center gap-2 font-poppins text-xs font-semibold text-slate-600">
          <FaPhoneAlt className="shrink-0 text-[#FF6B00]" />
          <span className="break-words">{lead.phone || "-"}</span>
        </p>

        <p className="flex items-center gap-2 font-poppins text-xs font-semibold text-slate-600">
          <FaCalendarAlt className="shrink-0 text-[#00AEEF]" />
          <span>{formatDateTime(lead.createdAt)}</span>
        </p>

        <p className="flex items-center gap-2 font-poppins text-xs font-semibold text-slate-600">
          <FaUserClock
            className={`shrink-0 ${overdue ? "text-red-600" : "text-[#FF6B00]"}`}
          />
          <span>
            {lead.followUpDate
              ? `${formatShortDate(lead.followUpDate)}${
                  lead.followUpTime ? ` • ${lead.followUpTime}` : ""
                }`
              : "No follow-up set"}
          </span>
        </p>
      </div>

      {lead.followUpNote && (
        <div className="mt-3 rounded-[5px] border border-orange-100 bg-orange-50 p-3">
          <p className="line-clamp-3 font-poppins text-xs font-semibold leading-5 text-orange-800">
            {lead.followUpNote}
          </p>
        </div>
      )}

      <div className="mt-4 grid gap-2">
        {nextStatus && (
          <button
            type="button"
            onClick={() => onMoveStatus(lead, nextStatus)}
            disabled={actionLoading === `${lead._id}-${nextStatus}`}
            className="inline-flex items-center justify-center gap-2 rounded-[5px] bg-slate-950 px-3 py-2.5 font-poppins text-xs font-semibold text-white transition hover:bg-[#FF6B00] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FaArrowRight />
            {actionLoading === `${lead._id}-${nextStatus}`
              ? "Moving..."
              : `Move to ${nextStatus}`}
          </button>
        )}

        <div className="grid grid-cols-3 gap-2">
          <a
            href={getWhatsappUrl(lead.phone)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-[5px] bg-[#25D366] px-3 py-2.5 text-white transition hover:bg-[#00AEEF]"
            title="Open WhatsApp"
          >
            <FaWhatsapp />
          </a>

          <a
            href={`tel:${lead.phone || ""}`}
            className="inline-flex items-center justify-center rounded-[5px] bg-[#F8FAFC] px-3 py-2.5 text-slate-700 transition hover:bg-slate-950 hover:text-white"
            title="Call"
          >
            <FaPhoneAlt />
          </a>

          <Link
            to={`/admin/leads/${lead._id}`}
            className="inline-flex items-center justify-center rounded-[5px] bg-[#F8FAFC] px-3 py-2.5 text-slate-700 transition hover:bg-[#FF6B00] hover:text-white"
            title="View Details"
          >
            <FaEye />
          </Link>
        </div>
      </div>
    </article>
  )
}

const AdminLeadKanbanPage = () => {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState("")
  const [draggedLead, setDraggedLead] = useState(null)
  const [dragOverStatus, setDragOverStatus] = useState("")
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  const [filters, setFilters] = useState({
    search: "",
    serviceType: "all",
    priority: "all",
    focus: "all",
  })

  const loadLeads = async () => {
    setLoading(true)
    setError("")

    try {
      const params = new URLSearchParams()
      params.set("limit", "100")
      params.set("sort", "-createdAt")

      const data = await adminApi.getLeads(`?${params.toString()}`)
      setLeads(data.leads || data.data?.leads || [])
    } catch (err) {
      setError(err.message || "Failed to load kanban leads.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadLeads()
  }, [])

  const handleColumnWheel = (event) => {
    const element = event.currentTarget
    const canScroll = element.scrollHeight > element.clientHeight

    if (!canScroll) return

    const deltaY = event.deltaY
    const scrollingDown = deltaY > 0
    const scrollingUp = deltaY < 0
    const atTop = element.scrollTop <= 0
    const atBottom =
      Math.ceil(element.scrollTop + element.clientHeight) >= element.scrollHeight

    const shouldScrollColumn =
      (scrollingDown && !atBottom) || (scrollingUp && !atTop)

    if (!shouldScrollColumn) return

    event.preventDefault()
    event.stopPropagation()

    element.scrollTop += deltaY
  }

  const filteredLeads = useMemo(() => {
    const searchTerm = filters.search.trim().toLowerCase()

    return leads.filter((lead) => {
      const matchesSearch =
        !searchTerm ||
        [
          lead.name,
          lead.phone,
          lead.email,
          lead.city,
          lead.destination,
          lead.destinationCountry,
          lead.bookingReference,
          lead.additionalRequirements,
          lead.message,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(searchTerm)

      const matchesService =
        filters.serviceType === "all" || lead.serviceType === filters.serviceType

      const matchesPriority =
        filters.priority === "all" || lead.priority === filters.priority

      const score = getLeadScore(lead)

      const matchesFocus =
        filters.focus === "all" ||
        (filters.focus === "hot" && score >= 80) ||
        (filters.focus === "overdue" && isFollowUpOverdue(lead)) ||
        (filters.focus === "today" && isFollowUpToday(lead)) ||
        (filters.focus === "won" &&
          ["Booked"].includes(lead.status))

      return matchesSearch && matchesService && matchesPriority && matchesFocus
    })
  }, [leads, filters])

  const groupedLeads = useMemo(() => {
    return pipelineStatuses.reduce((acc, status) => {
      acc[status] = filteredLeads.filter(
        (lead) => (lead.status || "New") === status
      )
      return acc
    }, {})
  }, [filteredLeads])

  const metrics = useMemo(() => {
    return {
      total: filteredLeads.length,
      hot: filteredLeads.filter((lead) => getLeadScore(lead) >= 80).length,
      overdue: filteredLeads.filter((lead) => isFollowUpOverdue(lead)).length,
      today: filteredLeads.filter((lead) => isFollowUpToday(lead)).length,
      won: filteredLeads.filter((lead) =>
        ["Booked"].includes(lead.status)
      ).length,
    }
  }, [filteredLeads])

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const clearFilters = () => {
    setFilters({
      search: "",
      serviceType: "all",
      priority: "all",
      focus: "all",
    })
  }

  const updateLeadStatus = async (lead, nextStatus) => {
    if (!lead?._id || lead.status === nextStatus) return

    const loadingKey = `${lead._id}-${nextStatus}`

    setActionLoading(loadingKey)
    setError("")
    setSuccess("")

    const previousLeads = leads

    setLeads((prev) =>
      prev.map((item) =>
        item._id === lead._id ? { ...item, status: nextStatus } : item
      )
    )

    try {
      await adminApi.updateLeadStatus(lead._id, nextStatus)
      setSuccess(`${lead.name || "Lead"} moved to ${nextStatus}.`)
    } catch (err) {
      setLeads(previousLeads)
      setError(err.message || "Failed to update lead status.")
    } finally {
      setActionLoading("")
      setDraggedLead(null)
      setDragOverStatus("")
    }
  }

  const handleDragStart = (event, lead) => {
    setDraggedLead(lead)
    event.dataTransfer.effectAllowed = "move"
    event.dataTransfer.setData("text/plain", lead._id)
  }

  const handleDrop = async (event, nextStatus) => {
    event.preventDefault()

    if (!draggedLead || draggedLead.status === nextStatus) {
      setDragOverStatus("")
      return
    }

    await updateLeadStatus(draggedLead, nextStatus)
  }

  const handleDragOver = (event, status) => {
    event.preventDefault()
    setDragOverStatus(status)
  }

  const visibleStatuses = pipelineStatuses.filter((status) => {
    if (["Lost", "Cancelled"].includes(status)) {
      return groupedLeads[status]?.length > 0
    }

    return true
  })

  return (
    <div className="grid w-full max-w-full gap-5 overflow-x-hidden">
      <style>
        {`
          .kanban-column-scroll {
            overflow-y: auto;
            overflow-x: hidden;
            overscroll-behavior: contain;
            scrollbar-width: thin;
            scrollbar-color: #00AEEF #E2E8F0;
            touch-action: pan-y;
          }

          .kanban-column-scroll::-webkit-scrollbar {
            width: 7px;
          }

          .kanban-column-scroll::-webkit-scrollbar-track {
            background: #E2E8F0;
            border-radius: 999px;
          }

          .kanban-column-scroll::-webkit-scrollbar-thumb {
            background: linear-gradient(180deg, #00AEEF, #FF6B00);
            border-radius: 999px;
          }

          .kanban-column-scroll::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(180deg, #FF6B00, #00AEEF);
          }
        `}
      </style>

      <section className="overflow-hidden rounded-[5px] bg-slate-950 shadow-[0_24px_70px_rgba(15,23,42,0.18)]">
        <div className="relative p-5 sm:p-7 lg:p-8">
          <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#00AEEF]/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 left-10 h-72 w-72 rounded-full bg-[#FF6B00]/20 blur-3xl" />

          <div className="relative z-10 flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-3xl">

              <h1 className="mt-4 font-fredoka text-[34px] font-semibold leading-tight text-white sm:text-[48px]">
                Lead Pipeline Kanban
              </h1>

              <p className="mt-2 max-w-2xl font-poppins text-sm font-medium leading-7 text-white/70 sm:text-base">
                Track every TravelEx lead through a clean sales pipeline, move
                customers between stages, and manage follow-ups from one
                professional CRM board.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:min-w-[460px]">
              <Link
                to="/admin/leads"
                className="inline-flex items-center justify-center gap-2 rounded-[5px] bg-white/10 px-4 py-3 font-poppins text-sm font-semibold text-white backdrop-blur transition hover:bg-[#00AEEF]"
              >
                List View
                <FaArrowRight className="text-xs" />
              </Link>

              <button
                type="button"
                onClick={loadLeads}
                className="inline-flex items-center justify-center gap-2 rounded-[5px] bg-[#FF6B00] px-4 py-3 font-poppins text-sm font-semibold text-white transition hover:bg-[#00AEEF]"
              >
                <FaSyncAlt />
                Refresh Board
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

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <PipelineMetric
          icon={<FaPlaneDeparture />}
          label="Visible Leads"
          value={metrics.total}
          tone="blue"
        />

        <PipelineMetric
          icon={<FaFire />}
          label="Hot Leads"
          value={metrics.hot}
          tone="orange"
        />

        <PipelineMetric
          icon={<FaExclamationTriangle />}
          label="Overdue"
          value={metrics.overdue}
          tone="red"
        />

        <PipelineMetric
          icon={<FaCalendarAlt />}
          label="Today"
          value={metrics.today}
          tone="purple"
        />

        <PipelineMetric
          icon={<FaCheckCircle />}
          label="Won"
          value={metrics.won}
          tone="green"
        />
      </section>

      <section className="rounded-[5px] border border-slate-100 bg-white p-5 shadow-sm">
        <div className="grid gap-3 xl:grid-cols-[1fr_180px_180px_180px_auto] xl:items-center">
          <div className="relative">
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400" />

            <input
              value={filters.search}
              onChange={(event) =>
                handleFilterChange("search", event.target.value)
              }
              placeholder="Search by name, phone, email, city, destination..."
              className="h-11 w-full rounded-[5px] border border-slate-200 bg-[#F8FAFC] pl-10 pr-3 font-poppins text-sm font-semibold text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#00AEEF] focus:bg-white"
            />
          </div>

          <select
            value={filters.serviceType}
            onChange={(event) =>
              handleFilterChange("serviceType", event.target.value)
            }
            className="h-11 rounded-[5px] border border-slate-200 bg-[#F8FAFC] px-3 font-poppins text-sm font-semibold text-slate-700 outline-none focus:border-[#00AEEF]"
          >
            {serviceOptions.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>

          <select
            value={filters.priority}
            onChange={(event) =>
              handleFilterChange("priority", event.target.value)
            }
            className="h-11 rounded-[5px] border border-slate-200 bg-[#F8FAFC] px-3 font-poppins text-sm font-semibold text-slate-700 outline-none focus:border-[#00AEEF]"
          >
            {priorityOptions.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>

          <select
            value={filters.focus}
            onChange={(event) => handleFilterChange("focus", event.target.value)}
            className="h-11 rounded-[5px] border border-slate-200 bg-[#F8FAFC] px-3 font-poppins text-sm font-semibold text-slate-700 outline-none focus:border-[#00AEEF]"
          >
            <option value="all">All Leads</option>
            <option value="hot">Hot Leads</option>
            <option value="overdue">Overdue Follow-ups</option>
            <option value="today">Today Follow-ups</option>
            <option value="won">Won Leads</option>
          </select>

          {(filters.search ||
            filters.serviceType !== "all" ||
            filters.priority !== "all" ||
            filters.focus !== "all") && (
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

        <p className="mt-4 flex items-center gap-2 font-poppins text-xs font-semibold text-slate-500">
          <FaFilter className="text-[#00AEEF]" />
          Drag cards between columns to update lead status instantly.
        </p>
      </section>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-[560px] animate-pulse rounded-[5px] bg-white shadow-sm"
            />
          ))}
        </div>
      ) : (
        <section className="w-full max-w-full overflow-hidden">
          <div className="grid w-full max-w-full gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {visibleStatuses.map((status) => {
              const columnLeads = groupedLeads[status] || []
              const accentClass = statusStyles[status] || statusStyles.New
              const isActiveDrop = dragOverStatus === status

              return (
                <div
                  key={status}
                  onDragOver={(event) => handleDragOver(event, status)}
                  onDragLeave={() => setDragOverStatus("")}
                  onDrop={(event) => handleDrop(event, status)}
                  className={`flex h-[620px] min-w-0 flex-col overflow-hidden rounded-[5px] border bg-[#F8FAFC] transition ${
                    isActiveDrop
                      ? "border-[#00AEEF] shadow-[0_0_0_4px_rgba(0,174,239,0.10)]"
                      : "border-slate-100"
                  }`}
                >
                  <div className={`h-1.5 shrink-0 ${accentClass}`} />

                  <div className="shrink-0 border-b border-slate-100 bg-white p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="break-words font-fredoka text-[22px] font-semibold leading-tight text-slate-950">
                          {status}
                        </p>

                        <p className="font-poppins text-xs font-semibold text-slate-500">
                          {columnLeads.length} lead
                          {columnLeads.length === 1 ? "" : "s"}
                        </p>
                      </div>

                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[5px] bg-[#F8FAFC] font-fredoka text-[22px] font-semibold text-slate-950">
                        {columnLeads.length}
                      </span>
                    </div>
                  </div>

                  <div
                    className="kanban-column-scroll flex-1 px-3 py-3"
                    onWheel={handleColumnWheel}
                    onWheelCapture={handleColumnWheel}
                  >
                    <div className="grid content-start gap-3">
                      {columnLeads.length ? (
                        columnLeads
                          .sort((a, b) => getLeadScore(b) - getLeadScore(a))
                          .map((lead) => (
                            <KanbanCard
                              key={lead._id}
                              lead={lead}
                              onDragStart={handleDragStart}
                              onMoveStatus={updateLeadStatus}
                              actionLoading={actionLoading}
                            />
                          ))
                      ) : (
                        <div className="flex min-h-[200px] items-center justify-center rounded-[5px] border border-dashed border-slate-200 bg-white p-4 text-center">
                          <div>
                            <FaClock className="mx-auto text-2xl text-slate-300" />

                            <p className="mt-2 font-poppins text-sm font-semibold text-slate-500">
                              No leads in {status}
                            </p>

                            <p className="mt-1 font-poppins text-xs font-medium text-slate-400">
                              Drop a card here to move it.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}
    </div>
  )
}

export default AdminLeadKanbanPage