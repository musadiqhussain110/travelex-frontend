import { useEffect, useState } from "react"
import {
  FaArrowLeft,
  FaCheck,
  FaCreditCard,
  FaMoneyBillWave,
  FaMobileAlt,
  FaPlaneArrival,
  FaPlaneDeparture,
} from "react-icons/fa"
import { Link, useNavigate, useParams } from "react-router-dom"

const paymentMethods = [
  {
    title: "Debit/Credit Card",
    subtitle: "Mastercard and VISA Cards",
    icon: <FaCreditCard />,
  },
  {
    title: "JazzCash Mobile Wallet",
    subtitle: "Pay with JazzCash",
    icon: <FaMobileAlt />,
  },
  {
    title: "EasyPaisa Mobile Account",
    subtitle: "Pay with EasyPaisa",
    icon: <FaMobileAlt />,
  },
  {
    title: "Bank Transfer",
    subtitle: "Manual bank payment",
    icon: <FaMoneyBillWave />,
  },
  {
    title: "International Debit/Credit Cards",
    subtitle: "Stripe supported cards",
    icon: <FaCreditCard />,
  },
]

const BookingPage = () => {
  const { serviceType, bookingId } = useParams()
  const navigate = useNavigate()

  const [step, setStep] = useState(1)
  const [selectedPayment, setSelectedPayment] = useState("")
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [error, setError] = useState("")

  const [personalInfo, setPersonalInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address1: "",
    city: "",
    country: "",
  })

  const [guestInfo, setGuestInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  })

  const booking = {
    airline: "Air Blue",
    logo: "https://www.airblue.com/content/filebank?id=553bb04c-35b9-4375-9f92-95acfb67c88e",
    route: "Islamabad International Airport to Jinnah International Airport",
    fromAirport: "Islamabad International Airport",
    toAirport: "Jinnah International Airport",
    takeOff: "12:00",
    landing: "14:00",
    duration: "2 hrs",
    date: "12/15/2022",
    type: "Economy",
    price: 12000,
  }

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("travelexUserLoggedIn")

    if (isLoggedIn !== "true") {
      navigate("/flights")
    }
  }, [navigate])

  const handlePersonalChange = (field, value) => {
    setPersonalInfo((prev) => ({
      ...prev,
      [field]: value,
    }))
    setError("")
  }

  const handleGuestChange = (field, value) => {
    setGuestInfo((prev) => ({
      ...prev,
      [field]: value,
    }))
    setError("")
  }

  const validatePersonalInfo = () => {
    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "address1",
      "city",
      "country",
    ]

    const missingField = requiredFields.find(
      (field) => !personalInfo[field].trim()
    )

    if (missingField) {
      setError("Please fill all required personal details before continuing.")
      return false
    }

    if (!personalInfo.email.includes("@")) {
      setError("Please enter a valid email address.")
      return false
    }

    return true
  }

  const validateGuestInfo = () => {
    const requiredFields = ["firstName", "lastName", "email", "phone"]

    const missingField = requiredFields.find((field) => !guestInfo[field].trim())

    if (missingField) {
      setError("Please fill all guest information before continuing.")
      return false
    }

    if (!guestInfo.email.includes("@")) {
      setError("Please enter a valid guest email address.")
      return false
    }

    return true
  }

  const goToStep = (nextStep) => {
    setError("")

    if (nextStep === 2 && !validatePersonalInfo()) return
    if (nextStep === 3 && !validateGuestInfo()) return

    setStep(nextStep)
  }

  const handleSubmitBooking = () => {
    setError("")

    if (!selectedPayment) {
      setError("Please select a payment method.")
      return
    }

    if (!acceptedTerms) {
      setError("Please accept the terms and conditions before submitting.")
      return
    }

    alert("Booking submitted successfully!")
  }

  return (
    <main className="bg-[#F8FAFC] py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Link
          to="/flights"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-[#00AEEF]"
        >
          <FaArrowLeft />
          Back to flights
        </Link>

        <div className="mb-8 rounded-[5px] bg-white p-5 shadow-md shadow-slate-200/70">
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              ["1", "Personal Details"],
              ["2", "Guest Information"],
              ["3", "Payment"],
            ].map(([number, label]) => (
              <button
                key={number}
                type="button"
                onClick={() => {
                  if (Number(number) === 1) {
                    setStep(1)
                    setError("")
                    return
                  }

                  if (Number(number) === 2) {
                    goToStep(2)
                    return
                  }

                  if (Number(number) === 3) {
                    if (validatePersonalInfo() && validateGuestInfo()) {
                      setStep(3)
                    }
                  }
                }}
                className={`rounded-[5px] px-5 py-4 text-left transition ${
                  step === Number(number)
                    ? "bg-[#00AEEF] text-white"
                    : "bg-slate-50 text-slate-700"
                }`}
              >
                <p className="text-xs font-semibold uppercase tracking-wider">
                  Step {number}
                </p>
                <p className="mt-1 text-sm font-semibold">{label}</p>
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-[5px] border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-600">
            {error}
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[1fr_0.42fr]">
          <section className="rounded-[5px] bg-white p-5 shadow-md shadow-slate-200/70 sm:p-8">
            {step === 1 && (
              <>
                <h1 className="text-3xl font-medium text-slate-950">
                  Personal Details
                </h1>

                <p className="mt-2 text-sm font-semibold !text-slate-500">
                  Fill your basic information to continue booking.
                </p>

                <div className="mt-8 grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-semibold text-slate-950">
                      First Name <span className="text-[#FF6B00]">*</span>
                    </label>
                    <input
                      type="text"
                      value={personalInfo.firstName}
                      onChange={(e) =>
                        handlePersonalChange("firstName", e.target.value)
                      }
                      placeholder="First Name"
                      className="mt-2 w-full rounded-[5px] border border-slate-200 px-4 py-3 text-sm font-semibold outline-none focus:border-[#00AEEF]"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-slate-950">
                      Last Name <span className="text-[#FF6B00]">*</span>
                    </label>
                    <input
                      type="text"
                      value={personalInfo.lastName}
                      onChange={(e) =>
                        handlePersonalChange("lastName", e.target.value)
                      }
                      placeholder="Last Name"
                      className="mt-2 w-full rounded-[5px] border border-slate-200 px-4 py-3 text-sm font-semibold outline-none focus:border-[#00AEEF]"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-slate-950">
                      Email <span className="text-[#FF6B00]">*</span>
                    </label>
                    <input
                      type="email"
                      value={personalInfo.email}
                      onChange={(e) =>
                        handlePersonalChange("email", e.target.value)
                      }
                      placeholder="email@domain.com"
                      className="mt-2 w-full rounded-[5px] border border-slate-200 px-4 py-3 text-sm font-semibold outline-none focus:border-[#00AEEF]"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-slate-950">
                      Phone <span className="text-[#FF6B00]">*</span>
                    </label>
                    <input
                      type="tel"
                      value={personalInfo.phone}
                      onChange={(e) =>
                        handlePersonalChange("phone", e.target.value)
                      }
                      placeholder="Your Phone"
                      className="mt-2 w-full rounded-[5px] border border-slate-200 px-4 py-3 text-sm font-semibold outline-none focus:border-[#00AEEF]"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-slate-950">
                      Address Line 1 <span className="text-[#FF6B00]">*</span>
                    </label>
                    <input
                      type="text"
                      value={personalInfo.address1}
                      onChange={(e) =>
                        handlePersonalChange("address1", e.target.value)
                      }
                      placeholder="Address line 1"
                      className="mt-2 w-full rounded-[5px] border border-slate-200 px-4 py-3 text-sm font-semibold outline-none focus:border-[#00AEEF]"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-slate-950">
                      City <span className="text-[#FF6B00]">*</span>
                    </label>
                    <input
                      type="text"
                      value={personalInfo.city}
                      onChange={(e) =>
                        handlePersonalChange("city", e.target.value)
                      }
                      placeholder="Your City"
                      className="mt-2 w-full rounded-[5px] border border-slate-200 px-4 py-3 text-sm font-semibold outline-none focus:border-[#00AEEF]"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-slate-950">
                      Country <span className="text-[#FF6B00]">*</span>
                    </label>
                    <select
                      value={personalInfo.country}
                      onChange={(e) =>
                        handlePersonalChange("country", e.target.value)
                      }
                      className="mt-2 w-full rounded-[5px] border border-slate-200 px-4 py-3 text-sm font-semibold outline-none focus:border-[#00AEEF]"
                    >
                      <option value="">-- Select --</option>
                      <option>Pakistan</option>
                      <option>UAE</option>
                      <option>Saudi Arabia</option>
                      <option>Turkey</option>
                    </select>
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    type="button"
                    onClick={() => goToStep(2)}
                    className="rounded-[5px] bg-[#FF6B00] px-8 py-3 text-sm font-semibold text-white transition hover:bg-[#00AEEF]"
                  >
                    Continue
                  </button>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <h1 className="text-3xl font-medium text-slate-950">
                  Tickets / Guests Information
                </h1>

                <p className="mt-2 text-sm font-semibold !text-slate-500">
                  Enter passenger details for the selected booking.
                </p>

                <div className="mt-8 overflow-hidden rounded-[5px] border border-slate-200">
                  <div className="bg-slate-50 px-5 py-4 text-sm font-semibold text-slate-950">
                    Guest #1
                  </div>

                  <div className="grid gap-5 p-5 md:grid-cols-2">
                    <input
                      type="text"
                      value={guestInfo.firstName}
                      onChange={(e) =>
                        handleGuestChange("firstName", e.target.value)
                      }
                      placeholder="First Name"
                      className="rounded-[5px] border border-slate-200 px-4 py-3 text-sm font-semibold outline-none focus:border-[#00AEEF]"
                    />

                    <input
                      type="text"
                      value={guestInfo.lastName}
                      onChange={(e) =>
                        handleGuestChange("lastName", e.target.value)
                      }
                      placeholder="Last Name"
                      className="rounded-[5px] border border-slate-200 px-4 py-3 text-sm font-semibold outline-none focus:border-[#00AEEF]"
                    />

                    <input
                      type="email"
                      value={guestInfo.email}
                      onChange={(e) =>
                        handleGuestChange("email", e.target.value)
                      }
                      placeholder="email@domain.com"
                      className="rounded-[5px] border border-slate-200 px-4 py-3 text-sm font-semibold outline-none focus:border-[#00AEEF]"
                    />

                    <input
                      type="tel"
                      value={guestInfo.phone}
                      onChange={(e) =>
                        handleGuestChange("phone", e.target.value)
                      }
                      placeholder="Your Phone"
                      className="rounded-[5px] border border-slate-200 px-4 py-3 text-sm font-semibold outline-none focus:border-[#00AEEF]"
                    />
                  </div>
                </div>

                <div className="mt-8 flex flex-col justify-between gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => {
                      setStep(1)
                      setError("")
                    }}
                    className="rounded-[5px] border border-slate-200 px-8 py-3 text-sm font-semibold text-slate-900"
                  >
                    Back
                  </button>

                  <button
                    type="button"
                    onClick={() => goToStep(3)}
                    className="rounded-[5px] bg-[#FF6B00] px-8 py-3 text-sm font-semibold text-white transition hover:bg-[#00AEEF]"
                  >
                    Continue to Payment
                  </button>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <div className="rounded-[5px] bg-slate-50 p-6 text-center">
                  <p className="text-sm font-semibold !text-slate-500">
                    Amount to be paid
                  </p>
                  <h1 className="mt-2 text-5xl font-semibold text-slate-950">
                    PKR {booking.price.toLocaleString()}
                  </h1>
                </div>

                <h2 className="mt-8 text-2xl font-medium text-slate-950">
                  Select Payment Method
                </h2>

                <div className="mt-5 grid gap-4">
                  {paymentMethods.map((method) => (
                    <button
                      type="button"
                      key={method.title}
                      onClick={() => {
                        setSelectedPayment(method.title)
                        setError("")
                      }}
                      className={`flex items-center justify-between rounded-[5px] border px-5 py-4 text-left transition ${
                        selectedPayment === method.title
                          ? "border-[#00AEEF] bg-sky-50"
                          : "border-slate-200 bg-white hover:border-[#00AEEF]"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-2xl text-[#00AEEF]">
                          {method.icon}
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-slate-950">
                            {method.title}
                          </p>
                          <p className="mt-1 text-xs font-semibold !text-slate-500">
                            {method.subtitle}
                          </p>
                        </div>
                      </div>

                      {selectedPayment === method.title && (
                        <FaCheck className="text-[#00AEEF]" />
                      )}
                    </button>
                  ))}
                </div>

                <label className="mt-6 flex items-center gap-3 text-sm font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(e) => {
                      setAcceptedTerms(e.target.checked)
                      setError("")
                    }}
                    className="h-5 w-5 accent-[#00AEEF]"
                  />
                  I have read and accept the terms and conditions.
                </label>

                <div className="mt-8 flex flex-col justify-between gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => {
                      setStep(2)
                      setError("")
                    }}
                    className="rounded-[5px] border border-slate-200 px-8 py-3 text-sm font-semibold text-slate-900"
                  >
                    Back
                  </button>

                  <button
                    type="button"
                    onClick={handleSubmitBooking}
                    className="rounded-[5px] bg-[#FF6B00] px-8 py-3 text-sm font-semibold text-white transition hover:bg-[#00AEEF]"
                  >
                    Submit Booking
                  </button>
                </div>
              </>
            )}
          </section>

          <aside className="h-fit rounded-[5px] bg-white p-6 shadow-md shadow-slate-200/70 lg:sticky lg:top-28">
            <h2 className="text-2xl font-medium text-slate-950">
              Your Booking
            </h2>

            <img
              src={booking.logo}
              alt={booking.airline}
              className="mt-6 h-28 w-full object-contain"
            />

            <p className="mt-4 font-semibold text-slate-950">
              {booking.airline}
            </p>

            <p className="mt-2 text-sm font-semibold leading-6 !text-slate-600">
              {booking.route}
            </p>

            <p className="mt-3 text-sm font-semibold text-slate-950">
              {booking.duration}
            </p>

            <div className="mt-5 grid grid-cols-2 gap-4">
              <div className="flex gap-3">
                <FaPlaneDeparture className="mt-1 text-2xl text-[#00AEEF]" />
                <div>
                  <p className="font-semibold text-slate-950">
                    {booking.takeOff}
                  </p>
                  <p className="text-xs font-semibold !text-slate-500">
                    {booking.fromAirport}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <FaPlaneArrival className="mt-1 text-2xl text-[#00AEEF]" />
                <div>
                  <p className="font-semibold text-slate-950">
                    {booking.landing}
                  </p>
                  <p className="text-xs font-semibold !text-slate-500">
                    {booking.toAirport}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 border-t border-slate-100 pt-5">
              <div className="flex justify-between text-sm font-semibold text-slate-600">
                <span>Start Date</span>
                <span>{booking.date}</span>
              </div>

              <div className="mt-3 flex justify-between text-sm font-semibold text-slate-600">
                <span>Duration</span>
                <span>{booking.duration}</span>
              </div>

              <div className="mt-3 flex justify-between text-sm font-semibold text-slate-600">
                <span>{booking.type}</span>
                <span>1</span>
              </div>
            </div>

            <div className="mt-6 border-t border-slate-100 pt-5">
              <div className="flex justify-between text-sm font-semibold text-slate-700">
                <span>
                  {booking.type}: 1 × PKR {booking.price.toLocaleString()}
                </span>
                <span>PKR {booking.price.toLocaleString()}</span>
              </div>

              <div className="mt-4 flex overflow-hidden rounded-[5px] border border-slate-200">
                <input
                  type="text"
                  placeholder="Coupon code"
                  className="min-w-0 flex-1 px-4 py-3 text-sm font-semibold outline-none"
                />
                <button className="bg-[#FF6B00] px-5 text-sm font-semibold text-white">
                  Apply
                </button>
              </div>

              <div className="mt-5 flex justify-between text-xl font-semibold text-slate-950">
                <span>Total:</span>
                <span className="text-[#00AEEF]">
                  PKR {booking.price.toLocaleString()}
                </span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}

export default BookingPage