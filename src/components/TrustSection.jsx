import { useEffect, useState } from "react"
import {
  FaHeadset,
  FaHotel,
  FaPassport,
  FaPhoneAlt,
  FaRegCheckCircle,
  FaUsers,
  FaWhatsapp,
} from "react-icons/fa"

const trustCards = [
  {
    icon: <FaUsers />,
    title: "17+ Years Serving Travelers",
    text: "TravelEx has been helping travelers with Umrah, tours, visas, hotels, and travel package support for years.",
  },
  {
    icon: <FaHeadset />,
    title: "24/7 Customer Support",
    text: "Get quick support for package details, travel guidance, booking questions, and customer assistance.",
  },
  {
    icon: <FaRegCheckCircle />,
    title: "Transparent Package Guidance",
    text: "Hotel options, package details, room sharing choices, and travel plans are explained clearly before inquiry.",
  },
  {
    icon: <FaHotel />,
    title: "Hotels, Tickets & Packages",
    text: "Explore hotel options, ticketing support, Umrah packages, local tours, and customized travel plans.",
  },
  {
    icon: <FaPassport />,
    title: "Reliable Visa & Travel Assistance",
    text: "Get guidance for visa process, documents, travel requirements, and consultant support before your journey.",
  },
]

const TrustSection = () => {
  const [index, setIndex] = useState(0)
  const [visibleCards, setVisibleCards] = useState(1)

  useEffect(() => {
    const updateVisibleCards = () => {
      if (window.innerWidth >= 1024) {
        setVisibleCards(5)
      } else if (window.innerWidth >= 768) {
        setVisibleCards(2)
      } else {
        setVisibleCards(1)
      }
    }

    updateVisibleCards()
    window.addEventListener("resize", updateVisibleCards)

    return () => window.removeEventListener("resize", updateVisibleCards)
  }, [])

  const maxIndex = Math.max(trustCards.length - visibleCards, 0)

  useEffect(() => {
    if (index > maxIndex) {
      setIndex(maxIndex)
    }
  }, [index, maxIndex])

  const canGoLeft = index > 0
  const canGoRight = index < maxIndex

  const nextSlide = () => {
    if (canGoRight) {
      setIndex((prev) => prev + 1)
    }
  }

  const prevSlide = () => {
    if (canGoLeft) {
      setIndex((prev) => prev - 1)
    }
  }

  return (
    <section id="trust" className="bg-[#F8FAFC] py-12 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-8 text-center sm:mb-12">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.25em] text-[#00AEEF] sm:text-sm">
            Why Choose TravelEx
          </p>

          <h2 className="text-3xl font-black leading-tight text-slate-950 sm:text-4xl md:text-5xl">
            Trusted support for every journey
          </h2>

          <p className="mx-auto mt-4 max-w-3xl text-sm leading-7 text-slate-600 md:text-base">
            From Umrah packages to customized tours, TravelEx makes travel
            planning easier with clear guidance, direct support, and quick
            WhatsApp communication.
          </p>
        </div>

        {/* Trust Cards Carousel */}
        <div className="relative px-7 md:px-0">
          {maxIndex > 0 && canGoLeft && (
            <button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white text-xl font-black text-slate-900 shadow-lg transition-colors duration-300 hover:bg-[#00AEEF] hover:text-white md:-left-5 md:h-10 md:w-10 md:text-2xl"
              aria-label="Previous trust card"
            >
              ‹
            </button>
          )}

          {maxIndex > 0 && canGoRight && (
            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white text-xl font-black text-slate-900 shadow-lg transition-colors duration-300 hover:bg-[#00AEEF] hover:text-white md:-right-5 md:h-10 md:w-10 md:text-2xl"
              aria-label="Next trust card"
            >
              ›
            </button>
          )}

          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(-${index * (100 / visibleCards)}%)`,
              }}
            >
              {trustCards.map((item) => (
                <div
                  key={item.title}
                  className="min-w-full px-1 md:min-w-[50%] md:px-3 lg:min-w-[20%]"
                >
                  <article className="group h-full rounded-[1.5rem] bg-white p-5 text-center shadow-md shadow-slate-200/70 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                    <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-xl text-[#00AEEF] transition-colors duration-300 group-hover:bg-[#00AEEF] group-hover:text-white">
                      {item.icon}
                    </div>

                    <h3 className="text-base font-black leading-snug text-slate-950">
                      {item.title}
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      {item.text}
                    </p>
                  </article>
                </div>
              ))}
            </div>
          </div>
        </div>

        {maxIndex > 0 && (
          <div className="mt-5 flex justify-center gap-2">
            {Array.from({ length: maxIndex + 1 }).map((_, dotIndex) => (
              <button
                key={dotIndex}
                onClick={() => setIndex(dotIndex)}
                className={`h-2 rounded-full transition-all ${
                  index === dotIndex ? "w-8 bg-[#00AEEF]" : "w-2 bg-slate-300"
                }`}
                aria-label={`Go to trust slide ${dotIndex + 1}`}
              />
            ))}
          </div>
        )}

        <div className="mt-8 rounded-[1.5rem] bg-white p-5 shadow-md shadow-slate-200/70 sm:p-6">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h3 className="text-xl font-black text-slate-950">
                Need help choosing the right package?
              </h3>

              <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
                Call TravelEx at{" "}
                <span className="font-black text-slate-950">
                  03 111 444 192
                </span>{" "}
                or continue your inquiry on WhatsApp.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href="tel:03111444192"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 px-5 py-3 text-sm font-black text-slate-900 transition-colors duration-300 hover:bg-slate-950 hover:text-white"
              >
                <FaPhoneAlt />
                Call Now
              </a>

              <a
                href="#contact"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#FF6B00] px-5 py-3 text-sm font-black text-white transition-colors duration-300 hover:bg-[#00AEEF]"
              >
                <FaWhatsapp />
                WhatsApp Inquiry
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TrustSection