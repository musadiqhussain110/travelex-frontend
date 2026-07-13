import { useRef, useState } from "react"
import { Link, useParams } from "react-router-dom"
import {
  FaArrowLeft,
  FaArrowRight,
  FaCheckCircle,
  FaEnvelope,
  FaGlobeAsia,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaUser,
} from "react-icons/fa"

import { tours } from "../data/tours"
import Footer from "../components/Footer"
import AppSelect from "../components/common/AppSelect"
import AppDatePicker from "../components/common/AppDatePicker"
import { publicApi } from "../services/publicApi"
import { getLeadSource } from "../utils/leadSourceTracker"
import tourFormAsset from "../assets/tours/tour-form.png"

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

const TourDetails = () => {
  const { id } = useParams()
  const bookingFormRef = useRef(null)

  const tour = tours.find((item) => item.id === id)

  const [formData, setFormData] = useState(initialForm)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

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

      const leadSource = getLeadSource()

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
        leadSource,
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

  return (
    <main className="bg-[#F8FAFC]">
      <section className="relative px-4 pb-10 pt-3 sm:px-6 sm:pb-16 sm:pt-5 lg:px-8">
        {/* Back arrow — fixed to the section's top-left corner, outside banner */}
        <Link
          to="/tours"
          aria-label="Back to tours"
          title="Back to tours"
         className="absolute left-4 top-3 z-30 hidden h-9 w-9 items-center justify-center rounded-[5px] border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-[#00AEEF] hover:text-[#00AEEF] sm:left-6 sm:top-5 sm:flex sm:h-10 sm:w-10 lg:left-8"
        >
          <FaArrowLeft className="text-[12px] sm:text-sm" />
        </Link>

        {/* Banner — exactly same width as form */}
        <div className="mx-auto max-w-[920px]">
          <div className="relative mb-3 min-h-[88px] overflow-hidden rounded-[14px] bg-white px-3.5 py-3 shadow-[0_10px_34px_rgba(11,42,74,0.08)] sm:mb-4 sm:min-h-[150px] sm:rounded-[18px] sm:px-8 sm:py-5 lg:min-h-[170px]">
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

              .tour-banner-asset {
                animation:
                  bannerAssetIn 0.9s ease-out both,
                  bannerFloat 4.5s ease-in-out 0.9s infinite;
              }

              @media (prefers-reduced-motion: reduce) {
                [data-tour-stagger],
                .tour-banner-asset {
                  animation: none !important;
                }
              }
            `}</style>

            {/* Soft ambient glow for depth */}
            <div className="pointer-events-none absolute -right-10 -top-16 hidden h-64 w-64 rounded-full bg-[#00AEEF]/10 blur-3xl sm:block" />
            <div className="pointer-events-none absolute -bottom-16 right-24 hidden h-40 w-40 rounded-full bg-[#FF6B00]/10 blur-3xl sm:block" />

            {/* Text block — compact on mobile so it never collides with vector */}
            <div className="absolute inset-y-0 left-0 z-10 flex w-[62%] items-center px-3.5 py-3 sm:w-[72%] sm:px-8 sm:py-6 lg:w-[70%]">
              <div className="w-full">
                <p
                  data-tour-stagger
                  style={{ animation: "bannerFadeUp 0.6s ease-out 0s both" }}
                  className="mb-1 flex items-center gap-1 whitespace-nowrap font-poppins text-[5.5px] font-bold uppercase leading-tight tracking-[0.04em] text-[#00AEEF] sm:mb-3 sm:gap-2 sm:whitespace-normal sm:text-[14px] sm:tracking-[0.22em]"
                >
                  <span className="inline-block h-[1.5px] w-3 shrink-0 bg-[#FF6B00] sm:h-[2px] sm:w-8" />
                  Top Rated Tour Experiences
                </p>

                <h2
                  data-tour-stagger
                  style={{ animation: "bannerFadeUp 0.6s ease-out 0.15s both" }}
                  className="font-fredoka font-semibold uppercase leading-[1.05] text-slate-950"
                >
                  {/* Mobile heading */}
                  <span className="flex flex-nowrap items-center justify-start gap-[3px] whitespace-nowrap text-[14px] tracking-[-0.05em] sm:hidden">
                    <span className="whitespace-nowrap">Tours Made</span>
                    <span
                      className="whitespace-nowrap rounded-[3px] bg-[#FF6B00] px-1.5 py-0.5 leading-none tracking-[-0.04em] text-white shadow-sm"
                      style={{ animation: "bannerStampIn 0.9s ease-out 0.3s both" }}
                    >
                      Easy
                    </span>
                  </span>

                  {/* Desktop heading */}
                  <span className="hidden flex-nowrap items-center justify-start gap-3 whitespace-nowrap tracking-wide sm:flex sm:text-[34px] lg:text-[38px]">
                    <span className="whitespace-nowrap">Explore More,</span>
                    <span
                      className="whitespace-nowrap rounded-[6px] bg-[#FF6B00] px-4 py-1.5 leading-none tracking-wide text-white shadow-sm"
                      style={{ animation: "bannerStampIn 0.9s ease-out 0.3s both" }}
                    >
                      Worry
                    </span>
                    <span className="whitespace-nowrap">Less</span>
                  </span>
                </h2>
              </div>
            </div>

            {/* Illustration — visible on mobile, smaller and pushed right */}
            <img
              src={tourFormAsset}
              alt="Tour travel illustration"
              className="tour-banner-asset pointer-events-none absolute -right-2 top-1/2 z-0 block h-[78px] w-auto -translate-y-1/2 object-contain sm:right-5 sm:h-[170px] lg:right-7 lg:h-[190px]"
            />
          </div>
        </div>

        {/* Form — narrower centered column */}
        <div className="mx-auto max-w-[920px]">
          <div
            ref={bookingFormRef}
            className="rounded-[5px] border border-slate-100 bg-white p-4 shadow-[0_16px_45px_rgba(15,23,42,0.08)] sm:p-8"
          >
            <div className="mb-4 sm:mb-6">
              <div className="mb-1.5 flex items-center gap-2 sm:mb-2 sm:gap-2.5">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#00AEEF]/10 text-xs text-[#00AEEF] sm:h-8 sm:w-8 sm:text-sm">
                  <FaGlobeAsia />
                </span>

                <p className="font-poppins text-[8.5px] font-bold uppercase tracking-[0.08em] text-[#00AEEF] sm:text-[12px] sm:tracking-[0.1em]">
                  Tour Package Inquiry Form
                </p>
              </div>

              <h1 className="font-fredoka text-[22px] font-semibold leading-tight text-slate-950 sm:text-[36px]">
                Submit tour inquiry
              </h1>

              <p className="mt-1.5 font-poppins text-[10.5px] font-medium leading-5 text-slate-600 sm:mt-2 sm:text-sm sm:leading-7">
                Fill the required details for{" "}
                <span className="font-bold text-slate-950">{tour.title}</span>.
                TravelEx will confirm availability, hotel options, transport,
                and final quote.
              </p>
            </div>

            {submitted && (
              <div className="mb-5 rounded-[5px] border border-green-100 bg-green-50 p-5 sm:p-6">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[5px] bg-green-600 text-white">
                    <FaCheckCircle className="text-lg" />
                  </div>

                  <div>
                    <h2 className="font-fredoka text-[24px] font-semibold leading-tight text-green-700">
                      Tour inquiry submitted
                    </h2>

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
                  className={`${inputClass} h-auto resize-none py-3 leading-6`}
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
        </div>
      </section>

      <Footer />
    </main>
  )
}

export default TourDetails