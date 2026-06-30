import { useState } from "react"
import { FaTimes } from "react-icons/fa"
import { publicApi } from "../../services/publicApi"
import AppSelect from "./AppSelect"

const initialForm = {
  name: "",
  email: "",
  phone: "",
  city: "",
  nationality: "",
  destination: "",
  destinationCountry: "",
  departureCity: "",
  destinationCity: "",
  travelDate: "",
  returnDate: "",
  durationOfStay: "",
  adults: "1",
  children: "0",
  infants: "0",
  numberOfApplicants: "1",
  packageRequired: "",
  hotelCategory: "",
  preferredHotel: "",
  visaRequired: "",
  visaType: "",
  interestedIn: "",
  preferredAirline: "",
  travelClass: "",
  traveledAbroadBefore: "",
  visaRefusedBefore: "",
  currentOccupation: "",
  monthlyIncome: "",
  flightBookingAssistance: "",
  hotelBookingAssistance: "",
  budget: "",
  makkahNights: "0",
  madinahNights: "0",
  message: "",
  companyWebsite: "",
}

const inputClass =
  "w-full rounded-[5px] border border-slate-200 bg-slate-50 px-4 py-3 font-poppins text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#00AEEF] focus:bg-white focus:ring-2 focus:ring-[#00AEEF]/10"

const labelClass =
  "mb-1.5 block font-poppins text-[10px] font-bold uppercase tracking-[0.08em] text-slate-400"

const packageOptions = ["Economy", "Executive"]
const hotelOptions = ["3 Star", "4 Star", "5 Star"]
const yesNoOptions = ["Yes", "No"]
const interestedInOptions = ["Group Tour", "Private Tour"]
const classOptions = ["Economy", "Premium Economy", "Business", "First Class"]
const visaTypeOptions = [
  "Tourist Visa",
  "Visit Visa",
  "Business Visa",
  "Family Visit Visa",
  "Student Visa",
]

const allowedServiceTypes = [
  "umrah",
  "tour",
  "visa",
  "hotel",
  "carRental",
  "ticket",
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
  "ticket-page",
  "contact-page",
  "hero-banner",
  "lead-modal",
  "whatsapp",
  "manual",
  "other",
]

const isMongoObjectId = (value) => /^[0-9a-fA-F]{24}$/.test(String(value || ""))

const toIsoDate = (value) => {
  if (!value) return undefined
  return new Date(`${value}T00:00:00`).toISOString()
}

const getNumber = (value, fallback = 0) => Math.max(fallback, Number(value) || fallback)

