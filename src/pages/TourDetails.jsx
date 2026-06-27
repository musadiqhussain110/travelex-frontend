import { Link, useParams } from "react-router-dom"
import {
  FaArrowLeft,
  FaArrowRight,
  FaCheckCircle,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaRegClock,
  FaRoute,
  FaWhatsapp,
} from "react-icons/fa"

import { tours } from "../data/tours"
import Footer from "../components/Footer"

const getWhatsappLink = (tour) =>
  `https://wa.me/923111444192?text=${encodeURIComponent(
    `Assalamualaikum TravelEx, I need guidance about ${tour.title}. Please share details.`
  )}`

const TourDetails = () => {
  const { id } = useParams()
  const tour = tours.find((item) => item.id === id)

  if (!tour) {
    return (
      <main className="bg-[#F8FAFC]">
        <section className="bg-[#F8FAFC] px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-[1180px]">
            <div className="rounded-[12px] border border-slate-100 bg-white p-5 text-center shadow-[0_10px_30px_rgba(15,23,42,0.06)] sm:p-8">
              <h1 className="font-fredoka text-[24px] font-semibold text-slate-950 sm:text-[34px]">
                Tour not found
              </h1>

              <p className="mx-auto mt-2 max-w-2xl font-poppins text-[11.5px] font-medium leading-5 text-slate-600 sm:mt-3 sm:text-sm sm:leading-7">
                The tour you are looking for does not exist or may have been
                moved.
              </p>

              <Link
                to="/tours"
                className="mt-5 inline-flex items-center justify-center gap-2 rounded-[5px] bg-[#FF6B00] px-5 py-2.5 font-poppins text-xs font-semibold text-white transition hover:bg-[#00AEEF] sm:mt-6 sm:px-6 sm:py-3 sm:text-sm"
              >
                <FaArrowLeft className="text-[10px] sm:text-xs" />
                Back to Tours
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    )
  }

  const bookNowPath = `/booking/tours/${tour.id}`
  const tourPoints = tour.points || []
  const tourInclusions = tour.inclusions || []

  const quickFacts = [
    {
      label: "Duration",
      value: tour.duration || "Flexible",
      icon: FaRegClock,
    },
    {
      label: "Location",
      value: tour.location || "International",
      icon: FaMapMarkerAlt,
    },
    {
      label: "Tour Type",
      value: tour.type || "Custom Tour",
      icon: FaRoute,
    },
  ]

  return (
    <main className="bg-[#F8FAFC]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-950">
        <img
          src={tour.image}
          alt={tour.title}
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/65 via-slate-950/45 to-slate-950/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/45 via-transparent to-transparent" />

        <div className="relative z-10 mx-auto max-w-[1340px] px-4 py-7 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
          <div className="max-w-5xl">
            <Link
              to="/tours"
              className="mb-2 inline-flex items-center gap-1.5 font-poppins text-[9px] font-semibold text-white/75 transition hover:text-[#00AEEF] sm:mb-6 sm:gap-2 sm:text-sm"
            >
              <FaArrowLeft className="text-[8px] sm:text-xs" />
              Back to tours
            </Link>

            <div className="mb-2 flex flex-wrap items-center gap-1.5 sm:mb-4 sm:gap-3">
              <span className="inline-flex h-[27px] items-center rounded-full border border-white/15 bg-white/10 px-2.5 font-poppins text-[7.5px] font-bold uppercase tracking-[0.14em] text-[#00AEEF] backdrop-blur sm:h-auto sm:px-4 sm:py-2 sm:text-[11px] sm:tracking-[0.16em]">
                {tour.type || "Tour Plan"}
              </span>

              <span className="inline-flex h-[27px] items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-2.5 font-poppins text-[8.5px] font-semibold text-white/85 backdrop-blur sm:h-auto sm:gap-2 sm:px-4 sm:py-2 sm:text-xs">
                <FaMapMarkerAlt className="text-[#FF6B00]" />
                {tour.location}
              </span>

              <span className="inline-flex h-[27px] items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-2.5 font-poppins text-[8.5px] font-semibold text-white/85 backdrop-blur sm:h-auto sm:gap-2 sm:px-4 sm:py-2 sm:text-xs">
                <FaRegClock className="text-[#FF6B00]" />
                {tour.duration || "Flexible"}
              </span>
            </div>

            <h1 className="font-fredoka text-[18px] font-semibold leading-[1.08] text-white sm:text-[46px] sm:uppercase sm:leading-[1.1] lg:text-[54px]">
              {tour.title}
            </h1>

            <p className="mt-1 max-w-3xl font-poppins text-[9px] font-medium leading-4 text-white/85 sm:mt-4 sm:text-base sm:leading-7">
              <span className="sm:hidden">Custom tour support.</span>

              <span className="hidden sm:inline">{tour.overview}</span>
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
                href={getWhatsappLink(tour)}
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
          <div className="grid grid-cols-3 gap-2 rounded-[12px] border border-slate-100 bg-white p-2.5 shadow-[0_14px_36px_rgba(15,23,42,0.09)] sm:grid-cols-3 sm:gap-3 sm:p-4">
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

      {/* Details */}
      <section className="bg-[#F8FAFC] py-8 sm:py-14">
        <div className="mx-auto grid max-w-[1440px] gap-5 px-4 sm:px-6 lg:grid-cols-[1fr_360px] lg:gap-6 lg:px-8">
          <div className="grid gap-4 sm:gap-6">
            {/* Overview */}
            <div className="overflow-hidden rounded-[12px] border border-slate-100 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
              <img
                src={tour.image}
                alt={tour.title}
                className="hidden h-72 w-full object-cover sm:block"
              />

              <div className="p-4 sm:p-8">
                <p className="mb-1.5 font-poppins text-[8.5px] font-bold uppercase tracking-[0.24em] text-[#00AEEF] sm:mb-2 sm:text-[12px] sm:tracking-[0.18em]">
                  Tour Overview
                </p>

                <h2 className="font-fredoka text-[20px] font-semibold leading-[1.08] text-slate-950 sm:text-[32px]">
                  International tour plan with TravelEx support
                </h2>

                <p className="mt-2 font-poppins text-[11.5px] font-medium leading-5 text-slate-600 sm:mt-3 sm:text-base sm:leading-8">
                  {tour.overview}
                </p>
              </div>
            </div>

            {/* Highlights */}
            <div className="rounded-[12px] border border-slate-100 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.06)] sm:p-7">
              <h2 className="font-fredoka text-[21px] font-semibold text-slate-950 sm:text-[26px]">
                Tour Highlights
              </h2>

              <div className="mt-3 grid gap-2 sm:mt-5 sm:grid-cols-2 sm:gap-3">
                {tourPoints.map((item) => (
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

            {/* Inclusions */}
            <div className="rounded-[12px] border border-slate-100 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.06)] sm:p-7">
              <h2 className="font-fredoka text-[21px] font-semibold text-slate-950 sm:text-[26px]">
                What can be included?
              </h2>

              <div className="mt-3 grid gap-2 sm:mt-5 sm:grid-cols-2 sm:gap-3">
                {tourInclusions.map((item) => (
                  <p
                    key={item}
                    className="flex items-start gap-2.5 rounded-[5px] bg-[#F8FAFC] px-3.5 py-2.5 font-poppins text-[11px] font-semibold leading-5 text-slate-700 sm:gap-3 sm:px-4 sm:py-3 sm:text-sm sm:leading-6"
                  >
                    <FaCheckCircle className="mt-1 shrink-0 text-[12px] text-[#FF6B00] sm:text-base" />
                    {item}
                  </p>
                ))}
              </div>

              <p className="mt-4 rounded-[5px] bg-sky-50 px-3.5 py-3 font-poppins text-[11px] font-semibold leading-5 text-slate-600 sm:mt-6 sm:px-4 sm:py-4 sm:text-sm sm:leading-7">
                {tour.note ||
                  "Final inclusions may vary based on destination, hotel category, travel dates and selected package."}
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="h-fit lg:sticky lg:top-24 lg:self-start">
            <div className="overflow-hidden rounded-[12px] border border-slate-100 bg-white shadow-[0_16px_45px_rgba(15,23,42,0.08)]">
              <div className="relative h-36 overflow-hidden sm:h-44">
                <img
                  src={tour.image}
                  alt={tour.title}
                  className="h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />

                <div className="absolute bottom-3 left-4 right-4 sm:bottom-4">
                  <p className="font-poppins text-[8.5px] font-bold uppercase tracking-[0.16em] text-white/65 sm:text-[10px]">
                    Selected Tour
                  </p>

                  <h3 className="mt-1 font-fredoka text-[21px] font-semibold leading-tight text-white sm:text-[24px]">
                    {tour.title}
                  </h3>
                </div>
              </div>

              <div className="p-4 sm:p-5">
                <p className="font-poppins text-[8.5px] font-bold uppercase tracking-[0.16em] text-slate-400 sm:text-[10px]">
                  Starting Price
                </p>

                <p className="mt-1 font-poppins text-[24px] font-semibold leading-none text-[#FF6B00] sm:text-[28px]">
                  {tour.price}
                </p>

                <p className="mt-2 font-poppins text-[11px] font-medium leading-5 text-slate-500 sm:text-xs sm:leading-6">
                  Final quote depends on travel date, hotel category, number of
                  travelers, airline, and availability.
                </p>

                <div className="mt-4 grid gap-2 sm:mt-5 sm:gap-3">
                  <Link
                    to={bookNowPath}
                    className="inline-flex items-center justify-center gap-2 rounded-[5px] bg-[#FF6B00] px-5 py-2.5 font-poppins text-xs font-semibold text-white transition hover:bg-[#00AEEF] sm:px-6 sm:py-3 sm:text-sm"
                  >
                    Book Tour
                    <FaArrowRight className="text-[10px] sm:text-xs" />
                  </Link>

                  <a
                    href={getWhatsappLink(tour)}
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
                    Want changes?
                  </p>

                  <p className="mt-1.5 font-poppins text-[11px] font-medium leading-5 text-slate-600 sm:mt-2 sm:text-sm sm:leading-7">
                    Share your travel date, number of travelers, hotel
                    preference, and budget. TravelEx can customize your tour
                    plan.
                  </p>
                </div>

                <div className="mt-4 grid gap-2 sm:mt-5 sm:gap-3">
                  {[
                    "Custom tour planning",
                    "Hotel and transport support",
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

export default TourDetails