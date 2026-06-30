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
import AppDatePicker from "../components/common/AppDatePicker"
import { umrahPackages as packages } from "../data/umrahPackagesData"
import { publicApi } from "../services/publicApi"

const packageOptions = ["Economy", "Executive"]
const hotelPreferenceOptions = ["3 Star", "4 Star", "5 Star"]
const yesNoOptions = ["Yes", "No"]

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
  adults: "1",
  children: "0",
  infants: "0",
  departureCity: "",
  departureDate: "",
  durationOfStay: "",
  packageRequired: "",
  hotelPreference: "",
  visaRequired: "",
  additionalRequirements: "",
  companyWebsite: "",
}

const toIsoDate = (value) => {
  if (!value) return undefined
  return new Date(`${value}T00:00:00`).toISOString()
}

const getNumber = (value, fallback = 0) => Math.max(fallback, Number(value) || fallback)

const getWhatsappLink = (pkg) =>
  `https://wa.me/923111444192?text=${encodeURIComponent(
    `Assalamualaikum TravelEx, I want to inquire about ${pkg.title}. Please guide me.`
  )}`

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

    if (!formData.departureCity.trim()) {
      setError("Please enter your preferred departure city.")
      return
    }

    if (!formData.departureDate) {
      setError("Please select your preferred departure date.")
      return
    }

    if (!formData.durationOfStay.trim()) {
      setError("Please enter your duration of stay.")
      return
    }

    if (!formData.packageRequired) {
      setError("Please select package required.")
      return
    }

    if (!formData.hotelPreference) {
      setError("Please select hotel preference.")
      return
    }

    if (!formData.visaRequired) {
      setError("Please select whether visa is required.")
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
        `Umrah inquiry for: ${pkg.title}`,
        `Package Price: ${pkg.price || "Not provided"}`,
        `Package Duration: ${pkg.duration || "Flexible"}`,
        `Package Type: ${pkg.type || "Umrah Plan"}`,
        "",
        `City: ${formData.city}`,
        `Adults: ${travelers.adults}`,
        `Children: ${travelers.children}`,
        `Infants: ${travelers.infants}`,
        `Preferred Departure City: ${formData.departureCity}`,
        `Preferred Departure Date: ${formData.departureDate}`,
        `Duration of Stay: ${formData.durationOfStay}`,
        `Package Required: ${formData.packageRequired}`,
        `Hotel Preference: ${formData.hotelPreference}`,
        `Visa Required: ${formData.visaRequired}`,
        "",
        formData.additionalRequirements
          ? `Additional Requirements: ${formData.additionalRequirements}`
          : "Additional Requirements: Not provided",
      ].join("\n")

      const payload = {
        name: formData.fullName.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        serviceType: "umrah",
        source: "umrah-page",
        pageUrl: window.location.href,
        city: formData.city.trim(),
        departureCity: formData.departureCity.trim(),
        destination: "Umrah",
        travelDate: toIsoDate(formData.departureDate),
        durationOfStay: formData.durationOfStay.trim(),
        packageRequired: formData.packageRequired,
        hotelCategory: formData.hotelPreference,
        preferredHotel: formData.hotelPreference,
        visaRequired: formData.visaRequired,
        travelers,
        budget: pkg.price || "",
        additionalRequirements: formData.additionalRequirements.trim(),
        message,
        priority: "high",
        companyWebsite: formData.companyWebsite,
      }

      await publicApi.createLead(payload)

      setSubmitted(true)
      setFormData(initialForm)
      window.scrollTo({ top: 0, behavior: "smooth" })
    } catch (err) {
      console.error("Umrah inquiry error:", err)
      setError(
        err.message ||
          "We could not submit your Umrah inquiry right now. Please try again."
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
            <div className="rounded-[5px] border border-slate-100 bg-white p-5 text-center shadow-[0_10px_30px_rgba(15,23,42,0.06)] sm:p-8">
              <h1 className="font-fredoka text-[24px] font-semibold text-slate-950 sm:text-[34px]">
                Package not found
              </h1>

              <p className="mx-auto mt-2 max-w-2xl font-poppins text-[11.5px] font-medium leading-5 text-slate-600 sm:mt-3 sm:text-sm sm:leading-7">
                The Umrah package you are trying to inquire about does not exist
                or may have been moved.
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
      <section className="relative overflow-hidden bg-slate-950">
        <img
          src={pkg.image}
          alt={pkg.title}
          loading="eager"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/70 via-slate-950/45 to-slate-950/20" />
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
              <span className="inline-flex h-[27px] items-center rounded-[5px] border border-white/15 bg-white/10 px-2.5 font-poppins text-[7.5px] font-bold uppercase tracking-[0.08em] text-[#00AEEF] backdrop-blur sm:h-auto sm:px-4 sm:py-2 sm:text-[11px] sm:tracking-[0.1em]">
                Umrah Inquiry
              </span>

              <span className="inline-flex h-[27px] items-center gap-1.5 rounded-[5px] border border-white/15 bg-white/10 px-2.5 font-poppins text-[8.5px] font-semibold text-white/85 backdrop-blur sm:h-auto sm:gap-2 sm:px-4 sm:py-2 sm:text-xs">
                <FaCalendarAlt className="text-[#FF6B00]" />
                {pkg.duration || "Flexible"}
              </span>
            </div>

            <h1 className="font-fredoka text-[18px] font-semibold leading-[1.08] text-white sm:text-[46px] sm:uppercase sm:leading-[1.1] lg:text-[54px]">
              Umrah Inquiry for {pkg.title}
            </h1>

            <p className="mt-1 max-w-3xl font-poppins text-[9px] font-medium leading-4 text-white/85 sm:mt-4 sm:text-base sm:leading-7">
              Submit your real Umrah inquiry details. TravelEx will contact you
              with package availability, hotel options, visa guidance and final
              quote.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#F8FAFC] py-8 sm:py-14">
        <div className="mx-auto grid max-w-[1440px] gap-5 px-4 sm:px-6 lg:grid-cols-[1fr_380px] lg:gap-6 lg:px-8">
          <div className="rounded-[5px] border border-slate-100 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.06)] sm:p-7">
            <div className="mb-4 sm:mb-6">
              <p className="mb-1.5 font-poppins text-[8.5px] font-bold uppercase tracking-[0.08em] text-[#00AEEF] sm:mb-2 sm:text-[12px] sm:tracking-[0.1em]">
                Umrah Inquiry Form
              </p>

              <h2 className="font-fredoka text-[20px] font-semibold leading-[1.08] text-slate-950 sm:text-[36px]">
                Traveler details
              </h2>

              <p className="mt-1.5 font-poppins text-[10.5px] font-medium leading-5 text-slate-600 sm:mt-2 sm:text-sm sm:leading-7">
                Fill the required details exactly as requested by TravelEx.
              </p>
            </div>

            {submitted ? (
              <div className="rounded-[5px] border border-green-100 bg-green-50 p-5 sm:p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-[5px] bg-green-600 text-white sm:h-14 sm:w-14">
                  <FaCheckCircle className="text-lg sm:text-xl" />
                </div>

                <h3 className="mt-4 font-fredoka text-[24px] font-semibold leading-tight text-green-700 sm:text-[28px]">
                  Umrah inquiry submitted
                </h3>

                <p className="mt-2 font-poppins text-[11.5px] font-medium leading-5 text-green-700 sm:text-sm sm:leading-7">
                  Your inquiry has been submitted successfully. TravelEx admin
                  team can now view it in the CRM dashboard.
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
                    <label className={labelClass}>Selected Package</label>
                    <input type="text" value={pkg.title} readOnly className={inputClass} />
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
                    <label className={labelClass}>Number of Adults *</label>
                    <input type="number" name="adults" min="1" value={formData.adults} onChange={handleChange} className={inputClass} />
                  </div>

                  <div>
                    <label className={labelClass}>Number of Children</label>
                    <input type="number" name="children" min="0" value={formData.children} onChange={handleChange} className={inputClass} />
                  </div>

                  <div>
                    <label className={labelClass}>Number of Infants</label>
                    <input type="number" name="infants" min="0" value={formData.infants} onChange={handleChange} className={inputClass} />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className={labelClass}>Preferred Departure City *</label>
                    <input
                      type="text"
                      name="departureCity"
                      value={formData.departureCity}
                      onChange={handleChange}
                      placeholder="Karachi, Lahore, Islamabad..."
                      className={inputClass}
                    />
                  </div>

                  <AppDatePicker
                    label="Preferred Departure Date *"
                    value={formData.departureDate}
                    onChange={(value) => handleSelectChange("departureDate", value)}
                    placeholder="Select departure date"
                  />

                  <div>
                    <label className={labelClass}>Duration of Stay *</label>
                    <input
                      type="text"
                      name="durationOfStay"
                      value={formData.durationOfStay}
                      onChange={handleChange}
                      placeholder="Example: 14 days"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <AppSelect
                    label="Package Required *"
                    value={formData.packageRequired}
                    onChange={(value) => handleSelectChange("packageRequired", value)}
                    placeholder="Select package"
                    options={packageOptions}
                  />

                  <AppSelect
                    label="Hotel Preference *"
                    value={formData.hotelPreference}
                    onChange={(value) => handleSelectChange("hotelPreference", value)}
                    placeholder="Select hotel"
                    options={hotelPreferenceOptions}
                  />

                  <AppSelect
                    label="Visa Required? *"
                    value={formData.visaRequired}
                    onChange={(value) => handleSelectChange("visaRequired", value)}
                    placeholder="Select option"
                    options={yesNoOptions}
                  />
                </div>

                <div>
                  <label className={labelClass}>Additional Requirements</label>
                  <textarea
                    rows="4"
                    name="additionalRequirements"
                    value={formData.additionalRequirements}
                    onChange={handleChange}
                    placeholder="Write any special request, hotel preference, transport need, or family requirement..."
                    className={`${inputClass} h-auto resize-none py-3 leading-6`}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 rounded-[5px] bg-[#FF6B00] px-6 py-3.5 font-poppins text-sm font-semibold text-white transition hover:bg-[#00AEEF] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? "Submitting..." : "Submit Umrah Inquiry"}
                  {!loading && <FaArrowRight className="text-xs" />}
                </button>
              </form>
            )}
          </div>

          <aside className="h-fit rounded-[5px] border border-slate-100 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
            <h3 className="font-fredoka text-[24px] font-semibold text-slate-950">
              Need quick guidance?
            </h3>
            <p className="mt-2 font-poppins text-sm font-medium leading-7 text-slate-600">
              Submit the form or continue on WhatsApp. TravelEx will confirm
              package details before booking.
            </p>
            <a
              href={getWhatsappLink(pkg)}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-[5px] bg-[#25D366] px-5 py-3 font-poppins text-sm font-semibold text-white transition hover:bg-[#00AEEF]"
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

export default UmrahBookingPage
