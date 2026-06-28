import { useState } from "react"
import { Link } from "react-router-dom"
import {
  FaArrowRight,
  FaCheckCircle,
  FaMapMarkerAlt,
  FaStar,
  FaTag,
  FaWhatsapp,
} from "react-icons/fa"

import Footer from "../components/Footer"
import { hotels } from "../data/hotelsData"

const starFilters = ["All", "5", "4", "3"]

const whatsappLink =
  "https://wa.me/923111444192?text=Assalamualaikum%20TravelEx%2C%20I%20need%20hotel%20booking%20guidance."

const cardRowClass =
  "-mx-4 flex gap-3 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 lg:grid-cols-3 xl:grid-cols-4"

const HotelsPage = () => {
  const [selectedStar, setSelectedStar] = useState("All")

  const filteredHotels =
    selectedStar === "All"
      ? hotels
      : hotels.filter((hotel) => hotel.stars === Number(selectedStar))

  return (
    <main className="relative bg-[#F8FAFC]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-950">
        <img
          src={hotels[1]?.image || hotels[0]?.image}
          alt="Hotel booking by TravelEx"
          loading="eager"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/65 via-slate-950/45 to-slate-950/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/45 via-transparent to-transparent" />

        <div className="relative z-10 mx-auto max-w-[1340px] px-4 py-7 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
          <div className="max-w-4xl">
            <p className="font-poppins text-[8px] font-bold uppercase tracking-[0.08em] text-[#00AEEF] sm:text-[12px] sm:tracking-[0.12em]">
              Hotel Booking
            </p>

            <h1 className="mt-1 font-fredoka text-[17px] font-semibold leading-[1.08] text-white sm:mt-2 sm:text-[46px] sm:uppercase sm:leading-[1.1] lg:text-[54px]">
              <span className="sm:hidden">Hotel Stay Options</span>
              <span className="hidden sm:inline">
                Search hotel options for your next stay
              </span>
            </h1>

            <p className="mt-1 max-w-3xl font-poppins text-[9px] font-medium leading-4 text-white/85 sm:mt-3 sm:text-base sm:leading-7">
              <span className="sm:hidden">
                Comfort stays with booking support.
              </span>

              <span className="hidden sm:inline">
                Find hotel options for Umrah, family trips, business travel, and
                international destinations with TravelEx support.
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* Hotels */}
      <section
        id="hotels"
        className="bg-[#F8FAFC] pb-5 pt-4 sm:pb-16 sm:pt-10"
      >
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <div className="mb-2 flex flex-col gap-2 md:mb-10 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-1.5 font-poppins text-[8.5px] font-bold uppercase tracking-[0.08em] text-[#00AEEF] sm:mb-2 sm:text-[12px] sm:tracking-[0.12em]">
                Available Stays
              </p>

              <h2 className="max-w-3xl font-fredoka text-[18px] font-semibold leading-[1.08] text-slate-950 sm:text-[44px]">
                <span className="sm:hidden">Choose Your Hotel</span>
                <span className="hidden sm:inline">
                  Hotel options available
                </span>
              </h2>

              <p className="mt-1 max-w-2xl font-poppins text-[10px] font-medium leading-4 text-slate-600 sm:mt-1.5 sm:text-base sm:leading-7">
                <span className="sm:hidden">
                  View stays, prices and booking details.
                </span>

                <span className="hidden sm:inline">
                  Select a hotel to view details, room options, booking process,
                  and payment flow.
                </span>
              </p>
            </div>

            <a
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="hidden items-center gap-2 rounded-[5px] border border-[#FF6B00]/40 bg-white px-5 py-3 font-poppins text-sm font-semibold text-[#FF6B00] transition hover:border-[#00AEEF] hover:text-[#00AEEF] md:inline-flex"
            >
              Ask for Hotel Options
              <FaWhatsapp className="text-sm" />
            </a>
          </div>

          {/* Filters */}
          <div className="-mx-4 mb-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:mb-6 sm:flex-wrap sm:overflow-visible sm:px-0">
            {starFilters.map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setSelectedStar(star)}
                className={`shrink-0 rounded-[5px] px-3.5 py-2 font-poppins text-[10.5px] font-semibold transition sm:px-5 sm:py-2.5 sm:text-sm ${
                  selectedStar === star
                    ? "bg-[#00AEEF] text-white shadow-[0_10px_25px_rgba(0,174,239,0.18)]"
                    : "bg-white text-slate-700 shadow-sm hover:bg-sky-50 hover:text-[#00AEEF]"
                }`}
              >
                {star === "All" ? "All Hotels" : `${star} Star`}
              </button>
            ))}
          </div>

          {filteredHotels.length > 0 ? (
            <div className={cardRowClass}>
              {filteredHotels.map((hotel) => (
                <Link
                  key={hotel.id}
                  to={`/hotels/${hotel.id}`}
                  className="group block min-w-[76%] overflow-hidden rounded-[16px] bg-slate-950 shadow-[0_18px_42px_rgba(15,23,42,0.16)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_28px_70px_rgba(0,174,239,0.18)] sm:min-w-0 sm:rounded-[18px] sm:shadow-[0_22px_55px_rgba(15,23,42,0.18)]"
                  aria-label={`View details for ${hotel.name}`}
                >
                  <div className="relative h-[305px] overflow-hidden sm:h-[360px]">
                    <img
                      src={hotel.image}
                      alt={hotel.name}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-slate-950 to-transparent sm:h-32" />

                    <div className="absolute left-4 top-4 inline-flex h-[29px] items-center gap-1.5 rounded-full border border-white/25 bg-slate-950/30 px-3 font-poppins text-[8px] font-bold uppercase tracking-[0.08em] text-white backdrop-blur-md sm:left-5 sm:top-5 sm:h-[36px] sm:gap-2 sm:px-4 sm:text-[10px] sm:tracking-[0.12em]">
                      <FaTag className="text-[8.5px] text-[#00AEEF] sm:text-[10px]" />
                      {hotel.stars} Star
                    </div>

                    <div className="absolute right-4 top-4 inline-flex h-[29px] items-center gap-1.5 rounded-full border border-white/20 bg-slate-950/25 px-2.5 backdrop-blur-md sm:right-5 sm:top-5 sm:h-[36px] sm:px-3">
                      <FaStar className="text-[9.5px] text-[#FF6B00] sm:text-[11px]" />

                      <span className="font-poppins text-[10px] font-bold leading-none text-white sm:text-[12px]">
                        Hotel
                      </span>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                      <p className="flex items-center gap-2 font-fredoka text-[17px] font-semibold leading-tight text-white sm:text-[22px]">
                        <FaMapMarkerAlt className="text-[10.5px] text-[#00AEEF] sm:text-[13px]" />
                        {hotel.name}
                      </p>

                      <p className="mt-1 font-poppins text-[10px] font-semibold leading-4 text-white/65 sm:text-xs sm:leading-5">
                        {hotel.location}
                      </p>

                      <div className="mt-2 flex items-end justify-between gap-3 sm:mt-3 sm:gap-4">
                        <div>
                          <p className="font-poppins text-[8px] font-bold uppercase tracking-[0.08em] text-white/45 sm:text-[9px] sm:tracking-[0.1em]">
                            Starting
                          </p>

                          <p className="mt-1 font-poppins text-[17px] font-medium leading-none tracking-[-0.03em] !text-[#FF6B00] sm:text-[18px]">
                            {hotel.price}
                          </p>
                        </div>

                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#00AEEF]/15 bg-[#00AEEF]/15 text-sm text-white backdrop-blur-md transition-all duration-300 group-hover:border-[#FF6B00]/40 group-hover:bg-[#FF6B00] group-hover:shadow-[0_12px_30px_rgba(255,107,0,0.35)] sm:h-11 sm:w-11 sm:text-base">
                          <FaArrowRight />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-[5px] bg-white p-6 text-center shadow-[0_10px_30px_rgba(15,23,42,0.06)] sm:p-8">
              <h3 className="font-fredoka text-[22px] font-semibold text-slate-950 sm:text-[26px]">
                No hotel found
              </h3>

              <p className="mx-auto mt-2 max-w-2xl font-poppins text-[11.5px] font-medium leading-5 text-slate-600 sm:text-sm sm:leading-7">
                Try selecting another star category or contact TravelEx for a
                custom hotel recommendation.
              </p>
            </div>
          )}

          <div className="mt-2 text-center md:hidden">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-[5px] border border-slate-200 bg-white px-4 py-2.5 font-poppins text-[10.5px] font-semibold text-slate-800 shadow-sm"
            >
              Ask for Hotel Options
              <FaWhatsapp className="text-[12px] text-[#25D366]" />
            </a>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-[#F8FAFC] pb-8 pt-2 sm:pb-14">
        <div className="mx-auto max-w-[1180px] px-4 sm:px-6 lg:px-8">
          <div className="rounded-[5px] border border-slate-100 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.06)] sm:p-7">
            <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <h3 className="font-fredoka text-[21px] font-semibold leading-tight text-slate-950 sm:text-[32px]">
                  Need help choosing the right hotel?
                </h3>

                <p className="mt-1.5 max-w-3xl font-poppins text-[11.5px] font-medium leading-5 text-slate-600 sm:text-sm sm:leading-7">
                  Share your destination, travel date, number of guests and
                  budget. TravelEx can guide you with suitable hotel options.
                </p>

                <div className="mt-3 grid gap-2 sm:grid-cols-3">
                  {[
                    "Hotel guidance",
                    "Family stay options",
                    "Secure booking flow",
                  ].map((item) => (
                    <p
                      key={item}
                      className="flex items-center gap-2 font-poppins text-[11.5px] font-semibold text-slate-700 sm:text-sm"
                    >
                      <FaCheckCircle className="shrink-0 text-[#00AEEF]" />
                      {item}
                    </p>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-[5px] bg-[#FF6B00] px-5 py-2.5 font-poppins text-xs font-semibold text-white transition hover:bg-[#00AEEF] sm:px-6 sm:py-3 sm:text-sm"
                >
                  <FaWhatsapp />
                  Chat with us
                </a>

                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center rounded-[5px] border border-slate-200 bg-white px-5 py-2.5 font-poppins text-xs font-semibold text-slate-800 transition hover:border-[#00AEEF] hover:text-[#00AEEF] sm:px-6 sm:py-3 sm:text-sm"
                >
                  Send Inquiry
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

export default HotelsPage