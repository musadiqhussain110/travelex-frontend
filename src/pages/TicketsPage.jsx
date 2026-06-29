import { useState } from "react"
import { Link } from "react-router-dom"
import {
  FaArrowRight,
  FaCalendarAlt,
  FaCheckCircle,
  FaEnvelope,
  FaGlobeAsia,
  FaMapMarkerAlt,
  FaPlane,
  FaPlaneArrival,
  FaPlaneDeparture,
  FaPhoneAlt,
  FaTicketAlt,
  FaUser,
  FaUsers,
  FaWhatsapp,
} from "react-icons/fa"

import Footer from "../components/Footer"
import AppSelect from "../components/common/AppSelect"
import { publicApi } from "../services/publicApi"
import ticketHero from "../assets/ticket/ticket.jpg"
const initialForm = {
  ticketType: "Domestic Ticket",
  tripType: "One Way",
  fromCity: "",
  toCity: "",
  departureDate: "",
  returnDate: "",
  travelClass: "Economy",
  adults: "1",
  children: "0",
  infants: "0",
  flexibleDates: "Yes",
  fullName: "",
  phone: "",
  email: "",
  budget: "",
  message: "",
  companyWebsite: "",
}

const ticketTypeOptions = ["Domestic Ticket", "International Ticket"]

const tripTypeOptions = ["One Way", "Return", "Multi City"]

const classOptions = ["Economy", "Premium Economy", "Business", "First Class"]

const flexibleOptions = ["Yes", "No"]

const trustPoints = [
  "Domestic and international ticket support",
  "One-way, return and multi-city guidance",
  "Economy and business class options",
  "Quote shared after availability check",
]

const labelClass =
  "mb-1.5 block font-poppins text-[9px] font-bold uppercase tracking-[0.08em] text-slate-400 sm:mb-2 sm:text-xs"

const inputClass =
  "h-11 w-full rounded-[5px] border border-slate-200 bg-white px-3 font-poppins text-xs font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#00AEEF] focus:ring-2 focus:ring-[#00AEEF]/10 sm:h-12 sm:px-4 sm:text-sm"

const iconInputClass =
  "h-11 w-full rounded-[5px] border border-slate-200 bg-white pl-10 pr-3 font-poppins text-xs font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#00AEEF] focus:ring-2 focus:ring-[#00AEEF]/10 sm:h-12 sm:pl-11 sm:pr-4 sm:text-sm"

