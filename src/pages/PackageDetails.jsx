import { Link, useParams } from "react-router-dom"
import {
  FaArrowLeft,
  FaArrowRight,
  FaCheckCircle,
  FaHotel,
  FaInfoCircle,
  FaMapMarkerAlt,
  FaPassport,
  FaPhoneAlt,
  FaPlaneDeparture,
  FaRegClock,
  FaStar,
  FaTag,
  FaUsers,
  FaWhatsapp,
} from "react-icons/fa"

import { umrahPackages as packages } from "../data/umrahPackagesData"
import Footer from "../components/Footer"

const requiredInfo = [
  "Full name and contact number",
  "Departure city",
  "Preferred travel month or date",
  "Number of adults and children",
  "Room sharing preference",
  "Passport availability",
  "Hotel category preference",
  "Any special family or group requirement",
]

const bookingSteps = [
  {
    title: "Open booking form",
    description:
      "Click Book Now and fill your booking request on the dedicated booking page.",
  },
  {
    title: "Share travel details",
    description:
      "Provide departure city, travel date, number of passengers, and hotel preference.",
  },
  {
    title: "Consultant confirmation",
    description:
      "TravelEx team will confirm package availability, hotel options, and final price.",
  },
  {
    title: "Complete booking process",
    description:
      "After confirmation, our team will guide you regarding documents, payment, and next steps.",
  },
]

const faqs = [
  {
    question: "Is the package price fixed?",
    answer:
      "Package price may change depending on travel dates, airline fare, hotel availability, room sharing, and final package selection.",
  },
  {
    question: "Can this package be customized?",
    answer:
      "Yes. TravelEx can customize Umrah packages according to budget, travel dates, number of passengers, and hotel preference.",
  },
  {
    question: "Do I need to pay immediately?",
    answer:
      "No. First you can submit a booking request or ask on WhatsApp. Our consultant will confirm details before payment guidance.",
  },
]

const getWhatsappLink = (pkg) =>
  `https://wa.me/923111444192?text=${encodeURIComponent(
    `Assalamualaikum TravelEx, I am interested in ${pkg.title}. Please guide me about availability and booking.`
  )}`

