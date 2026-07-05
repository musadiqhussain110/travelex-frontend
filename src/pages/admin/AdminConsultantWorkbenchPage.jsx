import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import {
  FaArrowRight,
  FaBriefcase,
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
  FaCopy,
  FaExclamationTriangle,
  FaEye,
  FaFire,
  FaPhoneAlt,
  FaPlaneDeparture,
  FaSearch,
  FaSyncAlt,
  FaTimes,
  FaUserClock,
  FaWhatsapp,
} from "react-icons/fa"
import { adminApi } from "../../services/api"
import SmartLeadScore from "../../components/admin/SmartLeadScore"
import {
  getSmartLeadScore,
  isSmartFollowUpOverdue,
  isSmartFollowUpToday,
} from "../../utils/leadScoring"

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

const nextStatusMap = {
  New: "Contacted",
  Contacted: "Interested",
  Interested: "Awaiting Documents",
  "Awaiting Documents": "Payment Pending",
  "Payment Pending": "Booked",
}

const queueTabs = [
  { value: "priority", label: "Priority Queue", icon: <FaFire /> },
  { value: "overdue", label: "Overdue", icon: <FaExclamationTriangle /> },
  { value: "today", label: "Today", icon: <FaCalendarAlt /> },
  { value: "hot", label: "Hot Leads", icon: <FaFire /> },
  { value: "new", label: "New Leads", icon: <FaPlaneDeparture /> },
  { value: "payment", label: "Payment Pending", icon: <FaCheckCircle /> },
  { value: "noFollowUp", label: "No Follow-up", icon: <FaUserClock /> },
]

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

const getWhatsappPhone = (phone = "") => {
  return String(phone).replace(/[^\d]/g, "")
}

const getWhatsappUrl = (lead, message = "") => {
  const phone = getWhatsappPhone(lead?.phone)

  if (!phone) return "https://wa.me/"

  const text = message ? `?text=${encodeURIComponent(message)}` : ""

  return `https://wa.me/${phone}${text}`
}

