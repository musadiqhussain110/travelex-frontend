import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import {
  FaArrowRight,
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaEye,
  FaPhoneAlt,
  FaSearch,
  FaSyncAlt,
  FaTimes,
  FaUserClock,
  FaWhatsapp,
} from "react-icons/fa"
import { adminApi } from "../../services/api"
import SmartLeadScore from "../../components/admin/SmartLeadScore"

const openSalesStatuses = [
  "New",
  "Contacted",
  "Interested",
  "Awaiting Documents",
  "Payment Pending",
]

const followUpSections = [
  {
    key: "overdue",
    title: "Overdue Follow-ups",
    description: "Leads that should have been contacted already.",
    icon: <FaExclamationTriangle />,
    tone: "red",
  },
  {
    key: "today",
    title: "Today Follow-ups",
    description: "Customers that need attention today.",
    icon: <FaCalendarAlt />,
    tone: "blue",
  },
  {
    key: "upcoming",
    title: "Upcoming Follow-ups",
    description: "Scheduled follow-ups for the coming days.",
    icon: <FaClock />,
    tone: "purple",
  },
  {
    key: "none",
    title: "No Follow-up Leads",
    description: "Active leads without any follow-up plan.",
    icon: <FaUserClock />,
    tone: "orange",
  },
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

const getSectionBorder = (tone = "blue") => {
  const tones = {
    blue: "border-t-[#00AEEF]",
    orange: "border-t-[#FF6B00]",
    red: "border-t-red-500",
    green: "border-t-emerald-500",
    purple: "border-t-purple-500",
    dark: "border-t-slate-950",
  }

  return tones[tone] || tones.blue
}

const formatService = (serviceType = "") => {
  return serviceLabels[serviceType] || serviceType || "-"
}

const padDatePart = (value) => {
  return String(value).padStart(2, "0")
}

const getLocalDateKey = (date) => {
  return [
    date.getFullYear(),
    padDatePart(date.getMonth() + 1),
    padDatePart(date.getDate()),
  ].join("-")
}

const getDateKey = (date) => {
  if (!date) return ""

  const parsedDate = new Date(date)

  if (Number.isNaN(parsedDate.getTime())) return ""

  return getLocalDateKey(parsedDate)
}

const getTodayKey = () => {
  return getLocalDateKey(new Date())
}

const getTomorrowKey = () => {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)

  return getLocalDateKey(tomorrow)
}

const getFollowUpDateValue = (offsetDays = 0) => {
  const date = new Date()
  date.setDate(date.getDate() + offsetDays)

  return getLocalDateKey(date)
}

const formatDate = (date) => {
  const dateKey = getDateKey(date)

  if (!dateKey) return "-"

  const [year, month, day] = dateKey.split("-").map(Number)
  const localDate = new Date(year, month - 1, day)

  return localDate.toLocaleDateString()
}

const formatDateTime = (date) => {
  if (!date) return "-"

  const parsedDate = new Date(date)

  if (Number.isNaN(parsedDate.getTime())) return "-"

  return parsedDate.toLocaleString()
}

const getWhatsappUrl = (phone = "") => {
  const cleanPhone = String(phone).replace(/[^\d]/g, "")
  return cleanPhone ? `https://wa.me/${cleanPhone}` : "https://wa.me/"
}

const getServiceBadgeClass = (serviceType = "") => {
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

const isOpenSalesLead = (lead = {}) => {
  return openSalesStatuses.includes(lead.status || "New")
}

const isScheduledFollowUp = (lead = {}) => {
  return lead.followUpStatus === "Scheduled" && Boolean(lead.followUpDate)
}

const hasNoFollowUp = (lead = {}) => {
  return (
    isOpenSalesLead(lead) &&
    (!lead.followUpDate ||
      !lead.followUpStatus ||
      lead.followUpStatus === "Not Set" ||
      lead.followUpStatus === "")
  )
}

const normalizeFollowUpLists = ({ today = [], overdue = [], upcoming = [], none = [] }) => {
  const todayKey = getTodayKey()
  const tomorrowKey = getTomorrowKey()

  return {
    today: today
      .filter(isOpenSalesLead)
      .filter(isScheduledFollowUp)
      .filter((lead) => getDateKey(lead.followUpDate) === todayKey),

    overdue: overdue
      .filter(isOpenSalesLead)
      .filter(isScheduledFollowUp)
      .filter((lead) => {
        const dateKey = getDateKey(lead.followUpDate)
        return dateKey && dateKey < todayKey
      }),

    upcoming: upcoming
      .filter(isOpenSalesLead)
      .filter(isScheduledFollowUp)
      .filter((lead) => {
        const dateKey = getDateKey(lead.followUpDate)
        return dateKey && dateKey >= tomorrowKey
      }),

    none: none.filter(hasNoFollowUp),
  }
}

const getLeadSubtitle = (lead = {}) => {
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
    return [lead.city, lead.destination]
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
      lead.bookingReference ? `Flight: ${lead.bookingReference}` : "",
      lead.pickupTime,
    ]
      .filter(Boolean)
      .join(" • ")
  }

  return [lead.city, lead.destination].filter(Boolean).join(" • ")
}

