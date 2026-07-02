import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import {
  FaArrowDown,
  FaArrowRight,
  FaArrowUp,
  FaAward,
  FaCalendarAlt,
  FaChartLine,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaFilter,
  FaGlobeAsia,
  FaPhoneAlt,
  FaPlane,
  FaRocket,
  FaShieldAlt,
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

const getShortDateLabel = (date) => {
  if (!date) return "-"

  return new Date(date).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  })
}

const getBusinessGrade = (summary = {}) => {
  const conversionRate = Number(summary.conversionRate || 0)
  const noFollowUpRate = Number(summary.noFollowUpRate || 0)
  const overdueFollowUps = Number(summary.overdueFollowUps || 0)

  if (conversionRate >= 35 && noFollowUpRate <= 15 && overdueFollowUps === 0) {
    return {
      label: "Excellent",
      title: "Business flow is healthy",
      description:
        "Conversions are strong and follow-up discipline is under control.",
      className: "bg-emerald-50 text-emerald-700",
      icon: <FaAward />,
    }
  }

  if (conversionRate >= 20 && noFollowUpRate <= 35) {
    return {
      label: "Stable",
      title: "Performance is stable",
      description:
        "The business is moving, but follow-up improvement can increase conversion.",
      className: "bg-sky-50 text-[#00AEEF]",
      icon: <FaShieldAlt />,
    }
  }

  if (overdueFollowUps > 0 || noFollowUpRate > 35) {
    return {
      label: "Needs Attention",
      title: "Follow-up risk is affecting growth",
      description:
        "A high number of leads need follow-up action before they become cold.",
      className: "bg-orange-50 text-[#FF6B00]",
      icon: <FaExclamationTriangle />,
    }
  }

  return {
    label: "Developing",
    title: "Business activity is building",
    description:
      "More qualified leads and timely follow-ups are needed to improve conversion.",
    className: "bg-slate-100 text-slate-700",
    icon: <FaRocket />,
  }
}

