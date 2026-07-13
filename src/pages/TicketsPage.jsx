import { useState } from "react"
import {
  FaArrowRight,
  FaCheckCircle,
  FaEnvelope,
  FaPlaneArrival,
  FaPlaneDeparture,
  FaPhoneAlt,
  FaTicketAlt,
  FaUser,
} from "react-icons/fa"

import Footer from "../components/Footer"
import AppSelect from "../components/common/AppSelect"
import AppDatePicker from "../components/common/AppDatePicker"
import { publicApi } from "../services/publicApi"
import { getLeadSource } from "../utils/leadSourceTracker"
import ticketFormAsset from "../assets/ticket/ticket-form.png"

const classOptions = ["Economy", "Premium Economy", "Business", "First Class"]

const labelClass =
  "mb-1.5 block font-poppins text-[9px] font-bold uppercase tracking-[0.08em] text-slate-400 sm:mb-2 sm:text-xs"

const inputClass =
  "h-11 w-full rounded-[5px] border border-slate-200 bg-white px-3 font-poppins text-xs font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#00AEEF] focus:ring-2 focus:ring-[#00AEEF]/10 sm:h-12 sm:px-4 sm:text-sm"

const iconInputClass =
  "h-11 w-full rounded-[5px] border border-slate-200 bg-white pl-10 pr-3 font-poppins text-xs font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#00AEEF] focus:ring-2 focus:ring-[#00AEEF]/10 sm:h-12 sm:pl-11 sm:pr-4 sm:text-sm"

const initialForm = {
  fullName: "",
  phone: "",
  email: "",
  departureCity: "",
  destinationCity: "",
  departureDate: "",
  returnDate: "",
  adults: "1",
  children: "0",
  infants: "0",
  preferredAirline: "",
  travelClass: "",
  additionalRequirements: "",
  companyWebsite: "",
}

const toIsoDate = (value) => {
  if (!value) return undefined
  return new Date(`${value}T00:00:00`).toISOString()
}

const getNumber = (value, fallback = 0) =>
  Math.max(fallback, Number(value) || fallback)

