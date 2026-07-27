import { useMemo, useRef, useState } from "react"
import { Link, useParams } from "react-router-dom"
import {
  FaArrowLeft,
  FaArrowRight,
  FaBed,
  FaCheckCircle,
  FaEnvelope,
  FaHotel,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaUser,
} from "react-icons/fa"

import Footer from "../components/Footer"
import AppSelect from "../components/common/AppSelect"
import AppDatePicker from "../components/common/AppDatePicker"
import ChildAgeFields from "../components/common/ChildAgeFields"
import { publicApi } from "../services/publicApi"
import {
  getChildAgesError,
  getChildCount,
  normalizeChildAges,
  resizeChildAges,
} from "../utils/travelerForm"
import { getLeadSource } from "../utils/leadSourceTracker"

import hotelHero2 from "../assets/Hotels/custom-hotel-optimized.webp"
import hotelHero3 from "../assets/Hotels/Hotel5-optimized.webp"
import hotelHero4 from "../assets/Hotels/makkahHotel4-optimized.webp"
import hotelFormAsset from "../assets/Hotels/hotel-form.png"

const hotels = [
  {
    id: "marriott-hotel",
    name: "Custom Hotel Request",
    location: "Any city, destination, or hotel of your choice",
    price: "Custom quote available",
    image: hotelHero2,
    stars: "Custom",
    type: "Custom Hotel",
    isCustomHotel: true,
    shortDescription:
      "Tell TravelEx your preferred hotel name, city, dates, guests, room type, and budget. Our team will check availability and share a custom quote.",
    overview:
      "This option is for travelers who already have a preferred hotel in mind or want TravelEx to find a suitable stay based on their destination, budget, travel dates, number of guests, and room preference. Submit your hotel requirements and our consultant will guide you with availability, final price, and booking process.",
    highlights: [
      "Choose any hotel of your own choice",
      "Custom quote based on your dates",
      "Room type and category guidance",
      "Availability checked before confirmation",
    ],
    facilities: [
      "Custom Hotel Search",
      "Budget-Based Options",
      "Family Stay Guidance",
      "Consultant Support",
    ],
    note:
      "Final hotel price depends on your selected hotel, destination, travel dates, room type, meal plan, number of guests, availability, and supplier policy.",
  },
  {
    id: "family-stay-hotel",
    name: "Family Stay Hotel",
    location: "Makkah / Madinah options",
    price: "Custom quote available",
    image: hotelHero4,
    stars: 4,
    type: "Family Stay",
    shortDescription:
      "A family-friendly hotel option for Umrah travelers who need room sharing, flexible stay, and hotel guidance near Haram areas.",
    overview:
      "This option is designed for families and Umrah travelers who need hotel support in Makkah and Madinah. TravelEx can guide you with hotel distance, room sharing, family rooms, and availability according to your travel dates.",
    highlights: [
      "Family-friendly stay options",
      "Makkah and Madinah guidance",
      "Room sharing support",
      "Near Haram options on request",
    ],
    facilities: ["Family Rooms", "Near Haram Options", "Flexible Stay"],
    note:
      "Hotel distance, room type, and price depend on selected dates, availability, and preferred hotel category.",
  },
  {
    id: "budget-hotel-options",
    name: "Budget Hotel Options",
    location: "Dubai / Turkey / Baku",
    price: "Based on travel dates",
    image: hotelHero3,
    stars: 5,
    type: "International Stay",
    shortDescription:
      "International hotel options for travelers looking for budget-friendly stays in popular destinations with TravelEx assistance.",
    overview:
      "This hotel option is suitable for international travelers looking for stay support in destinations such as Dubai, Turkey, Baku, and other travel locations. TravelEx can help with destination-based hotel recommendations and quote confirmation.",
    highlights: [
      "International hotel support",
      "Budget-based hotel guidance",
      "Custom stay recommendations",
      "Quote based on destination and dates",
    ],
    facilities: ["Breakfast Options", "Consultant Support", "Flexible Budget"],
    note:
      "Final price depends on destination, travel season, room type, hotel category, number of guests, and supplier availability.",
  },
]