const getInsightRecommendations = ({
  summary = {},
  highlights = {},
  servicePerformance = [],
}) => {
  const recommendations = []

  if (Number(summary.overdueFollowUps || 0) > 0) {
    recommendations.push({
      title: "Clear overdue follow-ups first",
      description: `${formatNumber(
        summary.overdueFollowUps
      )} scheduled follow-ups are overdue. These should be handled before new outreach.`,
      tone: "red",
      link: "/admin/leads?followUp=overdue",
    })
  }

  if (Number(summary.noFollowUpLeads || 0) > 0) {
    recommendations.push({
      title: "Assign follow-ups to open leads",
      description: `${formatNumber(
        summary.noFollowUpLeads
      )} leads have no follow-up plan. Assigning dates can improve team accountability.`,
      tone: "orange",
      link: "/admin/leads?followUp=none",
    })
  }

  if (highlights.bestServiceByConversions?.serviceLabel) {
    recommendations.push({
      title: `Scale ${highlights.bestServiceByConversions.serviceLabel}`,
      description: `${highlights.bestServiceByConversions.serviceLabel} is bringing the most conversions in this period. Give it more visibility in campaigns.`,
      tone: "blue",
      link: getServicePath(highlights.bestServiceByConversions.serviceType),
    })
  }

  const weakConversionService = [...servicePerformance]
    .filter((item) => Number(item.totalLeads || 0) >= 1)
    .sort(
      (a, b) => Number(a.conversionRate || 0) - Number(b.conversionRate || 0)
    )[0]

  if (weakConversionService?.serviceLabel) {
    recommendations.push({
      title: `Review ${weakConversionService.serviceLabel} funnel`,
      description: `${weakConversionService.serviceLabel} has a low conversion rate. Check pricing, response quality, and follow-up speed.`,
      tone: "slate",
      link: getServicePath(weakConversionService.serviceType),
    })
  }

  return recommendations.slice(0, 4)
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

const ExecutiveMetric = ({
  label,
  value,
  description,
  icon,
  tone = "orange",
  change,
  reverseChange = false,
}) => {
  const toneClass = {
    orange: "bg-orange-50 text-[#FF6B00]",
    blue: "bg-sky-50 text-[#00AEEF]",
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
            toneClass[tone] || toneClass.orange
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

      <p className="mt-1 font-fredoka text-[38px] font-semibold leading-none text-slate-950">
        {value}
      </p>

      <p className="mt-2 font-poppins text-xs font-semibold leading-5 text-slate-500">
        {description}
      </p>
    </div>
  )
}

const BusinessGradePanel = ({ grade, summary }) => {
  return (
    <div className="rounded-[5px] border border-slate-800 bg-slate-950 p-5 text-white shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-poppins text-[10px] font-bold uppercase tracking-[0.12em] text-[#00AEEF]">
            Executive Health Status
          </p>

          <h2 className="mt-2 font-fredoka text-[34px] font-semibold leading-tight">
            {grade.title}
          </h2>

          <p className="mt-2 max-w-xl font-poppins text-sm font-medium leading-6 text-slate-300">
            {grade.description}
          </p>
        </div>

        <div
          className={`hidden h-14 w-14 shrink-0 items-center justify-center rounded-[5px] text-xl sm:flex ${grade.className}`}
        >
          {grade.icon}
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-[5px] bg-white/5 p-4">
          <p className="font-poppins text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">
            Health Grade
          </p>

          <p className="mt-1 font-fredoka text-[28px] font-semibold text-white">
            {grade.label}
          </p>
        </div>

        <div className="rounded-[5px] bg-white/5 p-4">
          <p className="font-poppins text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">
            Conversion
          </p>

          <p className="mt-1 font-fredoka text-[28px] font-semibold text-[#FF6B00]">
            {formatPercent(summary.conversionRate)}
          </p>
        </div>

        <div className="rounded-[5px] bg-white/5 p-4">
          <p className="font-poppins text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">
            Follow-up Gap
          </p>

          <p className="mt-1 font-fredoka text-[28px] font-semibold text-[#00AEEF]">
            {formatPercent(summary.noFollowUpRate)}
          </p>
        </div>
      </div>
    </div>
  )
}

const FunnelStep = ({ label, value, percent, tone = "blue" }) => {
  const toneClass = {
    blue: "from-[#00AEEF] to-sky-300",
    orange: "from-[#FF6B00] to-orange-300",
    green: "from-emerald-600 to-emerald-300",
    red: "from-red-600 to-red-300",
    slate: "from-slate-900 to-slate-500",
  }

  return (
    <div className="rounded-[5px] border border-slate-100 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <p className="font-poppins text-xs font-bold text-slate-500">
          {label}
        </p>

        <p className="font-poppins text-xs font-bold text-slate-400">
          {formatPercent(percent)}
        </p>
      </div>

      <p className="mt-2 font-fredoka text-[30px] font-semibold leading-none text-slate-950">
        {formatNumber(value)}
      </p>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${
            toneClass[tone] || toneClass.blue
          }`}
          style={{ width: `${Math.min(Number(percent || 0), 100)}%` }}
        />
      </div>
    </div>
  )
}

const LeadFunnel = ({ summary }) => {
  const total = Number(summary.totalLeads || 0)
  const activeOpportunities = Math.max(
    total - Number(summary.convertedLeads || 0) - Number(summary.lostLeads || 0),
    0
  )

  const steps = [
    {
      label: "Total Leads",
      value: summary.totalLeads,
      percent: 100,
      tone: "blue",
    },
    {
      label: "Active Opportunities",
      value: activeOpportunities,
      percent: total ? (activeOpportunities / total) * 100 : 0,
      tone: "orange",
    },
    {
      label: "Interested",
      value: summary.interestedLeads,
      percent: total ? (Number(summary.interestedLeads || 0) / total) * 100 : 0,
      tone: "slate",
    },
    {
      label: "Converted",
      value: summary.convertedLeads,
      percent: total ? (Number(summary.convertedLeads || 0) / total) * 100 : 0,
      tone: "green",
    },
    {
      label: "Lost / Cancelled",
      value: summary.lostLeads,
      percent: total ? (Number(summary.lostLeads || 0) / total) * 100 : 0,
      tone: "red",
    },
  ]

  return (
    <section className="rounded-[5px] border border-slate-100 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-poppins text-[10px] font-bold uppercase tracking-[0.1em] text-[#00AEEF]">
            Sales Funnel
          </p>

          <h2 className="mt-1 font-fredoka text-[32px] font-semibold leading-tight text-slate-950">
            Lead Conversion Flow
          </h2>

          <p className="mt-1 font-poppins text-sm font-medium leading-6 text-slate-500">
            See how leads are moving from inquiry to conversion.
          </p>
        </div>

        <Link
          to="/admin/leads"
          className="inline-flex items-center justify-center gap-2 rounded-[5px] bg-slate-950 px-4 py-2.5 font-poppins text-sm font-semibold text-white transition hover:bg-[#FF6B00]"
        >
          Open Leads
          <FaArrowRight className="text-xs" />
        </Link>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {steps.map((step) => (
          <FunnelStep key={step.label} {...step} />
        ))}
      </div>
    </section>
  )
}

const ServiceLeaderboard = ({ servicePerformance = [] }) => {
  const leaderboard = [...servicePerformance]
    .sort(
      (a, b) =>
        Number(b.convertedLeads || 0) - Number(a.convertedLeads || 0) ||
        Number(b.conversionRate || 0) - Number(a.conversionRate || 0)
    )
    .slice(0, 6)

  return (
    <section className="rounded-[5px] border border-slate-100 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-poppins text-[10px] font-bold uppercase tracking-[0.1em] text-[#FF6B00]">
            Service Leaderboard
          </p>

          <h2 className="mt-1 font-fredoka text-[32px] font-semibold leading-tight text-slate-950">
            Services Driving Business
          </h2>

          <p className="mt-1 font-poppins text-sm font-medium leading-6 text-slate-500">
            Ranking by conversions, service demand, and follow-up quality.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3">
        {leaderboard.length === 0 ? (
          <div className="rounded-[5px] bg-[#F8FAFC] p-8 text-center">
            <FaTable className="mx-auto text-2xl text-slate-300" />

            <p className="mt-3 font-poppins text-sm font-semibold text-slate-500">
              No service performance data available.
            </p>
          </div>
        ) : (
          leaderboard.map((item, index) => {
            const noFollowUpRate = Number(item.noFollowUpRate || 0)

            return (
              <article
                key={item.serviceType || index}
                className="rounded-[5px] border border-slate-100 bg-[#F8FAFC] p-4 transition hover:border-[#00AEEF] hover:bg-white"
              >
                <div className="grid gap-4 xl:grid-cols-[0.8fr_1.2fr_1fr] xl:items-center">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-[5px] font-fredoka text-xl font-semibold ${
                        index === 0
                          ? "bg-[#FF6B00] text-white"
                          : index === 1
                            ? "bg-[#00AEEF] text-white"
                            : "bg-slate-950 text-white"
                      }`}
                    >
                      #{index + 1}
                    </div>

                    <div>
                      <Link
                        to={getServicePath(item.serviceType)}
                        className={`inline-flex rounded-[5px] px-2.5 py-1 font-poppins text-[10px] font-bold uppercase ${getServiceBadgeClass(
                          item.serviceType
                        )}`}
                      >
                        {item.serviceLabel || item.serviceType || "General"}
                      </Link>

                      <p className="mt-1 font-poppins text-xs font-semibold text-slate-500">
                        {formatNumber(item.totalLeads)} leads received
                      </p>
                    </div>
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-poppins text-xs font-bold text-slate-500">
                        Conversion strength
                      </p>

                      <p className="font-poppins text-xs font-bold text-slate-950">
                        {formatPercent(item.conversionRate)}
                      </p>
                    </div>

                    <div className="mt-2 h-3 overflow-hidden rounded-full bg-white">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#00AEEF] to-[#FF6B00]"
                        style={{
                          width: `${Math.min(
                            Number(item.conversionRate || 0),
                            100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="rounded-[5px] bg-white p-3">
                      <p className="font-poppins text-[10px] font-bold uppercase text-slate-400">
                        Converted
                      </p>

                      <p className="font-fredoka text-[24px] font-semibold text-emerald-700">
                        {formatNumber(item.convertedLeads)}
                      </p>
                    </div>

                    <div className="rounded-[5px] bg-white p-3">
                      <p className="font-poppins text-[10px] font-bold uppercase text-slate-400">
                        Lost
                      </p>

                      <p className="font-fredoka text-[24px] font-semibold text-red-700">
                        {formatNumber(item.lostLeads)}
                      </p>
                    </div>

                    <div
                      className={`rounded-[5px] p-3 ${
                        noFollowUpRate >= 35
                          ? "bg-red-50"
                          : noFollowUpRate >= 15
                            ? "bg-orange-50"
                            : "bg-emerald-50"
                      }`}
                    >
                      <p className="font-poppins text-[10px] font-bold uppercase text-slate-500">
                        No Follow-up
                      </p>

                      <p className="font-fredoka text-[24px] font-semibold text-slate-950">
                        {formatNumber(item.noFollowUpLeads)}
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            )
          })
        )}
      </div>
    </section>
  )
}
const ComparisonMetric = ({ label, current, previous, change, reverse = false }) => {
  const number = Number(change || 0)
  const tone = getChangeTone(number, reverse)

  const changeClass =
    tone === "positive"
      ? "bg-emerald-50 text-emerald-700"
      : tone === "negative"
        ? "bg-red-50 text-red-700"
        : "bg-slate-100 text-slate-600"

  return (
    <div className="rounded-[5px] border border-slate-100 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-poppins text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">
            {label}
          </p>

          <p className="mt-2 font-fredoka text-[30px] font-semibold leading-none text-slate-950">
            {current}
          </p>
        </div>

        <span
          className={`inline-flex shrink-0 items-center gap-1 rounded-[5px] px-2.5 py-1 font-poppins text-[11px] font-bold ${changeClass}`}
        >
          {number > 0 && <FaArrowUp className="text-[10px]" />}
          {number < 0 && <FaArrowDown className="text-[10px]" />}
          {number > 0 ? "+" : ""}
          {number.toFixed(1)}%
        </span>
      </div>

      <div className="mt-4 rounded-[5px] bg-[#F8FAFC] px-3 py-2">
        <p className="font-poppins text-[11px] font-semibold text-slate-400">
          Previous period
        </p>

        <p className="mt-0.5 font-poppins text-sm font-bold text-slate-700">
          {previous}
        </p>
      </div>
    </div>
  )
}

const TimelineComparison = ({ comparison = {}, days }) => {
  const current = comparison.current || {}
  const previous = comparison.previous || {}
  const changes = comparison.changes || {}

  const comparisonItems = [
    {
      label: "Lead Volume",
      current: formatNumber(current.totalLeads),
      previous: formatNumber(previous.totalLeads),
      change: changes.totalLeadsChange,
    },
    {
      label: "Conversions",
      current: formatNumber(current.convertedLeads),
      previous: formatNumber(previous.convertedLeads),
      change: changes.convertedLeadsChange,
    },
    {
      label: "Conversion Rate",
      current: formatPercent(current.conversionRate),
      previous: formatPercent(previous.conversionRate),
      change: changes.conversionRateChange,
    },
    {
      label: "No Follow-up",
      current: formatNumber(current.noFollowUpLeads),
      previous: formatNumber(previous.noFollowUpLeads),
      change: changes.noFollowUpLeadsChange,
      reverse: true,
    },
  ]

  return (
    <section className="overflow-hidden rounded-[5px] border border-slate-100 bg-white shadow-sm">
      <div className="border-b border-slate-100 bg-slate-950 p-5 text-white">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-poppins text-[10px] font-bold uppercase tracking-[0.14em] text-[#00AEEF]">
              Period Comparison
            </p>

            <h2 className="mt-2 font-fredoka text-[30px] font-semibold leading-tight text-white sm:text-[34px]">
              Current {days} Days vs Previous {days} Days
            </h2>

            <p className="mt-2 max-w-2xl font-poppins text-sm font-medium leading-6 text-slate-300">
              Compare business movement, conversions, and follow-up discipline
              against the previous period.
            </p>
          </div>

          <div className="rounded-[5px] bg-white/10 px-4 py-3">
            <p className="font-poppins text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">
              Selected Range
            </p>

            <p className="font-fredoka text-[24px] font-semibold leading-none text-white">
              {days} Days
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 bg-[#F8FAFC] p-5 sm:grid-cols-2">
        {comparisonItems.map((item) => (
          <ComparisonMetric key={item.label} {...item} />
        ))}
      </div>
    </section>
  )
}
const current = comparison.current || {}
  const previous = comparison.previous || {}
  const changes = comparison.changes || {}

  const items = [
    {
      label: "Lead Volume",
      current: formatNumber(current.totalLeads),
      previous: formatNumber(previous.totalLeads),
      change: changes.totalLeadsChange,
      reverse: false,
    },
    {
      label: "Conversions",
      current: formatNumber(current.convertedLeads),
      previous: formatNumber(previous.convertedLeads),
      change: changes.convertedLeadsChange,
      reverse: false,
    },
    {
      label: "Conversion Rate",
      current: formatPercent(current.conversionRate),
      previous: formatPercent(previous.conversionRate),
      change: changes.conversionRateChange,
      reverse: false,
    },
    {
      label: "No Follow-up",
      current: formatNumber(current.noFollowUpLeads),
      previous: formatNumber(previous.noFollowUpLeads),
      change: changes.noFollowUpLeadsChange,
      reverse: true,
    },
  ]

  return (
    <section className="rounded-[5px] border border-slate-100 bg-white p-5 shadow-sm">
      <div>
        <p className="font-poppins text-[10px] font-bold uppercase tracking-[0.1em] text-[#00AEEF]">
          Period Comparison
        </p>

        <h2 className="mt-1 font-fredoka text-[32px] font-semibold leading-tight text-slate-950">
          Current {days} Days vs Previous {days} Days
        </h2>

        <p className="mt-1 font-poppins text-sm font-medium leading-6 text-slate-500">
          Focus on whether the business is improving, slowing down, or creating
          more follow-up risk.
        </p>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {items.map((item) => (
          <div key={item.label} className="rounded-[5px] bg-[#F8FAFC] p-4">
            <div className="flex items-start justify-between gap-2">
              <p className="font-poppins text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">
                {item.label}
              </p>

              <ChangePill value={item.change} reverse={item.reverse} />
            </div>

            <p className="mt-3 font-fredoka text-[30px] font-semibold leading-none text-slate-950">
              {item.current}
            </p>

            <p className="mt-2 font-poppins text-xs font-semibold text-slate-500">
              Previous: {item.previous}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}

const TimelinePulse = ({ timeline = [] }) => {
  const activeTimeline = timeline.filter((item) => Number(item.totalLeads || 0) > 0)
  const recent = activeTimeline.slice(-8)

  if (!recent.length) {
    return (
      <section className="rounded-[5px] border border-slate-100 bg-white p-5 shadow-sm">
        <h2 className="font-fredoka text-[30px] font-semibold text-slate-950">
          Timeline Pulse
        </h2>

        <div className="mt-4 rounded-[5px] bg-[#F8FAFC] p-8 text-center">
          <FaChartLine className="mx-auto text-2xl text-slate-300" />

          <p className="mt-3 font-poppins text-sm font-semibold text-slate-500">
            No lead movement available for this range.
          </p>
        </div>
      </section>
    )
  }

  const maxLeads = Math.max(
    ...recent.map((item) => Number(item.totalLeads || 0)),
    1
  )

  return (
    <section className="rounded-[5px] border border-slate-100 bg-white p-5 shadow-sm">
      <div>
        <p className="font-poppins text-[10px] font-bold uppercase tracking-[0.1em] text-[#FF6B00]">
          Timeline Pulse
        </p>

        <h2 className="mt-1 font-fredoka text-[32px] font-semibold leading-tight text-slate-950">
          Recent Business Movement
        </h2>

        <p className="mt-1 font-poppins text-sm font-medium leading-6 text-slate-500">
          Recent active days only, so the section stays useful instead of showing
          a flat empty graph.
        </p>
      </div>

      <div className="mt-5 grid gap-3">
        {recent.map((item) => {
          const totalLeads = Number(item.totalLeads || 0)
          const convertedLeads = Number(item.convertedLeads || 0)
          const totalWidth = Math.max((totalLeads / maxLeads) * 100, 8)
          const convertedWidth = totalLeads
            ? Math.max((convertedLeads / totalLeads) * 100, 0)
            : 0

          return (
            <div key={item.date} className="rounded-[5px] bg-[#F8FAFC] p-3">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="min-w-[100px]">
                  <p className="font-poppins text-xs font-bold text-slate-700">
                    {getShortDateLabel(item.date)}
                  </p>

                  <p className="font-poppins text-[11px] font-semibold text-slate-400">
                    {formatPercent(item.conversionRate)}
                  </p>
                </div>

                <div className="flex-1">
                  <div className="h-9 overflow-hidden rounded-[5px] bg-white">
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
                    {formatNumber(totalLeads)} leads
                  </span>

                  <span className="text-[#FF6B00]">
                    {formatNumber(convertedLeads)} converted
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

const RecommendationCard = ({ item }) => {
  const toneClass = {
    red: "bg-red-50 text-red-700",
    orange: "bg-orange-50 text-[#FF6B00]",
    blue: "bg-sky-50 text-[#00AEEF]",
    green: "bg-emerald-50 text-emerald-700",
    slate: "bg-slate-100 text-slate-700",
  }

  return (
    <article className="rounded-[5px] border border-slate-100 bg-white p-4 shadow-sm">
      <span
        className={`inline-flex rounded-[5px] px-2.5 py-1 font-poppins text-[10px] font-bold uppercase tracking-[0.08em] ${
          toneClass[item.tone] || toneClass.slate
        }`}
      >
        Action Insight
      </span>

      <h3 className="mt-3 font-fredoka text-[24px] font-semibold leading-tight text-slate-950">
        {item.title}
      </h3>

      <p className="mt-2 font-poppins text-xs font-semibold leading-5 text-slate-500">
        {item.description}
      </p>

      {item.link && (
        <Link
          to={item.link}
          className="mt-4 inline-flex items-center gap-2 font-poppins text-xs font-bold text-[#FF6B00] transition hover:text-[#00AEEF]"
        >
          Take action
          <FaArrowRight className="text-[10px]" />
        </Link>
      )}
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

                {lead.createdAt && (
                  <span>Created: {formatDate(lead.createdAt)}</span>
                )}
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}

const ServiceHealthTable = ({ servicePerformance = [] }) => {
  return (
    <section className="rounded-[5px] border border-slate-100 bg-white shadow-sm">
      <div className="border-b border-slate-100 p-5">
        <p className="font-poppins text-[10px] font-bold uppercase tracking-[0.1em] text-[#00AEEF]">
          Service Health
        </p>

        <h2 className="mt-1 font-fredoka text-[32px] font-semibold leading-tight text-slate-950">
          Detailed Service Comparison
        </h2>

        <p className="mt-1 font-poppins text-sm font-medium leading-6 text-slate-500">
          Use this table to identify which travel services need sales attention.
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

  const activeOpportunities = Math.max(
    Number(summary.totalLeads || 0) -
      Number(summary.convertedLeads || 0) -
      Number(summary.lostLeads || 0),
    0
  )

  const businessGrade = useMemo(() => {
    return getBusinessGrade(summary)
  }, [summary])

  const recommendations = useMemo(() => {
    return getInsightRecommendations({
      summary,
      highlights,
      servicePerformance,
    })
  }, [summary, highlights, servicePerformance])

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
        <div className="relative overflow-hidden bg-slate-950 p-5 text-white sm:p-6">
          <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-[#00AEEF]/20 blur-3xl" />
          <div className="absolute -bottom-24 left-1/3 h-72 w-72 rounded-full bg-[#FF6B00]/20 blur-3xl" />

          <div className="relative z-10 grid gap-6 xl:grid-cols-[1.1fr_0.9fr] xl:items-end">
            <div>
              <p className="font-poppins text-[10px] font-bold uppercase tracking-[0.14em] text-[#00AEEF] sm:text-xs">
                TravelEx Business Intelligence
              </p>

              <h1 className="mt-2 max-w-4xl font-fredoka text-[38px] font-semibold leading-[0.95] text-white sm:text-[52px]">
                Executive Business Insights
              </h1>

              <p className="mt-4 max-w-3xl font-poppins text-sm font-medium leading-7 text-slate-300">
                A decision-focused view of lead conversion, service growth,
                follow-up discipline, and travel business performance.
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {rangeOptions.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setDays(item.value)}
                    className={`rounded-[5px] px-4 py-2 font-poppins text-xs font-bold transition ${
                      days === item.value
                        ? "bg-[#FF6B00] text-white shadow-[0_12px_28px_rgba(255,107,0,0.28)]"
                        : "bg-white/10 text-slate-200 hover:bg-white hover:text-slate-950"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => loadInsights(days)}
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 rounded-[5px] bg-white/10 px-4 py-2 font-poppins text-xs font-bold text-slate-200 transition hover:bg-white hover:text-slate-950 disabled:opacity-50"
                >
                  <FaSyncAlt className={loading ? "animate-spin" : ""} />
                  Refresh
                </button>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
              <div className="rounded-[5px] border border-white/10 bg-white/10 p-4 backdrop-blur-xl">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-[5px] bg-[#FF6B00] text-white">
                    <FaCalendarAlt />
                  </div>

                  <div>
                    <p className="font-poppins text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">
                      Selected Period
                    </p>

                    <p className="font-fredoka text-[24px] font-semibold leading-none text-white">
                      Last {days} Days
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-[5px] border border-white/10 bg-white/10 p-4 backdrop-blur-xl">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-[5px] bg-[#00AEEF] text-white">
                    <FaGlobeAsia />
                  </div>

                  <div>
                    <p className="font-poppins text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">
                      Date Range
                    </p>

                    <p className="font-fredoka text-[20px] font-semibold leading-none text-white">
                      {formatDate(insights?.range?.from)} -{" "}
                      {formatDate(insights?.range?.to)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-[5px] border border-white/10 bg-white/10 p-4 backdrop-blur-xl">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-[5px] bg-white text-slate-950">
                    <FaPlane />
                  </div>

                  <div>
                    <p className="font-poppins text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">
                      Travel CRM
                    </p>

                    <p className="font-fredoka text-[24px] font-semibold leading-none text-white">
                      Live Performance
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {!loading && (
          <div className="grid gap-4 bg-[#F8FAFC] p-5 md:grid-cols-2 xl:grid-cols-4">
            <ExecutiveMetric
              icon={<FaChartLine />}
              label="Conversion Rate"
              value={formatPercent(summary.conversionRate)}
              description="Confirmed + booked leads from total inquiries."
              tone="orange"
              change={changes.conversionRateChange}
            />

            <ExecutiveMetric
              icon={<FaCheckCircle />}
              label="Converted Leads"
              value={formatNumber(summary.convertedLeads)}
              description={`${formatNumber(
                summary.totalLeads
              )} total leads in this period.`}
              tone="green"
              change={changes.convertedLeadsChange}
            />

            <ExecutiveMetric
              icon={<FaRocket />}
              label="Active Opportunities"
              value={formatNumber(activeOpportunities)}
              description="Open leads that can still convert."
              tone="blue"
            />

            <ExecutiveMetric
              icon={<FaUserClock />}
              label="Follow-up Risk"
              value={formatNumber(summary.noFollowUpLeads)}
              description={`${formatPercent(
                summary.noFollowUpRate
              )} leads have no follow-up.`}
              tone="red"
              change={changes.noFollowUpLeadsChange}
              reverseChange
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
              className="h-44 animate-pulse rounded-[5px] bg-white shadow-sm"
            />
          ))}
        </div>
      ) : (
        <>
          <section className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
            <BusinessGradePanel grade={businessGrade} summary={summary} />

            <div className="grid gap-4 sm:grid-cols-2">
              <ExecutiveMetric
                icon={<FaClock />}
                label="Scheduled Follow-ups"
                value={formatNumber(summary.scheduledFollowUps)}
                description="Follow-ups currently planned."
                tone="purple"
              />

              <ExecutiveMetric
                icon={<FaExclamationTriangle />}
                label="Overdue Follow-ups"
                value={formatNumber(summary.overdueFollowUps)}
                description="Needs immediate sales action."
                tone="red"
              />

              <ExecutiveMetric
                icon={<FaTimesCircle />}
                label="Lost / Cancelled"
                value={formatNumber(summary.lostLeads)}
                description={`${formatPercent(summary.lostRate)} lost rate.`}
                tone="slate"
                change={changes.lostLeadsChange}
                reverseChange
              />

              <ExecutiveMetric
                icon={<FaCalendarAlt />}
                label="Today Follow-ups"
                value={formatNumber(summary.todayFollowUps)}
                description="Due today for the CRM team."
                tone="blue"
              />
            </div>
          </section>

          <LeadFunnel summary={summary} />

          <section className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
            <ServiceLeaderboard servicePerformance={servicePerformance} />

            <div className="grid gap-5">
              <TimelineComparison comparison={comparison} days={days} />

              <section className="rounded-[5px] border border-slate-100 bg-white p-5 shadow-sm">
                <div>
                  <p className="font-poppins text-[10px] font-bold uppercase tracking-[0.1em] text-[#FF6B00]">
                    Executive Recommendations
                  </p>

                  <h2 className="mt-1 font-fredoka text-[32px] font-semibold leading-tight text-slate-950">
                    What To Do Next
                  </h2>

                  <p className="mt-1 font-poppins text-sm font-medium leading-6 text-slate-500">
                    Practical next actions based on CRM performance.
                  </p>
                </div>

                <div className="mt-5 grid gap-3">
                  {recommendations.length === 0 ? (
                    <div className="rounded-[5px] bg-emerald-50 p-5">
                      <p className="font-poppins text-sm font-bold text-emerald-700">
                        Business health looks stable. Keep tracking service
                        performance and follow-up discipline.
                      </p>
                    </div>
                  ) : (
                    recommendations.map((item) => (
                      <RecommendationCard key={item.title} item={item} />
                    ))
                  )}
                </div>
              </section>
            </div>
          </section>

          <TimelinePulse timeline={timeline} />

          <ServiceHealthTable servicePerformance={servicePerformance} />

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