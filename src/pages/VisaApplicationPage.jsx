import { useMemo, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import {
  FaArrowLeft,
  FaArrowRight,
  FaCalendarAlt,
  FaCheckCircle,
  FaEnvelope,
  FaGlobeAsia,
  FaPassport,
  FaPhoneAlt,
  FaUser,
  FaWhatsapp,
} from "react-icons/fa"

import Footer from "../components/Footer"
import AppSelect from "../components/common/AppSelect"
import AppDatePicker from "../components/common/AppDatePicker"
import { publicApi } from "../services/publicApi"

const whatsappNumber = "923111444192"

const defaultVisaTypes = [
  "Tourist Visa",
  "Visit Visa",
  "Business Visa",
  "Family Visit Visa",
  "Student Visa",
]

const yesNoOptions = ["Yes", "No"]

const labelClass =
  "mb-1.5 block font-poppins text-[9px] font-bold uppercase tracking-[0.08em] text-slate-400 sm:mb-2 sm:text-xs"

const inputClass =
  "h-11 w-full rounded-[5px] border border-slate-200 bg-white px-3 font-poppins text-xs font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#00AEEF] focus:ring-2 focus:ring-[#00AEEF]/10 sm:h-12 sm:px-4 sm:text-sm"

const iconInputClass =
  "h-11 w-full rounded-[5px] border border-slate-200 bg-white pl-10 pr-3 font-poppins text-xs font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#00AEEF] focus:ring-2 focus:ring-[#00AEEF]/10 sm:h-12 sm:pl-11 sm:pr-4 sm:text-sm"

const toIsoDate = (value) => {
  if (!value) return undefined
  return new Date(`${value}T00:00:00`).toISOString()
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
    city: "",
    nationality: "",
    destinationCountry: selectedCountry,
    visaType: selectedVisa,
    intendedTravelDate: "",
    durationOfStay: "",
    numberOfApplicants: "1",
    traveledAbroadBefore: "",
    visaRefusedBefore: "",
    currentOccupation: "",
    monthlyIncome: "",
    flightBookingAssistance: "",
    hotelBookingAssistance: "",
    additionalRequirements: "",
    companyWebsite: "",
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

I want to submit a visa application inquiry.

Full Name: ${formData.fullName}
Mobile / WhatsApp: ${formData.phone}
Email Address: ${formData.email || "Not provided"}
City: ${formData.city}
Nationality: ${formData.nationality}
Destination Country: ${formData.destinationCountry}
Visa Type: ${formData.visaType}
Intended Travel Date: ${formData.intendedTravelDate || "Not decided"}
Duration of Stay: ${formData.durationOfStay || "Not provided"}
Number of Applicants: ${formData.numberOfApplicants}
Traveled Abroad Before: ${formData.traveledAbroadBefore || "Not selected"}
Visa Refused Before: ${formData.visaRefusedBefore || "Not selected"}
Current Occupation: ${formData.currentOccupation || "Not provided"}
Monthly Income: ${formData.monthlyIncome || "Not provided"}
Flight Booking Assistance: ${formData.flightBookingAssistance || "Not selected"}
Hotel Booking Assistance: ${formData.hotelBookingAssistance || "Not selected"}

Additional Information / Requirements:
${formData.additionalRequirements || "No additional information"}
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

    if (!formData.nationality.trim()) {
      setError("Please enter your nationality.")
      return
    }

    if (!formData.destinationCountry.trim()) {
      setError("Please enter destination country.")
      return
    }

    if (!formData.visaType) {
      setError("Please select visa type.")
      return
    }

    if (!formData.intendedTravelDate) {
      setError("Please select intended travel date.")
      return
    }

    if (!formData.durationOfStay.trim()) {
      setError("Please enter duration of stay.")
      return
    }

    if (!formData.numberOfApplicants || Number(formData.numberOfApplicants) < 1) {
      setError("Please enter number of applicants.")
      return
    }

    if (!formData.traveledAbroadBefore) {
      setError("Please select whether you have traveled abroad before.")
      return
    }

    if (!formData.visaRefusedBefore) {
      setError("Please select whether you have been refused a visa before.")
      return
    }

    if (!formData.currentOccupation.trim()) {
      setError("Please enter current occupation.")
      return
    }

    if (!formData.monthlyIncome.trim()) {
      setError("Please enter monthly income.")
      return
    }

    if (!formData.flightBookingAssistance) {
      setError("Please select whether you require flight booking assistance.")
      return
    }

    if (!formData.hotelBookingAssistance) {
      setError("Please select whether you require hotel booking assistance.")
      return
    }

    try {
      setLoading(true)

      const applicants = Math.max(1, Number(formData.numberOfApplicants) || 1)

      const message = [
        "Visa application inquiry",
        "",
        `Full Name: ${formData.fullName}`,
        `Mobile / WhatsApp: ${formData.phone}`,
        `Email Address: ${formData.email}`,
        `City: ${formData.city}`,
        `Nationality: ${formData.nationality}`,
        `Destination Country: ${formData.destinationCountry}`,
        `Visa Type: ${formData.visaType}`,
        `Intended Travel Date: ${formData.intendedTravelDate}`,
        `Duration of Stay: ${formData.durationOfStay}`,
        `Number of Applicants: ${applicants}`,
        `Have You Traveled Abroad Before?: ${formData.traveledAbroadBefore}`,
        `Have You Been Refused a Visa Before?: ${formData.visaRefusedBefore}`,
        `Current Occupation: ${formData.currentOccupation}`,
        `Monthly Income: ${formData.monthlyIncome}`,
        `Do You Require Flight Booking Assistance?: ${formData.flightBookingAssistance}`,
        `Do You Require Hotel Booking Assistance?: ${formData.hotelBookingAssistance}`,
        "",
        formData.additionalRequirements
          ? `Additional Information / Requirements: ${formData.additionalRequirements}`
          : "Additional Information / Requirements: Not provided",
      ].join("\n")

      const payload = {
        name: formData.fullName.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        serviceType: "visa",
        source: "visa-page",
        pageUrl: window.location.href,
        city: formData.city.trim(),
        nationality: formData.nationality.trim(),
        destinationCountry: formData.destinationCountry.trim(),
        destination: formData.destinationCountry.trim(),
        visaType: formData.visaType,
        travelDate: toIsoDate(formData.intendedTravelDate),
        durationOfStay: formData.durationOfStay.trim(),
        numberOfApplicants: applicants,
        travelers: {
          adults: applicants,
          children: 0,
          infants: 0,
        },
        traveledAbroadBefore: formData.traveledAbroadBefore,
        visaRefusedBefore: formData.visaRefusedBefore,
        currentOccupation: formData.currentOccupation.trim(),
        monthlyIncome: formData.monthlyIncome.trim(),
        flightBookingAssistance: formData.flightBookingAssistance,
        hotelBookingAssistance: formData.hotelBookingAssistance,
        additionalRequirements: formData.additionalRequirements.trim(),
        message,
        priority: "high",
        companyWebsite: formData.companyWebsite,
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
              <span className="inline-flex h-[27px] items-center gap-1.5 rounded-[5px] border border-white/15 bg-white/10 px-2.5 font-poppins text-[7.5px] font-bold uppercase tracking-[0.08em] text-[#00AEEF] backdrop-blur sm:h-auto sm:gap-2 sm:px-4 sm:py-2 sm:text-[11px] sm:tracking-[0.1em]">
                <FaPassport className="text-[8px] sm:text-[10px]" />
                Visa Inquiry
              </span>

              <span className="inline-flex h-[27px] items-center rounded-[5px] border border-white/15 bg-white/10 px-2.5 font-poppins text-[8.5px] font-semibold text-white/85 backdrop-blur sm:h-auto sm:px-4 sm:py-2 sm:text-xs">
                {formData.destinationCountry || "Visa Assistance"}
              </span>

              <span className="inline-flex h-[27px] items-center rounded-[5px] border border-white/15 bg-white/10 px-2.5 font-poppins text-[8.5px] font-semibold text-white/85 backdrop-blur sm:h-auto sm:px-4 sm:py-2 sm:text-xs">
                {formData.visaType}
              </span>
            </div>

            <h1 className="font-fredoka text-[18px] font-semibold leading-[1.08] text-white sm:text-[46px] sm:uppercase sm:leading-[1.1] lg:text-[54px]">
              Visa Application Inquiry
            </h1>

            <p className="mt-1 max-w-3xl font-poppins text-[9px] font-medium leading-4 text-white/85 sm:mt-4 sm:text-base sm:leading-7">
              Submit your visa details and TravelEx will guide you about
              requirements, documents, processing and next steps.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#F8FAFC] py-8 sm:py-14">
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
                Visa Application Inquiry Form
              </p>

              <h2 className="font-fredoka text-[20px] font-semibold leading-[1.08] text-slate-950 sm:text-[36px]">
                Applicant details
              </h2>

              <p className="mt-1.5 font-poppins text-[10.5px] font-medium leading-5 text-slate-600 sm:mt-2 sm:text-sm sm:leading-7">
                Fill the required details exactly as requested by TravelEx.
              </p>
            </div>

            {error && (
              <p className="mb-4 rounded-[5px] bg-red-50 px-4 py-3 font-poppins text-[11.5px] font-semibold leading-5 text-red-600 sm:text-sm">
                {error}
              </p>
            )}

            {submitted && (
              <div className="mb-4 rounded-[5px] border border-green-100 bg-green-50 p-4 sm:p-5">
                <div className="flex items-start gap-3">
                  <FaCheckCircle className="mt-1 shrink-0 text-green-600" />

                  <div>
                    <h3 className="font-fredoka text-[20px] font-semibold leading-tight text-green-800 sm:text-[24px]">
                      Visa inquiry submitted
                    </h3>

                    <p className="mt-1.5 font-poppins text-[11.5px] font-medium leading-5 text-green-700 sm:text-sm sm:leading-7">
                      Your visa application inquiry has been saved in the
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

            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <div>
                <label className={labelClass}>City *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Your city"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Nationality *</label>
                <input
                  type="text"
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleChange}
                  placeholder="Pakistani"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Destination Country *</label>
                <div className="relative">
                  <FaGlobeAsia className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 sm:left-4 sm:text-sm" />
                  <input
                    type="text"
                    name="destinationCountry"
                    value={formData.destinationCountry}
                    onChange={handleChange}
                    placeholder="UAE, UK, Schengen..."
                    className={iconInputClass}
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <AppSelect
                label="Visa Type *"
                value={formData.visaType}
                onChange={(value) => handleSelectChange("visaType", value)}
                placeholder="Select visa type"
                options={visaTypeOptions}
              />

              <AppDatePicker
                label="Intended Travel Date *"
                value={formData.intendedTravelDate}
                onChange={(value) => handleSelectChange("intendedTravelDate", value)}
                placeholder="Select intended travel date"
              />

              <div>
                <label className={labelClass}>Duration of Stay *</label>
                <input
                  type="text"
                  name="durationOfStay"
                  value={formData.durationOfStay}
                  onChange={handleChange}
                  placeholder="Example: 15 days"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <div>
                <label className={labelClass}>Number of Applicants *</label>
                <input
                  type="number"
                  name="numberOfApplicants"
                  min="1"
                  value={formData.numberOfApplicants}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <AppSelect
                label="Traveled Abroad Before? *"
                value={formData.traveledAbroadBefore}
                onChange={(value) => handleSelectChange("traveledAbroadBefore", value)}
                placeholder="Select option"
                options={yesNoOptions}
              />

              <AppSelect
                label="Visa Refused Before? *"
                value={formData.visaRefusedBefore}
                onChange={(value) => handleSelectChange("visaRefusedBefore", value)}
                placeholder="Select option"
                options={yesNoOptions}
              />
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Current Occupation *</label>
                <input
                  type="text"
                  name="currentOccupation"
                  value={formData.currentOccupation}
                  onChange={handleChange}
                  placeholder="Job, business, student..."
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Monthly Income *</label>
                <input
                  type="text"
                  name="monthlyIncome"
                  value={formData.monthlyIncome}
                  onChange={handleChange}
                  placeholder="Example: PKR 150,000"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <AppSelect
                label="Require Flight Booking Assistance? *"
                value={formData.flightBookingAssistance}
                onChange={(value) => handleSelectChange("flightBookingAssistance", value)}
                placeholder="Select option"
                options={yesNoOptions}
              />

              <AppSelect
                label="Require Hotel Booking Assistance? *"
                value={formData.hotelBookingAssistance}
                onChange={(value) => handleSelectChange("hotelBookingAssistance", value)}
                placeholder="Select option"
                options={yesNoOptions}
              />
            </div>

            <div className="mt-4">
              <label className={labelClass}>Additional Information / Requirements</label>
              <textarea
                rows="4"
                name="additionalRequirements"
                value={formData.additionalRequirements}
                onChange={handleChange}
                placeholder="Write any extra visa information, family details, document concerns, or special requirements..."
                className={`${inputClass} h-auto resize-none py-3 leading-6`}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-[5px] bg-[#FF6B00] px-6 py-3.5 font-poppins text-sm font-semibold text-white transition hover:bg-[#00AEEF] disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
            >
              {loading ? "Submitting..." : "Submit Visa Inquiry"}
              {!loading && <FaArrowRight className="text-xs" />}
            </button>
          </form>

          <aside className="h-fit rounded-[5px] border border-slate-100 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
            <h3 className="font-fredoka text-[24px] font-semibold text-slate-950">
              Visa support
            </h3>
            <p className="mt-2 font-poppins text-sm font-medium leading-7 text-slate-600">
              TravelEx will review your details and guide you about documents,
              eligibility and processing requirements.
            </p>
            <a
              href={getWhatsappUrl()}
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

export default VisaApplicationPage
