import { useState } from "react"
import {
  FaArrowRight,
  FaCalendarAlt,
  FaCheckCircle,
  FaEnvelope,
  FaPlaneArrival,
  FaPlaneDeparture,
  FaPhoneAlt,
  FaTicketAlt,
  FaUser,
  FaWhatsapp,
} from "react-icons/fa"

import Footer from "../components/Footer"
import AppSelect from "../components/common/AppSelect"
import AppDatePicker from "../components/common/AppDatePicker"
import { publicApi } from "../services/publicApi"
import ticketHero from "../assets/ticket/ticket.jpg"

const classOptions = ["Economy", "Premium Economy", "Business", "First Class"]

const trustPoints = [
  "Domestic and international ticket support",
  "Economy, premium economy, business and first class options",
  "Preferred airline request can be shared",
  "Quote shared after availability check",
]

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

const getNumber = (value, fallback = 0) => Math.max(fallback, Number(value) || fallback)

const whatsappLink =
  "https://wa.me/923111444192?text=Assalamualaikum%20TravelEx%2C%20I%20need%20guidance%20about%20air%20ticket%20booking."

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
        "Your air ticket inquiry has been submitted successfully. TravelEx admin team can now view it in the CRM dashboard."
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
      <section className="relative overflow-hidden bg-slate-950">
        <img
          src={ticketHero}
          alt="Domestic and international flight tickets"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-slate-950/65" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/0 to-slate-950/0" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,174,239,0.22),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(255,107,0,0.18),transparent_32%)]" />

        <div className="relative z-10 mx-auto max-w-[1340px] px-4 py-6 sm:px-6 sm:py-9 lg:px-8 lg:py-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_380px] lg:items-center">
            <div className="max-w-5xl">
              <p className="font-poppins text-[8px] font-bold uppercase tracking-[0.08em] text-[#00AEEF] sm:text-[12px] sm:tracking-[0.1em]">
                Air Ticket Booking
              </p>

              <h1 className="mt-1 font-fredoka text-[18px] font-semibold leading-[1.08] text-white sm:mt-2 sm:text-[38px] sm:uppercase sm:leading-[1.08] lg:text-[44px]">
                <span className="sm:hidden">Book Air Tickets</span>
                <span className="hidden sm:inline">
                  Request domestic and international air ticket booking
                </span>
              </h1>

              <p className="mt-1 max-w-3xl font-poppins text-[9px] font-medium leading-4 text-white/85 sm:mt-3 sm:text-base sm:leading-7">
                Share your route, dates, passenger count, preferred airline and
                class. TravelEx will check availability and guide you with the
                suitable ticket options.
              </p>

              <div className="mt-3 flex flex-col gap-2 sm:mt-6 sm:flex-row sm:gap-3">
                <a
                  href="#ticket-form"
                  className="inline-flex items-center justify-center gap-2 rounded-[5px] bg-[#FF6B00] px-5 py-2.5 font-poppins text-xs font-semibold text-white transition hover:bg-[#00AEEF] sm:px-6 sm:py-3 sm:text-sm"
                >
                  Request Ticket Quote
                  <FaArrowRight className="text-[10px] sm:text-xs" />
                </a>

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

            <div className="hidden rounded-[5px] border border-white/15 bg-white/10 p-4 shadow-[0_18px_45px_rgba(0,0,0,0.22)] backdrop-blur-md lg:block">
              <div className="flex h-12 w-12 items-center justify-center rounded-[5px] bg-[#00AEEF]/15 text-[#00AEEF]">
                <FaTicketAlt />
              </div>

              <h3 className="mt-3 font-fredoka text-[22px] font-semibold leading-tight text-white">
                Ticket quote support
              </h3>

              <p className="mt-2 font-poppins text-xs font-medium leading-6 text-white/70">
                Ticket prices depend on route, date, airline availability,
                baggage, class and booking time.
              </p>

              <div className="mt-4 grid gap-2">
                {trustPoints.map((item) => (
                  <p
                    key={item}
                    className="flex items-center gap-2 rounded-[5px] bg-white/10 px-3 py-1.5 font-poppins text-[11px] font-semibold text-white/85"
                  >
                    <FaCheckCircle className="shrink-0 text-[#00AEEF]" />
                    {item}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="ticket-form" className="scroll-mt-24 bg-white pt-4 pb-8 sm:pt-7 sm:pb-12">
        <div className="mx-auto grid max-w-[1440px] gap-5 px-4 sm:px-6 lg:grid-cols-[1fr_360px] lg:gap-6 lg:px-8">
          <form
            onSubmit={handleSubmit}
            className="rounded-[5px] border border-slate-100 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.06)] sm:p-7"
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
              <p className="mb-1.5 font-poppins text-[8.5px] font-bold uppercase tracking-[0.08em] text-[#00AEEF] sm:mb-2 sm:text-[12px] sm:tracking-[0.1em]">
                Air Ticket Booking Form
              </p>

              <h2 className="font-fredoka text-[20px] font-semibold leading-[1.08] text-slate-950 sm:text-[40px]">
                Request ticket quote
              </h2>

              <p className="mt-1.5 max-w-3xl font-poppins text-[10.5px] font-medium leading-5 text-slate-600 sm:mt-2 sm:text-base sm:leading-7">
                Fill your route, passenger and class details. TravelEx team will
                contact you with suitable ticket options.
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
                <input type="number" name="adults" min="1" value={formData.adults} onChange={handleChange} className={inputClass} />
              </div>

              <div>
                <label className={labelClass}>Children</label>
                <input type="number" name="children" min="0" value={formData.children} onChange={handleChange} className={inputClass} />
              </div>

              <div>
                <label className={labelClass}>Infants</label>
                <input type="number" name="infants" min="0" value={formData.infants} onChange={handleChange} className={inputClass} />
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
                className={`${inputClass} h-auto resize-none py-3 leading-6`}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-[5px] bg-[#FF6B00] px-6 py-3.5 font-poppins text-sm font-semibold text-white transition hover:bg-[#00AEEF] disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
            >
              {loading ? "Submitting..." : "Submit Ticket Inquiry"}
              {!loading && <FaArrowRight className="text-xs" />}
            </button>
          </form>

          <aside className="h-fit rounded-[5px] border border-slate-100 bg-[#F8FAFC] p-5">
            <h3 className="font-fredoka text-[24px] font-semibold text-slate-950">
              Before quote confirmation
            </h3>

            <div className="mt-4 grid gap-3">
              {trustPoints.map((point) => (
                <p
                  key={point}
                  className="flex items-start gap-2 rounded-[5px] bg-white px-3 py-2 font-poppins text-xs font-semibold leading-5 text-slate-700"
                >
                  <FaCheckCircle className="mt-0.5 shrink-0 text-[#00AEEF]" />
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
              WhatsApp TravelEx
            </a>
          </aside>
        </div>
      </section>

      <Footer />
    </main>
  )
}

export default TicketsPage
