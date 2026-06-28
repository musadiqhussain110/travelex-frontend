import { useRef, useState } from "react"
import { Link } from "react-router-dom"
import {
  FaArrowRight,
  FaCalendarAlt,
  FaCar,
  FaCheckCircle,
  FaClock,
  FaEnvelope,
  FaGlobeAsia,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaPlaneArrival,
  FaRoute,
  FaShieldAlt,
  FaSuitcaseRolling,
  FaUserTie,
  FaUsers,
  FaWhatsapp,
} from "react-icons/fa"

import Footer from "../components/Footer"
import AppSelect from "../components/common/AppSelect"
import { publicApi } from "../services/publicApi"

import carHero1 from "../assets/Cars/Car5.avif"
import carHero4 from "../assets/Cars/Car5.webp"
import carHero5 from "../assets/Cars/Car6.webp"

const vehicleCategories = [
  {
    title: "Economy Car",
    subtitle: "Budget-friendly international rental",
    description:
      "Suitable for city travel, solo travelers, couples, and short international trips.",
    icon: FaCar,
    image: carHero4,
    bestFor: ["City travel", "Budget trips", "Couples"],
  },
  {
    title: "SUV / Family Car",
    subtitle: "Comfortable option for families",
    description:
      "A better option for families, luggage, long routes, and comfortable travel abroad.",
    icon: FaUsers,
    image: carHero5,
    bestFor: ["Families", "Luggage", "Long routes"],
  },
  {
    title: "Luxury / Business Car",
    subtitle: "Premium travel experience",
    description:
      "Ideal for business travel, VIP guests, premium airport pickup, and executive trips.",
    icon: FaUserTie,
    image: carHero1,
    bestFor: ["Business", "VIP pickup", "Premium travel"],
  },
  {
    title: "Van / Group Transport",
    subtitle: "For groups and large families",
    description:
      "Best for group tours, families with luggage, airport transfers, and multi-city routes.",
    icon: FaSuitcaseRolling,
    image: carHero5,
    bestFor: ["Groups", "Families", "Tours"],
  },
  {
    title: "Airport Transfer",
    subtitle: "Private airport pickup and drop-off",
    description:
      "Book airport-to-hotel, hotel-to-airport, and private transfer services in major cities.",
    icon: FaPlaneArrival,
    image: carHero4,
    bestFor: ["Airport pickup", "Hotel transfer", "Easy arrival"],
  },
  {
    title: "Chauffeur Service",
    subtitle: "Driver-included international service",
    description:
      "A guided driver-included option for business, family trips, city tours, and safe travel.",
    icon: FaShieldAlt,
    image: carHero1,
    bestFor: ["With driver", "Safe travel", "Business trips"],
  },
]

const popularDestinations = [
  {
    country: "UAE",
    cities: "Dubai, Abu Dhabi, Sharjah",
    use: "Airport transfers, family cars, chauffeur service",
  },
  {
    country: "Saudi Arabia",
    cities: "Jeddah, Makkah, Madinah, Riyadh",
    use: "Umrah transport, city transfers, group vans",
  },
  {
    country: "Turkey",
    cities: "Istanbul, Antalya, Cappadocia",
    use: "Airport pickup, family rentals, tour transport",
  },
  {
    country: "Malaysia",
    cities: "Kuala Lumpur, Langkawi, Penang",
    use: "City travel, airport transfer, family cars",
  },
  {
    country: "Azerbaijan",
    cities: "Baku, Gabala, Shahdag",
    use: "Tour transport, private driver, SUV options",
  },
  {
    country: "Qatar",
    cities: "Doha",
    use: "Business travel, airport pickup, chauffeur service",
  },
]

const processSteps = [
  {
    title: "Share destination details",
    description:
      "Tell us your country, city, pickup location, travel dates, car type, and passenger count.",
  },
  {
    title: "TravelEx checks availability",
    description:
      "Our team verifies international supplier availability, route details, and suitable options.",
  },
  {
    title: "Get final quote",
    description:
      "You receive a confirmed quote based on destination, dates, car category, driver option, and supplier policy.",
  },
  {
    title: "Confirm your rental",
    description:
      "After confirmation, TravelEx guides you with documents, payment method, and pickup instructions.",
  },
]