const whatsappLink =
  "https://wa.me/923111444192?text=Assalamualaikum%20TravelEx%2C%20I%20need%20guidance%20about%20domestic%20or%20international%20tickets."

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

    if (!formData.fromCity.trim()) {
      setError("Please enter departure city or airport.")
      return
    }

    if (!formData.toCity.trim()) {
      setError("Please enter arrival city or airport.")
      return
    }

    if (!formData.departureDate) {
      setError("Please select departure date.")
      return
    }

    if (formData.tripType === "Return" && !formData.returnDate) {
      setError("Please select return date for return ticket.")
      return
    }

    if (!formData.fullName.trim()) {
      setError("Please enter your full name.")
      return
    }

    if (!formData.phone.trim()) {
      setError("Please enter your phone or WhatsApp number.")
      return
    }

    if (!formData.email.trim()) {
      setError("Please enter your email address.")
      return
    }

    try {
      setLoading(true)

      const adults = Math.max(1, Number(formData.adults) || 1)
      const children = Math.max(0, Number(formData.children) || 0)
      const infants = Math.max(0, Number(formData.infants) || 0)

      const message = [
        `${formData.ticketType} inquiry`,
        "",
        `Trip Type: ${formData.tripType}`,
        `From: ${formData.fromCity}`,
        `To: ${formData.toCity}`,
        `Departure Date: ${formData.departureDate}`,
        `Return Date: ${formData.returnDate || "Not required / not provided"}`,
        `Travel Class: ${formData.travelClass}`,
        `Flexible Dates: ${formData.flexibleDates}`,
        "",
        `Passengers: ${adults} adult(s), ${children} child(ren), ${infants} infant(s)`,
        `Budget: ${formData.budget || "Not provided"}`,
        "",
        formData.message
          ? `Additional Message: ${formData.message}`
          : "Additional Message: Not provided",
      ].join("\n")

      const payload = {
        name: formData.fullName.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        serviceType: "ticket",
        source: "ticket-page",
        pageUrl: window.location.href,
        destination: `${formData.fromCity.trim()} to ${formData.toCity.trim()}`,
        travelDate: new Date(`${formData.departureDate}T00:00:00`).toISOString(),
        travelers: {
          adults,
          children,
          infants,
        },
        budget: formData.budget.trim(),
        message,
        priority: "high",
        companyWebsite: formData.companyWebsite,
      }

      await publicApi.createLead(payload)

      setSuccess(
        "Your ticket inquiry has been submitted successfully. TravelEx admin team can now view it in the CRM dashboard."
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
      {/* Hero */}
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
                Domestic & International Tickets
              </p>

<h1 className="mt-1 font-fredoka text-[18px] font-semibold leading-[1.08] text-white sm:mt-2 sm:text-[38px] sm:uppercase sm:leading-[1.08] lg:text-[44px]">
                 <span className="sm:hidden">Book Flight Tickets</span>
                <span className="hidden sm:inline">
                  Get domestic and international ticket support
                </span>
              </h1>

              <p className="mt-1 max-w-3xl font-poppins text-[9px] font-medium leading-4 text-white/85 sm:mt-3 sm:text-base sm:leading-7">
                <span className="sm:hidden">
                  Share route and travel date for ticket quote.
                </span>

                <span className="hidden sm:inline">
                  Submit your travel route, passenger count and preferred dates.
                  TravelEx will check availability and guide you with suitable
                  domestic or international ticket options.
                </span>
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

<div className="hidden rounded-[14px] border border-white/15 bg-white/10 p-4 shadow-[0_18px_45px_rgba(0,0,0,0.22)] backdrop-blur-md lg:block">
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


      {/* Ticket Form */}
<section id="ticket-form" className="scroll-mt-24 bg-white pt-4 pb-8 sm:pt-7 sm:pb-12">
        <div className="mx-auto grid max-w-[1440px] gap-5 px-4 sm:px-6 lg:grid-cols-[1fr_360px] lg:gap-6 lg:px-8">
          <form
            onSubmit={handleSubmit}
            className="rounded-[12px] border border-slate-100 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.06)] sm:p-7"
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
                Ticket Inquiry Form
              </p>

              <h2 className="font-fredoka text-[20px] font-semibold leading-[1.08] text-slate-950 sm:text-[40px]">
                Request ticket quote
              </h2>

              <p className="mt-1.5 max-w-3xl font-poppins text-[10.5px] font-medium leading-5 text-slate-600 sm:mt-2 sm:text-base sm:leading-7">
                Fill your route and passenger details. TravelEx team will
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

            <div className="grid gap-4 sm:grid-cols-2">
              <AppSelect
                label="Ticket Type"
                value={formData.ticketType}
                onChange={(value) => handleSelectChange("ticketType", value)}
                placeholder="Select ticket type"
                options={ticketTypeOptions}
              />

              <AppSelect
                label="Trip Type"
                value={formData.tripType}
                onChange={(value) => handleSelectChange("tripType", value)}
                placeholder="Select trip type"
                options={tripTypeOptions}
              />

              <div>
                <label className={labelClass}>From</label>

                <div className="relative">
                  <FaPlaneDeparture className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 sm:left-4 sm:text-sm" />

                  <input
                    type="text"
                    name="fromCity"
                    value={formData.fromCity}
                    onChange={handleChange}
                    placeholder="Karachi, Lahore, Islamabad..."
                    className={iconInputClass}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>To</label>

                <div className="relative">
                  <FaPlaneArrival className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 sm:left-4 sm:text-sm" />

                  <input
                    type="text"
                    name="toCity"
                    value={formData.toCity}
                    onChange={handleChange}
                    placeholder="Dubai, Jeddah, Istanbul..."
                    className={iconInputClass}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Departure Date</label>

                <div className="relative">
                  <FaCalendarAlt className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 sm:left-4 sm:text-sm" />

                  <input
                    type="date"
                    name="departureDate"
                    value={formData.departureDate}
                    onChange={handleChange}
                    className={iconInputClass}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Return Date</label>

                <div className="relative">
                  <FaCalendarAlt className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 sm:left-4 sm:text-sm" />

                  <input
                    type="date"
                    name="returnDate"
                    value={formData.returnDate}
                    onChange={handleChange}
                    className={iconInputClass}
                  />
                </div>
              </div>

              <AppSelect
                label="Travel Class"
                value={formData.travelClass}
                onChange={(value) => handleSelectChange("travelClass", value)}
                placeholder="Select class"
                options={classOptions}
              />

              <AppSelect
                label="Flexible Dates?"
                value={formData.flexibleDates}
                onChange={(value) => handleSelectChange("flexibleDates", value)}
                placeholder="Flexible dates?"
                options={flexibleOptions}
              />
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <div>
                <label className={labelClass}>Adults</label>
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

            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <div>
                <label className={labelClass}>Full Name</label>

                <div className="relative">
                  <FaUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 sm:left-4 sm:text-sm" />

                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className={iconInputClass}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Phone / WhatsApp</label>

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
                <label className={labelClass}>Email</label>

                <div className="relative">
                  <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 sm:left-4 sm:text-sm" />

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email"
                    className={iconInputClass}
                  />
                </div>
              </div>
            </div>

            <div className="mt-4">
              <label className={labelClass}>Budget / Preferred Airline</label>
              <input
                type="text"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                placeholder="Example: PKR 80,000 budget / Emirates preferred"
                className={inputClass}
              />
            </div>

            <div className="mt-4">
              <label className={labelClass}>Additional Message</label>
              <textarea
                rows="5"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Write baggage requirement, preferred airline, exact route, stopover preference, or special travel need..."
                className="w-full resize-none rounded-[5px] border border-slate-200 bg-white px-3 py-3 font-poppins text-xs font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#00AEEF] focus:ring-2 focus:ring-[#00AEEF]/10 sm:px-4 sm:text-sm"
              />
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-[5px] bg-[#FF6B00] px-5 py-2.5 font-poppins text-xs font-semibold text-white transition hover:bg-[#00AEEF] disabled:cursor-not-allowed disabled:opacity-70 sm:px-6 sm:py-3 sm:text-sm"
              >
                {loading ? "Submitting..." : "Submit Ticket Inquiry"}
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

          {/* Sidebar */}
          <aside className="h-fit lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-[12px] border border-slate-100 bg-white p-4 shadow-[0_16px_45px_rgba(15,23,42,0.08)] sm:p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-[12px] bg-[#FF6B00]/10 text-xl text-[#FF6B00] sm:h-14 sm:w-14 sm:text-2xl">
                <FaPlane />
              </div>

              <h2 className="mt-4 font-fredoka text-[22px] font-semibold leading-tight text-slate-950 sm:text-2xl">
                How ticket inquiry works
              </h2>

              <div className="mt-4 grid gap-3">
                {[
                  "You submit route and passenger details.",
                  "TravelEx checks domestic or international ticket options.",
                  "Our consultant shares available quote and airline options.",
                  "Final booking is confirmed after your approval.",
                ].map((item) => (
                  <p
                    key={item}
                    className="flex gap-2.5 font-poppins text-[11.5px] font-medium leading-5 text-slate-600 sm:gap-3 sm:text-sm sm:leading-6"
                  >
                    <FaCheckCircle className="mt-1 shrink-0 text-[#00AEEF]" />
                    {item}
                  </p>
                ))}
              </div>

              <p className="mt-4 rounded-[5px] bg-[#F8FAFC] p-3.5 font-poppins text-[10.5px] font-medium leading-5 text-slate-500 sm:mt-5 sm:p-4 sm:text-xs sm:leading-6">
                Note: Ticket prices change based on airline availability,
                travel date, baggage, booking time, route, and seat class.
              </p>

              <a
                href={whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-[5px] bg-[#25D366] px-5 py-2.5 font-poppins text-xs font-semibold text-white transition hover:bg-[#00AEEF] sm:mt-5 sm:px-6 sm:py-3 sm:text-sm"
              >
                <FaWhatsapp />
                Ask on WhatsApp
              </a>
            </div>
          </aside>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-[#F8FAFC] pb-8 sm:pb-14">
        <div className="mx-auto max-w-[1180px] px-4 sm:px-6 lg:px-8">
          <div className="rounded-[5px] border border-slate-100 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.06)] sm:p-7">
            <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <h3 className="font-fredoka text-[21px] font-semibold leading-tight text-slate-950 sm:text-[32px]">
                  Need urgent domestic or international ticket support?
                </h3>

                <p className="mt-1.5 max-w-3xl font-poppins text-[11.5px] font-medium leading-5 text-slate-600 sm:text-sm sm:leading-7">
                  Share your route, date, number of travelers and preferred
                  airline. TravelEx will guide you with suitable ticket options.
                </p>

                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  <p className="flex items-center gap-2 font-poppins text-[11.5px] font-semibold text-slate-700 sm:text-sm">
                    <FaMapMarkerAlt className="shrink-0 text-[#00AEEF]" />
                    Domestic and international routes
                  </p>

                  <p className="flex items-center gap-2 font-poppins text-[11.5px] font-semibold text-slate-700 sm:text-sm">
                    <FaUsers className="shrink-0 text-[#00AEEF]" />
                    Individual, family and group support
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
                <a
                  href="#ticket-form"
                  className="inline-flex items-center justify-center gap-2 rounded-[5px] bg-[#FF6B00] px-5 py-2.5 font-poppins text-xs font-semibold text-white transition hover:bg-[#00AEEF] sm:px-6 sm:py-3 sm:text-sm"
                >
                  Request Quote
                  <FaArrowRight className="text-[10px] sm:text-xs" />
                </a>

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

export default TicketsPage