import { Link } from "react-router-dom"
import { FaArrowRight, FaMapMarkerAlt, FaStar, FaTag } from "react-icons/fa"

import { tours } from "../data/tours"
import Reveal from "./Reveal"

const cardRowClass =
  "-mx-4 flex gap-4 overflow-x-auto px-4 pb-5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 xl:grid-cols-4"

const CustomTours = () => {
  return (
    <section id="tours" className="bg-white pt-2 pb-2 sm:pt-8 sm:pb-16">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="mb-5 flex flex-col gap-4 md:mb-10 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-2 font-poppins text-[11px] font-bold uppercase tracking-[0.24em] text-[#00AEEF] sm:text-[12px] sm:tracking-[0.18em]">
                Customized International Tours
              </p>

              <h2 className="max-w-3xl font-fredoka text-[24px] font-semibold leading-tight text-slate-950 sm:text-[44px]">
                Explore International Travel Experiences
              </h2>

              <p className="mt-2 max-w-2xl font-poppins text-[12px] font-medium leading-6 text-slate-600 sm:text-base sm:leading-7">
                Handpicked international tours with flexible planning, hotel
                support and dedicated TravelEx consultation.
              </p>
            </div>

            <Link
              to="/tours"
              className="hidden items-center gap-2 rounded-[5px] border border-[#FF6B00]/40 bg-white px-5 py-3 font-poppins text-sm font-semibold text-[#FF6B00] transition hover:border-[#00AEEF] hover:text-[#00AEEF] md:inline-flex"
            >
              View All Tours
              <FaArrowRight className="text-xs" />
            </Link>
          </div>
        </Reveal>

        <div className={cardRowClass}>
          {tours.map((tour, index) => (
            <div key={tour.id} className="min-w-[82%] sm:min-w-0">
              <Reveal delay={index * 0.3}>
                <Link
                  to={`/tours/${tour.id}`}
                  className="group block cursor-pointer overflow-hidden rounded-[18px] bg-slate-950 shadow-[0_22px_55px_rgba(15,23,42,0.18)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_28px_70px_rgba(0,174,239,0.18)]"
                  aria-label={`View ${tour.location} tour`}
                >
                  <div className="relative h-[360px] overflow-hidden">
                    <img
                      src={tour.image}
                      alt={`${tour.badge} Tour Package`}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-950 to-transparent" />

                    <div className="absolute left-5 top-5 inline-flex h-[36px] items-center gap-2 rounded-full border border-white/25 bg-slate-950/30 px-4 font-poppins text-[10px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur-md">
                      <FaTag className="text-[10px] text-[#00AEEF]" />
                      {tour.badge}
                    </div>

                    <div className="absolute right-5 top-5 inline-flex h-[36px] items-center gap-1.5 rounded-full border border-white/20 bg-slate-950/25 px-3 backdrop-blur-md">
                      <FaStar className="text-[11px] text-[#FF6B00]" />
                      <span className="font-poppins text-[12px] font-bold leading-none text-white">
                        {tour.rating}
                      </span>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <p className="flex items-center gap-2 font-fredoka text-[22px] font-semibold leading-tight text-white">
                        <FaMapMarkerAlt className="text-[13px] text-[#00AEEF]" />
                        {tour.location}
                      </p>

                      <div className="mt-1 flex items-end justify-between gap-4">
                        <div>
                          <p className="font-poppins text-[9px] font-bold uppercase tracking-[0.16em] text-white/45">
                            {tour.price === "Custom Quote" ? "Get a" : "From"}
                          </p>

                          <p
                            className="mt-1 font-poppins leading-none tracking-[-0.03em] !text-[#FF6B00]"
                            style={{ fontSize: "20px", fontWeight: 500 }}
                          >
                            {tour.price}
                          </p>
                        </div>

                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#00AEEF]/15 bg-[#00AEEF]/15 text-white backdrop-blur-md transition-all duration-300 group-hover:border-[#FF6B00]/40 group-hover:bg-[#FF6B00] group-hover:shadow-[0_12px_30px_rgba(255,107,0,0.35)]">
                          <FaArrowRight />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </Reveal>
            </div>
          ))}
        </div>

        <div className="mt-1 text-center md:hidden">
          <Link
            to="/tours"
            className="inline-flex items-center gap-2 rounded-[5px] border border-slate-200 bg-white px-5 py-3 font-poppins text-sm font-semibold text-slate-800"
          >
            View All Tours
            <FaArrowRight className="text-xs" />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default CustomTours