const PackageDetails = () => {
  const { id } = useParams()
  const pkg = packages.find((item) => item.id === id)

  if (!pkg) {
    return (
      <main className="bg-[#F8FAFC]">
        <section className="bg-[#F8FAFC] px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-[1180px]">
            <div className="rounded-[12px] border border-slate-100 bg-white p-5 text-center shadow-[0_10px_30px_rgba(15,23,42,0.06)] sm:p-8">
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

  const bookNowPath = `/booking/umrah/${pkg.id}`

  const bestFor = pkg.bestFor || []
  const highlights = pkg.highlights || []
  const inclusions = pkg.inclusions || []

  const quickFacts = [
    {
      label: "Duration",
      value: pkg.duration || "On request",
      icon: FaRegClock,
    },
    {
      label: "Departure",
      value: pkg.from || "Flexible",
      icon: FaPlaneDeparture,
    },
    {
      label: "Plan Type",
      value: pkg.type || pkg.badge || "Umrah Plan",
      icon: FaTag,
    },
    {
      label: "Hotel Info",
      value: pkg.hotelInfo || "Available",
      icon: FaHotel,
    },
  ]

  return (
    <main className="bg-[#F8FAFC]">
      {/* Detail Hero */}
      <section className="relative overflow-hidden bg-slate-950">
        <img
          src={pkg.image}
          alt={pkg.title}
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/65 via-slate-950/45 to-slate-950/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/45 via-transparent to-transparent" />

        <div className="relative z-10 mx-auto max-w-[1340px] px-4 py-7 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
          <div className="max-w-4xl">
            <Link
              to="/umrah"
              className="mb-2 inline-flex items-center gap-1.5 font-poppins text-[9px] font-semibold text-white/75 transition hover:text-[#00AEEF] sm:mb-6 sm:gap-2 sm:text-sm"
            >
              <FaArrowLeft className="text-[8px] sm:text-xs" />
              Back to packages
            </Link>

            <div className="mb-2 flex flex-wrap items-center gap-1.5 sm:mb-4 sm:gap-3">
              <span className="inline-flex h-[27px] items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-2.5 font-poppins text-[7.5px] font-bold uppercase tracking-[0.14em] text-[#00AEEF] backdrop-blur sm:h-auto sm:gap-2 sm:px-4 sm:py-2 sm:text-[11px] sm:tracking-[0.16em]">
                <FaTag className="text-[8px] sm:text-[10px]" />
                {pkg.badge}
              </span>

              <span className="inline-flex h-[27px] items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-2.5 font-poppins text-[8.5px] font-semibold text-white/85 backdrop-blur sm:h-auto sm:gap-2 sm:px-4 sm:py-2 sm:text-xs">
                <FaStar className="text-[#FF6B00]" />
                {pkg.rating}
              </span>

              <span className="inline-flex h-[27px] items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-2.5 font-poppins text-[8.5px] font-semibold text-white/85 backdrop-blur sm:h-auto sm:gap-2 sm:px-4 sm:py-2 sm:text-xs">
                <FaRegClock className="text-[#FF6B00]" />
                {pkg.duration}
              </span>
            </div>

            <h1 className="font-fredoka text-[18px] font-semibold leading-[1.08] text-white sm:text-[46px] sm:uppercase sm:leading-[1.1] lg:text-[54px]">
              {pkg.title}
            </h1>

            <p className="mt-1 max-w-3xl font-poppins text-[9px] font-medium leading-4 text-white/85 sm:mt-4 sm:text-base sm:leading-7">
              <span className="sm:hidden">
                Hotel, visa and travel support.
              </span>

              <span className="hidden sm:inline">{pkg.overview}</span>
            </p>

            <div className="mt-3 flex flex-col gap-2 sm:mt-6 sm:flex-row sm:gap-3">
              <Link
                to={bookNowPath}
                className="inline-flex items-center justify-center gap-2 rounded-[5px] bg-[#FF6B00] px-5 py-2.5 font-poppins text-xs font-semibold text-white transition hover:bg-[#00AEEF] sm:px-6 sm:py-3 sm:text-sm"
              >
                Book Now
                <FaArrowRight className="text-[10px] sm:text-xs" />
              </Link>

              <a
                href={getWhatsappLink(pkg)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-[5px] bg-[#25D366] px-5 py-2.5 font-poppins text-xs font-semibold text-white transition hover:bg-[#00AEEF] sm:px-6 sm:py-3 sm:text-sm"
              >
                <FaWhatsapp />
                Ask on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Facts */}
      <section className="relative z-20 -mt-4 bg-transparent sm:-mt-8">
        <div className="mx-auto max-w-[1180px] px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-2 rounded-[12px] border border-slate-100 bg-white p-2.5 shadow-[0_14px_36px_rgba(15,23,42,0.09)] sm:grid-cols-2 sm:gap-3 sm:p-4 lg:grid-cols-4">
            {quickFacts.map((item) => {
              const Icon = item.icon

              return (
                <div
                  key={item.label}
                  className="rounded-[5px] bg-[#F8FAFC] p-2.5 sm:p-4"
                >
                  <Icon className="text-[13px] text-[#00AEEF] sm:text-xl" />

                  <p className="mt-1.5 font-poppins text-[7px] font-bold uppercase tracking-[0.14em] text-slate-400 sm:mt-3 sm:text-[10px] sm:tracking-[0.16em]">
                    {item.label}
                  </p>

                  <p className="mt-0.5 line-clamp-2 font-poppins text-[9px] font-semibold leading-3.5 text-slate-950 sm:mt-1 sm:text-sm sm:leading-6">
                    {item.value}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Main Details */}
      <section className="bg-[#F8FAFC] py-8 sm:py-14">
        <div className="mx-auto grid max-w-[1440px] gap-5 px-4 sm:px-6 lg:grid-cols-[1fr_360px] lg:gap-6 lg:px-8">
          {/* Detail Content */}
          <div className="grid gap-4 sm:gap-6">
            {/* Overview */}
            <div className="rounded-[12px] border border-slate-100 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.06)] sm:p-7">
              <p className="mb-1.5 font-poppins text-[8.5px] font-bold uppercase tracking-[0.24em] text-[#00AEEF] sm:mb-2 sm:text-[12px] sm:tracking-[0.18em]">
                Package Overview
              </p>

              <h2 className="font-fredoka text-[20px] font-semibold leading-[1.08] text-slate-950 sm:text-[36px]">
                A guided Umrah plan with TravelEx support
              </h2>

              <p className="mt-2 font-poppins text-[11.5px] font-medium leading-5 text-slate-600 sm:mt-3 sm:text-base sm:leading-8">
                {pkg.overview}
              </p>

              {bestFor.length > 0 && (
                <div className="mt-4 grid gap-2 sm:mt-5 sm:grid-cols-3 sm:gap-3">
                  {bestFor.map((item) => (
                    <p
                      key={item}
                      className="flex items-center gap-2 rounded-[5px] bg-[#F8FAFC] px-3.5 py-2.5 font-poppins text-[11.5px] font-semibold text-slate-700 sm:px-4 sm:py-3 sm:text-sm"
                    >
                      <FaUsers className="shrink-0 text-[#00AEEF]" />
                      {item}
                    </p>
                  ))}
                </div>
              )}
            </div>

            {/* Highlights and Inclusions */}
            <div className="grid gap-4 lg:grid-cols-2 lg:gap-6">
              <div className="rounded-[12px] border border-slate-100 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.06)] sm:p-6">
                <h2 className="font-fredoka text-[21px] font-semibold text-slate-950 sm:text-[26px]">
                  Package Highlights
                </h2>

                <div className="mt-3 grid gap-2 sm:mt-5 sm:gap-3">
                  {highlights.map((item) => (
                    <p
                      key={item}
                      className="flex items-start gap-2.5 rounded-[5px] bg-[#F8FAFC] px-3.5 py-2.5 font-poppins text-[11px] font-semibold leading-5 text-slate-700 sm:gap-3 sm:px-4 sm:py-3 sm:text-sm sm:leading-6"
                    >
                      <FaCheckCircle className="mt-1 shrink-0 text-[12px] text-[#00AEEF] sm:text-base" />
                      {item}
                    </p>
                  ))}
                </div>
              </div>

              <div className="rounded-[12px] border border-slate-100 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.06)] sm:p-6">
                <h2 className="font-fredoka text-[21px] font-semibold text-slate-950 sm:text-[26px]">
                  What Can Be Included?
                </h2>

                <div className="mt-3 grid gap-2 sm:mt-5 sm:gap-3">
                  {inclusions.map((item) => (
                    <p
                      key={item}
                      className="flex items-start gap-2.5 rounded-[5px] bg-[#F8FAFC] px-3.5 py-2.5 font-poppins text-[11px] font-semibold leading-5 text-slate-700 sm:gap-3 sm:px-4 sm:py-3 sm:text-sm sm:leading-6"
                    >
                      <FaCheckCircle className="mt-1 shrink-0 text-[12px] text-[#FF6B00] sm:text-base" />
                      {item}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            {/* Stay Plan */}
            <div className="rounded-[12px] border border-slate-100 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.06)] sm:p-7">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="mb-1.5 font-poppins text-[8.5px] font-bold uppercase tracking-[0.24em] text-[#00AEEF] sm:mb-2 sm:text-[12px] sm:tracking-[0.18em]">
                    Stay Plan
                  </p>

                  <h2 className="font-fredoka text-[20px] font-semibold leading-[1.08] text-slate-950 sm:text-[30px]">
                    Makkah and Madinah stay guidance
                  </h2>
                </div>

                <span className="inline-flex w-fit rounded-full bg-orange-50 px-3 py-1.5 font-poppins text-[10px] font-bold text-[#FF6B00] sm:px-4 sm:py-2 sm:text-xs">
                  Subject to availability
                </span>
              </div>

              <div className="mt-4 grid gap-2 sm:mt-5 sm:grid-cols-3 sm:gap-4">
                <div className="rounded-[5px] bg-[#F8FAFC] p-3.5 sm:p-5">
                  <FaMapMarkerAlt className="text-lg text-[#00AEEF] sm:text-xl" />

                  <p className="mt-2 font-poppins text-[8px] font-bold uppercase tracking-[0.16em] text-slate-400 sm:mt-3 sm:text-[10px]">
                    Makkah
                  </p>

                  <p className="mt-1 font-poppins text-xs font-semibold text-slate-950 sm:text-base">
                    {pkg.makkahNights || "Based on package"}
                  </p>
                </div>

                <div className="rounded-[5px] bg-[#F8FAFC] p-3.5 sm:p-5">
                  <FaMapMarkerAlt className="text-lg text-[#00AEEF] sm:text-xl" />

                  <p className="mt-2 font-poppins text-[8px] font-bold uppercase tracking-[0.16em] text-slate-400 sm:mt-3 sm:text-[10px]">
                    Madinah
                  </p>

                  <p className="mt-1 font-poppins text-xs font-semibold text-slate-950 sm:text-base">
                    {pkg.madinahNights || "Based on package"}
                  </p>
                </div>

                <div className="rounded-[5px] bg-[#F8FAFC] p-3.5 sm:p-5">
                  <FaHotel className="text-lg text-[#00AEEF] sm:text-xl" />

                  <p className="mt-2 font-poppins text-[8px] font-bold uppercase tracking-[0.16em] text-slate-400 sm:mt-3 sm:text-[10px]">
                    Hotel
                  </p>

                  <p className="mt-1 font-poppins text-xs font-semibold text-slate-950 sm:text-base">
                    {pkg.hotelInfo || "Based on availability"}
                  </p>
                </div>
              </div>
            </div>

            {/* Booking Process */}
            <div className="rounded-[12px] border border-slate-100 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.06)] sm:p-7">
              <p className="mb-1.5 font-poppins text-[8.5px] font-bold uppercase tracking-[0.24em] text-[#00AEEF] sm:mb-2 sm:text-[12px] sm:tracking-[0.18em]">
                Booking Process
              </p>

              <h2 className="font-fredoka text-[20px] font-semibold leading-[1.08] text-slate-950 sm:text-[30px]">
                How to book this package
              </h2>

              <div className="mt-4 grid gap-2 sm:mt-5 sm:gap-4">
                {bookingSteps.map((step, index) => (
                  <div
                    key={step.title}
                    className="grid gap-2 rounded-[5px] border border-slate-100 bg-[#F8FAFC] p-3.5 sm:grid-cols-[auto_1fr] sm:gap-3 sm:p-4"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FF6B00]/10 font-poppins text-xs font-bold text-[#FF6B00] sm:h-10 sm:w-10 sm:text-sm">
                      {index + 1}
                    </span>

                    <div>
                      <h3 className="font-fredoka text-[17px] font-semibold text-slate-950 sm:text-[20px]">
                        {step.title}
                      </h3>

                      <p className="mt-1 font-poppins text-[11px] font-medium leading-5 text-slate-600 sm:text-sm sm:leading-7">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Required Information */}
            <div className="rounded-[12px] border border-slate-100 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.06)] sm:p-7">
              <p className="mb-1.5 font-poppins text-[8.5px] font-bold uppercase tracking-[0.24em] text-[#00AEEF] sm:mb-2 sm:text-[12px] sm:tracking-[0.18em]">
                Required Information
              </p>

              <h2 className="font-fredoka text-[20px] font-semibold leading-[1.08] text-slate-950 sm:text-[30px]">
                Keep these details ready
              </h2>

              <div className="mt-4 grid gap-2 sm:mt-5 sm:grid-cols-2 sm:gap-3">
                {requiredInfo.map((item) => (
                  <p
                    key={item}
                    className="flex items-start gap-2.5 rounded-[5px] bg-[#F8FAFC] px-3.5 py-2.5 font-poppins text-[11px] font-semibold leading-5 text-slate-700 sm:gap-3 sm:px-4 sm:py-3 sm:text-sm sm:leading-6"
                  >
                    <FaPassport className="mt-1 shrink-0 text-[12px] text-[#00AEEF] sm:text-base" />
                    {item}
                  </p>
                ))}
              </div>
            </div>

            {/* Important Note */}
            <div className="rounded-[12px] border border-[#FF6B00]/15 bg-orange-50 p-4 sm:p-6">
              <div className="flex gap-2.5 sm:gap-3">
                <FaInfoCircle className="mt-1 shrink-0 text-sm text-[#FF6B00] sm:text-base" />

                <div>
                  <h3 className="font-fredoka text-[20px] font-semibold leading-tight text-slate-950 sm:text-[22px]">
                    Important pricing note
                  </h3>

                  <p className="mt-1.5 font-poppins text-[11px] font-semibold leading-5 text-orange-800 sm:mt-2 sm:text-sm sm:leading-7">
                    {pkg.note ||
                      "Final price may change based on travel dates, airline fare, hotel availability and final package selection."}
                  </p>
                </div>
              </div>
            </div>

            {/* FAQ */}
            <div className="rounded-[12px] border border-slate-100 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.06)] sm:p-7">
              <p className="mb-1.5 font-poppins text-[8.5px] font-bold uppercase tracking-[0.24em] text-[#00AEEF] sm:mb-2 sm:text-[12px] sm:tracking-[0.18em]">
                Common Questions
              </p>

              <h2 className="font-fredoka text-[20px] font-semibold leading-[1.08] text-slate-950 sm:text-[30px]">
                Before you book
              </h2>

              <div className="mt-4 grid gap-2 sm:mt-5 sm:gap-3">
                {faqs.map((faq) => (
                  <div
                    key={faq.question}
                    className="rounded-[5px] bg-[#F8FAFC] p-3.5 sm:p-4"
                  >
                    <h3 className="font-poppins text-[12px] font-bold text-slate-950 sm:text-sm">
                      {faq.question}
                    </h3>

                    <p className="mt-1.5 font-poppins text-[11px] font-medium leading-5 text-slate-600 sm:mt-2 sm:text-sm sm:leading-7">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sticky Booking Sidebar */}
          <aside className="h-fit lg:sticky lg:top-24 lg:self-start">
            <div className="overflow-hidden rounded-[12px] border border-slate-100 bg-white shadow-[0_16px_45px_rgba(15,23,42,0.08)]">
              <div className="relative h-36 overflow-hidden sm:h-44">
                <img
                  src={pkg.image}
                  alt={pkg.title}
                  className="h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />

                <div className="absolute bottom-3 left-4 right-4 sm:bottom-4">
                  <p className="font-poppins text-[8.5px] font-bold uppercase tracking-[0.16em] text-white/65 sm:text-[10px]">
                    Selected Package
                  </p>

                  <h3 className="mt-1 font-fredoka text-[21px] font-semibold leading-tight text-white sm:text-[24px]">
                    {pkg.title}
                  </h3>
                </div>
              </div>

              <div className="p-4 sm:p-5">
                <p className="font-poppins text-[8.5px] font-bold uppercase tracking-[0.16em] text-slate-400 sm:text-[10px]">
                  {pkg.pricePrefix || "From"}
                </p>

                <p className="mt-1 font-poppins text-[24px] font-semibold leading-none text-[#FF6B00] sm:text-[28px]">
                  {pkg.price}
                </p>

                <p className="mt-2 font-poppins text-[11px] font-medium leading-5 text-slate-500 sm:text-xs sm:leading-6">
                  Final quote depends on travel date, hotel category, airline,
                  room sharing, and availability.
                </p>

                <div className="mt-4 grid gap-2 sm:mt-5 sm:gap-3">
                  <Link
                    to={bookNowPath}
                    className="inline-flex items-center justify-center gap-2 rounded-[5px] bg-[#FF6B00] px-5 py-2.5 font-poppins text-xs font-semibold text-white transition hover:bg-[#00AEEF] sm:px-6 sm:py-3 sm:text-sm"
                  >
                    Book Now
                    <FaArrowRight className="text-[10px] sm:text-xs" />
                  </Link>

                  <a
                    href={getWhatsappLink(pkg)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-[5px] bg-[#25D366] px-5 py-2.5 font-poppins text-xs font-semibold text-white transition hover:bg-[#00AEEF] sm:px-6 sm:py-3 sm:text-sm"
                  >
                    <FaWhatsapp />
                    WhatsApp Inquiry
                  </a>

                  <a
                    href="tel:03111444192"
                    className="inline-flex items-center justify-center gap-2 rounded-[5px] border border-slate-200 bg-white px-5 py-2.5 font-poppins text-xs font-semibold text-slate-900 transition hover:border-[#00AEEF] hover:text-[#00AEEF] sm:px-6 sm:py-3 sm:text-sm"
                  >
                    <FaPhoneAlt />
                    Call Now
                  </a>
                </div>

                <div className="mt-4 rounded-[5px] bg-[#F8FAFC] p-3.5 sm:mt-5 sm:p-4">
                  <p className="font-poppins text-[9px] font-bold uppercase tracking-[0.16em] text-[#00AEEF] sm:text-[11px]">
                    Need customization?
                  </p>

                  <p className="mt-1.5 font-poppins text-[11px] font-medium leading-5 text-slate-600 sm:mt-2 sm:text-sm sm:leading-7">
                    Share your departure city, travel date, hotel preference,
                    budget, and number of passengers for a custom Umrah plan.
                  </p>
                </div>

                <div className="mt-4 grid gap-2 sm:mt-5 sm:gap-3">
                  {[
                    "Consultant support",
                    "Package customization",
                    "WhatsApp guidance",
                  ].map((item) => (
                    <p
                      key={item}
                      className="flex items-center gap-2 font-poppins text-[11.5px] font-semibold text-slate-700 sm:text-sm"
                    >
                      <FaCheckCircle className="text-[#00AEEF]" />
                      {item}
                    </p>
                  ))}
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

export default PackageDetails