import { useEffect, useMemo, useState } from "react"
import {
  FaPlaneDeparture,
  FaPlaneArrival,
  FaChevronDown,
  FaTimes,
} from "react-icons/fa"
import PageHero from "../components/PageHero"
import ServiceSearchBar from "../components/ServiceSearchBar"
import AuthModal from "../components/AuthModal"

import flightHero1 from "../assets/Flights/Flight2.jpg"
import flightHero2 from "../assets/Flights/Flight7.png"
import flightHero3 from "../assets/Flights/Flight5.jpg"

const flightHeroImages = [flightHero1, flightHero2, flightHero3]

const flightOptions = [
  {
    id: 1,
    airline: "Air Blue",
    logo: "https://www.airblue.com/content/filebank?id=553bb04c-35b9-4375-9f92-95acfb67c88e",
    route: "Islamabad to Karachi",
    fromCode: "ISB",
    toCode: "KHI",
    fromAirport: "Islamabad International Airport",
    toAirport: "Jinnah International Airport",
    takeOff: "12:00",
    landing: "14:00",
    date: "Thu, Dec 15",
    startDate: "12/15/2022",
    duration: "2 hrs",
    type: "Economy",
    price: 12000,
    experiences: ["Inflight Dining", "Seats & Cabin"],
    seats: [
      {
        type: "Economy",
        baggage: "Adult",
        checkIn: "1 Kgs",
        cabin: "1 Kgs",
        price: 12000,
        number: 1,
      },
      {
        type: "Business",
        baggage: "Adult",
        checkIn: "1 Kgs",
        cabin: "1 Kgs",
        price: 15000,
        number: 0,
      },
    ],
  },
  {
    id: 2,
    airline: "Air Blue",
    logo: "https://www.airblue.com/content/filebank?id=553bb04c-35b9-4375-9f92-95acfb67c88e",
    route: "Lahore to Dubai",
    fromCode: "LHE",
    toCode: "DXB",
    fromAirport: "Allama Iqbal International Airport",
    toAirport: "Dubai International Airport",
    takeOff: "09:30",
    landing: "12:15",
    date: "Fri, Dec 16",
    startDate: "12/16/2022",
    duration: "2 hrs 45 mins",
    type: "Business",
    price: 15000,
    experiences: ["Music", "Seats & Cabin"],
    seats: [
      {
        type: "Economy",
        baggage: "Adult",
        checkIn: "1 Kgs",
        cabin: "1 Kgs",
        price: 13500,
        number: 0,
      },
      {
        type: "Business",
        baggage: "Adult",
        checkIn: "1 Kgs",
        cabin: "1 Kgs",
        price: 15000,
        number: 1,
      },
    ],
  },
]

const flightTypes = ["Business", "First Class", "Economy", "Premium Economy"]

const inflightOptions = [
  "Inflight Dining",
  "Music",
  "Sky Shopping",
  "Seats & Cabin",
]

