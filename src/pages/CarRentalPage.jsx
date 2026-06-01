import { useEffect, useMemo, useState } from "react"
import {
  FaCar,
  FaUsers,
  FaGasPump,
  FaSuitcaseRolling,
  FaChevronDown,
  FaTimes,
} from "react-icons/fa"
import PageHero from "../components/PageHero"
import ServiceSearchBar from "../components/ServiceSearchBar"
import AuthModal from "../components/AuthModal"

import carHero1 from "../assets/Cars/Car5.avif"
import carHero2 from "../assets/Cars/Car4.webp"
import carHero3 from "../assets/Cars/Car3.jpg"
import carHero4 from "../assets/Cars/Car5.webp"
import carHero5 from "../assets/Cars/Car6.webp"

const carHeroImages = [carHero1, carHero2, carHero3]

const carOptions = [
  {
    id: 1,
    name: "Toyota Corolla VVTi 1.3",
    location: "Islamabad",
    type: "Economy",
    seats: 5,
    bags: 2,
    fuel: "Petrol",
    price: 4200,
    rating: 5,
    image: carHero4,
    features: ["AC", "Automatic", "Airport pickup", "Daily rental"],
  },
  {
    id: 2,
    name: "Honda City 1.2LS",
    location: "Islamabad / Lahore",
    type: "Comfort",
    seats: 4,
    bags: 2,
    fuel: "Petrol",
    price: 6500,
    rating: 5,
    image: carHero5,
    features: ["AC", "Comfort drive", "City travel", "Family friendly"],
  },
]

const carTypes = ["Economy", "Comfort", "Group"]

const carFeatures = ["AC", "Automatic", "Airport pickup", "Driver included"]

