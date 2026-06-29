import { Link } from "react-router-dom"
import {
  FaKaaba,
  FaPassport,
  FaGlobeAsia,
  FaHotel,
  FaCar,
  FaTicketAlt,
} from "react-icons/fa"

import BannerSlider from "./BannerSlider"
import ServiceSearchBar from "../ServiceSearchBar"
import bannerBg from "../../assets/hero/banner-bg1.png"

const mobileServices = [
  {
    title: "Umrah",
    to: "/umrah",
    icon: <FaKaaba />,
  },
  {
    title: "Visa",
    to: "/visa",
    icon: <FaPassport />,
  },
  {
    title: "Tours",
    to: "/tours",
    icon: <FaGlobeAsia />,
  },
  {
    title: "Hotels",
    to: "/hotels",
    icon: <FaHotel />,
  },
  {
    title: "Transport",
    to: "/car-rental",
    icon: <FaCar />,
  },
  {
    title: "Tickets",
    to: "/tickets",
    icon: <FaTicketAlt />,
  },
]

const HeroV2 = ({ onOpenLeadModal }) => {
  return (
    <section
      className="relative w-full bg-[#F2F2F2] bg-cover bg-center"
      style={{ backgroundImage: `url(${bannerBg})` }}
    >
      <style>{`
        @keyframes heroPlaneFly {
          from { offset-distance: 0%; }
          to   { offset-distance: 100%; }
        }

        .hero-plane {
          offset-path: path("M -140 70 C 80 170, 200 110, 360 230 S 600 320, 720 370 S 950 280, 1060 240 S 1280 160, 1600 110");
          offset-rotate: auto;
          animation: heroPlaneFly 26s linear infinite;
        }

        @media (max-width: 767px) {
          .hero-plane-layer {
            display: none !important;
            opacity: 0 !important;
            visibility: hidden !important;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-plane { animation: none !important; }
        }
      `}</style>

      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{ backgroundColor: "rgba(255,107,0,0.12)" }}
      />

      {/* Desktop only moving plane */}
      <svg
        className="hero-plane-layer pointer-events-none absolute inset-0 z-[1] hidden h-full w-full md:block"
        viewBox="0 0 1440 600"
        fill="none"
        preserveAspectRatio="none"
      >
        <g className="hero-plane" opacity="0.8">
          <g transform="translate(-52,-52)">
            <g transform="scale(4)">
              <g transform="rotate(90 13 13)">
                <path
                  d="M22.5 17.5v-2.2l-8.7-5.4V3.8c0-.9-.73-1.63-1.63-1.63S10.5 2.9 10.5 3.8v6.1l-8.7 5.4v2.2l8.7-2.7v6l-2.2 1.6v1.7l3.8-1.1 3.8 1.1v-1.7l-2.2-1.6v-6l8.8 2.7z"
                  fill="#FF6B00"
                />
              </g>
            </g>
          </g>
        </g>
      </svg>

      <div className="relative z-10 mx-auto w-full max-w-[1340px] px-3 pb-4 pt-0 sm:px-6 sm:pt-0 md:pb-12 md:pt-6 lg:px-8">
        <BannerSlider />

        {/* Mobile services grid */}
        <div className="mt-3 grid grid-cols-3 gap-3 md:hidden">
          {mobileServices.map((service) => (
            <Link
              key={service.title}
              to={service.to}
              className="flex min-h-[84px] flex-col items-center justify-center rounded-[14px] border border-slate-100 bg-white px-2 py-2.5 text-center shadow-[0_8px_18px_rgba(11,42,74,0.08)] transition active:scale-[0.97]"
            >
              <span className="flex h-[48px] w-[48px] items-center justify-center text-[36px] text-[#FF6B00]">
                {service.icon}
              </span>

              <span className="mt-1.5 block font-poppins text-[10.5px] font-bold leading-tight text-slate-950">
                {service.title}
              </span>
            </Link>
          ))}
        </div>

        {/* Desktop search bar only */}
        <div className="relative z-40 mx-auto mt-4 hidden max-w-[1180px] md:block">
          <ServiceSearchBar />
        </div>
      </div>
    </section>
  )
}

export default HeroV2