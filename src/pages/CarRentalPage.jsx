import { useRef, useState } from "react"
import {
  FaArrowRight,
  FaCar,
  FaCheckCircle,
  FaClock,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaPlaneArrival,
  FaPlaneDeparture,
  FaRoute,
  FaShieldAlt,
  FaSuitcaseRolling,
  FaUser,
  FaUsers,
  FaWhatsapp,
} from "react-icons/fa"

import Footer from "../components/Footer"
import AppSelect from "../components/common/AppSelect"
import AppDatePicker from "../components/common/AppDatePicker"
import AppTimePicker from "../components/common/AppTimePicker"
import { publicApi } from "../services/publicApi"

import carHero1 from "../assets/Cars/Car5.avif"
import carHero4 from "../assets/Cars/Car5.webp"
import carHero5 from "../assets/Cars/Car6.webp"

const serviceRequiredOptions = [
  "Airport Pick-up",
  "Airport Drop-off",
  "Round Trip (Pick-up & Drop-off)",
]

const vehiclePreferenceOptions = [
  "Economy Car",
  "Sedan",
  "SUV",
  "Van / Minivan",
  "Bus / Coach",
]

const transferCards = [
  {
    title: "Airport Pick-up",
    subtitle: "From airport to hotel / home",
    description:
      "Share your arrival details and TravelEx will arrange a suitable vehicle for your airport pickup.",
    icon: FaPlaneArrival,
    image: carHero4,
    bestFor: ["Airport arrival", "Hotel transfer", "Family pickup"],
  },
  {
    title: "Airport Drop-off",
    subtitle: "From hotel / home to airport",
    description:
      "Book a reliable airport drop-off service according to your flight departure time.",
    icon: FaPlaneDeparture,
    image: carHero5,
    bestFor: ["Departure transfer", "On-time drop-off", "Luggage support"],
  },
  {
    title: "Round Trip Transfer",
    subtitle: "Pick-up and drop-off both",
    description:
      "A complete transfer option for travelers who need both arrival pickup and departure drop-off.",
    icon: FaRoute,
    image: carHero1,
    bestFor: ["Complete transfer", "Families", "Groups"],
  },
]

const vehicleCards = [
  {
    title: "Economy Car",
    description: "Budget-friendly option for solo travelers, couples, and light luggage.",
    icon: FaCar,
  },
  {
    title: "Sedan",
    description: "Comfortable option for small families and airport transfers.",
    icon: FaShieldAlt,
  },
  {
    title: "SUV",
    description: "Better space for families, luggage, and comfortable travel.",
    icon: FaUsers,
  },
  {
    title: "Van / Minivan",
    description: "Suitable for groups, families, and extra luggage.",
    icon: FaSuitcaseRolling,
  },
]

const processSteps = [
  {
    title: "Share flight details",
    description:
      "Send airline, flight number, date, time, airport, and transfer type.",
  },
  {
    title: "TravelEx checks vehicle",
    description:
      "Our team checks suitable vehicle availability according to passengers and luggage.",
  },
  {
    title: "Get transfer quote",
    description:
      "You receive pickup/drop-off quote with vehicle option and timing guidance.",
  },
  {
    title: "Confirm transfer",
    description:
      "After confirmation, TravelEx shares final instructions for pickup or drop-off.",
  },
]

const trustPoints = [
  "Airport pick-up and drop-off support",
  "Vehicle options for families and groups",
  "Flight-based timing guidance",
  "WhatsApp assistance before travel",
]

const initialQuoteForm = {
  fullName: "",
  phone: "",
  email: "",
  cityCountry: "",

  serviceRequired: "",
  airline: "",
  flightNumber: "",
  flightDate: "",
  flightTime: "",
  airport: "",

  pickupLocation: "",
  dropoffLocation: "",

  adults: "1",
  children: "0",
  infants: "0",

  checkedBags: "0",
  handCarryBags: "0",

  vehiclePreference: "",
  additionalRequirements: "",
  companyWebsite: "",
}

const labelClass =
  "mb-1.5 block font-poppins text-[9px] font-bold uppercase tracking-[0.08em] text-slate-400 sm:mb-2 sm:text-xs"

const inputClass =
  "h-11 w-full rounded-[5px] border border-slate-200 bg-white px-3 font-poppins text-xs font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#00AEEF] focus:ring-2 focus:ring-[#00AEEF]/10 sm:h-12 sm:px-4 sm:text-sm"

const iconInputClass =
  "h-11 w-full rounded-[5px] border border-slate-200 bg-white pl-10 pr-3 font-poppins text-xs font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#00AEEF] focus:ring-2 focus:ring-[#00AEEF]/10 sm:h-12 sm:pl-11 sm:pr-4 sm:text-sm"

const whatsappLink =
  "https://wa.me/923111444192?text=Assalamualaikum%20TravelEx%2C%20I%20need%20airport%20pick-up%20%2F%20drop-off%20service%20guidance."

const getDateIso = (value) => {
  if (!value) return undefined

  const date = new Date(`${value}T00:00:00`)
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString()
}

const CarRentalPage = () => {
  const [quoteForm, setQuoteForm] = useState(initialQuoteForm)
  const [quoteSent, setQuoteSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formError, setFormError] = useState("")

  const quoteFormRef = useRef(null)

  const openQuoteForm = (service = "") => {
    setQuoteSent(false)
    setFormError("")

    if (service) {
      setQuoteForm((prev) => ({
        ...prev,
        serviceRequired: service,
      }))
    }

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
    setQuoteSent(false)
  }

  const handleQuoteValueChange = (name, value) => {
    setQuoteForm((prev) => ({
      ...prev,
      [name]: value,
    }))

    setFormError("")
    setQuoteSent(false)
  }

  const resetFormState = () => {
    setQuoteForm(initialQuoteForm)
    setFormError("")
  }

  const validateForm = () => {
    if (!quoteForm.fullName.trim()) return "Please enter your full name."
    if (!quoteForm.phone.trim()) return "Please enter your mobile / WhatsApp number."
    if (!quoteForm.email.trim()) return "Please enter your email address."
    if (!quoteForm.cityCountry.trim()) return "Please enter your city/country."
    if (!quoteForm.serviceRequired) return "Please select service required."
    if (!quoteForm.airline.trim()) return "Please enter airline name."
    if (!quoteForm.flightNumber.trim()) return "Please enter flight number."
    if (!quoteForm.flightDate) return "Please select arrival / departure date."
    if (!quoteForm.flightTime) return "Please select arrival / departure time."
    if (!quoteForm.airport.trim()) return "Please enter airport name."
    if (!quoteForm.pickupLocation.trim()) return "Please enter pickup location."
    if (!quoteForm.dropoffLocation.trim()) return "Please enter drop-off location."
    if (!quoteForm.vehiclePreference) return "Please select vehicle preference."

    const adults = Number(quoteForm.adults) || 0
    const children = Number(quoteForm.children) || 0
    const infants = Number(quoteForm.infants) || 0

    if (adults < 1) return "Please enter at least 1 adult."
    if (children < 0) return "Children cannot be negative."
    if (infants < 0) return "Infants cannot be negative."

    return ""
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setFormError("")
    setQuoteSent(false)

    const validationError = validateForm()

    if (validationError) {
      setFormError(validationError)
      return
    }

    try {
      setLoading(true)

      const adults = Math.max(1, Number(quoteForm.adults) || 1)
      const children = Math.max(0, Number(quoteForm.children) || 0)
      const infants = Math.max(0, Number(quoteForm.infants) || 0)
      const passengerCount = adults + children + infants

      const luggageInfo = `Checked Bags: ${
        quoteForm.checkedBags || 0
      }, Hand Carry Bags: ${quoteForm.handCarryBags || 0}`

      const message = [
        "Airport Pick-up / Drop-off Request",
        "",
        "Personal Information",
        `Full Name: ${quoteForm.fullName}`,
        `Mobile / WhatsApp: ${quoteForm.phone}`,
        `Email Address: ${quoteForm.email}`,
        `City/Country: ${quoteForm.cityCountry}`,
        "",
        "Service Required",
        `Service: ${quoteForm.serviceRequired}`,
        "",
        "Flight Details",
        `Airline: ${quoteForm.airline}`,
        `Flight Number: ${quoteForm.flightNumber}`,
        `Arrival / Departure Date: ${quoteForm.flightDate}`,
        `Arrival / Departure Time: ${quoteForm.flightTime}`,
        `Airport: ${quoteForm.airport}`,
        "",
        "Pickup & Drop-off Details",
        `Pickup Location: ${quoteForm.pickupLocation}`,
        `Drop-off Location: ${quoteForm.dropoffLocation}`,
        "",
        "Passengers",
        `Adults: ${adults}`,
        `Children: ${children}`,
        `Infants: ${infants}`,
        `Total Passengers: ${passengerCount}`,
        "",
        "Luggage Information",
        luggageInfo,
        "",
        `Vehicle Preference: ${quoteForm.vehiclePreference}`,
        "",
        quoteForm.additionalRequirements
          ? `Additional Requirements: ${quoteForm.additionalRequirements}`
          : "Additional Requirements: Not provided",
      ].join("\n")

      const payload = {
        name: quoteForm.fullName.trim(),
        phone: quoteForm.phone.trim(),
        email: quoteForm.email.trim(),

        serviceType: "carRental",
        source: "car-rental-page",
        pageUrl: window.location.href,

        city: quoteForm.cityCountry.trim(),
        destination: quoteForm.airport.trim(),

        rentalType: quoteForm.serviceRequired,
        preferredAirline: quoteForm.airline.trim(),
        bookingReference: quoteForm.flightNumber.trim(),

        pickupDate: getDateIso(quoteForm.flightDate),
        pickupTime: quoteForm.flightTime,
        travelDate: getDateIso(quoteForm.flightDate),

        pickupLocation: quoteForm.pickupLocation.trim(),
        dropoffLocation: quoteForm.dropoffLocation.trim(),

        vehicleType: quoteForm.vehiclePreference,
        passengerCount,
        luggage: luggageInfo,

        travelers: {
          adults,
          children,
          infants,
        },

        additionalRequirements: quoteForm.additionalRequirements.trim(),
        message,
        priority: "high",
        companyWebsite: quoteForm.companyWebsite,
      }

      await publicApi.createLead(payload)

      setQuoteSent(true)
      resetFormState()

      window.scrollTo({
        top: quoteFormRef.current?.offsetTop || 0,
        behavior: "smooth",
      })
    } catch (err) {
      console.error("Airport transfer inquiry error:", err)
      setFormError(
        err.message ||
          "We could not submit your airport transfer request right now. Please try again."
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
          alt="Airport pick-up and drop-off service by TravelEx"
          loading="eager"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/70 via-slate-950/45 to-slate-950/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent" />

        <div className="relative z-10 mx-auto max-w-[1340px] px-4 py-7 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
          <div className="grid gap-8 lg:grid-cols-[1fr_390px] lg:items-center">
            <div className="max-w-4xl">
              <p className="font-poppins text-[8px] font-bold uppercase tracking-[0.08em] text-[#00AEEF] sm:text-[12px] sm:tracking-[0.1em]">
                Airport Pick-up & Drop-off
              </p>

              <h1 className="mt-1 font-fredoka text-[17px] font-semibold leading-[1.08] text-white sm:mt-2 sm:text-[46px] sm:uppercase sm:leading-[1.08] lg:text-[54px]">
                <span className="sm:hidden">Airport Transfer Support</span>
                <span className="hidden sm:inline">
                  Reliable airport pick-up and drop-off
                </span>
              </h1>

              <p className="mt-1 max-w-3xl font-poppins text-[9px] font-medium leading-4 text-white/85 sm:mt-3 sm:text-base sm:leading-7">
                <span className="sm:hidden">
                  Share flight details and get transfer support.
                </span>

                <span className="hidden sm:inline">
                  Share your flight details, pickup/drop-off location,
                  passengers, luggage, and vehicle preference. TravelEx will
                  arrange suitable airport transfer guidance.
                </span>
              </p>

              <div className="mt-3 flex flex-col gap-2 sm:mt-6 sm:flex-row sm:gap-3">
                <button
                  type="button"
                  onClick={() => openQuoteForm()}
                  className="inline-flex items-center justify-center gap-2 rounded-[5px] bg-[#FF6B00] px-5 py-2.5 font-poppins text-xs font-semibold text-white transition hover:bg-[#00AEEF] sm:px-6 sm:py-3 sm:text-sm"
                >
                  Request Transfer
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
              <div className="rounded-[5px] border border-white/15 bg-white/10 p-5 shadow-[0_22px_60px_rgba(0,0,0,0.28)] backdrop-blur-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-[5px] bg-[#00AEEF]/15 text-[#00AEEF]">
                  <FaPlaneArrival />
                </div>

                <h3 className="mt-4 font-fredoka text-[28px] font-semibold leading-tight text-white">
                  Flight-based transfer support
                </h3>

                <p className="mt-2 font-poppins text-sm font-medium leading-7 text-white/70">
                  Transfer quote depends on airport, vehicle type, passengers,
                  luggage, pickup/drop-off location, and travel time.
                </p>

                <div className="mt-5 grid gap-3">
                  {trustPoints.map((point) => (
                    <div
                      key={point}
                      className="flex items-center gap-3 rounded-[5px] bg-white/10 px-3 py-2.5"
                    >
                      <FaCheckCircle className="shrink-0 text-[#00AEEF]" />
                      <span className="font-poppins text-sm font-semibold text-white/85">
                        {point}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Request Form */}
      <section
        ref={quoteFormRef}
        className="bg-white px-4 py-10 sm:px-6 sm:py-16 lg:px-8"
      >
        <div className="mx-auto grid max-w-[1340px] gap-6 lg:grid-cols-[1fr_360px]">
          <form
            onSubmit={handleSubmit}
            className="rounded-[5px] border border-slate-100 bg-[#F8FAFC] p-4 shadow-[0_12px_35px_rgba(15,23,42,0.06)] sm:p-7"
          >
            <input
              type="text"
              name="companyWebsite"
              value={quoteForm.companyWebsite}
              onChange={handleQuoteChange}
              className="hidden"
              tabIndex="-1"
              autoComplete="off"
            />

            <div className="mb-5">
              <p className="font-poppins text-[10px] font-bold uppercase tracking-[0.08em] text-[#00AEEF] sm:text-xs">
                Airport Transfer Inquiry
              </p>

              <h2 className="mt-2 font-fredoka text-[28px] font-semibold text-slate-950 sm:text-[42px]">
                Share pick-up / drop-off details
              </h2>

              <p className="mt-2 font-poppins text-sm font-medium leading-7 text-slate-600 sm:text-base">
                Fill the details below and TravelEx consultant will contact you
                with suitable transfer options.
              </p>
            </div>

            {quoteSent && (
              <div className="mb-5 rounded-[5px] border border-green-200 bg-green-50 p-4">
                <div className="flex items-start gap-3">
                  <FaCheckCircle className="mt-1 shrink-0 text-green-600" />

                  <div>
                    <h3 className="font-poppins text-sm font-bold text-green-800">
                      Transfer request submitted successfully.
                    </h3>

                    <p className="mt-1 font-poppins text-xs font-semibold leading-5 text-green-700 sm:text-sm">
                      TravelEx team can now view your airport transfer inquiry
                      in CRM and will contact you soon.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {formError && (
              <p className="mb-5 rounded-[5px] border border-red-200 bg-red-50 px-4 py-3 font-poppins text-[11.5px] font-semibold leading-5 text-red-600 sm:text-sm">
                {formError}
              </p>
            )}

            <div className="grid gap-6">
              {/* Personal Information */}
              <div>
                <h3 className="font-fredoka text-[24px] font-semibold text-slate-950">
                  Personal Information
                </h3>

                <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <div>
                    <label className={labelClass}>Full Name</label>
                    <div className="relative">
                      <FaUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 sm:left-4 sm:text-sm" />
                      <input
                        type="text"
                        name="fullName"
                        value={quoteForm.fullName}
                        onChange={handleQuoteChange}
                        placeholder="Enter full name"
                        className={iconInputClass}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Mobile / WhatsApp</label>
                    <div className="relative">
                      <FaPhoneAlt className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 sm:left-4 sm:text-sm" />
                      <input
                        type="tel"
                        name="phone"
                        value={quoteForm.phone}
                        onChange={handleQuoteChange}
                        placeholder="03XXXXXXXXX"
                        className={iconInputClass}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Email Address</label>
                    <div className="relative">
                      <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 sm:left-4 sm:text-sm" />
                      <input
                        type="email"
                        name="email"
                        value={quoteForm.email}
                        onChange={handleQuoteChange}
                        placeholder="your@email.com"
                        className={iconInputClass}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <label className={labelClass}>City / Country</label>
                  <input
                    type="text"
                    name="cityCountry"
                    value={quoteForm.cityCountry}
                    onChange={handleQuoteChange}
                    placeholder="Karachi, Pakistan / Dubai, UAE"
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Service Required */}
              <div>
                <h3 className="font-fredoka text-[24px] font-semibold text-slate-950">
                  Service Required
                </h3>

                <div className="mt-4">
                  <AppSelect
                    label="Select Service"
                    value={quoteForm.serviceRequired}
                    onChange={(value) =>
                      handleQuoteValueChange("serviceRequired", value)
                    }
                    placeholder="Select airport transfer service"
                    options={serviceRequiredOptions}
                  />
                </div>
              </div>

              {/* Flight Details */}
              <div>
                <h3 className="font-fredoka text-[24px] font-semibold text-slate-950">
                  Flight Details
                </h3>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>Airline</label>
                    <input
                      type="text"
                      name="airline"
                      value={quoteForm.airline}
                      onChange={handleQuoteChange}
                      placeholder="Emirates, PIA, Qatar Airways..."
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Flight Number</label>
                    <input
                      type="text"
                      name="flightNumber"
                      value={quoteForm.flightNumber}
                      onChange={handleQuoteChange}
                      placeholder="EK-601, PK-302..."
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <AppDatePicker
                    label="Arrival / Departure Date"
                    value={quoteForm.flightDate}
                    onChange={(value) =>
                      handleQuoteValueChange("flightDate", value)
                    }
                    placeholder="Select date"
                  />

                  <AppTimePicker
                    label="Arrival / Departure Time"
                    value={quoteForm.flightTime}
                    onChange={(value) =>
                      handleQuoteValueChange("flightTime", value)
                    }
                    placeholder="Select time"
                  />
                </div>

                <div className="mt-4">
                  <label className={labelClass}>Airport</label>
                  <div className="relative">
                    <FaPlaneArrival className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 sm:left-4 sm:text-sm" />
                    <input
                      type="text"
                      name="airport"
                      value={quoteForm.airport}
                      onChange={handleQuoteChange}
                      placeholder="Dubai International Airport, Jeddah Airport..."
                      className={iconInputClass}
                    />
                  </div>
                </div>
              </div>

              {/* Pickup & Drop-off */}
              <div>
                <h3 className="font-fredoka text-[24px] font-semibold text-slate-950">
                  Pickup & Drop-off Details
                </h3>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>Pickup Location</label>
                    <div className="relative">
                      <FaMapMarkerAlt className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 sm:left-4 sm:text-sm" />
                      <input
                        type="text"
                        name="pickupLocation"
                        value={quoteForm.pickupLocation}
                        onChange={handleQuoteChange}
                        placeholder="Airport / Hotel / Address"
                        className={iconInputClass}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Drop-off Location</label>
                    <div className="relative">
                      <FaMapMarkerAlt className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 sm:left-4 sm:text-sm" />
                      <input
                        type="text"
                        name="dropoffLocation"
                        value={quoteForm.dropoffLocation}
                        onChange={handleQuoteChange}
                        placeholder="Hotel / Airport / Address"
                        className={iconInputClass}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Passengers */}
              <div>
                <h3 className="font-fredoka text-[24px] font-semibold text-slate-950">
                  Passengers
                </h3>

                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className={labelClass}>Adults</label>
                    <input
                      type="number"
                      name="adults"
                      min="1"
                      value={quoteForm.adults}
                      onChange={handleQuoteChange}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Children</label>
                    <input
                      type="number"
                      name="children"
                      min="0"
                      value={quoteForm.children}
                      onChange={handleQuoteChange}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Infants</label>
                    <input
                      type="number"
                      name="infants"
                      min="0"
                      value={quoteForm.infants}
                      onChange={handleQuoteChange}
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>

              {/* Luggage */}
              <div>
                <h3 className="font-fredoka text-[24px] font-semibold text-slate-950">
                  Luggage Information
                </h3>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>Checked Bags</label>
                    <input
                      type="number"
                      name="checkedBags"
                      min="0"
                      value={quoteForm.checkedBags}
                      onChange={handleQuoteChange}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Hand Carry Bags</label>
                    <input
                      type="number"
                      name="handCarryBags"
                      min="0"
                      value={quoteForm.handCarryBags}
                      onChange={handleQuoteChange}
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>

              {/* Vehicle Preference */}
              <div>
                <h3 className="font-fredoka text-[24px] font-semibold text-slate-950">
                  Vehicle Preference
                </h3>

                <div className="mt-4">
                  <AppSelect
                    label="Vehicle Preference"
                    value={quoteForm.vehiclePreference}
                    onChange={(value) =>
                      handleQuoteValueChange("vehiclePreference", value)
                    }
                    placeholder="Select vehicle preference"
                    options={vehiclePreferenceOptions}
                  />
                </div>
              </div>

              {/* Additional */}
              <div>
                <label className={labelClass}>Additional Requirements</label>
                <textarea
                  name="additionalRequirements"
                  rows="4"
                  value={quoteForm.additionalRequirements}
                  onChange={handleQuoteChange}
                  placeholder="Write child seat, wheelchair support, luggage details, hotel name, waiting time, or any special request..."
                  className="w-full resize-none rounded-[5px] border border-slate-200 bg-white px-3 py-3 font-poppins text-xs font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#00AEEF] focus:ring-2 focus:ring-[#00AEEF]/10 sm:px-4 sm:text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-[5px] bg-[#FF6B00] px-6 py-3.5 font-poppins text-xs font-semibold uppercase tracking-[0.04em] text-white transition hover:bg-[#00AEEF] disabled:cursor-not-allowed disabled:opacity-70 sm:text-sm"
            >
              {loading ? "Submitting Request..." : "Submit Transfer Request"}
              {!loading && <FaArrowRight className="text-[10px] sm:text-xs" />}
            </button>
          </form>

          {/* Summary */}
          <aside className="h-fit lg:sticky lg:top-24 lg:self-start">
            <div className="overflow-hidden rounded-[5px] border border-slate-100 bg-white shadow-[0_16px_45px_rgba(15,23,42,0.08)]">
              <div className="relative h-36 overflow-hidden sm:h-44">
                <img
                  src={carHero5}
                  alt="Airport transfer summary"
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />

                <div className="absolute bottom-3 left-4 right-4 sm:bottom-4">
                  <p className="font-poppins text-[8.5px] font-bold uppercase tracking-[0.08em] text-white/65 sm:text-[10px] sm:tracking-[0.1em]">
                    Request Summary
                  </p>

                  <h3 className="mt-1 font-fredoka text-[21px] font-semibold leading-tight text-white sm:text-[24px]">
                    Airport Transfer
                  </h3>
                </div>
              </div>

              <div className="p-4 sm:p-5">
                <div className="grid gap-2 sm:gap-3">
                  {[
                    ["Service", quoteForm.serviceRequired || "-"],
                    ["Airline", quoteForm.airline || "-"],
                    ["Flight No.", quoteForm.flightNumber || "-"],
                    ["Date", quoteForm.flightDate || "-"],
                    ["Time", quoteForm.flightTime || "-"],
                    ["Airport", quoteForm.airport || "-"],
                    ["Pickup", quoteForm.pickupLocation || "-"],
                    ["Drop-off", quoteForm.dropoffLocation || "-"],
                    [
                      "Passengers",
                      `${
                        (Number(quoteForm.adults) || 0) +
                        (Number(quoteForm.children) || 0) +
                        (Number(quoteForm.infants) || 0)
                      }`,
                    ],
                    ["Checked Bags", quoteForm.checkedBags || "0"],
                    ["Hand Carry", quoteForm.handCarryBags || "0"],
                    ["Vehicle", quoteForm.vehiclePreference || "-"],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="rounded-[5px] bg-[#F8FAFC] px-3.5 py-2.5 sm:px-4 sm:py-3"
                    >
                      <p className="font-poppins text-[10px] font-bold text-slate-400 sm:text-xs">
                        {label}
                      </p>

                      <p className="mt-1 break-words font-poppins text-sm font-semibold text-slate-950 sm:text-base">
                        {value || "-"}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 rounded-[5px] bg-orange-50 p-3.5 sm:mt-5 sm:p-4">
                  <p className="font-poppins text-[9px] font-bold uppercase tracking-[0.08em] text-[#FF6B00] sm:text-[11px] sm:tracking-[0.1em]">
                    Request Based Service
                  </p>

                  <p className="mt-1.5 font-poppins text-[11px] font-medium leading-5 text-orange-800 sm:mt-2 sm:text-sm sm:leading-7">
                    No online payment is charged here. TravelEx consultant will
                    confirm vehicle availability, route, timing, and final
                    price.
                  </p>
                </div>

                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-[5px] bg-[#25D366] px-5 py-3 font-poppins text-sm font-semibold text-white transition hover:bg-[#00AEEF]"
                >
                  <FaWhatsapp />
                  Ask on WhatsApp
                </a>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Process */}
      <section className="bg-[#F8FAFC] px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-[1340px]">
          <div className="text-center">
            <p className="font-poppins text-[10px] font-bold uppercase tracking-[0.08em] text-[#00AEEF] sm:text-xs">
              How It Works
            </p>

            <h2 className="mt-2 font-fredoka text-[28px] font-semibold text-slate-950 sm:text-[42px]">
              Simple airport transfer process
            </h2>
          </div>

          <div className="mt-7 grid gap-4 md:grid-cols-4">
            {processSteps.map((step, index) => (
              <article
                key={step.title}
                className="rounded-[5px] border border-slate-100 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.06)]"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-[5px] bg-[#FF6B00] font-poppins text-sm font-bold text-white">
                  {index + 1}
                </div>

                <h3 className="mt-4 font-fredoka text-[22px] font-semibold text-slate-950">
                  {step.title}
                </h3>

                <p className="mt-2 font-poppins text-sm font-medium leading-6 text-slate-600">
                  {step.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

export default CarRentalPage