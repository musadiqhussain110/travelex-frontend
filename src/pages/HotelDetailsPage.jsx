import { useMemo, useRef, useState } from "react"
import { Link, useParams } from "react-router-dom"
import {
  FaArrowLeft,
  FaArrowRight,
  FaBed,
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
  FaEnvelope,
  FaHotel,
  FaInfoCircle,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaStar,
  FaTag,
  FaUser,
  FaUsers,
  FaWhatsapp,
} from "react-icons/fa"

import Footer from "../components/Footer"
import AppSelect from "../components/common/AppSelect"
import AppDatePicker from "../components/common/AppDatePicker"
import { publicApi } from "../services/publicApi"

import hotelHero2 from "../assets/Hotels/custom-hotel.jpg"
import hotelHero3 from "../assets/Hotels/Hotel5.jpg"
import hotelHero4 from "../assets/Hotels/makkahHotel4.jpg"

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
  infants: "",

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

const getHotelWhatsappLink = (hotel) =>
  `https://wa.me/923111444192?text=${encodeURIComponent(
    `Assalamualaikum TravelEx, I need hotel booking guidance for ${hotel.name}.`
  )}`

const getHotelBookingWhatsappLink = (hotel) =>
  `https://wa.me/923111444192?text=${encodeURIComponent(
    `Assalamualaikum TravelEx, I want to request hotel booking for ${
      hotel?.name || "selected hotel"
    }. Please guide me.`
  )}`

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

  const scrollToBookingForm = () => {
    bookingFormRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    })
  }

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target

    setBooking((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
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
    if (!booking.email.trim()) return "Please enter email address."
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

    if (Number(booking.infants) < 0) {
      return "Infants cannot be negative."
    }

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
      const children = Math.max(0, Number(booking.children) || 0)
      const infants = Math.max(0, Number(booking.infants) || 0)
      const rooms = Math.max(1, Number(booking.rooms) || 1)
      const guests = adults + children + infants

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
        `Email Address: ${booking.email}`,
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
        `Infants: ${infants}`,
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
      ].join("\n")

      const payload = {
        name: booking.fullName.trim(),
        phone: booking.phone.trim(),
        email: booking.email.trim(),

        serviceType: "hotel",
        source: "hotel-page",
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
          infants,
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

  const quickFacts = [
    {
      label: "Location",
      value: hotel.location || "Available",
      icon: FaMapMarkerAlt,
    },
    {
      label: "Hotel Type",
      value: hotel.type || "Hotel",
      icon: FaHotel,
    },
    {
      label: "Category",
      value: getCategoryLabel(hotel),
      icon: FaStar,
    },
    {
      label: "Quote",
      value: hotel.price || "On request",
      icon: FaClock,
    },
  ]

  const compactHighlights = [...hotel.highlights, ...hotel.facilities].slice(0, 6)

  return (
    <main className="bg-[#F8FAFC]">
      {/* Detail Hero */}
      <section className="relative overflow-hidden bg-slate-950">
        <img
          src={hotel.image}
          alt={hotel.name}
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/65 via-slate-950/45 to-slate-950/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/45 via-transparent to-transparent" />

        <div className="relative z-10 mx-auto max-w-[1340px] px-4 py-7 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
          <div className="max-w-4xl">
            <Link
              to="/hotels"
              className="mb-2 inline-flex items-center gap-1.5 font-poppins text-[9px] font-semibold text-white/75 transition hover:text-[#00AEEF] sm:mb-6 sm:gap-2 sm:text-sm"
            >
              <FaArrowLeft className="text-[8px] sm:text-xs" />
              Back to hotel options
            </Link>

            <div className="mb-2 flex flex-wrap items-center gap-1.5 sm:mb-4 sm:gap-3">
              <span className="inline-flex h-[27px] items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-2.5 font-poppins text-[7.5px] font-bold uppercase tracking-[0.14em] text-[#00AEEF] backdrop-blur sm:h-auto sm:gap-2 sm:px-4 sm:py-2 sm:text-[11px] sm:tracking-[0.16em]">
                <FaTag className="text-[8px] sm:text-[10px]" />
                {hotel.type}
              </span>

              <span className="inline-flex h-[27px] items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-2.5 font-poppins text-[8.5px] font-semibold text-white/85 backdrop-blur sm:h-auto sm:gap-2 sm:px-4 sm:py-2 sm:text-xs">
                <FaStar className="text-[#FF6B00]" />
                {getCategoryLabel(hotel)}
              </span>
            </div>

            <h1 className="font-fredoka text-[18px] font-semibold leading-[1.08] text-white sm:text-[46px] sm:uppercase sm:leading-[1.1] lg:text-[54px]">
              {hotel.name}
            </h1>

            <p className="mt-1 max-w-3xl font-poppins text-[9px] font-medium leading-4 text-white/85 sm:mt-4 sm:text-base sm:leading-7">
              <span className="sm:hidden">Custom hotel quote support.</span>

              <span className="hidden sm:inline">{hotel.shortDescription}</span>
            </p>
          </div>
        </div>
      </section>

      {/* Merged Booking + Details */}
      <section className="bg-[#F8FAFC] py-8 sm:py-14">
        <div className="mx-auto grid max-w-[1440px] gap-5 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-6 lg:px-8">
          {/* Booking Form Left */}
          <form
            ref={bookingFormRef}
            id="hotel-booking-form"
            onSubmit={handleSubmit}
            className="rounded-[5px] border border-slate-100 bg-white p-4 shadow-[0_16px_45px_rgba(15,23,42,0.08)] sm:p-7"
          >
            <input
              type="text"
              name="companyWebsite"
              value={booking.companyWebsite}
              onChange={handleChange}
              className="hidden"
              tabIndex="-1"
              autoComplete="off"
            />

            <div className="mb-5">
              <p className="mb-1.5 font-poppins text-[8.5px] font-bold uppercase tracking-[0.08em] text-[#00AEEF] sm:mb-2 sm:text-[12px] sm:tracking-[0.1em]">
                Hotel Booking Inquiry Form
              </p>

              <h2 className="font-fredoka text-[22px] font-semibold leading-tight text-slate-950 sm:text-[36px]">
                Request hotel quote
              </h2>

              <p className="mt-2 font-poppins text-[11.5px] font-medium leading-6 text-slate-600 sm:text-sm sm:leading-7">
                Fill the form and TravelEx consultant will confirm availability,
                final quote, and booking process.
              </p>
            </div>

            {success && (
              <div className="mb-5 rounded-[5px] border border-green-200 bg-green-50 p-4">
                <div className="flex items-start gap-3">
                  <FaCheckCircle className="mt-1 shrink-0 text-green-600" />

                  <div>
                    <h3 className="font-poppins text-sm font-bold text-green-800">
                      Hotel inquiry submitted successfully.
                    </h3>

                    <p className="mt-1 font-poppins text-xs font-semibold leading-5 text-green-700 sm:text-sm">
                      Booking Reference: {bookingRef}. Team will contact you shortly.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {formError && (
              <p className="mb-5 rounded-[5px] border border-red-200 bg-red-50 px-4 py-3 font-poppins text-[11.5px] font-semibold leading-5 text-red-600 sm:text-sm">
                {formError}
              </p>
            )}

            <div className="grid gap-6">
              {/* Personal Information */}
              <div>
                <h3 className="font-fredoka text-[22px] font-semibold text-slate-950">
                  Personal Information
                </h3>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>Full Name</label>

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
                    <label className={labelClass}>Mobile / WhatsApp</label>

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

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>Email Address</label>

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
                    <label className={labelClass}>City</label>

                    <input
                      type="text"
                      name="city"
                      value={booking.city}
                      onChange={handleChange}
                      placeholder="Karachi, Lahore, Hyderabad..."
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>

              {/* Hotel Requirements */}
              <div>
                <h3 className="font-fredoka text-[22px] font-semibold text-slate-950">
                  Hotel Requirements
                </h3>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>Destination City / Country</label>

                    <div className="relative">
                      <FaMapMarkerAlt className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 sm:left-4 sm:text-sm" />

                      <input
                        type="text"
                        name="destination"
                        value={booking.destination}
                        onChange={handleChange}
                        placeholder="Makkah, Madinah, Dubai, Turkey..."
                        className={iconInputClass}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Hotel Name If Any</label>

                    <div className="relative">
                      <FaHotel className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 sm:left-4 sm:text-sm" />

                      <input
                        type="text"
                        name="hotelName"
                        value={booking.hotelName}
                        onChange={handleChange}
                        placeholder="Hotel name or leave blank"
                        className={iconInputClass}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <AppDatePicker
                    label="Check-in Date"
                    value={booking.checkInDate}
                    onChange={(value) =>
                      handleSelectChange("checkInDate", value)
                    }
                    placeholder="Select check-in date"
                  />

                  <AppDatePicker
                    label="Check-out Date"
                    value={booking.checkOutDate}
                    onChange={(value) =>
                      handleSelectChange("checkOutDate", value)
                    }
                    placeholder="Select check-out date"
                  />
                </div>

                <div className="mt-4">
                  <label className={labelClass}>Number of Nights</label>

                  <div className="relative">
                    <FaCalendarAlt className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 sm:left-4 sm:text-sm" />

                    <input
                      type="text"
                      value={nights}
                      readOnly
                      className={`${iconInputClass} cursor-not-allowed bg-slate-50 text-slate-500`}
                    />
                  </div>
                </div>
              </div>

              {/* Guests */}
              <div>
                <h3 className="font-fredoka text-[22px] font-semibold text-slate-950">
                  Guests
                </h3>

                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className={labelClass}>Adults</label>

                    <div className="relative">
                      <FaUsers className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 sm:left-4 sm:text-sm" />

                      <input
                        type="number"
                        name="adults"
                        min="1"
                        value={booking.adults}
                        onChange={handleChange}
                        placeholder="1"
                        className={iconInputClass}
                      />
                    </div>
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

                  <div>
                    <label className={labelClass}>Infants</label>

                    <input
                      type="number"
                      name="infants"
                      min="0"
                      value={booking.infants}
                      onChange={handleChange}
                      placeholder="0"
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>

              {/* Room Requirements */}
              <div>
                <h3 className="font-fredoka text-[22px] font-semibold text-slate-950">
                  Room Requirements
                </h3>

                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className={labelClass}>Number of Rooms</label>

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
                    label="Room Type"
                    value={booking.roomType}
                    onChange={(value) => handleSelectChange("roomType", value)}
                    placeholder="Select room type"
                    options={roomTypeOptions}
                  />

                  <AppSelect
                    label="Hotel Category"
                    value={booking.hotelCategory}
                    onChange={(value) =>
                      handleSelectChange("hotelCategory", value)
                    }
                    placeholder="Select hotel category"
                    options={hotelCategoryOptions}
                  />
                </div>
              </div>

              {/* Special Requests */}
              <div>
                <h3 className="font-fredoka text-[22px] font-semibold text-slate-950">
                  Special Requests
                </h3>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <label className="flex cursor-pointer items-center gap-3 rounded-[5px] border border-slate-200 bg-white px-4 py-3 font-poppins text-sm font-semibold text-slate-700 transition hover:border-[#00AEEF] hover:bg-[#00AEEF]/5">
                    <input
                      type="checkbox"
                      name="breakfastIncluded"
                      checked={booking.breakfastIncluded}
                      onChange={handleChange}
                      className="h-4 w-4 accent-[#FF6B00]"
                    />
                    Breakfast Included
                  </label>

                  <label className="flex cursor-pointer items-center gap-3 rounded-[5px] border border-slate-200 bg-white px-4 py-3 font-poppins text-sm font-semibold text-slate-700 transition hover:border-[#00AEEF] hover:bg-[#00AEEF]/5">
                    <input
                      type="checkbox"
                      name="airportTransfer"
                      checked={booking.airportTransfer}
                      onChange={handleChange}
                      className="h-4 w-4 accent-[#FF6B00]"
                    />
                    Airport Transfer
                  </label>
                </div>

                <div className="mt-4">
                  <label className={labelClass}>Additional Requirements</label>

                  <textarea
                    name="additionalRequirements"
                    rows="4"
                    placeholder="Write early check-in, late check-out, family room, Haram distance, room sharing, view preference, or any special request..."
                    value={booking.additionalRequirements}
                    onChange={handleChange}
                    className="min-h-[120px] w-full resize-none rounded-[5px] border border-slate-200 bg-white px-3 py-3 font-poppins text-xs font-semibold leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#00AEEF] focus:ring-2 focus:ring-[#00AEEF]/10 sm:min-h-[135px] sm:px-4 sm:text-sm"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-[5px] bg-[#FF6B00] px-6 py-3.5 font-poppins text-xs font-semibold uppercase tracking-[0.04em] text-white transition hover:bg-[#00AEEF] disabled:cursor-not-allowed disabled:opacity-70 sm:text-sm"
            >
              {loading ? "Submitting Inquiry..." : "Submit Hotel Inquiry"}
              {!loading && <FaArrowRight className="text-[10px] sm:text-xs" />}
            </button>

            <div className="mt-4 rounded-[5px] bg-orange-50 p-3.5 sm:p-4">
              <p className="font-poppins text-[9px] font-bold uppercase tracking-[0.08em] text-[#FF6B00] sm:text-[11px] sm:tracking-[0.1em]">
                Request Based Booking
              </p>

              <p className="mt-1.5 font-poppins text-[11px] font-medium leading-5 text-orange-800 sm:mt-2 sm:text-sm sm:leading-7">
                No online payment is charged here. TravelEx consultant will
                verify availability and final price before confirmation.
              </p>
            </div>

            <a
              href={getHotelBookingWhatsappLink(hotel)}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-[5px] bg-[#25D366] px-5 py-3 font-poppins text-sm font-semibold text-white transition hover:bg-[#00AEEF]"
            >
              <FaWhatsapp />
              Ask on WhatsApp
            </a>
          </form>

          {/* Necessary Details Right */}
          <aside className="grid h-fit gap-5 lg:sticky lg:top-24">
            <div className="overflow-hidden rounded-[5px] border border-slate-100 bg-white shadow-[0_16px_45px_rgba(15,23,42,0.08)]">
              <div className="relative h-44 overflow-hidden sm:h-56">
                <img
                  src={hotel.image}
                  alt={hotel.name}
                  className="h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />

                <div className="absolute bottom-4 left-4 right-4">
                  <p className="font-poppins text-[9px] font-bold uppercase tracking-[0.12em] text-white/70">
                    Selected Hotel
                  </p>

                  <h3 className="mt-1 font-fredoka text-[26px] font-semibold leading-tight text-white">
                    {hotel.name}
                  </h3>

                  <p className="mt-1 font-poppins text-xs font-semibold text-white/80">
                    {hotel.location} • {hotel.type} • {getCategoryLabel(hotel)}
                  </p>
                </div>
              </div>

              <div className="p-4 sm:p-5">
                <p className="font-poppins text-[9px] font-bold uppercase tracking-[0.12em] text-[#00AEEF]">
                  Quote
                </p>

                <p className="mt-1 font-fredoka text-[28px] font-semibold leading-tight text-[#FF6B00]">
                  {hotel.price}
                </p>

                <p className="mt-2 font-poppins text-sm font-medium leading-7 text-slate-600">
                  Final price depends on hotel choice, dates, room type, meal
                  plan, guests, and availability.
                </p>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  {quickFacts.map((item) => {
                    const Icon = item.icon

                    return (
                      <div key={item.label} className="rounded-[5px] bg-[#F8FAFC] p-3">
                        <Icon className="text-sm text-[#00AEEF]" />

                        <p className="mt-2 font-poppins text-[9px] font-bold uppercase tracking-[0.08em] text-slate-400">
                          {item.label}
                        </p>

                        <p className="mt-1 line-clamp-2 font-poppins text-xs font-bold leading-5 text-slate-950">
                          {item.value}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="rounded-[5px] border border-slate-100 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.06)] sm:p-5">
              <p className="font-poppins text-[9px] font-bold uppercase tracking-[0.12em] text-[#00AEEF]">
                Hotel Overview
              </p>

              <h2 className="mt-1 font-fredoka text-[28px] font-semibold leading-tight text-slate-950">
                Custom hotel support
              </h2>

              <p className="mt-2 font-poppins text-sm font-medium leading-7 text-slate-600">
                {hotel.overview}
              </p>
            </div>

            <div className="rounded-[5px] border border-slate-100 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.06)] sm:p-5">
              <p className="font-poppins text-[9px] font-bold uppercase tracking-[0.12em] text-[#FF6B00]">
                Key Details
              </p>

              <div className="mt-4 grid gap-2">
                {compactHighlights.map((item) => (
                  <p
                    key={item}
                    className="flex items-start gap-2 rounded-[5px] bg-[#F8FAFC] px-3.5 py-2.5 font-poppins text-sm font-semibold leading-6 text-slate-700"
                  >
                    <FaCheckCircle className="mt-1 shrink-0 text-[#00AEEF]" />
                    {item}
                  </p>
                ))}
              </div>
            </div>

            <div className="rounded-[5px] border border-[#FF6B00]/15 bg-orange-50 p-4 sm:p-5">
              <div className="flex gap-3">
                <FaInfoCircle className="mt-1 shrink-0 text-[#FF6B00]" />

                <div>
                  <h3 className="font-fredoka text-[22px] font-semibold leading-tight text-slate-950">
                    Important pricing note
                  </h3>

                  <p className="mt-2 font-poppins text-sm font-semibold leading-7 text-orange-800">
                    {hotel.note}
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <Footer />
    </main>
  )
}

export default HotelDetailsPage