const FollowUpLeadCard = ({
  lead,
  sectionKey,
  onComplete,
  onScheduleToday,
  onScheduleTomorrow,
  actionLoading,
}) => {
  const completeLoading = actionLoading === `${lead._id}-complete`
  const todayLoading = actionLoading === `${lead._id}-today`
  const tomorrowLoading = actionLoading === `${lead._id}-tomorrow`

  return (
    <article className="rounded-[5px] border border-slate-100 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-[#00AEEF]/30 hover:shadow-[0_16px_40px_rgba(15,23,42,0.08)]">
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
          </div>

          <p className="mt-1 line-clamp-2 font-poppins text-xs font-semibold leading-5 text-slate-500">
            {getLeadSubtitle(lead) || "No service details available"}
          </p>

          <div className="mt-3">
            <SmartLeadScore lead={lead} compact />
          </div>

          <div className="mt-3 grid gap-2 rounded-[5px] bg-[#F8FAFC] p-3 font-poppins text-xs font-semibold text-slate-600 sm:grid-cols-2">
            <p className="flex min-w-0 items-center gap-2">
              <FaPhoneAlt className="shrink-0 text-[#00AEEF]" />
              <span className="break-words">{lead.phone || "-"}</span>
            </p>

            <p className="flex min-w-0 items-center gap-2">
              <FaCalendarAlt className="shrink-0 text-[#FF6B00]" />
              <span>
                {lead.followUpDate
                  ? `${formatDate(lead.followUpDate)}${
                      lead.followUpTime ? ` • ${lead.followUpTime}` : ""
                    }`
                  : "No follow-up set"}
              </span>
            </p>

            <p className="flex min-w-0 items-center gap-2">
              <FaClock className="shrink-0 text-[#00AEEF]" />
              <span>Submitted: {formatDateTime(lead.createdAt)}</span>
            </p>

            <p className="flex min-w-0 items-center gap-2">
              <FaUserClock className="shrink-0 text-[#FF6B00]" />
              <span>{lead.followUpStatus || "Not Set"}</span>
            </p>
          </div>

          {lead.followUpNote && (
            <div className="mt-3 rounded-[5px] border border-orange-100 bg-orange-50 px-3 py-2">
              <p className="line-clamp-3 whitespace-pre-wrap font-poppins text-xs font-semibold leading-5 text-orange-800">
                {lead.followUpNote}
              </p>
            </div>
          )}
        </div>

        <div className="flex shrink-0 flex-wrap gap-2">
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
            title="View Lead"
          >
            <FaEye />
          </Link>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-3">
        {sectionKey !== "none" && (
          <button
            type="button"
            onClick={() => onComplete(lead)}
            disabled={completeLoading || lead.followUpStatus !== "Scheduled"}
            className="inline-flex items-center justify-center gap-2 rounded-[5px] bg-emerald-50 px-3 py-2 font-poppins text-xs font-bold text-emerald-700 transition hover:bg-emerald-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FaCheckCircle />
            {completeLoading ? "Completing..." : "Complete Follow-up"}
          </button>
        )}

        <button
          type="button"
          onClick={() => onScheduleToday(lead)}
          disabled={todayLoading}
          className="inline-flex items-center justify-center gap-2 rounded-[5px] bg-sky-50 px-3 py-2 font-poppins text-xs font-bold text-[#00AEEF] transition hover:bg-[#00AEEF] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          <FaCalendarAlt />
          {todayLoading ? "Scheduling..." : "Schedule Today"}
        </button>

        <button
          type="button"
          onClick={() => onScheduleTomorrow(lead)}
          disabled={tomorrowLoading}
          className="inline-flex items-center justify-center gap-2 rounded-[5px] bg-orange-50 px-3 py-2 font-poppins text-xs font-bold text-[#FF6B00] transition hover:bg-[#FF6B00] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          <FaClock />
          {tomorrowLoading ? "Scheduling..." : "Schedule Tomorrow"}
        </button>
      </div>
    </article>
  )
}

