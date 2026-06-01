import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { FaStar, FaQuoteLeft } from "react-icons/fa"

const testimonials = [
  {
    name: "Ayesha Khan",
    initials: "AK",
    location: "Karachi",
    service: "Umrah Package",
    review:
      "TravelEx guided us very professionally for our Umrah trip. The package details were clear and the team stayed connected through WhatsApp whenever we needed help.",
    rating: 5,
  },
  {
    name: "Bilal Ahmed",
    initials: "BA",
    location: "Peshawar",
    service: "Flight Booking",
    review:
      "The booking process was simple and smooth. I liked that everything was explained clearly before confirmation.",
    rating: 5,
  },
  {
    name: "Sara Malik",
    initials: "SM",
    location: "Lahore",
    service: "Visa Assistance",
    review:
      "Their visa document guidance helped me understand exactly what was required. The requirements were shared properly and support was quick.",
    rating: 5,
  },
]

const TestimonialsSection = () => {
  const [index, setIndex] = useState(0)
  const [visibleCards, setVisibleCards] = useState(1)

  useEffect(() => {
    const updateVisibleCards = () => {
      if (window.innerWidth >= 1024) setVisibleCards(3)
      else if (window.innerWidth >= 768) setVisibleCards(2)
      else setVisibleCards(1)
    }

    updateVisibleCards()
    window.addEventListener("resize", updateVisibleCards)
    return () => window.removeEventListener("resize", updateVisibleCards)
  }, [])

  const maxIndex = Math.max(testimonials.length - visibleCards, 0)

  useEffect(() => {
    if (index > maxIndex) setIndex(maxIndex)
  }, [index, maxIndex])

  const canGoLeft = index > 0
  const canGoRight = index < maxIndex

  const nextSlide = () => {
    if (canGoRight) setIndex((prev) => prev + 1)
  }

  const prevSlide = () => {
    if (canGoLeft) setIndex((prev) => prev - 1)
  }

  return (
    <section className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <p className="eyebrow mb-3 text-[#00AEEF]">Client Reviews</p>

          <h2 className="text-slate-950">What our customers say</h2>

          <p className="mt-4 !text-slate-600">
            Real experiences from travelers who trusted TravelEx for Umrah,
            flights, tours, and visa assistance.
          </p>
        </div>

        <div className="relative px-3 sm:px-0">
          {maxIndex > 0 && canGoLeft && (
            <button
              type="button"
              onClick={prevSlide}
              className="absolute -left-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-[5px] bg-white text-xl font-medium text-slate-900 shadow-lg transition-colors duration-300 hover:bg-[#00AEEF] hover:text-white sm:-left-4 md:-left-5"
              aria-label="Previous review"
            >
              ‹
            </button>
          )}

          {maxIndex > 0 && canGoRight && (
            <button
              type="button"
              onClick={nextSlide}
              className="absolute -right-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-[5px] bg-white text-xl font-medium text-slate-900 shadow-lg transition-colors duration-300 hover:bg-[#00AEEF] hover:text-white sm:-right-4 md:-right-5"
              aria-label="Next review"
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
              {testimonials.map((item) => (
                <div
                  key={item.name}
                  className="min-w-full px-1 md:min-w-[50%] md:px-3 lg:min-w-[33.3333%]"
                >
                  <article className="flex min-h-[310px] flex-col rounded-[5px] border border-slate-200 bg-[#F8FAFC] p-6 shadow-md shadow-slate-200/80 transition duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex gap-1">
                        {Array.from({ length: item.rating }).map(
                          (_, starIndex) => (
                            <FaStar
                              key={starIndex}
                              className="text-sm text-[#FFB703]"
                            />
                          )
                        )}
                      </div>

                      <FaQuoteLeft className="text-base text-slate-300" />
                    </div>

                    <div className="flex flex-1 flex-col">
                      <p className="!text-slate-600">“{item.review}”</p>
                    </div>

                    <div className="mt-auto flex items-center gap-3 pt-5">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[5px] bg-[#00AEEF] text-sm font-semibold text-white">
                        {item.initials}
                      </div>

                      <div>
                        <h3 className="text-slate-950">{item.name}</h3>

                        <p className="mt-0.5 text-xs font-medium !text-slate-500">
                          {item.location} • {item.service}
                        </p>
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
                aria-label={`Go to review slide ${dotIndex + 1}`}
              />
            ))}
          </div>
        )}

        <div className="mx-auto mt-10 flex max-w-3xl flex-col items-center justify-between gap-4 rounded-[5px] border border-slate-200 bg-slate-50 px-6 py-5 text-center shadow-sm sm:flex-row sm:text-left">
          <p className="text-sm font-medium !text-slate-600">
            Trusted by 500+ happy travelers for Umrah, tours, flights, and visa
            support.
          </p>

          <Link
            to="/contact"
            className="shrink-0 rounded-[5px] bg-[#FF6B00] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#00AEEF]"
          >
            Book Your Trip
          </Link>
        </div>
      </div>
    </section>
  )
}

export default TestimonialsSection