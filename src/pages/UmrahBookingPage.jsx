import { useState } from "react"
import { Link, useParams } from "react-router-dom"
import {
  FaArrowLeft,
  FaArrowRight,
  FaCalendarAlt,
  FaCheckCircle,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaUser,
  FaWhatsapp,
} from "react-icons/fa"

import Footer from "../components/Footer"
import AppSelect from "../components/common/AppSelect"
import { umrahPackages as packages } from "../data/umrahPackagesData"
import { publicApi } from "../services/publicApi"

const travelerOptions = [
  "1 Adult",
  "2 Adults",
  "Family",
  "Group",
  "Custom Group",
]

const roomSharingOptions = [
  "Quad Sharing",
  "Triple Sharing",
  "Double Sharing",
  "Private / Custom",
  "Not Sure",
]

const hotelPreferenceOptions = [
  "Economy Hotel",
  "Standard Hotel",
  "Premium Hotel",
  "Near Haram",
  "Need Suggestions",
]

const labelClass =
  "mb-1.5 block font-poppins text-[9px] font-bold uppercase tracking-[0.08em] text-slate-400 sm:mb-2 sm:text-xs"

const iconInputClass =
  "h-11 w-full rounded-[5px] border border-slate-200 bg-white pl-10 pr-3 font-poppins text-xs font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#00AEEF] sm:h-12 sm:pl-11 sm:pr-4 sm:text-sm"

const initialForm = {
  fullName: "",
  phone: "",
  email: "",
  departureCity: "",
  travelDate: "",
  travelers: "",
  roomSharing: "",
  hotelPreference: "",
  specialRequirements: "",
}

const getWhatsappLink = (pkg) =>
  `https://wa.me/923111444192?text=${encodeURIComponent(
    `Assalamualaikum TravelEx, I want to book ${pkg.title}. Please guide me.`
  )}`

const parseTravelers = (value) => {
  if (value === "1 Adult") {
    return {
      adults: 1,
      children: 0,
      infants: 0,
    }
  }

  if (value === "2 Adults") {
    return {
      adults: 2,
      children: 0,
      infants: 0,
    }
  }

  if (value === "Family") {
    return {
      adults: 2,
      children: 2,
      infants: 0,
    }
  }

  if (value === "Group" || value === "Custom Group") {
    return {
      adults: 4,
      children: 0,
      infants: 0,
    }
  }

  return {
    adults: 1,
    children: 0,
    infants: 0,
  }
}

