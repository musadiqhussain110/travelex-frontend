import { FaBolt, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa"
import { getSmartLeadScore } from "../../utils/leadScoring"

const SmartLeadScore = ({ lead, compact = false }) => {
  const smart = getSmartLeadScore(lead)

  const scoreTone =
    smart.score >= 80
      ? "from-red-500 to-orange-500"
      : smart.score >= 60
        ? "from-[#FF6B00] to-amber-400"
        : "from-[#00AEEF] to-slate-400"

  const icon =
    smart.overdue || smart.needsFollowUp ? (
      <FaExclamationTriangle />
    ) : smart.highValue ? (
      <FaCheckCircle />
    ) : (
      <FaBolt />
    )

  return (
    <div className="rounded-[5px] border border-slate-100 bg-white p-3 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-[5px] px-2.5 py-1 font-poppins text-[10px] font-bold uppercase ${smart.temperature.className}`}
            >
              {icon}
              {smart.temperature.label}
            </span>

            {!compact &&
              smart.tags
                .filter((tag) => tag.label !== smart.temperature.label)
                .slice(0, 3)
                .map((tag) => (
                  <span
                    key={tag.label}
                    className={`inline-flex items-center gap-1.5 rounded-[5px] px-2.5 py-1 font-poppins text-[10px] font-bold uppercase ${tag.className}`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${tag.dotClassName}`}
                    />
                    {tag.label}
                  </span>
                ))}
          </div>

          {!compact && smart.reasons.length > 0 && (
            <p className="mt-2 line-clamp-1 font-poppins text-xs font-semibold text-slate-500">
              {smart.reasons.join(" • ")}
            </p>
          )}
        </div>

        <div className="shrink-0 text-right">
          <p className="font-fredoka text-[28px] font-semibold leading-none text-slate-950">
            {smart.score}
          </p>

          <p className="font-poppins text-[10px] font-bold uppercase tracking-[0.08em] text-slate-400">
            Score
          </p>
        </div>
      </div>

      <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${scoreTone}`}
          style={{ width: `${smart.score}%` }}
        />
      </div>
    </div>
  )
}

export default SmartLeadScore