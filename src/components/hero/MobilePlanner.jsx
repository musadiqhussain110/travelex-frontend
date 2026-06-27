import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import {
  FaSearch,
  FaChevronRight,
  FaTimes,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaWhatsapp,
  FaMinus,
  FaPlus,
} from "react-icons/fa"

const WHATSAPP_NUMBER = "923111444192"

const services = ["Umrah", "Visa", "Tours", "Hotels", "Transport"]

const months = [
  "Flexible",
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

const MobilePlanner = () => {
  const [open, setOpen] = useState(false)
  const [service, setService] = useState("Umrah")
  const [city, setCity] = useState("")
  const [month, setMonth] = useState("Flexible")
  const [travelers, setTravelers] = useState(2)
  const [dragY, setDragY] = useState(0)

  const startY = useRef(0)

  // Lock body scroll while the sheet is open
  useEffect(() => {
    if (!open) return

    const previous = document.body.style.overflow
    document.body.style.overflow = "hidden"

    return () => {
      document.body.style.overflow = previous
    }
  }, [open])

  const closeSheet = () => {
    setDragY(0)
    setOpen(false)
  }

  const handleSubmit = () => {
    const parts = ["Service: " + service]

    if (city.trim()) parts.push("From: " + city.trim())
    parts.push("Travel month: " + month)
    parts.push("Travelers: " + travelers)

    const message =
      "Assalamualaikum TravelEx, I'd like to plan a trip. " +
      parts.join(", ") +
      "."

    const url =
      "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(message)

    window.open(url, "_blank", "noopener")
    closeSheet()
  }

  const onHandleTouchStart = (e) => {
    startY.current = e.touches[0].clientY
  }

  const onHandleTouchMove = (e) => {
    const delta = e.touches[0].clientY - startY.current
    if (delta > 0) setDragY(delta)
  }

  const onHandleTouchEnd = () => {
    if (dragY > 110) {
      closeSheet()
      return
    }
    setDragY(0)
  }

  const sheet = (
    <div className="fixed inset-0 z-[70] flex items-end justify-center md:hidden">
      <style>{`
        @keyframes mpFade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes mpUp {
          from { transform: translateY(100%); }
          to   { transform: translateY(0); }
        }
        .mp-backdrop { animation: mpFade 0.22s ease-out both; }
        .mp-sheet { animation: mpUp 0.30s cubic-bezier(0.22,1,0.36,1) both; }
        @media (prefers-reduced-motion: reduce) {
          .mp-backdrop, .mp-sheet { animation: none !important; }
        }
      `}</style>

      <button
        type="button"
        aria-label="Close planner"
        onClick={closeSheet}
        className="mp-backdrop absolute inset-0 bg-slate-950/45 backdrop-blur-[1px]"
      />

      <div
        className="mp-sheet relative z-10 w-full max-w-[520px] rounded-t-[22px] bg-white px-4 pt-2 shadow-[0_-12px_40px_rgba(11,42,74,0.22)]"
        style={
          dragY > 0
            ? { transform: "translateY(" + dragY + "px)", transition: "none" }
            : undefined
        }
      >
        <div
          className="cursor-grab touch-none pb-1 pt-1"
          onTouchStart={onHandleTouchStart}
          onTouchMove={onHandleTouchMove}
          onTouchEnd={onHandleTouchEnd}
        >
          <span className="mx-auto block h-1.5 w-10 rounded-full bg-slate-200" />
        </div>

        <div className="mb-3 mt-1 flex items-center justify-between">
          <h3 className="font-fredoka text-[18px] font-semibold text-[#0b2a4a]">
            Plan your trip
          </h3>

          <button
            type="button"
            onClick={closeSheet}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 active:scale-95"
          >
            <FaTimes className="text-[13px]" />
          </button>
        </div>

        {/* Service chips */}
        <div className="-mx-1 mb-4 flex gap-2 overflow-x-auto px-1 pb-1">
          {services.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setService(s)}
              className={
                "whitespace-nowrap rounded-full px-3.5 py-1.5 font-poppins text-[12px] font-semibold transition active:scale-95 " +
                (service === s
                  ? "bg-[#FF6B00] text-white shadow-[0_4px_14px_rgba(255,107,0,0.35)]"
                  : "bg-slate-100 text-slate-600")
              }
            >
              {s}
            </button>
          ))}
        </div>

        {/* Departure city */}
        <label className="mb-3 block">
          <span className="mb-1 block font-poppins text-[10.5px] font-semibold uppercase tracking-[0.12em] text-slate-500">
            Departure City
          </span>
          <span className="flex items-center gap-2 rounded-[12px] border border-slate-200 bg-slate-50 px-3 py-2.5">
            <FaMapMarkerAlt className="text-[13px] text-[#00AEEF]" />
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g. Karachi"
              className="w-full bg-transparent font-poppins text-[13px] font-medium text-[#0b2a4a] outline-none placeholder:text-slate-400"
            />
          </span>
        </label>

        {/* Travel month */}
        <label className="mb-3 block">
          <span className="mb-1 block font-poppins text-[10.5px] font-semibold uppercase tracking-[0.12em] text-slate-500">
            Travel Month
          </span>
          <span className="flex items-center gap-2 rounded-[12px] border border-slate-200 bg-slate-50 px-3 py-2.5">
            <FaCalendarAlt className="text-[13px] text-[#00AEEF]" />
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="w-full appearance-none bg-transparent font-poppins text-[13px] font-medium text-[#0b2a4a] outline-none"
            >
              {months.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </span>
        </label>

        {/* Travelers stepper */}
        <div className="mb-5 flex items-center justify-between rounded-[12px] border border-slate-200 bg-slate-50 px-3 py-2.5">
          <span className="font-poppins text-[10.5px] font-semibold uppercase tracking-[0.12em] text-slate-500">
            Travelers
          </span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Remove traveler"
              onClick={() => setTravelers((n) => Math.max(1, n - 1))}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-[#0b2a4a] shadow-sm active:scale-95"
            >
              <FaMinus className="text-[10px]" />
            </button>
            <span className="w-5 text-center font-poppins text-[14px] font-bold text-[#0b2a4a]">
              {travelers}
            </span>
            <button
              type="button"
              aria-label="Add traveler"
              onClick={() => setTravelers((n) => Math.min(12, n + 1))}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-[#0b2a4a] shadow-sm active:scale-95"
            >
              <FaPlus className="text-[10px]" />
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          className="flex w-full items-center justify-center gap-2 rounded-[12px] bg-[#FF6B00] py-3.5 font-poppins text-[14px] font-bold text-white shadow-[0_10px_26px_rgba(255,107,0,0.38)] transition-colors duration-300 active:scale-[0.99] active:bg-[#e85f00]"
        >
          <FaWhatsapp className="text-[16px]" />
          Get my plan on WhatsApp
        </button>

        <p className="mt-2 text-center font-poppins text-[10px] font-medium text-slate-400">
          A consultant replies within minutes, 24/7.
        </p>

        <div style={{ height: "max(12px, env(safe-area-inset-bottom))" }} />
      </div>
    </div>
  )

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group flex w-full items-center gap-3 rounded-[14px] border border-slate-100 bg-white px-4 py-3.5 text-left shadow-[0_8px_22px_rgba(11,42,74,0.08)] transition active:scale-[0.98]"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#FF6B00] text-[16px] text-white">
          <FaSearch />
        </span>

        <span className="flex-1">
          <span className="block font-poppins text-[13px] font-bold text-[#0b2a4a]">
            Plan your trip
          </span>
          <span className="block font-poppins text-[10px] font-medium text-slate-500">
            Umrah · Visa · Tours · Hotels · Transport
          </span>
        </span>

        <FaChevronRight className="text-[13px] text-slate-400 transition group-active:translate-x-0.5" />
      </button>

      {open &&
        typeof document !== "undefined" &&
        createPortal(sheet, document.body)}
    </>
  )
}

export default MobilePlanner