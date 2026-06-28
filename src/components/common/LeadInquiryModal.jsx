import { useState } from "react"
import { FaTimes } from "react-icons/fa"
import { publicApi } from "../../services/publicApi"

const initialForm = {
  name: "",
  email: "",
  phone: "",
  destination: "",
  travelDate: "",
  budget: "",
  adults: 1,
  children: 0,
  infants: 0,
  makkahNights: 0,
  madinahNights: 0,
  message: "",
  companyWebsite: "",
}

const inputClass =
  "w-full rounded-[5px] border border-slate-200 bg-slate-50 px-4 py-3 font-poppins text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#00AEEF] focus:bg-white focus:ring-2 focus:ring-[#00AEEF]/10"

const allowedServiceTypes = [
  "umrah",
  "tour",
  "visa",
  "hotel",
  "carRental",
  "contact",
  "general",
]

const allowedSources = [
  "homepage",
  "umrah-page",
  "tour-page",
  "visa-page",
  "hotel-page",
  "car-rental-page",
  "contact-page",
  "hero-banner",
  "lead-modal",
  "whatsapp",
  "manual",
  "other",
]

const isMongoObjectId = (value) => /^[0-9a-fA-F]{24}$/.test(String(value || ""))

const normalizeServiceType = (value) => {
  const serviceMap = {
    tours: "tour",
    tour: "tour",
    umrah: "umrah",
    visa: "visa",
    hotel: "hotel",
    hotels: "hotel",
    car: "carRental",
    carRental: "carRental",
    transport: "carRental",
    contact: "contact",
    general: "general",
  }

  const normalized = serviceMap[value] || value
  return allowedServiceTypes.includes(normalized) ? normalized : "general"
}

const normalizeSource = (value) => {
  return allowedSources.includes(value) ? value : "lead-modal"
}

const LeadInquiryModal = ({
  isOpen,
  onClose,
  serviceType = "general",
  source = "homepage",
  title = "Plan Your Trip",
  packageRef = null,
  tourRef = null,
  visaRef = null,
  hotelRef = null,
  carRentalRef = null,
  defaultMessage = "",
}) => {
  const [formData, setFormData] = useState(initialForm)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  if (!isOpen) return null

  const finalServiceType = normalizeServiceType(serviceType)
  const finalSource = normalizeSource(source)
  const isUmrah = finalServiceType === "umrah"

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleClose = () => {
    setFormData(initialForm)
    setSuccess("")
    setError("")
    onClose()
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    setSuccess("")
    setError("")

    if (!formData.name.trim()) {
      setError("Please enter your name.")
      return
    }

    if (!formData.email.trim()) {
      setError("Please enter your email.")
      return
    }

    if (!formData.phone.trim()) {
      setError("Please enter your phone number.")
      return
    }

    try {
      setLoading(true)

      const finalMessage = [defaultMessage, formData.message.trim()]
        .filter(Boolean)
        .join("\n\n")

      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        serviceType: finalServiceType,
        source: finalSource,
        pageUrl: window.location.href,

        travelers: {
          adults: Number(formData.adults) || 1,
          children: Number(formData.children) || 0,
          infants: Number(formData.infants) || 0,
        },

        destination: formData.destination.trim(),
        budget: formData.budget.trim(),
        travelDate: formData.travelDate || undefined,

        makkahNights: isUmrah ? Number(formData.makkahNights) || 0 : 0,
        madinahNights: isUmrah ? Number(formData.madinahNights) || 0 : 0,

        message: finalMessage,
        companyWebsite: formData.companyWebsite,
      }

      if (isMongoObjectId(packageRef)) {
        payload.packageRef = packageRef
      }

      if (isMongoObjectId(tourRef)) {
        payload.tourRef = tourRef
      }

      if (isMongoObjectId(visaRef)) {
        payload.visaRef = visaRef
      }

      if (isMongoObjectId(hotelRef)) {
        payload.hotelRef = hotelRef
      }

      if (isMongoObjectId(carRentalRef)) {
        payload.carRentalRef = carRentalRef
      }

      await publicApi.createLead(payload)

      setSuccess(
        "Your inquiry has been submitted successfully. Our consultant will contact you soon."
      )
      setFormData(initialForm)
    } catch (err) {
      console.error("Lead inquiry error:", err)
      setError(
        err.message ||
          "We couldn't submit your inquiry right now. Please try again or contact us on WhatsApp."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[999] flex items-end justify-center bg-slate-950/60 px-4 py-4 backdrop-blur-sm sm:items-center">
      <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-[5px] bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-5 py-4">
          <div>
            <p className="font-poppins text-xs font-semibold uppercase tracking-[0.08em] text-[#FF6B00]">
              TravelEx Inquiry
            </p>

            <h3 className="mt-1 font-fredoka text-2xl font-semibold text-slate-950">
              {title}
            </h3>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="flex h-10 w-10 items-center justify-center rounded-[5px] bg-slate-100 text-slate-700 transition hover:bg-[#FF6B00] hover:text-white"
            aria-label="Close inquiry form"
          >
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-4 p-5 sm:p-6">
          <input
            type="text"
            name="companyWebsite"
            value={formData.companyWebsite}
            onChange={handleChange}
            className="hidden"
            tabIndex="-1"
            autoComplete="off"
          />

          {success && (
            <div className="rounded-[5px] border border-green-200 bg-green-50 px-4 py-3 font-poppins text-sm font-semibold text-green-700">
              {success}
            </div>
          )}

          {error && (
            <div className="rounded-[5px] border border-red-200 bg-red-50 px-4 py-3 font-poppins text-sm font-semibold text-red-700">
              {error}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name"
              className={inputClass}
            />

            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone / WhatsApp"
              className={inputClass}
            />
          </div>

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email Address"
            className={inputClass}
          />

          <div className="grid gap-4 sm:grid-cols-3">
            <input
              type="text"
              name="destination"
              value={formData.destination}
              onChange={handleChange}
              placeholder="Destination"
              className={inputClass}
            />

            <input
              type="date"
              name="travelDate"
              value={formData.travelDate}
              onChange={handleChange}
              className={inputClass}
            />

            <input
              type="text"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              placeholder="Budget"
              className={inputClass}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <input
              type="number"
              name="adults"
              min="1"
              value={formData.adults}
              onChange={handleChange}
              placeholder="Adults"
              className={inputClass}
            />

            <input
              type="number"
              name="children"
              min="0"
              value={formData.children}
              onChange={handleChange}
              placeholder="Children"
              className={inputClass}
            />

            <input
              type="number"
              name="infants"
              min="0"
              value={formData.infants}
              onChange={handleChange}
              placeholder="Infants"
              className={inputClass}
            />
          </div>

          {isUmrah && (
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                type="number"
                name="makkahNights"
                min="0"
                value={formData.makkahNights}
                onChange={handleChange}
                placeholder="Makkah Nights"
                className={inputClass}
              />

              <input
                type="number"
                name="madinahNights"
                min="0"
                value={formData.madinahNights}
                onChange={handleChange}
                placeholder="Madinah Nights"
                className={inputClass}
              />
            </div>
          )}

          <textarea
            rows="4"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Tell us your travel dates, budget, destination, or package requirement..."
            className={`${inputClass} resize-none`}
          />

          <button
            type="submit"
            disabled={loading}
            className="rounded-[5px] bg-[#FF6B00] px-6 py-4 font-poppins text-sm font-semibold uppercase text-white transition-colors duration-300 hover:bg-[#00AEEF] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Submitting..." : "Submit Inquiry"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default LeadInquiryModal