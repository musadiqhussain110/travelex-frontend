import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

const tours = [
  {
    id: "pir-chinasi-tour",
    title: "Pir Chinasi Tour Package",
    duration: "1 Day",
    price: "Starting from PKR 7,500",
    type: "Featured Local Tour",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
    points: [
      "One day guided plan",
      "Comfortable transport",
      "Custom group options",
    ],
  },
  {
    id: "naran-kaghan-shogran-tour",
    title: "Naran Kaghan Shogran Tour",
    duration: "3 Days",
    price: "Starting from PKR 14,500",
    type: "Nature + Family Trip",
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
    points: ["Hotel assistance", "Family-friendly plan", "Flexible itinerary"],
  },
  {
    id: "nathiagali-ayubia-tour",
    title: "Nathiagali Ayubia Tour",
    duration: "1 Day",
    price: "Starting from PKR 6,500",
    type: "Hill Station Tour",
    image:
      "https://ramadaresortmurree.com/wp-content/uploads/2025/01/Nathia-Gali-1536x1024.jpeg",
    points: ["Scenic day trip", "Transport guidance", "Group travel support"],
  },
  {
    id: "islamabad-tour-package",
    title: "Islamabad Tour Package",
    duration: "1 Day",
    price: "Starting from PKR 5,000",
    type: "City Tour",
    image:
      "https://cdn.offtheatlas.com/wp-content/uploads/2021/10/01194801/DSCF8938.jpg",
    points: ["City sightseeing", "Custom timing", "Budget-friendly option"],
  },
  {
    id: "custom-family-tour",
    title: "Custom Family Tour",
    duration: "Flexible",
    price: "Custom quote available",
    type: "Customized Plan",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
    points: ["Custom destination", "Hotel support", "WhatsApp planning"],
  },
]

const CustomTours = () => {
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

  const maxIndex = Math.max(tours.length - visibleCards, 0)

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
    <section id="tours" className="bg-white py-12 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-8 flex flex-col justify-between gap-5 sm:mb-12 md:flex-row md:items-end">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#00AEEF] sm:text-sm">
              Customized Tours
            </p>

            <h2 className="text-3xl font-medium leading-tight text-slate-950 sm:text-4xl md:text-5xl">
              Explore tours made for your travel style
            </h2>

            <p className="mt-4 max-w-3xl text-sm leading-7 !text-slate-600 md:text-base">
              Choose from ready tour options or contact us to customize the
              destination, hotel, transport, dates, and group plan according to
              your comfort and budget.
            </p>
          </div>

          <Link
            to="/tours"
            className="hidden rounded-[5px] border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition-colors duration-300 hover:border-[#00AEEF] hover:text-[#00AEEF] md:inline-flex"
          >
            View All Tours
          </Link>
        </div>

        <div className="relative">
          {maxIndex > 0 && canGoLeft && (
            <button
              type="button"
              onClick={prevSlide}
              className="absolute left-2 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-[5px] bg-white text-2xl font-semibold text-slate-900 shadow-lg transition-colors duration-300 hover:bg-[#00AEEF] hover:text-white md:-left-5"
              aria-label="Previous tour"
            >
              ‹
            </button>
          )}

          {maxIndex > 0 && canGoRight && (
            <button
              type="button"
              onClick={nextSlide}
              className="absolute right-2 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-[5px] bg-white text-2xl font-semibold text-slate-900 shadow-lg transition-colors duration-300 hover:bg-[#00AEEF] hover:text-white md:-right-5"
              aria-label="Next tour"
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
              {tours.map((tour) => (
                <div
                  key={tour.id}
                  className="min-w-full px-1 md:min-w-[50%] md:px-3 lg:min-w-[25%]"
                >
                  <article className="group overflow-hidden rounded-[5px] bg-[#F8FAFC] shadow-md shadow-slate-200/60 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                    <div className="relative h-44 overflow-hidden">
                      <img
                        src={tour.image}
                        alt={tour.title}
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />

                      <div className="absolute left-4 top-4 rounded-[5px] bg-white px-3 py-1.5 text-[11px] font-semibold text-[#00AEEF] shadow-md">
                        {tour.duration}
                      </div>

                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-lg font-medium leading-tight text-white">
                          {tour.title}
                        </h3>

                        <p className="mt-1 text-xs font-semibold !text-white/85">
                          {tour.type}
                        </p>
                      </div>
                    </div>

                    <div className="p-4">
                      <p className="mb-4 text-base font-semibold !text-[#FF6B00]">
                        {tour.price}
                      </p>

                      <div className="grid gap-2">
                        {tour.points.map((point) => (
                          <p
                            key={point}
                            className="rounded-[5px] bg-white px-3 py-2 text-xs font-semibold !text-slate-600"
                          >
                            ✓ {point}
                          </p>
                        ))}
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-2">
                        <Link
                          to={`/tours/${tour.id}`}
                          className="rounded-[5px] border border-slate-200 bg-white px-3 py-2.5 text-center text-xs font-semibold text-slate-800 transition-colors duration-300 hover:border-[#00AEEF] hover:text-[#00AEEF]"
                        >
                          View Details
                        </Link>

                        <a
                          href="https://wa.me/923111444192"
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-[5px] bg-[#FF6B00] px-3 py-2.5 text-center text-xs font-semibold text-white transition-colors duration-300 hover:bg-[#00AEEF]"
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
                className={`h-2 rounded-[5px] transition-all ${
                  index === dotIndex ? "w-8 bg-[#00AEEF]" : "w-2 bg-slate-300"
                }`}
                aria-label={`Go to tour slide ${dotIndex + 1}`}
              />
            ))}
          </div>
        )}

        <div className="mt-6 text-center md:hidden">
          <Link
            to="/tours"
            className="inline-flex rounded-[5px] border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition-colors duration-300 hover:border-[#00AEEF] hover:text-[#00AEEF]"
          >
            View All Tours
          </Link>
        </div>
      </div>
    </section>
  )
}

export default CustomTours