const roomTypeOptions = ["Standard", "Suite", "Apartment"]

const hotelCategoryOptions = ["3 Star", "4 Star", "5 Star"]

const labelClass =
  "mb-1.5 block font-poppins text-[9px] font-bold uppercase tracking-[0.08em] text-slate-400 sm:mb-2 sm:text-xs"

const inputClass =
  "h-11 w-full rounded-[5px] border border-slate-200 bg-white px-3 font-poppins text-xs font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#00AEEF] focus:ring-2 focus:ring-[#00AEEF]/10 sm:h-12 sm:px-4 sm:text-sm"

const iconInputClass =
  "h-11 w-full rounded-[5px] border border-slate-200 bg-white pl-10 pr-3 font-poppins text-xs font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#00AEEF] focus:ring-2 focus:ring-[#00AEEF]/10 sm:h-12 sm:pl-11 sm:pr-4 sm:text-sm"

const checkboxLabelClass =
  "flex h-11 items-center gap-2.5 rounded-[5px] border border-slate-200 bg-white px-3 font-poppins text-xs font-semibold text-slate-700 transition hover:border-[#00AEEF]/40 sm:h-12 sm:px-4 sm:text-sm"

const getInitialBooking = () => ({
  fullName: "",
  phone: "",
  email: "",
  city: "",

  destination: "",
  hotelName: "",

  checkInDate: "",
  checkOutDate: "",

  adults: "",
  children: "",
  childAges: [],

  rooms: "",
  roomType: "",
  hotelCategory: "",

  breakfastIncluded: false,
  airportTransfer: false,

  additionalRequirements: "",
  companyWebsite: "",
})

const parseDateInput = (value) => {
  if (!value) return null

  const cleanValue = value.trim()

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

const getDateIso = (value) => {
  const date = parseDateInput(value)
  return date ? date.toISOString() : undefined
}

const getNights = (checkIn, checkOut) => {
  const startDate = parseDateInput(checkIn)
  const endDate = parseDateInput(checkOut)

  if (!startDate || !endDate) return "-"

  const difference = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  )

  return difference > 0 ? difference : "-"
}

const getCategoryLabel = (hotel) => {
  return hotel?.isCustomHotel ? "Custom" : `${hotel?.stars || "-"} Star`
}

const bannerAnimationStyles =
  ".hotel-banner-asset{animation:hotelBannerFloat 4.5s ease-in-out infinite}" +
  "@keyframes hotelBannerFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}" +
  "@media (prefers-reduced-motion: reduce){.hotel-banner-asset{animation:none}}"