const FlightsPage = () => {
  const [selectedFlight, setSelectedFlight] = useState(null)
  const [sortBy, setSortBy] = useState("Recommended")
  const [sortOpen, setSortOpen] = useState(false)
  const [filterOpen, setFilterOpen] = useState(false)

  const [maxPrice, setMaxPrice] = useState(15000)
  const [selectedTypes, setSelectedTypes] = useState([])
  const [selectedExperiences, setSelectedExperiences] = useState([])

  const [index, setIndex] = useState(0)
  const [visibleCards, setVisibleCards] = useState(1)

  const [authOpen, setAuthOpen] = useState(false)
  const [pendingBookingPath, setPendingBookingPath] = useState("")

  useEffect(() => {
    const updateVisibleCards = () => {
      if (window.innerWidth >= 1280) {
        setVisibleCards(3)
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

  const toggleType = (type) => {
    setSelectedTypes((prev) =>
      prev.includes(type)
        ? prev.filter((item) => item !== type)
        : [...prev, type]
    )
  }

  const toggleExperience = (experience) => {
    setSelectedExperiences((prev) =>
      prev.includes(experience)
        ? prev.filter((item) => item !== experience)
        : [...prev, experience]
    )
  }

  const filteredFlights = useMemo(() => {
    let results = [...flightOptions]

    results = results.filter((flight) => flight.price <= Number(maxPrice))

    if (selectedTypes.length > 0) {
      results = results.filter((flight) => selectedTypes.includes(flight.type))
    }

    if (selectedExperiences.length > 0) {
      results = results.filter((flight) =>
        selectedExperiences.some((experience) =>
          flight.experiences.includes(experience)
        )
      )
    }

    if (sortBy === "Price (Low to high)") {
      results.sort((a, b) => a.price - b.price)
    }

    if (sortBy === "Price (High to low)") {
      results.sort((a, b) => b.price - a.price)
    }

    return results
  }, [maxPrice, selectedTypes, selectedExperiences, sortBy])

  const maxIndex = Math.max(filteredFlights.length - visibleCards, 0)
  const canGoLeft = index > 0
  const canGoRight = index < maxIndex

  useEffect(() => {
    if (index > maxIndex) {
      setIndex(maxIndex)
    }
  }, [index, maxIndex])

  useEffect(() => {
    setIndex(0)
  }, [maxPrice, selectedTypes, selectedExperiences, sortBy])

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

  const resetFilters = () => {
    setMaxPrice(15000)
    setSelectedTypes([])
    setSelectedExperiences([])
    setSortBy("Recommended")
    setIndex(0)
  }

  const handleBookNow = () => {
    if (!selectedFlight) return

    setPendingBookingPath(`/booking/flights/${selectedFlight.id}`)
    setSelectedFlight(null)
    setAuthOpen(true)
  }

  return (
    <main className="bg-[#F8FAFC]">
<PageHero
  eyebrow="Flight Booking"
  title="Search flights for domestic and international travel"
  mobileTitle="Find your next flight"
  description="Compare available flight options, choose a seat type, and continue your booking inquiry with TravelEx support."
  images={flightHeroImages}
  variant="flight-mobile-tight"
>
  <ServiceSearchBar defaultService="Flights" glass={false} />
</PageHero>
<section className="relative pt-60 pb-12 sm:pt-32 sm:pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
            <div className="lg:hidden">
              <button
                type="button"
                onClick={() => setFilterOpen(!filterOpen)}
                className="mb-4 flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-semibold text-slate-950 shadow-md shadow-slate-200/70"
              >
                <span className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#00AEEF] text-white">
                    <FaChevronDown
                      className={`text-xs transition-transform ${
                        filterOpen ? "rotate-180" : ""
                      }`}
                    />
                  </span>

                  <span>
                    Filters & Sort
                    {(selectedTypes.length > 0 ||
                      selectedExperiences.length > 0 ||
                      Number(maxPrice) < 15000) && (
                      <span className="ml-2 rounded-full bg-[#FF6B00] px-2 py-0.5 text-[10px] font-semibold text-white">
                        Active
                      </span>
                    )}
                  </span>
                </span>

                <span className="text-xs font-semibold text-[#00AEEF]">
                  {filterOpen ? "Hide" : "Open"}
                </span>
              </button>
            </div>

            <aside
              className={`h-fit overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-md shadow-slate-200/70 ${
                filterOpen ? "block" : "hidden"
              } lg:block`}
            >
              <div className="border-l-4 border-[#00AEEF] px-5 py-4">
                <h3 className="text-slate-950 uppercase tracking-wide">
                  Filter By
                </h3>
              </div>

              <div className="border-t border-slate-100 p-4 sm:p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-slate-950">
                    Filter Price
                  </h4>

                  <FaChevronDown className="text-xs text-slate-900" />
                </div>

                <div className="relative pt-5">
                  <div className="mb-2 flex justify-between">
                    <span className="rounded bg-blue-500 px-2 py-1 text-xs font-semibold text-white">
                      Rs12 000
                    </span>

                    <span className="rounded bg-blue-500 px-2 py-1 text-xs font-semibold text-white">
                      Rs{Number(maxPrice).toLocaleString()}
                    </span>
                  </div>

                  <input
                    type="range"
                    min="12000"
                    max="15000"
                    step="500"
                    value={maxPrice}
                    onChange={(event) => setMaxPrice(event.target.value)}
                    className="w-full accent-blue-500"
                  />

                  <div className="mt-2 flex justify-between text-[11px] font-semibold text-slate-400">
                    <span>12 000</span>
                    <span>12 750</span>
                    <span>13 500</span>
                    <span>14 250</span>
                    <span>15 000</span>
                  </div>

                  <button
                    type="button"
                    className="mt-5 text-sm font-semibold uppercase tracking-wider text-blue-500"
                  >
                    Apply
                  </button>
                </div>
              </div>

              <div className="border-t border-slate-100 p-4 sm:p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-slate-950">
                    Flight Type
                  </h4>

                  <FaChevronDown className="text-xs text-slate-900" />
                </div>

                <div className="grid gap-4">
                  {flightTypes.map((type) => (
                    <label
                      key={type}
                      className="flex cursor-pointer items-center gap-3 text-sm font-medium text-slate-500"
                    >
                      <input
                        type="checkbox"
                        checked={selectedTypes.includes(type)}
                        onChange={() => toggleType(type)}
                        className="h-5 w-5 rounded border-slate-300 accent-[#00AEEF]"
                      />
                      {type}
                    </label>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-100 p-4 sm:p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-slate-950">
                    Inflight Experience
                  </h4>

                  <FaChevronDown className="text-xs text-slate-900" />
                </div>

                <div className="grid gap-4">
                  {inflightOptions.map((option) => (
                    <label
                      key={option}
                      className="flex cursor-pointer items-center gap-3 text-sm font-medium text-slate-500"
                    >
                      <input
                        type="checkbox"
                        checked={selectedExperiences.includes(option)}
                        onChange={() => toggleExperience(option)}
                        className="h-5 w-5 rounded border-slate-300 accent-[#00AEEF]"
                      />
                      {option}
                    </label>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-6 w-full rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-800 transition hover:border-[#00AEEF] hover:text-[#00AEEF]"
                >
                  Reset Filters
                </button>
              </div>
            </aside>

            <div>
              <div className="mb-5 flex flex-col justify-between gap-3 sm:mb-6 sm:flex-row sm:items-center">
                <h2 className="text-slate-950">
                  {filteredFlights.length} flight
                  {filteredFlights.length === 1 ? "" : "s"} found
                </h2>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setSortOpen(!sortOpen)}
                    className="flex w-full items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs font-semibold text-slate-900 shadow-sm sm:min-w-52 sm:text-sm"
                  >
                    Sort by: {sortBy}
                    <FaChevronDown className="text-xs" />
                  </button>

                  {sortOpen && (
                    <div className="absolute right-0 top-12 z-30 w-56 overflow-hidden rounded-xl border border-slate-100 bg-white shadow-2xl">
                      {[
                        "Recommended",
                        "Price (Low to high)",
                        "Price (High to low)",
                      ].map((item) => (
                        <button
                          type="button"
                          key={item}
                          onClick={() => {
                            setSortBy(item)
                            setSortOpen(false)
                          }}
                          className="block w-full px-5 py-3 text-left text-sm font-medium text-slate-700 hover:bg-sky-50 hover:text-[#00AEEF]"
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {filteredFlights.length === 0 ? (
                <div className="rounded-[1.5rem] bg-white p-8 text-center shadow-md shadow-slate-200/70">
                  <h3 className="text-slate-950">No flights found</h3>

                  <p className="mt-3 text-slate-600">
                    Try changing your filters or contact TravelEx for a custom
                    flight inquiry.
                  </p>

                  <button
                    type="button"
                    onClick={resetFilters}
                    className="mt-5 rounded-full bg-[#FF6B00] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#00AEEF]"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="relative px-3 sm:px-0">
                  {maxIndex > 0 && canGoLeft && (
                    <button
                      type="button"
                      onClick={prevSlide}
                      className="absolute -left-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white text-xl font-medium text-slate-900 shadow-lg transition-colors duration-300 hover:bg-[#00AEEF] hover:text-white sm:-left-4 md:-left-5"
                      aria-label="Previous flight"
                    >
                      ‹
                    </button>
                  )}

                  {maxIndex > 0 && canGoRight && (
                    <button
                      type="button"
                      onClick={nextSlide}
                      className="absolute -right-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white text-xl font-medium text-slate-900 shadow-lg transition-colors duration-300 hover:bg-[#00AEEF] hover:text-white sm:-right-4 md:-right-5"
                      aria-label="Next flight"
                    >
                      ›
                    </button>
                  )}

                  <div className="overflow-hidden">
                    <div
                      className="flex transition-transform duration-500 ease-out"
                      style={{
                        transform: `translateX(-${
                          index * (100 / visibleCards)
                        }%)`,
                      }}
                    >
                      {filteredFlights.map((flight) => (
                        <div
                          key={flight.id}
                          className="min-w-full px-1 md:min-w-[50%] md:px-3 xl:min-w-[33.333333%]"
                        >
                          <article className="h-full overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-md shadow-slate-200/70 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                            <div className="p-4 sm:p-6">
                              <div className="flex h-44 w-full items-center justify-center overflow-hidden rounded-2xl bg-slate-50 sm:h-36">
                                <img
                                  src={flight.logo}
                                  alt={flight.airline}
                                  className="h-full w-full object-contain p-3 sm:max-h-32 sm:w-auto sm:max-w-full"
                                />
                              </div>

                              <div className="mt-5">
                                <h3 className="text-sm font-semibold leading-6 text-slate-950 sm:text-base">
                                  {flight.fromAirport}
                                </h3>

                                <p className="mt-2 text-sm font-semibold text-[#FF6B00]">
                                  Rs {flight.price.toLocaleString()}{" "}
                                  <span className="text-xs font-medium text-slate-500">
                                    / person
                                  </span>
                                </p>
                              </div>
                            </div>

                            <div className="border-t border-slate-100 p-4 sm:p-5">
                              <div className="flex items-start gap-3">
                                <FaPlaneDeparture className="mt-1 text-xl text-[#00AEEF]" />

                                <div>
                                  <p className="text-sm font-semibold text-slate-950">
                                    Take off
                                  </p>

                                  <p className="mt-1 text-xs font-medium text-slate-600 sm:text-sm">
                                    {flight.date} {flight.takeOff} PM
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="border-t border-slate-100 p-4 sm:p-5">
                              <div className="flex items-start gap-3">
                                <FaPlaneArrival className="mt-1 text-xl text-[#00AEEF]" />

                                <div>
                                  <p className="text-sm font-semibold text-slate-950">
                                    Landing
                                  </p>

                                  <p className="mt-1 text-xs font-medium text-slate-600 sm:text-sm">
                                    {flight.date} {flight.landing} PM
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="border-t border-slate-100 p-4 sm:p-5">
                              <button
                                type="button"
                                onClick={() => setSelectedFlight(flight)}
                                className="w-full rounded-xl bg-[#FF6B00] px-5 py-3 text-sm font-semibold text-white transition-colors duration-300 hover:bg-[#00AEEF]"
                              >
                                Choose
                              </button>
                            </div>
                          </article>
                        </div>
                      ))}
                    </div>
                  </div>

                  {maxIndex > 0 && (
                    <div className="mt-5 flex justify-center gap-2">
                      {Array.from({ length: maxIndex + 1 }).map(
                        (_, dotIndex) => (
                          <button
                            type="button"
                            key={dotIndex}
                            onClick={() => setIndex(dotIndex)}
                            className={`h-2 rounded-full transition-all ${
                              index === dotIndex
                                ? "w-8 bg-[#00AEEF]"
                                : "w-2 bg-slate-300"
                            }`}
                            aria-label={`Go to flight slide ${dotIndex + 1}`}
                          />
                        )
                      )}
                    </div>
                  )}
                </div>
              )}

              <p className="mt-10 text-center text-sm font-medium text-slate-400">
                Showing {filteredFlights.length} - {filteredFlights.length} of{" "}
                {filteredFlights.length} Flights
              </p>
            </div>
          </div>
        </div>
      </section>

      {selectedFlight && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 px-4 py-6">
          <div className="relative max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-[1.5rem] bg-white shadow-2xl">
            <button
              type="button"
              onClick={() => setSelectedFlight(null)}
              className="absolute right-4 top-4 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-white transition hover:bg-[#FF6B00]"
              aria-label="Close modal"
            >
              <FaTimes />
            </button>

            <div className="grid gap-6 border-b border-slate-100 p-6 md:grid-cols-[1fr_1fr_1fr] md:items-center">
              <div className="flex items-center gap-4">
                <img
                  src={selectedFlight.logo}
                  alt={selectedFlight.airline}
                  className="h-20 w-28 object-contain"
                />

                <p className="text-sm font-medium text-slate-700">
                  {selectedFlight.route} | {selectedFlight.fromCode}-
                  {selectedFlight.toCode}
                </p>
              </div>

              <div className="flex items-start gap-4">
                <FaPlaneDeparture className="mt-1 text-3xl text-[#00AEEF]" />

                <div>
                  <p className="text-xl font-semibold text-slate-950">
                    {selectedFlight.takeOff}
                  </p>

                  <p className="text-sm font-medium text-slate-600">
                    {selectedFlight.date}
                  </p>

                  <p className="mt-1 text-sm font-medium text-slate-700">
                    {selectedFlight.fromAirport}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <FaPlaneArrival className="mt-1 text-3xl text-[#00AEEF]" />

                <div>
                  <p className="text-xl font-semibold text-slate-950">
                    {selectedFlight.landing}
                  </p>

                  <p className="text-sm font-medium text-slate-600">
                    {selectedFlight.date}
                  </p>

                  <p className="mt-1 text-sm font-medium text-slate-700">
                    {selectedFlight.toAirport}
                  </p>
                </div>
              </div>

              <div className="text-center md:col-span-3">
                <span className="inline-block border-b-2 border-[#00AEEF] text-sm font-semibold text-slate-950">
                  {selectedFlight.duration}
                </span>
              </div>
            </div>

            <div className="overflow-x-auto p-6">
              <div className="min-w-[760px]">
                {selectedFlight.seats.map((seat) => (
                  <div
                    key={seat.type}
                    className="grid grid-cols-6 items-center border-b border-slate-100 py-5 last:border-b-0"
                  >
                    <div>
                      <p className="font-semibold text-slate-950">Seat type</p>
                      <p className="mt-1 text-sm font-medium text-slate-600">
                        {seat.type}
                      </p>
                    </div>

                    <div>
                      <p className="font-semibold text-slate-950">Baggage</p>
                      <p className="mt-1 text-sm font-medium text-slate-600">
                        {seat.baggage}
                      </p>
                    </div>

                    <div>
                      <p className="font-semibold text-slate-950">Check-in</p>
                      <p className="mt-1 text-sm font-medium text-slate-600">
                        {seat.checkIn}
                      </p>
                    </div>

                    <div>
                      <p className="font-semibold text-slate-950">Cabin</p>
                      <p className="mt-1 text-sm font-medium text-slate-600">
                        {seat.cabin}
                      </p>
                    </div>

                    <div>
                      <p className="font-semibold text-slate-950">Price</p>
                      <p className="mt-1 text-sm font-medium text-slate-600">
                        Rs{seat.price.toLocaleString()}
                      </p>
                    </div>

                    <div>
                      <p className="font-semibold text-slate-950">Number</p>
                      <p className="mt-1 flex items-center gap-4 text-sm font-medium text-slate-600">
                        <FaChevronDown />
                        <span>{seat.number}</span>
                        <FaChevronDown className="rotate-180" />
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4 border-t border-slate-100 p-6 text-center sm:grid-cols-[1fr_auto_1fr] sm:items-center">
              <div />

              <div>
                <p className="text-sm font-medium text-slate-600">
                  Pay Amount
                </p>

                <p className="text-xl font-semibold text-slate-950">
                  Rs{selectedFlight.price.toLocaleString()}
                </p>
              </div>

              <div className="flex justify-center sm:justify-end">
                <button
                  type="button"
                  onClick={handleBookNow}
                  className="rounded-xl bg-[#FF6B00] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#00AEEF]"
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        bookingPath={pendingBookingPath}
      />
    </main>
  )
}

export default FlightsPage