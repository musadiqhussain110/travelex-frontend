import { useState } from "react"
import { Link, useParams } from "react-router-dom"
import {
  FaArrowLeft,
  FaArrowRight,
  FaCalendarAlt,
  FaCheckCircle,
  FaEnvelope,
  FaGlobeAsia,
  FaHotel,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaRoute,
  FaUser,
  FaUsers,
  FaWhatsapp,
} from "react-icons/fa"

import Footer from "../components/Footer"
import AppSelect from "../components/common/AppSelect"
import { tours } from "../data/tours"

const travelerOptions = [
  "1 Traveler",
  "2 Travelers",
  "Family",
  "Group",
  "Corporate / Team",
]

const hotelPreferenceOptions = [
  "Budget Hotel",
  "Standard Hotel",
  "Premium Hotel",
  "Luxury Hotel",
  "Need Suggestions",
]

const budgetRangeOptions = [
  "Budget Friendly",
  "Standard Comfort",
  "Premium Experience",
  "Luxury Travel",
  "Custom Budget",
]

const tripTypeOptions = [
  "Family Trip",
  "Couple Trip",
  "Friends Group",
  "Solo Travel",
  "Corporate Travel",
]

const labelClass =
  "mb-1.5 block font-poppins text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400 sm:mb-2 sm:text-xs"

const inputClass =
  "h-11 w-full rounded-[5px] border border-slate-200 bg-white px-3 font-poppins text-xs font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#00AEEF] sm:h-12 sm:px-4 sm:text-sm"

const iconInputClass =
  "h-11 w-full rounded-[5px] border border-slate-200 bg-white pl-10 pr-3 font-poppins text-xs font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#00AEEF] sm:h-12 sm:pl-11 sm:pr-4 sm:text-sm"

const initialForm = {
  fullName: "",
  phone: "",
  email: "",
  departureCity: "",
  travelDate: "",
  travelers: "",
  hotelPreference: "",
  budgetRange: "",
  tripType: "",
  specialRequirements: "",
}

const getWhatsappLink = (tour) =>
  `https://wa.me/923111444192?text=${encodeURIComponent(
    `Assalamualaikum TravelEx, I want to book/customize ${tour.title}. Please guide me.`
  )}`