const trustPoints = [
  "International car rental quote support",
  "Airport and hotel pickup guidance",
  "Self-drive or driver-included options",
  "Family, business and group transport support",
]

const destinationOptions = [
  "UAE",
  "Saudi Arabia",
  "Turkey",
  "Malaysia",
  "Azerbaijan",
  "Qatar",
  "Thailand",
  "Other Destination",
]

const driverOptions = [
  "Self-drive",
  "With driver / chauffeur",
  "Airport transfer only",
  "Not sure, need guidance",
]

const timeOptions = [
  ...Array.from({ length: 48 }, (_, index) => {
    const hour = Math.floor(index / 2)
    const minute = index % 2 === 0 ? "00" : "30"
    const hour12 = hour % 12 || 12
    const period = hour < 12 ? "AM" : "PM"

    return `${String(hour12).padStart(2, "0")}:${minute} ${period}`
  }),
  "Not sure yet",
]

const initialQuoteForm = {
  city: "",
  pickupLocation: "",
  dropoffLocation: "",
  pickupDate: "",
  returnDate: "",
  passengers: "",
  luggage: "",
  fullName: "",
  phone: "",
  email: "",
  specialRequest: "",
  companyWebsite: "",
}

const whatsappLink =
  "https://wa.me/923111444192?text=Assalamualaikum%20TravelEx%2C%20I%20need%20guidance%20about%20international%20car%20rental."

