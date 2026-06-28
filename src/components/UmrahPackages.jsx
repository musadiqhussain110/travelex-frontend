import { Link } from "react-router-dom"
import { FaArrowRight, FaMapMarkerAlt, FaStar, FaTag } from "react-icons/fa"

import { umrahPackages as packages } from "../data/umrahPackagesData"
import Reveal from "./Reveal"

const cardRowClass =
  "-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 xl:grid-cols-4"

const UmrahPackages = () => {
  return (
    <section id="umrah" className="bg-[#F8FAFC] pt-4 pb-4 sm:pt-8 sm:pb-16">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="mb-5 flex flex-col gap-4 md:mb-10 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-2 font-poppins text-[9px] font-bold uppercase tracking-[0.12em] text-[#00AEEF] sm:text-[12px] sm:tracking-[0.18em]">
                Featured Umrah Packages
              </p>

              <h2 className="max-w-3xl font-fredoka text-[22px] font-semibold leading-[1.08] text-slate-950 sm:text-[44px]">
                Choose the Umrah Experience That Fits You
              </h2>

              <p className="mt-1.5 max-w-2xl font-poppins text-[11.5px] font-medium leading-5 text-slate-600 sm:text-base sm:leading-7">
                From budget-friendly to fully customized Umrah experiences.
              </p>
            </div>

            <Link
              to="/umrah"
              className="hidden items-center gap-2 rounded-[5px] border border-[#FF6B00]/40 bg-white px-5 py-3 font-poppins text-sm font-semibold text-[#FF6B00] transition hover:border-[#00AEEF] hover:text-[#00AEEF] md:inline-flex"
            >
              View All Packages
              <FaArrowRight className="text-xs" />
            </Link>
          </div>
        </Reveal>

        <div className={cardRowClass}>
          {packages.map((pkg, index) => (
            <div key={pkg.id} className="min-w-[78%] sm:min-w-0">
              <Reveal delay={index * 0.3}>
                <Link
                  to={`/package/${pkg.id}`}
                  className={`group block cursor-pointer overflow-hidden rounded-[14px] bg-slate-950 shadow-[0_16px_38px_rgba(15,23,42,0.16)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_28px_70px_rgba(0,174,239,0.18)] sm:rounded-[18px] sm:shadow-[0_22px_55px_rgba(15,23,42,0.18)] ${
                    pkg.premium ? "ring-1 ring-[#FF6B00]/25" : ""
                  }`}
                  aria-label={`View ${pkg.title}`}
                >
                  <div className="relative h-[270px] overflow-hidden sm:h-[330px]">
                    <img
                      src={pkg.image}
                      alt={`${pkg.badge} Umrah Package`}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-950 to-transparent" />

                    <div className="absolute left-3 top-3 inline-flex h-[28px] items-center gap-1.5 rounded-full border border-white/25 bg-slate-950/30 px-3 font-poppins text-[7.5px] font-bold uppercase tracking-[0.08em] text-white backdrop-blur-md sm:left-5 sm:top-5 sm:h-[36px] sm:gap-2 sm:px-4 sm:text-[10px] sm:tracking-[0.16em]">
                      <FaTag className="text-[8px] text-[#00AEEF] sm:text-[10px]" />
                      {pkg.badge}
                    </div>

                    <div className="absolute right-3 top-3 inline-flex h-[28px] items-center gap-1 rounded-full border border-white/20 bg-slate-950/25 px-2.5 backdrop-blur-md sm:right-5 sm:top-5 sm:h-[36px] sm:gap-1.5 sm:px-3">
                      <FaStar className="text-[9px] text-[#FF6B00] sm:text-[11px]" />

                      <span className="font-poppins text-[10px] font-bold leading-none text-white sm:text-[12px]">
                        {pkg.rating}
                      </span>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                      <p className="flex items-center gap-1.5 font-fredoka text-[19px] font-semibold leading-tight text-white sm:gap-2 sm:text-[22px]">
                        <FaMapMarkerAlt className="text-[11px] text-[#00AEEF] sm:text-[13px]" />
                        {pkg.location}
                      </p>

                      <div className="mt-1 flex items-end justify-between gap-3 sm:gap-4">
                        <div>
                          <p className="font-poppins text-[8px] font-bold uppercase tracking-[0.08em] text-white/45 sm:text-[9px] sm:tracking-[0.16em]">
                            {pkg.price === "Custom Quote" ? "Get a" : "From"}
                          </p>

                          <p
                            className="mt-1 font-poppins leading-none tracking-[-0.03em] !text-[#FF6B00]"
                            style={{ fontSize: "20px", fontWeight: 500 }}
                          >
                            {pkg.price}
                          </p>
                        </div>

                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#00AEEF]/15 bg-[#00AEEF]/15 text-sm text-white backdrop-blur-md transition-all duration-300 group-hover:border-[#FF6B00]/40 group-hover:bg-[#FF6B00] group-hover:shadow-[0_12px_30px_rgba(255,107,0,0.35)] sm:h-11 sm:w-11 sm:text-base">
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

        <div className="mt-2 text-center md:hidden">
          <Link
            to="/umrah"
            className="inline-flex items-center gap-2 rounded-[5px] border border-slate-200 bg-white px-4 py-2.5 font-poppins text-xs font-semibold text-slate-800"
          >
            View All Packages
            <FaArrowRight className="text-[10px]" />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default UmrahPackages