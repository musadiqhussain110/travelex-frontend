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
  { label: "7D", value: 7 },
  { label: "15D", value: 15 },
  { label: "30D", value: 30 },
  { label: "60D", value: 60 },
  { label: "90D", value: 90 },
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

const getServicePath = (serviceType = "") => {
  return servicePaths[serviceType] || "/admin/leads"
}

const getServiceBadgeClass = (serviceType = "") => {
  return serviceBadgeClass[serviceType] || "bg-slate-100 text-slate-700"
}

const getChangeTone = (value, reverse = false) => {
  const number = Number(value || 0)

  if (number === 0) return "neutral"

  if (reverse) {
    return number < 0 ? "positive" : "negative"
  }

  return number > 0 ? "positive" : "negative"
}

const getFollowUpHealthTone = (rate) => {
  if (rate >= 50) return "red"
  if (rate >= 25) return "orange"
  return "green"
}

const getRangeLabel = (days) => {
  return `${days} days`
}

const getShortDateLabel = (date) => {
  if (!date) return "-"
  const parsed = new Date(date)
  return parsed.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  })
}

const groupTimelineData = (timeline = [], maxBuckets = 10) => {
  if (!timeline.length) return []

  if (timeline.length <= maxBuckets) {
    return timeline.map((item) => ({
      label: getShortDateLabel(item.date),
      totalLeads: Number(item.totalLeads || 0),
      convertedLeads: Number(item.convertedLeads || 0),
      lostLeads: Number(item.lostLeads || 0),
      noFollowUpLeads: Number(item.noFollowUpLeads || 0),
      conversionRate: Number(item.conversionRate || 0),
    }))
  }

  const bucketSize = Math.ceil(timeline.length / maxBuckets)
  const buckets = []

  for (let index = 0; index < timeline.length; index += bucketSize) {
    const chunk = timeline.slice(index, index + bucketSize)
    const first = chunk[0]
    const last = chunk[chunk.length - 1]

    const totalLeads = chunk.reduce(
      (sum, item) => sum + Number(item.totalLeads || 0),
      0
    )
    const convertedLeads = chunk.reduce(
      (sum, item) => sum + Number(item.convertedLeads || 0),
      0
    )
    const lostLeads = chunk.reduce(
      (sum, item) => sum + Number(item.lostLeads || 0),
      0
    )
    const noFollowUpLeads = chunk.reduce(
      (sum, item) => sum + Number(item.noFollowUpLeads || 0),
      0
    )

    buckets.push({
      label:
        first?.date === last?.date
          ? getShortDateLabel(first?.date)
          : `${getShortDateLabel(first?.date)} - ${getShortDateLabel(
              last?.date
            )}`,
      totalLeads,
      convertedLeads,
      lostLeads,
      noFollowUpLeads,
      conversionRate: totalLeads
        ? Number(((convertedLeads / totalLeads) * 100).toFixed(1))
        : 0,
    })
  }

  return buckets
}