const getServiceBadgeClass = (serviceType = "") => {
  const classes = {
    umrah: "bg-orange-50 text-[#FF6B00]",
    tour: "bg-sky-50 text-[#00AEEF]",
    visa: "bg-purple-50 text-purple-700",
    ticket: "bg-emerald-50 text-emerald-700",
    hotel: "bg-amber-50 text-amber-700",
    carRental: "bg-indigo-50 text-indigo-700",
    contact: "bg-blue-50 text-blue-700",
    general: "bg-slate-100 text-slate-700",
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

const getLeadSubtitle = (lead = {}) => {
  if (lead.serviceType === "umrah") {
    return [
      lead.city,
      lead.preferredDepartureCity || lead.departureCity,
      lead.preferredDepartureDate || formatShortDate(lead.travelDate),
      lead.packageRequired,
    ]
      .filter(Boolean)
      .join(" • ")
  }

  if (lead.serviceType === "tour") {
    return [
      lead.city,
      lead.destination,
      lead.travelDateText || formatShortDate(lead.travelDate),
      lead.interestedIn,
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

  if (lead.serviceType === "ticket") {
    return [
      [lead.departureCity, lead.destinationCity || lead.destination]
        .filter(Boolean)
        .join(" → "),
      lead.departureDate || formatShortDate(lead.travelDate),
      lead.travelClass,
    ]
      .filter(Boolean)
      .join(" • ")
  }

  if (lead.serviceType === "hotel") {
    return [
      lead.city,
      lead.destination,
      lead.preferredHotel,
      lead.checkInDate ? `Check-in: ${formatShortDate(lead.checkInDate)}` : "",
    ]
      .filter(Boolean)
      .join(" • ")
  }

  if (lead.serviceType === "carRental") {
    return [
      lead.rentalType,
      lead.destination,
      lead.bookingReference ? `Flight: ${lead.bookingReference}` : "",
      lead.pickupTime,
    ]
      .filter(Boolean)
      .join(" • ")
  }

  return [lead.city, lead.destination].filter(Boolean).join(" • ")
}

const getFollowUpLabel = (lead = {}) => {
  if (!lead.followUpDate) return "No follow-up set"

  const date = formatShortDate(lead.followUpDate)
  const time = lead.followUpTime ? ` • ${lead.followUpTime}` : ""

  if (isSmartFollowUpOverdue(lead)) return `Overdue • ${date}${time}`
  if (isSmartFollowUpToday(lead)) return `Today • ${date}${time}`

  return `${date}${time}`
}

const getConsultantMessage = (lead = {}) => {
  const firstName = lead.name?.split(" ")?.[0] || "there"
  const service = formatService(lead.serviceType)

  if (lead.serviceType === "umrah") {
    return `Assalamualaikum ${firstName}, thank you for contacting TravelEx.pk.

We have received your Umrah package inquiry. Our consultant will guide you with available packages, hotels, visa, transport, and complete travel support.

Please confirm your preferred travel date, number of passengers, and hotel preference so we can share the best package options.`
  }

  if (lead.serviceType === "visa") {
    return `Assalamualaikum ${firstName}, thank you for contacting TravelEx.pk.

We have received your visa inquiry for ${
      lead.destinationCountry || lead.destination || "your selected destination"
    }.

Please share your passport copy, travel history, intended travel date, and required visa type so our visa consultant can guide you properly.`
  }

  if (lead.status === "Payment Pending") {
    return `Assalamualaikum ${firstName}, this is a gentle reminder from TravelEx.pk.

Your booking is currently at the payment pending stage. Please confirm once payment is arranged so we can proceed with the next booking steps.`
  }

  return `Assalamualaikum ${firstName}, thank you for contacting TravelEx.pk regarding ${service}.

Our consultant has received your inquiry and will guide you with the best available options. Please share any additional requirements so we can assist you better.`
}

const MetricCard = ({ label, value, icon, tone = "blue", onClick }) => {
  const tones = {
    blue: "bg-[#00AEEF]/10 text-[#00AEEF]",
    orange: "bg-[#FF6B00]/10 text-[#FF6B00]",
    red: "bg-red-50 text-red-700",
    green: "bg-emerald-50 text-emerald-700",
    purple: "bg-purple-50 text-purple-700",
    dark: "bg-slate-950 text-white",
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-[5px] border border-slate-100 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-[#00AEEF]/30 hover:shadow-[0_16px_40px_rgba(15,23,42,0.08)]"
    >
      <div className="flex items-center gap-3">
        <span
          className={`flex h-11 w-11 items-center justify-center rounded-[5px] ${
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
    </button>
  )
}

const LeadQueueCard = ({
  lead,
  selected,
  onSelect,
  onQuickStatus,
  onCompleteFollowUp,
  actionLoading,
}) => {
  const smart = getSmartLeadScore(lead)
  const nextStatus = nextStatusMap[lead.status || "New"]
  const isOverdue = isSmartFollowUpOverdue(lead)
  const isToday = isSmartFollowUpToday(lead)

  return (
    <article
      onClick={() => onSelect(lead)}
      className={`cursor-pointer rounded-[5px] border bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-[0_14px_35px_rgba(15,23,42,0.08)] ${
        selected
          ? "border-[#00AEEF] shadow-[0_0_0_4px_rgba(0,174,239,0.10)]"
          : "border-slate-100 hover:border-[#00AEEF]/30"
      }`}
    >
      <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-fredoka text-[24px] font-semibold leading-tight text-slate-950">
              {lead.name || "Unnamed Customer"}
            </h3>

            <span
              className={`rounded-[5px] px-2.5 py-1 font-poppins text-[10px] font-bold uppercase ${getServiceBadgeClass(
                lead.serviceType
              )}`}
            >
              {formatService(lead.serviceType)}
            </span>

            <span
              className={`rounded-[5px] px-2.5 py-1 font-poppins text-[10px] font-bold uppercase ${getStatusBadgeClass(
                lead.status || "New"
              )}`}
            >
              {lead.status || "New"}
            </span>

            {isOverdue && (
              <span className="rounded-[5px] bg-red-50 px-2.5 py-1 font-poppins text-[10px] font-bold uppercase text-red-700">
                Overdue
              </span>
            )}

            {isToday && (
              <span className="rounded-[5px] bg-purple-50 px-2.5 py-1 font-poppins text-[10px] font-bold uppercase text-purple-700">
                Today
              </span>
            )}
          </div>

          <p className="mt-1 line-clamp-1 font-poppins text-xs font-semibold text-slate-500">
            {getLeadSubtitle(lead) || "No service details available"}
          </p>

          <div className="mt-3">
            <SmartLeadScore lead={lead} compact />
          </div>

          <div className="mt-3 grid gap-2 font-poppins text-xs font-semibold text-slate-600 sm:grid-cols-2 xl:grid-cols-3">
            <p className="flex min-w-0 items-center gap-2">
              <FaPhoneAlt className="shrink-0 text-[#00AEEF]" />
              <span className="break-words">{lead.phone || "-"}</span>
            </p>

            <p className="flex min-w-0 items-center gap-2">
              <FaClock
                className={`shrink-0 ${
                  isOverdue ? "text-red-600" : "text-[#FF6B00]"
                }`}
              />
              <span>{getFollowUpLabel(lead)}</span>
            </p>

            <p className="flex min-w-0 items-center gap-2">
              <FaFire className="shrink-0 text-[#FF6B00]" />
              <span>{smart.score}/100 score</span>
            </p>
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap gap-2">
          <a
            href={getWhatsappUrl(lead)}
            target="_blank"
            rel="noreferrer"
            onClick={(event) => event.stopPropagation()}
            className="inline-flex items-center justify-center rounded-[5px] bg-[#25D366] px-3 py-2 text-white transition hover:bg-[#00AEEF]"
            title="Open WhatsApp"
          >
            <FaWhatsapp />
          </a>

          <a
            href={`tel:${lead.phone || ""}`}
            onClick={(event) => event.stopPropagation()}
            className="inline-flex items-center justify-center rounded-[5px] bg-[#F8FAFC] px-3 py-2 text-slate-700 transition hover:bg-slate-950 hover:text-white"
            title="Call"
          >
            <FaPhoneAlt />
          </a>

          <Link
            to={`/admin/leads/${lead._id}`}
            onClick={(event) => event.stopPropagation()}
            className="inline-flex items-center justify-center rounded-[5px] bg-[#F8FAFC] px-3 py-2 text-slate-700 transition hover:bg-[#FF6B00] hover:text-white"
            title="View Details"
          >
            <FaEye />
          </Link>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-3">
        {nextStatus && (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              onQuickStatus(lead, nextStatus)
            }}
            disabled={actionLoading === `${lead._id}-${nextStatus}`}
            className="inline-flex items-center justify-center gap-2 rounded-[5px] bg-slate-950 px-3 py-2 font-poppins text-xs font-bold text-white transition hover:bg-[#FF6B00] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FaArrowRight />
            {actionLoading === `${lead._id}-${nextStatus}`
              ? "Updating..."
              : `Move to ${nextStatus}`}
          </button>
        )}

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation()
            onCompleteFollowUp(lead)
          }}
          disabled={
            actionLoading === `${lead._id}-followup-completed` ||
            lead.followUpStatus !== "Scheduled"
          }
          className="inline-flex items-center justify-center gap-2 rounded-[5px] bg-orange-50 px-3 py-2 font-poppins text-xs font-bold text-[#FF6B00] transition hover:bg-[#FF6B00] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          <FaCheckCircle />
          Complete Follow-up
        </button>
      </div>
    </article>
  )
}

const LeadFocusPanel = ({
  lead,
  onQuickStatus,
  onCompleteFollowUp,
  onScheduleToday,
  onCopyMessage,
  actionLoading,
}) => {
  if (!lead) {
    return (
      <aside className="rounded-[5px] border border-slate-100 bg-white p-6 text-center shadow-sm xl:sticky xl:top-5">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[5px] bg-[#00AEEF]/10 text-[#00AEEF]">
          <FaBriefcase />
        </div>

        <h3 className="mt-4 font-fredoka text-[28px] font-semibold text-slate-950">
          Select a Lead
        </h3>

        <p className="mt-2 font-poppins text-sm font-medium leading-7 text-slate-500">
          Click any lead from the queue to see customer details, score, quick
          actions, and WhatsApp message.
        </p>
      </aside>
    )
  }

  const nextStatus = nextStatusMap[lead.status || "New"]
  const message = getConsultantMessage(lead)

  return (
    <aside className="rounded-[5px] border border-slate-100 bg-white shadow-sm xl:sticky xl:top-24">
      <div className="border-b border-slate-100 p-5">
        <p className="font-poppins text-[10px] font-bold uppercase tracking-[0.1em] text-[#00AEEF]">
          Consultant Focus Panel
        </p>

        <h3 className="mt-2 font-fredoka text-[30px] font-semibold leading-tight text-slate-950">
          {lead.name || "Unnamed Customer"}
        </h3>

        <p className="mt-1 font-poppins text-sm font-semibold text-slate-500">
          {formatService(lead.serviceType)} • {lead.status || "New"}
        </p>
      </div>

      <div className="grid gap-4 p-5">
        <SmartLeadScore lead={lead} />

        <div className="grid gap-2 rounded-[5px] bg-[#F8FAFC] p-4">
          <p className="flex items-center gap-2 font-poppins text-sm font-semibold text-slate-700">
            <FaPhoneAlt className="text-[#00AEEF]" />
            {lead.phone || "-"}
          </p>

          <p className="flex items-center gap-2 font-poppins text-sm font-semibold text-slate-700">
            <FaClock
              className={
                isSmartFollowUpOverdue(lead) ? "text-red-600" : "text-[#FF6B00]"
              }
            />
            {getFollowUpLabel(lead)}
          </p>

          <p className="flex items-center gap-2 font-poppins text-sm font-semibold text-slate-700">
            <FaCalendarAlt className="text-[#00AEEF]" />
            Submitted: {formatDateTime(lead.createdAt)}
          </p>
        </div>

        <div className="rounded-[5px] border border-slate-100 bg-white p-4">
          <p className="font-poppins text-[10px] font-bold uppercase tracking-[0.08em] text-slate-400">
            Service Details
          </p>

          <p className="mt-2 font-poppins text-sm font-semibold leading-6 text-slate-700">
            {getLeadSubtitle(lead) || "No detailed service information found."}
          </p>
        </div>

        <div className="rounded-[5px] border border-orange-100 bg-orange-50 p-4">
          <p className="font-poppins text-[10px] font-bold uppercase tracking-[0.08em] text-[#FF6B00]">
            WhatsApp Ready Message
          </p>

          <p className="mt-2 whitespace-pre-wrap font-poppins text-sm font-medium leading-6 text-orange-900">
            {message}
          </p>

          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => onCopyMessage(lead)}
              className="inline-flex items-center justify-center gap-2 rounded-[5px] bg-white px-3 py-2.5 font-poppins text-xs font-bold text-[#FF6B00] transition hover:bg-[#FF6B00] hover:text-white"
            >
              <FaCopy />
              Copy Message
            </button>

            <a
              href={getWhatsappUrl(lead, message)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-[5px] bg-[#25D366] px-3 py-2.5 font-poppins text-xs font-bold text-white transition hover:bg-[#00AEEF]"
            >
              <FaWhatsapp />
              Send on WhatsApp
            </a>
          </div>
        </div>

        <div className="grid gap-2">
          {nextStatus && (
            <button
              type="button"
              onClick={() => onQuickStatus(lead, nextStatus)}
              disabled={actionLoading === `${lead._id}-${nextStatus}`}
              className="inline-flex items-center justify-center gap-2 rounded-[5px] bg-slate-950 px-4 py-3 font-poppins text-sm font-bold text-white transition hover:bg-[#FF6B00] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FaArrowRight />
              {actionLoading === `${lead._id}-${nextStatus}`
                ? "Updating..."
                : `Move to ${nextStatus}`}
            </button>
          )}

          <button
            type="button"
            onClick={() => onScheduleToday(lead)}
            disabled={actionLoading === `${lead._id}-schedule-today`}
            className="inline-flex items-center justify-center gap-2 rounded-[5px] bg-sky-50 px-4 py-3 font-poppins text-sm font-bold text-[#00AEEF] transition hover:bg-[#00AEEF] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FaUserClock />
            Schedule Follow-up Today
          </button>

          <button
            type="button"
            onClick={() => onCompleteFollowUp(lead)}
            disabled={
              actionLoading === `${lead._id}-followup-completed` ||
              lead.followUpStatus !== "Scheduled"
            }
            className="inline-flex items-center justify-center gap-2 rounded-[5px] bg-orange-50 px-4 py-3 font-poppins text-sm font-bold text-[#FF6B00] transition hover:bg-[#FF6B00] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FaCheckCircle />
            Complete Follow-up
          </button>

          <Link
            to={`/admin/leads/${lead._id}`}
            className="inline-flex items-center justify-center gap-2 rounded-[5px] border border-slate-200 bg-white px-4 py-3 font-poppins text-sm font-bold text-slate-700 transition hover:border-slate-950 hover:bg-slate-950 hover:text-white"
          >
            <FaEye />
            Open Full Lead Profile
          </Link>
        </div>
      </div>
    </aside>
  )
}

const AdminConsultantWorkbenchPage = () => {
  const [leads, setLeads] = useState([])
  const [selectedLead, setSelectedLead] = useState(null)
  const [activeQueue, setActiveQueue] = useState("priority")
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState("")
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  const loadLeads = async () => {
    setLoading(true)
    setError("")

    try {
      const params = new URLSearchParams()
      params.set("limit", "100")
      params.set("sort", "-createdAt")

      const data = await adminApi.getLeads(`?${params.toString()}`)
      const nextLeads = data.leads || data.data?.leads || []

      setLeads(nextLeads)

      if (!selectedLead && nextLeads.length > 0) {
        setSelectedLead(nextLeads[0])
      }
    } catch (err) {
      setError(err.message || "Failed to load consultant workbench.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadLeads()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const patchLead = (leadId, patch) => {
    setLeads((prev) =>
      prev.map((lead) => (lead._id === leadId ? { ...lead, ...patch } : lead))
    )

    setSelectedLead((prev) =>
      prev?._id === leadId ? { ...prev, ...patch } : prev
    )
  }

  const filteredLeads = useMemo(() => {
    const query = search.trim().toLowerCase()

    const result = leads.filter((lead) => {
      if (!query) return true

      return [
        lead.name,
        lead.phone,
        lead.email,
        lead.city,
        lead.destination,
        lead.destinationCountry,
        lead.bookingReference,
        lead.message,
        lead.additionalRequirements,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(query)
    })

    return result
  }, [leads, search])

  const metrics = useMemo(() => {
    return {
      total: filteredLeads.length,
      hot: filteredLeads.filter((lead) => getSmartLeadScore(lead).score >= 80)
        .length,
      overdue: filteredLeads.filter((lead) => isSmartFollowUpOverdue(lead))
        .length,
      today: filteredLeads.filter((lead) => isSmartFollowUpToday(lead)).length,
      new: filteredLeads.filter((lead) => lead.status === "New").length,
      payment: filteredLeads.filter((lead) => lead.status === "Payment Pending")
        .length,
      noFollowUp: filteredLeads.filter(
        (lead) =>
          !lead.followUpDate &&
          !["Booked", "Lost", "Cancelled"].includes(lead.status)
      ).length,
    }
  }, [filteredLeads])

  const queueLeads = useMemo(() => {
    const sorted = [...filteredLeads].sort((a, b) => {
      const aSmart = getSmartLeadScore(a)
      const bSmart = getSmartLeadScore(b)

      const aBoost =
        (isSmartFollowUpOverdue(a) ? 1000 : 0) +
        (isSmartFollowUpToday(a) ? 700 : 0) +
        (a.status === "Payment Pending" ? 500 : 0) +
        (a.status === "New" ? 250 : 0)

      const bBoost =
        (isSmartFollowUpOverdue(b) ? 1000 : 0) +
        (isSmartFollowUpToday(b) ? 700 : 0) +
        (b.status === "Payment Pending" ? 500 : 0) +
        (b.status === "New" ? 250 : 0)

      return bBoost + bSmart.score - (aBoost + aSmart.score)
    })

    if (activeQueue === "overdue") {
      return sorted.filter((lead) => isSmartFollowUpOverdue(lead))
    }

    if (activeQueue === "today") {
      return sorted.filter((lead) => isSmartFollowUpToday(lead))
    }

    if (activeQueue === "hot") {
      return sorted.filter((lead) => getSmartLeadScore(lead).score >= 80)
    }

    if (activeQueue === "new") {
      return sorted.filter((lead) => lead.status === "New")
    }

    if (activeQueue === "payment") {
      return sorted.filter((lead) => lead.status === "Payment Pending")
    }

    if (activeQueue === "noFollowUp") {
      return sorted.filter(
        (lead) =>
          !lead.followUpDate &&
          !["Booked", "Lost", "Cancelled"].includes(lead.status)
      )
    }

    return sorted
  }, [filteredLeads, activeQueue])

  const handleQuickStatus = async (lead, nextStatus) => {
    if (!lead?._id || !nextStatus || lead.status === nextStatus) return

    const loadingKey = `${lead._id}-${nextStatus}`

    setActionLoading(loadingKey)
    setError("")
    setSuccess("")

    try {
      const data = await adminApi.updateLeadStatus(lead._id, nextStatus)
      const updatedLead = data.lead || data.data?.lead || null

      if (updatedLead) {
        patchLead(lead._id, updatedLead)
      } else {
        patchLead(lead._id, { status: nextStatus })
      }

      setSuccess(`${lead.name || "Lead"} moved to ${nextStatus}.`)
    } catch (err) {
      setError(err.message || "Failed to update lead status.")
    } finally {
      setActionLoading("")
    }
  }

  const handleCompleteFollowUp = async (lead) => {
    if (!lead?._id || lead.followUpStatus !== "Scheduled") return

    const loadingKey = `${lead._id}-followup-completed`

    setActionLoading(loadingKey)
    setError("")
    setSuccess("")

    try {
      const data = await adminApi.updateLeadFollowUp(lead._id, {
        followUpDate: lead.followUpDate || null,
        followUpTime: lead.followUpTime || "",
        followUpNote: lead.followUpNote || "Follow-up completed from workbench.",
        followUpStatus: "Completed",
      })

      const updatedLead = data.lead || data.data?.lead || null

      if (updatedLead) {
        patchLead(lead._id, updatedLead)
      } else {
        patchLead(lead._id, { followUpStatus: "Completed" })
      }

      setSuccess(`Follow-up completed for ${lead.name || "lead"}.`)
    } catch (err) {
      setError(err.message || "Failed to complete follow-up.")
    } finally {
      setActionLoading("")
    }
  }

  const handleScheduleToday = async (lead) => {
    if (!lead?._id) return

    const loadingKey = `${lead._id}-schedule-today`
    const today = new Date()
    today.setHours(12, 0, 0, 0)

    setActionLoading(loadingKey)
    setError("")
    setSuccess("")

    try {
      const data = await adminApi.updateLeadFollowUp(lead._id, {
        followUpDate: today.toISOString(),
        followUpTime: lead.followUpTime || "",
        followUpNote:
          lead.followUpNote || "Follow-up scheduled from consultant workbench.",
        followUpStatus: "Scheduled",
      })

      const updatedLead = data.lead || data.data?.lead || null

      if (updatedLead) {
        patchLead(lead._id, updatedLead)
      } else {
        patchLead(lead._id, {
          followUpDate: today.toISOString(),
          followUpStatus: "Scheduled",
        })
      }

      setSuccess(`Follow-up scheduled today for ${lead.name || "lead"}.`)
    } catch (err) {
      setError(err.message || "Failed to schedule follow-up.")
    } finally {
      setActionLoading("")
    }
  }

  const handleCopyMessage = async (lead) => {
    const message = getConsultantMessage(lead)

    try {
      await navigator.clipboard.writeText(message)
      setSuccess("WhatsApp message copied.")
    } catch {
      setError("Could not copy message. Please copy it manually.")
    }
  }

  return (
    <div className="grid gap-5">
      <section className="overflow-hidden rounded-[5px] bg-slate-950 shadow-[0_24px_70px_rgba(15,23,42,0.18)]">
        <div className="relative p-5 sm:p-7 lg:p-8">
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#00AEEF]/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-28 left-10 h-72 w-72 rounded-full bg-[#FF6B00]/20 blur-3xl" />

          <div className="relative z-10 flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p className="inline-flex items-center gap-2 rounded-[5px] bg-white/10 px-3 py-1.5 font-poppins text-[10px] font-bold uppercase tracking-[0.1em] text-[#00AEEF] backdrop-blur sm:text-xs">
                <FaBriefcase className="text-[#FF6B00]" />
                Consultant Workbench
              </p>

              <h1 className="mt-4 font-fredoka text-[34px] font-semibold leading-tight text-white sm:text-[48px]">
                TravelEx Sales Workspace
              </h1>

              <p className="mt-2 max-w-3xl font-poppins text-sm font-medium leading-7 text-white/70 sm:text-base">
                A focused daily workspace for consultants to handle hot leads,
                overdue follow-ups, WhatsApp replies, and customer movement
                without wasting time.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:min-w-[430px]">
              <Link
                to="/admin/leads"
                className="inline-flex items-center justify-center gap-2 rounded-[5px] bg-white/10 px-4 py-3 font-poppins text-sm font-semibold text-white backdrop-blur transition hover:bg-[#00AEEF]"
              >
                All Leads
                <FaArrowRight className="text-xs" />
              </Link>

              <button
                type="button"
                onClick={loadLeads}
                className="inline-flex items-center justify-center gap-2 rounded-[5px] bg-[#FF6B00] px-4 py-3 font-poppins text-sm font-semibold text-white transition hover:bg-[#00AEEF]"
              >
                <FaSyncAlt />
                Refresh Queue
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

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
        <MetricCard
          label="Priority Leads"
          value={metrics.total}
          icon={<FaBriefcase />}
          tone="dark"
          onClick={() => setActiveQueue("priority")}
        />

        <MetricCard
          label="Hot Leads"
          value={metrics.hot}
          icon={<FaFire />}
          tone="orange"
          onClick={() => setActiveQueue("hot")}
        />

        <MetricCard
          label="Overdue"
          value={metrics.overdue}
          icon={<FaExclamationTriangle />}
          tone="red"
          onClick={() => setActiveQueue("overdue")}
        />

        <MetricCard
          label="Today"
          value={metrics.today}
          icon={<FaCalendarAlt />}
          tone="purple"
          onClick={() => setActiveQueue("today")}
        />

        <MetricCard
          label="New"
          value={metrics.new}
          icon={<FaPlaneDeparture />}
          tone="blue"
          onClick={() => setActiveQueue("new")}
        />

        <MetricCard
          label="Payment"
          value={metrics.payment}
          icon={<FaCheckCircle />}
          tone="green"
          onClick={() => setActiveQueue("payment")}
        />
      </section>

      <section className="rounded-[5px] border border-slate-100 bg-white p-5 shadow-sm">
        <div className="grid gap-3 xl:grid-cols-[1fr_auto] xl:items-center">
          <div className="relative">
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400" />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search customer, phone, destination, booking reference..."
              className="h-11 w-full rounded-[5px] border border-slate-200 bg-[#F8FAFC] pl-10 pr-10 font-poppins text-sm font-semibold text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#00AEEF] focus:bg-white"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-600"
              >
                <FaTimes />
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {queueTabs.map((tab) => (
              <button
                key={tab.value}
                type="button"
                onClick={() => setActiveQueue(tab.value)}
                className={`inline-flex items-center gap-2 rounded-[5px] px-3 py-2 font-poppins text-xs font-bold transition ${
                  activeQueue === tab.value
                    ? "bg-slate-950 text-white"
                    : "bg-[#F8FAFC] text-slate-600 hover:bg-[#00AEEF] hover:text-white"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_440px] xl:items-start">
  <div className="min-w-0 rounded-[5px] border border-slate-100 bg-white p-5 shadow-sm">
    <div className="mb-5 flex flex-col gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="font-poppins text-[10px] font-bold uppercase tracking-[0.1em] text-[#00AEEF]">
          Consultant Queue
        </p>

        <h2 className="mt-1 font-fredoka text-[32px] font-semibold leading-tight text-slate-950 sm:text-[38px]">
          {queueTabs.find((tab) => tab.value === activeQueue)?.label ||
            "Priority Queue"}
        </h2>

        <p className="mt-1 font-poppins text-sm font-semibold text-slate-500">
          {queueLeads.length} lead{queueLeads.length === 1 ? "" : "s"} in this
          queue.
        </p>
      </div>

      <div className="inline-flex w-fit items-center gap-2 rounded-[5px] bg-[#F8FAFC] px-3 py-2 font-poppins text-xs font-bold text-slate-500">
        <FaBriefcase className="text-[#FF6B00]" />
        Daily Work Queue
      </div>
    </div>

    {loading ? (
      <div className="grid gap-4">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="h-56 animate-pulse rounded-[5px] border border-slate-100 bg-[#F8FAFC] shadow-sm"
          />
        ))}
      </div>
    ) : queueLeads.length === 0 ? (
      <div className="flex min-h-[420px] items-center justify-center rounded-[5px] border border-dashed border-slate-200 bg-[#F8FAFC] p-10 text-center">
        <div>
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[5px] bg-[#00AEEF]/10 text-[#00AEEF]">
            <FaSearch />
          </div>

          <h3 className="mt-5 font-fredoka text-[32px] font-semibold text-slate-950">
            No leads found
          </h3>

          <p className="mx-auto mt-2 max-w-xl font-poppins text-sm font-medium leading-7 text-slate-500">
            This queue is clear. Try another queue, clear your search, or open
            the full lead list.
          </p>

          <div className="mt-5 flex flex-col justify-center gap-2 sm:flex-row">
            <button
              type="button"
              onClick={() => {
                setSearch("")
                setActiveQueue("priority")
              }}
              className="inline-flex items-center justify-center gap-2 rounded-[5px] bg-[#FF6B00] px-4 py-2.5 font-poppins text-sm font-semibold text-white transition hover:bg-[#00AEEF]"
            >
              <FaTimes />
              Clear Queue
            </button>

            <Link
              to="/admin/leads"
              className="inline-flex items-center justify-center gap-2 rounded-[5px] border border-slate-200 bg-white px-4 py-2.5 font-poppins text-sm font-semibold text-slate-700 transition hover:border-slate-950 hover:bg-slate-950 hover:text-white"
            >
              <FaEye />
              View All Leads
            </Link>
          </div>
        </div>
      </div>
    ) : (
      <div className="grid gap-4">
        {queueLeads.map((lead) => (
          <LeadQueueCard
            key={lead._id}
            lead={lead}
            selected={selectedLead?._id === lead._id}
            onSelect={setSelectedLead}
            onQuickStatus={handleQuickStatus}
            onCompleteFollowUp={handleCompleteFollowUp}
            actionLoading={actionLoading}
          />
        ))}
      </div>
    )}
  </div>

  <div className="min-w-0">
    <LeadFocusPanel
      lead={selectedLead}
      onQuickStatus={handleQuickStatus}
      onCompleteFollowUp={handleCompleteFollowUp}
      onScheduleToday={handleScheduleToday}
      onCopyMessage={handleCopyMessage}
      actionLoading={actionLoading}
    />
  </div>
</section>
    </div>
  )
}

export default AdminConsultantWorkbenchPage