import { useEffect, useRef, useState } from "react"
import { FaCheck, FaChevronDown } from "react-icons/fa"

const AppSelect = ({
  label,
  value,
  onChange,
  options = [],
  placeholder = "Select option",
}) => {
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef(null)

  useEffect(() => {
    const closeDropdown = (event) => {
      if (!wrapperRef.current?.contains(event.target)) {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", closeDropdown)
    document.addEventListener("touchstart", closeDropdown)

    return () => {
      document.removeEventListener("mousedown", closeDropdown)
      document.removeEventListener("touchstart", closeDropdown)
    }
  }, [])

  return (
    <div ref={wrapperRef} className="relative">
      {label && (
        <label className="mb-1.5 block font-poppins text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400 sm:mb-2 sm:text-xs">
          {label}
        </label>
      )}

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`flex h-11 w-full items-center justify-between gap-3 rounded-[5px] border bg-white px-3 text-left font-poppins text-xs font-semibold outline-none transition sm:h-12 sm:px-4 sm:text-sm ${
          open
            ? "border-[#00AEEF] ring-4 ring-[#00AEEF]/10"
            : "border-slate-200"
        } ${value ? "text-slate-900" : "text-slate-400"}`}
      >
        <span className="line-clamp-1">{value || placeholder}</span>

        <FaChevronDown
          className={`shrink-0 text-[10px] text-slate-400 transition ${
            open ? "rotate-180 text-[#00AEEF]" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-[9999] max-h-[230px] overflow-y-auto rounded-[10px] border border-slate-100 bg-white p-1.5 shadow-[0_18px_45px_rgba(15,23,42,0.18)] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {options.map((option) => {
            const isActive = value === option

            return (
              <button
                key={option}
                type="button"
                onClick={() => {
                  onChange(option)
                  setOpen(false)
                }}
                className={`flex w-full items-center justify-between gap-3 rounded-[7px] px-3 py-2.5 text-left font-poppins text-xs font-semibold transition sm:text-sm ${
                  isActive
                    ? "bg-[#00AEEF] text-white"
                    : "text-slate-700 hover:bg-sky-50 hover:text-[#00AEEF]"
                }`}
              >
                <span>{option}</span>

                {isActive && <FaCheck className="text-[10px]" />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default AppSelect