const ChangePill = ({ value, reverse = false }) => {
  const number = Number(value || 0)
  const tone = getChangeTone(number, reverse)

  const className =
    tone === "positive"
      ? "bg-emerald-50 text-emerald-700"
      : tone === "negative"
        ? "bg-red-50 text-red-700"
        : "bg-slate-100 text-slate-600"

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-[5px] px-2 py-1 font-poppins text-[11px] font-bold ${className}`}
    >
      {number > 0 && <FaArrowUp className="text-[10px]" />}
      {number < 0 && <FaArrowDown className="text-[10px]" />}
      {number > 0 ? "+" : ""}
      {number.toFixed(1)}%
    </span>
  )
}

const HeroMetric = ({ label, value, subText, tone = "orange", change, reverse }) => {
  const toneClass = {
    orange: "bg-orange-50 text-[#FF6B00]",
    blue: "bg-sky-50 text-[#00AEEF]",
    green: "bg-emerald-50 text-emerald-700",
    red: "bg-red-50 text-red-700",
    slate: "bg-slate-100 text-slate-700",
  }

  return (
    <div className="rounded-[5px] border border-white/20 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <p className="font-poppins text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">
          {label}
        </p>

        {change !== undefined && <ChangePill value={change} reverse={reverse} />}
      </div>

      <p className="mt-2 font-fredoka text-[36px] font-semibold leading-none text-slate-950">
        {value}
      </p>

      <p
        className={`mt-3 inline-flex rounded-[5px] px-2 py-1 font-poppins text-xs font-bold ${
          toneClass[tone] || toneClass.orange
        }`}
      >
        {subText}
      </p>
    </div>
  )
}

const MetricCard = ({
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

const AttentionCard = ({ title, value, description, tone = "orange", link }) => {
  const toneClass = {
    orange: "bg-orange-50 text-[#FF6B00]",
    blue: "bg-sky-50 text-[#00AEEF]",
    green: "bg-emerald-50 text-emerald-700",
    red: "bg-red-50 text-red-700",
  }

  return (
    <div className="rounded-[5px] border border-slate-100 bg-white p-5 shadow-sm">
      <p
        className={`inline-flex rounded-[5px] px-2.5 py-1 font-poppins text-[10px] font-bold uppercase tracking-[0.08em] ${
          toneClass[tone] || toneClass.orange
        }`}
      >
        {title}
      </p>

      <p className="mt-3 font-fredoka text-[30px] font-semibold leading-none text-slate-950">
        {value || "-"}
      </p>

      <p className="mt-2 font-poppins text-xs font-semibold leading-5 text-slate-500">
        {description}
      </p>

      {link && (
        <Link
          to={link}
          className="mt-4 inline-flex items-center gap-2 font-poppins text-xs font-bold text-[#FF6B00] transition hover:text-[#00AEEF]"
        >
          View related leads
          <FaArrowRight className="text-[10px]" />
        </Link>
      )}
    </div>
  )
}

const TimelineSummary = ({ timeline = [] }) => {
  const buckets = groupTimelineData(timeline, 10)
  const maxLeads = Math.max(
    ...buckets.map((item) => Number(item.totalLeads || 0)),
    1
  )

  const activeBuckets = buckets.filter((item) => item.totalLeads > 0)
  const hasData = activeBuckets.length > 0

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
    <div className="grid gap-3">
      {buckets.map((item) => {
        const totalWidth = Math.max(
          (Number(item.totalLeads || 0) / maxLeads) * 100,
          item.totalLeads ? 8 : 0
        )
        const convertedWidth = item.totalLeads
          ? Math.max((Number(item.convertedLeads || 0) / item.totalLeads) * 100, 0)
          : 0

        return (
          <div
            key={item.label}
            className="rounded-[5px] border border-slate-100 bg-white p-3"
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-[140px]">
                <p className="font-poppins text-xs font-bold text-slate-700">
                  {item.label}
                </p>

                <p className="font-poppins text-[11px] font-semibold text-slate-400">
                  {formatPercent(item.conversionRate)} conversion
                </p>
              </div>

              <div className="flex-1">
                <div className="h-9 overflow-hidden rounded-[5px] bg-[#F8FAFC]">
                  <div
                    className="relative h-full rounded-[5px] bg-sky-100"
                    style={{ width: `${totalWidth}%` }}
                  >
                    <div
                      className="absolute left-0 top-0 h-full rounded-[5px] bg-[#FF6B00]"
                      style={{ width: `${convertedWidth}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex min-w-[180px] justify-between gap-3 font-poppins text-xs font-bold">
                <span className="text-[#00AEEF]">
                  {formatNumber(item.totalLeads)} leads
                </span>

                <span className="text-[#FF6B00]">
                  {formatNumber(item.convertedLeads)} converted
                </span>
              </div>
            </div>
          </div>
        )
      })}

      <div className="flex flex-wrap gap-3 rounded-[5px] bg-[#F8FAFC] px-4 py-3">
        <span className="inline-flex items-center gap-2 font-poppins text-xs font-bold text-slate-500">
          <span className="h-3 w-3 rounded-[3px] bg-sky-100" />
          Total leads
        </span>

        <span className="inline-flex items-center gap-2 font-poppins text-xs font-bold text-slate-500">
          <span className="h-3 w-3 rounded-[3px] bg-[#FF6B00]" />
          Converted inside total
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

          <h3 className="mt-3 font-fredoka text-[30px] font-semibold leading-none text-slate-950">
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
      .sort(
        (a, b) =>
          Number(b.convertedLeads || 0) - Number(a.convertedLeads || 0)
      )
      .slice(0, 6)
  }, [servicePerformance])

  const focusMessage = useMemo(() => {
    if (summary.overdueFollowUps > 0) {
      return {
        title: "Follow-up risk",
        message: `${formatNumber(
          summary.overdueFollowUps
        )} overdue follow-ups need attention today.`,
        tone: "red",
      }
    }

    if (summary.noFollowUpLeads > 0) {
      return {
        title: "Missing follow-ups",
        message: `${formatNumber(
          summary.noFollowUpLeads
        )} leads still have no follow-up assigned.`,
        tone: "orange",
      }
    }

    return {
      title: "CRM health looks good",
      message: "No urgent follow-up gap found in this selected range.",
      tone: "green",
    }
  }, [summary.noFollowUpLeads, summary.overdueFollowUps])

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
      <section className="overflow-hidden rounded-[5px] border border-slate-100 bg-white shadow-sm">
        <div className="grid gap-5 p-5 xl:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="font-poppins text-[10px] font-bold uppercase tracking-[0.1em] text-[#00AEEF] sm:text-xs">
              Business Analytics
            </p>

            <h1 className="mt-1 font-fredoka text-[34px] font-semibold leading-tight text-slate-950 sm:text-[44px]">
              Business Insights
            </h1>

            <p className="mt-2 max-w-3xl font-poppins text-sm font-medium leading-6 text-slate-500">
              A clear view of conversion rate, follow-up gaps, and service-wise
              CRM performance for TravelEx leads.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {rangeOptions.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => handleRangeChange(item.value)}
                  className={`rounded-[5px] px-4 py-2 font-poppins text-xs font-bold transition ${
                    days === item.value
                      ? "bg-[#FF6B00] text-white shadow-[0_12px_24px_rgba(255,107,0,0.18)]"
                      : "bg-[#F8FAFC] text-slate-600 hover:bg-[#00AEEF] hover:text-white"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div
            className={`rounded-[5px] p-5 ${
              focusMessage.tone === "red"
                ? "bg-red-50"
                : focusMessage.tone === "orange"
                  ? "bg-orange-50"
                  : "bg-emerald-50"
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p
                  className={`font-poppins text-[10px] font-bold uppercase tracking-[0.1em] ${
                    focusMessage.tone === "red"
                      ? "text-red-700"
                      : focusMessage.tone === "orange"
                        ? "text-[#FF6B00]"
                        : "text-emerald-700"
                  }`}
                >
                  What needs attention
                </p>

                <h2 className="mt-2 font-fredoka text-[30px] font-semibold leading-tight text-slate-950">
                  {focusMessage.title}
                </h2>

                <p className="mt-2 font-poppins text-sm font-semibold leading-6 text-slate-600">
                  {focusMessage.message}
                </p>
              </div>

              <button
                type="button"
                onClick={() => loadInsights(days)}
                disabled={loading}
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[5px] bg-white text-slate-700 transition hover:text-[#FF6B00] disabled:opacity-50"
                title="Refresh"
              >
                <FaSyncAlt className={loading ? "animate-spin" : ""} />
              </button>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-[5px] bg-white p-3">
                <p className="font-poppins text-[10px] font-bold uppercase text-slate-400">
                  Range
                </p>
                <p className="mt-1 font-fredoka text-[22px] font-semibold text-slate-950">
                  {getRangeLabel(days)}
                </p>
              </div>

              <div className="rounded-[5px] bg-white p-3">
                <p className="font-poppins text-[10px] font-bold uppercase text-slate-400">
                  Date
                </p>
                <p className="mt-1 font-fredoka text-[22px] font-semibold text-slate-950">
                  {formatDate(insights?.range?.from)} -{" "}
                  {formatDate(insights?.range?.to)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {!loading && (
          <div className="grid gap-4 border-t border-slate-100 bg-[#F8FAFC] p-5 md:grid-cols-2 xl:grid-cols-4">
            <HeroMetric
              label="Conversion Rate"
              value={formatPercent(summary.conversionRate)}
              subText="Confirmed + Booked"
              tone="orange"
              change={changes.conversionRateChange}
            />

            <HeroMetric
              label="Converted Leads"
              value={formatNumber(summary.convertedLeads)}
              subText={`${formatNumber(summary.totalLeads)} total leads`}
              tone="green"
              change={changes.convertedLeadsChange}
            />

            <HeroMetric
              label="No Follow-up"
              value={formatNumber(summary.noFollowUpLeads)}
              subText={`${formatPercent(summary.noFollowUpRate)} missing`}
              tone="red"
              change={changes.noFollowUpLeadsChange}
              reverse
            />

            <HeroMetric
              label="Overdue Follow-ups"
              value={formatNumber(summary.overdueFollowUps)}
              subText={`${formatNumber(summary.todayFollowUps)} due today`}
              tone="blue"
            />
          </div>
        )}
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
            <MetricCard
              icon={<FaUsers />}
              label="Total Leads"
              value={formatNumber(summary.totalLeads)}
              subText={`Current ${days} days`}
              tone="blue"
              change={changes.totalLeadsChange}
            />

            <MetricCard
              icon={<FaClock />}
              label="Scheduled Follow-ups"
              value={formatNumber(summary.scheduledFollowUps)}
              subText="Follow-ups currently planned"
              tone="purple"
            />

            <MetricCard
              icon={<FaExclamationTriangle />}
              label="Overdue Follow-ups"
              value={formatNumber(summary.overdueFollowUps)}
              subText="Needs immediate action"
              tone="red"
            />

            <MetricCard
              icon={<FaTimesCircle />}
              label="Lost / Cancelled"
              value={formatNumber(summary.lostLeads)}
              subText={`${formatPercent(summary.lostRate)} lost rate`}
              tone="slate"
              change={changes.lostLeadsChange}
              reverseChange
            />
          </section>

          <section className="grid gap-5 xl:grid-cols-3">
            <AttentionCard
              title="Most Conversions"
              value={highlights.bestServiceByConversions?.serviceLabel}
              description={`${formatNumber(
                highlights.bestServiceByConversions?.convertedLeads
              )} converted leads in selected range.`}
              tone="orange"
              link={getServicePath(
                highlights.bestServiceByConversions?.serviceType
              )}
            />

            <AttentionCard
              title="Best Conversion Rate"
              value={highlights.bestServiceByRate?.serviceLabel}
              description={`${formatPercent(
                highlights.bestServiceByRate?.conversionRate
              )} conversion rate based on current range.`}
              tone="green"
              link={getServicePath(highlights.bestServiceByRate?.serviceType)}
            />

            <AttentionCard
              title="Weak Follow-up Area"
              value={highlights.weakestFollowUpService?.serviceLabel}
              description={`${formatPercent(
                highlights.weakestFollowUpService?.noFollowUpRate
              )} leads have no follow-up assigned.`}
              tone="red"
              link={getServicePath(
                highlights.weakestFollowUpService?.serviceType
              )}
            />
          </section>

          <section className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-[5px] border border-slate-100 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="font-fredoka text-[30px] font-semibold text-slate-950">
                    Timeline Summary
                  </h2>

                  <p className="font-poppins text-sm font-medium text-slate-500">
                    Clean range-wise comparison of total leads and conversions.
                  </p>
                </div>

                <span className="rounded-[5px] bg-[#F8FAFC] px-3 py-2 font-poppins text-xs font-bold text-slate-500">
                  {formatDate(insights?.range?.from)} -{" "}
                  {formatDate(insights?.range?.to)}
                </span>
              </div>

              <div className="mt-5">
                <TimelineSummary timeline={timeline} />
              </div>
            </div>

            <div className="rounded-[5px] border border-slate-100 bg-white p-5 shadow-sm">
              <h2 className="font-fredoka text-[30px] font-semibold text-slate-950">
                Follow-up Discipline
              </h2>

              <p className="mt-1 font-poppins text-sm font-medium text-slate-500">
                This section shows whether leads are being handled properly.
              </p>

              <div className="mt-5 grid gap-3">
                <div className="rounded-[5px] bg-red-50 p-4">
                  <p className="font-poppins text-[10px] font-bold uppercase tracking-[0.1em] text-red-700">
                    No Follow-up
                  </p>

                  <div className="mt-2 flex items-end justify-between gap-3">
                    <p className="font-fredoka text-[36px] font-semibold leading-none text-slate-950">
                      {formatNumber(followUps.noFollowUpCount)}
                    </p>

                    <Link
                      to="/admin/leads?followUp=none"
                      className="font-poppins text-xs font-bold text-red-700 hover:text-[#FF6B00]"
                    >
                      View
                    </Link>
                  </div>
                </div>

                <div className="rounded-[5px] bg-orange-50 p-4">
                  <p className="font-poppins text-[10px] font-bold uppercase tracking-[0.1em] text-[#FF6B00]">
                    Overdue Follow-ups
                  </p>

                  <div className="mt-2 flex items-end justify-between gap-3">
                    <p className="font-fredoka text-[36px] font-semibold leading-none text-slate-950">
                      {formatNumber(followUps.overdueCount)}
                    </p>

                    <Link
                      to="/admin/leads?followUp=overdue"
                      className="font-poppins text-xs font-bold text-[#FF6B00] hover:text-[#00AEEF]"
                    >
                      View
                    </Link>
                  </div>
                </div>

                <div className="rounded-[5px] bg-sky-50 p-4">
                  <p className="font-poppins text-[10px] font-bold uppercase tracking-[0.1em] text-[#00AEEF]">
                    Today Follow-ups
                  </p>

                  <div className="mt-2 flex items-end justify-between gap-3">
                    <p className="font-fredoka text-[36px] font-semibold leading-none text-slate-950">
                      {formatNumber(followUps.todayCount)}
                    </p>

                    <Link
                      to="/admin/leads?followUp=today"
                      className="font-poppins text-xs font-bold text-[#00AEEF] hover:text-[#FF6B00]"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-[5px] border border-slate-100 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-fredoka text-[30px] font-semibold text-slate-950">
                  Service Performance
                </h2>

                <p className="font-poppins text-sm font-medium text-slate-500">
                  See which services are converting well and which need stronger
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
                  <ServicePerformanceCard key={item.serviceType} item={item} />
                ))
              )}
            </div>
          </section>

          <section className="rounded-[5px] border border-slate-100 bg-white shadow-sm">
            <div className="border-b border-slate-100 p-5">
              <h2 className="font-fredoka text-[30px] font-semibold text-slate-950">
                Service Health Table
              </h2>

              <p className="font-poppins text-sm font-medium text-slate-500">
                Detailed service comparison for conversions, losses, and
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
                      Scheduled
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