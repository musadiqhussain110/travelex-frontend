import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import {
  FaArrowDown,
  FaArrowRight,
  FaArrowUp,
  FaCalendarAlt,
  FaChartLine,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaFilter,
  FaPhoneAlt,
  FaSyncAlt,
  FaTable,
  FaTimesCircle,
  FaUserClock,
  FaUsers,
} from "react-icons/fa"

import { adminApi } from "../../services/api"
import { useAdminAuth } from "../../context/AdminAuthContext"

const rangeOptions = [
  { label: "7 Days", value: 7 },
  { label: "15 Days", value: 15 },
  { label: "30 Days", value: 30 },
  { label: "60 Days", value: 60 },
  { label: "90 Days", value: 90 },
]

const serviceBadgeClass = {
  umrah: "bg-orange-50 text-[#FF6B00]",
  tour: "bg-sky-50 text-[#00AEEF]",
  visa: "bg-purple-50 text-purple-700",
  ticket: "bg-emerald-50 text-emerald-700",
  hotel: "bg-amber-50 text-amber-700",
  carRental: "bg-indigo-50 text-indigo-700",
  general: "bg-slate-100 text-slate-700",
  contact: "bg-blue-50 text-blue-700",
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

const formatNumber = (value) => {
  return Number(value || 0).toLocaleString()
}

const formatPercent = (value) => {
  return `${Number(value || 0).toFixed(1)}%`
}

const formatDate = (date) => {
  if (!date) return "-"
  return new Date(date).toLocaleDateString()
}

const formatDateTime = (date) => {
  if (!date) return "-"
  return new Date(date).toLocaleString()
}

const getServicePath = (serviceType = "") => {
  return servicePaths[serviceType] || "/admin/leads"
}

const getServiceBadgeClass = (serviceType = "") => {
  return serviceBadgeClass[serviceType] || "bg-slate-100 text-slate-700"
}

const getChangeTone = (value) => {
  if (value > 0) return "positive"
  if (value < 0) return "negative"
  return "neutral"
}

const getFollowUpHealthTone = (rate) => {
  if (rate >= 50) return "red"
  if (rate >= 25) return "orange"
  return "green"
}

const ChangePill = ({ value, reverse = false }) => {
  const number = Number(value || 0)
  const tone = getChangeTone(number)

  const isPositiveGood = reverse ? number < 0 : number > 0
  const isNegativeBad = reverse ? number > 0 : number < 0

  const className = isPositiveGood
    ? "bg-emerald-50 text-emerald-700"
    : isNegativeBad
      ? "bg-red-50 text-red-700"
      : "bg-slate-100 text-slate-600"

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-[5px] px-2 py-1 font-poppins text-[11px] font-bold ${className}`}
    >
      {tone === "positive" && <FaArrowUp className="text-[10px]" />}
      {tone === "negative" && <FaArrowDown className="text-[10px]" />}
      {number > 0 ? "+" : ""}
      {number.toFixed(1)}%
    </span>
  )
}

const InsightCard = ({
  icon,
  label,
  value,
  subText,
  tone = "blue",
  change,
  reverseChange = false,
}) => {
  const toneClass = {
    blue: "bg-sky-50 text-[#00AEEF]",
    orange: "bg-orange-50 text-[#FF6B00]",
    green: "bg-emerald-50 text-emerald-700",
    red: "bg-red-50 text-red-700",
    slate: "bg-slate-100 text-slate-700",
    purple: "bg-purple-50 text-purple-700",
  }

  return (
    <div className="rounded-[5px] border border-slate-100 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-[5px] ${
            toneClass[tone] || toneClass.blue
          }`}
        >
          {icon}
        </div>

        {change !== undefined && (
          <ChangePill value={change} reverse={reverseChange} />
        )}
      </div>

      <p className="mt-4 font-poppins text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">
        {label}
      </p>

      <p className="mt-1 font-fredoka text-[34px] font-semibold leading-none text-slate-950">
        {value}
      </p>

      {subText && (
        <p className="mt-2 font-poppins text-xs font-semibold leading-5 text-slate-500">
          {subText}
        </p>
      )}
    </div>
  )
}

