import { useEffect, useMemo, useState } from "react"
import { Link, useParams } from "react-router-dom"
import {
  FaArrowLeft,
  FaArrowRight,
  FaBed,
  FaCalendarAlt,
  FaCheckCircle,
  FaEnvelope,
  FaHotel,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaUser,
  FaUsers,
  FaWhatsapp,
} from "react-icons/fa"

import Footer from "../components/Footer"
import AppSelect from "../components/common/AppSelect"
import AppDatePicker from "../components/common/AppDatePicker"
import ChildAgeFields from "../components/common/ChildAgeFields"
import { hotels } from "../data/hotelsData"
import { publicApi } from "../services/publicApi"
import {
  getChildAgesError,
  getChildCount,
  normalizeChildAges,
  resizeChildAges,
} from "../utils/travelerForm"

const roomTypeOptions = ["Standard", "Suite", "Apartment"]

const hotelCategoryOptions = ["3 Star", "4 Star", "5 Star"]

const labelClass =
  "mb-1.5 block font-poppins text-[9px] font-bold uppercase tracking-[0.08em] text-slate-400 sm:mb-2 sm:text-xs"

const inputClass =
  "h-11 w-full rounded-[5px] border border-slate-200 bg-white px-3 font-poppins text-xs font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#00AEEF] focus:ring-2 focus:ring-[#00AEEF]/10 sm:h-12 sm:px-4 sm:text-sm"

const iconInputClass =
  "h-11 w-full rounded-[5px] border border-slate-200 bg-white pl-10 pr-3 font-poppins text-xs font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#00AEEF] focus:ring-2 focus:ring-[#00AEEF]/10 sm:h-12 sm:pl-11 sm:pr-4 sm:text-sm"

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

const getWhatsappLink = (hotel) =>
  `https://wa.me/923111444192?text=${encodeURIComponent(
    `Assalamualaikum TravelEx, I want to request hotel booking for ${
      hotel?.name || "selected hotel"
    }. Please guide me.`
  )}`

const getInitialBooking = (hotel) => ({
  fullName: "",
  phone: "",
  email: "",
  city: "",

  destination: hotel?.location || "",
  hotelName: hotel?.name || "",

  checkInDate: "",
  checkOutDate: "",

  adults: "1",
  children: "0",
  childAges: [],

  rooms: "1",
  roomType: "Standard",
  hotelCategory: hotel?.stars ? `${hotel.stars} Star` : "",

  breakfastIncluded: false,
  airportTransfer: false,

  additionalRequirements: "",
  companyWebsite: "",
})

