import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import {
  FaCalendarAlt,
  FaUsers,
  FaMapMarkerAlt,
  FaHotel,
  FaCar,
  FaMinus,
  FaPlus,
  FaChevronDown,
  FaChevronLeft,
  FaChevronRight,
  FaSearch,
  FaKaaba,
  FaGlobeAsia,
  FaPassport,
  FaSuitcase,
  FaPlaneDeparture,
  FaTicketAlt,
  FaMoon,
} from "react-icons/fa"

const services = [
  { name: "Umrah", icon: <FaKaaba /> },
  { name: "Visa Assistance", icon: <FaPassport /> },
  { name: "International Tours", icon: <FaGlobeAsia /> },
  { name: "Tickets", icon: <FaTicketAlt /> },
  { name: "Hotel Booking", icon: <FaHotel /> },
  { name: "Transport Services", icon: <FaCar /> },
]

const departureCityOptions = [
  "Karachi",
  "Lahore",
  "Islamabad",
  "Peshawar",
  "Multan",
  "Quetta",
  "Sialkot",
  "Faisalabad",
]

const packageTypeOptions = [
  "Economy Package",
  "Standard Package",
  "Premium Package",
  "VIP Package",
]

const arrivalOptions = [
  "Makkah",
  "Madinah",
  "Jeddah Airport",
  "Dubai",
  "Istanbul",
  "Baku",
  "Malaysia",
  "Thailand",
  "Azerbaijan",
]

const hotelOptions = [
  "Makkah",
  "Madinah",
  "Dubai",
  "Istanbul",
  "Baku",
  "Malaysia",
]

const visaOptions = [
  "Malaysia",
  "Thailand",
  "Sri Lanka",
  "Uganda",
  "Kenya",
  "Dubai / UAE",
  "UAE 5 Year",
  "Cambodia",
  "Azerbaijan",
  "Singapore",
  "Tanzania",
  "Myanmar",
  "Bahrain",
  "Indonesia",
  "Vietnam",
  "Uzbekistan",
  "United Kingdom",
  "Schengen",
]

const carOptions = ["Economy Car", "SUV", "Luxury Car", "Coaster / Van"]

const ticketTypeOptions = ["Domestic Ticket", "International Ticket"]

const ticketDestinationOptions = [
  "Karachi",
  "Lahore",
  "Islamabad",
  "Peshawar",
  "Quetta",
  "Multan",
  "Sialkot",
  "Faisalabad",
  "Dubai",
  "Jeddah",
  "Riyadh",
  "Doha",
  "Istanbul",
  "Baku",
  "Malaysia",
  "Thailand",
  "United Kingdom",
  "Schengen",
]

const monthNames = [
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

const formatDate = (date) =>
  date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })

