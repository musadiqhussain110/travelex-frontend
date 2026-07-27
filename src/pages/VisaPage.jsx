import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "react-router-dom"
import {
  FaArrowRight,
  FaCheckCircle,
  FaClock,
  FaEnvelope,
  FaFileAlt,
  FaGlobeAsia,
  FaInfoCircle,
  FaMoneyBillWave,
  FaPassport,
  FaPhoneAlt,
  FaUser,
  FaWhatsapp,
} from "react-icons/fa"

import Footer from "../components/Footer"
import AppSelect from "../components/common/AppSelect"
import AppDatePicker from "../components/common/AppDatePicker"
import VisaApplicantProfileFields from "../components/common/VisaApplicantProfileFields"
import { isUnitedKingdomDestination } from "../utils/visaDestination"
import { publicApi } from "../services/publicApi"
import { getLeadSource } from "../utils/leadSourceTracker"
import { visaServices } from "../data/visaData"
import visaFormAsset from "../assets/visa/visa-form.png"

const whatsappNumber = "923111444192"

const visaTypeOptions = [
  "Tourist Visa",
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
  return new Date(value + "T00:00:00").toISOString()
}

const getVisaOptionLabel = (visa) => visa.country

const visaBannerAnimationStyles =
  "@keyframes bannerFadeUp {" +
  "from { opacity: 0; transform: translateY(16px); }" +
  "to { opacity: 1; transform: translateY(0); }" +
  "}" +
  "@keyframes bannerStampIn {" +
  "0% { opacity: 0; transform: scale(1.3) rotate(-3deg); }" +
  "60% { opacity: 1; transform: scale(0.96) rotate(0.5deg); }" +
  "100% { opacity: 1; transform: scale(1) rotate(0deg); }" +
  "}" +
  "@keyframes bannerFloat {" +
  "0%, 100% { transform: translateY(-50%); }" +
  "50% { transform: translateY(calc(-50% - 9px)); }" +
  "}" +
  ".visa-banner-asset {" +
  "animation: bannerFloat 4.5s ease-in-out infinite;" +
  "}" +
  "@media (prefers-reduced-motion: reduce) {" +
  ".visa-banner-asset, .banner-motion { animation: none !important; }" +
  "}"

const findVisaByQuery = (query) => {
  if (!query) return null

  const normalizedQuery = query.toLowerCase().trim()

  return visaServices.find((visa) => {
    const title = visa.title.toLowerCase()
    const country = visa.country.toLowerCase()
    const type = visa.type.toLowerCase()

    return (
      title.includes(normalizedQuery) ||
      country.includes(normalizedQuery) ||
      type.includes(normalizedQuery)
    )
  })
}

