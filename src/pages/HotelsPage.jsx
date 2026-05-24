import { useState } from "react"
import { Link } from "react-router-dom"
import { FaWhatsapp, FaStar } from "react-icons/fa"
import PageHero from "../components/PageHero"
import ServiceSearchBar from "../components/ServiceSearchBar"

import hotelHero2 from "../assets/Hotels/Hotel6.jpg"
import hotelHero3 from "../assets/Hotels/Hotel5.jpg"
import hotelHero4 from "../assets/Hotels/makkahHotel4.jpg"

const hotelHeroImages = [hotelHero3, hotelHero4, hotelHero2]

const hotelResults = [
  {
    name: "Marriott Hotel",
    location: "Islamabad",
    price: "from PKR 56,235 / night",
    image: hotelHero2,
    stars: 3,
    facilities: ["WiFi", "Breakfast", "Laundry", "Room Service"],
  },
  {
    name: "Family Stay Hotel",
    location: "Makkah / Madinah options",
    price: "Custom quote available",
    image: hotelHero4,
    stars: 4,
    facilities: ["Near Haram options", "Family rooms", "Flexible stay"],
  },
  {
    name: "Budget Hotel Options",
    location: "Dubai / Turkey / Baku",
    price: "Based on travel dates",
    image: hotelHero3,
    stars: 5,
    facilities: ["Breakfast", "Lunch", "Consultant support", "Hotel guidance"],
  },
]

const starFilters = ["All", "5", "4", "3"]

const HotelsPage = () => {
  const [selectedStar, setSelectedStar] = useState("All")

  const filteredHotels =
    selectedStar === "All"
      ? hotelResults
      : hotelResults.filter((hotel) => hotel.stars === Number(selectedStar))

  return (
    <main className="relative bg-[#F8FAFC]">
      <PageHero
        eyebrow="Hotel Booking"
        title="Search hotel options for your next stay"
        mobileTitle="Find your perfect stay"
        description="Find hotel options for Umrah, family trips, local tours, business travel, and international destinations with TravelEx support."
        images={hotelHeroImages}
        variant="hotel-mobile-tight"
      >
        <ServiceSearchBar defaultService="Hotels" glass={false} />
      </PageHero>

      <section className="relative pt-32 pb-6 sm:pt-32 sm:pb-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-5 flex flex-col justify-between gap-4 sm:mb-8 md:flex-row md:items-end">
            <div>
              <p className="eyebrow mb-2 text-[#00AEEF] sm:mb-3">
                Available Stays
              </p>

              <h2 className="text-slate-950">Hotel options available</h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:mt-3 sm:text-base sm:leading-7">
                Filter hotels by star category to quickly find the stay that
                matches your comfort, budget, and travel needs.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {starFilters.map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setSelectedStar(star)}
                  className={`rounded-full px-5 py-2 text-sm font-medium transition ${
                    selectedStar === star
                      ? "bg-[#00AEEF] text-white"
                      : "bg-white text-slate-700 shadow-sm hover:bg-sky-50 hover:text-[#00AEEF]"
                  }`}
                >
                  {star === "All" ? "All Hotels" : `${star} Star`}
                </button>
              ))}
            </div>
          </div>

          {filteredHotels.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredHotels.map((hotel) => (
                <article
                  key={hotel.name}
                  className="overflow-hidden rounded-[1.5rem] bg-white shadow-md shadow-slate-200/70 transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
                >
                  <img
                    src={hotel.image}
                    alt={hotel.name}
                    className="h-48 w-full rounded-t-[1.5rem] object-cover"
                  />

                  <div className="p-4">
                    <h3 className="text-slate-950">{hotel.name}</h3>

                    <p className="mt-1 text-sm font-semibold text-slate-500">
                      {hotel.location}
                    </p>

                    <div className="mt-2 flex items-center gap-1">
                      {Array.from({ length: hotel.stars }).map((_, index) => (
                        <FaStar
                          key={index}
                          className="text-sm text-[#FFB703]"
                        />
                      ))}

                      <span className="ml-2 text-xs font-medium text-slate-500">
                        {hotel.stars} Star Hotel
                      </span>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {hotel.facilities.map((facility) => (
                        <span
                          key={facility}
                          className="rounded-full bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-600"
                        >
                          {facility}
                        </span>
                      ))}
                    </div>

                    <p className="mt-3 text-lg font-semibold text-[#FF6B00]">
                      {hotel.price}
                    </p>

                    <div className="mt-3 flex flex-col gap-2">
                      <a
                        href="https://wa.me/923111444192"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-[#FF6B00] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#00AEEF]"
                      >
                        <FaWhatsapp />
                        Chat with us
                      </a>

                      <Link
                        to="/contact"
                        className="rounded-full border border-slate-200 px-4 py-2 text-center text-sm font-medium text-slate-900 transition hover:border-[#00AEEF] hover:text-[#00AEEF]"
                      >
                        Send Inquiry
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-[1.5rem] bg-white p-8 text-center shadow-md shadow-slate-200/70">
              <h3 className="text-slate-950">No hotel found</h3>

              <p className="mt-2 text-slate-600">
                Try selecting another star category or contact TravelEx for a
                custom hotel recommendation.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

export default HotelsPage