import sarhadChamber from "../assets/authorities/sarhad-chamber.jpeg"
import fbr from "../assets/authorities/fbr.svg"
import iata from "../assets/authorities/iata.svg"
import kpkTourism from "../assets/authorities/kpk-tourism.png"
import Reveal from "./Reveal"

const authorities = [
  { name: "Sarhad Chamber", logo: sarhadChamber },
  { name: "FBR Pakistan", logo: fbr },
  { name: "IATA", logo: iata },
  { name: "KPK Tourism Department", logo: kpkTourism },
]

const baseLoop = [...authorities, ...authorities]
const loopItems = [...baseLoop, ...baseLoop]

const trustPoints = [
  "Licensed Travel Support",
  "Recognized Documentation Guidance",
  "Trusted Umrah & Tour Planning",
]

const TrustSection = () => {
  return (
    <section
      id="trust"
      className="overflow-hidden bg-white pt-5 pb-9 sm:pt-8 sm:pb-14"
    >
      <style>{`
        @keyframes authorityLoop {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }

        .authority-track {
          display: flex;
          width: max-content;
          animation: authorityLoop 20s linear infinite;
          will-change: transform;
        }

        .authority-wrapper:hover .authority-track {
          animation-play-state: paused;
        }

        @media (prefers-reduced-motion: reduce) {
          .authority-track {
            animation: none !important;
          }
        }
      `}</style>

      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="mb-4 text-center sm:mb-5">
            <p className="mb-2 font-poppins text-[11px] font-bold uppercase tracking-[0.24em] text-[#00AEEF] sm:text-[12px] sm:tracking-[0.18em]">
              Certified & Recognized
            </p>

            <h2 className="font-fredoka text-[24px] font-semibold leading-[1.08] text-slate-950 sm:text-[42px]">
              Trusted by Authorities
            </h2>

            <p className="mx-auto mt-2 max-w-2xl font-poppins text-[11.5px] font-medium leading-5 text-slate-600 sm:text-base sm:leading-7">
              TravelEx works with recognized travel, tax, tourism and commerce
              authorities to provide reliable travel services with confidence.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.12}>
          <div className="authority-wrapper relative">
            <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-12 bg-gradient-to-r from-white to-transparent sm:w-20" />
            <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-12 bg-gradient-to-l from-white to-transparent sm:w-20" />

            <div className="overflow-hidden rounded-[5px] border border-slate-100 bg-[#F8FAFC] px-3 py-4 shadow-[0_10px_28px_rgba(15,23,42,0.05)] sm:px-5 sm:py-5">
              <div className="authority-track items-center gap-3 sm:gap-5">
                {loopItems.map((item, index) => (
                  <div
                    key={`${item.name}-${index}`}
                    className="flex h-[74px] min-w-[165px] items-center justify-center rounded-[5px] border border-slate-100 bg-white px-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#00AEEF]/30 hover:shadow-md sm:h-[92px] sm:min-w-[240px] sm:px-6"
                  >
                    <img
                      src={item.logo}
                      alt={item.name}
                      className="max-h-[48px] max-w-[125px] object-contain opacity-100 transition-all duration-300 sm:max-h-[62px] sm:max-w-[170px]"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-center sm:mt-6 sm:gap-3">
          {trustPoints.map((item, index) => (
            <Reveal key={item} delay={index * 0.12}>
              <span className="inline-flex rounded-full bg-[#00AEEF]/5 px-3 py-1.5 font-poppins text-[10.5px] font-semibold text-slate-600 sm:px-4 sm:py-2 sm:text-xs">
                {item}
              </span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TrustSection