const CarRentalPage = () => {
  const [selectedCar, setSelectedCar] = useState(null)
  const [sortBy, setSortBy] = useState("Recommended")
  const [sortOpen, setSortOpen] = useState(false)
  const [filterOpen, setFilterOpen] = useState(false)

  const [maxPrice, setMaxPrice] = useState(12000)
  const [selectedTypes, setSelectedTypes] = useState([])
  const [selectedFeatures, setSelectedFeatures] = useState([])

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

  const toggleFeature = (feature) => {
    setSelectedFeatures((prev) =>
      prev.includes(feature)
        ? prev.filter((item) => item !== feature)
        : [...prev, feature]
    )
  }

  const filteredCars = useMemo(() => {
    let results = [...carOptions]

    results = results.filter((car) => car.price <= Number(maxPrice))

    if (selectedTypes.length > 0) {
      results = results.filter((car) => selectedTypes.includes(car.type))
    }

    if (selectedFeatures.length > 0) {
      results = results.filter((car) =>
        selectedFeatures.some((feature) => car.features.includes(feature))
      )
    }

    if (sortBy === "Price (Low to high)") {
      results.sort((a, b) => a.price - b.price)
    }

    if (sortBy === "Price (High to low)") {
      results.sort((a, b) => b.price - a.price)
    }

    return results
  }, [maxPrice, selectedTypes, selectedFeatures, sortBy])

  const maxIndex = Math.max(filteredCars.length - visibleCards, 0)
  const canGoLeft = index > 0
  const canGoRight = index < maxIndex

  useEffect(() => {
    if (index > maxIndex) {
      setIndex(maxIndex)
    }
  }, [index, maxIndex])

  useEffect(() => {
    setIndex(0)
  }, [maxPrice, selectedTypes, selectedFeatures, sortBy])

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
    setMaxPrice(12000)
    setSelectedTypes([])
    setSelectedFeatures([])
    setSortBy("Recommended")
    setIndex(0)
  }

  const handleBookNow = () => {
    if (!selectedCar) return

    setPendingBookingPath(`/booking/car-rental/${selectedCar.id}`)
    setSelectedCar(null)
    setAuthOpen(true)
  }

  return (
    <main className="bg-[#F8FAFC]">
      <PageHero
        eyebrow="Car Rental"
        title="RENT A CAR FOR AIRPORT PICKUP, TOURS, AND CITY TRAVEL"
        mobileTitle="Rent a car for your trip"
        description="Choose comfortable rental options for family trips, airport pickup, city travel, and customized tours with TravelEx support."
        images={carHeroImages}
        variant="car-mobile-tight"
      >
        <ServiceSearchBar defaultService="Car Rental" glass={false} />
      </PageHero>

      <section className="pt-36 pb-12 sm:pt-32 sm:pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
            <div className="lg:hidden">
              <button
                type="button"
                onClick={() => setFilterOpen(!filterOpen)}
                className="mb-4 flex w-full items-center justify-between rounded-[5px] border border-slate-200 bg-white px-4 py-3.5 text-sm font-semibold text-slate-950 shadow-md shadow-slate-200/70"
              >
                <span className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-[5px] bg-[#00AEEF] text-white">
                    <FaCar className="text-sm" />
                  </span>

                  <span>
                    Filters & Sort
                    {(selectedTypes.length > 0 ||
                      selectedFeatures.length > 0 ||
                      Number(maxPrice) < 12000) && (
                      <span className="ml-2 rounded-[5px] bg-[#FF6B00] px-2 py-0.5 text-[10px] font-semibold text-white">
                        Active
                      </span>
                    )}
                  </span>
                </span>

                <span className="flex items-center gap-2 text-xs font-semibold text-[#00AEEF]">
                  {filterOpen ? "Hide" : "Open"}
                  <FaChevronDown
                    className={`text-xs transition-transform ${
                      filterOpen ? "rotate-180" : ""
                    }`}
                  />
                </span>
              </button>
            </div>

            <aside
              className={`h-fit overflow-hidden rounded-[5px] border border-slate-200 bg-white shadow-md shadow-slate-200/70 ${
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
                    <span className="rounded-[5px] bg-blue-500 px-2 py-1 text-xs font-semibold text-white">
                      Rs4 200
                    </span>

                    <span className="rounded-[5px] bg-blue-500 px-2 py-1 text-xs font-semibold text-white">
                      Rs{Number(maxPrice).toLocaleString()}
                    </span>
                  </div>

                  <input
                    type="range"
                    min="4200"
                    max="12000"
                    step="500"
                    value={maxPrice}
                    onChange={(event) => setMaxPrice(event.target.value)}
                    className="w-full accent-blue-500"
                  />

                  <div className="mt-2 flex justify-between text-[11px] font-semibold text-slate-400">
                    <span>4 200</span>
                    <span>6 500</span>
                    <span>9 000</span>
                    <span>12 000</span>
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
                    Car Type
                  </h4>

                  <FaChevronDown className="text-xs text-slate-900" />
                </div>

                <div className="grid gap-4">
                  {carTypes.map((type) => (
                    <label
                      key={type}
                      className="flex cursor-pointer items-center gap-3 text-sm font-medium text-slate-500"
                    >
                      <input
                        type="checkbox"
                        checked={selectedTypes.includes(type)}
                        onChange={() => toggleType(type)}
                        className="h-5 w-5 rounded-[5px] border-slate-300 accent-[#00AEEF]"
                      />
                      {type}
                    </label>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-100 p-4 sm:p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-slate-950">
                    Features
                  </h4>

                  <FaChevronDown className="text-xs text-slate-900" />
                </div>

                <div className="grid gap-4">
                  {carFeatures.map((feature) => (
                    <label
                      key={feature}
                      className="flex cursor-pointer items-center gap-3 text-sm font-medium text-slate-500"
                    >
                      <input
                        type="checkbox"
                        checked={selectedFeatures.includes(feature)}
                        onChange={() => toggleFeature(feature)}
                        className="h-5 w-5 rounded-[5px] border-slate-300 accent-[#00AEEF]"
                      />
                      {feature}
                    </label>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-6 w-full rounded-[5px] border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-800 transition hover:border-[#00AEEF] hover:text-[#00AEEF]"
                >
                  Reset Filters
                </button>
              </div>
            </aside>

            <div>
              <div className="mb-5 flex flex-col justify-between gap-3 sm:mb-6 sm:flex-row sm:items-center">
                <h2 className="text-slate-950">
                  {filteredCars.length} car
                  {filteredCars.length === 1 ? "" : "s"} found
                </h2>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setSortOpen(!sortOpen)}
                    className="flex w-full items-center justify-between gap-3 rounded-[5px] border border-slate-200 bg-white px-4 py-3 text-xs font-semibold text-slate-900 shadow-sm sm:min-w-52 sm:text-sm"
                  >
                    Sort by: {sortBy}
                    <FaChevronDown className="text-xs" />
                  </button>

                  {sortOpen && (
                    <div className="absolute right-0 top-12 z-30 w-56 overflow-hidden rounded-[5px] border border-slate-100 bg-white shadow-2xl">
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

              {filteredCars.length === 0 ? (
                <div className="rounded-[5px] bg-white p-8 text-center shadow-md shadow-slate-200/70">
                  <h3 className="text-slate-950">No cars found</h3>

                  <p className="mt-3 !text-slate-600">
                    Try changing your filters or contact TravelEx for a custom
                    rental inquiry.
                  </p>

                  <button
                    type="button"
                    onClick={resetFilters}
                    className="mt-5 rounded-[5px] bg-[#FF6B00] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#00AEEF]"
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
                      className="absolute -left-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-[5px] bg-white text-xl font-medium text-slate-900 shadow-lg transition-colors duration-300 hover:bg-[#00AEEF] hover:text-white sm:-left-4 md:-left-5"
                      aria-label="Previous car"
                    >
                      ‹
                    </button>
                  )}

                  {maxIndex > 0 && canGoRight && (
                    <button
                      type="button"
                      onClick={nextSlide}
                      className="absolute -right-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-[5px] bg-white text-xl font-medium text-slate-900 shadow-lg transition-colors duration-300 hover:bg-[#00AEEF] hover:text-white sm:-right-4 md:-right-5"
                      aria-label="Next car"
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
                      {filteredCars.map((car) => (
                        <div
                          key={car.id}
                          className="min-w-full px-1 md:min-w-[50%] md:px-3 xl:min-w-[33.333333%]"
                        >
                          <article className="h-full overflow-hidden rounded-[5px] border border-slate-200 bg-white shadow-md shadow-slate-200/70 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                            <div className="relative h-52 overflow-hidden">
                              <img
                                src={car.image}
                                alt={car.name}
                                className="h-full w-full object-cover"
                              />

                              <div className="badge-label absolute left-4 top-4 rounded-[5px] bg-white px-3 py-1.5 text-[#00AEEF] shadow-md">
                                {car.type}
                              </div>
                            </div>

                            <div className="p-5">
                              <h3 className="text-slate-950">{car.name}</h3>

                              <p className="mt-1 text-sm font-medium !text-slate-500">
                                {car.location}
                              </p>

                              <div className="mt-4 grid grid-cols-3 gap-2">
                                <div className="rounded-[5px] bg-slate-50 p-3 text-center">
                                  <FaUsers className="mx-auto text-[#00AEEF]" />
                                  <p className="mt-1 text-xs font-medium !text-slate-600">
                                    {car.seats} seats
                                  </p>
                                </div>

                                <div className="rounded-[5px] bg-slate-50 p-3 text-center">
                                  <FaSuitcaseRolling className="mx-auto text-[#00AEEF]" />
                                  <p className="mt-1 text-xs font-medium !text-slate-600">
                                    {car.bags} bags
                                  </p>
                                </div>

                                <div className="rounded-[5px] bg-slate-50 p-3 text-center">
                                  <FaGasPump className="mx-auto text-[#00AEEF]" />
                                  <p className="mt-1 text-xs font-medium !text-slate-600">
                                    {car.fuel}
                                  </p>
                                </div>
                              </div>

                              <p className="mt-4 text-lg font-semibold !text-[#FF6B00]">
                                Rs {car.price.toLocaleString()}{" "}
                                <span className="text-xs font-medium text-slate-500">
                                  / day
                                </span>
                              </p>

                              <button
                                type="button"
                                onClick={() => setSelectedCar(car)}
                                className="mt-5 w-full rounded-[5px] bg-[#FF6B00] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#00AEEF]"
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
                            className={`h-2 rounded-[5px] transition-all ${
                              index === dotIndex
                                ? "w-8 bg-[#00AEEF]"
                                : "w-2 bg-slate-300"
                            }`}
                            aria-label={`Go to car slide ${dotIndex + 1}`}
                          />
                        )
                      )}
                    </div>
                  )}
                </div>
              )}

              <p className="mt-10 text-center text-sm font-medium !text-slate-400">
                Showing {filteredCars.length} - {filteredCars.length} of{" "}
                {filteredCars.length} Cars
              </p>
            </div>
          </div>
        </div>
      </section>

      {selectedCar && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 px-4 py-6">
          <div className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-[5px] bg-white shadow-2xl">
            <button
              type="button"
              onClick={() => setSelectedCar(null)}
              className="absolute right-4 top-4 z-20 flex h-12 w-12 items-center justify-center rounded-[5px] bg-slate-900 text-white transition hover:bg-[#FF6B00]"
              aria-label="Close modal"
            >
              <FaTimes />
            </button>

            <div className="grid gap-6 p-6 md:grid-cols-[1fr_1fr]">
              <img
                src={selectedCar.image}
                alt={selectedCar.name}
                className="h-72 w-full rounded-[5px] object-cover"
              />

              <div>
                <p className="eyebrow mb-3 text-[#00AEEF]">
                  Car Rental Details
                </p>

                <h2 className="text-slate-950">{selectedCar.name}</h2>

                <p className="mt-2 text-sm font-medium !text-slate-500">
                  {selectedCar.location}
                </p>

                <p className="mt-5 text-2xl font-semibold !text-[#FF6B00]">
                  Rs {selectedCar.price.toLocaleString()}{" "}
                  <span className="text-sm font-medium text-slate-500">
                    / day
                  </span>
                </p>

                <div className="mt-5 grid gap-2">
                  {selectedCar.features.map((feature) => (
                    <p
                      key={feature}
                      className="rounded-[5px] bg-slate-50 px-4 py-3 text-sm font-medium !text-slate-600"
                    >
                      ✓ {feature}
                    </p>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleBookNow}
                  className="mt-6 w-full rounded-[5px] bg-[#FF6B00] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#00AEEF]"
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

export default CarRentalPage