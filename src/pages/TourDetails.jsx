import { useRef, useState } from "react"
import { Link, useParams } from "react-router-dom"
import {
  FaArrowLeft,
  FaArrowRight,
  FaCalendarAlt,
  FaCheckCircle,
  FaEnvelope,
  FaInfoCircle,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaRegClock,
  FaRoute,
  FaUser,
  FaWhatsapp,
} from "react-icons/fa"

import { tours } from "../data/tours"
import Footer from "../components/Footer"
import AppSelect from "../components/common/AppSelect"
import AppDatePicker from "../components/common/AppDatePicker"
import { publicApi } from "../services/publicApi"

const hotelCategoryOptions = ["3 Star", "4 Star", "5 Star"]
const interestedInOptions = ["Group Tour", "Private Tour"]

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
  city: "",
  destination: "",
  travelDate: "",
  returnDate: "",
  adults: "1",
  children: "0",
  infants: "0",
  hotelCategory: "",
  interestedIn: "",
  additionalRequirements: "",
  companyWebsite: "",
}

const parseDateInput = (value) => {
  if (!value) return null

  const cleanValue = String(value).trim()

  if (/^\d{4}-\d{2}-\d{2}$/.test(cleanValue)) {
    const date = new Date(`${cleanValue}T00:00:00`)
    return Number.isNaN(date.getTime()) ? null : date
  }

  const match = cleanValue.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/)

  if (!match) return null

  const [, day, month, year] = match
  const date = new Date(Number(year), Number(month) - 1, Number(day))

  return Number.isNaN(date.getTime()) ? null : date
}

const toIsoDate = (value) => {
  const date = parseDateInput(value)
  return date ? date.toISOString() : undefined
}

const getNumber = (value, fallback = 0) => {
  return Math.max(fallback, Number(value) || fallback)
}

const getWhatsappLink = (tour) =>
  `https://wa.me/923111444192?text=${encodeURIComponent(
    `Assalamualaikum TravelEx, I want to inquire about ${tour.title}. Please guide me.`
  )}`