const TicketsPage = () => {
  const [formData, setFormData] = useState(initialForm)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    setError("")
    setSuccess("")
  }

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    setError("")
    setSuccess("")
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSuccess("")
    setError("")

    if (!formData.fullName.trim()) {
      setError("Please enter your full name.")
      return
    }

    if (!formData.phone.trim()) {
      setError("Please enter your mobile / WhatsApp number.")
      return
    }

    if (!formData.email.trim()) {
      setError("Please enter your email address.")
      return
    }

    if (!formData.departureCity.trim()) {
      setError("Please enter departure city.")
      return
    }

    if (!formData.destinationCity.trim()) {
      setError("Please enter destination city.")
      return
    }

    if (!formData.departureDate) {
      setError("Please select departure date.")
      return
    }

    if (!formData.travelClass) {
      setError("Please select class.")
      return
    }

    try {
      setLoading(true)

      const travelers = {
        adults: getNumber(formData.adults, 1),
        children: getNumber(formData.children, 0),
        infants: getNumber(formData.infants, 0),
      }

      const leadSource = getLeadSource()

      const message = [
        "Air ticket booking inquiry",
        "",
        `Full Name: ${formData.fullName}`,
        `Mobile / WhatsApp: ${formData.phone}`,
        `Email Address: ${formData.email}`,
        `Departure City: ${formData.departureCity}`,
        `Destination City: ${formData.destinationCity}`,
        `Departure Date: ${formData.departureDate}`,
        `Return Date: ${formData.returnDate || "Not provided"}`,
        `Adults: ${travelers.adults}`,
        `Children: ${travelers.children}`,
        `Infants: ${travelers.infants}`,
        `Preferred Airline: ${formData.preferredAirline || "Not provided"}`,
        `Class: ${formData.travelClass}`,
        "",
        formData.additionalRequirements
          ? `Additional Requirements: ${formData.additionalRequirements}`
          : "Additional Requirements: Not provided",
      ].join("\n")

      const payload = {
        name: formData.fullName.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),

        serviceType: "ticket",
        source: "ticket-page",
        leadSource,
        pageUrl: window.location.href,

        departureCity: formData.departureCity.trim(),
        destinationCity: formData.destinationCity.trim(),
        destination: `${formData.departureCity.trim()} to ${formData.destinationCity.trim()}`,

        travelDate: toIsoDate(formData.departureDate),
        returnDate: toIsoDate(formData.returnDate),

        travelers,

        preferredAirline: formData.preferredAirline.trim(),
        travelClass: formData.travelClass,

        additionalRequirements: formData.additionalRequirements.trim(),
        message,
        priority: "high",
        companyWebsite: formData.companyWebsite,
      }

      await publicApi.createLead(payload)

      setSuccess(
        "Your air ticket inquiry has been submitted successfully. Team will contact you shortly."
      )

      setFormData(initialForm)
      window.scrollTo({ top: 0, behavior: "smooth" })
    } catch (err) {
      console.error("Ticket inquiry error:", err)
      setError(
        err.message ||
          "We could not submit your ticket inquiry right now. Please try again."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="bg-[#F8FAFC]">
      <section className="px-4 pb-10 pt-5 sm:px-6 sm:pb-16 sm:pt-8 lg:px-8">
        {/* Banner — exactly same width as form */}
        <div className="mx-auto max-w-[920px]">
          <div className="relative mb-3 min-h-[102px] overflow-hidden rounded-[14px] bg-white px-3.5 py-3.5 shadow-[0_10px_34px_rgba(11,42,74,0.08)] sm:mb-4 sm:min-h-[150px] sm:rounded-[18px] sm:px-8 sm:py-5 lg:min-h-[170px]">
            <style>{`
              @keyframes bannerFadeUp {
                0%   { opacity: 0; transform: translateY(16px); }
                100% { opacity: 1; transform: translateY(0); }
              }

              @keyframes bannerStampIn {
                0%   { opacity: 0; transform: translateY(24px); }
                100% { opacity: 1; transform: translateY(0); }
              }

              @keyframes bannerAssetIn {
                from { opacity: 0; transform: translateX(46px); }
                to   { opacity: 1; transform: translateX(0); }
              }

              @keyframes bannerFloat {
                0%, 100% { transform: translateY(0); }
                50%      { transform: translateY(-9px); }
              }

              .ticket-banner-asset {
                animation:
                  bannerAssetIn 0.9s ease-out both,
                  bannerFloat 4.5s ease-in-out 0.9s infinite;
              }

              @media (prefers-reduced-motion: reduce) {
                [data-ticket-stagger],
                .ticket-banner-asset {
                  animation: none !important;
                }
              }
            `}</style>

            {/* Soft ambient glow for depth */}
            <div className="pointer-events-none absolute -right-10 -top-16 hidden h-64 w-64 rounded-full bg-[#00AEEF]/10 blur-3xl sm:block" />
            <div className="pointer-events-none absolute -bottom-16 right-24 hidden h-40 w-40 rounded-full bg-[#FF6B00]/10 blur-3xl sm:block" />

            {/* Text block — mobile width is limited so heading never touches the vector */}
            <div className="absolute inset-y-0 left-0 z-10 flex w-[68%] items-center px-3.5 py-3 sm:w-[72%] sm:px-8 sm:py-6 lg:w-[70%]">
              <div className="w-full">
                <p
                  data-ticket-stagger
                  style={{ animation: "bannerFadeUp 0.6s ease-out 0s both" }}
                  className="mb-1 flex items-center gap-1 whitespace-nowrap font-poppins text-[6px] font-bold uppercase leading-tight tracking-[0.05em] text-[#00AEEF] sm:mb-3 sm:gap-2 sm:whitespace-normal sm:text-[14px] sm:tracking-[0.22em]"
                >
                  <span className="inline-block h-[1.5px] w-3 shrink-0 bg-[#FF6B00] sm:h-[2px] sm:w-8" />
                  Your Trusted Flight Partner
                </p>

                <h2
                  data-ticket-stagger
                  style={{ animation: "bannerFadeUp 0.6s ease-out 0.15s both" }}
                  className="flex flex-nowrap items-center justify-start gap-[2px] whitespace-nowrap font-fredoka text-[9px] font-semibold uppercase leading-[1.05] tracking-[-0.09em] text-slate-950 sm:gap-3 sm:text-[34px] sm:tracking-wide lg:text-[38px]"
                >
                  <span className="whitespace-nowrap">Take Off With</span>

                  <span
                    className="whitespace-nowrap rounded-[3px] bg-[#FF6B00] px-1 py-[2px] leading-none tracking-[-0.07em] text-white shadow-sm sm:rounded-[6px] sm:px-4 sm:py-1.5 sm:tracking-wide"
                    style={{ animation: "bannerStampIn 0.9s ease-out 0.3s both" }}
                  >
                    Confidence
                  </span>
                </h2>
              </div>
            </div>

            {/* Illustration — visible on mobile, smaller and pushed right */}
            <img
              src={ticketFormAsset}
              alt="Air ticket booking illustration"
              className="ticket-banner-asset pointer-events-none absolute -right-2 top-1/2 z-0 block h-[78px] w-auto -translate-y-1/2 object-contain sm:right-5 sm:h-[170px] lg:right-7 lg:h-[190px]"
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
              value={formData.companyWebsite}
              onChange={handleChange}
              className="hidden"
              tabIndex="-1"
              autoComplete="off"
            />

            <div className="mb-4 sm:mb-6">
              <div className="mb-1.5 flex items-center gap-2 sm:mb-2 sm:gap-2.5">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#00AEEF]/10 text-xs text-[#00AEEF] sm:h-8 sm:w-8 sm:text-sm">
                  <FaTicketAlt />
                </span>

                <p className="font-poppins text-[8.5px] font-bold uppercase tracking-[0.08em] text-[#00AEEF] sm:text-[12px] sm:tracking-[0.1em]">
                  Air Ticket Booking Form
                </p>
              </div>

              <h1 className="font-fredoka text-[22px] font-semibold leading-tight text-slate-950 sm:text-[36px]">
                Request ticket quote
              </h1>

              <p className="mt-1.5 font-poppins text-[10.5px] font-medium leading-5 text-slate-600 sm:mt-2 sm:text-sm sm:leading-7">
                Fill your route, passenger and class details. TravelEx team
                will contact you with suitable ticket options.
              </p>
            </div>

            {success && (
              <div className="mb-4 flex items-start gap-3 rounded-[5px] border border-green-200 bg-green-50 px-4 py-3 font-poppins text-[11.5px] font-semibold leading-5 text-green-700 sm:text-sm">
                <FaCheckCircle className="mt-0.5 shrink-0" />
                <span>{success}</span>
              </div>
            )}

            {error && (
              <div className="mb-4 rounded-[5px] border border-red-200 bg-red-50 px-4 py-3 font-poppins text-[11.5px] font-semibold leading-5 text-red-700 sm:text-sm">
                {error}
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className={labelClass}>Full Name *</label>
                <div className="relative">
                  <FaUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 sm:left-4 sm:text-sm" />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter full name"
                    className={iconInputClass}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Mobile / WhatsApp *</label>
                <div className="relative">
                  <FaPhoneAlt className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 sm:left-4 sm:text-sm" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="03XXXXXXXXX"
                    className={iconInputClass}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Email Address *</label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 sm:left-4 sm:text-sm" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className={iconInputClass}
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Departure City *</label>
                <div className="relative">
                  <FaPlaneDeparture className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 sm:left-4 sm:text-sm" />
                  <input
                    type="text"
                    name="departureCity"
                    value={formData.departureCity}
                    onChange={handleChange}
                    placeholder="Karachi, Lahore, Islamabad..."
                    className={iconInputClass}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Destination City *</label>
                <div className="relative">
                  <FaPlaneArrival className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 sm:left-4 sm:text-sm" />
                  <input
                    type="text"
                    name="destinationCity"
                    value={formData.destinationCity}
                    onChange={handleChange}
                    placeholder="Dubai, Jeddah, Istanbul..."
                    className={iconInputClass}
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <AppDatePicker
                label="Departure Date *"
                value={formData.departureDate}
                onChange={(value) => handleSelectChange("departureDate", value)}
                placeholder="Select departure date"
              />

              <AppDatePicker
                label="Return Date"
                value={formData.returnDate}
                onChange={(value) => handleSelectChange("returnDate", value)}
                placeholder="Select return date"
              />
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <div>
                <label className={labelClass}>Adults *</label>
                <input
                  type="number"
                  name="adults"
                  min="1"
                  value={formData.adults}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Children</label>
                <input
                  type="number"
                  name="children"
                  min="0"
                  value={formData.children}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Infants</label>
                <input
                  type="number"
                  name="infants"
                  min="0"
                  value={formData.infants}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Preferred Airline</label>
                <input
                  type="text"
                  name="preferredAirline"
                  value={formData.preferredAirline}
                  onChange={handleChange}
                  placeholder="PIA, Emirates, Qatar Airways..."
                  className={inputClass}
                />
              </div>

              <AppSelect
                label="Class *"
                value={formData.travelClass}
                onChange={(value) => handleSelectChange("travelClass", value)}
                placeholder="Select class"
                options={classOptions}
              />
            </div>

            <div className="mt-4">
              <label className={labelClass}>Additional Requirements</label>
              <textarea
                rows="4"
                name="additionalRequirements"
                value={formData.additionalRequirements}
                onChange={handleChange}
                placeholder="Write baggage needs, flexible dates, preferred timings, or any other ticket requirement..."
                className="min-h-[130px] w-full resize-none rounded-[5px] border border-slate-200 bg-white px-3 py-3 font-poppins text-xs font-semibold leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#00AEEF] focus:ring-2 focus:ring-[#00AEEF]/10 sm:min-h-[150px] sm:px-4 sm:text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-[5px] bg-[#FF6B00] px-6 py-3.5 font-poppins text-sm font-semibold text-white transition hover:bg-[#00AEEF] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Submitting..." : "Submit Ticket Inquiry"}
              {!loading && <FaArrowRight className="text-xs" />}
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </main>
  )
}

export default TicketsPage