const normalizeServiceType = (value) => {
  const serviceMap = {
    tours: "tour",
    tour: "tour",
    umrah: "umrah",
    visa: "visa",
    hotel: "hotel",
    hotels: "hotel",
    ticket: "ticket",
    tickets: "ticket",
    flight: "ticket",
    flights: "ticket",
    airTicket: "ticket",
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

const getTitleByService = (serviceType, fallbackTitle) => {
  if (fallbackTitle && fallbackTitle !== "Plan Your Trip") return fallbackTitle

  const titles = {
    umrah: "Umrah Inquiry Form",
    tour: "Tour Package Inquiry Form",
    visa: "Visa Application Inquiry Form",
    ticket: "Air Ticket Booking Form",
    hotel: "Hotel Booking Inquiry",
    carRental: "Transport Inquiry",
    contact: "Contact Inquiry",
    general: "Plan Your Trip",
  }

  return titles[serviceType] || fallbackTitle
}

const Field = ({ label, children }) => (
  <div>
    <label className={labelClass}>{label}</label>
    {children}
  </div>
)

const NumberFields = ({ formData, handleChange }) => (
  <div className="grid gap-4 sm:grid-cols-3">
    <Field label="Adults">
      <input
        type="number"
        name="adults"
        min="1"
        value={formData.adults}
        onChange={handleChange}
        className={inputClass}
      />
    </Field>

    <Field label="Children">
      <input
        type="number"
        name="children"
        min="0"
        value={formData.children}
        onChange={handleChange}
        className={inputClass}
      />
    </Field>

    <Field label="Infants">
      <input
        type="number"
        name="infants"
        min="0"
        value={formData.infants}
        onChange={handleChange}
        className={inputClass}
      />
    </Field>
  </div>
)

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
  const formTitle = getTitleByService(finalServiceType, title)

  const isUmrah = finalServiceType === "umrah"
  const isTour = finalServiceType === "tour"
  const isVisa = finalServiceType === "visa"
  const isTicket = finalServiceType === "ticket"
  const isGeneric = !isUmrah && !isTour && !isVisa && !isTicket

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

  const handleClose = () => {
    setFormData(initialForm)
    setSuccess("")
    setError("")
    onClose()
  }

  const validateForm = () => {
    if (!formData.name.trim()) return "Please enter your full name."
    if (!formData.phone.trim()) return "Please enter your mobile / WhatsApp number."
    if (!formData.email.trim()) return "Please enter your email address."

    if (isUmrah) {
      if (!formData.city.trim()) return "Please enter your city."
      if (!formData.departureCity.trim()) return "Please enter preferred departure city."
      if (!formData.travelDate) return "Please select preferred departure date."
      if (!formData.durationOfStay.trim()) return "Please enter duration of stay."
      if (!formData.packageRequired) return "Please select package required."
      if (!formData.hotelCategory) return "Please select hotel preference."
      if (!formData.visaRequired) return "Please select whether visa is required."
    }

    if (isTour) {
      if (!formData.city.trim()) return "Please enter your city."
      if (!formData.destination.trim()) return "Please enter destination."
      if (!formData.travelDate) return "Please select travel date."
      if (!formData.returnDate) return "Please select return date."
      if (!formData.hotelCategory) return "Please select hotel category."
      if (!formData.interestedIn) return "Please select interested in."
    }

    if (isTicket) {
      if (!formData.departureCity.trim()) return "Please enter departure city."
      if (!formData.destinationCity.trim()) return "Please enter destination city."
      if (!formData.travelDate) return "Please select departure date."
      if (!formData.travelClass) return "Please select class."
    }

    if (isVisa) {
      if (!formData.city.trim()) return "Please enter your city."
      if (!formData.nationality.trim()) return "Please enter nationality."
      if (!formData.destinationCountry.trim()) return "Please enter destination country."
      if (!formData.visaType) return "Please select visa type."
      if (!formData.travelDate) return "Please select intended travel date."
      if (!formData.durationOfStay.trim()) return "Please enter duration of stay."
      if (!formData.numberOfApplicants || Number(formData.numberOfApplicants) < 1) {
        return "Please enter number of applicants."
      }
      if (!formData.traveledAbroadBefore) return "Please select travel history."
      if (!formData.visaRefusedBefore) return "Please select visa refusal history."
      if (!formData.currentOccupation.trim()) return "Please enter current occupation."
      if (!formData.monthlyIncome.trim()) return "Please enter monthly income."
      if (!formData.flightBookingAssistance) return "Please select flight booking assistance."
      if (!formData.hotelBookingAssistance) return "Please select hotel booking assistance."
    }

    return ""
  }

  const buildMessage = () => {
    const travelers = `${getNumber(formData.adults, 1)} adult(s), ${getNumber(
      formData.children,
      0
    )} child(ren), ${getNumber(formData.infants, 0)} infant(s)`

    const serviceMessages = {
      umrah: [
        "Umrah inquiry form",
        `City: ${formData.city}`,
        `Travelers: ${travelers}`,
        `Preferred Departure City: ${formData.departureCity}`,
        `Preferred Departure Date: ${formData.travelDate}`,
        `Duration of Stay: ${formData.durationOfStay}`,
        `Package Required: ${formData.packageRequired}`,
        `Hotel Preference: ${formData.hotelCategory}`,
        `Visa Required: ${formData.visaRequired}`,
      ],
      tour: [
        "Tour package inquiry form",
        `City: ${formData.city}`,
        `Destination: ${formData.destination}`,
        `Travel Date: ${formData.travelDate}`,
        `Return Date: ${formData.returnDate}`,
        `Travelers: ${travelers}`,
        `Hotel Category: ${formData.hotelCategory}`,
        `Interested In: ${formData.interestedIn}`,
      ],
      ticket: [
        "Air ticket booking form",
        `Departure City: ${formData.departureCity}`,
        `Destination City: ${formData.destinationCity}`,
        `Departure Date: ${formData.travelDate}`,
        `Return Date: ${formData.returnDate || "Not provided"}`,
        `Passengers: ${travelers}`,
        `Preferred Airline: ${formData.preferredAirline || "Not provided"}`,
        `Class: ${formData.travelClass}`,
      ],
      visa: [
        "Visa application inquiry form",
        `City: ${formData.city}`,
        `Nationality: ${formData.nationality}`,
        `Destination Country: ${formData.destinationCountry}`,
        `Visa Type: ${formData.visaType}`,
        `Intended Travel Date: ${formData.travelDate}`,
        `Duration of Stay: ${formData.durationOfStay}`,
        `Number of Applicants: ${formData.numberOfApplicants}`,
        `Traveled Abroad Before: ${formData.traveledAbroadBefore}`,
        `Visa Refused Before: ${formData.visaRefusedBefore}`,
        `Current Occupation: ${formData.currentOccupation}`,
        `Monthly Income: ${formData.monthlyIncome}`,
        `Flight Booking Assistance: ${formData.flightBookingAssistance}`,
        `Hotel Booking Assistance: ${formData.hotelBookingAssistance}`,
      ],
      general: [
        "General inquiry",
        `Destination: ${formData.destination || "Not provided"}`,
        `Travel Date: ${formData.travelDate || "Not provided"}`,
        `Budget: ${formData.budget || "Not provided"}`,
        `Travelers: ${travelers}`,
      ],
    }

    return [
      defaultMessage,
      ...(serviceMessages[finalServiceType] || serviceMessages.general),
      "",
      formData.message
        ? `Additional Requirements: ${formData.message}`
        : "Additional Requirements: Not provided",
    ]
      .filter(Boolean)
      .join("\n")
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    setSuccess("")
    setError("")

    const validationMessage = validateForm()
    if (validationMessage) {
      setError(validationMessage)
      return
    }

    try {
      setLoading(true)

      const travelers = {
        adults: getNumber(formData.adults, 1),
        children: getNumber(formData.children, 0),
        infants: getNumber(formData.infants, 0),
      }

      const finalDestination = isTicket
        ? `${formData.departureCity.trim()} to ${formData.destinationCity.trim()}`
        : isVisa
          ? formData.destinationCountry.trim()
          : isUmrah
            ? "Umrah"
            : formData.destination.trim()

      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        serviceType: finalServiceType,
        source: finalSource,
        pageUrl: window.location.href,
        city: formData.city.trim(),
        nationality: formData.nationality.trim(),
        departureCity: formData.departureCity.trim(),
        destinationCity: formData.destinationCity.trim(),
        destinationCountry: formData.destinationCountry.trim(),
        destination: finalDestination,
        travelers,
        numberOfApplicants: getNumber(formData.numberOfApplicants, 1),
        travelDate: toIsoDate(formData.travelDate),
        returnDate: toIsoDate(formData.returnDate),
        durationOfStay: formData.durationOfStay.trim(),
        packageRequired: formData.packageRequired,
        hotelCategory: formData.hotelCategory,
        preferredHotel: formData.preferredHotel || formData.hotelCategory,
        visaRequired: formData.visaRequired,
        visaType: formData.visaType,
        interestedIn: formData.interestedIn,
        preferredAirline: formData.preferredAirline.trim(),
        travelClass: formData.travelClass,
        traveledAbroadBefore: formData.traveledAbroadBefore,
        visaRefusedBefore: formData.visaRefusedBefore,
        currentOccupation: formData.currentOccupation.trim(),
        monthlyIncome: formData.monthlyIncome.trim(),
        flightBookingAssistance: formData.flightBookingAssistance,
        hotelBookingAssistance: formData.hotelBookingAssistance,
        budget: formData.budget.trim(),
        makkahNights: isUmrah ? Number(formData.makkahNights) || 0 : 0,
        madinahNights: isUmrah ? Number(formData.madinahNights) || 0 : 0,
        additionalRequirements: formData.message.trim(),
        message: buildMessage(),
        companyWebsite: formData.companyWebsite,
      }

      if (isMongoObjectId(packageRef)) payload.packageRef = packageRef
      if (isMongoObjectId(tourRef)) payload.tourRef = tourRef
      if (isMongoObjectId(visaRef)) payload.visaRef = visaRef
      if (isMongoObjectId(hotelRef)) payload.hotelRef = hotelRef
      if (isMongoObjectId(carRentalRef)) payload.carRentalRef = carRentalRef

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
      <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-[5px] bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-5 py-4">
          <div>
            <p className="font-poppins text-xs font-semibold uppercase tracking-[0.08em] text-[#FF6B00]">
              TravelEx Inquiry
            </p>

            <h3 className="mt-1 font-fredoka text-2xl font-semibold text-slate-950">
              {formTitle}
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

          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Full Name *">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name"
                className={inputClass}
              />
            </Field>

            <Field label="Mobile / WhatsApp *">
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="03XXXXXXXXX"
                className={inputClass}
              />
            </Field>

            <Field label="Email Address *">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                className={inputClass}
              />
            </Field>
          </div>

          {(isUmrah || isTour || isVisa) && (
            <Field label="City *">
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Your city"
                className={inputClass}
              />
            </Field>
          )}

          {isUmrah && (
            <>
              <NumberFields formData={formData} handleChange={handleChange} />

              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Preferred Departure City *">
                  <input
                    type="text"
                    name="departureCity"
                    value={formData.departureCity}
                    onChange={handleChange}
                    placeholder="Karachi, Lahore..."
                    className={inputClass}
                  />
                </Field>

                <Field label="Preferred Departure Date *">
                  <input
                    type="date"
                    name="travelDate"
                    value={formData.travelDate}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </Field>

                <Field label="Duration of Stay *">
                  <input
                    type="text"
                    name="durationOfStay"
                    value={formData.durationOfStay}
                    onChange={handleChange}
                    placeholder="Example: 14 days"
                    className={inputClass}
                  />
                </Field>
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
                  value={formData.hotelCategory}
                  onChange={(value) => handleSelectChange("hotelCategory", value)}
                  placeholder="Select hotel"
                  options={hotelOptions}
                />

                <AppSelect
                  label="Visa Required? *"
                  value={formData.visaRequired}
                  onChange={(value) => handleSelectChange("visaRequired", value)}
                  placeholder="Select option"
                  options={yesNoOptions}
                />
              </div>
            </>
          )}

          {isTour && (
            <>
              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Destination *">
                  <input
                    type="text"
                    name="destination"
                    value={formData.destination}
                    onChange={handleChange}
                    placeholder="Destination"
                    className={inputClass}
                  />
                </Field>

                <Field label="Travel Date *">
                  <input
                    type="date"
                    name="travelDate"
                    value={formData.travelDate}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </Field>

                <Field label="Return Date *">
                  <input
                    type="date"
                    name="returnDate"
                    value={formData.returnDate}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </Field>
              </div>

              <NumberFields formData={formData} handleChange={handleChange} />

              <div className="grid gap-4 sm:grid-cols-2">
                <AppSelect
                  label="Hotel Category *"
                  value={formData.hotelCategory}
                  onChange={(value) => handleSelectChange("hotelCategory", value)}
                  placeholder="Select hotel"
                  options={hotelOptions}
                />

                <AppSelect
                  label="Interested In *"
                  value={formData.interestedIn}
                  onChange={(value) => handleSelectChange("interestedIn", value)}
                  placeholder="Select type"
                  options={interestedInOptions}
                />
              </div>
            </>
          )}

          {isTicket && (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Departure City *">
                  <input
                    type="text"
                    name="departureCity"
                    value={formData.departureCity}
                    onChange={handleChange}
                    placeholder="Departure city"
                    className={inputClass}
                  />
                </Field>

                <Field label="Destination City *">
                  <input
                    type="text"
                    name="destinationCity"
                    value={formData.destinationCity}
                    onChange={handleChange}
                    placeholder="Destination city"
                    className={inputClass}
                  />
                </Field>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Departure Date *">
                  <input
                    type="date"
                    name="travelDate"
                    value={formData.travelDate}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </Field>

                <Field label="Return Date">
                  <input
                    type="date"
                    name="returnDate"
                    value={formData.returnDate}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </Field>
              </div>

              <NumberFields formData={formData} handleChange={handleChange} />

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Preferred Airline">
                  <input
                    type="text"
                    name="preferredAirline"
                    value={formData.preferredAirline}
                    onChange={handleChange}
                    placeholder="Preferred airline"
                    className={inputClass}
                  />
                </Field>

                <AppSelect
                  label="Class *"
                  value={formData.travelClass}
                  onChange={(value) => handleSelectChange("travelClass", value)}
                  placeholder="Select class"
                  options={classOptions}
                />
              </div>
            </>
          )}

          {isVisa && (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Nationality *">
                  <input
                    type="text"
                    name="nationality"
                    value={formData.nationality}
                    onChange={handleChange}
                    placeholder="Nationality"
                    className={inputClass}
                  />
                </Field>

                <Field label="Destination Country *">
                  <input
                    type="text"
                    name="destinationCountry"
                    value={formData.destinationCountry}
                    onChange={handleChange}
                    placeholder="Destination country"
                    className={inputClass}
                  />
                </Field>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <AppSelect
                  label="Visa Type *"
                  value={formData.visaType}
                  onChange={(value) => handleSelectChange("visaType", value)}
                  placeholder="Select visa type"
                  options={visaTypeOptions}
                />

                <Field label="Intended Travel Date *">
                  <input
                    type="date"
                    name="travelDate"
                    value={formData.travelDate}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </Field>

                <Field label="Duration of Stay *">
                  <input
                    type="text"
                    name="durationOfStay"
                    value={formData.durationOfStay}
                    onChange={handleChange}
                    placeholder="Example: 15 days"
                    className={inputClass}
                  />
                </Field>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Number of Applicants *">
                  <input
                    type="number"
                    name="numberOfApplicants"
                    min="1"
                    value={formData.numberOfApplicants}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </Field>

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

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Current Occupation *">
                  <input
                    type="text"
                    name="currentOccupation"
                    value={formData.currentOccupation}
                    onChange={handleChange}
                    placeholder="Occupation"
                    className={inputClass}
                  />
                </Field>

                <Field label="Monthly Income *">
                  <input
                    type="text"
                    name="monthlyIncome"
                    value={formData.monthlyIncome}
                    onChange={handleChange}
                    placeholder="Monthly income"
                    className={inputClass}
                  />
                </Field>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <AppSelect
                  label="Flight Booking Assistance? *"
                  value={formData.flightBookingAssistance}
                  onChange={(value) => handleSelectChange("flightBookingAssistance", value)}
                  placeholder="Select option"
                  options={yesNoOptions}
                />

                <AppSelect
                  label="Hotel Booking Assistance? *"
                  value={formData.hotelBookingAssistance}
                  onChange={(value) => handleSelectChange("hotelBookingAssistance", value)}
                  placeholder="Select option"
                  options={yesNoOptions}
                />
              </div>
            </>
          )}

          {isGeneric && (
            <>
              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Destination">
                  <input
                    type="text"
                    name="destination"
                    value={formData.destination}
                    onChange={handleChange}
                    placeholder="Destination"
                    className={inputClass}
                  />
                </Field>

                <Field label="Travel Date">
                  <input
                    type="date"
                    name="travelDate"
                    value={formData.travelDate}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </Field>

                <Field label="Budget">
                  <input
                    type="text"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    placeholder="Budget"
                    className={inputClass}
                  />
                </Field>
              </div>

              <NumberFields formData={formData} handleChange={handleChange} />
            </>
          )}

          <Field label={isVisa ? "Additional Information / Requirements" : "Additional Requirements"}>
            <textarea
              rows="4"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Write your additional requirements..."
              className={`${inputClass} resize-none`}
            />
          </Field>

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