const VisaPage = () => {
  const [searchParams] = useSearchParams()
  const countryFromUrl = searchParams.get("country") || ""

  const matchedVisa = findVisaByQuery(countryFromUrl) || visaServices[0]

  const [selectedVisaId, setSelectedVisaId] = useState(matchedVisa.id)

  const selectedVisa =
    visaServices.find((visa) => visa.id === selectedVisaId) || visaServices[0]

  const visaOptionLabels = useMemo(
    function () {
      return visaServices.map(getVisaOptionLabel)
    },
    []
  )

  const visaOptionLookup = useMemo(
    function () {
      const lookup = {}

      visaServices.forEach(function (visa) {
        lookup[getVisaOptionLabel(visa)] = visa.id
      })

      return lookup
    },
    []
  )

  useEffect(
    function () {
      if (!countryFromUrl) return

      const matched = findVisaByQuery(countryFromUrl)

      if (matched) {
        setSelectedVisaId(matched.id)
      }
    },
    [countryFromUrl]
  )

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    city: "",
    nationality: "",
    destinationCountry: matchedVisa.country,
    visaType: "",
    intendedTravelDate: "",
    durationOfStay: "",
    numberOfApplicants: "1",
    traveledAbroadBefore: "",
    countriesTraveled: "",
    visaRefusedBefore: "",
    visaRefusalCountries: "",
    currentOccupation: "",
    monthlyIncome: "",
    yearlyIncome: "",
    otherOccupation: "",
    isSponsored: "",
    sponsorIncomeSource: "",
    numberOfFamilyMembers: "",
    availableFundsForVisit: "",
    hasFamilyOrFriendInUK: "",
    willProvideInvitationLetter: "",
    additionalRequirements: "",
    companyWebsite: "",
  })

  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const isUkDestination = isUnitedKingdomDestination(formData.destinationCountry)

  useEffect(
    function () {
      setFormData(function (prev) {
        const isUkDestination = isUnitedKingdomDestination(selectedVisa.country)

        return Object.assign({}, prev, {
          destinationCountry: selectedVisa.country,
          hasFamilyOrFriendInUK: isUkDestination
            ? prev.hasFamilyOrFriendInUK
            : "",
          willProvideInvitationLetter: isUkDestination
            ? prev.willProvideInvitationLetter
            : "",
        })
      })
    },
    [selectedVisa]
  )

  const handleChange = (event) => {
    const name = event.target.name
    const value = event.target.value

    setFormData(function (prev) {
      return Object.assign({}, prev, { [name]: value })
    })

    setError("")
  }

  const handleSelectChange = (name, value) => {
    setFormData(function (prev) {
      const next = Object.assign({}, prev, { [name]: value })

      if (name === "traveledAbroadBefore" && value !== "Yes") {
        next.countriesTraveled = ""
      }

      if (name === "visaRefusedBefore" && value !== "Yes") {
        next.visaRefusalCountries = ""
      }

      if (name === "currentOccupation") {
        next.monthlyIncome = ""
        next.yearlyIncome = ""
        next.otherOccupation = ""
        next.isSponsored = ""
        next.sponsorIncomeSource = ""
      }

      if (name === "isSponsored" && value !== "Yes") {
        next.sponsorIncomeSource = ""
      }

      if (name === "hasFamilyOrFriendInUK" && value !== "Yes") {
        next.willProvideInvitationLetter = ""
      }

      return next
    })

    setError("")
  }

  const handleVisaOptionChange = (label) => {
    const id = visaOptionLookup[label]

    if (id) {
      setSelectedVisaId(id)
      setSubmitted(false)
      setError("")
    }
  }

  const getWhatsappUrl = () => {
    const lines = [
      "Assalamualaikum TravelEx,",
      "",
      "I want to submit a visa application inquiry.",
      "",
      "Full Name: " + formData.fullName,
      "Mobile / WhatsApp: " + formData.phone,
      "Email Address: " + (formData.email || "Not provided"),
      "City: " + formData.city,
      "Nationality: " + formData.nationality,
      "Destination Country: " + formData.destinationCountry,
      "Visa Type: " + formData.visaType,
      "Intended Travel Date: " + (formData.intendedTravelDate || "Not decided"),
      "Duration of Stay: " + (formData.durationOfStay || "Not provided"),
      "Number of Applicants: " + formData.numberOfApplicants,
      "Traveled Abroad Before: " + (formData.traveledAbroadBefore || "Not selected"),
      formData.traveledAbroadBefore === "Yes"
        ? "Countries Traveled: " + formData.countriesTraveled
        : null,
      "Visa Refused Before: " + (formData.visaRefusedBefore || "Not selected"),
      formData.visaRefusedBefore === "Yes"
        ? "Countries Where Visa Was Refused: " + formData.visaRefusalCountries
        : null,
      "Current Occupation: " + (formData.currentOccupation || "Not provided"),
      formData.currentOccupation === "Employment"
        ? "Monthly Income: " + formData.monthlyIncome
        : null,
      formData.currentOccupation === "Business"
        ? "Yearly Income: " + formData.yearlyIncome
        : null,
      formData.currentOccupation === "Others"
        ? "Occupation Details: " + formData.otherOccupation
        : null,
      formData.currentOccupation === "Student" || formData.currentOccupation === "Others"
        ? "Sponsored: " + formData.isSponsored
        : null,
      formData.isSponsored === "Yes"
        ? "Income Source of Sponsor: " + formData.sponsorIncomeSource
        : null,
      "Number of Family Members: " + formData.numberOfFamilyMembers,
      "Available Funds for Visit: " + formData.availableFundsForVisit,
      isUkDestination
        ? "Family or Friend in the UK: " + formData.hasFamilyOrFriendInUK
        : null,
      isUkDestination && formData.hasFamilyOrFriendInUK === "Yes"
        ? "Will Provide Invitation Letter: " + formData.willProvideInvitationLetter
        : null,
      "",
      "Additional Information / Requirements:",
      formData.additionalRequirements || "No additional information",
    ]

    const message = lines.filter(Boolean).join("\n")

    return "https://wa.me/" + whatsappNumber + "?text=" + encodeURIComponent(message)
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

    if (!formData.city.trim()) {
      setError("Please enter your city.")
      return
    }

    if (!formData.nationality.trim()) {
      setError("Please enter your nationality.")
      return
    }

    if (!formData.destinationCountry.trim()) {
      setError("Please select destination country.")
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

    if (formData.traveledAbroadBefore === "Yes" && !formData.countriesTraveled.trim()) {
      setError("Please list the countries you have traveled to.")
      return
    }

    if (!formData.visaRefusedBefore) {
      setError("Please select whether you have been refused a visa before.")
      return
    }

    if (formData.visaRefusedBefore === "Yes" && !formData.visaRefusalCountries.trim()) {
      setError("Please list the countries where your visa was refused.")
      return
    }

    if (!formData.currentOccupation) {
      setError("Please select current occupation.")
      return
    }

    if (formData.currentOccupation === "Employment" && !formData.monthlyIncome.trim()) {
      setError("Please enter monthly income.")
      return
    }

    if (formData.currentOccupation === "Business" && !formData.yearlyIncome.trim()) {
      setError("Please enter yearly income.")
      return
    }

    if (formData.currentOccupation === "Others" && !formData.otherOccupation.trim()) {
      setError("Please specify your occupation.")
      return
    }

    if (
      (formData.currentOccupation === "Student" || formData.currentOccupation === "Others") &&
      !formData.isSponsored
    ) {
      setError("Please select whether the applicant is sponsored.")
      return
    }

    if (formData.isSponsored === "Yes" && !formData.sponsorIncomeSource.trim()) {
      setError("Please enter the income source of the sponsor.")
      return
    }

    if (
      formData.numberOfFamilyMembers === "" ||
      Number(formData.numberOfFamilyMembers) < 0
    ) {
      setError("Please enter the number of family members.")
      return
    }

    if (!formData.availableFundsForVisit.trim()) {
      setError("Please enter the available funds for the visit.")
      return
    }

    if (isUkDestination && !formData.hasFamilyOrFriendInUK) {
      setError("Please select whether you have family or a friend in the UK.")
      return
    }

    if (
      isUkDestination &&
      formData.hasFamilyOrFriendInUK === "Yes" &&
      !formData.willProvideInvitationLetter
    ) {
      setError("Please select whether they will provide an invitation letter.")
      return
    }

    try {
      setLoading(true)

      const applicants = Math.max(1, Number(formData.numberOfApplicants) || 1)
      const leadSource = getLeadSource()

      const messageLines = [
        "Visa application inquiry",
        "",
        "Full Name: " + formData.fullName,
        "Mobile / WhatsApp: " + formData.phone,
        "Email Address: " + (formData.email || "Not provided"),
        "City: " + formData.city,
        "Nationality: " + formData.nationality,
        "Destination Country: " + formData.destinationCountry,
        "Visa Type: " + formData.visaType,
        "Intended Travel Date: " + formData.intendedTravelDate,
        "Duration of Stay: " + formData.durationOfStay,
        "Number of Applicants: " + applicants,
        "Have You Traveled Abroad Before?: " + formData.traveledAbroadBefore,
        formData.traveledAbroadBefore === "Yes"
          ? "Countries Traveled: " + formData.countriesTraveled
          : null,
        "Have You Been Refused a Visa Before?: " + formData.visaRefusedBefore,
        formData.visaRefusedBefore === "Yes"
          ? "Countries Where Visa Was Refused: " + formData.visaRefusalCountries
          : null,
        "Current Occupation: " + formData.currentOccupation,
        formData.currentOccupation === "Employment"
          ? "Monthly Income: " + formData.monthlyIncome
          : null,
        formData.currentOccupation === "Business"
          ? "Yearly Income: " + formData.yearlyIncome
          : null,
        formData.currentOccupation === "Others"
          ? "Occupation Details: " + formData.otherOccupation
          : null,
        formData.currentOccupation === "Student" || formData.currentOccupation === "Others"
          ? "Sponsored: " + formData.isSponsored
          : null,
        formData.isSponsored === "Yes"
          ? "Income Source of Sponsor: " + formData.sponsorIncomeSource
          : null,
        "Number of Family Members: " + formData.numberOfFamilyMembers,
        "Available Funds for Visit: " + formData.availableFundsForVisit,
        isUkDestination
          ? "Family or Friend in the UK: " + formData.hasFamilyOrFriendInUK
          : null,
        isUkDestination && formData.hasFamilyOrFriendInUK === "Yes"
          ? "Will Provide Invitation Letter: " + formData.willProvideInvitationLetter
          : null,
        "",
        formData.additionalRequirements
          ? "Additional Information / Requirements: " + formData.additionalRequirements
          : "Additional Information / Requirements: Not provided",
      ]

      const message = messageLines.filter(Boolean).join("\n")

      const payload = {
        name: formData.fullName.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),

        serviceType: "visa",
        source: "visa-page",
        leadSource: leadSource,
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
          childAges: [],
        },

        traveledAbroadBefore: formData.traveledAbroadBefore,
        countriesTraveled: formData.countriesTraveled.trim(),
        visaRefusedBefore: formData.visaRefusedBefore,
        visaRefusalCountries: formData.visaRefusalCountries.trim(),
        currentOccupation: formData.currentOccupation,
        monthlyIncome: formData.monthlyIncome.trim(),
        yearlyIncome: formData.yearlyIncome.trim(),
        otherOccupation: formData.otherOccupation.trim(),
        isSponsored: formData.isSponsored,
        sponsorIncomeSource: formData.sponsorIncomeSource.trim(),
        numberOfFamilyMembers: Number(formData.numberOfFamilyMembers),
        availableFundsForVisit: formData.availableFundsForVisit.trim(),
        hasFamilyOrFriendInUK: isUkDestination
          ? formData.hasFamilyOrFriendInUK
          : undefined,
        willProvideInvitationLetter: isUkDestination
          ? formData.willProvideInvitationLetter
          : undefined,
        additionalRequirements: formData.additionalRequirements.trim(),

        message: message,
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
      {/* Advertisement Banner */}
      <section className="relative pt-3 sm:pt-5">
        <div className="mx-auto max-w-[920px] px-4 sm:px-6 lg:px-8">
          <div className="relative min-h-[96px] overflow-hidden rounded-[14px] bg-white px-3.5 py-3.5 shadow-[0_10px_34px_rgba(11,42,74,0.08)] sm:min-h-[150px] sm:rounded-[18px] sm:px-8 sm:py-5 lg:min-h-[170px]">
            <style>{visaBannerAnimationStyles}</style>

            <div className="pointer-events-none absolute -right-10 -top-16 hidden h-64 w-64 rounded-full bg-[#00AEEF]/10 blur-3xl sm:block"></div>
            <div className="pointer-events-none absolute -bottom-16 right-24 hidden h-40 w-40 rounded-full bg-[#FF6B00]/10 blur-3xl sm:block"></div>

            <div className="absolute inset-y-0 left-0 z-10 flex w-[70%] items-center px-3.5 py-3 sm:w-[72%] sm:px-8 sm:py-6 lg:w-[70%]">
                 <div className="w-full">
                   <p
                     className="banner-motion mb-1 flex items-center gap-1 whitespace-nowrap font-poppins text-[6px] font-bold uppercase leading-tight tracking-[0.05em] text-[#00AEEF] sm:mb-3 sm:gap-2 sm:whitespace-normal sm:text-[14px] sm:tracking-[0.22em]"
                     style={{ animation: "bannerFadeUp 0.6s ease-out both" }}
                   >
                     <span className="inline-block h-[1.5px] w-3 shrink-0 bg-[#FF6B00] sm:h-[2px] sm:w-8"></span>
                     Visa Approvals Made Simple
                   </p>
           <h2
             className="banner-motion flex flex-nowrap items-center justify-start gap-[3px] whitespace-nowrap font-fredoka max-sm:!text-[20px] font-semibold uppercase leading-[1.05] tracking-[-0.04em] text-slate-950 sm:gap-3 sm:text-[34px] sm:tracking-wide lg:text-[38px]"
             style={{ animation: "bannerFadeUp 0.6s ease-out 0.15s both" }}
           >
             <span className="whitespace-nowrap">Apply.</span>
             <span
               className="banner-motion whitespace-nowrap rounded-[3px] bg-[#FF6B00] px-1.5 py-0.5 leading-none tracking-[-0.03em] text-white shadow-sm sm:rounded-[6px] sm:px-4 sm:py-1.5 sm:tracking-wide"
               style={{ animation: "bannerStampIn 0.9s ease-out 0.3s both" }}
             >
               Approve.
             </span>
             <span className="whitespace-nowrap">Travel.</span>
           </h2>
                 </div>
               </div>
           
               <img
                 src={visaFormAsset}
                 alt="Visa application illustration"
                 className="visa-banner-asset pointer-events-none absolute right-0 top-[calc(50%+40px)] z-0 block h-[74px] w-auto -translate-y-1/2 object-contain sm:right-5 sm:top-[calc(50%+95px)] sm:h-[170px] lg:right-7 lg:top-[calc(50%+105px)] lg:h-[190px]"
               />
             </div>
           </div>
      </section>

      {/* Destination Selector + Details + Form */}
      <section className="bg-[#F8FAFC] pb-8 pt-3 sm:pb-14 sm:pt-5">
        <div className="mx-auto max-w-[920px] px-4 sm:px-6 lg:px-8">
          {/* Destination Dropdown */}
          <div className="rounded-[12px] border border-slate-100 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.06)] sm:p-7">
            <p className="mb-1.5 font-poppins text-[8.5px] font-bold uppercase tracking-[0.24em] text-[#00AEEF] sm:mb-2 sm:text-[12px] sm:tracking-[0.18em]">
              Destinations
            </p>

            <h2 className="font-fredoka text-[20px] font-semibold leading-[1.08] text-slate-950 sm:text-[30px]">
              Select your destination
            </h2>

            <p className="mt-1.5 font-poppins text-[10.5px] font-medium leading-5 text-slate-600 sm:mt-2 sm:text-sm sm:leading-7">
              Choose a country to view visa fee, processing time and document
              checklist.
            </p>

            <div className="mt-3 sm:mt-5">
              <AppSelect
                label="Destination Country *"
                value={getVisaOptionLabel(selectedVisa)}
                onChange={handleVisaOptionChange}
                placeholder="Select destination"
                options={visaOptionLabels}
              />
            </div>
          </div>

          {/* Visa Details */}
          <div className="mt-4 rounded-[12px] border border-slate-100 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.06)] sm:mt-6 sm:p-7">
            <p className="mb-1.5 font-poppins text-[8.5px] font-bold uppercase tracking-[0.24em] text-[#00AEEF] sm:mb-2 sm:text-[12px] sm:tracking-[0.18em]">
              {selectedVisa.type}
            </p>

            <h3 className="font-fredoka text-[20px] font-semibold leading-[1.08] text-slate-950 sm:text-[30px]">
              {selectedVisa.title}
            </h3>

            <p className="mt-1.5 font-poppins text-[10.5px] font-medium leading-5 text-slate-600 sm:mt-2 sm:text-sm sm:leading-7">
              Quick checklist for {selectedVisa.country}.
            </p>

            <div className="mt-3 grid gap-2 sm:mt-5 sm:grid-cols-3 sm:gap-3">
              <div className="rounded-[5px] bg-[#F8FAFC] p-3.5 sm:p-4">
                <FaMoneyBillWave className="text-lg text-[#00AEEF] sm:text-xl" />

                <p className="mt-2 font-poppins text-[8px] font-bold uppercase tracking-[0.16em] text-slate-400 sm:mt-3 sm:text-[10px]">
                  {selectedVisa.feeTitle}
                </p>

                <p className="mt-1 font-poppins text-xs font-semibold leading-5 text-slate-950 sm:text-sm sm:leading-6">
                  {selectedVisa.fee}
                </p>
              </div>

              <div className="rounded-[5px] bg-[#F8FAFC] p-3.5 sm:p-4">
                <FaClock className="text-lg text-[#00AEEF] sm:text-xl" />

                <p className="mt-2 font-poppins text-[8px] font-bold uppercase tracking-[0.16em] text-slate-400 sm:mt-3 sm:text-[10px]">
                  Processing Time
                </p>

                <p className="mt-1 font-poppins text-xs font-semibold leading-5 text-slate-950 sm:text-sm sm:leading-6">
                  {selectedVisa.processingTime}
                </p>
              </div>

              <div className="rounded-[5px] bg-[#F8FAFC] p-3.5 sm:p-4">
                <FaPassport className="text-lg text-[#00AEEF] sm:text-xl" />

                <p className="mt-2 font-poppins text-[8px] font-bold uppercase tracking-[0.16em] text-slate-400 sm:mt-3 sm:text-[10px]">
                  Country
                </p>

                <p className="mt-1 font-poppins text-xs font-semibold leading-5 text-slate-950 sm:text-sm sm:leading-6">
                  {selectedVisa.country}
                </p>
              </div>
            </div>

            <p className="mt-4 font-poppins text-[8.5px] font-bold uppercase tracking-[0.16em] text-slate-400 sm:mt-6 sm:text-[10px]">
              Required Documents
            </p>

            <div className="mt-2 grid gap-2 sm:grid-cols-2 sm:gap-3">
              {selectedVisa.documents.map((document) => (
                <div
                  key={document}
                  className="flex items-start gap-2.5 rounded-[5px] bg-[#F8FAFC] px-3.5 py-2.5 sm:gap-3 sm:px-4 sm:py-3"
                >
                  <FaCheckCircle className="mt-1 shrink-0 text-[12px] text-[#00AEEF] sm:text-base" />

                  <p className="font-poppins text-[11px] font-semibold leading-5 text-slate-700 sm:text-sm sm:leading-6">
                    {document}
                  </p>
                </div>
              ))}
            </div>

            {selectedVisa.details?.length > 0 && (
              <>
                <p className="mt-4 font-poppins text-[8.5px] font-bold uppercase tracking-[0.16em] text-slate-400 sm:mt-6 sm:text-[10px]">
                  Additional Details
                </p>

                <div className="mt-2 grid gap-2 sm:gap-3">
                  {selectedVisa.details.map((detail) => (
                    <div
                      key={detail}
                      className="flex items-start gap-2.5 rounded-[5px] bg-[#F8FAFC] px-3.5 py-2.5 sm:gap-3 sm:px-4 sm:py-3"
                    >
                      <FaFileAlt className="mt-1 shrink-0 text-[12px] text-[#FF6B00] sm:text-base" />

                      <p className="font-poppins text-[11px] font-semibold leading-5 text-slate-700 sm:text-sm sm:leading-6">
                        {detail}
                      </p>
                    </div>
                  ))}
                </div>
              </>
            )}

            <div className="mt-4 flex items-start gap-2.5 rounded-[5px] border border-[#FF6B00]/15 bg-orange-50 p-3.5 sm:mt-6 sm:gap-3 sm:p-4">
              <FaInfoCircle className="mt-1 shrink-0 text-sm text-[#FF6B00] sm:text-base" />

              <p className="font-poppins text-[11px] font-semibold leading-5 text-orange-800 sm:text-sm sm:leading-7">
                Visa charges and requirements may change. Contact TravelEx
                before final submission.
              </p>
            </div>
          </div>

          {/* Application Form */}
          <form
            onSubmit={handleSubmit}
            className="mt-4 rounded-[5px] border border-slate-100 bg-white p-4 shadow-[0_16px_45px_rgba(15,23,42,0.08)] sm:mt-6 sm:p-8"
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
              <div className="mb-1.5 flex items-center gap-2 sm:mb-2 sm:gap-2.5">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#00AEEF]/10 text-xs text-[#00AEEF] sm:h-8 sm:w-8 sm:text-sm">
                  <FaPassport />
                </span>

                <p className="font-poppins text-[8.5px] font-bold uppercase tracking-[0.08em] text-[#00AEEF] sm:text-[12px]">
                  Visa Application Inquiry Form
                </p>
              </div>

              <h2 className="font-fredoka text-[22px] font-semibold leading-tight text-slate-950 sm:text-[36px]">
                Applicant details
              </h2>

              <p className="mt-1.5 font-poppins text-[10.5px] font-medium leading-5 text-slate-600 sm:mt-2 sm:text-sm sm:leading-7">
                Applying for{" "}
                <span className="font-bold text-slate-900">
                  {selectedVisa.title}
                </span>{" "}
                — {selectedVisa.country}. Fill the required details below.
              </p>
            </div>

            {error ? (
              <p className="mb-4 rounded-[5px] bg-red-50 px-4 py-3 font-poppins text-[11.5px] font-semibold leading-5 text-red-600 sm:text-sm">
                {error}
              </p>
            ) : null}

            {submitted ? (
              <div className="mb-4 rounded-[5px] border border-green-100 bg-green-50 p-4 sm:p-5">
                <div className="flex items-start gap-3">
                  <FaCheckCircle className="mt-1 shrink-0 text-green-600" />

                  <div>
                    <h3 className="font-fredoka text-[20px] font-semibold leading-tight text-green-800 sm:text-[24px]">
                      Visa inquiry submitted
                    </h3>

                    <p className="mt-1.5 font-poppins text-[11.5px] font-medium leading-5 text-green-700 sm:text-sm sm:leading-7">
                      Your visa application inquiry has been saved. Our
                      consultant will contact you soon.
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
            ) : null}

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
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
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
            </div>

            <div className="mt-4 rounded-[5px] bg-[#F8FAFC] px-3.5 py-2.5 sm:px-4 sm:py-3">
              <p className="flex items-center gap-2 font-poppins text-[11px] font-semibold text-slate-600 sm:text-sm">
                <FaGlobeAsia className="shrink-0 text-[#00AEEF]" />
                Applying for <span className="font-bold text-slate-900">{formData.visaType || "Select visa type below"}</span> —{" "}
                <span className="font-bold text-slate-900">{formData.destinationCountry}</span>
                <span className="ml-1 font-poppins text-[10px] font-medium text-slate-400">
                  (change destination above)
                </span>
              </p>
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

            {(formData.traveledAbroadBefore === "Yes" ||
              formData.visaRefusedBefore === "Yes") && (
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {formData.traveledAbroadBefore === "Yes" && (
                  <div>
                    <label className={labelClass}>Countries Traveled *</label>
                    <input
                      type="text"
                      name="countriesTraveled"
                      value={formData.countriesTraveled}
                      onChange={handleChange}
                      placeholder="Example: UAE, Saudi Arabia, Turkey"
                      className={inputClass}
                    />
                  </div>
                )}

                {formData.visaRefusedBefore === "Yes" && (
                  <div>
                    <label className={labelClass}>Countries Where Visa Was Refused *</label>
                    <input
                      type="text"
                      name="visaRefusalCountries"
                      value={formData.visaRefusalCountries}
                      onChange={handleChange}
                      placeholder="Example: UK, USA, Canada"
                      className={inputClass}
                    />
                  </div>
                )}
              </div>
            )}

            <VisaApplicantProfileFields
              formData={formData}
              onChange={handleChange}
              onSelectChange={handleSelectChange}
              inputClass={inputClass}
              labelClass={labelClass}
              className="mt-4"
            />

            <div className="mt-4">
              <label className={labelClass}>
                Additional Information / Requirements
              </label>

              <textarea
                rows="4"
                name="additionalRequirements"
                value={formData.additionalRequirements}
                onChange={handleChange}
                placeholder="Write any extra visa information, family details, document concerns, or special requirements..."
                className="min-h-[130px] w-full resize-none rounded-[5px] border border-slate-200 bg-white px-3 py-3 font-poppins text-xs font-semibold leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#00AEEF] focus:ring-2 focus:ring-[#00AEEF]/10 sm:min-h-[150px] sm:px-4 sm:text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-[5px] bg-[#FF6B00] px-6 py-3.5 font-poppins text-sm font-semibold text-white transition hover:bg-[#00AEEF] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Submitting..." : "Submit Visa Inquiry"}
              {!loading && <FaArrowRight className="text-xs" />}
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </main>
  )
}

export default VisaPage