const TourDetails = () => {
  const { id } = useParams()
  const bookingFormRef = useRef(null)

  const tour = tours.find((item) => item.id === id)

  const [formData, setFormData] = useState(initialForm)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const scrollToBookingForm = () => {
    bookingFormRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    })
  }

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    setError("")
    setSubmitted(false)
  }

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    setError("")
    setSubmitted(false)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError("")
    setSubmitted(false)

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

    if (!formData.city.trim()) {
      setError("Please enter your city.")
      return
    }

    if (!formData.destination.trim()) {
      setError("Please enter destination.")
      return
    }

    if (!formData.travelDate) {
      setError("Please select travel date.")
      return
    }

    if (!formData.returnDate) {
      setError("Please select return date.")
      return
    }

    if (!formData.hotelCategory) {
      setError("Please select hotel category.")
      return
    }

    if (!formData.interestedIn) {
      setError("Please select whether you are interested in group or private tour.")
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
        `Tour package inquiry for: ${tour.title}`,
        `Tour Location: ${tour.location || tour.title}`,
        `Tour Price: ${tour.price || "Custom Quote"}`,
        `Tour Duration: ${tour.duration || "Flexible"}`,
        `Tour Type: ${tour.type || "Custom Tour"}`,
        "",
        `City: ${formData.city}`,
        `Destination: ${formData.destination}`,
        `Travel Date: ${formData.travelDate}`,
        `Return Date: ${formData.returnDate}`,
        `Adults: ${travelers.adults}`,
        `Children: ${travelers.children}`,
        `Infants: ${travelers.infants}`,
        `Hotel Category: ${formData.hotelCategory}`,
        `Interested In: ${formData.interestedIn}`,
        "",
        formData.additionalRequirements
          ? `Additional Requirements: ${formData.additionalRequirements}`
          : "Additional Requirements: Not provided",
      ].join("\n")

      const payload = {
        name: formData.fullName.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),

        serviceType: "tour",
        source: "tour-page",
        pageUrl: window.location.href,

        city: formData.city.trim(),
        destination: formData.destination.trim(),

        travelDate: toIsoDate(formData.travelDate),
        returnDate: toIsoDate(formData.returnDate),

        travelers,

        hotelCategory: formData.hotelCategory,
        preferredHotel: formData.hotelCategory,
        interestedIn: formData.interestedIn,

        budget: tour.price || "",

        additionalRequirements: formData.additionalRequirements.trim(),
        message,
        priority: "high",
        companyWebsite: formData.companyWebsite,
      }

      await publicApi.createLead(payload)

      setSubmitted(true)
      setFormData(initialForm)

      bookingFormRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    } catch (err) {
      console.error("Tour inquiry error:", err)
      setError(
        err.message ||
          "We could not submit your tour inquiry right now. Please try again."
      )
    } finally {
      setLoading(false)
    }
  }

  if (!tour) {
    return (
      <main className="bg-[#F8FAFC]">
        <section className="bg-[#F8FAFC] px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-[1180px]">
            <div className="rounded-[5px] border border-slate-100 bg-white p-5 text-center shadow-[0_10px_30px_rgba(15,23,42,0.06)] sm:p-8">
              <h1 className="font-fredoka text-[24px] font-semibold text-slate-950 sm:text-[34px]">
                Tour not found
              </h1>

              <p className="mx-auto mt-2 max-w-2xl font-poppins text-[11.5px] font-medium leading-5 text-slate-600 sm:mt-3 sm:text-sm sm:leading-7">
                The tour you are looking for does not exist or may have been
                moved.
              </p>

              <Link
                to="/tours"
                className="mt-5 inline-flex items-center justify-center gap-2 rounded-[5px] bg-[#FF6B00] px-5 py-2.5 font-poppins text-xs font-semibold text-white transition hover:bg-[#00AEEF] sm:mt-6 sm:px-6 sm:py-3 sm:text-sm"
              >
                <FaArrowLeft className="text-[10px] sm:text-xs" />
                Back to Tours
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    )
  }

  const tourPoints = tour.points || []
  const tourInclusions = tour.inclusions || []
  const compactDetails = [...tourPoints, ...tourInclusions].slice(0, 7)

  const quickFacts = [
    {
      label: "Duration",
      value: tour.duration || "Flexible",
      icon: FaRegClock,
    },
    {
      label: "Location",
      value: tour.location || "International",
      icon: FaMapMarkerAlt,
    },
    {
      label: "Tour Type",
      value: tour.type || "Custom Tour",
      icon: FaRoute,
    },
  ]

  return (
    <main className="bg-[#F8FAFC]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-950">
        <img
          src={tour.image}
          alt={tour.title}
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/65 via-slate-950/45 to-slate-950/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/45 via-transparent to-transparent" />

        <div className="relative z-10 mx-auto max-w-[1340px] px-4 py-7 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
          <div className="max-w-5xl">
            <Link
              to="/tours"
              className="mb-2 inline-flex items-center gap-1.5 font-poppins text-[9px] font-semibold text-white/75 transition hover:text-[#00AEEF] sm:mb-6 sm:gap-2 sm:text-sm"
            >
              <FaArrowLeft className="text-[8px] sm:text-xs" />
              Back to tours
            </Link>

            <div className="mb-2 flex flex-wrap items-center gap-1.5 sm:mb-4 sm:gap-3">
              <span className="inline-flex h-[27px] items-center rounded-[5px] border border-white/15 bg-white/10 px-2.5 font-poppins text-[7.5px] font-bold uppercase tracking-[0.14em] text-[#00AEEF] backdrop-blur sm:h-auto sm:px-4 sm:py-2 sm:text-[11px] sm:tracking-[0.16em]">
                {tour.type || "Tour Plan"}
              </span>

              <span className="inline-flex h-[27px] items-center gap-1.5 rounded-[5px] border border-white/15 bg-white/10 px-2.5 font-poppins text-[8.5px] font-semibold text-white/85 backdrop-blur sm:h-auto sm:gap-2 sm:px-4 sm:py-2 sm:text-xs">
                <FaMapMarkerAlt className="text-[#FF6B00]" />
                {tour.location}
              </span>

              <span className="inline-flex h-[27px] items-center gap-1.5 rounded-[5px] border border-white/15 bg-white/10 px-2.5 font-poppins text-[8.5px] font-semibold text-white/85 backdrop-blur sm:h-auto sm:gap-2 sm:px-4 sm:py-2 sm:text-xs">
                <FaRegClock className="text-[#FF6B00]" />
                {tour.duration || "Flexible"}
              </span>
            </div>

            <h1 className="font-fredoka text-[18px] font-semibold leading-[1.08] text-white sm:text-[46px] sm:uppercase sm:leading-[1.1] lg:text-[54px]">
              {tour.title}
            </h1>

            <p className="mt-1 max-w-3xl font-poppins text-[9px] font-medium leading-4 text-white/85 sm:mt-4 sm:text-base sm:leading-7">
              <span className="sm:hidden">Custom tour support.</span>

              <span className="hidden sm:inline">{tour.overview}</span>
            </p>

            <div className="mt-3 flex flex-col gap-2 sm:mt-6 sm:flex-row sm:gap-3">
              <button
                type="button"
                onClick={scrollToBookingForm}
                className="inline-flex items-center justify-center gap-2 rounded-[5px] bg-[#FF6B00] px-5 py-2.5 font-poppins text-xs font-semibold text-white transition hover:bg-[#00AEEF] sm:px-6 sm:py-3 sm:text-sm"
              >
                Submit Inquiry
                <FaArrowRight className="text-[10px] sm:text-xs" />
              </button>

              <a
                href={getWhatsappLink(tour)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-[5px] bg-[#25D366] px-5 py-2.5 font-poppins text-xs font-semibold text-white transition hover:bg-[#00AEEF] sm:px-6 sm:py-3 sm:text-sm"
              >
                <FaWhatsapp />
                Ask on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Merged Booking + Details */}
      <section className="bg-[#F8FAFC] py-8 sm:py-14">
        <div className="mx-auto grid max-w-[1440px] gap-5 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-6 lg:px-8">
          {/* Booking Form Left */}
          <div
            ref={bookingFormRef}
            className="rounded-[5px] border border-slate-100 bg-white p-4 shadow-[0_16px_45px_rgba(15,23,42,0.08)] sm:p-7"
          >
            <div className="mb-4 sm:mb-6">
              <p className="mb-1.5 font-poppins text-[8.5px] font-bold uppercase tracking-[0.08em] text-[#00AEEF] sm:mb-2 sm:text-[12px] sm:tracking-[0.1em]">
                Tour Package Inquiry Form
              </p>

              <h2 className="font-fredoka text-[22px] font-semibold leading-tight text-slate-950 sm:text-[36px]">
                Submit tour inquiry
              </h2>

              <p className="mt-1.5 font-poppins text-[10.5px] font-medium leading-5 text-slate-600 sm:mt-2 sm:text-sm sm:leading-7">
                Fill the required details. TravelEx will confirm availability,
                hotel options, transport, and final quote.
              </p>
            </div>

            {submitted && (
              <div className="mb-5 rounded-[5px] border border-green-100 bg-green-50 p-5 sm:p-6">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[5px] bg-green-600 text-white">
                    <FaCheckCircle className="text-lg" />
                  </div>

                  <div>
                    <h3 className="font-fredoka text-[24px] font-semibold leading-tight text-green-700">
                      Tour inquiry submitted
                    </h3>

                    <p className="mt-1 font-poppins text-[11.5px] font-medium leading-5 text-green-700 sm:text-sm sm:leading-7">
                      Your inquiry has been submitted successfully. TravelEx
                      team will contact you shortly.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="grid gap-4">
              <input
                type="text"
                name="companyWebsite"
                value={formData.companyWebsite}
                onChange={handleChange}
                className="hidden"
                tabIndex="-1"
                autoComplete="off"
              />

              {error && (
                <p className="rounded-[5px] bg-red-50 px-4 py-3 font-poppins text-[11.5px] font-semibold leading-5 text-red-600 sm:text-sm">
                  {error}
                </p>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Selected Tour</label>

                  <input
                    type="text"
                    value={tour.title}
                    readOnly
                    className={`${inputClass} cursor-not-allowed bg-slate-50 text-slate-500`}
                  />
                </div>

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
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
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

                <div>
                  <label className={labelClass}>City *</label>

                  <div className="relative">
                    <FaMapMarkerAlt className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 sm:left-4 sm:text-sm" />

                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Your city"
                      className={iconInputClass}
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className={labelClass}>Destination *</label>

                  <input
                    type="text"
                    name="destination"
                    value={formData.destination}
                    onChange={handleChange}
                    placeholder="Dubai, Turkey, Baku..."
                    className={inputClass}
                  />
                </div>

                <AppDatePicker
                  label="Travel Date *"
                  value={formData.travelDate}
                  onChange={(value) => handleSelectChange("travelDate", value)}
                  placeholder="Select travel date"
                />

                <AppDatePicker
                  label="Return Date *"
                  value={formData.returnDate}
                  onChange={(value) => handleSelectChange("returnDate", value)}
                  placeholder="Select return date"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className={labelClass}>Number of Adults *</label>

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
                  <label className={labelClass}>Number of Children</label>

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
                  <label className={labelClass}>Number of Infants</label>

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

              <div className="grid gap-4 sm:grid-cols-2">
                <AppSelect
                  label="Hotel Category *"
                  value={formData.hotelCategory}
                  onChange={(value) =>
                    handleSelectChange("hotelCategory", value)
                  }
                  placeholder="Select hotel category"
                  options={hotelCategoryOptions}
                />

                <AppSelect
                  label="Interested In *"
                  value={formData.interestedIn}
                  onChange={(value) =>
                    handleSelectChange("interestedIn", value)
                  }
                  placeholder="Select tour type"
                  options={interestedInOptions}
                />
              </div>

              <div>
                <label className={labelClass}>Additional Requirements</label>

                <textarea
                  rows="4"
                  name="additionalRequirements"
                  value={formData.additionalRequirements}
                  onChange={handleChange}
                  placeholder="Write any special request, hotel preference, transfers, activities, or family requirement..."
                  className="min-h-[120px] w-full resize-none rounded-[5px] border border-slate-200 bg-white px-3 py-3 font-poppins text-xs font-semibold leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#00AEEF] focus:ring-2 focus:ring-[#00AEEF]/10 sm:min-h-[135px] sm:px-4 sm:text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-[5px] bg-[#FF6B00] px-6 py-3.5 font-poppins text-sm font-semibold text-white transition hover:bg-[#00AEEF] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Submitting..." : "Submit Tour Inquiry"}
                {!loading && <FaArrowRight className="text-xs" />}
              </button>
            </form>
          </div>

          {/* Necessary Details Right */}
          <aside className="grid h-fit gap-5 lg:sticky lg:top-24">
            <div className="overflow-hidden rounded-[5px] border border-slate-100 bg-white shadow-[0_16px_45px_rgba(15,23,42,0.08)]">
              <div className="relative h-44 overflow-hidden sm:h-56">
                <img
                  src={tour.image}
                  alt={tour.title}
                  className="h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />

                <div className="absolute bottom-4 left-4 right-4">
                  <p className="font-poppins text-[9px] font-bold uppercase tracking-[0.12em] text-white/70">
                    Selected Tour
                  </p>

                  <h3 className="mt-1 font-fredoka text-[26px] font-semibold leading-tight text-white">
                    {tour.title}
                  </h3>

                  <p className="mt-1 font-poppins text-xs font-semibold text-white/80">
                    {tour.location || "International"} •{" "}
                    {tour.duration || "Flexible"}
                  </p>
                </div>
              </div>

              <div className="p-4 sm:p-5">
                <p className="font-poppins text-[9px] font-bold uppercase tracking-[0.12em] text-[#00AEEF]">
                  Starting Price
                </p>

                <p className="mt-1 font-fredoka text-[30px] font-semibold leading-tight text-[#FF6B00]">
                  {tour.price}
                </p>

                <p className="mt-2 font-poppins text-sm font-medium leading-7 text-slate-600">
                  Final quote depends on travel date, hotel category, number of
                  travelers, airline, and availability.
                </p>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  {quickFacts.map((item) => {
                    const Icon = item.icon

                    return (
                      <div
                        key={item.label}
                        className="rounded-[5px] bg-[#F8FAFC] p-3"
                      >
                        <Icon className="text-sm text-[#00AEEF]" />

                        <p className="mt-2 font-poppins text-[9px] font-bold uppercase tracking-[0.08em] text-slate-400">
                          {item.label}
                        </p>

                        <p className="mt-1 line-clamp-2 font-poppins text-xs font-bold leading-5 text-slate-950">
                          {item.value}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="rounded-[5px] border border-slate-100 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.06)] sm:p-5">
              <p className="font-poppins text-[9px] font-bold uppercase tracking-[0.12em] text-[#00AEEF]">
                Tour Overview
              </p>

              <h2 className="mt-1 font-fredoka text-[28px] font-semibold leading-tight text-slate-950">
                Custom tour support
              </h2>

              <p className="mt-2 font-poppins text-sm font-medium leading-7 text-slate-600">
                {tour.overview}
              </p>
            </div>

            {compactDetails.length > 0 && (
              <div className="rounded-[5px] border border-slate-100 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.06)] sm:p-5">
                <p className="font-poppins text-[9px] font-bold uppercase tracking-[0.12em] text-[#FF6B00]">
                  Key Details
                </p>

                <div className="mt-4 grid gap-2">
                  {compactDetails.map((item) => (
                    <p
                      key={item}
                      className="flex items-start gap-2 rounded-[5px] bg-[#F8FAFC] px-3.5 py-2.5 font-poppins text-sm font-semibold leading-6 text-slate-700"
                    >
                      <FaCheckCircle className="mt-1 shrink-0 text-[#00AEEF]" />
                      {item}
                    </p>
                  ))}
                </div>
              </div>
            )}

            <div className="rounded-[5px] border border-[#FF6B00]/15 bg-orange-50 p-4 sm:p-5">
              <div className="flex gap-3">
                <FaInfoCircle className="mt-1 shrink-0 text-[#FF6B00]" />

                <div>
                  <h3 className="font-fredoka text-[22px] font-semibold leading-tight text-slate-950">
                    Important quote note
                  </h3>

                  <p className="mt-2 font-poppins text-sm font-semibold leading-7 text-orange-800">
                    {tour.note ||
                      "Final inclusions and price may vary based on destination, hotel category, travel dates, airline, number of travelers, and selected package."}
                  </p>
                </div>
              </div>
            </div>

            <a
              href={getWhatsappLink(tour)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-[5px] bg-[#25D366] px-5 py-3 font-poppins text-sm font-semibold text-white transition hover:bg-[#00AEEF]"
            >
              <FaWhatsapp />
              WhatsApp Inquiry
            </a>
          </aside>
        </div>
      </section>

      <Footer />
    </main>
  )
}

export default TourDetails