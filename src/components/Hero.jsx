import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import {
  FaPlaneDeparture,
  FaPlaneArrival,
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
} from "react-icons/fa"
import airplane from "../assets/airplane.jpeg"
import clockTower from "../assets/clock-tower.avif"
import kaaba from "../assets/kaaba.avif"
import madinah from "../assets/madinah.jpeg"
import naran from "../assets/Naran-Kaghan.webp"
const heroImages = [kaaba, madinah, naran, clockTower, airplane]

const services = ["Umrah", "Hotels", "Tours", "Flights", "Car Rental"]

const departureOptions = [
  "Karachi - Jinnah International Airport",
  "Lahore - Allama Iqbal International Airport",
  "Islamabad International Airport",
  "Peshawar - Bacha Khan International Airport",
  "Multan International Airport",
  "Quetta International Airport",
  "Sialkot International Airport",
]

const arrivalOptions = [
  "Jeddah Airport",
  "Madinah Airport",
  "Makkah",
  "Madinah",
  "Dubai",
  "Istanbul",
  "Baku",
  "Naran Kaghan",
  "Nathiagali Ayubia",
  "Islamabad",
]

const hotelOptions = [
  "Makkah",
  "Madinah",
  "Dubai",
  "Istanbul",
  "Baku",
  "Naran",
  "Islamabad",
]

const carOptions = ["Economy Car", "SUV", "Luxury Car", "Coaster / Van"]

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