const TourBookingPage = () => {
  const { id } = useParams()
  const tour = tours.find((item) => item.id === id)

  const [formData, setFormData] = useState(initialForm)
  const [submitted, setSubmitted] = useState(false)
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

  const handleSubmit = (event) => {
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

    if (!formData.departureCity.trim()) {
      setError("Please enter your departure city.")
      return
    }

    if (!formData.travelDate.trim()) {
      setError("Please enter your preferred travel date.")
      return
    }

    if (!formData.travelers) {
      setError("Please select number of travelers.")
      return
    }

    setSubmitted(true)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  if (!tour) {
    return (
      <main className="bg-[#F8FAFC]">
        <section className="bg-[#F8FAFC] px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-[1180px]">
            <div className="rounded-[12px] border border-slate-100 bg-white p-5 text-center shadow-[0_10px_30px_rgba(15,23,42,0.06)] sm:p-8">
              <h1 className="font-fredoka text-[24px] font-semibold text-slate-950 sm:text-[34px]">
                Tour not found
              </h1>

              <p className="mx-auto mt-2 max-w-2xl font-poppins text-[11.5px] font-medium leading-5 text-slate-600 sm:mt-3 sm:text-sm sm:leading-7">
                The tour you are trying to book does not exist or may have been
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
              to={`/tours/${tour.id}`}
              className="mb-2 inline-flex items-center gap-1.5 font-poppins text-[9px] font-semibold text-white/75 transition hover:text-[#00AEEF] sm:mb-6 sm:gap-2 sm:text-sm"
            >
              <FaArrowLeft className="text-[8px] sm:text-xs" />
              Back to tour details
            </Link>

            <div className="mb-2 flex flex-wrap items-center gap-1.5 sm:mb-4 sm:gap-3">
              <span className="inline-flex h-[27px] items-center rounded-full border border-white/15 bg-white/10 px-2.5 font-poppins text-[7.5px] font-bold uppercase tracking-[0.14em] text-[#00AEEF] backdrop-blur sm:h-auto sm:px-4 sm:py-2 sm:text-[11px] sm:tracking-[0.16em]">
                Tour Request
              </span>

              <span className="inline-flex h-[27px] items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-2.5 font-poppins text-[8.5px] font-semibold text-white/85 backdrop-blur sm:h-auto sm:gap-2 sm:px-4 sm:py-2 sm:text-xs">
                <FaCalendarAlt className="text-[#FF6B00]" />
                {tour.duration || "Flexible"}
              </span>

              <span className="inline-flex h-[27px] items-center rounded-full border border-white/15 bg-white/10 px-2.5 font-poppins text-[8.5px] font-semibold text-white/85 backdrop-blur sm:h-auto sm:px-4 sm:py-2 sm:text-xs">
                {tour.type || "Custom Tour"}
              </span>
            </div>

            <h1 className="font-fredoka text-[18px] font-semibold leading-[1.08] text-white sm:text-[46px] sm:uppercase sm:leading-[1.1] lg:text-[54px]">
              Book {tour.title}
            </h1>

            <p className="mt-1 max-w-3xl font-poppins text-[9px] font-medium leading-4 text-white/85 sm:mt-4 sm:text-base sm:leading-7">
              <span className="sm:hidden">Submit your tour request.</span>

              <span className="hidden sm:inline">
                Fill out your tour request and TravelEx will contact you with
                availability, final price, hotel options, transport support, and
                the next steps.
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
              <p className="mb-1.5 font-poppins text-[8.5px] font-bold uppercase tracking-[0.24em] text-[#00AEEF] sm:mb-2 sm:text-[12px] sm:tracking-[0.18em]">
                Tour Booking Form
              </p>

              <h2 className="font-fredoka text-[20px] font-semibold leading-[1.08] text-slate-950 sm:text-[36px]">
                Traveler details
              </h2>

              <p className="mt-1.5 font-poppins text-[10.5px] font-medium leading-5 text-slate-600 sm:mt-2 sm:text-sm sm:leading-7">
                Submit your request. TravelEx will confirm availability, hotel
                options and final price before booking.
              </p>
            </div>

            {submitted ? (
              <div className="rounded-[8px] border border-green-100 bg-green-50 p-5 sm:p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-600 text-white sm:h-14 sm:w-14">
                  <FaCheckCircle className="text-lg sm:text-xl" />
                </div>

                <h3 className="mt-4 font-fredoka text-[24px] font-semibold leading-tight text-green-700 sm:text-[28px]">
                  Tour request submitted
                </h3>

                <p className="mt-2 font-poppins text-[11.5px] font-medium leading-5 text-green-700 sm:text-sm sm:leading-7">
                  Your tour request has been prepared successfully. Backend
                  connection will later send this request to the admin dashboard.
                </p>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <a
                    href={getWhatsappLink(tour)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-[5px] bg-[#25D366] px-5 py-2.5 font-poppins text-xs font-semibold text-white transition hover:bg-[#00AEEF] sm:px-6 sm:py-3 sm:text-sm"
                  >
                    <FaWhatsapp />
                    Continue on WhatsApp
                  </a>

                  <Link
                    to="/tours"
                    className="inline-flex items-center justify-center rounded-[5px] border border-slate-200 bg-white px-5 py-2.5 font-poppins text-xs font-semibold text-slate-800 transition hover:border-[#00AEEF] hover:text-[#00AEEF] sm:px-6 sm:py-3 sm:text-sm"
                  >
                    View More Tours
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
                    <label className={labelClass}>Selected Tour</label>

                    <input
                      type="text"
                      value={tour.title}
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
                        placeholder="Karachi, Lahore, Islamabad..."
                        className={iconInputClass}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Preferred Travel Date</label>

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
                    label="Hotel Preference"
                    value={formData.hotelPreference}
                    onChange={(value) =>
                      handleSelectChange("hotelPreference", value)
                    }
                    placeholder="Select hotel preference"
                    options={hotelPreferenceOptions}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <AppSelect
                    label="Budget Range"
                    value={formData.budgetRange}
                    onChange={(value) =>
                      handleSelectChange("budgetRange", value)
                    }
                    placeholder="Select budget range"
                    options={budgetRangeOptions}
                  />

                  <AppSelect
                    label="Trip Type"
                    value={formData.tripType}
                    onChange={(value) => handleSelectChange("tripType", value)}
                    placeholder="Select trip type"
                    options={tripTypeOptions}
                  />
                </div>

                <div>
                  <label className={labelClass}>Special Requirements</label>

                  <textarea
                    rows="4"
                    name="specialRequirements"
                    value={formData.specialRequirements}
                    onChange={handleChange}
                    placeholder="Write hotel preference, sightseeing interest, destination changes, budget, or any special note..."
                    className="w-full resize-none rounded-[5px] border border-slate-200 bg-white px-3 py-3 font-poppins text-xs font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#00AEEF] sm:px-4 sm:text-sm"
                  />
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 rounded-[5px] bg-[#FF6B00] px-5 py-2.5 font-poppins text-xs font-semibold text-white transition hover:bg-[#00AEEF] sm:px-6 sm:py-3 sm:text-sm"
                  >
                    Submit Tour Request
                    <FaArrowRight className="text-[10px] sm:text-xs" />
                  </button>

                  <a
                    href={getWhatsappLink(tour)}
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
                  src={tour.image}
                  alt={tour.title}
                  className="h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />

                <div className="absolute bottom-3 left-4 right-4 sm:bottom-4">
                  <p className="font-poppins text-[8.5px] font-bold uppercase tracking-[0.16em] text-white/65 sm:text-[10px]">
                    Selected Tour
                  </p>

                  <h3 className="mt-1 font-fredoka text-[21px] font-semibold leading-tight text-white sm:text-[24px]">
                    {tour.title}
                  </h3>
                </div>
              </div>

              <div className="p-4 sm:p-5">
                <p className="font-poppins text-[8.5px] font-bold uppercase tracking-[0.16em] text-slate-400 sm:text-[10px]">
                  Starting from
                </p>

                <p className="mt-1 font-poppins text-[24px] font-semibold leading-none text-[#FF6B00] sm:text-[28px]">
                  {tour.price}
                </p>

                <div className="mt-4 grid gap-2 sm:mt-5 sm:gap-3">
                  {[
                    tour.duration || "Flexible dates",
                    tour.type || "Custom tour",
                    "Customizable itinerary",
                    "Consultant support",
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
                  <p className="font-poppins text-[9px] font-bold uppercase tracking-[0.16em] text-[#00AEEF] sm:text-[11px]">
                    Important Note
                  </p>

                  <p className="mt-1.5 font-poppins text-[11px] font-medium leading-5 text-slate-600 sm:mt-2 sm:text-sm sm:leading-7">
                    This request does not confirm payment. TravelEx will contact
                    you first to confirm availability, hotel options, itinerary,
                    and final price.
                  </p>
                </div>

                <a
                  href={getWhatsappLink(tour)}
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

export default TourBookingPage