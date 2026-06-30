import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { FaClock } from "react-icons/fa"

const inputClass =
  "h-11 w-full rounded-[5px] border border-slate-200 bg-white pl-10 pr-3 font-poppins text-xs font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#00AEEF] focus:ring-2 focus:ring-[#00AEEF]/10 sm:h-12 sm:pl-11 sm:pr-4 sm:text-sm"

const labelClass =
  "mb-1.5 block font-poppins text-[9px] font-bold uppercase tracking-[0.08em] text-slate-400 sm:mb-2 sm:text-xs"

const parseTimeValue = (value) => {
  if (!value) return null

  const match = value.match(/^(\d{1,2}):(\d{2})\s?(AM|PM)$/i)

  if (!match) return null

  const [, rawHour, rawMinute, period] = match
  let hour = Number(rawHour)
  const minute = Number(rawMinute)

  if (period.toUpperCase() === "PM" && hour !== 12) hour += 12
  if (period.toUpperCase() === "AM" && hour === 12) hour = 0

  const date = new Date()
  date.setHours(hour, minute, 0, 0)

  return date
}

const formatTimeValue = (date) => {
  if (!date) return ""

  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })
}

const AppTimePicker = ({
  label,
  value,
  onChange,
  placeholder = "Select time",
  interval = 30,
}) => {
  const isMobile =
    typeof window !== "undefined" && window.innerWidth < 640

  return (
    <div>
      {label && <label className={labelClass}>{label}</label>}

      <div className="relative">
        <FaClock className="pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-xs text-slate-400 sm:left-4 sm:text-sm" />

        <DatePicker
          selected={parseTimeValue(value)}
          onChange={(date) => onChange(formatTimeValue(date))}
          showTimeSelect
          showTimeSelectOnly
          timeIntervals={interval}
          timeCaption="Time"
          dateFormat="hh:mm aa"
          placeholderText={placeholder}
          className={inputClass}
          calendarClassName="travelex-datepicker-calendar"
          popperClassName="travelex-datepicker-popper"
          wrapperClassName="w-full"
          autoComplete="off"
          withPortal={isMobile}
          shouldCloseOnSelect
        />
      </div>
    </div>
  )
}

export default AppTimePicker