const UmrahBookingPage = () => {
  const { id } = useParams()
  const pkg = packages.find((item) => item.id === id)

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
  }

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    setError("")
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError("")

    if (!formData.fullName.trim()) {
      setError("Please enter your full name.")
      return
    }

    if (!formData.phone.trim()) {
      setError("Please enter your phone number.")
      return
    }

    if (!formData.email.trim()) {
      setError("Please enter your email address.")
      return
    }

    if (!formData.departureCity.trim()) {
      setError("Please enter your departure city.")
      return
    }

    if (!formData.travelDate.trim()) {
      setError("Please enter your travel month or date.")
      return
    }

    if (!formData.travelers) {
      setError("Please select travelers.")
      return
    }

    if (!formData.roomSharing) {
      setError("Please select room sharing preference.")
      return
    }

    try {
      setLoading(true)

      const travelers = parseTravelers(formData.travelers)

      const message = [
        `Booking request for: ${pkg.title}`,
        `Package Price: ${pkg.price}`,
        `Package Duration: ${pkg.duration || "Flexible"}`,
        `Package Type: ${pkg.type || "Umrah Plan"}`,
        "",
        `Departure City: ${formData.departureCity}`,
        `Travel Month / Date: ${formData.travelDate}`,
        `Travelers: ${formData.travelers}`,
        `Room Sharing: ${formData.roomSharing}`,
        `Hotel Preference: ${
          formData.hotelPreference || "Not selected"
        }`,
        "",
        formData.specialRequirements
          ? `Special Requirements: ${formData.specialRequirements}`
          : "Special Requirements: Not provided",
      ].join("\n")

      const payload = {
        name: formData.fullName.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        serviceType: "umrah",
        source: "umrah-page",
        pageUrl: window.location.href,
        destination: `Umrah from ${formData.departureCity.trim()}`,
        budget: pkg.price || "",
        preferredHotel: formData.hotelPreference || "",
        travelers,
        makkahNights: 0,
        madinahNights: 0,
        message,
        priority: "high",
        companyWebsite: "",
      }

      await publicApi.createLead(payload)

      setSubmitted(true)
      setFormData(initialForm)
      window.scrollTo({ top: 0, behavior: "smooth" })
    } catch (err) {
      console.error("Umrah booking lead error:", err)
      setError(
        err.message ||
          "We could not submit your booking request right now. Please try again."
      )
    } finally {
      setLoading(false)
    }
  }

  if (!pkg) {
    return (
      <main className="bg-[#F8FAFC]">
        <section className="bg-[#F8FAFC] px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-[1180px]">
            <div className="rounded-[12px] border border-slate-100 bg-white p-5 text-center shadow-[0_10px_30px_rgba(15,23,42,0.06)] sm:p-8">
              <h1 className="font-fredoka text-[24px] font-semibold text-slate-950 sm:text-[34px]">
                Package not found
              </h1>

              <p className="mx-auto mt-2 max-w-2xl font-poppins text-[11.5px] font-medium leading-5 text-slate-600 sm:mt-3 sm:text-sm sm:leading-7">
                The Umrah package you are trying to book does not exist or may
                have been moved.
              </p>

              <Link
                to="/umrah"
                className="mt-5 inline-flex items-center justify-center gap-2 rounded-[5px] bg-[#FF6B00] px-5 py-2.5 font-poppins text-xs font-semibold text-white transition hover:bg-[#00AEEF] sm:mt-6 sm:px-6 sm:py-3 sm:text-sm"
              >
                <FaArrowLeft className="text-[10px] sm:text-xs" />
                Back to Umrah
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
      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-950">
        <img
          src={pkg.image}
          alt={pkg.title}
          loading="eager"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/65 via-slate-950/45 to-slate-950/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/45 via-transparent to-transparent" />

        <div className="relative z-10 mx-auto max-w-[1340px] px-4 py-7 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
          <div className="max-w-5xl">
            <Link
              to={`/package/${pkg.id}`}
              className="mb-2 inline-flex items-center gap-1.5 font-poppins text-[9px] font-semibold text-white/75 transition hover:text-[#00AEEF] sm:mb-6 sm:gap-2 sm:text-sm"
            >
              <FaArrowLeft className="text-[8px] sm:text-xs" />
              Back to package details
            </Link>

            <div className="mb-2 flex flex-wrap items-center gap-1.5 sm:mb-4 sm:gap-3">
              <span className="inline-flex h-[27px] items-center rounded-full border border-white/15 bg-white/10 px-2.5 font-poppins text-[7.5px] font-bold uppercase tracking-[0.08em] text-[#00AEEF] backdrop-blur sm:h-auto sm:px-4 sm:py-2 sm:text-[11px] sm:tracking-[0.1em]">
                Booking Request
              </span>

              <span className="inline-flex h-[27px] items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-2.5 font-poppins text-[8.5px] font-semibold text-white/85 backdrop-blur sm:h-auto sm:gap-2 sm:px-4 sm:py-2 sm:text-xs">
                <FaCalendarAlt className="text-[#FF6B00]" />
                {pkg.duration || "Flexible"}
              </span>

              <span className="inline-flex h-[27px] items-center rounded-full border border-white/15 bg-white/10 px-2.5 font-poppins text-[8.5px] font-semibold text-white/85 backdrop-blur sm:h-auto sm:px-4 sm:py-2 sm:text-xs">
                {pkg.type || "Umrah Plan"}
              </span>
            </div>

            <h1 className="font-fredoka text-[18px] font-semibold leading-[1.08] text-white sm:text-[46px] sm:uppercase sm:leading-[1.1] lg:text-[54px]">
              Book {pkg.title}
            </h1>

            <p className="mt-1 max-w-3xl font-poppins text-[9px] font-medium leading-4 text-white/85 sm:mt-4 sm:text-base sm:leading-7">
              <span className="sm:hidden">Submit your Umrah request.</span>

              <span className="hidden sm:inline">
                Fill out your booking request and TravelEx will contact you with
                availability, final package price, and next steps.
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* Booking Content */}
      <section className="bg-[#F8FAFC] py-8 sm:py-14">
        <div className="mx-auto grid max-w-[1440px] gap-5 px-4 sm:px-6 lg:grid-cols-[1fr_380px] lg:gap-6 lg:px-8">
          {/* Form */}
          <div className="rounded-[12px] border border-slate-100 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.06)] sm:p-7">
            <div className="mb-4 sm:mb-6">
              <p className="mb-1.5 font-poppins text-[8.5px] font-bold uppercase tracking-[0.08em] text-[#00AEEF] sm:mb-2 sm:text-[12px] sm:tracking-[0.1em]">
                Booking Form
              </p>

              <h2 className="font-fredoka text-[20px] font-semibold leading-[1.08] text-slate-950 sm:text-[36px]">
                Traveler details
              </h2>

              <p className="mt-1.5 font-poppins text-[10.5px] font-medium leading-5 text-slate-600 sm:mt-2 sm:text-sm sm:leading-7">
                Submit your request. TravelEx will confirm package
                availability, hotel options and final price before booking.
              </p>
            </div>

            {submitted ? (
              <div className="rounded-[8px] border border-green-100 bg-green-50 p-5 sm:p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-600 text-white sm:h-14 sm:w-14">
                  <FaCheckCircle className="text-lg sm:text-xl" />
                </div>

                <h3 className="mt-4 font-fredoka text-[24px] font-semibold leading-tight text-green-700 sm:text-[28px]">
                  Booking request submitted
                </h3>

                <p className="mt-2 font-poppins text-[11.5px] font-medium leading-5 text-green-700 sm:text-sm sm:leading-7">
                  Your booking request has been submitted successfully. TravelEx
                  admin team can now view it in the CRM dashboard.
                </p>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <a
                    href={getWhatsappLink(pkg)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-[5px] bg-[#25D366] px-5 py-2.5 font-poppins text-xs font-semibold text-white transition hover:bg-[#00AEEF] sm:px-6 sm:py-3 sm:text-sm"
                  >
                    <FaWhatsapp />
                    Continue on WhatsApp
                  </a>

                  <Link
                    to="/umrah"
                    className="inline-flex items-center justify-center rounded-[5px] border border-slate-200 bg-white px-5 py-2.5 font-poppins text-xs font-semibold text-slate-800 transition hover:border-[#00AEEF] hover:text-[#00AEEF] sm:px-6 sm:py-3 sm:text-sm"
                  >
                    View More Packages
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="grid gap-4">
                {error && (
                  <p className="rounded-[5px] bg-red-50 px-4 py-3 font-poppins text-[11.5px] font-semibold leading-5 text-red-600 sm:text-sm">
                    {error}
                  </p>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>Selected Package</label>

                    <input
                      type="text"
                      value={pkg.title}
                      readOnly
                      className="h-11 w-full rounded-[5px] border border-slate-200 bg-slate-50 px-3 font-poppins text-xs font-semibold text-slate-700 outline-none sm:h-12 sm:px-4 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Full Name</label>

                    <div className="relative">
                      <FaUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 sm:left-4 sm:text-sm" />

                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        className={iconInputClass}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>Phone Number</label>

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
                    <label className={labelClass}>Email Address</label>

                    <div className="relative">
                      <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 sm:left-4 sm:text-sm" />

                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        className={iconInputClass}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>Departure City</label>

                    <div className="relative">
                      <FaMapMarkerAlt className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 sm:left-4 sm:text-sm" />

                      <input
                        type="text"
                        name="departureCity"
                        value={formData.departureCity}
                        onChange={handleChange}
                        placeholder="Peshawar, Lahore, Karachi..."
                        className={iconInputClass}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Travel Month / Date</label>

                    <div className="relative">
                      <FaCalendarAlt className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 sm:left-4 sm:text-sm" />

                      <input
                        type="text"
                        name="travelDate"
                        value={formData.travelDate}
                        onChange={handleChange}
                        placeholder="Example: March 2026"
                        className={iconInputClass}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <AppSelect
                    label="Travelers"
                    value={formData.travelers}
                    onChange={(value) =>
                      handleSelectChange("travelers", value)
                    }
                    placeholder="Select travelers"
                    options={travelerOptions}
                  />

                  <AppSelect
                    label="Room Sharing"
                    value={formData.roomSharing}
                    onChange={(value) =>
                      handleSelectChange("roomSharing", value)
                    }
                    placeholder="Select room sharing"
                    options={roomSharingOptions}
                  />
                </div>

                <AppSelect
                  label="Hotel Preference"
                  value={formData.hotelPreference}
                  onChange={(value) =>
                    handleSelectChange("hotelPreference", value)
                  }
                  placeholder="Select hotel preference"
                  options={hotelPreferenceOptions}
                />

                <div>
                  <label className={labelClass}>Special Requirements</label>

                  <textarea
                    rows="4"
                    name="specialRequirements"
                    value={formData.specialRequirements}
                    onChange={handleChange}
                    placeholder="Write hotel preference, budget, family requirements, room sharing, or any special note..."
                    className="w-full resize-none rounded-[5px] border border-slate-200 bg-white px-3 py-3 font-poppins text-xs font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#00AEEF] sm:px-4 sm:text-sm"
                  />
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-2 rounded-[5px] bg-[#FF6B00] px-5 py-2.5 font-poppins text-xs font-semibold text-white transition hover:bg-[#00AEEF] disabled:cursor-not-allowed disabled:opacity-70 sm:px-6 sm:py-3 sm:text-sm"
                  >
                    {loading ? "Submitting..." : "Submit Booking Request"}
                    {!loading && <FaArrowRight className="text-[10px] sm:text-xs" />}
                  </button>

                  <a
                    href={getWhatsappLink(pkg)}
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

          {/* Summary Sidebar */}
          <aside className="h-fit lg:sticky lg:top-24 lg:self-start">
            <div className="overflow-hidden rounded-[12px] border border-slate-100 bg-white shadow-[0_16px_45px_rgba(15,23,42,0.08)]">
              <div className="relative h-36 overflow-hidden sm:h-44">
                <img
                  src={pkg.image}
                  alt={pkg.title}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />

                <div className="absolute bottom-3 left-4 right-4 sm:bottom-4">
                  <p className="font-poppins text-[8.5px] font-bold uppercase tracking-[0.08em] text-white/65 sm:text-[10px] sm:tracking-[0.1em]">
                    Booking Package
                  </p>

                  <h3 className="mt-1 font-fredoka text-[21px] font-semibold leading-tight text-white sm:text-[24px]">
                    {pkg.title}
                  </h3>
                </div>
              </div>

              <div className="p-4 sm:p-5">
                <p className="font-poppins text-[8.5px] font-bold uppercase tracking-[0.08em] text-slate-400 sm:text-[10px] sm:tracking-[0.1em]">
                  Starting from
                </p>

                <p className="mt-1 font-poppins text-[24px] font-semibold leading-none text-[#FF6B00] sm:text-[28px]">
                  {pkg.price}
                </p>

                <div className="mt-4 grid gap-2 sm:mt-5 sm:gap-3">
                  {[
                    pkg.duration || "Flexible duration",
                    pkg.type || "Umrah Plan",
                    "Consultant support",
                    "Final quote confirmation",
                  ].map((item) => (
                    <p
                      key={item}
                      className="flex items-center gap-2 font-poppins text-[11.5px] font-semibold text-slate-700 sm:text-sm"
                    >
                      <FaCheckCircle className="shrink-0 text-[#00AEEF]" />
                      {item}
                    </p>
                  ))}
                </div>

                <div className="mt-4 rounded-[5px] bg-[#F8FAFC] p-3.5 sm:mt-5 sm:p-4">
                  <p className="font-poppins text-[9px] font-bold uppercase tracking-[0.08em] text-[#00AEEF] sm:text-[11px] sm:tracking-[0.1em]">
                    Important Note
                  </p>

                  <p className="mt-1.5 font-poppins text-[11px] font-medium leading-5 text-slate-600 sm:mt-2 sm:text-sm sm:leading-7">
                    This request does not confirm payment. TravelEx will contact
                    you first to confirm availability and final package price.
                  </p>
                </div>

                <a
                  href={getWhatsappLink(pkg)}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-[5px] bg-[#25D366] px-5 py-2.5 font-poppins text-xs font-semibold text-white transition hover:bg-[#00AEEF] sm:mt-5 sm:px-6 sm:py-3 sm:text-sm"
                >
                  <FaWhatsapp />
                  Ask on WhatsApp
                </a>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <Footer />
    </main>
  )
}

export default UmrahBookingPage