const CarRentalPage = () => {
  const [selectedCountry, setSelectedCountry] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedDriverOption, setSelectedDriverOption] = useState("")
  const [pickupTime, setPickupTime] = useState("")
  const [returnTime, setReturnTime] = useState("")
  const [quoteForm, setQuoteForm] = useState(initialQuoteForm)
  const [quoteSent, setQuoteSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formError, setFormError] = useState("")

  const quoteFormRef = useRef(null)

  const openQuoteForm = (category = "") => {
    setSelectedCategory(category)
    setQuoteSent(false)
    setFormError("")

    setTimeout(() => {
      quoteFormRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }, 80)
  }

  const handleQuoteChange = (event) => {
    const { name, value } = event.target

    setQuoteForm((prev) => ({
      ...prev,
      [name]: value,
    }))

    setFormError("")
  }

  const resetFormState = () => {
    setSelectedCountry("")
    setSelectedCategory("")
    setSelectedDriverOption("")
    setPickupTime("")
    setReturnTime("")
    setQuoteForm(initialQuoteForm)
    setFormError("")
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setFormError("")

    if (!selectedCountry) {
      setFormError("Please select destination country.")
      return
    }

    if (!quoteForm.city.trim()) {
      setFormError("Please enter destination city.")
      return
    }

    if (!quoteForm.pickupLocation.trim()) {
      setFormError("Please enter pickup location.")
      return
    }

    if (!quoteForm.pickupDate) {
      setFormError("Please select pickup date.")
      return
    }

    if (!pickupTime) {
      setFormError("Please select pickup time.")
      return
    }

    if (!selectedCategory) {
      setFormError("Please select rental type.")
      return
    }

    if (!selectedDriverOption) {
      setFormError("Please select driver option.")
      return
    }

    if (!quoteForm.passengers || Number(quoteForm.passengers) < 1) {
      setFormError("Please enter passenger count.")
      return
    }

    if (!quoteForm.fullName.trim()) {
      setFormError("Please enter your full name.")
      return
    }

    if (!quoteForm.phone.trim()) {
      setFormError("Please enter your phone or WhatsApp number.")
      return
    }

    if (!quoteForm.email.trim()) {
      setFormError("Please enter your email address.")
      return
    }

    try {
      setLoading(true)

      const passengers = Math.max(1, Number(quoteForm.passengers) || 1)

      const message = [
        `International car rental quote request`,
        "",
        `Destination Country: ${selectedCountry}`,
        `Destination City: ${quoteForm.city}`,
        `Pickup Location: ${quoteForm.pickupLocation}`,
        `Drop-off Location: ${
          quoteForm.dropoffLocation || "Same as pickup / not provided"
        }`,
        `Pickup Date: ${quoteForm.pickupDate}`,
        `Pickup Time: ${pickupTime}`,
        `Return Date: ${quoteForm.returnDate || "Not provided"}`,
        `Return Time: ${returnTime || "Not provided"}`,
        "",
        `Rental Type: ${selectedCategory}`,
        `Driver Option: ${selectedDriverOption}`,
        `Passengers: ${passengers}`,
        `Luggage: ${quoteForm.luggage || "Not provided"}`,
        "",
        quoteForm.specialRequest
          ? `Special Request: ${quoteForm.specialRequest}`
          : "Special Request: Not provided",
      ].join("\n")

      const payload = {
        name: quoteForm.fullName.trim(),
        phone: quoteForm.phone.trim(),
        email: quoteForm.email.trim(),
        serviceType: "carRental",
        source: "car-rental-page",
        pageUrl: window.location.href,
        destination: `${selectedCountry} - ${quoteForm.city.trim()}`,
        travelers: {
          adults: passengers,
          children: 0,
          infants: 0,
        },
        travelDate: quoteForm.pickupDate
          ? new Date(`${quoteForm.pickupDate}T00:00:00`).toISOString()
          : undefined,
        message,
        priority: "high",
        companyWebsite: quoteForm.companyWebsite,
      }

      await publicApi.createLead(payload)

      setQuoteSent(true)
      resetFormState()
    } catch (err) {
      console.error("Car rental quote error:", err)
      setFormError(
        err.message ||
          "We could not submit your rental quote right now. Please try again."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="bg-[#F8FAFC]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-950">
        <img
          src={carHero1}
          alt="International car rental by TravelEx"
          loading="eager"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/65 via-slate-950/45 to-slate-950/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/45 via-transparent to-transparent" />

        <div className="relative z-10 mx-auto max-w-[1340px] px-4 py-7 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
          <div className="grid gap-8 lg:grid-cols-[1fr_390px] lg:items-center">
            <div className="max-w-4xl">
              <p className="font-poppins text-[8px] font-bold uppercase tracking-[0.08em] text-[#00AEEF] sm:text-[12px] sm:tracking-[0.1em]">
                International Car Rentals
              </p>

              <h1 className="mt-1 font-fredoka text-[17px] font-semibold leading-[1.08] text-white sm:mt-2 sm:text-[46px] sm:uppercase sm:leading-[1.08] lg:text-[54px]">
                <span className="sm:hidden">Car Rental Support</span>
                <span className="hidden sm:inline">
                  Rent cars and transfers worldwide
                </span>
              </h1>

              <p className="mt-1 max-w-3xl font-poppins text-[9px] font-medium leading-4 text-white/85 sm:mt-3 sm:text-base sm:leading-7">
                <span className="sm:hidden">
                  Airport, hotel and driver options.
                </span>

                <span className="hidden sm:inline">
                  Get international car rental, airport transfer, private driver,
                  family transport, and business travel options through TravelEx
                  quote support.
                </span>
              </p>

              <div className="mt-3 flex flex-col gap-2 sm:mt-6 sm:flex-row sm:gap-3">
                <button
                  type="button"
                  onClick={() => openQuoteForm()}
                  className="inline-flex items-center justify-center gap-2 rounded-[5px] bg-[#FF6B00] px-5 py-2.5 font-poppins text-xs font-semibold text-white transition hover:bg-[#00AEEF] sm:px-6 sm:py-3 sm:text-sm"
                >
                  Get Rental Quote
                  <FaArrowRight className="text-[10px] sm:text-xs" />
                </button>

                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-[5px] border border-white/15 bg-white/10 px-5 py-2.5 font-poppins text-xs font-semibold text-white backdrop-blur transition hover:bg-[#25D366] sm:px-6 sm:py-3 sm:text-sm"
                >
                  <FaWhatsapp />
                  WhatsApp Inquiry
                </a>
              </div>
            </div>

            <div className="hidden lg:block">
              <div className="rounded-[16px] border border-white/15 bg-white/10 p-5 shadow-[0_22px_60px_rgba(0,0,0,0.28)] backdrop-blur-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-[5px] bg-[#00AEEF]/15 text-[#00AEEF]">
                  <FaGlobeAsia />
                </div>

                <h3 className="mt-4 font-fredoka text-[28px] font-semibold leading-tight text-white">
                  Quote-based international rental
                </h3>

                <p className="mt-2 font-poppins text-sm font-medium leading-7 text-white/70">
                  Prices vary by country, city, date, supplier, car category,
                  insurance, and pickup location.
                </p>

                <div className="mt-5 grid gap-3">
                  {[
                    "Country and city based quote",
                    "Airport or hotel pickup",
                    "Self-drive or chauffeur service",
                    "Final price after availability check",
                  ].map((item) => (
                    <p
                      key={item}
                      className="flex items-center gap-2 rounded-[5px] bg-white/10 px-3 py-2 font-poppins text-xs font-semibold text-white/85"
                    >
                      <FaCheckCircle className="shrink-0 text-[#00AEEF]" />
                      {item}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Intro */}
      <section className="relative z-20 -mt-5 bg-transparent sm:-mt-8">
        <div className="mx-auto max-w-[1180px] px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-2 rounded-[12px] border border-slate-100 bg-white p-3 shadow-[0_14px_36px_rgba(15,23,42,0.09)] sm:grid-cols-2 sm:gap-3 sm:p-4 lg:grid-cols-4">
            {[
              {
                title: "Global",
                desktopTitle: "Global Destinations",
                text: "City based support",
                desktopText: "Country and city based support",
                icon: FaGlobeAsia,
              },
              {
                title: "Airport",
                desktopTitle: "Airport Pickup",
                text: "Pickup and transfer",
                desktopText: "Airport, hotel and route transfers",
                icon: FaPlaneArrival,
              },
              {
                title: "Flexible",
                desktopTitle: "Flexible Options",
                text: "Self-drive or driver",
                desktopText: "Self-drive or driver-included",
                icon: FaRoute,
              },
              {
                title: "Quote",
                desktopTitle: "Quote Based",
                text: "After availability",
                desktopText: "Final quote after availability check",
                icon: FaClock,
              },
            ].map((item) => {
              const Icon = item.icon

              return (
                <div
                  key={item.desktopTitle}
                  className="rounded-[5px] bg-[#F8FAFC] p-3 sm:p-4"
                >
                  <Icon className="text-base text-[#00AEEF] sm:text-xl" />

                  <p className="mt-2 font-poppins text-[8px] font-bold uppercase tracking-[0.08em] text-slate-400 sm:mt-3 sm:text-[10px] sm:tracking-[0.1em]">
                    <span className="sm:hidden">{item.title}</span>
                    <span className="hidden sm:inline">
                      {item.desktopTitle}
                    </span>
                  </p>

                  <p className="mt-1 font-poppins text-[10px] font-semibold leading-4 text-slate-950 sm:text-sm sm:leading-6">
                    <span className="sm:hidden">{item.text}</span>
                    <span className="hidden sm:inline">
                      {item.desktopText}
                    </span>
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Quote Form */}
      <section
        ref={quoteFormRef}
        id="quote-form"
        className="scroll-mt-24 bg-white py-8 sm:py-16"
      >
        <div className="mx-auto grid max-w-[1440px] gap-5 px-4 sm:px-6 lg:grid-cols-[1fr_380px] lg:gap-6 lg:px-8">
          <div className="rounded-[12px] border border-slate-100 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.06)] sm:p-7">
            <div className="mb-4 sm:mb-6">
              <p className="mb-1.5 font-poppins text-[8.5px] font-bold uppercase tracking-[0.08em] text-[#00AEEF] sm:mb-2 sm:text-[12px] sm:tracking-[0.1em]">
                Rental Quote Form
              </p>

              <h2 className="font-fredoka text-[20px] font-semibold leading-[1.08] text-slate-950 sm:text-[40px]">
                <span className="sm:hidden">Request Rental Quote</span>
                <span className="hidden sm:inline">
                  Request international car rental quote
                </span>
              </h2>

              <p className="mt-1.5 max-w-3xl font-poppins text-[10.5px] font-medium leading-5 text-slate-600 sm:mt-2 sm:text-base sm:leading-7">
                <span className="sm:hidden">
                  Add destination, date and car type.
                </span>

                <span className="hidden sm:inline">
                  Fill in your destination, pickup details, dates, and car type.
                  TravelEx will confirm final pricing after supplier
                  availability check.
                </span>
              </p>
            </div>

            {quoteSent ? (
              <div className="rounded-[8px] border border-green-100 bg-green-50 p-5 sm:p-6">
                <h3 className="font-fredoka text-[22px] font-semibold text-green-700 sm:text-[28px]">
                  Rental quote request received
                </h3>

                <p className="mt-2 font-poppins text-[11.5px] font-medium leading-5 text-green-700 sm:text-sm sm:leading-7">
                  Your rental quote request has been submitted successfully.
                  TravelEx admin team can now view it in the CRM dashboard.
                </p>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-[5px] bg-[#25D366] px-5 py-2.5 font-poppins text-xs font-semibold text-white transition hover:bg-[#00AEEF] sm:px-6 sm:py-3 sm:text-sm"
                  >
                    <FaWhatsapp />
                    Continue on WhatsApp
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      setQuoteSent(false)
                      resetFormState()
                    }}
                    className="inline-flex items-center justify-center rounded-[5px] border border-slate-200 bg-white px-5 py-2.5 font-poppins text-xs font-semibold text-slate-800 transition hover:border-[#00AEEF] hover:text-[#00AEEF] sm:px-6 sm:py-3 sm:text-sm"
                  >
                    Submit Another Request
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="grid gap-4">
                <input
                  type="text"
                  name="companyWebsite"
                  value={quoteForm.companyWebsite}
                  onChange={handleQuoteChange}
                  className="hidden"
                  tabIndex="-1"
                  autoComplete="off"
                />

                <div className="grid gap-4 sm:grid-cols-2">
                  <AppSelect
                    label="Destination Country"
                    value={selectedCountry}
                    onChange={(value) => {
                      setSelectedCountry(value)
                      setFormError("")
                    }}
                    placeholder="Select country"
                    options={destinationOptions}
                  />

                  <div>
                    <label className="mb-1.5 block font-poppins text-[9px] font-bold uppercase tracking-[0.08em] text-slate-400 sm:mb-2 sm:text-xs">
                      City
                    </label>

                    <input
                      type="text"
                      name="city"
                      value={quoteForm.city}
                      onChange={handleQuoteChange}
                      required
                      placeholder="Dubai, Istanbul, Baku..."
                      className="h-11 w-full rounded-[5px] border border-slate-200 bg-white px-3 font-poppins text-xs font-semibold text-slate-900 outline-none transition focus:border-[#00AEEF] sm:h-12 sm:px-4 sm:text-sm"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block font-poppins text-[9px] font-bold uppercase tracking-[0.08em] text-slate-400 sm:mb-2 sm:text-xs">
                      Pickup Location
                    </label>

                    <input
                      type="text"
                      name="pickupLocation"
                      value={quoteForm.pickupLocation}
                      onChange={handleQuoteChange}
                      required
                      placeholder="Airport, hotel, city area..."
                      className="h-11 w-full rounded-[5px] border border-slate-200 bg-white px-3 font-poppins text-xs font-semibold text-slate-900 outline-none transition focus:border-[#00AEEF] sm:h-12 sm:px-4 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block font-poppins text-[9px] font-bold uppercase tracking-[0.08em] text-slate-400 sm:mb-2 sm:text-xs">
                      Drop-off Location
                    </label>

                    <input
                      type="text"
                      name="dropoffLocation"
                      value={quoteForm.dropoffLocation}
                      onChange={handleQuoteChange}
                      placeholder="Same as pickup or different location"
                      className="h-11 w-full rounded-[5px] border border-slate-200 bg-white px-3 font-poppins text-xs font-semibold text-slate-900 outline-none transition focus:border-[#00AEEF] sm:h-12 sm:px-4 sm:text-sm"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <label className="mb-1.5 block font-poppins text-[9px] font-bold uppercase tracking-[0.08em] text-slate-400 sm:mb-2 sm:text-xs">
                      Pickup Date
                    </label>

                    <div className="relative">
                      <FaCalendarAlt className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 sm:left-4 sm:text-sm" />

                      <input
                        type="date"
                        name="pickupDate"
                        value={quoteForm.pickupDate}
                        onChange={handleQuoteChange}
                        required
                        className="h-11 w-full rounded-[5px] border border-slate-200 bg-white pl-10 pr-3 font-poppins text-xs font-semibold text-slate-900 outline-none transition focus:border-[#00AEEF] sm:h-12 sm:pl-11 sm:pr-4 sm:text-sm"
                      />
                    </div>
                  </div>

                  <AppSelect
                    label="Pickup Time"
                    value={pickupTime}
                    onChange={(value) => {
                      setPickupTime(value)
                      setFormError("")
                    }}
                    placeholder="Select pickup time"
                    options={timeOptions}
                  />

                  <div>
                    <label className="mb-1.5 block font-poppins text-[9px] font-bold uppercase tracking-[0.08em] text-slate-400 sm:mb-2 sm:text-xs">
                      Return Date
                    </label>

                    <input
                      type="date"
                      name="returnDate"
                      value={quoteForm.returnDate}
                      onChange={handleQuoteChange}
                      className="h-11 w-full rounded-[5px] border border-slate-200 bg-white px-3 font-poppins text-xs font-semibold text-slate-900 outline-none transition focus:border-[#00AEEF] sm:h-12 sm:px-4 sm:text-sm"
                    />
                  </div>

                  <AppSelect
                    label="Return Time"
                    value={returnTime}
                    onChange={(value) => {
                      setReturnTime(value)
                      setFormError("")
                    }}
                    placeholder="Select return time"
                    options={timeOptions}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <AppSelect
                    label="Rental Type"
                    value={selectedCategory}
                    onChange={(value) => {
                      setSelectedCategory(value)
                      setFormError("")
                    }}
                    placeholder="Select rental type"
                    options={vehicleCategories.map((category) => category.title)}
                  />

                  <AppSelect
                    label="Driver Option"
                    value={selectedDriverOption}
                    onChange={(value) => {
                      setSelectedDriverOption(value)
                      setFormError("")
                    }}
                    placeholder="Select option"
                    options={driverOptions}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block font-poppins text-[9px] font-bold uppercase tracking-[0.08em] text-slate-400 sm:mb-2 sm:text-xs">
                      Passengers
                    </label>

                    <div className="relative">
                      <FaUsers className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 sm:left-4 sm:text-sm" />

                      <input
                        type="number"
                        name="passengers"
                        value={quoteForm.passengers}
                        onChange={handleQuoteChange}
                        min="1"
                        required
                        placeholder="Number of passengers"
                        className="h-11 w-full rounded-[5px] border border-slate-200 bg-white pl-10 pr-3 font-poppins text-xs font-semibold text-slate-900 outline-none transition focus:border-[#00AEEF] sm:h-12 sm:pl-11 sm:pr-4 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block font-poppins text-[9px] font-bold uppercase tracking-[0.08em] text-slate-400 sm:mb-2 sm:text-xs">
                      Luggage
                    </label>

                    <div className="relative">
                      <FaSuitcaseRolling className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 sm:left-4 sm:text-sm" />

                      <input
                        type="text"
                        name="luggage"
                        value={quoteForm.luggage}
                        onChange={handleQuoteChange}
                        placeholder="Example: 2 bags, 4 bags..."
                        className="h-11 w-full rounded-[5px] border border-slate-200 bg-white pl-10 pr-3 font-poppins text-xs font-semibold text-slate-900 outline-none transition focus:border-[#00AEEF] sm:h-12 sm:pl-11 sm:pr-4 sm:text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="mb-1.5 block font-poppins text-[9px] font-bold uppercase tracking-[0.08em] text-slate-400 sm:mb-2 sm:text-xs">
                      Full Name
                    </label>

                    <input
                      type="text"
                      name="fullName"
                      value={quoteForm.fullName}
                      onChange={handleQuoteChange}
                      required
                      placeholder="Enter your name"
                      className="h-11 w-full rounded-[5px] border border-slate-200 bg-white px-3 font-poppins text-xs font-semibold text-slate-900 outline-none transition focus:border-[#00AEEF] sm:h-12 sm:px-4 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block font-poppins text-[9px] font-bold uppercase tracking-[0.08em] text-slate-400 sm:mb-2 sm:text-xs">
                      Phone / WhatsApp
                    </label>

                    <div className="relative">
                      <FaPhoneAlt className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 sm:left-4 sm:text-sm" />

                      <input
                        type="tel"
                        name="phone"
                        value={quoteForm.phone}
                        onChange={handleQuoteChange}
                        required
                        placeholder="03XXXXXXXXX"
                        className="h-11 w-full rounded-[5px] border border-slate-200 bg-white pl-10 pr-3 font-poppins text-xs font-semibold text-slate-900 outline-none transition focus:border-[#00AEEF] sm:h-12 sm:pl-11 sm:pr-4 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block font-poppins text-[9px] font-bold uppercase tracking-[0.08em] text-slate-400 sm:mb-2 sm:text-xs">
                      Email
                    </label>

                    <div className="relative">
                      <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 sm:left-4 sm:text-sm" />

                      <input
                        type="email"
                        name="email"
                        value={quoteForm.email}
                        onChange={handleQuoteChange}
                        required
                        placeholder="Enter email"
                        className="h-11 w-full rounded-[5px] border border-slate-200 bg-white pl-10 pr-3 font-poppins text-xs font-semibold text-slate-900 outline-none transition focus:border-[#00AEEF] sm:h-12 sm:pl-11 sm:pr-4 sm:text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block font-poppins text-[9px] font-bold uppercase tracking-[0.08em] text-slate-400 sm:mb-2 sm:text-xs">
                    Special Request
                  </label>

                  <textarea
                    rows="4"
                    name="specialRequest"
                    value={quoteForm.specialRequest}
                    onChange={handleQuoteChange}
                    placeholder="Write flight number, hotel name, route, car preference, budget, or any special requirement..."
                    className="w-full resize-none rounded-[5px] border border-slate-200 bg-white px-3 py-3 font-poppins text-xs font-semibold text-slate-900 outline-none transition focus:border-[#00AEEF] sm:px-4 sm:text-sm"
                  />
                </div>

                {formError && (
                  <p className="rounded-[5px] bg-red-50 px-4 py-3 font-poppins text-xs font-semibold leading-5 text-red-600">
                    {formError}
                  </p>
                )}

                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-2 rounded-[5px] bg-[#FF6B00] px-5 py-2.5 font-poppins text-xs font-semibold text-white transition hover:bg-[#00AEEF] disabled:cursor-not-allowed disabled:opacity-70 sm:px-6 sm:py-3 sm:text-sm"
                  >
                    {loading ? "Submitting..." : "Submit Rental Quote"}
                    {!loading && <FaArrowRight className="text-[10px] sm:text-xs" />}
                  </button>

                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-[5px] border border-slate-200 bg-white px-5 py-2.5 font-poppins text-xs font-semibold text-slate-800 transition hover:border-[#25D366] hover:text-[#25D366] sm:px-6 sm:py-3 sm:text-sm"
                  >
                    <FaWhatsapp />
                    WhatsApp Instead
                  </a>
                </div>
              </form>
            )}
          </div>

          {/* Sticky Info Sidebar */}
          <aside className="h-fit lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-[12px] border border-slate-100 bg-white p-4 shadow-[0_16px_45px_rgba(15,23,42,0.08)] sm:p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-[5px] bg-[#00AEEF]/10 text-[#00AEEF] sm:h-12 sm:w-12">
                <FaGlobeAsia />
              </div>

              <h3 className="mt-3 font-fredoka text-[22px] font-semibold leading-tight text-slate-950 sm:mt-4 sm:text-[28px]">
                How international rental works
              </h3>

              <p className="mt-1.5 font-poppins text-[11.5px] font-medium leading-5 text-slate-600 sm:mt-2 sm:text-sm sm:leading-7">
                International car rental prices are confirmed after supplier
                availability check. TravelEx will guide you before final booking.
              </p>

              <div className="mt-4 grid gap-2 sm:mt-5 sm:gap-3">
                {processSteps.map((step, index) => (
                  <div
                    key={step.title}
                    className="rounded-[5px] bg-[#F8FAFC] p-3.5 sm:p-4"
                  >
                    <p className="font-poppins text-[8px] font-bold uppercase tracking-[0.08em] text-[#00AEEF] sm:text-[10px] sm:tracking-[0.1em]">
                      Step {index + 1}
                    </p>

                    <h4 className="mt-1 font-poppins text-xs font-bold text-slate-950 sm:text-sm">
                      {step.title}
                    </h4>

                    <p className="mt-1 font-poppins text-[10.5px] font-medium leading-5 text-slate-600 sm:text-xs sm:leading-6">
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-4 rounded-[5px] border border-orange-100 bg-orange-50 p-3.5 sm:mt-5 sm:p-4">
                <p className="font-poppins text-[8.5px] font-bold uppercase tracking-[0.08em] text-[#FF6B00] sm:text-[11px] sm:tracking-[0.1em]">
                  Important Note
                </p>

                <p className="mt-1.5 font-poppins text-[11px] font-semibold leading-5 text-orange-800 sm:mt-2 sm:text-sm sm:leading-7">
                  Final rental price may vary by country, supplier, dates,
                  insurance, deposit, pickup location, and driver option.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="bg-[#F8FAFC] py-8 sm:py-16">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <div className="mb-4 text-center sm:mb-8">
            <p className="mb-1.5 font-poppins text-[8.5px] font-bold uppercase tracking-[0.08em] text-[#00AEEF] sm:mb-2 sm:text-[12px] sm:tracking-[0.1em]">
              Popular Destinations
            </p>

            <h2 className="font-fredoka text-[18px] font-semibold leading-[1.08] text-slate-950 sm:text-[44px]">
              <span className="sm:hidden">Popular Cities</span>
              <span className="hidden sm:inline">
                International cities we can help with
              </span>
            </h2>

            <p className="mx-auto mt-1 max-w-2xl font-poppins text-[10px] font-medium leading-4 text-slate-600 sm:mt-2 sm:text-base sm:leading-7">
              <span className="sm:hidden">
                Rental support in major destinations.
              </span>

              <span className="hidden sm:inline">
                TravelEx can guide you with international rental options in major
                travel destinations based on availability and supplier response.
              </span>
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
            {popularDestinations.map((destination) => (
              <div
                key={destination.country}
                className="rounded-[12px] border border-slate-100 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.05)] transition hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(15,23,42,0.08)] sm:p-5"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-[5px] bg-[#00AEEF]/10 text-[#00AEEF] sm:h-11 sm:w-11">
                  <FaMapMarkerAlt />
                </div>

                <h3 className="mt-3 font-fredoka text-[22px] font-semibold text-slate-950 sm:mt-4 sm:text-[26px]">
                  {destination.country}
                </h3>

                <p className="mt-1 font-poppins text-xs font-bold text-[#FF6B00] sm:text-sm">
                  {destination.cities}
                </p>

                <p className="mt-1.5 font-poppins text-[11.5px] font-medium leading-5 text-slate-600 sm:mt-2 sm:text-sm sm:leading-7">
                  {destination.use}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-[#F8FAFC] pb-8 sm:pb-14">
        <div className="mx-auto max-w-[1180px] px-4 sm:px-6 lg:px-8">
          <div className="rounded-[5px] border border-slate-100 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.06)] sm:p-7">
            <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <h3 className="font-fredoka text-[21px] font-semibold leading-tight text-slate-950 sm:text-[32px]">
                  Need a custom international transport plan?
                </h3>

                <p className="mt-1.5 max-w-3xl font-poppins text-[11.5px] font-medium leading-5 text-slate-600 sm:text-sm sm:leading-7">
                  Share your country, pickup city, travel dates, route, and
                  passenger count. TravelEx can guide you with a suitable
                  international rental or transfer option.
                </p>

                <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                  {trustPoints.map((item) => (
                    <p
                      key={item}
                      className="flex items-center gap-2 font-poppins text-[11.5px] font-semibold text-slate-700 sm:text-sm"
                    >
                      <FaCheckCircle className="shrink-0 text-[#00AEEF]" />
                      {item}
                    </p>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
                <button
                  type="button"
                  onClick={() => openQuoteForm()}
                  className="inline-flex items-center justify-center gap-2 rounded-[5px] bg-[#FF6B00] px-5 py-2.5 font-poppins text-xs font-semibold text-white transition hover:bg-[#00AEEF] sm:px-6 sm:py-3 sm:text-sm"
                >
                  Get Quote
                  <FaArrowRight className="text-[10px] sm:text-xs" />
                </button>

                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center rounded-[5px] border border-slate-200 bg-white px-5 py-2.5 font-poppins text-xs font-semibold text-slate-800 transition hover:border-[#00AEEF] hover:text-[#00AEEF] sm:px-6 sm:py-3 sm:text-sm"
                >
                  Contact TravelEx
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

export default CarRentalPage