const TimelineChart = ({ timeline = [] }) => {
  const chartData = timeline || []
  const hasData = chartData.some((item) => item.totalLeads > 0)

  const width = 900
  const height = 260
  const padding = 36

  const maxLeads = Math.max(
    ...chartData.map((item) => Number(item.totalLeads || 0)),
    1
  )

  const maxRate = Math.max(
    ...chartData.map((item) => Number(item.conversionRate || 0)),
    10
  )

  const getX = (index) => {
    if (chartData.length <= 1) return padding
    return padding + (index / (chartData.length - 1)) * (width - padding * 2)
  }

  const getLeadBarHeight = (value) => {
    return (Number(value || 0) / maxLeads) * 140
  }

  const getRateY = (value) => {
    const safeValue = Number(value || 0)
    return height - padding - (safeValue / maxRate) * 150
  }

  const linePoints = chartData
    .map((item, index) => `${getX(index)},${getRateY(item.conversionRate)}`)
    .join(" ")

  if (!hasData) {
    return (
      <div className="rounded-[5px] border border-slate-100 bg-[#F8FAFC] p-8 text-center">
        <FaChartLine className="mx-auto text-2xl text-slate-300" />
        <p className="mt-3 font-poppins text-sm font-semibold text-slate-500">
          No timeline data available for this range.
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-[5px] border border-slate-100 bg-[#F8FAFC]">
      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="min-w-[760px]"
          role="img"
          aria-label="Business conversion timeline"
        >
          <line
            x1={padding}
            y1={height - padding}
            x2={width - padding}
            y2={height - padding}
            stroke="#CBD5E1"
            strokeWidth="1"
          />

          {[25, 50, 75, 100].map((item) => (
            <line
              key={item}
              x1={padding}
              y1={height - padding - (item / 100) * 150}
              x2={width - padding}
              y2={height - padding - (item / 100) * 150}
              stroke="#E2E8F0"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
          ))}

          {chartData.map((item, index) => {
            const x = getX(index)
            const barHeight = getLeadBarHeight(item.totalLeads)
            const convertedHeight = getLeadBarHeight(item.convertedLeads)

            return (
              <g key={item.date}>
                <rect
                  x={x - 7}
                  y={height - padding - barHeight}
                  width="14"
                  height={barHeight}
                  rx="3"
                  fill="#00AEEF"
                  opacity="0.25"
                />

                <rect
                  x={x - 7}
                  y={height - padding - convertedHeight}
                  width="14"
                  height={convertedHeight}
                  rx="3"
                  fill="#FF6B00"
                  opacity="0.9"
                />

                {index % Math.ceil(chartData.length / 8 || 1) === 0 && (
                  <text
                    x={x}
                    y={height - 10}
                    textAnchor="middle"
                    fontSize="10"
                    fill="#64748B"
                  >
                    {item.date?.slice(5)}
                  </text>
                )}
              </g>
            )
          })}

          <polyline
            points={linePoints}
            fill="none"
            stroke="#0F172A"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {chartData.map((item, index) => (
            <circle
              key={`${item.date}-dot`}
              cx={getX(index)}
              cy={getRateY(item.conversionRate)}
              r="4"
              fill="#0F172A"
            />
          ))}
        </svg>
      </div>

      <div className="flex flex-wrap gap-3 border-t border-slate-100 bg-white px-4 py-3">
        <span className="inline-flex items-center gap-2 font-poppins text-xs font-bold text-slate-500">
          <span className="h-3 w-3 rounded-[3px] bg-[#00AEEF]/25" />
          Total Leads
        </span>

        <span className="inline-flex items-center gap-2 font-poppins text-xs font-bold text-slate-500">
          <span className="h-3 w-3 rounded-[3px] bg-[#FF6B00]" />
          Converted Leads
        </span>

        <span className="inline-flex items-center gap-2 font-poppins text-xs font-bold text-slate-500">
          <span className="h-1 w-6 rounded-full bg-slate-950" />
          Conversion Rate Trend
        </span>
      </div>
    </div>
  )
}

const ServicePerformanceCard = ({ item }) => {
  const followUpTone = getFollowUpHealthTone(item.noFollowUpRate)

  const followUpClass = {
    green: "bg-emerald-50 text-emerald-700",
    orange: "bg-orange-50 text-[#FF6B00]",
    red: "bg-red-50 text-red-700",
  }

  return (
    <article className="rounded-[5px] border border-slate-100 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link
            to={getServicePath(item.serviceType)}
            className={`inline-flex rounded-[5px] px-2.5 py-1 font-poppins text-[10px] font-bold uppercase ${getServiceBadgeClass(
              item.serviceType
            )}`}
          >
            {item.serviceLabel || item.serviceType || "General"}
          </Link>

          <h3 className="mt-3 font-fredoka text-[28px] font-semibold leading-none text-slate-950">
            {formatPercent(item.conversionRate)}
          </h3>

          <p className="mt-1 font-poppins text-xs font-semibold text-slate-500">
            Conversion rate
          </p>
        </div>

        <Link
          to={getServicePath(item.serviceType)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-[5px] bg-slate-950 text-white transition hover:bg-[#FF6B00]"
          title="View leads"
        >
          <FaArrowRight className="text-xs" />
        </Link>
      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#00AEEF] to-[#FF6B00]"
          style={{
            width: `${Math.min(Number(item.conversionRate || 0), 100)}%`,
          }}
        />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="rounded-[5px] bg-[#F8FAFC] p-3">
          <p className="font-poppins text-[10px] font-bold uppercase text-slate-400">
            Leads
          </p>
          <p className="font-fredoka text-[24px] font-semibold text-slate-950">
            {formatNumber(item.totalLeads)}
          </p>
        </div>

        <div className="rounded-[5px] bg-emerald-50 p-3">
          <p className="font-poppins text-[10px] font-bold uppercase text-emerald-600">
            Converted
          </p>
          <p className="font-fredoka text-[24px] font-semibold text-emerald-700">
            {formatNumber(item.convertedLeads)}
          </p>
        </div>

        <div className="rounded-[5px] bg-red-50 p-3">
          <p className="font-poppins text-[10px] font-bold uppercase text-red-500">
            Lost
          </p>
          <p className="font-fredoka text-[24px] font-semibold text-red-700">
            {formatNumber(item.lostLeads)}
          </p>
        </div>

        <div className={`rounded-[5px] p-3 ${followUpClass[followUpTone]}`}>
          <p className="font-poppins text-[10px] font-bold uppercase">
            No Follow-up
          </p>
          <p className="font-fredoka text-[24px] font-semibold">
            {formatNumber(item.noFollowUpLeads)}
          </p>
        </div>
      </div>
    </article>
  )
}

const MiniLeadList = ({ title, icon, leads = [], emptyText, type = "normal" }) => {
  return (
    <div className="rounded-[5px] border border-slate-100 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-[5px] ${
            type === "warning"
              ? "bg-orange-50 text-[#FF6B00]"
              : type === "danger"
                ? "bg-red-50 text-red-700"
                : "bg-emerald-50 text-emerald-700"
          }`}
        >
          {icon}
        </div>

        <div>
          <h2 className="font-fredoka text-[24px] font-semibold text-slate-950">
            {title}
          </h2>

          <p className="font-poppins text-xs font-semibold text-slate-500">
            {formatNumber(leads.length)} records shown
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-2">
        {leads.length === 0 ? (
          <div className="rounded-[5px] bg-[#F8FAFC] p-5 text-center">
            <p className="font-poppins text-sm font-semibold text-slate-500">
              {emptyText}
            </p>
          </div>
        ) : (
          leads.map((lead) => (
            <Link
              key={lead._id}
              to={`/admin/leads/${lead._id}`}
              className="rounded-[5px] border border-slate-100 bg-[#F8FAFC] p-3 transition hover:border-[#00AEEF] hover:bg-white"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-poppins text-sm font-bold text-slate-950">
                  {lead.name || "Unnamed Customer"}
                </p>

                <span
                  className={`rounded-[5px] px-2 py-1 font-poppins text-[10px] font-bold uppercase ${getServiceBadgeClass(
                    lead.serviceType
                  )}`}
                >
                  {lead.serviceType || "General"}
                </span>
              </div>

              <div className="mt-2 flex flex-wrap gap-3 font-poppins text-xs font-semibold text-slate-500">
                {lead.phone && (
                  <span className="inline-flex items-center gap-1">
                    <FaPhoneAlt className="text-[#00AEEF]" />
                    {lead.phone}
                  </span>
                )}

                {lead.status && <span>Status: {lead.status}</span>}

                {lead.followUpDate && (
                  <span>Follow-up: {formatDate(lead.followUpDate)}</span>
                )}

                {lead.createdAt && <span>Created: {formatDate(lead.createdAt)}</span>}
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}

const AdminBusinessInsightsPage = () => {
  const { admin } = useAdminAuth()

  const canViewDashboard =
    admin?.role === "superAdmin" ||
    Boolean(admin?.permissions?.dashboard?.view)

  const [days, setDays] = useState(30)
  const [insights, setInsights] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const summary = insights?.summary || {}
  const comparison = insights?.comparison || {}
  const changes = comparison?.changes || {}
  const timeline = insights?.timeline || []
  const servicePerformance = insights?.servicePerformance || []
  const highlights = insights?.highlights || {}
  const followUps = insights?.followUps || {}
  const recentConvertedLeads = insights?.recentConvertedLeads || []

  const topServices = useMemo(() => {
    return [...servicePerformance]
      .sort((a, b) => Number(b.convertedLeads || 0) - Number(a.convertedLeads || 0))
      .slice(0, 6)
  }, [servicePerformance])

  const loadInsights = async (selectedDays = days) => {
    if (!canViewDashboard) {
      setLoading(false)
      return
    }

    setLoading(true)
    setError("")

    try {
      const data = await adminApi.getBusinessInsights({ days: selectedDays })
      setInsights(data.insights || null)
    } catch (err) {
      setError(err.message || "Failed to load business insights.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadInsights(days)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [days, canViewDashboard])

  const handleRangeChange = (value) => {
    setDays(value)
  }

  if (!canViewDashboard) {
    return (
      <div className="rounded-[5px] border border-red-100 bg-red-50 p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[5px] bg-white text-red-600">
          <FaChartLine />
        </div>

        <h1 className="mt-5 font-fredoka text-[32px] font-semibold text-slate-950">
          Access Restricted
        </h1>

        <p className="mx-auto mt-2 max-w-xl font-poppins text-sm font-semibold leading-7 text-red-600">
          You do not have permission to view business insights.
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
              Business Analytics
            </p>

            <h1 className="mt-1 font-fredoka text-[32px] font-semibold leading-tight text-slate-950 sm:text-[40px]">
              Business Insights
            </h1>

            <p className="mt-1 max-w-3xl font-poppins text-sm font-medium leading-6 text-slate-500">
              Track conversion rate, follow-up discipline, service performance,
              and timeline comparison for TravelEx CRM leads.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={() => loadInsights(days)}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-[5px] border border-slate-200 bg-white px-4 py-2.5 font-poppins text-sm font-semibold text-slate-700 transition hover:border-[#00AEEF] hover:text-[#00AEEF] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FaSyncAlt className={loading ? "animate-spin" : ""} />
              Refresh
            </button>

            <Link
              to="/admin/dashboard"
              className="inline-flex items-center justify-center gap-2 rounded-[5px] bg-[#FF6B00] px-4 py-2.5 font-poppins text-sm font-semibold text-white transition hover:bg-[#00AEEF]"
            >
              Dashboard
              <FaArrowRight className="text-xs" />
            </Link>
          </div>
        </div>
      </section>

      <section className="rounded-[5px] border border-slate-100 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-[5px] bg-sky-50 text-[#00AEEF]">
              <FaFilter />
            </div>

            <div>
              <h2 className="font-fredoka text-[24px] font-semibold text-slate-950">
                Timeline Range
              </h2>

              <p className="font-poppins text-xs font-semibold text-slate-500">
                Compare current {days} days with previous {days} days.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {rangeOptions.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => handleRangeChange(item.value)}
                className={`rounded-[5px] px-4 py-2 font-poppins text-xs font-bold transition ${
                  days === item.value
                    ? "bg-[#FF6B00] text-white"
                    : "bg-[#F8FAFC] text-slate-600 hover:bg-[#00AEEF] hover:text-white"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {error && (
        <div className="rounded-[5px] border border-red-100 bg-red-50 px-5 py-4 font-poppins text-sm font-semibold text-red-600">
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-40 animate-pulse rounded-[5px] bg-white shadow-sm"
            />
          ))}
        </div>
      ) : (
        <>
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <InsightCard
              icon={<FaUsers />}
              label="Total Leads"
              value={formatNumber(summary.totalLeads)}
              subText={`Current ${days} days`}
              tone="blue"
              change={changes.totalLeadsChange}
            />

            <InsightCard
              icon={<FaCheckCircle />}
              label="Converted Leads"
              value={formatNumber(summary.convertedLeads)}
              subText="Confirmed + Booked leads"
              tone="green"
              change={changes.convertedLeadsChange}
            />

            <InsightCard
              icon={<FaChartLine />}
              label="Conversion Rate"
              value={formatPercent(summary.conversionRate)}
              subText="Converted leads divided by total leads"
              tone="orange"
              change={changes.conversionRateChange}
            />

            <InsightCard
              icon={<FaUserClock />}
              label="No Follow-up"
              value={formatNumber(summary.noFollowUpLeads)}
              subText={`${formatPercent(summary.noFollowUpRate)} of total leads`}
              tone="red"
              change={changes.noFollowUpLeadsChange}
              reverseChange
            />
          </section>

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <InsightCard
              icon={<FaClock />}
              label="Scheduled Follow-ups"
              value={formatNumber(summary.scheduledFollowUps)}
              subText="Follow-ups currently scheduled"
              tone="purple"
            />

            <InsightCard
              icon={<FaExclamationTriangle />}
              label="Overdue Follow-ups"
              value={formatNumber(summary.overdueFollowUps)}
              subText="Scheduled follow-ups older than today"
              tone="red"
            />

            <InsightCard
              icon={<FaCalendarAlt />}
              label="Today Follow-ups"
              value={formatNumber(summary.todayFollowUps)}
              subText="Follow-ups due today"
              tone="blue"
            />

            <InsightCard
              icon={<FaTimesCircle />}
              label="Lost / Cancelled"
              value={formatNumber(summary.lostLeads)}
              subText={`${formatPercent(summary.lostRate)} lost rate`}
              tone="slate"
              change={changes.lostLeadsChange}
              reverseChange
            />
          </section>

          <section className="grid gap-5 xl:grid-cols-[1.4fr_0.6fr]">
            <div className="rounded-[5px] border border-slate-100 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="font-fredoka text-[28px] font-semibold text-slate-950">
                    Conversion Timeline
                  </h2>

                  <p className="font-poppins text-sm font-medium text-slate-500">
                    Daily leads, converted leads, and conversion rate trend.
                  </p>
                </div>

                <span className="rounded-[5px] bg-[#F8FAFC] px-3 py-2 font-poppins text-xs font-bold text-slate-500">
                  {formatDate(insights?.range?.from)} -{" "}
                  {formatDate(insights?.range?.to)}
                </span>
              </div>

              <div className="mt-5">
                <TimelineChart timeline={timeline} />
              </div>
            </div>

            <div className="rounded-[5px] border border-slate-100 bg-white p-5 shadow-sm">
              <h2 className="font-fredoka text-[28px] font-semibold text-slate-950">
                Highlights
              </h2>

              <div className="mt-4 grid gap-3">
                <div className="rounded-[5px] bg-orange-50 p-4">
                  <p className="font-poppins text-[10px] font-bold uppercase tracking-[0.1em] text-[#FF6B00]">
                    Most Conversions
                  </p>

                  <p className="mt-1 font-fredoka text-[24px] font-semibold text-slate-950">
                    {highlights.bestServiceByConversions?.serviceLabel || "-"}
                  </p>

                  <p className="font-poppins text-xs font-semibold text-slate-500">
                    {formatNumber(
                      highlights.bestServiceByConversions?.convertedLeads
                    )}{" "}
                    conversions
                  </p>
                </div>

                <div className="rounded-[5px] bg-emerald-50 p-4">
                  <p className="font-poppins text-[10px] font-bold uppercase tracking-[0.1em] text-emerald-700">
                    Best Conversion Rate
                  </p>

                  <p className="mt-1 font-fredoka text-[24px] font-semibold text-slate-950">
                    {highlights.bestServiceByRate?.serviceLabel || "-"}
                  </p>

                  <p className="font-poppins text-xs font-semibold text-slate-500">
                    {formatPercent(highlights.bestServiceByRate?.conversionRate)}
                  </p>
                </div>

                <div className="rounded-[5px] bg-red-50 p-4">
                  <p className="font-poppins text-[10px] font-bold uppercase tracking-[0.1em] text-red-700">
                    Weak Follow-up Area
                  </p>

                  <p className="mt-1 font-fredoka text-[24px] font-semibold text-slate-950">
                    {highlights.weakestFollowUpService?.serviceLabel || "-"}
                  </p>

                  <p className="font-poppins text-xs font-semibold text-slate-500">
                    {formatPercent(
                      highlights.weakestFollowUpService?.noFollowUpRate
                    )}{" "}
                    no follow-up rate
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-[5px] border border-slate-100 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-fredoka text-[28px] font-semibold text-slate-950">
                  Service Performance
                </h2>

                <p className="font-poppins text-sm font-medium text-slate-500">
                  See which services are converting well and which need more
                  follow-up.
                </p>
              </div>

              <Link
                to="/admin/leads"
                className="inline-flex items-center justify-center gap-2 rounded-[5px] bg-slate-950 px-4 py-2.5 font-poppins text-sm font-semibold text-white transition hover:bg-[#FF6B00]"
              >
                View All Leads
                <FaArrowRight className="text-xs" />
              </Link>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {topServices.length === 0 ? (
                <div className="rounded-[5px] border border-slate-100 bg-[#F8FAFC] p-8 text-center md:col-span-2 xl:col-span-3">
                  <FaTable className="mx-auto text-2xl text-slate-300" />
                  <p className="mt-3 font-poppins text-sm font-semibold text-slate-500">
                    No service performance data available.
                  </p>
                </div>
              ) : (
                topServices.map((item) => (
                  <ServicePerformanceCard
                    key={item.serviceType}
                    item={item}
                  />
                ))
              )}
            </div>
          </section>

          <section className="rounded-[5px] border border-slate-100 bg-white shadow-sm">
            <div className="border-b border-slate-100 p-5">
              <h2 className="font-fredoka text-[28px] font-semibold text-slate-950">
                Service Health Table
              </h2>

              <p className="font-poppins text-sm font-medium text-slate-500">
                Detailed service comparison for leads, conversions, losses, and
                follow-up gaps.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[980px] border-collapse">
                <thead className="bg-[#F8FAFC]">
                  <tr>
                    <th className="px-4 py-3 text-left font-poppins text-[10px] font-bold uppercase tracking-[0.08em] text-slate-400">
                      Service
                    </th>
                    <th className="px-4 py-3 text-left font-poppins text-[10px] font-bold uppercase tracking-[0.08em] text-slate-400">
                      Leads
                    </th>
                    <th className="px-4 py-3 text-left font-poppins text-[10px] font-bold uppercase tracking-[0.08em] text-slate-400">
                      Converted
                    </th>
                    <th className="px-4 py-3 text-left font-poppins text-[10px] font-bold uppercase tracking-[0.08em] text-slate-400">
                      Conversion Rate
                    </th>
                    <th className="px-4 py-3 text-left font-poppins text-[10px] font-bold uppercase tracking-[0.08em] text-slate-400">
                      Lost
                    </th>
                    <th className="px-4 py-3 text-left font-poppins text-[10px] font-bold uppercase tracking-[0.08em] text-slate-400">
                      Scheduled Follow-ups
                    </th>
                    <th className="px-4 py-3 text-left font-poppins text-[10px] font-bold uppercase tracking-[0.08em] text-slate-400">
                      No Follow-up
                    </th>
                    <th className="px-4 py-3 text-right font-poppins text-[10px] font-bold uppercase tracking-[0.08em] text-slate-400">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {servicePerformance.map((item) => (
                    <tr
                      key={item.serviceType}
                      className="border-t border-slate-100 transition hover:bg-[#F8FAFC]"
                    >
                      <td className="px-4 py-4">
                        <span
                          className={`rounded-[5px] px-2.5 py-1 font-poppins text-[10px] font-bold uppercase ${getServiceBadgeClass(
                            item.serviceType
                          )}`}
                        >
                          {item.serviceLabel}
                        </span>
                      </td>

                      <td className="px-4 py-4 font-poppins text-sm font-bold text-slate-700">
                        {formatNumber(item.totalLeads)}
                      </td>

                      <td className="px-4 py-4 font-poppins text-sm font-bold text-emerald-700">
                        {formatNumber(item.convertedLeads)}
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-100">
                            <div
                              className="h-full rounded-full bg-[#FF6B00]"
                              style={{
                                width: `${Math.min(
                                  Number(item.conversionRate || 0),
                                  100
                                )}%`,
                              }}
                            />
                          </div>

                          <span className="font-poppins text-sm font-bold text-slate-700">
                            {formatPercent(item.conversionRate)}
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-4 font-poppins text-sm font-bold text-red-700">
                        {formatNumber(item.lostLeads)}
                      </td>

                      <td className="px-4 py-4 font-poppins text-sm font-bold text-[#00AEEF]">
                        {formatNumber(item.scheduledFollowUps)}
                      </td>

                      <td className="px-4 py-4 font-poppins text-sm font-bold text-[#FF6B00]">
                        {formatNumber(item.noFollowUpLeads)}
                      </td>

                      <td className="px-4 py-4 text-right">
                        <Link
                          to={getServicePath(item.serviceType)}
                          className="inline-flex items-center justify-center gap-2 rounded-[5px] bg-slate-950 px-3 py-2 font-poppins text-xs font-bold text-white transition hover:bg-[#FF6B00]"
                        >
                          View Leads
                          <FaArrowRight className="text-[10px]" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="grid gap-5 xl:grid-cols-3">
            <MiniLeadList
              title="Recent Conversions"
              icon={<FaCheckCircle />}
              leads={recentConvertedLeads}
              emptyText="No converted leads found for this range."
            />

            <MiniLeadList
              title="No Follow-up Leads"
              icon={<FaUserClock />}
              leads={followUps.noFollowUpLeads || []}
              emptyText="Great. No missing follow-ups found."
              type="warning"
            />

            <MiniLeadList
              title="Overdue Follow-ups"
              icon={<FaExclamationTriangle />}
              leads={followUps.overdueFollowUps || []}
              emptyText="No overdue follow-ups found."
              type="danger"
            />
          </section>
        </>
      )}
    </div>
  )
}

export default AdminBusinessInsightsPage