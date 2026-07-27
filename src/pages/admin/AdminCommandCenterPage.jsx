import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import {
  FaArrowRight,
  FaBell,
  FaCalendarAlt,
  FaCheckCircle,
  FaExclamationTriangle,
  FaEye,
  FaFire,
  FaPhoneAlt,
  FaRocket,
  FaSyncAlt,
  FaTasks,
  FaUserClock,
  FaUsers,
  FaWhatsapp,
} from "react-icons/fa"
import { adminApi } from "../../services/api"
import SmartLeadScore from "../../components/admin/SmartLeadScore"
import {
  getSmartLeadScore,
  isSmartFollowUpOverdue,
  isSmartFollowUpToday,
} from "../../utils/leadScoring"

const pipelineStages = [
  "New",
  "Contacted",
  "Interested",
  "Awaiting Documents",
  "Payment Pending",
  "Booked",
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

const formatService = (serviceType = "") => {
  return serviceLabels[serviceType] || serviceType || "-"
}

const formatDate = (date) => {
  if (!date) return "-"
  return new Date(date).toLocaleDateString()
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

const ActionCard = ({
  label,
  value,
  description,
  icon,
  tone = "blue",
  to,
  badge,
}) => {
  const tones = {
    blue: "bg-[#00AEEF]/10 text-[#00AEEF]",
    orange: "bg-[#FF6B00]/10 text-[#FF6B00]",
    red: "bg-red-50 text-red-700",
    green: "bg-emerald-50 text-emerald-700",
    purple: "bg-purple-50 text-purple-700",
    dark: "bg-slate-950 text-white",
  }

  return (
    <Link
      to={to}
      className="group overflow-hidden rounded-[5px] border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-[#00AEEF]/30 hover:shadow-[0_20px_55px_rgba(15,23,42,0.10)]"
    >
      <div className="flex items-start justify-between gap-4">
        <span
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[5px] ${
            tones[tone] || tones.blue
          }`}
        >
          {icon}
        </span>

        {badge && (
          <span className="rounded-[5px] bg-[#F8FAFC] px-2.5 py-1 font-poppins text-[10px] font-bold uppercase text-slate-500">
            {badge}
          </span>
        )}
      </div>

      <p className="mt-5 font-fredoka text-[34px] font-semibold leading-none text-slate-950">
        {value}
      </p>

      <h3 className="mt-2 font-poppins text-sm font-bold text-slate-950">
        {label}
      </h3>

      <p className="mt-1 font-poppins text-xs font-medium leading-5 text-slate-500">
        {description}
      </p>

      <div className="mt-4 inline-flex items-center gap-2 font-poppins text-xs font-bold text-[#FF6B00] transition group-hover:text-[#00AEEF]">
        Handle Now
        <FaArrowRight className="text-[10px]" />
      </div>
    </Link>
  )
}

const QuickLaunchCard = ({ title, description, icon, to, tone = "blue" }) => {
  const tones = {
    blue: "bg-[#00AEEF]/10 text-[#00AEEF]",
    orange: "bg-[#FF6B00]/10 text-[#FF6B00]",
    dark: "bg-slate-950 text-white",
    green: "bg-emerald-50 text-emerald-700",
    purple: "bg-purple-50 text-purple-700",
  }

  return (
    <Link
      to={to}
      className="rounded-[5px] border border-slate-100 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-[#00AEEF]/30 hover:shadow-[0_16px_40px_rgba(15,23,42,0.08)]"
    >
      <div className="flex items-center gap-3">
        <span
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[5px] ${
            tones[tone] || tones.blue
          }`}
        >
          {icon}
        </span>

        <div className="min-w-0">
          <p className="font-poppins text-sm font-bold text-slate-950">
            {title}
          </p>

          <p className="mt-0.5 line-clamp-1 font-poppins text-xs font-medium text-slate-500">
            {description}
          </p>
        </div>

        <FaArrowRight className="ml-auto shrink-0 text-xs text-slate-300" />
      </div>
    </Link>
  )
}

const PriorityLeadCard = ({ lead, index }) => {
  const smart = getSmartLeadScore(lead)

  return (
    <article className="rounded-[5px] border border-slate-100 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-[#00AEEF]/30 hover:shadow-[0_16px_40px_rgba(15,23,42,0.08)]">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-[5px] bg-slate-950 font-fredoka text-lg font-semibold text-white">
              {index + 1}
            </span>

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

          <p className="mt-1 line-clamp-1 font-poppins text-xs font-semibold text-slate-500">
            {getLeadSubtitle(lead) || "No service details available"}
          </p>

          <div className="mt-3">
            <SmartLeadScore lead={lead} compact />
          </div>

          <div className="mt-3 grid gap-2 font-poppins text-xs font-semibold text-slate-600 sm:grid-cols-3">
            <p className="flex min-w-0 items-center gap-2">
              <FaPhoneAlt className="shrink-0 text-[#00AEEF]" />
              <span className="break-words">{lead.phone || "-"}</span>
            </p>

            <p className="flex min-w-0 items-center gap-2">
              <FaCalendarAlt className="shrink-0 text-[#FF6B00]" />
              <span>
                {lead.followUpDate
                  ? formatDate(lead.followUpDate)
                  : "No follow-up"}
              </span>
            </p>

            <p className="flex min-w-0 items-center gap-2">
              <FaFire className="shrink-0 text-[#FF6B00]" />
              <span>{smart.score}/100 priority score</span>
            </p>
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap gap-2">
          <a
            href={getWhatsappUrl(lead.phone)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-[5px] bg-[#25D366] px-3 py-2.5 text-white transition hover:bg-[#00AEEF]"
            title="WhatsApp"
          >
            <FaWhatsapp />
          </a>

          <Link
            to={`/admin/leads/${lead._id}`}
            className="inline-flex items-center justify-center rounded-[5px] bg-slate-950 px-3 py-2.5 text-white transition hover:bg-[#FF6B00]"
            title="View lead"
          >
            <FaEye />
          </Link>
        </div>
      </div>
    </article>
  )
}

const PipelineStageCard = ({ stage, count, total }) => {
  const percentage = total ? Math.round((count / total) * 100) : 0

  return (
    <div className="rounded-[5px] border border-slate-100 bg-[#F8FAFC] p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="font-poppins text-xs font-bold text-slate-700">{stage}</p>

        <span className="rounded-[5px] bg-white px-2.5 py-1 font-poppins text-[11px] font-bold text-slate-500">
          {count}
        </span>
      </div>

      <div className="mt-3 h-2 overflow-hidden rounded-full bg-white">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#00AEEF] to-[#FF6B00]"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <p className="mt-2 font-poppins text-[10px] font-bold uppercase tracking-[0.08em] text-slate-400">
        {percentage}% of visible pipeline
      </p>
    </div>
  )
}

const AdminCommandCenterPage = () => {
  const [leads, setLeads] = useState([])
  const [contactStats, setContactStats] = useState(null)
  const [notificationStats, setNotificationStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const loadCommandCenter = async () => {
    setLoading(true)
    setError("")

    try {
      const params = new URLSearchParams()
      params.set("limit", "100")
      params.set("sort", "-createdAt")

      const leadsData = await adminApi.getLeads(`?${params.toString()}`)
      const nextLeads = leadsData.leads || leadsData.data?.leads || []

      setLeads(nextLeads)

      if (typeof adminApi.getContactInquiryStats === "function") {
        const data = await adminApi.getContactInquiryStats()
        setContactStats(data)
      }

      if (typeof adminApi.getUnreadNotificationCount === "function") {
        const data = await adminApi.getUnreadNotificationCount()
        setNotificationStats(data)
      }
    } catch (err) {
      setError(err.message || "Failed to load command center.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCommandCenter()
  }, [])

  const commandStats = useMemo(() => {
    const newLeads = leads.filter((lead) => lead.status === "New")
    const hotLeads = leads.filter((lead) => getSmartLeadScore(lead).score >= 80)
    const overdue = leads.filter((lead) => isSmartFollowUpOverdue(lead))
    const today = leads.filter((lead) => isSmartFollowUpToday(lead))
    const payment = leads.filter((lead) => lead.status === "Payment Pending")
    const noFollowUp = leads.filter(
      (lead) =>
        !lead.followUpDate &&
        !["Booked", "Lost", "Cancelled"].includes(lead.status)
    )

    return {
      total: leads.length,
      new: newLeads.length,
      hot: hotLeads.length,
      overdue: overdue.length,
      today: today.length,
      payment: payment.length,
      noFollowUp: noFollowUp.length,
      unreadInquiries:
        contactStats?.unread ||
        contactStats?.stats?.unread ||
        contactStats?.data?.stats?.unread ||
        0,
      unreadNotifications:
        notificationStats?.count ||
        notificationStats?.unread ||
        notificationStats?.data?.count ||
        0,
    }
  }, [leads, contactStats, notificationStats])

  const priorityQueue = useMemo(() => {
    return [...leads]
      .sort((a, b) => {
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
      .slice(0, 10)
  }, [leads])

  const pipelineCounts = useMemo(() => {
    return pipelineStages.reduce((acc, stage) => {
      acc[stage] = leads.filter((lead) => lead.status === stage).length
      return acc
    }, {})
  }, [leads])

  return (
    <div className="grid gap-5">
      <section className="overflow-hidden rounded-[5px] bg-slate-950 shadow-[0_24px_70px_rgba(15,23,42,0.18)]">
        <div className="relative p-5 sm:p-7 lg:p-8">
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#00AEEF]/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-28 left-10 h-72 w-72 rounded-full bg-[#FF6B00]/20 blur-3xl" />

          <div className="relative z-10 flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div>
              

              <h1 className="mt-4 font-fredoka text-[34px] font-semibold leading-tight text-white sm:text-[50px]">
                TravelEx Sales Control Room
              </h1>

              <p className="mt-2 max-w-3xl font-poppins text-sm font-medium leading-7 text-white/70 sm:text-base">
                A premium CRM cockpit for owners, managers, and consultants to
                see urgent leads, follow-up risk, sales pipeline health, and the
                next best action instantly.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:min-w-[440px]">
              <Link
                to="/admin/workbench"
                className="inline-flex items-center justify-center gap-2 rounded-[5px] bg-white/10 px-4 py-3 font-poppins text-sm font-semibold text-white backdrop-blur transition hover:bg-[#00AEEF]"
              >
                Open Workbench
                <FaArrowRight className="text-xs" />
              </Link>

              <button
                type="button"
                onClick={loadCommandCenter}
                className="inline-flex items-center justify-center gap-2 rounded-[5px] bg-[#FF6B00] px-4 py-3 font-poppins text-sm font-semibold text-white transition hover:bg-[#00AEEF]"
              >
                <FaSyncAlt />
                Refresh Center
              </button>
            </div>
          </div>
        </div>
      </section>

      {error && (
        <div className="rounded-[5px] border border-red-100 bg-red-50 px-5 py-4 font-poppins text-sm font-semibold text-red-600">
          {error}
        </div>
      )}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
        <ActionCard
          label="New Leads"
          value={loading ? "..." : commandStats.new}
          description="Fresh inquiries waiting for first response."
          icon={<FaUsers />}
          tone="orange"
          to="/admin/leads?status=New"
          badge="Fresh"
        />

        <ActionCard
          label="Hot Leads"
          value={loading ? "..." : commandStats.hot}
          description="Smart-score leads most likely to convert."
          icon={<FaFire />}
          tone="red"
          to="/admin/workbench"
          badge="AI Score"
        />

        <ActionCard
          label="Overdue"
          value={loading ? "..." : commandStats.overdue}
          description="Follow-ups that are already late."
          icon={<FaExclamationTriangle />}
          tone="red"
          to="/admin/follow-ups"
          badge="Urgent"
        />

        <ActionCard
          label="Today"
          value={loading ? "..." : commandStats.today}
          description="Customers scheduled for follow-up today."
          icon={<FaCalendarAlt />}
          tone="purple"
          to="/admin/follow-ups"
          badge="Tasks"
        />

        <ActionCard
          label="Payment Pending"
          value={loading ? "..." : commandStats.payment}
          description="Leads closest to conversion and booking."
          icon={<FaCheckCircle />}
          tone="green"
          to="/admin/workbench"
          badge="Revenue"
        />

        <ActionCard
          label="No Follow-up"
          value={loading ? "..." : commandStats.noFollowUp}
          description="Active leads without a next action plan."
          icon={<FaUserClock />}
          tone="blue"
          to="/admin/follow-ups"
          badge="Risk"
        />
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_430px]">
        <div className="rounded-[5px] border border-slate-100 bg-white p-5 shadow-sm">
          <div className="mb-5 flex flex-col gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-poppins text-[10px] font-bold uppercase tracking-[0.1em] text-[#00AEEF]">
                Smart Priority Queue
              </p>

              <h2 className="mt-1 font-fredoka text-[34px] font-semibold leading-tight text-slate-950">
                Top Leads To Handle Now
              </h2>

              <p className="mt-1 font-poppins text-sm font-semibold text-slate-500">
                Sorted by overdue follow-ups, hot score, payment stage, new
                leads, and urgency.
              </p>
            </div>

            <Link
              to="/admin/workbench"
              className="inline-flex w-fit items-center justify-center gap-2 rounded-[5px] bg-slate-950 px-4 py-2.5 font-poppins text-sm font-semibold text-white transition hover:bg-[#FF6B00]"
            >
              Open Full Queue
              <FaArrowRight className="text-xs" />
            </Link>
          </div>

          {loading ? (
            <div className="grid gap-4">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-48 animate-pulse rounded-[5px] bg-[#F8FAFC]"
                />
              ))}
            </div>
          ) : priorityQueue.length === 0 ? (
            <div className="flex min-h-[320px] items-center justify-center rounded-[5px] border border-dashed border-slate-200 bg-[#F8FAFC] p-10 text-center">
              <div>
                <FaRocket className="mx-auto text-3xl text-[#00AEEF]" />

                <h3 className="mt-4 font-fredoka text-[30px] font-semibold text-slate-950">
                  No leads available
                </h3>

                <p className="mt-2 font-poppins text-sm font-medium text-slate-500">
                  New customer inquiries will appear here automatically.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid gap-4">
              {priorityQueue.map((lead, index) => (
                <PriorityLeadCard key={lead._id} lead={lead} index={index} />
              ))}
            </div>
          )}
        </div>

        <div className="grid content-start gap-5">
          <div className="rounded-[5px] border border-slate-100 bg-white p-5 shadow-sm">
            <div className="mb-4">
              <p className="font-poppins text-[10px] font-bold uppercase tracking-[0.1em] text-[#FF6B00]">
                Quick Launch
              </p>

              <h2 className="mt-1 font-fredoka text-[30px] font-semibold leading-tight text-slate-950">
                CRM Shortcuts
              </h2>
            </div>

            <div className="grid gap-3">
              <QuickLaunchCard
                title="Consultant Workbench"
                description="Daily sales workspace"
                icon={<FaTasks />}
                to="/admin/workbench"
                tone="dark"
              />

              <QuickLaunchCard
                title="Follow-up Calendar"
                description="Today, overdue, upcoming tasks"
                icon={<FaCalendarAlt />}
                to="/admin/follow-ups"
                tone="orange"
              />

              <QuickLaunchCard
                title="Pipeline Board"
                description="Visual sales stage movement"
                icon={<FaRocket />}
                to="/admin/leads/kanban"
                tone="blue"
              />

              <QuickLaunchCard
                title="Contact Inquiries"
                description="Website contact messages"
                icon={<FaBell />}
                to="/admin/contact-inquiries"
                tone="purple"
              />

              <QuickLaunchCard
                title="All Leads"
                description="Complete lead database"
                icon={<FaUsers />}
                to="/admin/leads"
                tone="green"
              />
            </div>
          </div>

          <div className="rounded-[5px] border border-slate-100 bg-white p-5 shadow-sm">
            <div className="mb-4">
              <p className="font-poppins text-[10px] font-bold uppercase tracking-[0.1em] text-[#00AEEF]">
                Pipeline Snapshot
              </p>

              <h2 className="mt-1 font-fredoka text-[30px] font-semibold leading-tight text-slate-950">
                Sales Movement
              </h2>
            </div>

            <div className="grid gap-3">
              {pipelineStages.map((stage) => (
                <PipelineStageCard
                  key={stage}
                  stage={stage}
                  count={pipelineCounts[stage] || 0}
                  total={commandStats.total}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default AdminCommandCenterPage