const ServiceSearchBar = ({ defaultService = "Umrah" }) => {
  const [service, setService] = useState(defaultService)
  const [activeDropdown, setActiveDropdown] = useState(null)
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [calendarMonth, setCalendarMonth] = useState(new Date())
  const [pickerYear, setPickerYear] = useState(new Date().getFullYear())
  const [formValues, setFormValues] = useState({})
  const [passengers, setPassengers] = useState({ adults: 1, children: 0 })
  const [passengersTouched, setPassengersTouched] = useState(false)
  const [nights, setNights] = useState({ makkah: 0, madinah: 0 })
  const [nightsTouched, setNightsTouched] = useState(false)

  const searchRef = useRef(null)

  const passengerText = `${passengers.adults} Adult${
    passengers.adults > 1 ? "s" : ""
  } / ${passengers.children} Child${passengers.children === 1 ? "" : "ren"}`

  const nightsText = `${nights.makkah} Makkah · ${nights.madinah} Madinah`

  const getSearchPath = () => {
    if (service === "Umrah") return "/umrah"

    if (service === "Visa Assistance") {
      const selectedCountry = formValues.Country

      return selectedCountry
        ? `/visa?country=${encodeURIComponent(selectedCountry)}`
        : "/visa"
    }

    if (service === "International Tours") return "/tours"

    if (service === "Tickets") {
      const fromCity = formValues["From City"]
      const toCity = formValues["To City"]

      const params = new URLSearchParams()

      if (fromCity) params.set("from", fromCity)
      if (toCity) params.set("to", toCity)

      const query = params.toString()

      return query ? `/tickets?${query}` : "/tickets"
    }

    if (service === "Hotel Booking") return "/hotels"
    if (service === "Transport Services") return "/car-rental"

    return "/contact"
  }

  const getSearchLabel = () => {
    if (service === "Umrah") return "Get Personalized Plan"
    if (service === "Visa Assistance") return "Check Requirements"
    if (service === "International Tours") return "Start Planning"
    if (service === "Tickets") return "Request Ticket Quote"
    if (service === "Hotel Booking") return "Find Trusted Hotels"
    if (service === "Transport Services") return "Book Transport"

    return "Start Planning"
  }

  const updatePassenger = (type, action) => {
    setPassengersTouched(true)

    setPassengers((prev) => {
      const current = prev[type]

      if (action === "minus") {
        if (type === "adults" && current <= 1) return prev
        if (type === "children" && current <= 0) return prev
        return { ...prev, [type]: current - 1 }
      }

      return { ...prev, [type]: current + 1 }
    })
  }

  const updateNights = (type, action) => {
    setNightsTouched(true)

    setNights((prev) => {
      const current = prev[type]

      if (action === "minus") {
        if (current <= 0) return prev
        return { ...prev, [type]: current - 1 }
      }

      return { ...prev, [type]: current + 1 }
    })
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setActiveDropdown(null)
        setCalendarOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    setService(defaultService)
  }, [defaultService])

  useEffect(() => {
    if (!activeDropdown && !calendarOpen) return

    const timer = setTimeout(() => {
      const panel = searchRef.current?.querySelector("[data-dropdown-panel]")
      panel?.scrollIntoView({ block: "nearest", behavior: "smooth" })
    }, 60)

    return () => clearTimeout(timer)
  }, [activeDropdown, calendarOpen])

  const getFields = () => {
    if (service === "Umrah") {
      return [
        {
          label: "Departure City",
          placeholder: "Select your city",
          icon: <FaPlaneDeparture />,
          type: "select",
          options: departureCityOptions,
        },
        {
          label: "Travel Month",
          placeholder: "Choose a month",
          icon: <FaCalendarAlt />,
          type: "monthPicker",
        },
        {
          label: "Package Type",
          placeholder: "Economy / Premium / VIP",
          icon: <FaSuitcase />,
          type: "select",
          options: packageTypeOptions,
        },
        {
          label: "Hotel Nights",
          placeholder: "Select nights",
          icon: <FaMoon />,
          type: "nights",
        },
        {
          label: "Travelers",
          placeholder: passengerText,
          icon: <FaUsers />,
          type: "passengers",
        },
      ]
    }

    if (service === "Visa Assistance") {
      return [
        {
          label: "Country",
          placeholder: "Select country",
          icon: <FaGlobeAsia />,
          type: "select",
          options: visaOptions,
        },
        {
          label: "Travel Date",
          placeholder: "Select date",
          icon: <FaCalendarAlt />,
          type: "date",
        },
        {
          label: "Applicants",
          placeholder: passengerText,
          icon: <FaUsers />,
          type: "passengers",
        },
      ]
    }

    if (service === "Hotel Booking") {
      return [
        {
          label: "Location",
          placeholder: "Where are you staying?",
          icon: <FaHotel />,
          type: "select",
          options: hotelOptions,
        },
        {
          label: "Check In",
          placeholder: "Select date",
          icon: <FaCalendarAlt />,
          type: "date",
        },
        {
          label: "Check Out",
          placeholder: "Select date",
          icon: <FaCalendarAlt />,
          type: "date",
        },
        {
          label: "Guests",
          placeholder: passengerText,
          icon: <FaUsers />,
          type: "passengers",
        },
      ]
    }

    if (service === "Tickets") {
      return [
        {
          label: "Ticket Type",
          placeholder: "Domestic / International",
          icon: <FaTicketAlt />,
          type: "select",
          options: ticketTypeOptions,
        },
        {
          label: "From City",
          placeholder: "Select departure city",
          icon: <FaPlaneDeparture />,
          type: "select",
          options: departureCityOptions,
        },
        {
          label: "To City",
          placeholder: "Select destination",
          icon: <FaMapMarkerAlt />,
          type: "select",
          options: ticketDestinationOptions,
        },
        {
          label: "Travel Date",
          placeholder: "Select date",
          icon: <FaCalendarAlt />,
          type: "date",
        },
        {
          label: "Travelers",
          placeholder: passengerText,
          icon: <FaUsers />,
          type: "passengers",
        },
      ]
    }

    if (service === "Transport Services") {
      return [
        {
          label: "Pickup Location",
          placeholder: "Select your city",
          icon: <FaMapMarkerAlt />,
          type: "select",
          options: departureCityOptions,
        },
        {
          label: "Rental Date",
          placeholder: "Select date",
          icon: <FaCalendarAlt />,
          type: "date",
        },
        {
          label: "Car Type",
          placeholder: "Select car",
          icon: <FaCar />,
          type: "select",
          options: carOptions,
        },
      ]
    }

    return [
      {
        label: "Destination",
        placeholder: "Select destination",
        icon: <FaMapMarkerAlt />,
        type: "select",
        options: arrivalOptions,
      },
      {
        label: "Travel Date",
        placeholder: "Select date",
        icon: <FaCalendarAlt />,
        type: "date",
      },
      {
        label: "Return Date",
        placeholder: "Select date",
        icon: <FaCalendarAlt />,
        type: "date",
      },
      {
        label: "Travelers",
        placeholder: passengerText,
        icon: <FaUsers />,
        type: "passengers",
      },
    ]
  }

  const isFieldFilled = (field) => {
    if (field.type === "passengers") return passengersTouched
    if (field.type === "nights") return nightsTouched
    return Boolean(formValues[field.label])
  }

  const openField = (field) => {
    if (!field) {
      setActiveDropdown(null)
      setCalendarOpen(false)
      return
    }

    if (field.type === "date") {
      setCalendarOpen(field.label)
      setActiveDropdown(null)
    } else {
      setActiveDropdown(field.label)
      setCalendarOpen(false)
    }
  }

  const advanceFrom = (label) => {
    const fieldList = getFields()
    const index = fieldList.findIndex((f) => f.label === label)
    const next = fieldList[index + 1]

    if (next && !isFieldFilled(next)) {
      openField(next)
    } else {
      setActiveDropdown(null)
      setCalendarOpen(false)
    }
  }

  const selectValue = (field, value) => {
    setFormValues((prev) => ({ ...prev, [field.label]: value }))
    advanceFrom(field.label)
  }

  const renderCalendar = (field) => {
    const year = calendarMonth.getFullYear()
    const month = calendarMonth.getMonth()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const firstDay = new Date(year, month, 1).getDay()

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const years = Array.from(
      { length: 8 },
      (_, index) => today.getFullYear() + index
    )

    const days = []

    for (let i = 0; i < firstDay; i++) days.push(null)
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }

    return (
      <div
        data-dropdown-panel
        className="absolute left-1/2 top-[calc(100%+10px)] z-[9999] w-[min(20rem,calc(100vw-2rem))] -translate-x-1/2 rounded-[5px] border border-slate-100 bg-white p-4 shadow-[0_18px_45px_rgba(15,23,42,0.16)] sm:left-0 sm:w-96 sm:translate-x-0"
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setCalendarMonth(new Date(year, month - 1, 1))}
            className="flex h-10 w-10 items-center justify-center rounded-[5px] bg-slate-100 text-slate-700 hover:bg-[#00AEEF] hover:text-white"
          >
            <FaChevronLeft />
          </button>

          <div className="grid flex-1 grid-cols-2 gap-2">
            <select
              value={month}
              onChange={(event) =>
                setCalendarMonth(new Date(year, Number(event.target.value), 1))
              }
              className="h-10 rounded-[5px] border border-slate-200 bg-slate-50 px-2 text-xs outline-none focus:border-[#00AEEF]"
            >
              {monthNames.map((monthName, index) => (
                <option key={monthName} value={index}>
                  {monthName}
                </option>
              ))}
            </select>

            <select
              value={year}
              onChange={(event) =>
                setCalendarMonth(new Date(Number(event.target.value), month, 1))
              }
              className="h-10 rounded-[5px] border border-slate-200 bg-slate-50 px-2 text-xs outline-none focus:border-[#00AEEF]"
            >
              {years.map((yearOption) => (
                <option key={yearOption} value={yearOption}>
                  {yearOption}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={() => setCalendarMonth(new Date(year, month + 1, 1))}
            className="flex h-10 w-10 items-center justify-center rounded-[5px] bg-slate-100 text-slate-700 hover:bg-[#00AEEF] hover:text-white"
          >
            <FaChevronRight />
          </button>
        </div>

        <div className="mb-2 grid grid-cols-7 text-center text-[10px] font-semibold uppercase text-slate-400">
          {["S", "M", "T", "W", "T", "F", "S"].map((dayName, index) => (
            <span key={`${dayName}-${index}`}>{dayName}</span>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {days.map((date, index) => {
            if (!date) return <div key={`empty-${index}`} className="h-9" />

            const disabled = date < today
            const selected = formValues[field.label] === formatDate(date)

            return (
              <button
                key={date.toISOString()}
                type="button"
                disabled={disabled}
                onClick={() => selectValue(field, formatDate(date))}
                className={`h-9 rounded-[5px] text-sm font-medium ${
                  disabled
                    ? "cursor-not-allowed text-slate-300"
                    : selected
                    ? "bg-[#00AEEF] text-white"
                    : "text-slate-700 hover:bg-sky-50 hover:text-[#00AEEF]"
                }`}
              >
                {date.getDate()}
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  const renderMonthPicker = (field) => {
    const now = new Date()
    const currentYear = now.getFullYear()
    const currentMonth = now.getMonth()

    return (
      <div
        data-dropdown-panel
        className="absolute left-0 top-[calc(100%+10px)] z-[9999] w-[min(20rem,calc(100vw-2rem))] rounded-[5px] border border-slate-100 bg-white p-4 shadow-[0_18px_45px_rgba(15,23,42,0.16)]"
      >
        <div className="mb-3 flex items-center justify-between">
          <button
            type="button"
            disabled={pickerYear <= currentYear}
            onClick={() => setPickerYear((year) => year - 1)}
            className={`flex h-9 w-9 items-center justify-center rounded-[5px] ${
              pickerYear <= currentYear
                ? "cursor-not-allowed bg-slate-50 text-slate-300"
                : "bg-slate-100 text-slate-700 hover:bg-[#00AEEF] hover:text-white"
            }`}
          >
            <FaChevronLeft />
          </button>

          <span className="font-poppins text-sm font-semibold text-slate-900">
            {pickerYear}
          </span>

          <button
            type="button"
            onClick={() => setPickerYear((year) => year + 1)}
            className="flex h-9 w-9 items-center justify-center rounded-[5px] bg-slate-100 text-slate-700 hover:bg-[#00AEEF] hover:text-white"
          >
            <FaChevronRight />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {monthNames.map((monthName, index) => {
            const disabled = pickerYear === currentYear && index < currentMonth
            const value = `${monthName} ${pickerYear}`
            const selected = formValues[field.label] === value

            return (
              <button
                key={monthName}
                type="button"
                disabled={disabled}
                onClick={() => selectValue(field, value)}
                className={`h-10 rounded-[5px] text-[13px] font-medium transition-colors ${
                  disabled
                    ? "cursor-not-allowed text-slate-300"
                    : selected
                    ? "bg-[#00AEEF] text-white"
                    : "text-slate-700 hover:bg-sky-50 hover:text-[#00AEEF]"
                }`}
              >
                {monthName.slice(0, 3)}
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  const fields = getFields()

  return (
    <div
      ref={searchRef}
      className="relative z-[80] mx-auto w-full max-w-[1080px] overflow-visible rounded-[10px] border border-white/70 bg-white/95 shadow-[0_24px_60px_rgba(15,23,42,0.10)] backdrop-blur"
    >
      {/* Integrated service tabs */}
      <div className="flex flex-wrap gap-1 border-b border-slate-100 px-3 pt-1">
        {services.map((item) => {
          const isActive = service === item.name

          return (
            <button
              key={item.name}
              type="button"
              onClick={() => {
                setService(item.name)
                setActiveDropdown(null)
                setCalendarOpen(false)
              }}
              className={`relative flex items-center gap-2 px-5 py-3.5 text-[13px] font-semibold transition-colors duration-200 ${
                isActive
                  ? "text-[#FF6B00]"
                  : "text-slate-500 hover:text-[#00AEEF]"
              }`}
            >
              <span className="text-[18px]">{item.icon}</span>
              {item.name}

              <span
                className={`absolute bottom-0 left-3 right-3 h-[2.5px] origin-center rounded-full bg-[#FF6B00] transition-transform duration-300 ${
                  isActive ? "scale-x-100" : "scale-x-0"
                }`}
              />
            </button>
          )
        })}
      </div>

      {/* Search fields + button */}
      <div className="overflow-visible p-3.5">
        <div className="flex flex-col gap-2.5 overflow-visible lg:flex-row lg:items-end">
          <div
            className={`grid flex-1 gap-2.5 overflow-visible ${
              fields.length === 5
                ? "sm:grid-cols-2 lg:grid-cols-5"
                : fields.length === 4
                ? "sm:grid-cols-2 lg:grid-cols-4"
                : "sm:grid-cols-3"
            }`}
          >
            {fields.map((field) => {
              const fieldIsOpen =
                activeDropdown === field.label || calendarOpen === field.label

              return (
                <div
                  key={field.label}
                  className={`relative ${fieldIsOpen ? "z-[100]" : "z-10"}`}
                >
                  <span className="absolute left-4 top-1/2 z-10 -translate-y-1/2 text-base text-[#00AEEF]">
                    {field.icon}
                  </span>

                  {field.type === "select" && (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveDropdown(
                            activeDropdown === field.label ? null : field.label
                          )
                          setCalendarOpen(false)
                        }}
                        className="peer flex h-12 w-full items-center justify-between rounded-[5px] border border-slate-200 bg-white px-4 pl-12 pt-[18px] text-left text-[13px] font-medium hover:border-[#00AEEF]"
                      >
                        <span
                          className={`truncate ${
                            formValues[field.label]
                              ? "text-slate-900"
                              : "text-slate-500"
                          }`}
                        >
                          {formValues[field.label] || field.placeholder}
                        </span>

                        <FaChevronDown
                          className={`text-xs text-slate-400 transition-transform duration-200 ${
                            activeDropdown === field.label ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {activeDropdown === field.label && (
                        <div
                          data-dropdown-panel
                          className="absolute left-0 top-[calc(100%+10px)] z-[9999] w-full overflow-hidden rounded-[5px] border border-slate-100 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.16)]"
                        >
                          <div className="max-h-60 overflow-y-auto p-2">
                            {field.options.map((option) => {
                              const selected =
                                formValues[field.label] === option

                              return (
                                <button
                                  type="button"
                                  key={option}
                                  onClick={() => selectValue(field, option)}
                                  className={`flex w-full items-center gap-3 rounded-[5px] px-3 py-3 text-left text-sm font-medium ${
                                    selected
                                      ? "bg-sky-50 text-[#00AEEF]"
                                      : "text-slate-700 hover:bg-sky-50 hover:text-[#00AEEF]"
                                  }`}
                                >
                                  <span className="text-[#00AEEF]">
                                    {field.icon}
                                  </span>
                                  <span className="truncate">{option}</span>
                                </button>
                              )
                            })}
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {field.type === "monthPicker" && (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveDropdown(
                            activeDropdown === field.label ? null : field.label
                          )
                          setCalendarOpen(false)
                        }}
                        className="peer flex h-12 w-full items-center justify-between rounded-[5px] border border-slate-200 bg-white px-4 pl-12 pt-[18px] text-left text-[13px] font-medium hover:border-[#00AEEF]"
                      >
                        <span
                          className={`truncate ${
                            formValues[field.label]
                              ? "text-slate-900"
                              : "text-slate-500"
                          }`}
                        >
                          {formValues[field.label] || field.placeholder}
                        </span>

                        <FaChevronDown
                          className={`text-xs text-slate-400 transition-transform duration-200 ${
                            activeDropdown === field.label ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {activeDropdown === field.label &&
                        renderMonthPicker(field)}
                    </>
                  )}

                  {field.type === "date" && (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setCalendarOpen(
                            calendarOpen === field.label ? false : field.label
                          )
                          setActiveDropdown(null)
                        }}
                        className="peer h-12 w-full rounded-[5px] border border-slate-200 bg-white px-4 pl-12 pt-[18px] text-left text-[13px] font-medium hover:border-[#00AEEF]"
                      >
                        <span
                          className={`block truncate ${
                            formValues[field.label]
                              ? "text-slate-900"
                              : "text-slate-500"
                          }`}
                        >
                          {formValues[field.label] || field.placeholder}
                        </span>
                      </button>

                      {calendarOpen === field.label && renderCalendar(field)}
                    </>
                  )}

                  {field.type === "passengers" && (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveDropdown(
                            activeDropdown === field.label ? null : field.label
                          )
                          setCalendarOpen(false)
                        }}
                        className="peer flex h-12 w-full items-center justify-between rounded-[5px] border border-slate-200 bg-white px-4 pl-12 pt-[18px] text-left text-[13px] font-medium text-slate-900 hover:border-[#00AEEF]"
                      >
                        <span className="truncate">{field.placeholder}</span>

                        <FaChevronDown
                          className={`text-xs text-slate-400 transition-transform duration-200 ${
                            activeDropdown === field.label ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {activeDropdown === field.label && (
                        <div
                          data-dropdown-panel
                          className="absolute left-0 top-[calc(100%+10px)] z-[9999] w-[280px] max-w-[calc(100vw-2rem)] rounded-[5px] border border-slate-100 bg-white p-4 shadow-[0_18px_45px_rgba(15,23,42,0.16)] sm:left-auto sm:right-0"
                        >
                          {[
                            {
                              key: "adults",
                              title: "Adults",
                              note: "Age 12+",
                            },
                            {
                              key: "children",
                              title: "Children",
                              note: "Age 2–11",
                            },
                          ].map((item, index) => (
                            <div
                              key={item.key}
                              className={`flex items-center justify-between ${
                                index === 0
                                  ? "border-b border-slate-100 pb-4"
                                  : "pt-4"
                              }`}
                            >
                              <div>
                                <p className="text-sm font-medium text-slate-950">
                                  {item.title}
                                </p>
                                <p className="text-xs font-medium text-slate-400">
                                  {item.note}
                                </p>
                              </div>

                              <div className="flex items-center gap-3">
                                <button
                                  type="button"
                                  onClick={() =>
                                    updatePassenger(item.key, "minus")
                                  }
                                  className="flex h-8 w-8 items-center justify-center rounded-[5px] bg-slate-100 text-xs text-slate-700 hover:bg-slate-200"
                                >
                                  <FaMinus />
                                </button>

                                <span className="w-6 text-center text-sm font-medium text-slate-950">
                                  {passengers[item.key]}
                                </span>

                                <button
                                  type="button"
                                  onClick={() =>
                                    updatePassenger(item.key, "plus")
                                  }
                                  className="flex h-8 w-8 items-center justify-center rounded-[5px] bg-[#00AEEF] text-xs text-white hover:bg-[#FF6B00]"
                                >
                                  <FaPlus />
                                </button>
                              </div>
                            </div>
                          ))}

                          <button
                            type="button"
                            onClick={() => {
                              setPassengersTouched(true)
                              advanceFrom(field.label)
                            }}
                            className="mt-4 w-full rounded-[5px] bg-[#FF6B00] py-3 text-sm font-medium text-white hover:bg-[#00AEEF]"
                          >
                            Done
                          </button>
                        </div>
                      )}
                    </>
                  )}

                  {field.type === "nights" && (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveDropdown(
                            activeDropdown === field.label ? null : field.label
                          )
                          setCalendarOpen(false)
                        }}
                        className="peer flex h-12 w-full items-center justify-between rounded-[5px] border border-slate-200 bg-white px-4 pl-12 pt-[18px] text-left text-[13px] font-medium hover:border-[#00AEEF]"
                      >
                        <span
                          className={`truncate ${
                            nightsTouched ? "text-slate-900" : "text-slate-500"
                          }`}
                        >
                          {nightsTouched ? nightsText : field.placeholder}
                        </span>

                        <FaChevronDown
                          className={`text-xs text-slate-400 transition-transform duration-200 ${
                            activeDropdown === field.label ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {activeDropdown === field.label && (
                        <div
                          data-dropdown-panel
                          className="absolute left-0 top-[calc(100%+10px)] z-[9999] w-[280px] max-w-[calc(100vw-2rem)] rounded-[5px] border border-slate-100 bg-white p-4 shadow-[0_18px_45px_rgba(15,23,42,0.16)] sm:left-auto sm:right-0"
                        >
                          {[
                            {
                              key: "makkah",
                              title: "Makkah",
                              note: "Nights in Makkah",
                            },
                            {
                              key: "madinah",
                              title: "Madinah",
                              note: "Nights in Madinah",
                            },
                          ].map((item, index) => (
                            <div
                              key={item.key}
                              className={`flex items-center justify-between ${
                                index === 0
                                  ? "border-b border-slate-100 pb-4"
                                  : "pt-4"
                              }`}
                            >
                              <div>
                                <p className="text-sm font-medium text-slate-950">
                                  {item.title}
                                </p>
                                <p className="text-xs font-medium text-slate-400">
                                  {item.note}
                                </p>
                              </div>

                              <div className="flex items-center gap-3">
                                <button
                                  type="button"
                                  onClick={() => updateNights(item.key, "minus")}
                                  className="flex h-8 w-8 items-center justify-center rounded-[5px] bg-slate-100 text-xs text-slate-700 hover:bg-slate-200"
                                >
                                  <FaMinus />
                                </button>

                                <span className="w-6 text-center text-sm font-medium text-slate-950">
                                  {nights[item.key]}
                                </span>

                                <button
                                  type="button"
                                  onClick={() => updateNights(item.key, "plus")}
                                  className="flex h-8 w-8 items-center justify-center rounded-[5px] bg-[#00AEEF] text-xs text-white hover:bg-[#FF6B00]"
                                >
                                  <FaPlus />
                                </button>
                              </div>
                            </div>
                          ))}

                          <div className="mt-4 flex items-center justify-between rounded-[5px] bg-sky-50 px-3 py-2.5">
                            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                              Total Nights
                            </span>
                            <span className="text-sm font-bold text-[#00AEEF]">
                              {nights.makkah + nights.madinah}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              setNightsTouched(true)
                              advanceFrom(field.label)
                            }}
                            className="mt-3 w-full rounded-[5px] bg-[#FF6B00] py-3 text-sm font-medium text-white hover:bg-[#00AEEF]"
                          >
                            Done
                          </button>
                        </div>
                      )}
                    </>
                  )}

                  <label className="pointer-events-none absolute left-12 top-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400 peer-focus:text-[#00AEEF]">
                    {field.label}
                  </label>
                </div>
              )
            })}
          </div>

          <Link
            to={getSearchPath()}
            className="inline-flex h-12 w-full shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-[5px] bg-[#FF6B00] px-7 text-[13px] font-semibold uppercase text-white shadow-[0_10px_26px_rgba(255,107,0,0.25)] transition-all duration-300 hover:bg-[#00AEEF] hover:shadow-[0_10px_26px_rgba(0,174,239,0.25)] lg:w-auto"
          >
            <FaSearch />
            {getSearchLabel()}
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ServiceSearchBar