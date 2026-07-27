import { useRef, useState } from "react"
import { Link, useParams } from "react-router-dom"
import {
  FaArrowLeft,
  FaArrowRight,
  FaCheckCircle,
  FaEnvelope,
  FaKaaba,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaUser,
} from "react-icons/fa"

import { umrahPackages as packages } from "../data/umrahPackagesData"
import Footer from "../components/Footer"
import AppSelect from "../components/common/AppSelect"
import AppDatePicker from "../components/common/AppDatePicker"
import ChildAgeFields from "../components/common/ChildAgeFields"
import { publicApi } from "../services/publicApi"
import umrahFormAsset from "../assets/umrah/umrah-form.png"
import {
  getChildAgesError,
  getChildCount,
  normalizeChildAges,
  resizeChildAges,
} from "../utils/travelerForm"

const packageOptions = ["Economy", "Star"]
const hotelPreferenceOptions = ["3 Star", "4 Star", "5 Star"]
const nightOptions = Array.from({ length: 30 }, (_, index) => String(index + 1))
const airportOptions = [
  "Islamabad — Islamabad International Airport",
  "Lahore — Allama Iqbal International Airport",
  "Karachi — Jinnah International Airport",
  "Faisalabad — Faisalabad International Airport",
  "Multan — Multan International Airport",
  "Peshawar — Bacha Khan International Airport",
  "Quetta — Quetta International Airport",
  "Sialkot — Sialkot International Airport",
  "Skardu — Skardu International Airport",
  "Turbat — Turbat International Airport",
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
  city: "",
  adults: "1",
  children: "0",
  childAges: [],
  departureCity: "",
  departureDate: "",
  durationOfStay: "",
  packageRequired: "",
  hotelPreference: "",
  makkahNights: "",
  madinahNights: "",
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

const PackageDetails = () => {
  const { id } = useParams()
  const bookingFormRef = useRef(null)

  const pkg = packages.find((item) => item.id === id)

  const [formData, setFormData] = useState(initialForm)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const isStarPackage = formData.packageRequired === "Star"

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((prev) => {
      if (name === "children") {
        const childCount = Math.max(0, Math.floor(Number(value) || 0))

        return {
          ...prev,
          children: value,
          childAges: resizeChildAges(prev.childAges, childCount),
        }
      }

      return {
        ...prev,
        [name]: value,
      }
    })

    setError("")
    setSubmitted(false)
  }

  const handleSelectChange = (name, value) => {
    setFormData((prev) => {
      if (name === "packageRequired" && value !== "Star") {
        return {
          ...prev,
          packageRequired: value,
          hotelPreference: "",
          makkahNights: "",
          madinahNights: "",
        }
      }

      return {
        ...prev,
        [name]: value,
      }
    })

    setError("")
    setSubmitted(false)
  }

  const handleChildAgeChange = (index, value) => {
    setFormData((prev) => ({
      ...prev,
      childAges: prev.childAges.map((age, ageIndex) =>
        ageIndex === index ? value : age
      ),
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

    if (!formData.city.trim()) {
      setError("Please enter your city.")
      return
    }

    const childCount = getChildCount(formData.children)
    const childAgesError = getChildAgesError(
      formData.childAges,
      childCount
    )

    if (childAgesError) {
      setError(childAgesError)
      return
    }

    const childAges = normalizeChildAges(formData.childAges, childCount)

    if (!formData.departureCity.trim()) {
      setError("Please select your preferred airport.")
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

    if (formData.packageRequired === "Star") {
      if (!formData.hotelPreference) {
        setError("Please select hotel preference for the Star package.")
        return
      }

      if (getNumber(formData.makkahNights, 0) < 1) {
        setError("Please select the number of nights in Makkah.")
        return
      }

      if (getNumber(formData.madinahNights, 0) < 1) {
        setError("Please select the number of nights in Madinah.")
        return
      }
    }


    try {
      setLoading(true)

      const travelers = {
        adults: getNumber(formData.adults, 1),
        children: childCount,
        childAges,
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
        travelers.childAges.length
          ? `Child Ages: ${travelers.childAges.join(", ")}`
          : null,
        `Preferred Airport: ${formData.departureCity}`,
        `Preferred Departure Date: ${formData.departureDate}`,
        `Duration of Stay: ${formData.durationOfStay}`,
        `Package Required: ${formData.packageRequired}`,
        isStarPackage
          ? `Hotel Preference: ${formData.hotelPreference}`
          : null,
        isStarPackage ? `Nights in Makkah: ${formData.makkahNights}` : null,
        isStarPackage ? `Nights in Madinah: ${formData.madinahNights}` : null,
        "",
        formData.additionalRequirements
          ? `Additional Requirements: ${formData.additionalRequirements}`
          : "Additional Requirements: Not provided",
      ].filter(Boolean).join("\n")

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
        hotelCategory: isStarPackage ? formData.hotelPreference : "",
        preferredHotel: isStarPackage ? formData.hotelPreference : "",
        makkahNights: isStarPackage ? getNumber(formData.makkahNights, 0) : 0,
        madinahNights: isStarPackage ? getNumber(formData.madinahNights, 0) : 0,

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

      bookingFormRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
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
                The package you are looking for does not exist or may have been
                moved.
              </p>

              <Link
                to="/umrah"
                className="mt-5 inline-flex items-center justify-center gap-2 rounded-[5px] bg-[#FF6B00] px-5 py-2.5 font-poppins text-xs font-semibold text-white transition hover:bg-[#00AEEF] sm:mt-6 sm:px-6 sm:py-3 sm:text-sm"
              >
                <FaArrowLeft className="text-[10px] sm:text-xs" />
                Back to Umrah Packages
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
  to="/umrah"
  aria-label="Back to packages"
  title="Back to packages"
  className="absolute left-4 top-3 z-30 hidden h-9 w-9 items-center justify-center rounded-[5px] border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-[#00AEEF] hover:text-[#00AEEF] sm:left-6 sm:top-5 sm:flex sm:h-10 sm:w-10 lg:left-8"
>
  <FaArrowLeft className="text-[12px] sm:text-sm" />
</Link>
        {/* Banner — exactly same width as form */}
      {/* Banner — exactly same width as form */}
<div className="mx-auto max-w-[920px]">
  <div className="relative mb-3 min-h-[120px] overflow-hidden rounded-[18px] bg-white px-5 py-4 shadow-[0_10px_34px_rgba(11,42,74,0.08)] sm:mb-4 sm:min-h-[150px] sm:px-8 sm:py-5 lg:min-h-[170px]">
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
      .umrah-banner-asset {
        animation:
          bannerAssetIn 0.9s ease-out both,
          bannerFloat 4.5s ease-in-out 0.9s infinite;
      }
      @media (prefers-reduced-motion: reduce) {
        [data-umrah-stagger],
        .umrah-banner-asset {
          animation: none !important;
        }
      }
    `}</style>

    {/* Soft ambient glow for depth */}
    <div className="pointer-events-none absolute -right-10 -top-16 hidden h-64 w-64 rounded-full bg-[#00AEEF]/10 blur-3xl sm:block" />
    <div className="pointer-events-none absolute -bottom-16 right-24 hidden h-40 w-40 rounded-full bg-[#FF6B00]/10 blur-3xl sm:block" />

    {/* Text block */}
    <div className="absolute inset-y-0 left-0 z-10 flex w-full items-center px-5 py-5 sm:w-[72%] sm:px-8 sm:py-6 lg:w-[70%]">
      <div>
        <p
          data-umrah-stagger
          style={{ animation: "bannerFadeUp 0.6s ease-out 0s both" }}
          className="mb-2 flex items-center gap-2 font-poppins text-[11px] font-bold uppercase tracking-[0.22em] text-[#00AEEF] sm:mb-3 sm:text-[14px]"
        >
          <span className="inline-block h-[2px] w-6 bg-[#FF6B00] sm:w-8" />
          Trusted By 8,500+ Pilgrims
        </p>
<h2
  data-umrah-stagger
  style={{ animation: "bannerFadeUp 0.6s ease-out 0.15s both" }}
  className="flex flex-nowrap items-center gap-2 font-fredoka text-[16px] font-semibold uppercase leading-[1.05] tracking-wide text-slate-950 sm:gap-2.5 sm:text-[34px] lg:text-[38px]"
>
  <span className="whitespace-nowrap">Your Path To</span>

  <span
    className="rounded-[6px] bg-[#FF6B00] px-2.5 py-1 leading-none tracking-wide text-white shadow-sm sm:px-4 sm:py-1.5"
    style={{ animation: "bannerStampIn 0.9s ease-out 0.3s both" }}
  >
    Makkah
  </span>
</h2>
      </div>
    </div>

    {/* Illustration — sized to fit within the compact card, no bleed */}
  <img
  src={umrahFormAsset}
  alt="Umrah pilgrim illustration"
  className="umrah-banner-asset pointer-events-none absolute right-2 top-14 z-0 block h-[60px] w-auto object-contain sm:right-5 sm:top-[58%] sm:block sm:h-[170px] sm:-translate-y-[42%] lg:right-7 lg:h-[190px]"
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
                  <FaKaaba />
                </span>

                <p className="font-poppins text-[8.5px] font-bold uppercase tracking-[0.08em] text-[#00AEEF] sm:text-[12px] sm:tracking-[0.1em]">
                  Umrah Inquiry Form
                </p>
              </div>

              <h1 className="font-fredoka text-[22px] font-semibold leading-tight text-slate-950 sm:text-[36px]">
                Submit Umrah inquiry
              </h1>

              <p className="mt-1.5 font-poppins text-[10.5px] font-medium leading-5 text-slate-600 sm:mt-2 sm:text-sm sm:leading-7">
                Fill the required details for{" "}
                <span className="font-bold text-slate-950">{pkg.title}</span>.
                TravelEx will confirm availability, hotel options, visa
                guidance, and final quote.
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
                      Umrah inquiry submitted
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
                <AppSelect
                  label="Package Required *"
                  value={formData.packageRequired}
                  onChange={(value) =>
                    handleSelectChange("packageRequired", value)
                  }
                  placeholder="Select package"
                  options={packageOptions}
                />

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
                  <label className={labelClass}>Email Address (Optional)</label>

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

              <div className="grid gap-4 sm:grid-cols-2">
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
              </div>

              <ChildAgeFields
                ages={formData.childAges}
                onChange={handleChildAgeChange}
                labelClass={labelClass}
                inputClass={inputClass}
              />

              <div className="grid gap-4 sm:grid-cols-3">
                <AppSelect
                  label="Preferred Airport *"
                  value={formData.departureCity}
                  onChange={(value) =>
                    handleSelectChange("departureCity", value)
                  }
                  placeholder="Select preferred airport"
                  options={airportOptions}
                />

                <AppDatePicker
                  label="Preferred Departure Date *"
                  value={formData.departureDate}
                  onChange={(value) =>
                    handleSelectChange("departureDate", value)
                  }
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

              {isStarPackage && (
                <div className="grid gap-4 sm:grid-cols-3">
                  <AppSelect
                    label="Hotel Preference *"
                    value={formData.hotelPreference}
                    onChange={(value) =>
                      handleSelectChange("hotelPreference", value)
                    }
                    placeholder="Select hotel"
                    options={hotelPreferenceOptions}
                  />

                  <AppSelect
                    label="Nights in Makkah *"
                    value={formData.makkahNights}
                    onChange={(value) =>
                      handleSelectChange("makkahNights", value)
                    }
                    placeholder="Select nights"
                    options={nightOptions}
                  />

                  <AppSelect
                    label="Nights in Madinah *"
                    value={formData.madinahNights}
                    onChange={(value) =>
                      handleSelectChange("madinahNights", value)
                    }
                    placeholder="Select nights"
                    options={nightOptions}
                  />
                </div>
              )}


              <div>
                <label className={labelClass}>Additional Requirements</label>

                <textarea
                  rows="4"
                  name="additionalRequirements"
                  value={formData.additionalRequirements}
                  onChange={handleChange}
                  placeholder="Write any special request, hotel preference, transfers, activities, or family requirement..."
                  className="min-h-[130px] w-full resize-none rounded-[5px] border border-slate-200 bg-white px-3 py-3 font-poppins text-xs font-semibold leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#00AEEF] focus:ring-2 focus:ring-[#00AEEF]/10 sm:min-h-[150px] sm:px-4 sm:text-sm"
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
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

export default PackageDetails