const formatDate = (date) => {
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

const Hero = () => {
  const [active, setActive] = useState(0)
  const [service, setService] = useState("Umrah")
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const [activeDropdown, setActiveDropdown] = useState(null)
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [calendarMonth, setCalendarMonth] = useState(new Date())

  const [formValues, setFormValues] = useState({})
  const [passengers, setPassengers] = useState({
    adults: 1,
    children: 0,
  })

  const servicesRef = useRef(null)
  const searchRef = useRef(null)

  const getSearchPath = () => {
    if (service === "Umrah") return "/umrah"
    if (service === "Tours") return "/tours"
    if (service === "Hotels") return "/hotels"
    if (service === "Flights") return "/flights"
    if (service === "Car Rental") return "/car-rental"
    return "/contact"
  }

  const updateScrollButtons = () => {
    if (!servicesRef.current) return

    const { scrollLeft, scrollWidth, clientWidth } = servicesRef.current

    setCanScrollLeft(scrollLeft > 5)
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5)
  }

  const scrollServices = (direction) => {
    if (!servicesRef.current) return

    servicesRef.current.scrollBy({
      left: direction === "right" ? 140 : -140,
      behavior: "smooth",
    })

    setTimeout(updateScrollButtons, 300)
  }

  const updatePassenger = (type, action) => {
    setPassengers((prev) => {
      const current = prev[type]

      if (action === "minus") {
        if (type === "adults" && current <= 1) return prev
        if (type === "children" && current <= 0) return prev

        return {
          ...prev,
          [type]: current - 1,
        }
      }

      return {
        ...prev,
        [type]: current + 1,
      }
    })
  }

  const passengerText = `${passengers.adults} Adult${
    passengers.adults > 1 ? "s" : ""
  } / ${passengers.children} Child${passengers.children === 1 ? "" : "ren"}`

  useEffect(() => {
    if (heroImages.length <= 1) return

    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % heroImages.length)
    }, 4500)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    updateScrollButtons()

    const current = servicesRef.current
    if (!current) return

    current.addEventListener("scroll", updateScrollButtons)
    window.addEventListener("resize", updateScrollButtons)

    return () => {
      current.removeEventListener("scroll", updateScrollButtons)
      window.removeEventListener("resize", updateScrollButtons)
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setActiveDropdown(null)
        setCalendarOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const getFields = () => {
    if (service === "Umrah") {
      return [
        {
          label: "Departure Airport",
          placeholder: "Select or type airport",
          icon: <FaPlaneDeparture />,
          type: "search",
          options: departureOptions,
        },
        {
          label: "Arrival City",
          placeholder: "Makkah / Madinah / Jeddah",
          icon: <FaPlaneArrival />,
          type: "search",
          options: ["Jeddah Airport", "Madinah Airport", "Makkah", "Madinah"],
        },
        {
          label: "Travel Date",
          placeholder: "Select travel date",
          icon: <FaCalendarAlt />,
          type: "date",
        },
        {
          label: "Passengers",
          placeholder: passengerText,
          icon: <FaUsers />,
          type: "passengers",
        },
      ]
    }

    if (service === "Flights") {
      return [
        {
          label: "From",
          placeholder: "Select or type city",
          icon: <FaPlaneDeparture />,
          type: "search",
          options: departureOptions,
        },
        {
          label: "To",
          placeholder: "Select or type city",
          icon: <FaPlaneArrival />,
          type: "search",
          options: arrivalOptions,
        },
        {
          label: "Depart",
          placeholder: "Select date",
          icon: <FaCalendarAlt />,
          type: "date",
        },
        {
          label: "Passengers",
          placeholder: passengerText,
          icon: <FaUsers />,
          type: "passengers",
        },
      ]
    }

    if (service === "Hotels") {
      return [
        {
          label: "Location",
          placeholder: "Where are you going?",
          icon: <FaHotel />,
          type: "search",
          options: hotelOptions,
        },
        {
          label: "Check In",
          placeholder: "Select check-in date",
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

    if (service === "Car Rental") {
      return [
        {
          label: "Pickup Location",
          placeholder: "City / airport",
          icon: <FaCar />,
          type: "search",
          options: departureOptions,
        },
        {
          label: "Rental Date",
          placeholder: "Select date",
          icon: <FaCalendarAlt />,
          type: "date",
        },
        {
          label: "Car Type",
          placeholder: "Select car type",
          icon: <FaCar />,
          type: "search",
          options: carOptions,
        },
      ]
    }

    return [
      {
        label: "Destination",
        placeholder: "Select or type destination",
        icon: <FaMapMarkerAlt />,
        type: "search",
        options: arrivalOptions,
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

  const getFilteredOptions = (field) => {
    const value = formValues[field.label] || ""

    if (!value) return field.options

    return field.options.filter((option) =>
      option.toLowerCase().includes(value.toLowerCase())
    )
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
      (_, i) => today.getFullYear() + i
    )

    const days = []

    for (let i = 0; i < firstDay; i++) {
      days.push(null)
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }

    return (
      <div className="absolute left-1/2 top-[4.8rem] z-[999] w-[min(23rem,calc(100vw-2rem))] -translate-x-1/2 rounded-[1.5rem] border border-slate-100 bg-white p-4 shadow-2xl sm:left-0 sm:w-96 sm:translate-x-0">
        <div className="mb-4 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setCalendarMonth(new Date(year, month - 1, 1))}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition hover:bg-[#00AEEF] hover:text-white"
            aria-label="Previous month"
          >
            <FaChevronLeft />
          </button>

          <div className="grid flex-1 grid-cols-2 gap-2">
            <select
              value={month}
              onChange={(e) =>
                setCalendarMonth(new Date(year, Number(e.target.value), 1))
              }
              className="h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-medium text-slate-900 outline-none focus:border-[#00AEEF]"
            >
              {monthNames.map((monthName, index) => (
                <option key={monthName} value={index}>
                  {monthName}
                </option>
              ))}
            </select>

            <select
              value={year}
              onChange={(e) =>
                setCalendarMonth(new Date(Number(e.target.value), month, 1))
              }
              className="h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-medium text-slate-900 outline-none focus:border-[#00AEEF]"
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
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition hover:bg-[#00AEEF] hover:text-white"
            aria-label="Next month"
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
                onClick={() => {
                  setFormValues((prev) => ({
                    ...prev,
                    [field.label]: formatDate(date),
                  }))
                  setCalendarOpen(false)
                }}
                className={`h-9 rounded-xl text-sm font-medium transition ${
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

  return (
    <section
  id="home"
  className="relative min-h-[calc(100vh-5rem)] overflow-visible bg-cover bg-center bg-no-repeat"
  style={{ backgroundImage: `url(${heroImages[active]})` }}
>
  {heroImages.map((img, index) => (
    <img
      key={img}
      src={img}
      alt="TravelEx background"
      className={`absolute inset-0 h-full w-full object-cover transition-all duration-1000 ${
        index === active ? "opacity-100 scale-100" : "opacity-0 scale-105"
      }`}
    />
  ))}

  <div className="absolute inset-0 bg-[#07111f]/55" />

  <div className="absolute inset-0 bg-gradient-to-r from-[#07111f]/85 via-[#07111f]/55 to-transparent" />
      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-5rem)] max-w-7xl flex-col px-4 sm:px-6">
        <div className="flex flex-1 items-center py-8 sm:py-10">
          <div className="w-full max-w-6xl text-white">
    <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.22em] text-white/80 sm:mb-4 sm:text-sm md:text-base">
  UMRAH • TOURS • VISA SUPPORT
</p>

            <h1 className="max-w-4xl text-[30px] leading-[1.08] text-white sm:text-5xl lg:text-6xl">
  Start Your Journey with{" "}
  <span className="font-sans font-extrabold">
    <span className="text-[#FF6B00]">Travel</span>
    <span className="text-[#00AEEF]">Ex</span>
  </span>
  .pk
</h1>

<p className="mt-3 hidden max-w-2xl text-sm font-medium leading-7 text-white/90 sm:block sm:text-base lg:text-lg">
  Serving travelers from Peshawar with transparent packages, WhatsApp support,
  and 17+ years of experience.
</p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:gap-4">
              <Link
                to="/umrah"
                className="rounded-full bg-white px-7 py-3 text-center text-sm font-medium text-slate-900 shadow-lg transition-colors duration-300 hover:bg-[#FF6B00] hover:text-white"
              >
                View Packages
              </Link>

              <Link
                to="/contact"
                className="rounded-full bg-[#00AEEF] px-7 py-3 text-center text-sm font-medium text-white shadow-lg transition-colors duration-300 hover:bg-white hover:text-[#00AEEF]"
              >
                Talk to Consultant
              </Link>
            </div>

            {/* SEARCH BAR */}
            <div
              ref={searchRef}
              className="mt-5 w-full max-w-6xl rounded-[1.5rem] border border-white/20 bg-white/10 p-3 shadow-2xl backdrop-blur-2xl sm:rounded-[2rem]"
            >
              {/* Services */}
              <div className="relative mb-3">
                {canScrollLeft && (
                  <button
                    type="button"
                    onClick={() => scrollServices("left")}
                    className="absolute left-0 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white text-sm font-medium text-slate-900 shadow-md md:hidden"
                    aria-label="Scroll services left"
                  >
                    ‹
                  </button>
                )}

                <div
                  ref={servicesRef}
                  className={`scrollbar-hide flex gap-2 overflow-x-auto pb-1 md:px-0 ${
                    canScrollLeft ? "pl-9" : "pl-0"
                  } ${canScrollRight ? "pr-9" : "pr-0"}`}
                >
                  {services.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => {
                        setService(item)
                        setActiveDropdown(null)
                        setCalendarOpen(false)
                      }}
                      className={`min-w-fit rounded-full px-5 py-2 text-sm font-medium transition-colors duration-300 ${
                        service === item
                          ? "bg-[#00AEEF] text-white"
                          : "bg-white/90 text-slate-800 hover:bg-white"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>

                {canScrollRight && (
                  <button
                    type="button"
                    onClick={() => scrollServices("right")}
                    className="absolute right-0 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white text-sm font-medium text-slate-900 shadow-md md:hidden"
                    aria-label="Scroll services right"
                  >
                    ›
                  </button>
                )}
              </div>

              {/* Fields */}
              <div className="rounded-[1.25rem] bg-white p-3 text-slate-900 shadow-sm sm:rounded-[1.5rem]">
                <div
                  className={`grid gap-3 ${
                    getFields().length === 4
                      ? "md:grid-cols-2 xl:grid-cols-4"
                      : "md:grid-cols-3"
                  }`}
                >
                  {getFields().map((field) => (
                    <div key={field.label} className="relative">
                      <span className="absolute left-4 top-1/2 z-10 -translate-y-1/2 text-lg text-[#00AEEF]">
                        {field.icon}
                      </span>

                      {field.type === "search" && (
                        <>
                          <input
                            type="text"
                            value={formValues[field.label] || ""}
                            onFocus={() => {
                              setActiveDropdown(field.label)
                              setCalendarOpen(false)
                            }}
                            onChange={(e) => {
                              setFormValues((prev) => ({
                                ...prev,
                                [field.label]: e.target.value,
                              }))
                              setActiveDropdown(field.label)
                            }}
                            placeholder={field.placeholder}
                            className="peer h-16 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 pl-12 pt-5 text-sm font-medium text-slate-900 outline-none transition-all duration-300 placeholder:text-slate-500 focus:border-[#00AEEF] focus:bg-white"
                          />

                          {activeDropdown === field.label && (
                            <div className="absolute left-1/2 top-[4.8rem] z-[999] w-[min(22rem,calc(100vw-2rem))] -translate-x-1/2 overflow-hidden rounded-[1.5rem] border border-slate-100 bg-white shadow-2xl sm:left-0 sm:w-80 sm:translate-x-0">
                              <div className="max-h-60 overflow-y-auto p-2">
                                {getFilteredOptions(field).map((option) => (
                                  <button
                                    type="button"
                                    key={option}
                                    onClick={() => {
                                      setFormValues((prev) => ({
                                        ...prev,
                                        [field.label]: option,
                                      }))
                                      setActiveDropdown(null)
                                    }}
                                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-sky-50 hover:text-[#00AEEF]"
                                  >
                                    <span className="text-[#00AEEF]">
                                      {field.icon}
                                    </span>
                                    <span className="line-clamp-1">
                                      {option}
                                    </span>
                                  </button>
                                ))}

                                {getFilteredOptions(field).length === 0 && (
                                  <p className="px-3 py-4 text-sm font-medium text-slate-400">
                                    No option found. You can keep your typed
                                    value.
                                  </p>
                                )}
                              </div>
                            </div>
                          )}
                        </>
                      )}

                      {field.type === "date" && (
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              setCalendarOpen(
                                calendarOpen === field.label
                                  ? false
                                  : field.label
                              )
                              setActiveDropdown(null)
                            }}
                            className="peer h-16 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 pl-12 pt-5 text-left text-sm font-medium text-slate-900 outline-none transition-all duration-300 hover:border-[#00AEEF] hover:bg-white"
                          >
                            {formValues[field.label] || field.placeholder}
                          </button>

                          {calendarOpen === field.label &&
                            renderCalendar(field)}
                        </>
                      )}

                      {field.type === "passengers" && (
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              setActiveDropdown(
                                activeDropdown === field.label
                                  ? null
                                  : field.label
                              )
                              setCalendarOpen(false)
                            }}
                            className="peer flex h-16 w-full items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 pl-12 pt-5 text-left text-sm font-medium text-slate-900 outline-none transition-all duration-300 hover:border-[#00AEEF] hover:bg-white"
                          >
                            <span>{field.placeholder}</span>
                            <FaChevronDown className="text-xs text-slate-400" />
                          </button>

                          {activeDropdown === field.label && (
                            <div className="absolute left-1/2 top-[4.8rem] z-[999] w-[min(22rem,calc(100vw-2rem))] -translate-x-1/2 rounded-[1.5rem] border border-slate-100 bg-white p-4 shadow-2xl sm:left-0 sm:w-80 sm:translate-x-0">
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
                                      className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-xs text-slate-700 transition hover:bg-slate-200"
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
                                      className="flex h-9 w-9 items-center justify-center rounded-full bg-[#00AEEF] text-xs text-white transition hover:bg-[#FF6B00]"
                                    >
                                      <FaPlus />
                                    </button>
                                  </div>
                                </div>
                              ))}

                              <button
                                type="button"
                                onClick={() => setActiveDropdown(null)}
                                className="mt-4 w-full rounded-full bg-[#FF6B00] py-3 text-sm font-medium text-white transition hover:bg-[#00AEEF]"
                              >
                                Done
                              </button>
                            </div>
                          )}
                        </>
                      )}

                      <label className="search-label pointer-events-none absolute left-12 top-2 text-slate-400 transition-all duration-300 peer-focus:text-[#00AEEF]">
                        {field.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Search button outside input row */}
              <div className="mt-4 flex justify-end">
                <Link
                  to={getSearchPath()}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#FF6B00] px-7 py-3.5 text-sm font-semibold uppercase text-white shadow-lg transition-colors duration-300 hover:bg-[#00AEEF] sm:w-auto"
                >
                  <FaSearch />
                  Search
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero