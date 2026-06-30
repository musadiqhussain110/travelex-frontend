import { useRef, useState } from "react"
import {
  FaArrowRight,
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
import AppDatePicker from "../components/common/AppDatePicker"
import AppTimePicker from "../components/common/AppTimePicker"
import { publicApi } from "../services/publicApi"

import carHero1 from "../assets/Cars/Car5.avif"
import carHero4 from "../assets/Cars/Car5.webp"
import carHero5 from "../assets/Cars/Car6.webp"

const vehicleCategories = [
  {
    title: "Economy Car",
    subtitle: "Budget-friendly rental option",
    description:
      "Suitable for city travel, solo travelers, couples, and short trips.",
    icon: FaCar,
    image: carHero4,
    bestFor: ["City travel", "Budget trips", "Couples"],
  },
  {
    title: "SUV / Family Car",
    subtitle: "Comfortable option for families",
    description:
      "A better option for families, luggage, long routes, and comfortable travel.",
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
      "Book airport-to-hotel, hotel-to-airport, and private transfer services.",
    icon: FaPlaneArrival,
    image: carHero4,
    bestFor: ["Airport pickup", "Hotel transfer", "Easy arrival"],
  },
  {
    title: "Chauffeur Service",
    subtitle: "Driver-included service",
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
    title: "Share rental details",
    description:
      "Tell us destination, pickup location, dates, car type, passenger count, and driver preference.",
  },
  {
    title: "TravelEx checks availability",
    description:
      "Our team checks available rental options based on your route, time, and vehicle requirement.",
  },
  {
    title: "Get final quote",
    description:
      "You receive a suitable quote based on car category, date, duration, pickup, and driver option.",
  },
  {
    title: "Confirm your rental",
    description:
      "After confirmation, TravelEx guides you with booking, payment, and pickup instructions.",
  },
]

const trustPoints = [
  "Car rental quote support",
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
  "Pakistan",
  "Other Destination",
]

const vehicleOptions = [
  "Economy Car",
  "SUV / Family Car",
  "Luxury / Business Car",
  "Van / Group Transport",
  "Airport Transfer",
  "Chauffeur Service",
]

const rentalTypeOptions = [
  "Airport Transfer",
  "City Travel",
  "Outstation Travel",
  "Full Day Rental",
  "Multi-day Rental",
  "Business Travel",
  "Tour Transport",
]

const driverOptions = [
  "Self-drive",
  "With driver / chauffeur",
  "Airport transfer only",
  "Not sure, need guidance",
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

const labelClass =
  "mb-1.5 block font-poppins text-[9px] font-bold uppercase tracking-[0.08em] text-slate-400 sm:mb-2 sm:text-xs"

const inputClass =
  "h-11 w-full rounded-[5px] border border-slate-200 bg-white px-3 font-poppins text-xs font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#00AEEF] focus:ring-2 focus:ring-[#00AEEF]/10 sm:h-12 sm:px-4 sm:text-sm"

const iconInputClass =
  "h-11 w-full rounded-[5px] border border-slate-200 bg-white pl-10 pr-3 font-poppins text-xs font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#00AEEF] focus:ring-2 focus:ring-[#00AEEF]/10 sm:h-12 sm:pl-11 sm:pr-4 sm:text-sm"

const whatsappLink =
  "https://wa.me/923111444192?text=Assalamualaikum%20TravelEx%2C%20I%20need%20guidance%20about%20car%20rental%20service."

const getDateIso = (value) => {
  if (!value) return undefined

  const date = new Date(`${value}T00:00:00`)
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString()
}

const CarRentalPage = () => {
  const [selectedCountry, setSelectedCountry] = useState("")
  const [selectedVehicle, setSelectedVehicle] = useState("")
  const [selectedRentalType, setSelectedRentalType] = useState("")
  const [selectedDriverOption, setSelectedDriverOption] = useState("")
  const [pickupTime, setPickupTime] = useState("")
  const [returnTime, setReturnTime] = useState("")
  const [quoteForm, setQuoteForm] = useState(initialQuoteForm)
  const [quoteSent, setQuoteSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formError, setFormError] = useState("")

  const quoteFormRef = useRef(null)

  const openQuoteForm = (vehicle = "") => {
    setSelectedVehicle(vehicle)
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

  const handleSelectChange = (setter, value) => {
    setter(value)
    setFormError("")
    setQuoteSent(false)
  }

  const resetFormState = () => {
    setSelectedCountry("")
    setSelectedVehicle("")
    setSelectedRentalType("")
    setSelectedDriverOption("")
    setPickupTime("")
    setReturnTime("")
    setQuoteForm(initialQuoteForm)
    setFormError("")
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setFormError("")
    setQuoteSent(false)

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

    if (!selectedVehicle) {
      setFormError("Please select vehicle required.")
      return
    }

    if (!selectedRentalType) {
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

    try {
      setLoading(true)

      const passengers = Math.max(1, Number(quoteForm.passengers) || 1)

      const message = [
        "Car rental inquiry request",
        "",
        `Full Name: ${quoteForm.fullName}`,
        `Mobile / WhatsApp: ${quoteForm.phone}`,
        `Email Address: ${quoteForm.email}`,
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
        `Vehicle Required: ${selectedVehicle}`,
        `Rental Type: ${selectedRentalType}`,
        `Driver Option: ${selectedDriverOption}`,
        `Passengers: ${passengers}`,
        `Luggage: ${quoteForm.luggage || "Not provided"}`,
        "",
        quoteForm.specialRequest
          ? `Additional Requirements: ${quoteForm.specialRequest}`
          : "Additional Requirements: Not provided",
      ].join("\n")

      const payload = {
        name: quoteForm.fullName.trim(),
        phone: quoteForm.phone.trim(),
        email: quoteForm.email.trim(),
        serviceType: "carRental",
        source: "car-rental-page",
        pageUrl: window.location.href,

        city: quoteForm.city.trim(),
        destinationCountry: selectedCountry,
        destination: `${selectedCountry} - ${quoteForm.city.trim()}`,

        pickupLocation: quoteForm.pickupLocation.trim(),
        dropoffLocation: quoteForm.dropoffLocation.trim(),
        pickupDate: getDateIso(quoteForm.pickupDate),
        pickupTime,
        returnDate: getDateIso(quoteForm.returnDate),
        returnTime,
        travelDate: getDateIso(quoteForm.pickupDate),

        vehicleType: selectedVehicle,
        rentalType: selectedRentalType,
        driverOption: selectedDriverOption,
        passengerCount: passengers,
        luggage: quoteForm.luggage.trim(),

        travelers: {
          adults: passengers,
          children: 0,
          infants: 0,
        },

        additionalRequirements: quoteForm.specialRequest.trim(),
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
          alt="Car rental by TravelEx"
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
                Car Rental Service
              </p>

              <h1 className="mt-1 font-fredoka text-[17px] font-semibold leading-[1.08] text-white sm:mt-2 sm:text-[46px] sm:uppercase sm:leading-[1.08] lg:text-[54px]">
                <span className="sm:hidden">Car Rental Support</span>
                <span className="hidden sm:inline">
                  Rent cars and private transfers
                </span>
              </h1>

              <p className="mt-1 max-w-3xl font-poppins text-[9px] font-medium leading-4 text-white/85 sm:mt-3 sm:text-base sm:leading-7">
                <span className="sm:hidden">
                  Airport, hotel and driver options.
                </span>

                <span className="hidden sm:inline">
                  Share your pickup details, travel dates, passenger count and
                  vehicle preference. TravelEx will check availability and share
                  suitable rental options.
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
              <div className="rounded-[5px] border border-white/15 bg-white/10 p-5 shadow-[0_22px_60px_rgba(0,0,0,0.28)] backdrop-blur-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-[5px] bg-[#00AEEF]/15 text-[#00AEEF]">
                  <FaGlobeAsia />
                </div>

                <h3 className="mt-4 font-fredoka text-[28px] font-semibold leading-tight text-white">
                  Quote-based rental support
                </h3>

                <p className="mt-2 font-poppins text-sm font-medium leading-7 text-white/70">
                  Prices vary by destination, date, car category, driver option,
                  route, and pickup location.
                </p>

                <div className="mt-5 grid gap-3">
                  {trustPoints.map((item) => (
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

      
      {/* Quote Form */}
      <section
        ref={quoteFormRef}
        id="quote-form"
        className="scroll-mt-24 bg-white py-8 sm:py-16"
      >
        <div className="mx-auto grid max-w-[1440px] gap-5 px-4 sm:px-6 lg:grid-cols-[1fr_380px] lg:gap-6 lg:px-8">
          <form
            onSubmit={handleSubmit}
            className="rounded-[5px] border border-slate-100 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.06)] sm:p-7"
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

            <div className="mb-4 sm:mb-6">
              <p className="mb-1.5 font-poppins text-[8.5px] font-bold uppercase tracking-[0.08em] text-[#00AEEF] sm:mb-2 sm:text-[12px] sm:tracking-[0.1em]">
                Rental Inquiry Form
              </p>

              <h2 className="font-fredoka text-[20px] font-semibold leading-[1.08] text-slate-950 sm:text-[40px]">
                Request car rental quote
              </h2>

              <p className="mt-1.5 max-w-3xl font-poppins text-[10.5px] font-medium leading-5 text-slate-600 sm:mt-2 sm:text-base sm:leading-7">
                Fill in your pickup, drop-off, vehicle, and passenger details.
                TravelEx will contact you with suitable rental options.
              </p>
            </div>

            {quoteSent && (
              <div className="mb-4 flex items-start gap-3 rounded-[5px] border border-green-200 bg-green-50 px-4 py-3 font-poppins text-[11.5px] font-semibold leading-5 text-green-700 sm:text-sm">
                <FaCheckCircle className="mt-0.5 shrink-0" />
                <span>
                  Your car rental inquiry has been submitted successfully.
                  TravelEx admin team can now view it in the CRM dashboard.
                </span>
              </div>
            )}

            {formError && (
              <div className="mb-4 rounded-[5px] border border-red-200 bg-red-50 px-4 py-3 font-poppins text-[11.5px] font-semibold leading-5 text-red-700 sm:text-sm">
                {formError}
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className={labelClass}>Full Name</label>

                <div className="relative">
                  <FaUserTie className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 sm:left-4 sm:text-sm" />

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

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <AppSelect
                label="Destination Country"
                value={selectedCountry}
                onChange={(value) =>
                  handleSelectChange(setSelectedCountry, value)
                }
                placeholder="Select destination country"
                options={destinationOptions}
              />

              <div>
                <label className={labelClass}>Destination City</label>

                <div className="relative">
                  <FaMapMarkerAlt className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 sm:left-4 sm:text-sm" />

                  <input
                    type="text"
                    name="city"
                    value={quoteForm.city}
                    onChange={handleQuoteChange}
                    placeholder="Dubai, Jeddah, Istanbul..."
                    className={iconInputClass}
                  />
                </div>
              </div>
            </div>

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
                    placeholder="Airport, hotel, address..."
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
                    placeholder="Same as pickup / another location"
                    className={iconInputClass}
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <AppDatePicker
                label="Pickup Date"
                value={quoteForm.pickupDate}
                onChange={(value) => handleQuoteValueChange("pickupDate", value)}
                placeholder="Select pickup date"
              />

              <AppTimePicker
                label="Pickup Time"
                value={pickupTime}
                onChange={(value) => handleSelectChange(setPickupTime, value)}
                placeholder="Select pickup time"
              />
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <AppDatePicker
                label="Return Date"
                value={quoteForm.returnDate}
                onChange={(value) => handleQuoteValueChange("returnDate", value)}
                placeholder="Select return date"
              />

              <AppTimePicker
                label="Return Time"
                value={returnTime}
                onChange={(value) => handleSelectChange(setReturnTime, value)}
                placeholder="Select return time"
              />
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <AppSelect
                label="Vehicle Required"
                value={selectedVehicle}
                onChange={(value) => handleSelectChange(setSelectedVehicle, value)}
                placeholder="Select vehicle"
                options={vehicleOptions}
              />

              <AppSelect
                label="Rental Type"
                value={selectedRentalType}
                onChange={(value) =>
                  handleSelectChange(setSelectedRentalType, value)
                }
                placeholder="Select rental type"
                options={rentalTypeOptions}
              />

              <AppSelect
                label="Driver Option"
                value={selectedDriverOption}
                onChange={(value) =>
                  handleSelectChange(setSelectedDriverOption, value)
                }
                placeholder="Select driver option"
                options={driverOptions}
              />
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Number of Passengers</label>

                <div className="relative">
                  <FaUsers className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 sm:left-4 sm:text-sm" />

                  <input
                    type="number"
                    name="passengers"
                    min="1"
                    value={quoteForm.passengers}
                    onChange={handleQuoteChange}
                    placeholder="Example: 4"
                    className={iconInputClass}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Luggage</label>

                <input
                  type="text"
                  name="luggage"
                  value={quoteForm.luggage}
                  onChange={handleQuoteChange}
                  placeholder="Example: 2 large bags, 1 hand carry"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="mt-4">
              <label className={labelClass}>Additional Requirements</label>

              <textarea
                rows="4"
                name="specialRequest"
                value={quoteForm.specialRequest}
                onChange={handleQuoteChange}
                placeholder="Write any special request, child seat, extra luggage, route plan, driver language, airport pickup details..."
                className="w-full resize-none rounded-[5px] border border-slate-200 bg-white px-3 py-3 font-poppins text-xs font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#00AEEF] focus:ring-2 focus:ring-[#00AEEF]/10 sm:px-4 sm:text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-[5px] bg-[#FF6B00] px-6 py-3.5 font-poppins text-xs font-semibold uppercase tracking-[0.04em] text-white transition hover:bg-[#00AEEF] disabled:cursor-not-allowed disabled:opacity-70 sm:text-sm"
            >
              {loading ? "Submitting..." : "Submit Rental Inquiry"}
              {!loading && <FaArrowRight className="text-[10px] sm:text-xs" />}
            </button>
          </form>

          <aside className="h-fit lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-[5px] border border-slate-100 bg-[#F8FAFC] p-4 sm:p-5">
              <p className="font-poppins text-[9px] font-bold uppercase tracking-[0.08em] text-[#00AEEF] sm:text-[11px] sm:tracking-[0.1em]">
                Consultant Note
              </p>

              <h3 className="mt-2 font-fredoka text-[24px] font-semibold leading-tight text-slate-950 sm:text-[28px]">
                Rental quote depends on availability
              </h3>

              <p className="mt-2 font-poppins text-[11.5px] font-medium leading-6 text-slate-600 sm:text-sm sm:leading-7">
                Final car rental price can change based on destination, date,
                pickup location, car category, driver option, luggage and route.
              </p>

              <div className="mt-4 grid gap-2">
                {trustPoints.map((point) => (
                  <p
                    key={point}
                    className="flex items-center gap-2 rounded-[5px] bg-white px-3 py-2 font-poppins text-xs font-semibold text-slate-700"
                  >
                    <FaCheckCircle className="shrink-0 text-[#00AEEF]" />
                    {point}
                  </p>
                ))}
              </div>

              <a
                href={whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-[5px] bg-[#25D366] px-5 py-3 font-poppins text-sm font-semibold text-white transition hover:bg-[#00AEEF]"
              >
                <FaWhatsapp />
                Ask on WhatsApp
              </a>
            </div>
          </aside>
        </div>
      </section>

      {/* Vehicle Categories */}
      <section className="bg-[#F8FAFC] py-8 sm:py-16">
        <div className="mx-auto max-w-[1340px] px-4 sm:px-6 lg:px-8">
          <div className="mb-5 sm:mb-8">
            <p className="font-poppins text-[9px] font-bold uppercase tracking-[0.08em] text-[#00AEEF] sm:text-[12px] sm:tracking-[0.1em]">
              Vehicle Options
            </p>

            <h2 className="mt-1 font-fredoka text-[24px] font-semibold leading-tight text-slate-950 sm:text-[42px]">
              Choose your rental type
            </h2>

            <p className="mt-2 max-w-3xl font-poppins text-[11.5px] font-medium leading-6 text-slate-600 sm:text-base sm:leading-7">
              Select a car category and submit your inquiry. TravelEx will guide
              you with available options and final quote.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {vehicleCategories.map((category) => {
              const Icon = category.icon

              return (
                <article
                  key={category.title}
                  className="overflow-hidden rounded-[5px] border border-slate-100 bg-white shadow-[0_12px_34px_rgba(15,23,42,0.06)]"
                >
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={category.image}
                      alt={category.title}
                      className="h-full w-full object-cover transition duration-500 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent" />

                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-[5px] bg-white/15 text-white backdrop-blur">
                        <Icon />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 sm:p-5">
                    <p className="font-poppins text-[10px] font-bold uppercase tracking-[0.08em] text-[#00AEEF]">
                      {category.subtitle}
                    </p>

                    <h3 className="mt-1 font-fredoka text-[24px] font-semibold leading-tight text-slate-950">
                      {category.title}
                    </h3>

                    <p className="mt-2 font-poppins text-sm font-medium leading-6 text-slate-600">
                      {category.description}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {category.bestFor.map((item) => (
                        <span
                          key={item}
                          className="rounded-[5px] bg-[#F8FAFC] px-3 py-1 font-poppins text-[11px] font-semibold text-slate-600"
                        >
                          {item}
                        </span>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => openQuoteForm(category.title)}
                      className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-[5px] bg-slate-950 px-5 py-3 font-poppins text-xs font-semibold text-white transition hover:bg-[#FF6B00] sm:text-sm"
                    >
                      Request This Vehicle
                      <FaArrowRight className="text-[10px]" />
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="bg-white py-8 sm:py-16">
        <div className="mx-auto max-w-[1340px] px-4 sm:px-6 lg:px-8">
          <div className="mb-5 sm:mb-8">
            <p className="font-poppins text-[9px] font-bold uppercase tracking-[0.08em] text-[#FF6B00] sm:text-[12px] sm:tracking-[0.1em]">
              Common Destinations
            </p>

            <h2 className="mt-1 font-fredoka text-[24px] font-semibold leading-tight text-slate-950 sm:text-[42px]">
              Popular car rental locations
            </h2>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {popularDestinations.map((item) => (
              <div
                key={item.country}
                className="rounded-[5px] border border-slate-100 bg-[#F8FAFC] p-4 sm:p-5"
              >
                <h3 className="font-fredoka text-[24px] font-semibold text-slate-950">
                  {item.country}
                </h3>

                <p className="mt-1 font-poppins text-sm font-semibold text-[#00AEEF]">
                  {item.cities}
                </p>

                <p className="mt-2 font-poppins text-sm font-medium leading-6 text-slate-600">
                  {item.use}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="bg-[#F8FAFC] py-8 sm:py-16">
        <div className="mx-auto max-w-[1340px] px-4 sm:px-6 lg:px-8">
          <div className="mb-5 text-center sm:mb-8">
            <p className="font-poppins text-[9px] font-bold uppercase tracking-[0.08em] text-[#00AEEF] sm:text-[12px] sm:tracking-[0.1em]">
              Booking Process
            </p>

            <h2 className="mt-1 font-fredoka text-[24px] font-semibold leading-tight text-slate-950 sm:text-[42px]">
              How rental quote works
            </h2>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {processSteps.map((step, index) => (
              <div
                key={step.title}
                className="rounded-[5px] border border-slate-100 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.04)] sm:p-5"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-[5px] bg-[#FF6B00] font-poppins text-sm font-bold text-white">
                  {index + 1}
                </div>

                <h3 className="mt-4 font-fredoka text-[22px] font-semibold leading-tight text-slate-950">
                  {step.title}
                </h3>

                <p className="mt-2 font-poppins text-sm font-medium leading-6 text-slate-600">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

export default CarRentalPage