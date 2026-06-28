import { useEffect, useMemo, useState } from "react"
import { Link, useParams } from "react-router-dom"
import {
  FaArrowLeft,
  FaArrowRight,
  FaCalendarAlt,
  FaCheckCircle,
  FaCreditCard,
  FaEnvelope,
  FaHotel,
  FaLock,
  FaMoneyBillWave,
  FaPhoneAlt,
  FaReceipt,
  FaShieldAlt,
  FaUser,
  FaUsers,
  FaWhatsapp,
} from "react-icons/fa"

import Footer from "../components/Footer"
import AppSelect from "../components/common/AppSelect"
import { hotels } from "../data/hotelsData"
import { publicApi } from "../services/publicApi"

const paymentMethods = [
  {
    id: "card",
    title: "Card / Payment Gateway",
    description: "Recommended secure online payment flow.",
    icon: FaCreditCard,
  },
  {
    id: "bank",
    title: "Bank Transfer",
    description: "Pay through bank transfer after booking review.",
    icon: FaMoneyBillWave,
  },
  {
    id: "manual",
    title: "Pay with TravelEx Support",
    description: "Let TravelEx team guide you manually.",
    icon: FaShieldAlt,
  },
]

const mealPlanOptions = [
  "Room Only",
  "Breakfast Included",
  "Half Board",
  "Full Board",
]

const labelClass =
  "mb-1.5 block font-poppins text-[9px] font-bold uppercase tracking-[0.08em] text-slate-400 sm:mb-2 sm:text-xs"

const inputClass =
  "h-11 w-full rounded-[5px] border border-slate-200 bg-white px-3 font-poppins text-xs font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#00AEEF] sm:h-12 sm:px-4 sm:text-sm"

const iconInputClass =
  "h-11 w-full rounded-[5px] border border-slate-200 bg-white pl-10 pr-3 font-poppins text-xs font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#00AEEF] sm:h-12 sm:pl-11 sm:pr-4 sm:text-sm"

