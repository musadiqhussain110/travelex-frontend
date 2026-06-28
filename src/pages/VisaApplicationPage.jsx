import { useMemo, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import {
  FaArrowLeft,
  FaArrowRight,
  FaCalendarAlt,
  FaCheckCircle,
  FaEnvelope,
  FaPassport,
  FaPhoneAlt,
  FaUser,
  FaWhatsapp,
} from "react-icons/fa"

import Footer from "../components/Footer"
import AppSelect from "../components/common/AppSelect"
import { publicApi } from "../services/publicApi"

const whatsappNumber = "923111444192"

const defaultVisaTypes = [
  "Tourist Visa",
  "Visit Visa",
  "Business Visa",
  "Student Visa",
  "Family Visa",
  "Umrah Visa",
  "Other",
]

const passportOptions = ["Yes", "No", "Applied / In Process"]

const travelerOptions = [
  "1 Traveler",
  "2 Travelers",
  "Family",
  "Group",
  "Corporate / Team",
]

const labelClass =
  "mb-1.5 block font-poppins text-[9px] font-bold uppercase tracking-[0.08em] text-slate-400 sm:mb-2 sm:text-xs"

const iconInputClass =
  "h-11 w-full rounded-[5px] border border-slate-200 bg-white pl-10 pr-3 font-poppins text-xs font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#00AEEF] sm:h-12 sm:pl-11 sm:pr-4 sm:text-sm"

const parseTravelers = (value) => {
  if (value === "1 Traveler") {
    return {
      adults: 1,
      children: 0,
      infants: 0,
    }
  }

  if (value === "2 Travelers") {
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

  if (value === "Group" || value === "Corporate / Team") {
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

const VisaApplicationPage = () => {
  const [searchParams] = useSearchParams()

  const selectedCountry = searchParams.get("country") || ""
  const selectedVisa =
    searchParams.get("visa") || searchParams.get("type") || "Tourist Visa"

  const visaTypeOptions = useMemo(
    () =>
      Array.from(new Set([selectedVisa, ...defaultVisaTypes].filter(Boolean))),
    [selectedVisa]
  )

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    country: selectedCountry,
    visaType: selectedVisa,
    travelDate: "",
    travelers: "1 Traveler",
    hasPassport: "Yes",
    message: "",
  })

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

  const getWhatsappUrl = () => {
    const message = `
Assalamualaikum TravelEx,

I want to apply for a visa.

Full Name: ${formData.fullName}
Phone: ${formData.phone}
Email: ${formData.email || "Not provided"}
Country: ${formData.country}
Visa Type: ${formData.visaType}
Expected Travel Date: ${formData.travelDate || "Not decided"}
No. of Travelers: ${formData.travelers}
Passport Available: ${formData.hasPassport}

Additional Message:
${formData.message || "No additional message"}
    `.trim()

    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
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

    if (!formData.country.trim()) {
      setError("Please enter visa country.")
      return
    }

    if (!formData.visaType) {
      setError("Please select visa type.")
      return
    }

    try {
      setLoading(true)

      const message = [
        `Visa application request`,
        `Country: ${formData.country}`,
        `Visa Type: ${formData.visaType}`,
        `Expected Travel Date: ${formData.travelDate || "Not decided"}`,
        `No. of Travelers: ${formData.travelers}`,
        `Passport Available: ${formData.hasPassport}`,
        "",
        formData.message
          ? `Additional Message: ${formData.message}`
          : "Additional Message: Not provided",
      ].join("\n")

      const payload = {
        name: formData.fullName.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        serviceType: "visa",
        source: "visa-page",
        pageUrl: window.location.href,
        destination: formData.country.trim(),
        travelers: parseTravelers(formData.travelers),
        message,
        priority: "high",
        companyWebsite: "",
      }

      await publicApi.createLead(payload)

      setSubmitted(true)
      window.scrollTo({ top: 0, behavior: "smooth" })
    } catch (err) {
      console.error("Visa application lead error:", err)
      setError(
        err.message ||
          "We could not submit your visa application right now. Please try again."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="bg-[#F8FAFC]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,174,239,0.24),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(255,107,0,0.22),transparent_32%)]" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/92 to-slate-900" />

        <div className="relative z-10 mx-auto max-w-[1340px] px-4 py-7 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
          <div className="max-w-5xl">
            <Link
              to="/visa"
              className="mb-2 inline-flex items-center gap-1.5 font-poppins text-[9px] font-semibold text-white/75 transition hover:text-[#00AEEF] sm:mb-6 sm:gap-2 sm:text-sm"
            >
              <FaArrowLeft className="text-[8px] sm:text-xs" />
              Back to Visa Services
            </Link>

            <div className="mb-2 flex flex-wrap items-center gap-1.5 sm:mb-4 sm:gap-3">
              <span className="inline-flex h-[27px] items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-2.5 font-poppins text-[7.5px] font-bold uppercase tracking-[0.08em] text-[#00AEEF] backdrop-blur sm:h-auto sm:gap-2 sm:px-4 sm:py-2 sm:text-[11px] sm:tracking-[0.1em]">
                <FaPassport className="text-[8px] sm:text-[10px]" />
                Visa Application
              </span>

              <span className="inline-flex h-[27px] items-center rounded-full border border-white/15 bg-white/10 px-2.5 font-poppins text-[8.5px] font-semibold text-white/85 backdrop-blur sm:h-auto sm:px-4 sm:py-2 sm:text-xs">
                {selectedCountry || "Visa Assistance"}
              </span>

              <span className="inline-flex h-[27px] items-center rounded-full border border-white/15 bg-white/10 px-2.5 font-poppins text-[8.5px] font-semibold text-white/85 backdrop-blur sm:h-auto sm:px-4 sm:py-2 sm:text-xs">
                {selectedVisa}
              </span>
            </div>

            <h1 className="font-fredoka text-[18px] font-semibold leading-[1.08] text-white sm:text-[46px] sm:uppercase sm:leading-[1.1] lg:text-[54px]">
              Apply for{" "}
              {selectedCountry ? `${selectedCountry} Visa` : "Visa Assistance"}
            </h1>

            <p className="mt-1 max-w-3xl font-poppins text-[9px] font-medium leading-4 text-white/85 sm:mt-4 sm:text-base sm:leading-7">
              <span className="sm:hidden">Submit visa request.</span>

              <span className="hidden sm:inline">
                Fill this form and TravelEx will guide you about visa
                requirements, documents, processing and next steps.
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="bg-[#F8FAFC] py-8 sm:py-14">
        <div className="mx-auto grid max-w-[1440px] gap-5 px-4 sm:px-6 lg:grid-cols-[1fr_360px] lg:gap-6 lg:px-8">
          <form
            onSubmit={handleSubmit}
            className="rounded-[12px] border border-slate-100 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.06)] sm:p-7"
          >
            <div className="mb-4 sm:mb-6">
              <p className="mb-1.5 font-poppins text-[8.5px] font-bold uppercase tracking-[0.08em] text-[#00AEEF] sm:mb-2 sm:text-[12px] sm:tracking-[0.1em]">
                Visa Application Form
              </p>

              <h2 className="font-fredoka text-[20px] font-semibold leading-[1.08] text-slate-950 sm:text-[36px]">
                Applicant details
              </h2>

              <p className="mt-1.5 font-poppins text-[10.5px] font-medium leading-5 text-slate-600 sm:mt-2 sm:text-sm sm:leading-7">
                Submit your visa request. TravelEx will review your details and
                guide you on documents and processing.
              </p>
            </div>

            {error && (
              <p className="mb-4 rounded-[5px] bg-red-50 px-4 py-3 font-poppins text-[11.5px] font-semibold leading-5 text-red-600 sm:text-sm">
                {error}
              </p>
            )}

            {submitted && (
              <div className="mb-4 rounded-[8px] border border-green-100 bg-green-50 p-4 sm:p-5">
                <div className="flex items-start gap-3">
                  <FaCheckCircle className="mt-1 shrink-0 text-green-600" />

                  <div>
                    <h3 className="font-fredoka text-[20px] font-semibold leading-tight text-green-800 sm:text-[24px]">
                      Visa request submitted
                    </h3>

                    <p className="mt-1.5 font-poppins text-[11.5px] font-medium leading-5 text-green-700 sm:text-sm sm:leading-7">
                      Your visa application request has been saved in the
                      TravelEx CRM dashboard. Our consultant will contact you
                      soon.
                    </p>

                    <a
                      href={getWhatsappUrl()}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 inline-flex items-center justify-center gap-2 rounded-[5px] bg-[#25D366] px-4 py-2.5 font-poppins text-xs font-semibold text-white transition hover:bg-[#00AEEF]"
                    >
                      <FaWhatsapp />
                      Continue on WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Full Name *</label>

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

              <div>
                <label className={labelClass}>Phone / WhatsApp *</label>

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
                <label className={labelClass}>Visa Country *</label>

                <div className="relative">
                  <FaPassport className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 sm:left-4 sm:text-sm" />

                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="Thailand, Dubai, Schengen..."
                    className={iconInputClass}
                  />
                </div>
              </div>

              <AppSelect
                label="Visa Type"
                value={formData.visaType}
                onChange={(value) => handleSelectChange("visaType", value)}
                placeholder="Select visa type"
                options={visaTypeOptions}
              />

              <div>
                <label className={labelClass}>Expected Travel Date</label>

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

              <AppSelect
                label="No. of Travelers"
                value={formData.travelers}
                onChange={(value) => handleSelectChange("travelers", value)}
                placeholder="Select travelers"
                options={travelerOptions}
              />

              <AppSelect
                label="Passport Available?"
                value={formData.hasPassport}
                onChange={(value) => handleSelectChange("hasPassport", value)}
                placeholder="Select passport status"
                options={passportOptions}
              />
            </div>

            <div className="mt-4">
              <label className={labelClass}>Additional Message</label>

              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="5"
                placeholder="Write any specific requirement, document issue, travel plan, or family visa detail..."
                className="w-full resize-none rounded-[5px] border border-slate-200 bg-white px-3 py-3 font-poppins text-xs font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#00AEEF] sm:px-4 sm:text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-[5px] bg-[#FF6B00] px-5 py-2.5 font-poppins text-xs font-semibold text-white transition hover:bg-[#00AEEF] disabled:cursor-not-allowed disabled:opacity-70 sm:px-6 sm:py-3 sm:text-sm"
            >
              {loading ? "Submitting..." : "Submit Application"}
              {!loading && <FaArrowRight className="text-[10px] sm:text-xs" />}
            </button>
          </form>

          {/* Sidebar */}
          <aside className="h-fit lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-[12px] border border-slate-100 bg-white p-4 shadow-[0_16px_45px_rgba(15,23,42,0.08)] sm:p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-[12px] bg-[#FF6B00]/10 text-xl text-[#FF6B00] sm:h-14 sm:w-14 sm:text-2xl">
                <FaPassport />
              </div>

              <h2 className="mt-4 font-fredoka text-[22px] font-semibold leading-tight text-slate-950 sm:text-2xl">
                What happens next?
              </h2>

              <div className="mt-4 grid gap-3">
                {[
                  "Our team reviews your visa requirement.",
                  "You receive country-specific document guidance.",
                  "TravelEx guides you about processing and next steps.",
                  "You can share documents directly with our consultant.",
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
                Note: Visa approval depends on embassy, consulate or
                immigration authority decision. TravelEx provides guidance and
                application support.
              </p>

              <a
                href={`https://wa.me/${whatsappNumber}`}
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

      <Footer />
    </main>
  )
}

export default VisaApplicationPage