const HotelDetailsPage = () => {
  const { id } = useParams()
  const bookingFormRef = useRef(null)

  const hotel = hotels.find((item) => item.id === id)

  const [formError, setFormError] = useState("")
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [bookingRef] = useState(
    () => `TXH-${Math.floor(100000 + Math.random() * 900000)}`
  )
  const [booking, setBooking] = useState(() => getInitialBooking())

  const nights = useMemo(() => {
    return getNights(booking.checkInDate, booking.checkOutDate)
  }, [booking.checkInDate, booking.checkOutDate])

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target

    setBooking((prev) => {
      if (name === "children") {
        return {
          ...prev,
          children: value,
          childAges: resizeChildAges(prev.childAges, value),
        }
      }

      return {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }
    })

    setFormError("")
    setSuccess(false)
  }

  const handleChildAgeChange = (index, value) => {
    setBooking((prev) => ({
      ...prev,
      childAges: prev.childAges.map((age, ageIndex) =>
        ageIndex === index ? value : age
      ),
    }))

    setFormError("")
    setSuccess(false)
  }

  const handleSelectChange = (name, value) => {
    setBooking((prev) => ({
      ...prev,
      [name]: value,
    }))

    setFormError("")
    setSuccess(false)
  }

  const validateForm = () => {
    if (!booking.fullName.trim()) return "Please enter full name."
    if (!booking.phone.trim()) return "Please enter mobile / WhatsApp number."
    if (!booking.city.trim()) return "Please enter your city."
    if (!booking.destination.trim()) return "Please enter destination city/country."
    if (!booking.checkInDate) return "Please select check-in date."
    if (!booking.checkOutDate) return "Please select check-out date."

    if (nights === "-") {
      return "Check-out date must be after check-in date."
    }

    if (!booking.adults || Number(booking.adults) < 1) {
      return "Please enter number of adults."
    }

    if (Number(booking.children) < 0) {
      return "Children cannot be negative."
    }

    const childAgesError = getChildAgesError(
      booking.childAges,
      booking.children
    )

    if (childAgesError) return childAgesError

    if (!booking.rooms || Number(booking.rooms) < 1) {
      return "Please enter number of rooms."
    }

    if (!booking.roomType) return "Please select room type."
    if (!booking.hotelCategory) return "Please select hotel category."

    return ""
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setFormError("")
    setSuccess(false)

    const validationError = validateForm()

    if (validationError) {
      setFormError(validationError)
      return
    }

    try {
      setLoading(true)

      const adults = Math.max(1, Number(booking.adults) || 1)
      const children = getChildCount(booking.children)
      const childAges = normalizeChildAges(booking.childAges, children)
      const rooms = Math.max(1, Number(booking.rooms) || 1)
      const guests = adults + children
      const leadSource = getLeadSource()

      const selectedHotelName =
        booking.hotelName.trim() || hotel?.name || "Not specified"

      const specialRequests = [
        booking.breakfastIncluded ? "Breakfast Included" : "",
        booking.airportTransfer ? "Airport Transfer" : "",
      ]
        .filter(Boolean)
        .join(", ")

      const finalAdditionalRequirements = [
        specialRequests,
        booking.additionalRequirements.trim(),
      ]
        .filter(Boolean)
        .join("\n")

      const message = [
        "Hotel Booking Inquiry",
        `Booking Reference: ${bookingRef}`,
        "",
        "Selected Hotel Page",
        `Hotel Page: ${hotel?.name || "Not specified"}`,
        `Hotel Location: ${hotel?.location || "Not specified"}`,
        `Hotel Type: ${hotel?.type || "Not specified"}`,
        `Hotel Category From Page: ${getCategoryLabel(hotel)}`,
        `Displayed Quote: ${hotel?.price || "Not specified"}`,
        "",
        "Personal Information",
        `Full Name: ${booking.fullName}`,
        `Mobile / WhatsApp: ${booking.phone}`,
        `Email Address: ${booking.email || "Not provided"}`,
        `City: ${booking.city}`,
        "",
        "Hotel Requirements",
        `Destination: ${booking.destination}`,
        `Hotel Name If Any: ${booking.hotelName || "Not provided"}`,
        `Check-in Date: ${booking.checkInDate}`,
        `Check-out Date: ${booking.checkOutDate}`,
        `Number of Nights: ${nights}`,
        "",
        "Guests",
        `Adults: ${adults}`,
        `Children: ${children}`,
        childAges.length ? `Child Ages: ${childAges.join(", ")}` : null,
        `Total Guests: ${guests}`,
        "",
        "Room Requirements",
        `Number of Rooms: ${rooms}`,
        `Room Type: ${booking.roomType}`,
        `Hotel Category: ${booking.hotelCategory}`,
        "",
        `Special Requests: ${specialRequests || "None"}`,
        "",
        booking.additionalRequirements
          ? `Additional Requirements: ${booking.additionalRequirements}`
          : "Additional Requirements: Not provided",
      ].filter(Boolean).join("\n")

      const payload = {
        name: booking.fullName.trim(),
        phone: booking.phone.trim(),
        email: booking.email.trim(),

        serviceType: "hotel",
        source: "hotel-page",
        leadSource,
        pageUrl: window.location.href,

        city: booking.city.trim(),
        destination: booking.destination.trim(),
        destinationCity: booking.destination.trim(),

        preferredHotel: selectedHotelName,
        hotelCategory: booking.hotelCategory,

        checkInDate: getDateIso(booking.checkInDate),
        checkOutDate: getDateIso(booking.checkOutDate),
        travelDate: getDateIso(booking.checkInDate),
        returnDate: getDateIso(booking.checkOutDate),

        durationOfStay: `${nights} nights`,

        travelers: {
          adults,
          children,
          childAges,
        },

        numberOfGuests: guests,
        numberOfRooms: rooms,

        roomType: booking.roomType,
        mealPlan: booking.breakfastIncluded ? "Breakfast Included" : "Room Only",

        bookingReference: bookingRef,
        additionalRequirements: finalAdditionalRequirements,

        message,
        priority: "high",
        companyWebsite: booking.companyWebsite,
      }

      await publicApi.createLead(payload)

      setSuccess(true)

      bookingFormRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })

      setBooking(getInitialBooking())
    } catch (err) {
      console.error("Hotel booking lead error:", err)
      setFormError(
        err.message ||
          "We could not submit your hotel booking request right now. Please try again."
      )
    } finally {
      setLoading(false)
    }
  }

  if (!hotel) {
    return (
      <main className="bg-[#F8FAFC]">
        <section className="bg-[#F8FAFC] px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-[1180px]">
            <div className="rounded-[5px] border border-slate-100 bg-white p-5 text-center shadow-[0_10px_30px_rgba(15,23,42,0.06)] sm:p-8">
              <h1 className="font-fredoka text-[24px] font-semibold text-slate-950 sm:text-[34px]">
                Hotel not found
              </h1>

              <p className="mx-auto mt-2 max-w-2xl font-poppins text-[11.5px] font-medium leading-5 text-slate-600 sm:mt-3 sm:text-sm sm:leading-7">
                The hotel option you are looking for does not exist or may have
                been moved.
              </p>

              <Link
                to="/hotels"
                className="mt-5 inline-flex items-center justify-center gap-2 rounded-[5px] bg-[#FF6B00] px-5 py-2.5 font-poppins text-xs font-semibold text-white transition hover:bg-[#00AEEF] sm:mt-6 sm:px-6 sm:py-3 sm:text-sm"
              >
                <FaArrowLeft className="text-[10px] sm:text-xs" />
                Back to Hotels
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
        <style>{bannerAnimationStyles}</style>

        <Link
          to="/hotels"
          aria-label="Back to hotel options"
          title="Back to hotel options"
         className="absolute left-4 top-3 z-30 hidden h-9 w-9 items-center justify-center rounded-[5px] border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-[#00AEEF] hover:text-[#00AEEF] sm:left-6 sm:top-5 sm:flex sm:h-10 sm:w-10 lg:left-8"

        >
          <FaArrowLeft className="text-[12px] sm:text-sm" />
        </Link>

        <div className="mx-auto max-w-[920px]">
          <div className="relative mb-3 min-h-[100px] overflow-hidden rounded-[14px] bg-white px-3.5 py-3.5 shadow-[0_10px_34px_rgba(11,42,74,0.08)] sm:mb-4 sm:min-h-[150px] sm:rounded-[18px] sm:px-8 sm:py-5 lg:min-h-[170px]">
            <div className="pointer-events-none absolute -right-10 -top-16 hidden h-64 w-64 rounded-full bg-[#00AEEF]/10 blur-3xl sm:block"></div>
            <div className="pointer-events-none absolute -bottom-16 right-24 hidden h-40 w-40 rounded-full bg-[#FF6B00]/10 blur-3xl sm:block"></div>

            <div className="relative z-10 flex w-[58%] flex-col justify-center py-1 sm:absolute sm:inset-y-0 sm:left-0 sm:w-[72%] sm:px-8 sm:py-6 lg:w-[70%]">
              <p className="mb-1 flex items-center gap-1 whitespace-nowrap font-poppins text-[10px] font-bold uppercase leading-tight tracking-[0.08em] text-[#00AEEF] sm:mb-3 sm:gap-2 sm:whitespace-normal sm:text-[14px] sm:leading-normal sm:tracking-[0.22em]">
                <span className="inline-block h-[1.5px] w-1 shrink-0 bg-[#FF6B00] sm:h-[2px] sm:w-8"></span>
                Comfort Meets Convenience
              </p>

              <h2 className="flex flex-nowrap items-center gap-[2px] whitespace-nowrap font-fredoka text-[10px] font-semibold uppercase leading-[1.05] tracking-[-0.07em] text-slate-950 sm:justify-start sm:gap-2 sm:text-[22px] sm:leading-[1.05] sm:tracking-wide lg:text-[26px]">
  <span className="whitespace-nowrap">Find Your</span>
  <span className="whitespace-nowrap rounded-[2px] bg-[#FF6B00] px-0.5 py-[2px] leading-none tracking-[-0.05em] text-white shadow-sm sm:rounded-[6px] sm:px-3 sm:py-1 sm:tracking-wide">
    Stay
  </span>
</h2>
            </div>

            <img
              src={hotelFormAsset}
              alt="Hotel booking illustration"
              className="hotel-banner-asset pointer-events-none absolute -bottom-4 right-1 z-0 h-[100px] w-auto object-contain sm:-bottom-6 sm:right-5 sm:h-[170px] lg:right-7 lg:h-[190px]"
            />
          </div>
        </div>

        <div className="mx-auto max-w-[920px]">
          <div
            ref={bookingFormRef}
            className="rounded-[5px] border border-slate-100 bg-white p-4 shadow-[0_16px_45px_rgba(15,23,42,0.08)] sm:p-8"
          >
            <div className="mb-4 sm:mb-6">
              <div className="mb-1.5 flex items-center gap-2 sm:mb-2 sm:gap-2.5">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#00AEEF]/10 text-xs text-[#00AEEF] sm:h-8 sm:w-8 sm:text-sm">
                  <FaHotel />
                </span>

                <p className="font-poppins text-[8.5px] font-bold uppercase tracking-[0.08em] text-[#00AEEF] sm:text-[12px] sm:tracking-[0.1em]">
                  Hotel Booking Inquiry Form
                </p>
              </div>

              <h1 className="font-fredoka text-[22px] font-semibold leading-tight text-slate-950 sm:text-[36px]">
                Request hotel booking
              </h1>

              <p className="mt-1.5 font-poppins text-[10.5px] font-medium leading-5 text-slate-600 sm:mt-2 sm:text-sm sm:leading-7">
                Fill the required details for{" "}
                <span className="font-bold text-slate-950">{hotel.name}</span>.
                TravelEx will confirm availability, room type, and final
                quote.
              </p>
            </div>

            {success && (
              <div className="mb-5 rounded-[5px] border border-green-100 bg-green-50 p-5 sm:p-6">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[5px] bg-green-600 text-white">
                    <FaCheckCircle className="text-lg" />
                  </div>

                  <div>
                    <h2 className="font-fredoka text-[24px] font-semibold leading-tight text-green-700">
                      Hotel request submitted
                    </h2>

                    <p className="mt-1 font-poppins text-[11.5px] font-medium leading-5 text-green-700 sm:text-sm sm:leading-7">
                      Your request has been submitted successfully. TravelEx
                      team will contact you shortly.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {formError && (
              <p className="mb-5 rounded-[5px] bg-red-50 px-4 py-3 font-poppins text-[11.5px] font-semibold leading-5 text-red-600 sm:text-sm">
                {formError}
              </p>
            )}

            <form onSubmit={handleSubmit} className="grid gap-4">
              <input
                type="text"
                name="companyWebsite"
                value={booking.companyWebsite}
                onChange={handleChange}
                className="hidden"
                tabIndex="-1"
                autoComplete="off"
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Full Name *</label>

                  <div className="relative">
                    <FaUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 sm:left-4 sm:text-sm" />

                    <input
                      type="text"
                      name="fullName"
                      value={booking.fullName}
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
                      value={booking.phone}
                      onChange={handleChange}
                      placeholder="03XXXXXXXXX"
                      className={iconInputClass}
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Email Address (Optional)</label>

                  <div className="relative">
                    <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 sm:left-4 sm:text-sm" />

                    <input
                      type="email"
                      name="email"
                      value={booking.email}
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
                      value={booking.city}
                      onChange={handleChange}
                      placeholder="Your city"
                      className={iconInputClass}
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Destination *</label>

                  <div className="relative">
                    <FaMapMarkerAlt className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 sm:left-4 sm:text-sm" />

                    <input
                      type="text"
                      name="destination"
                      value={booking.destination}
                      onChange={handleChange}
                      placeholder="Makkah, Madinah, Dubai..."
                      className={iconInputClass}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Hotel Name (If Any)</label>

                  <div className="relative">
                    <FaHotel className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 sm:left-4 sm:text-sm" />

                    <input
                      type="text"
                      name="hotelName"
                      value={booking.hotelName}
                      onChange={handleChange}
                      placeholder="Preferred hotel name"
                      className={iconInputClass}
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <AppDatePicker
                  label="Check-in Date *"
                  value={booking.checkInDate}
                  onChange={(value) => handleSelectChange("checkInDate", value)}
                  placeholder="Select check-in date"
                />

                <AppDatePicker
                  label="Check-out Date *"
                  value={booking.checkOutDate}
                  onChange={(value) => handleSelectChange("checkOutDate", value)}
                  placeholder="Select check-out date"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Adults *</label>

                  <input
                    type="number"
                    name="adults"
                    min="1"
                    value={booking.adults}
                    onChange={handleChange}
                    placeholder="1"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Children</label>

                  <input
                    type="number"
                    name="children"
                    min="0"
                    value={booking.children}
                    onChange={handleChange}
                    placeholder="0"
                    className={inputClass}
                  />
                </div>
              </div>

              <ChildAgeFields
                ages={booking.childAges}
                onChange={handleChildAgeChange}
                labelClass={labelClass}
                inputClass={inputClass}
              />

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className={labelClass}>Number of Rooms *</label>

                  <div className="relative">
                    <FaBed className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 sm:left-4 sm:text-sm" />

                    <input
                      type="number"
                      name="rooms"
                      min="1"
                      value={booking.rooms}
                      onChange={handleChange}
                      placeholder="1"
                      className={iconInputClass}
                    />
                  </div>
                </div>

                <AppSelect
                  label="Room Type *"
                  value={booking.roomType}
                  onChange={(value) => handleSelectChange("roomType", value)}
                  placeholder="Select room type"
                  options={roomTypeOptions}
                />

                <AppSelect
                  label="Hotel Category *"
                  value={booking.hotelCategory}
                  onChange={(value) =>
                    handleSelectChange("hotelCategory", value)
                  }
                  placeholder="Select hotel category"
                  options={hotelCategoryOptions}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className={checkboxLabelClass}>
                  <input
                    type="checkbox"
                    name="breakfastIncluded"
                    checked={booking.breakfastIncluded}
                    onChange={handleChange}
                    className="h-4 w-4 shrink-0 rounded border-slate-300 text-[#00AEEF] focus:ring-[#00AEEF]/40"
                  />
                  Breakfast Included
                </label>

                <label className={checkboxLabelClass}>
                  <input
                    type="checkbox"
                    name="airportTransfer"
                    checked={booking.airportTransfer}
                    onChange={handleChange}
                    className="h-4 w-4 shrink-0 rounded border-slate-300 text-[#00AEEF] focus:ring-[#00AEEF]/40"
                  />
                  Airport Transfer
                </label>
              </div>

              <div>
                <label className={labelClass}>Additional Requirements</label>

                <textarea
                  rows="4"
                  name="additionalRequirements"
                  value={booking.additionalRequirements}
                  onChange={handleChange}
                  placeholder="Write room sharing details, hotel distance preference, or any other requirement..."
                  className="min-h-[130px] w-full resize-none rounded-[5px] border border-slate-200 bg-white px-3 py-3 font-poppins text-xs font-semibold leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#00AEEF] focus:ring-2 focus:ring-[#00AEEF]/10 sm:min-h-[150px] sm:px-4 sm:text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-[5px] bg-[#FF6B00] px-6 py-3.5 font-poppins text-sm font-semibold text-white transition hover:bg-[#00AEEF] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Submitting..." : "Submit Hotel Request"}
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

export default HotelDetailsPage