const HotelBookingPage = () => {
  const { id } = useParams()
  const hotel = hotels.find((item) => item.id === id)

  const [formError, setFormError] = useState("")
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [bookingRef] = useState(
    () => `TXH-${Math.floor(100000 + Math.random() * 900000)}`
  )

  const [booking, setBooking] = useState(() => getInitialBooking(hotel))

  useEffect(() => {
    if (hotel) {
      setBooking((prev) => ({
        ...prev,
        destination: hotel.location || prev.destination,
        hotelName: hotel.name || prev.hotelName,
        hotelCategory: hotel.stars ? `${hotel.stars} Star` : prev.hotelCategory,
        roomType: prev.roomType || "Standard",
      }))
    }
  }, [hotel])

  const nights = useMemo(() => {
    return getNights(booking.checkInDate, booking.checkOutDate)
  }, [booking.checkInDate, booking.checkOutDate])

  const totalGuests = useMemo(() => {
    const adults = Math.max(0, Number(booking.adults) || 0)
    const children = getChildCount(booking.children)

    return adults + children
  }, [booking.adults, booking.children])

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
        "Personal Information",
        `Full Name: ${booking.fullName}`,
        `Mobile / WhatsApp: ${booking.phone}`,
        `Email Address: ${booking.email || "Not provided"}`,
        `City: ${booking.city}`,
        "",
        "Hotel Requirements",
        `Destination: ${booking.destination}`,
        `Hotel Name: ${selectedHotelName}`,
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
      window.scrollTo({ top: 0, behavior: "smooth" })

      setBooking((prev) => ({
        ...getInitialBooking(hotel),
        destination: prev.destination,
        hotelName: prev.hotelName,
        hotelCategory: prev.hotelCategory,
        roomType: prev.roomType,
      }))
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
                The selected hotel does not exist or may have been moved.
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
      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-950">
        <img
          src={hotel.image}
          alt={hotel.name}
          loading="eager"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/70 via-slate-950/50 to-slate-950/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-transparent to-transparent" />

        <div className="relative z-10 mx-auto max-w-[1340px] px-4 py-7 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
          <div className="max-w-5xl">
            <Link
              to={`/hotels/${hotel.id}`}
              className="mb-2 inline-flex items-center gap-1.5 font-poppins text-[9px] font-semibold text-white/75 transition hover:text-[#00AEEF] sm:mb-6 sm:gap-2 sm:text-sm"
            >
              <FaArrowLeft className="text-[8px] sm:text-xs" />
              Back to hotel details
            </Link>

            <div className="mb-2 flex flex-wrap items-center gap-1.5 sm:mb-4 sm:gap-3">
              <span className="inline-flex h-[27px] items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-2.5 font-poppins text-[7.5px] font-bold uppercase tracking-[0.08em] text-[#00AEEF] backdrop-blur sm:h-auto sm:gap-2 sm:px-4 sm:py-2 sm:text-[11px] sm:tracking-[0.1em]">
                <FaHotel className="text-[8px] sm:text-[10px]" />
                Hotel Booking Inquiry
              </span>

              <span className="inline-flex h-[27px] items-center rounded-full border border-white/15 bg-white/10 px-2.5 font-poppins text-[8.5px] font-semibold text-white/85 backdrop-blur sm:h-auto sm:px-4 sm:py-2 sm:text-xs">
                {hotel.type}
              </span>

              <span className="inline-flex h-[27px] items-center rounded-full border border-white/15 bg-white/10 px-2.5 font-poppins text-[8.5px] font-semibold text-white/85 backdrop-blur sm:h-auto sm:px-4 sm:py-2 sm:text-xs">
                {hotel.stars} Star
              </span>
            </div>

            <h1 className="font-fredoka text-[18px] font-semibold leading-[1.08] text-white sm:text-[46px] sm:uppercase sm:leading-[1.1] lg:text-[52px]">
              Request hotel booking for {hotel.name}
            </h1>

            <p className="mt-1 max-w-3xl font-poppins text-[9px] font-medium leading-4 text-white/85 sm:mt-4 sm:text-base sm:leading-7">
              <span className="sm:hidden">
                Submit hotel inquiry. TravelEx will confirm.
              </span>

              <span className="hidden sm:inline">
                Share your hotel requirements. TravelEx consultant will check
                availability, confirm price, and guide you before final booking.
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* Request Area */}
      <section className="bg-[#F8FAFC] py-8 sm:py-14">
        <div className="mx-auto grid max-w-[1440px] gap-5 px-4 sm:px-6 lg:grid-cols-[1fr_380px] lg:gap-6 lg:px-8">
          <form
            onSubmit={handleSubmit}
            className="rounded-[5px] border border-slate-100 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.06)] sm:p-7"
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

              <h2 className="font-fredoka text-[22px] font-semibold leading-tight text-slate-950 sm:text-[40px]">
                Share your hotel requirements
              </h2>

              <p className="mt-2 font-poppins text-[11.5px] font-medium leading-6 text-slate-600 sm:text-base sm:leading-7">
                This is a request-based inquiry. Final room availability, price,
                and confirmation will be shared by TravelEx consultant.
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
                <h3 className="font-fredoka text-[24px] font-semibold text-slate-950">
                  Personal Information
                </h3>

                <div className="mt-4 grid gap-4 sm:grid-cols-3">
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
                </div>

                <div className="mt-4">
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

              {/* Hotel Requirements */}
              <div>
                <h3 className="font-fredoka text-[24px] font-semibold text-slate-950">
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
                <h3 className="font-fredoka text-[24px] font-semibold text-slate-950">
                  Guests
                </h3>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
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
                      className={inputClass}
                    />
                  </div>
                </div>

                <ChildAgeFields
                  ages={booking.childAges}
                  onChange={handleChildAgeChange}
                  labelClass={labelClass}
                  inputClass={inputClass}
                  className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
                />
              </div>

              {/* Room Requirements */}
              <div>
                <h3 className="font-fredoka text-[24px] font-semibold text-slate-950">
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
                <h3 className="font-fredoka text-[24px] font-semibold text-slate-950">
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
                  <label className={labelClass}>
                    Additional Requirements
                  </label>

                  <textarea
                    name="additionalRequirements"
                    rows="4"
                    placeholder="Write early check-in, late check-out, family room, Haram distance, room sharing, view preference, or any special request..."
                    value={booking.additionalRequirements}
                    onChange={handleChange}
                    className="w-full resize-none rounded-[5px] border border-slate-200 bg-white px-3 py-3 font-poppins text-xs font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#00AEEF] focus:ring-2 focus:ring-[#00AEEF]/10 sm:px-4 sm:text-sm"
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
          </form>

          {/* Request Summary */}
          <aside className="h-fit lg:sticky lg:top-24 lg:self-start">
            <div className="overflow-hidden rounded-[5px] border border-slate-100 bg-white shadow-[0_16px_45px_rgba(15,23,42,0.08)]">
              <div className="relative h-36 overflow-hidden sm:h-44">
                <img
                  src={hotel.image}
                  alt={hotel.name}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />

                <div className="absolute bottom-3 left-4 right-4 sm:bottom-4">
                  <p className="font-poppins text-[8.5px] font-bold uppercase tracking-[0.08em] text-white/65 sm:text-[10px] sm:tracking-[0.1em]">
                    Selected Hotel
                  </p>

                  <h3 className="mt-1 font-fredoka text-[21px] font-semibold leading-tight text-white sm:text-[24px]">
                    {booking.hotelName || hotel.name}
                  </h3>
                </div>
              </div>

              <div className="p-4 sm:p-5">
                <p className="font-poppins text-[8.5px] font-bold uppercase tracking-[0.08em] text-slate-400 sm:text-[10px] sm:tracking-[0.1em]">
                  Inquiry Summary
                </p>

                <div className="mt-4 grid gap-2 sm:gap-3">
                  {[
                    ["Destination", booking.destination || "-"],
                    ["Hotel", booking.hotelName || hotel.name || "-"],
                    ["Category", booking.hotelCategory || "-"],
                    ["Check-in", booking.checkInDate || "-"],
                    ["Check-out", booking.checkOutDate || "-"],
                    ["Nights", nights],
                    ["Guests", totalGuests || "-"],
                    ["Rooms", booking.rooms || "-"],
                    ["Room Type", booking.roomType || "-"],
                    [
                      "Special",
                      [
                        booking.breakfastIncluded ? "Breakfast" : "",
                        booking.airportTransfer ? "Airport Transfer" : "",
                      ]
                        .filter(Boolean)
                        .join(", ") || "-",
                    ],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="rounded-[5px] bg-[#F8FAFC] px-3.5 py-2.5 sm:px-4 sm:py-3"
                    >
                      <p className="font-poppins text-[10px] font-bold text-slate-400 sm:text-xs">
                        {label}
                      </p>

                      <p className="mt-1 break-words font-poppins text-sm font-semibold text-slate-950 sm:text-base">
                        {value || "-"}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 rounded-[5px] bg-orange-50 p-3.5 sm:mt-5 sm:p-4">
                  <p className="font-poppins text-[9px] font-bold uppercase tracking-[0.08em] text-[#FF6B00] sm:text-[11px] sm:tracking-[0.1em]">
                    Request Based Booking
                  </p>

                  <p className="mt-1.5 font-poppins text-[11px] font-medium leading-5 text-orange-800 sm:mt-2 sm:text-sm sm:leading-7">
                    No online payment is charged here. TravelEx consultant will
                    verify availability and final price before confirmation.
                  </p>
                </div>

                <a
                  href={getWhatsappLink(hotel)}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-[5px] bg-[#25D366] px-5 py-3 font-poppins text-sm font-semibold text-white transition hover:bg-[#00AEEF]"
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

export default HotelBookingPage