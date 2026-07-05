import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import {
  FaArrowRight,
  FaBell,
  FaCalendarDay,
  FaCheckCircle,
  FaClock,
  FaExclamationCircle,
  FaInbox,
  FaLayerGroup,
  FaPercentage,
  FaUserClock,
  FaUsers,
} from "react-icons/fa"
import { adminApi } from "../../services/api"

// Neutral UI font stack — reads as a professional data tool (Linear / HubSpot / Attio).
// Uses system UI font by default; Inter if the app has it loaded.
const UI_FONT =
  "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"

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

const serviceLabels = {
  umrah: "Umrah",
  tour: "Tours",
  visa: "Visa",
  ticket: "Air Tickets",
  hotel: "Hotels",
  carRental: "Airport Transfers",
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

const marketingSourceLabels = {
  instagram: "Instagram",
  facebook: "Facebook",
  whatsapp: "WhatsApp",
  google: "Google",
  youtube: "YouTube",
  tiktok: "TikTok",
  linkedin: "LinkedIn",
  email: "Email",
  referral: "Referral",
  direct: "Direct",
  unknown: "Unknown",
  Unknown: "Unknown",
}

const statusColor = {
  New: "bg-[#FF6B00]",
  Contacted: "bg-[#00AEEF]",
  Interested: "bg-emerald-500",
  "Awaiting Documents": "bg-amber-500",
  "Payment Pending": "bg-yellow-500",
  Booked: "bg-teal-500",
  Lost: "bg-red-500",
  Cancelled: "bg-slate-400",
}

const formatService = (service = "") => serviceLabels[service] || service || "-"

const formatMarketingSource = (source = "") => {
  return marketingSourceLabels[source] || source || "Unknown"
}

const getServicePath = (service = "") => servicePaths[service] || "/admin/leads"

const getPercent = (value, total) => {
  if (!total || !value) return 0
  return Math.min(100, Math.round((Number(value) / Number(total)) * 100))
}

const getContactStatsValue = (stats, keys = []) => {
  for (const key of keys) {
    if (stats?.[key] !== undefined && stats?.[key] !== null) {
      return Number(stats[key] || 0)
    }
  }
  return 0
}

// ---- Small building blocks -------------------------------------------------

const Kpi = ({ label, value, hint, icon, accent }) => (
  <div className="rounded-lg border border-slate-200 bg-white px-4 py-3.5">
    <div className="flex items-center justify-between">
      <span className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
        {label}
      </span>
      {icon ? <span className="text-slate-300">{icon}</span> : null}
    </div>

    <p
      className={
        "mt-2 text-2xl font-semibold tabular-nums " +
        (accent || "text-slate-900")
      }
    >
      {value}
    </p>

    {hint ? <p className="mt-0.5 text-xs text-slate-400">{hint}</p> : null}
  </div>
)

const Panel = ({ title, count, children }) => (
  <section className="rounded-lg border border-slate-200 bg-white">
    <header className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
      <h2 className="text-[13px] font-semibold text-slate-900">{title}</h2>
      {count !== undefined ? (
        <span className="text-xs font-medium text-slate-400">{count}</span>
      ) : null}
    </header>
    <div className="p-2">{children}</div>
  </section>
)

const PipelineRow = ({ label, count, percent }) => {
  const dim = count === 0
  const bar = statusColor[label] || "bg-slate-400"

  return (
    <div className="grid grid-cols-[1fr_110px_2rem_2.75rem] items-center gap-3 rounded-md px-2 py-2 hover:bg-slate-50">
      <span
        className={
          "flex items-center gap-2 text-sm " +
          (dim ? "text-slate-400" : "text-slate-700")
        }
      >
        <span
          className={
            "h-2 w-2 shrink-0 rounded-full " + (dim ? "bg-slate-200" : bar)
          }
        />
        {label}
      </span>

      <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
        <div
          className={"h-full rounded-full " + (dim ? "bg-slate-200" : bar)}
          style={{ width: percent + "%" }}
        />
      </div>

      <span
        className={
          "text-right text-sm font-semibold tabular-nums " +
          (dim ? "text-slate-300" : "text-slate-900")
        }
      >
        {count}
      </span>

      <span className="text-right text-xs tabular-nums text-slate-400">
        {percent}%
      </span>
    </div>
  )
}

const ServiceRow = ({ service, count, percent }) => (
  <Link
    to={getServicePath(service)}
    className="grid grid-cols-[1fr_110px_2rem] items-center gap-3 rounded-md px-2 py-2 hover:bg-slate-50"
  >
    <span className="truncate text-sm text-slate-700">
      {formatService(service)}
    </span>

    <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
      <div
        className="h-full rounded-full bg-[#00AEEF]"
        style={{ width: percent + "%" }}
      />
    </div>

    <span className="text-right text-sm font-semibold tabular-nums text-slate-900">
      {count}
    </span>
  </Link>
)

const SourceRow = ({ source, count, percent }) => (
  <div className="grid grid-cols-[1fr_110px_2rem] items-center gap-3 rounded-md px-2 py-2 hover:bg-slate-50">
    <span className="truncate text-sm text-slate-700">
      {formatMarketingSource(source)}
    </span>

    <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
      <div
        className="h-full rounded-full bg-[#FF6B00]"
        style={{ width: percent + "%" }}
      />
    </div>

    <span className="text-right text-sm font-semibold tabular-nums text-slate-900">
      {count}
    </span>
  </div>
)

const ActionRow = ({ to, label, count, tone }) => (
  <Link
    to={to}
    className="flex items-center justify-between rounded-md px-2 py-2.5 hover:bg-slate-50"
  >
    <span className="text-sm text-slate-600">{label}</span>
    <span className="flex items-center gap-2">
      <span
        className={
          "text-sm font-semibold tabular-nums " + (tone || "text-slate-900")
        }
      >
        {count}
      </span>
      <FaArrowRight className="text-[10px] text-slate-300" />
    </span>
  </Link>
)

const HealthRow = ({ label, value }) => (
  <div className="flex items-start justify-between gap-4 px-2 py-2.5">
    <span className="text-sm text-slate-500">{label}</span>
    <span className="text-right text-sm font-medium text-slate-800">
      {value}
    </span>
  </div>
)

// ---- Page ------------------------------------------------------------------

const AdminDashboardPage = () => {
  const [leadStats, setLeadStats] = useState(null)
  const [contactStats, setContactStats] = useState(null)
  const [marketingSourceStats, setMarketingSourceStats] = useState({})
  const [unreadNotifications, setUnreadNotifications] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true)
      setError("")

      try {
        const [
          leadResult,
          contactResult,
          notificationResult,
          dashboardOverviewResult,
        ] = await Promise.allSettled([
          adminApi.getLeadStats(),
          adminApi.getContactInquiryStats(),
          adminApi.getUnreadNotificationCount(),
          adminApi.getDashboardOverview({ days: 30 }),
        ])

        if (leadResult.status === "fulfilled") {
          const data = leadResult.value
          setLeadStats(data.stats || data.data?.stats || data)
        }

        if (contactResult.status === "fulfilled") {
          const data = contactResult.value
          setContactStats(
            data.stats ||
              data.summary ||
              data.data?.stats ||
              data.data?.summary ||
              data
          )
        }

        if (notificationResult.status === "fulfilled") {
          const data = notificationResult.value
          setUnreadNotifications(
            Number(
              data.unreadCount ||
                data.count ||
                data.data?.unreadCount ||
                data.data?.count ||
                0
            )
          )
        }

        if (dashboardOverviewResult.status === "fulfilled") {
          const data = dashboardOverviewResult.value

          const dashboard =
            data.dashboard ||
            data.data?.dashboard ||
            data.data ||
            data

          setMarketingSourceStats(
            dashboard?.crm?.leadsByMarketingSource || {}
          )
        }

        if (
          leadResult.status === "rejected" &&
          contactResult.status === "rejected" &&
          notificationResult.status === "rejected" &&
          dashboardOverviewResult.status === "rejected"
        ) {
          setError("Failed to load dashboard stats.")
        }
      } catch (err) {
        setError(err.message || "Failed to load dashboard stats.")
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [])

  const totalLeads = Number(leadStats?.totalLeads || 0)
  const todayLeads = Number(leadStats?.todayLeads || 0)
  const confirmed = Number(leadStats?.byStatus?.Confirmed || 0)
  const booked = Number(leadStats?.byStatus?.Booked || 0)
  const interested = Number(leadStats?.byStatus?.Interested || 0)
  const newLeads = Number(leadStats?.byStatus?.New || 0)
  const quoted = Number(leadStats?.byStatus?.Quoted || 0)
  const paymentPending = Number(leadStats?.byStatus?.["Payment Pending"] || 0)
  const awaitingDocuments = Number(
    leadStats?.byStatus?.["Awaiting Documents"] || 0
  )

  const todayFollowUps = Number(leadStats?.followUps?.today || 0)
  const overdueFollowUps = Number(leadStats?.followUps?.overdue || 0)
  const upcomingFollowUps = Number(leadStats?.followUps?.upcoming || 0)
  const noFollowUps = Number(leadStats?.followUps?.none || 0)

  const totalContactInquiries = getContactStatsValue(contactStats, [
    "totalInquiries",
    "total",
    "totalContactInquiries",
    "count",
  ])

  const newContactInquiries =
    getContactStatsValue(contactStats?.byStatus, ["New"]) ||
    getContactStatsValue(contactStats, ["newInquiries", "new", "todayNew"])

  const repliedContactInquiries =
    getContactStatsValue(contactStats?.byStatus, ["Replied"]) ||
    getContactStatsValue(contactStats, ["replied"])

  const closedContactInquiries =
    getContactStatsValue(contactStats?.byStatus, ["Closed"]) ||
    getContactStatsValue(contactStats, ["closed"])

  const conversionRate = totalLeads
    ? Math.round(((confirmed + booked) / totalLeads) * 100)
    : 0

  const activePipeline =
    newLeads + interested + quoted + paymentPending + awaitingDocuments

  const dueFollowUps = todayFollowUps + overdueFollowUps

  const topService = useMemo(() => {
    const entries = Object.entries(leadStats?.byServiceType || {})
    if (!entries.length) return null
    return entries.sort((a, b) => Number(b[1]) - Number(a[1]))[0]
  }, [leadStats])

  const serviceEntries = useMemo(() => {
    return Object.entries(leadStats?.byServiceType || {}).sort(
      (a, b) => Number(b[1]) - Number(a[1])
    )
  }, [leadStats])

  const sourceEntries = useMemo(() => {
    return Object.entries(marketingSourceStats || {})
      .filter(([, count]) => Number(count) > 0)
      .sort((a, b) => Number(b[1]) - Number(a[1]))
  }, [marketingSourceStats])

  if (loading) {
    return (
      <div style={{ fontFamily: UI_FONT }} className="space-y-5">
        <div>
          <div className="h-5 w-40 animate-pulse rounded bg-slate-200" />
          <div className="mt-2 h-3 w-64 animate-pulse rounded bg-slate-100" />
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div
              key={item}
              className="h-[86px] animate-pulse rounded-lg border border-slate-200 bg-white"
            />
          ))}
        </div>
        <div className="grid gap-5 xl:grid-cols-3">
          <div className="h-96 animate-pulse rounded-lg border border-slate-200 bg-white xl:col-span-2" />
          <div className="h-96 animate-pulse rounded-lg border border-slate-200 bg-white" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div
        style={{ fontFamily: UI_FONT }}
        className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-600"
      >
        {error}
      </div>
    )
  }

  return (
    <div style={{ fontFamily: UI_FONT }} className="space-y-5 text-slate-700">
      {/* Slim header */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">Dashboard</h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Overview of leads, pipeline, and follow-up activity.
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs text-slate-400">
          <span>
            Top service:{" "}
            <span className="font-semibold text-slate-600">
              {topService ? formatService(topService[0]) : "-"}
            </span>
          </span>
          {unreadNotifications > 0 ? (
            <Link
              to="/admin/notifications"
              className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 px-2.5 py-1.5 font-medium text-slate-600 hover:bg-slate-50"
            >
              <FaBell className="text-[11px] text-[#FF6B00]" />
              {unreadNotifications} unread
            </Link>
          ) : null}
        </div>
      </div>

      {/* KPI strip — one row, consolidated */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <Kpi
          label="Total Leads"
          value={totalLeads}
          hint="All captured inquiries"
          icon={<FaUsers />}
        />
        <Kpi
          label="Active Pipeline"
          value={activePipeline}
          hint="Open, working leads"
          icon={<FaLayerGroup />}
        />
        <Kpi
          label="Today"
          value={todayLeads}
          hint="New inquiries today"
          icon={<FaCalendarDay />}
        />
        <Kpi
          label="New to Contact"
          value={newLeads}
          hint="Awaiting first response"
          icon={<FaClock />}
          accent={newLeads > 0 ? "text-[#FF6B00]" : undefined}
        />
        <Kpi
          label="Follow-ups Due"
          value={dueFollowUps}
          hint={overdueFollowUps + " overdue"}
          icon={<FaUserClock />}
          accent={overdueFollowUps > 0 ? "text-red-600" : undefined}
        />
        <Kpi
          label="Conversion"
          value={conversionRate + "%"}
          hint="Confirmed / booked"
          icon={<FaPercentage />}
        />
      </div>

      {/* Main grid — balanced */}
      <div className="grid gap-5 xl:grid-cols-3">
        {/* Left: pipeline + services */}
        <div className="space-y-5 xl:col-span-2">
          <Panel title="Pipeline by stage" count={"Total " + totalLeads}>
            <div className="divide-y divide-slate-50">
              {pipelineStatuses.map((item) => {
                const count = Number(leadStats?.byStatus?.[item] || 0)
                return (
                  <PipelineRow
                    key={item}
                    label={item}
                    count={count}
                    percent={getPercent(count, totalLeads)}
                  />
                )
              })}
            </div>
          </Panel>

          <Panel title="Leads by service">
            {serviceEntries.length ? (
              <div className="divide-y divide-slate-50">
                {serviceEntries.map(([service, count]) => (
                  <ServiceRow
                    key={service}
                    service={service}
                    count={Number(count)}
                    percent={getPercent(count, totalLeads)}
                  />
                ))}
              </div>
            ) : (
              <p className="px-2 py-8 text-center text-sm text-slate-400">
                Service data appears after inquiries are received.
              </p>
            )}
          </Panel>

          <Panel title="Leads by source">
            {sourceEntries.length ? (
              <div className="divide-y divide-slate-50">
                {sourceEntries.map(([source, count]) => (
                  <SourceRow
                    key={source}
                    source={source}
                    count={Number(count)}
                    percent={getPercent(count, totalLeads)}
                  />
                ))}
              </div>
            ) : (
              <p className="px-2 py-8 text-center text-sm text-slate-400">
                Marketing source data appears after tracked inquiries are received.
              </p>
            )}
          </Panel>
        </div>

        {/* Right: needs attention + health */}
        <div className="space-y-5">
          <Panel title="Needs attention">
            <div className="divide-y divide-slate-50">
              <ActionRow
                to="/admin/leads?status=New"
                label="New leads to contact"
                count={newLeads}
                tone={newLeads > 0 ? "text-[#FF6B00]" : "text-slate-400"}
              />
              <ActionRow
                to="/admin/leads?followUp=overdue"
                label="Overdue follow-ups"
                count={overdueFollowUps}
                tone={overdueFollowUps > 0 ? "text-red-600" : "text-slate-400"}
              />
              <ActionRow
                to="/admin/leads?followUp=today"
                label="Today's follow-ups"
                count={todayFollowUps}
              />
              <ActionRow
                to="/admin/leads?followUp=upcoming"
                label="Upcoming follow-ups"
                count={upcomingFollowUps}
              />
              <ActionRow
                to="/admin/leads?followUp=none"
                label="No follow-up set"
                count={noFollowUps}
                tone={noFollowUps > 0 ? "text-amber-600" : "text-slate-400"}
              />
              <ActionRow
                to="/admin/contact-inquiries?status=New"
                label="New contact messages"
                count={newContactInquiries}
                tone={
                  newContactInquiries > 0 ? "text-[#00AEEF]" : "text-slate-400"
                }
              />
            </div>
          </Panel>

          <Panel title="Business snapshot">
            <div className="divide-y divide-slate-50">
              <HealthRow
                label="Conversion rate"
                value={conversionRate + "%"}
              />
              <HealthRow
                label="Scheduled follow-ups"
                value={todayFollowUps + upcomingFollowUps + overdueFollowUps}
              />
              <HealthRow
                label="Contact inbox"
                value={
                  totalContactInquiries +
                  " total · " +
                  repliedContactInquiries +
                  " replied · " +
                  closedContactInquiries +
                  " closed"
                }
              />
              <HealthRow
                label="Hot opportunities"
                value={interested + quoted + paymentPending}
              />
            </div>
          </Panel>

          <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
            <FaCheckCircle className="shrink-0 text-slate-400" />
            <p className="text-xs text-slate-500">
              Set a follow-up after every call or WhatsApp so no lead goes cold.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboardPage