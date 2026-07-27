import { useRef, useState } from "react"
import {
  FaArrowRight,
  FaCar,
  FaCheckCircle,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaPlaneArrival,
  FaUser,
} from "react-icons/fa"

import Footer from "../components/Footer"
import AppSelect from "../components/common/AppSelect"
import AppDatePicker from "../components/common/AppDatePicker"
import AppTimePicker from "../components/common/AppTimePicker"
import ChildAgeFields from "../components/common/ChildAgeFields"
import { publicApi } from "../services/publicApi"
import { getLeadSource } from "../utils/leadSourceTracker"
import carFormAsset from "../assets/Cars/car-form.png"
import {
  getChildAgesError,
  getChildCount,
  normalizeChildAges,
  resizeChildAges,
} from "../utils/travelerForm"

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
  childAges: [],

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

const getDateIso = (value) => {
  if (!value) return undefined

  const date = new Date(`${value}T00:00:00`)
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString()
}

const bannerAnimationStyles =
  ".car-banner-asset{animation:carBannerFloat 4.5s ease-in-out infinite}" +
  "@keyframes carBannerFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}" +
  "@media (prefers-reduced-motion: reduce){.car-banner-asset{animation:none}}"

const CarRentalPage = () => {
  const [quoteForm, setQuoteForm] = useState(initialQuoteForm)
  const [quoteSent, setQuoteSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formError, setFormError] = useState("")

  const quoteFormRef = useRef(null)

  const handleQuoteChange = (event) => {
    const { name, value } = event.target

    setQuoteForm((prev) => {
      if (name === "children") {
        return {
          ...prev,
          children: value,
          childAges: resizeChildAges(prev.childAges, value),
        }
      }

      return {
        ...prev,
        [name]: value,
      }
    })

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

  const handleChildAgeChange = (index, value) => {
    setQuoteForm((prev) => ({
      ...prev,
      childAges: prev.childAges.map((age, ageIndex) =>
        ageIndex === index ? value : age
      ),
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
    if (!quoteForm.phone.trim())
      return "Please enter your mobile / WhatsApp number."
    if (!quoteForm.cityCountry.trim()) return "Please enter your city/country."
    if (!quoteForm.serviceRequired) return "Please select service required."
    if (!quoteForm.airline.trim()) return "Please enter airline name."
    if (!quoteForm.flightNumber.trim()) return "Please enter flight number."
    if (!quoteForm.flightDate) return "Please select arrival / departure date."
    if (!quoteForm.flightTime) return "Please select arrival / departure time."
    if (!quoteForm.airport.trim()) return "Please enter airport name."
    if (!quoteForm.pickupLocation.trim())
      return "Please enter pickup location."
    if (!quoteForm.dropoffLocation.trim())
      return "Please enter drop-off location."
    if (!quoteForm.vehiclePreference)
      return "Please select vehicle preference."

    const adults = Number(quoteForm.adults) || 0
    const children = getChildCount(quoteForm.children)

    if (adults < 1) return "Please enter at least 1 adult."
    if (children < 0) return "Children cannot be negative."

    const childAgesError = getChildAgesError(
      quoteForm.childAges,
      children
    )

    if (childAgesError) return childAgesError

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
      const children = getChildCount(quoteForm.children)
      const childAges = normalizeChildAges(quoteForm.childAges, children)
      const passengerCount = adults + children
      const leadSource = getLeadSource()

      const luggageInfo = `Checked Bags: ${
        quoteForm.checkedBags || 0
      }, Hand Carry Bags: ${quoteForm.handCarryBags || 0}`

      const message = [
        "Airport Pick-up / Drop-off Request",
        "",
        "Personal Information",
        `Full Name: ${quoteForm.fullName}`,
        `Mobile / WhatsApp: ${quoteForm.phone}`,
        `Email Address: ${quoteForm.email || "Not provided"}`,
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
        childAges.length ? `Child Ages: ${childAges.join(", ")}` : null,
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
      ].filter(Boolean).join("\n")

      const payload = {
        name: quoteForm.fullName.trim(),
        phone: quoteForm.phone.trim(),
        email: quoteForm.email.trim(),

        serviceType: "carRental",
        source: "car-rental-page",
        leadSource,
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
          childAges,
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
      <section
        ref={quoteFormRef}
        className="px-4 pb-10 pt-5 sm:px-6 sm:pb-16 sm:pt-8 lg:px-8"
      >
        <style>{bannerAnimationStyles}</style>

        <div className="mx-auto max-w-[920px]">
          <div className="relative mb-3 min-h-[100px] overflow-hidden rounded-[14px] bg-white px-3.5 py-3.5 shadow-[0_10px_34px_rgba(11,42,74,0.08)] sm:mb-4 sm:min-h-[150px] sm:rounded-[18px] sm:px-8 sm:py-5 lg:min-h-[190px]">
            <div className="pointer-events-none absolute -right-10 -top-16 hidden h-64 w-64 rounded-full bg-[#00AEEF]/10 blur-3xl sm:block"></div>
            <div className="pointer-events-none absolute -bottom-16 right-24 hidden h-40 w-40 rounded-full bg-[#FF6B00]/10 blur-3xl sm:block"></div>

            <div className="relative z-10 flex w-[58%] flex-col justify-center py-1 sm:absolute sm:inset-y-0 sm:left-0 sm:w-[68%] sm:px-8 sm:py-6 lg:w-[64%]">
              <p className="mb-1 flex items-center gap-1 whitespace-nowrap font-poppins text-[5.5px] font-bold uppercase leading-tight tracking-[0.04em] text-[#00AEEF] sm:mb-3 sm:gap-2 sm:whitespace-normal sm:text-[14px] sm:leading-normal sm:tracking-[0.22em]">
                <span className="inline-block h-[2px] w-2 shrink-0 bg-[#FF6B00] sm:w-8"></span>
                Smooth Rides, Every Time
              </p>

              <h2 className="flex flex-nowrap items-center gap-1 whitespace-nowrap font-fredoka text-[9px] font-semibold uppercase leading-[1.1] tracking-wide text-slate-950 sm:gap-3 sm:text-[34px] sm:leading-[1.05] lg:text-[38px]">
                <span className="whitespace-nowrap">Travel In</span>
                <span className="whitespace-nowrap rounded-[3px] bg-[#FF6B00] px-1.5 py-0.5 leading-none tracking-wide text-white shadow-sm sm:rounded-[6px] sm:px-4 sm:py-1.5">
                  Comfort
                </span>
              </h2>
            </div>

            <img
              src={carFormAsset}
              alt="Airport transfer illustration"
              className="car-banner-asset pointer-events-none absolute right-1 top-1/2 z-0 h-[105px] w-auto -translate-y-1/2 object-contain sm:right-3 sm:h-[230px] lg:right-4 lg:h-[260px]"
            />
          </div>
        </div>

        <div className="mx-auto max-w-[920px]">
          <form
            onSubmit={handleSubmit}
            className="rounded-[5px] border border-slate-100 bg-white p-4 shadow-[0_16px_45px_rgba(15,23,42,0.08)] sm:p-8"
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
              <div className="mb-1.5 flex items-center gap-2 sm:mb-2 sm:gap-2.5">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#00AEEF]/10 text-xs text-[#00AEEF] sm:h-8 sm:w-8 sm:text-sm">
                  <FaCar />
                </span>

                <p className="font-poppins text-[8.5px] font-bold uppercase tracking-[0.08em] text-[#00AEEF] sm:text-[12px] sm:tracking-[0.1em]">
                  Airport Transfer Inquiry
                </p>
              </div>

              <h1 className="font-fredoka text-[22px] font-semibold leading-tight text-slate-950 sm:text-[36px]">
                Share pick-up / drop-off details
              </h1>

              <p className="mt-1.5 font-poppins text-[10.5px] font-medium leading-5 text-slate-600 sm:mt-2 sm:text-sm sm:leading-7">
                Fill the details below and TravelEx consultant will contact
                you with suitable transfer options.
              </p>
            </div>

            {quoteSent && (
              <div className="mb-5 rounded-[5px] border border-green-100 bg-green-50 p-5 sm:p-6">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[5px] bg-green-600 text-white">
                    <FaCheckCircle className="text-lg" />
                  </div>

                  <div>
                    <h2 className="font-fredoka text-[24px] font-semibold leading-tight text-green-700">
                      Transfer request submitted
                    </h2>

                    <p className="mt-1 font-poppins text-[11.5px] font-medium leading-5 text-green-700 sm:text-sm sm:leading-7">
                      Our team will contact you soon.
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
                <h3 className="font-fredoka text-[20px] font-semibold text-slate-950">
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
                    <label className={labelClass}>Email Address (Optional)</label>
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
                <h3 className="font-fredoka text-[20px] font-semibold text-slate-950">
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
                <h3 className="font-fredoka text-[20px] font-semibold text-slate-950">
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
                <h3 className="font-fredoka text-[20px] font-semibold text-slate-950">
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
                <h3 className="font-fredoka text-[20px] font-semibold text-slate-950">
                  Passengers
                </h3>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
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
                </div>

                <ChildAgeFields
                  ages={quoteForm.childAges}
                  onChange={handleChildAgeChange}
                  labelClass={labelClass}
                  inputClass={inputClass}
                  className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
                />
              </div>

              {/* Luggage */}
              <div>
                <h3 className="font-fredoka text-[20px] font-semibold text-slate-950">
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
                <h3 className="font-fredoka text-[20px] font-semibold text-slate-950">
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
                  className="min-h-[130px] w-full resize-none rounded-[5px] border border-slate-200 bg-white px-3 py-3 font-poppins text-xs font-semibold leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#00AEEF] focus:ring-2 focus:ring-[#00AEEF]/10 sm:min-h-[150px] sm:px-4 sm:text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-[5px] bg-[#FF6B00] px-6 py-3.5 font-poppins text-sm font-semibold text-white transition hover:bg-[#00AEEF] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Submitting Request..." : "Submit Transfer Request"}
              {!loading && <FaArrowRight className="text-xs" />}
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </main>
  )
}

export default CarRentalPage