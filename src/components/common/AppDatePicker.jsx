import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { FaCalendarAlt } from "react-icons/fa"

const inputClass =
  "h-11 w-full rounded-[5px] border border-slate-200 bg-white pl-10 pr-3 font-poppins text-xs font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#00AEEF] focus:ring-2 focus:ring-[#00AEEF]/10 sm:h-12 sm:pl-11 sm:pr-4 sm:text-sm"

const labelClass =
  "mb-1.5 block font-poppins text-[9px] font-bold uppercase tracking-[0.08em] text-slate-400 sm:mb-2 sm:text-xs"

const createSafeCalendarDate = (year, month, day) => {
  const numericYear = Number(year)
  const numericMonth = Number(month)
  const numericDay = Number(day)

  if (
    !Number.isInteger(numericYear) ||
    !Number.isInteger(numericMonth) ||
    !Number.isInteger(numericDay)
  ) {
    return null
  }

  const date = new Date(
    numericYear,
    numericMonth - 1,
    numericDay,
    12,
    0,
    0,
    0
  )

  if (Number.isNaN(date.getTime())) return null

  if (
    date.getFullYear() !== numericYear ||
    date.getMonth() !== numericMonth - 1 ||
    date.getDate() !== numericDay
  ) {
    return null
  }

  return date
}

const parseDateValue = (value) => {
  if (!value) return null

  const cleanValue =
    value instanceof Date
      ? value.toISOString()
      : String(value).trim()

  const isoMatch = cleanValue.match(/^(\d{4})-(\d{2})-(\d{2})/)

  if (isoMatch) {
    return createSafeCalendarDate(
      isoMatch[1],
      isoMatch[2],
      isoMatch[3]
    )
  }

  const displayMatch = cleanValue.match(
    /^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/
  )

  if (displayMatch) {
    return createSafeCalendarDate(
      displayMatch[3],
      displayMatch[2],
      displayMatch[1]
    )
  }

  return null
}

const formatDateValue = (date) => {
  if (
    !date ||
    !(date instanceof Date) ||
    Number.isNaN(date.getTime())
  ) {
    return ""
  }

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

const normalizeBoundaryDate = (value) => {
  if (!value) return undefined
  return parseDateValue(value) || undefined
}

const AppDatePicker = ({
  label,
  value,
  onChange,
  placeholder = "Select date",
  minDate,
  maxDate,
}) => {
  const isMobile =
    typeof window !== "undefined" && window.innerWidth < 640

  return (
    <div>
      {label && <label className={labelClass}>{label}</label>}

      <div className="relative">
        <FaCalendarAlt className="pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-xs text-slate-400 sm:left-4 sm:text-sm" />

        <DatePicker
          selected={parseDateValue(value)}
          onChange={(date) => onChange(formatDateValue(date))}
          dateFormat="dd/MM/yyyy"
          placeholderText={placeholder}
          className={inputClass}
          calendarClassName="travelex-datepicker-calendar"
          popperClassName="travelex-datepicker-popper"
          wrapperClassName="w-full"
          showMonthDropdown
          showYearDropdown
          dropdownMode="select"
          minDate={normalizeBoundaryDate(minDate)}
          maxDate={normalizeBoundaryDate(maxDate)}
          autoComplete="off"
          withPortal={isMobile}
          shouldCloseOnSelect
        />
      </div>
    </div>
  )
}

export default AppDatePicker