const AdminFollowUpsPage = () => {
  const [lists, setLists] = useState({
    today: [],
    overdue: [],
    upcoming: [],
    none: [],
  })
  const [activeSection, setActiveSection] = useState("overdue")
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState("")
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  const loadFollowUps = async () => {
    setLoading(true)
    setError("")

    try {
      const requestFor = async (followUp) => {
        const params = new URLSearchParams()
        params.set("limit", "100")
        params.set("followUp", followUp)
        params.set("sort", followUp === "none" ? "-createdAt" : "followUpDate")

        const data = await adminApi.getLeads(`?${params.toString()}`)
        return data.leads || data.data?.leads || []
      }

      const [today, overdue, upcoming, none] = await Promise.all([
        requestFor("today"),
        requestFor("overdue"),
        requestFor("upcoming"),
        requestFor("none"),
      ])

      setLists(
        normalizeFollowUpLists({
          today,
          overdue,
          upcoming,
          none,
        })
      )
    } catch (err) {
      setError(err.message || "Failed to load follow-up calendar.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadFollowUps()
  }, [])

  const filteredLists = useMemo(() => {
    const query = search.trim().toLowerCase()

    if (!query) return lists

    const filterLead = (lead) =>
      [
        lead.name,
        lead.phone,
        lead.email,
        lead.city,
        lead.destination,
        lead.destinationCountry,
        lead.bookingReference,
        lead.followUpNote,
        lead.message,
        lead.additionalRequirements,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(query)

    return {
      today: lists.today.filter(filterLead),
      overdue: lists.overdue.filter(filterLead),
      upcoming: lists.upcoming.filter(filterLead),
      none: lists.none.filter(filterLead),
    }
  }, [lists, search])

  const activeLeads = filteredLists[activeSection] || []

  const patchLeadEverywhere = (leadId, patch) => {
    setLists((prev) => {
      const patchedLists = {}

      Object.keys(prev).forEach((key) => {
        patchedLists[key] = prev[key].map((lead) =>
          lead._id === leadId ? { ...lead, ...patch } : lead
        )
      })

      return normalizeFollowUpLists(patchedLists)
    })
  }

  const handleCompleteFollowUp = async (lead) => {
    if (!lead?._id || lead.followUpStatus !== "Scheduled") return

    const loadingKey = `${lead._id}-complete`

    setActionLoading(loadingKey)
    setSuccess("")
    setError("")

    try {
      await adminApi.updateLeadFollowUp(lead._id, {
        followUpDate: lead.followUpDate || null,
        followUpTime: lead.followUpTime || "",
        followUpNote:
          lead.followUpNote || "Follow-up completed from follow-up calendar.",
        followUpStatus: "Completed",
      })

      setSuccess(`Follow-up completed for ${lead.name || "lead"}.`)
      await loadFollowUps()
    } catch (err) {
      setError(err.message || "Failed to complete follow-up.")
    } finally {
      setActionLoading("")
    }
  }

  const handleSchedule = async (lead, type) => {
    if (!lead?._id) return

    const loadingKey = `${lead._id}-${type}`
    const date =
      type === "today" ? getFollowUpDateValue(0) : getFollowUpDateValue(1)

    setActionLoading(loadingKey)
    setSuccess("")
    setError("")

    try {
      await adminApi.updateLeadFollowUp(lead._id, {
        followUpDate: date,
        followUpTime: lead.followUpTime || "",
        followUpNote:
          lead.followUpNote ||
          `Follow-up scheduled from follow-up calendar for ${type}.`,
        followUpStatus: "Scheduled",
      })

      patchLeadEverywhere(lead._id, {
        followUpDate: date,
        followUpStatus: "Scheduled",
      })

      setSuccess(
        `Follow-up scheduled ${type === "today" ? "today" : "tomorrow"} for ${
          lead.name || "lead"
        }.`
      )

      await loadFollowUps()
    } catch (err) {
      setError(err.message || "Failed to schedule follow-up.")
    } finally {
      setActionLoading("")
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
                <FaCalendarAlt className="text-[#FF6B00]" />
                Follow-up Calendar
              </p>

              <h1 className="mt-4 font-fredoka text-[34px] font-semibold leading-tight text-white sm:text-[48px]">
                Sales Task Calendar
              </h1>

              <p className="mt-2 max-w-3xl font-poppins text-sm font-medium leading-7 text-white/70 sm:text-base">
                A focused CRM task view for overdue, today, upcoming, and
                missing follow-ups so no TravelEx customer gets ignored.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:w-[420px]">
              <Link
                to="/admin/workbench"
                className="inline-flex h-11 w-full items-center justify-center gap-2 whitespace-nowrap rounded-[5px] bg-white/10 px-4 font-poppins text-sm font-semibold text-white backdrop-blur transition hover:bg-[#00AEEF]"
              >
                Consultant Workbench
                <FaArrowRight className="text-xs" />
              </Link>

              <button
                type="button"
                onClick={loadFollowUps}
                className="inline-flex h-11 w-full items-center justify-center gap-2 whitespace-nowrap rounded-[5px] bg-[#FF6B00] px-4 font-poppins text-sm font-semibold text-white transition hover:bg-[#00AEEF]"
              >
                <FaSyncAlt />
                Refresh Calendar
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

      <section className="rounded-[5px] border border-slate-100 bg-white p-5 shadow-sm">
        <div className="grid gap-3 xl:grid-cols-[1fr_auto] xl:items-center">
          <div className="relative">
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400" />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by customer, phone, city, destination, follow-up note..."
              className="h-11 w-full rounded-[5px] border border-slate-200 bg-[#F8FAFC] pl-10 pr-10 font-poppins text-sm font-semibold text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#00AEEF] focus:bg-white"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-red-600"
              >
                <FaTimes />
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {followUpSections.map((section) => (
              <button
                key={section.key}
                type="button"
                onClick={() => setActiveSection(section.key)}
                className={`inline-flex items-center gap-2 rounded-[5px] px-3 py-2 font-poppins text-xs font-bold transition ${
                  activeSection === section.key
                    ? "bg-slate-950 text-white"
                    : "bg-[#F8FAFC] text-slate-600 hover:bg-[#00AEEF] hover:text-white"
                }`}
              >
                {section.icon}
                {section.title}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section
        className={`rounded-[5px] border border-t-4 border-slate-100 bg-white p-5 shadow-sm ${
          getSectionBorder(
            followUpSections.find((item) => item.key === activeSection)?.tone
          )
        }`}
      >
        <div className="mb-5 flex flex-col gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-poppins text-[10px] font-bold uppercase tracking-[0.1em] text-[#00AEEF]">
              Follow-up Task List
            </p>

            <h2 className="mt-1 font-fredoka text-[34px] font-semibold leading-tight text-slate-950">
              {
                followUpSections.find((section) => section.key === activeSection)
                  ?.title
              }
            </h2>

            <p className="mt-1 font-poppins text-sm font-semibold text-slate-500">
              {
                followUpSections.find((section) => section.key === activeSection)
                  ?.description
              }{" "}
              {activeLeads.length} lead{activeLeads.length === 1 ? "" : "s"}.
            </p>
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
        ) : activeLeads.length === 0 ? (
          <div className="flex min-h-[360px] items-center justify-center rounded-[5px] border border-dashed border-slate-200 bg-[#F8FAFC] p-10 text-center">
            <div>
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[5px] bg-[#00AEEF]/10 text-[#00AEEF]">
                <FaCheckCircle />
              </div>

              <h3 className="mt-5 font-fredoka text-[32px] font-semibold text-slate-950">
                This section is clear
              </h3>

              <p className="mx-auto mt-2 max-w-xl font-poppins text-sm font-medium leading-7 text-slate-500">
                No leads found in this follow-up category. Try another section
                or clear your search.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-4">
            {activeLeads.map((lead) => (
              <FollowUpLeadCard
                key={lead._id}
                lead={lead}
                sectionKey={activeSection}
                actionLoading={actionLoading}
                onComplete={handleCompleteFollowUp}
                onScheduleToday={(item) => handleSchedule(item, "today")}
                onScheduleTomorrow={(item) => handleSchedule(item, "tomorrow")}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default AdminFollowUpsPage