const parseTravelDate = (value) => {
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

const getWhatsappLink = (hotel) =>
  `https://wa.me/923111444192?text=${encodeURIComponent(
    `Assalamualaikum TravelEx, I want to book ${hotel.name}. Please guide me.`
  )}`

const HotelBookingPage = () => {
  const { id } = useParams()
  const hotel = hotels.find((item) => item.id === id)

  const [step, setStep] = useState(1)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [formError, setFormError] = useState("")
  const [loading, setLoading] = useState(false)
  const [bookingRef] = useState(
    () => `TXH-${Math.floor(100000 + Math.random() * 900000)}`
  )

  const [booking, setBooking] = useState({
    checkIn: "",
    checkOut: "",
    rooms: "1",
    guests: "2",
    roomType: "",
    mealPlan: "Room Only",
    fullName: "",
    phone: "",
    email: "",
    city: "",
    specialRequest: "",
    paymentMethod: "card",
  })

  useEffect(() => {
    if (hotel) {
      setBooking((prev) => ({
        ...prev,
        roomType: hotel.roomOptions?.[0] || "",
      }))
    }
  }, [hotel])

  const nights = useMemo(() => {
    const startDate = parseTravelDate(booking.checkIn)
    const endDate = parseTravelDate(booking.checkOut)

    if (!startDate || !endDate) return 1

    const difference = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    )

    return difference > 0 ? difference : 1
  }, [booking.checkIn, booking.checkOut])

  const rooms = Math.max(1, Number(booking.rooms) || 1)
  const guests = Math.max(1, Number(booking.guests) || 1)
  const startingPrice = Number(hotel?.startingPrice || 0)
  const subtotal = startingPrice * nights * rooms
  const serviceFee = Math.round(subtotal * 0.03)
  const estimatedTotal = subtotal + serviceFee

  const handleChange = (event) => {
    const { name, value } = event.target

    setBooking((prev) => ({
      ...prev,
      [name]: value,
    }))

    setFormError("")
  }

  const handleSelectChange = (name, value) => {
    setBooking((prev) => ({
      ...prev,
      [name]: value,
    }))

    setFormError("")
  }

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const goToGuestDetails = (event) => {
    event.preventDefault()
    setFormError("")

    if (
      !booking.checkIn.trim() ||
      !booking.checkOut.trim() ||
      !booking.roomType ||
      !booking.mealPlan ||
      !booking.guests ||
      !booking.rooms
    ) {
      setFormError("Please complete check-in, check-out, room type and guests.")
      return
    }

    setStep(2)
    scrollTop()
  }

  const goToPayment = (event) => {
    event.preventDefault()
    setFormError("")

    if (
      !booking.fullName.trim() ||
      !booking.phone.trim() ||
      !booking.email.trim()
    ) {
      setFormError("Please enter full name, phone number and email address.")
      return
    }

    setStep(3)
    scrollTop()
  }

  const confirmPayment = async (event) => {
    event.preventDefault()
    setFormError("")

    if (!termsAccepted) {
      setFormError("Please confirm the booking details before proceeding.")
      return
    }

    try {
      setLoading(true)

      const selectedPayment = paymentMethods.find(
        (method) => method.id === booking.paymentMethod
      )

      const checkInDate = parseTravelDate(booking.checkIn)

      const message = [
        `Hotel booking request for: ${hotel.name}`,
        `Booking Reference: ${bookingRef}`,
        `Hotel Location: ${hotel.location || "Not provided"}`,
        `Hotel Type: ${hotel.type || "Hotel"}`,
        `Hotel Stars: ${hotel.stars || "-"} Star`,
        "",
        `Check-in: ${booking.checkIn}`,
        `Check-out: ${booking.checkOut}`,
        `Nights: ${nights}`,
        `Rooms: ${rooms}`,
        `Guests: ${guests}`,
        `Room Type: ${booking.roomType}`,
        `Meal Plan: ${booking.mealPlan}`,
        "",
        `Guest Name: ${booking.fullName}`,
        `Phone: ${booking.phone}`,
        `Email: ${booking.email}`,
        `City: ${booking.city || "Not provided"}`,
        "",
        `Payment Method: ${selectedPayment?.title || booking.paymentMethod}`,
        `Estimated Total: PKR ${estimatedTotal.toLocaleString()}`,
        "",
        booking.specialRequest
          ? `Special Request: ${booking.specialRequest}`
          : "Special Request: Not provided",
      ].join("\n")

      const payload = {
        name: booking.fullName.trim(),
        phone: booking.phone.trim(),
        email: booking.email.trim(),
        serviceType: "hotel",
        source: "hotel-page",
        pageUrl: window.location.href,
        destination: hotel.location || hotel.name || "",
        budget: `PKR ${estimatedTotal.toLocaleString()}`,
        preferredHotel: hotel.name,
        travelers: {
          adults: guests,
          children: 0,
          infants: 0,
        },
        travelDate: checkInDate ? checkInDate.toISOString() : undefined,
        message,
        priority: "high",
        companyWebsite: "",
      }

      await publicApi.createLead(payload)

      setStep(4)
      scrollTop()
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
            <div className="rounded-[12px] border border-slate-100 bg-white p-5 text-center shadow-[0_10px_30px_rgba(15,23,42,0.06)] sm:p-8">
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

  const selectedPayment = paymentMethods.find(
    (method) => method.id === booking.paymentMethod
  )

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

        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/65 via-slate-950/45 to-slate-950/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/45 via-transparent to-transparent" />

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
                Hotel Booking
              </span>

              <span className="inline-flex h-[27px] items-center rounded-full border border-white/15 bg-white/10 px-2.5 font-poppins text-[8.5px] font-semibold text-white/85 backdrop-blur sm:h-auto sm:px-4 sm:py-2 sm:text-xs">
                {hotel.type}
              </span>

              <span className="inline-flex h-[27px] items-center rounded-full border border-white/15 bg-white/10 px-2.5 font-poppins text-[8.5px] font-semibold text-white/85 backdrop-blur sm:h-auto sm:px-4 sm:py-2 sm:text-xs">
                {hotel.stars} Star
              </span>
            </div>

            <h1 className="font-fredoka text-[18px] font-semibold leading-[1.08] text-white sm:text-[46px] sm:uppercase sm:leading-[1.1] lg:text-[52px]">
              Book {hotel.name}
            </h1>

            <p className="mt-1 max-w-3xl font-poppins text-[9px] font-medium leading-4 text-white/85 sm:mt-4 sm:text-base sm:leading-7">
              <span className="sm:hidden">Complete hotel booking details.</span>

              <span className="hidden sm:inline">
                Fill your stay details, review your booking, and submit the
                request to TravelEx CRM.
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* Booking Area */}
      <section className="bg-[#F8FAFC] py-8 sm:py-14">
        <div className="mx-auto grid max-w-[1440px] gap-5 px-4 sm:px-6 lg:grid-cols-[1fr_380px] lg:gap-6 lg:px-8">
          <div className="rounded-[12px] border border-slate-100 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.06)] sm:p-7">
            {/* Stepper */}
            <div className="mb-5 grid grid-cols-4 gap-2 sm:mb-7 sm:gap-3">
              {[
                "Stay Details",
                "Guest Details",
                "Payment",
                "Confirmation",
              ].map((label, index) => {
                const stepNumber = index + 1
                const isActive = step === stepNumber
                const isDone = step > stepNumber

                return (
                  <div
                    key={label}
                    className={`rounded-[5px] border p-2 sm:p-3 ${
                      isActive
                        ? "border-[#00AEEF]/30 bg-sky-50"
                        : isDone
                          ? "border-green-100 bg-green-50"
                          : "border-slate-100 bg-[#F8FAFC]"
                    }`}
                  >
                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded-full font-poppins text-[10px] font-bold sm:h-8 sm:w-8 sm:text-xs ${
                        isDone
                          ? "bg-green-600 text-white"
                          : isActive
                            ? "bg-[#00AEEF] text-white"
                            : "bg-white text-slate-400"
                      }`}
                    >
                      {isDone ? <FaCheckCircle /> : stepNumber}
                    </span>

                    <p className="mt-1.5 line-clamp-1 font-poppins text-[8.5px] font-bold text-slate-700 sm:mt-2 sm:text-xs">
                      {label}
                    </p>
                  </div>
                )
              })}
            </div>

            {formError && (
              <p className="mb-4 rounded-[5px] bg-red-50 px-4 py-3 font-poppins text-[11.5px] font-semibold leading-5 text-red-600 sm:text-sm">
                {formError}
              </p>
            )}

            {/* Step 1 */}
            {step === 1 && (
              <form onSubmit={goToGuestDetails} className="grid gap-4">
                <div>
                  <p className="mb-1.5 font-poppins text-[8.5px] font-bold uppercase tracking-[0.08em] text-[#00AEEF] sm:mb-2 sm:text-[12px] sm:tracking-[0.1em]">
                    Step 1
                  </p>

                  <h2 className="font-fredoka text-[20px] font-semibold leading-[1.08] text-slate-950 sm:text-[32px]">
                    Stay details
                  </h2>

                  <p className="mt-1.5 font-poppins text-[10.5px] font-medium leading-5 text-slate-600 sm:mt-2 sm:text-sm sm:leading-7">
                    Add check-in, check-out, room type, guests and room count.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>Check-in Date</label>

                    <div className="relative">
                      <FaCalendarAlt className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 sm:left-4 sm:text-sm" />

                      <input
                        type="text"
                        name="checkIn"
                        required
                        value={booking.checkIn}
                        onChange={handleChange}
                        placeholder="DD/MM/YYYY"
                        inputMode="numeric"
                        className={iconInputClass}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Check-out Date</label>

                    <div className="relative">
                      <FaCalendarAlt className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 sm:left-4 sm:text-sm" />

                      <input
                        type="text"
                        name="checkOut"
                        required
                        value={booking.checkOut}
                        onChange={handleChange}
                        placeholder="DD/MM/YYYY"
                        inputMode="numeric"
                        className={iconInputClass}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <AppSelect
                    label="Room Type"
                    value={booking.roomType}
                    onChange={(value) => handleSelectChange("roomType", value)}
                    placeholder="Select room type"
                    options={hotel.roomOptions || []}
                  />

                  <AppSelect
                    label="Meal Plan"
                    value={booking.mealPlan}
                    onChange={(value) => handleSelectChange("mealPlan", value)}
                    placeholder="Select meal plan"
                    options={mealPlanOptions}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>Guests</label>

                    <div className="relative">
                      <FaUsers className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 sm:left-4 sm:text-sm" />

                      <input
                        type="number"
                        name="guests"
                        min="1"
                        required
                        value={booking.guests}
                        onChange={handleChange}
                        className={iconInputClass}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Rooms</label>

                    <div className="relative">
                      <FaHotel className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 sm:left-4 sm:text-sm" />

                      <input
                        type="number"
                        name="rooms"
                        min="1"
                        required
                        value={booking.rooms}
                        onChange={handleChange}
                        className={iconInputClass}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-[5px] bg-[#FF6B00] px-5 py-2.5 font-poppins text-xs font-semibold text-white transition hover:bg-[#00AEEF] sm:w-auto sm:px-6 sm:py-3 sm:text-sm"
                  >
                    Continue to Guest Details
                    <FaArrowRight className="text-[10px] sm:text-xs" />
                  </button>
                </div>
              </form>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <form onSubmit={goToPayment} className="grid gap-4">
                <div>
                  <p className="mb-1.5 font-poppins text-[8.5px] font-bold uppercase tracking-[0.08em] text-[#00AEEF] sm:mb-2 sm:text-[12px] sm:tracking-[0.1em]">
                    Step 2
                  </p>

                  <h2 className="font-fredoka text-[20px] font-semibold leading-[1.08] text-slate-950 sm:text-[32px]">
                    Guest details
                  </h2>

                  <p className="mt-1.5 font-poppins text-[10.5px] font-medium leading-5 text-slate-600 sm:mt-2 sm:text-sm sm:leading-7">
                    Add traveler contact details for booking confirmation.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>Full Name</label>

                    <div className="relative">
                      <FaUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 sm:left-4 sm:text-sm" />

                      <input
                        type="text"
                        name="fullName"
                        required
                        placeholder="Enter full name"
                        value={booking.fullName}
                        onChange={handleChange}
                        className={iconInputClass}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Phone / WhatsApp</label>

                    <div className="relative">
                      <FaPhoneAlt className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 sm:left-4 sm:text-sm" />

                      <input
                        type="tel"
                        name="phone"
                        required
                        placeholder="03XXXXXXXXX"
                        value={booking.phone}
                        onChange={handleChange}
                        className={iconInputClass}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>Email Address</label>

                    <div className="relative">
                      <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 sm:left-4 sm:text-sm" />

                      <input
                        type="email"
                        name="email"
                        required
                        placeholder="Enter email address"
                        value={booking.email}
                        onChange={handleChange}
                        className={iconInputClass}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>City</label>

                    <input
                      type="text"
                      name="city"
                      placeholder="Your city"
                      value={booking.city}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Special Request</label>

                  <textarea
                    name="specialRequest"
                    rows="4"
                    placeholder="Write early check-in, late check-out, family room, Haram distance, breakfast, or any special request..."
                    value={booking.specialRequest}
                    onChange={handleChange}
                    className="w-full resize-none rounded-[5px] border border-slate-200 bg-white px-3 py-3 font-poppins text-xs font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#00AEEF] sm:px-4 sm:text-sm"
                  />
                </div>

                <div className="flex flex-col justify-between gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => {
                      setFormError("")
                      setStep(1)
                    }}
                    className="inline-flex items-center justify-center rounded-[5px] border border-slate-200 bg-white px-5 py-2.5 font-poppins text-xs font-semibold text-slate-800 transition hover:border-[#00AEEF] hover:text-[#00AEEF] sm:px-6 sm:py-3 sm:text-sm"
                  >
                    Back
                  </button>

                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 rounded-[5px] bg-[#FF6B00] px-5 py-2.5 font-poppins text-xs font-semibold text-white transition hover:bg-[#00AEEF] sm:px-6 sm:py-3 sm:text-sm"
                  >
                    Review & Proceed
                    <FaArrowRight className="text-[10px] sm:text-xs" />
                  </button>
                </div>
              </form>
            )}

            {/* Step 3 */}
            {step === 3 && (
              <form onSubmit={confirmPayment} className="grid gap-5">
                <div>
                  <p className="mb-1.5 font-poppins text-[8.5px] font-bold uppercase tracking-[0.08em] text-[#00AEEF] sm:mb-2 sm:text-[12px] sm:tracking-[0.1em]">
                    Step 3
                  </p>

                  <h2 className="font-fredoka text-[20px] font-semibold leading-[1.08] text-slate-950 sm:text-[32px]">
                    Payment Review
                  </h2>

                  <p className="mt-1.5 font-poppins text-[10.5px] font-medium leading-5 text-slate-600 sm:mt-2 sm:text-sm sm:leading-7">
                    Review your booking and submit it to TravelEx team.
                  </p>
                </div>

                <div className="rounded-[8px] border border-slate-100 bg-[#F8FAFC] p-3.5 sm:p-4">
                  <h3 className="font-fredoka text-[21px] font-semibold text-slate-950 sm:text-[24px]">
                    Booking Review
                  </h3>

                  <div className="mt-3 grid gap-2 sm:mt-4 sm:grid-cols-2 sm:gap-3">
                    {[
                      ["Hotel", hotel.name],
                      ["Room Type", booking.roomType],
                      ["Check-in", booking.checkIn],
                      ["Check-out", booking.checkOut],
                      ["Nights", nights],
                      ["Rooms", booking.rooms],
                      ["Guests", booking.guests],
                      ["Guest", booking.fullName],
                    ].map(([label, value]) => (
                      <div
                        key={label}
                        className="rounded-[5px] bg-white px-3 py-2.5 sm:px-4 sm:py-3"
                      >
                        <p className="font-poppins text-[8px] font-bold uppercase tracking-[0.08em] text-slate-400 sm:text-[10px] sm:tracking-[0.1em]">
                          {label}
                        </p>

                        <p className="mt-1 font-poppins text-[11.5px] font-semibold text-slate-900 sm:text-sm">
                          {value || "-"}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-fredoka text-[21px] font-semibold text-slate-950 sm:text-[24px]">
                    Select Payment Method
                  </h3>

                  <div className="mt-3 grid gap-2 sm:mt-4 sm:gap-3">
                    {paymentMethods.map((method) => {
                      const Icon = method.icon
                      const isActive = booking.paymentMethod === method.id

                      return (
                        <button
                          key={method.id}
                          type="button"
                          onClick={() =>
                            setBooking((prev) => ({
                              ...prev,
                              paymentMethod: method.id,
                            }))
                          }
                          className={`flex items-start gap-3 rounded-[8px] border p-3.5 text-left transition sm:gap-4 sm:p-4 ${
                            isActive
                              ? "border-[#00AEEF]/40 bg-sky-50"
                              : "border-slate-100 bg-white hover:border-[#00AEEF]/25"
                          }`}
                        >
                          <span
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[5px] sm:h-11 sm:w-11 ${
                              isActive
                                ? "bg-[#00AEEF] text-white"
                                : "bg-[#F8FAFC] text-[#00AEEF]"
                            }`}
                          >
                            <Icon />
                          </span>

                          <span>
                            <span className="block font-poppins text-[12px] font-bold text-slate-950 sm:text-sm">
                              {method.title}
                            </span>

                            <span className="mt-1 block font-poppins text-[10.5px] font-medium leading-5 text-slate-500 sm:text-xs sm:leading-6">
                              {method.description}
                            </span>
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="rounded-[8px] border border-orange-100 bg-orange-50 p-3.5 sm:p-4">
                  <div className="flex gap-2.5 sm:gap-3">
                    <FaLock className="mt-1 shrink-0 text-sm text-[#FF6B00]" />

                    <div>
                      <h4 className="font-poppins text-[12px] font-bold text-orange-900 sm:text-sm">
                        Secure payment note
                      </h4>

                      <p className="mt-1 font-poppins text-[10.5px] font-semibold leading-5 text-orange-800 sm:text-xs sm:leading-6">
                        This step submits your hotel request to TravelEx CRM.
                        Final payment will be verified by TravelEx team.
                      </p>
                    </div>
                  </div>
                </div>

                <label className="flex items-start gap-3 rounded-[5px] bg-[#F8FAFC] p-3.5 sm:p-4">
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(event) => setTermsAccepted(event.target.checked)}
                    className="mt-1 accent-[#00AEEF]"
                  />

                  <span className="font-poppins text-[11.5px] font-medium leading-5 text-slate-600 sm:text-sm sm:leading-6">
                    I confirm that the booking details are correct and agree to
                    proceed with TravelEx review.
                  </span>
                </label>

                <div className="flex flex-col justify-between gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => {
                      setFormError("")
                      setStep(2)
                    }}
                    className="inline-flex items-center justify-center rounded-[5px] border border-slate-200 bg-white px-5 py-2.5 font-poppins text-xs font-semibold text-slate-800 transition hover:border-[#00AEEF] hover:text-[#00AEEF] sm:px-6 sm:py-3 sm:text-sm"
                  >
                    Back
                  </button>

                  <button
                    type="submit"
                    disabled={!termsAccepted || loading}
                    className={`inline-flex items-center justify-center gap-2 rounded-[5px] px-5 py-2.5 font-poppins text-xs font-semibold transition sm:px-6 sm:py-3 sm:text-sm ${
                      termsAccepted && !loading
                        ? "bg-[#FF6B00] text-white hover:bg-[#00AEEF]"
                        : "cursor-not-allowed bg-slate-200 text-slate-400"
                    }`}
                  >
                    {loading ? "Submitting..." : "Submit Hotel Request"}
                    {!loading && <FaArrowRight className="text-[10px] sm:text-xs" />}
                  </button>
                </div>
              </form>
            )}

            {/* Step 4 */}
            {step === 4 && (
              <div className="rounded-[8px] border border-green-100 bg-green-50 p-5 sm:p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-600 text-white sm:h-14 sm:w-14">
                  <FaCheckCircle className="text-lg sm:text-xl" />
                </div>

                <h2 className="mt-4 font-fredoka text-[24px] font-semibold leading-tight text-green-800 sm:text-[32px]">
                  Hotel request submitted
                </h2>

                <p className="mt-2 font-poppins text-[11.5px] font-medium leading-5 text-green-700 sm:text-sm sm:leading-7">
                  Your hotel booking request has been submitted successfully.
                  TravelEx admin team can now view it in the CRM dashboard.
                </p>

                <div className="mt-5 rounded-[5px] bg-white p-4">
                  <p className="font-poppins text-[10px] font-bold uppercase tracking-[0.08em] text-slate-400">
                    Booking Reference
                  </p>

                  <p className="mt-1 font-poppins text-xl font-bold text-slate-950">
                    {bookingRef}
                  </p>
                </div>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <Link
                    to="/hotels"
                    className="inline-flex items-center justify-center rounded-[5px] bg-[#FF6B00] px-5 py-2.5 font-poppins text-xs font-semibold text-white transition hover:bg-[#00AEEF] sm:px-6 sm:py-3 sm:text-sm"
                  >
                    Back to Hotels
                  </Link>

                  <a
                    href={getWhatsappLink(hotel)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-[5px] bg-[#25D366] px-5 py-2.5 font-poppins text-xs font-semibold text-white transition hover:bg-[#00AEEF] sm:px-6 sm:py-3 sm:text-sm"
                  >
                    <FaWhatsapp />
                    Contact TravelEx
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Booking Summary */}
          <aside className="h-fit lg:sticky lg:top-24 lg:self-start">
            <div className="overflow-hidden rounded-[12px] border border-slate-100 bg-white shadow-[0_16px_45px_rgba(15,23,42,0.08)]">
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
                    {hotel.name}
                  </h3>
                </div>
              </div>

              <div className="p-4 sm:p-5">
                <p className="font-poppins text-[8.5px] font-bold uppercase tracking-[0.08em] text-slate-400 sm:text-[10px] sm:tracking-[0.1em]">
                  Booking Summary
                </p>

                <div className="mt-4 grid gap-2 sm:gap-3">
                  <div className="rounded-[5px] bg-[#F8FAFC] px-3.5 py-2.5 sm:px-4 sm:py-3">
                    <p className="font-poppins text-[10px] font-bold text-slate-400 sm:text-xs">
                      Price per night
                    </p>

                    <p className="mt-1 font-poppins text-sm font-semibold text-slate-950 sm:text-base">
                      PKR {startingPrice.toLocaleString()}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    <div className="rounded-[5px] bg-[#F8FAFC] px-3.5 py-2.5 sm:px-4 sm:py-3">
                      <p className="font-poppins text-[10px] font-bold text-slate-400 sm:text-xs">
                        Nights
                      </p>

                      <p className="mt-1 font-poppins text-sm font-semibold text-slate-950 sm:text-base">
                        {nights}
                      </p>
                    </div>

                    <div className="rounded-[5px] bg-[#F8FAFC] px-3.5 py-2.5 sm:px-4 sm:py-3">
                      <p className="font-poppins text-[10px] font-bold text-slate-400 sm:text-xs">
                        Rooms
                      </p>

                      <p className="mt-1 font-poppins text-sm font-semibold text-slate-950 sm:text-base">
                        {rooms}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-[5px] bg-[#F8FAFC] px-3.5 py-2.5 sm:px-4 sm:py-3">
                    <p className="font-poppins text-[10px] font-bold text-slate-400 sm:text-xs">
                      Subtotal
                    </p>

                    <p className="mt-1 font-poppins text-sm font-semibold text-slate-950 sm:text-base">
                      PKR {subtotal.toLocaleString()}
                    </p>
                  </div>

                  <div className="rounded-[5px] bg-[#F8FAFC] px-3.5 py-2.5 sm:px-4 sm:py-3">
                    <p className="font-poppins text-[10px] font-bold text-slate-400 sm:text-xs">
                      Service fee
                    </p>

                    <p className="mt-1 font-poppins text-sm font-semibold text-slate-950 sm:text-base">
                      PKR {serviceFee.toLocaleString()}
                    </p>
                  </div>

                  <div className="rounded-[5px] bg-orange-50 px-3.5 py-3 sm:px-4 sm:py-4">
                    <p className="font-poppins text-[10px] font-bold uppercase tracking-[0.08em] text-[#FF6B00] sm:text-xs sm:tracking-[0.1em]">
                      Estimated Total
                    </p>

                    <p className="mt-1 font-poppins text-[22px] font-semibold text-[#FF6B00] sm:text-2xl">
                      PKR {estimatedTotal.toLocaleString()}
                    </p>
                  </div>
                </div>

                {selectedPayment && (
                  <div className="mt-4 rounded-[5px] border border-slate-100 bg-white p-3.5 sm:mt-5 sm:p-4">
                    <p className="flex items-center gap-2 font-poppins text-xs font-bold text-slate-950 sm:text-sm">
                      <FaReceipt className="text-[#00AEEF]" />
                      {selectedPayment.title}
                    </p>

                    <p className="mt-1 font-poppins text-[10.5px] font-medium leading-5 text-slate-500 sm:text-xs sm:leading-6">
                      {selectedPayment.description}
                    </p>
                  </div>
                )}

                <div className="mt-4 rounded-[5px] bg-[#F8FAFC] p-3.5 sm:mt-5 sm:p-4">
                  <p className="font-poppins text-[9px] font-bold uppercase tracking-[0.08em] text-[#00AEEF] sm:text-[11px] sm:tracking-[0.1em]">
                    Important Note
                  </p>

                  <p className="mt-1.5 font-poppins text-[11px] font-medium leading-5 text-slate-600 sm:mt-2 sm:text-sm sm:leading-7">
                    Final booking and payment verification will be confirmed by
                    TravelEx after review.
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

export default HotelBookingPage