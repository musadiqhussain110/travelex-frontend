import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

import Umrah4 from "../assets/Umrah/Umrah4.jpg"
import Umrah5 from "../assets/Umrah/Umrah5.webp"
import Umrah6 from "../assets/Umrah/Umrah6.webp"
import Umrah7 from "../assets/Umrah/Umrah7.webp"

const packages = [
  {
    id: "15-days-umrah-package",
    title: "15 Days Umrah Package",
    from: "Departure from Peshawar",
    price: "Starting from PKR 255,000",
    type: "Economy / Sharing",
    image: Umrah4,
    highlights: [
      "Hotel + visa guidance",
      "Transparent package details",
      "WhatsApp booking support",
    ],
  },
  {
    id: "15-days-family-umrah",
    title: "15 Days Family Umrah",
    from: "Multiple hotel options",
    price: "Starting from PKR 263,500",
    type: "Family / Quad",
    image: Umrah5,
    highlights: [
      "Customized family planning",
      "Hotel + transport assistance",
      "Clear room sharing options",
    ],
  },
  {
    id: "premium-umrah-package",
    title: "Premium Umrah Package",
    from: "Near Haram options",
    price: "Starting from PKR 296,000",
    type: "Premium / Double",
    image: Umrah6,
    highlights: [
      "Comfort-focused planning",
      "Expert consultant support",
      "Priority WhatsApp guidance",
    ],
  },
  {
    id: "custom-umrah-plan",
    title: "Custom Umrah Plan",
    from: "Based on your budget",
    price: "Custom quote available",
    type: "Customized",
    image: Umrah7,
    highlights: [
      "Flexible hotel options",
      "Custom travel dates",
      "Consultant support",
    ],
  },
]

const BrandName = () => (
  <span className="font-semibold">
    <span className="text-[#FF6B00]">Travel</span>
    <span className="text-[#00AEEF]">Ex</span>
  </span>
)

const UmrahPackages = () => {
  const [index, setIndex] = useState(0)
  const [visibleCards, setVisibleCards] = useState(1)

  useEffect(() => {
    const updateVisibleCards = () => {
      if (window.innerWidth >= 1024) {
        setVisibleCards(4)
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

  const maxIndex = Math.max(packages.length - visibleCards, 0)

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
    <section id="umrah" className="bg-[#F8FAFC] py-12 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-8 flex flex-col justify-between gap-5 sm:mb-12 md:flex-row md:items-end">
          <div>
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.24em] text-[#00AEEF] sm:text-[13px]">
              Umrah Packages
            </p>

            <h2 className="max-w-3xl font-serif text-[34px] font-bold leading-[1.08] tracking-[-0.035em] text-slate-950 sm:text-5xl lg:text-[58px]">
              Choose your perfect Umrah plan
            </h2>

            <p className="mt-4 max-w-3xl text-sm font-medium leading-7 text-slate-600 sm:text-base">
              Select a package that matches your comfort and budget, or ask{" "}
              <BrandName /> to customize a plan according to your travel needs.
            </p>
          </div>

          <Link
            to="/umrah"
            className="hidden rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-medium text-slate-900 transition-colors duration-300 hover:border-[#00AEEF] hover:text-[#00AEEF] md:inline-flex"
          >
            View All Packages
          </Link>
        </div>

        <div className="relative px-3 sm:px-0">
          {maxIndex > 0 && canGoLeft && (
            <button
              type="button"
              onClick={prevSlide}
              className="absolute -left-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white text-xl font-medium text-slate-900 shadow-lg transition-colors duration-300 hover:bg-[#00AEEF] hover:text-white sm:-left-4 md:-left-5"
              aria-label="Previous package"
            >
              ‹
            </button>
          )}

          {maxIndex > 0 && canGoRight && (
            <button
              type="button"
              onClick={nextSlide}
              className="absolute -right-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white text-xl font-medium text-slate-900 shadow-lg transition-colors duration-300 hover:bg-[#00AEEF] hover:text-white sm:-right-4 md:-right-5"
              aria-label="Next package"
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
              {packages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="min-w-full px-1 md:min-w-[50%] md:px-3 lg:min-w-[25%]"
                >
                  <article className="group overflow-hidden rounded-[1.5rem] bg-white shadow-md shadow-slate-200/70 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={pkg.image}
                        alt={pkg.title}
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />

                      <div className="absolute left-4 top-4 rounded-full bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-[#00AEEF] shadow-md">
                        {pkg.type}
                      </div>
                    </div>

                    <div className="p-4">
                      <h3 className="text-[17px] font-bold leading-snug text-slate-950">
                        {pkg.title}
                      </h3>

                      <p className="mt-1 text-xs font-medium text-slate-500">
                        {pkg.from}
                      </p>

                      <p className="mt-3 text-base font-semibold text-[#FF6B00]">
                        {pkg.price}
                      </p>

                      <div className="mt-4 grid gap-2">
                        {pkg.highlights.map((item) => (
                          <p
                            key={item}
                            className="rounded-xl bg-slate-50 px-3 py-2 text-xs font-medium text-slate-600"
                          >
                            ✓ {item}
                          </p>
                        ))}
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-2">
                        <Link
                          to={`/package/${pkg.id}`}
                          className="rounded-full border border-slate-200 px-3 py-2.5 text-center text-xs font-medium text-slate-800 transition-colors duration-300 hover:border-[#00AEEF] hover:text-[#00AEEF]"
                        >
                          View Details
                        </Link>

                        <a
                          href="https://wa.me/923111444192"
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-full bg-[#FF6B00] px-3 py-2.5 text-center text-xs font-medium text-white transition-colors duration-300 hover:bg-[#00AEEF]"
                        >
                          WhatsApp Us
                        </a>
                      </div>
                    </div>
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
                type="button"
                key={dotIndex}
                onClick={() => setIndex(dotIndex)}
                className={`h-2 rounded-full transition-all ${
                  index === dotIndex ? "w-8 bg-[#00AEEF]" : "w-2 bg-slate-300"
                }`}
                aria-label={`Go to package slide ${dotIndex + 1}`}
              />
            ))}
          </div>
        )}

        <div className="mt-6 text-center md:hidden">
          <Link
            to="/umrah"
            className="inline-flex rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-medium text-slate-900 transition-colors duration-300 hover:border-[#00AEEF] hover:text-[#00AEEF]"
          >
            View All Packages
          </Link>
        </div>
      </div>
    </section>
  )
}

export default UmrahPackages