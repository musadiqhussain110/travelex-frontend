import { FaWhatsapp, FaCheckCircle } from "react-icons/fa"
import { tours } from "../data/tours"
import { Link } from "react-router-dom"
import PageHero from "../components/PageHero"
import ServiceSearchBar from "../components/ServiceSearchBar"

const tourHeroImages = tours.slice(0, 3).map((tour) => tour.image)

const ToursPage = () => {
  return (
    <main className="bg-[#F8FAFC]">
      <PageHero
        eyebrow="Customized Tours"
        title="EXPLORE TOUR PLANS MADE FOR YOUR TRAVEL STYLE"
        mobileTitle="Plan your next tour"
        description="Choose from ready local tours or ask TravelEx to customize your destination, hotel, transport, travel dates, and group plan according to your budget and comfort."
        images={tourHeroImages}
        variant="tour-mobile-tight"
      >
        <ServiceSearchBar defaultService="Tours" glass={false} />
      </PageHero>

      {/* Tours Grid */}
      <section className="relative pt-32 pb-12 sm:pt-32 sm:pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-8 sm:mb-12">
            <p className="eyebrow mb-3 text-[#00AEEF]">Available Tours</p>

            <h2 className="text-slate-950">TravelEx tour packages</h2>

            <p className="mt-4 max-w-3xl !text-slate-600">
              Explore local destinations, family tours, day trips, and flexible
              customized travel plans.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tours.map((tour) => (
              <article
                key={tour.id}
                className="group overflow-hidden rounded-[5px] bg-white shadow-md shadow-slate-200/70 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={tour.image}
                    alt={tour.title}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />

                  <div className="badge-label absolute left-4 top-4 rounded-[5px] bg-white px-3 py-1.5 text-[#00AEEF] shadow-md">
                    {tour.duration}
                  </div>

                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white">{tour.title}</h3>

                    <p className="mt-1 text-xs font-medium !text-white/85">
                      {tour.type}
                    </p>
                  </div>
                </div>

                <div className="p-5">
                  <p className="mb-4 text-base font-semibold !text-[#FF6B00]">
                    {tour.price}
                  </p>

                  <div className="grid gap-2">
                    {tour.points.map((point) => (
                      <p
                        key={point}
                        className="rounded-[5px] bg-slate-50 px-3 py-2 text-xs font-medium !text-slate-600"
                      >
                        ✓ {point}
                      </p>
                    ))}
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-2">
                    <Link
                      to={`/tours/${tour.id}`}
                      className="rounded-[5px] border border-slate-200 bg-white px-3 py-2.5 text-center text-xs font-medium text-slate-800 transition-colors duration-300 hover:border-[#00AEEF] hover:text-[#00AEEF]"
                    >
                      View Details
                    </Link>

                    <a
                      href="https://wa.me/923111444192"
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-[5px] bg-[#FF6B00] px-3 py-2.5 text-center text-xs font-medium text-white transition-colors duration-300 hover:bg-[#00AEEF]"
                    >
                      WhatsApp
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-6 sm:pb-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="rounded-[5px] bg-white p-6 shadow-md shadow-slate-200/70 sm:p-8">
            <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <h3 className="text-slate-950">Want a customized tour plan?</h3>

                <p className="mt-3 max-w-3xl !text-slate-600">
                  Share your destination, dates, number of travelers, hotel
                  preference, and budget. TravelEx can help you plan a suitable
                  travel experience.
                </p>

                <div className="mt-4 grid gap-2 sm:grid-cols-3">
                  {[
                    "Family-friendly planning",
                    "Hotel and transport support",
                    "Flexible dates and budget",
                  ].map((item) => (
                    <p
                      key={item}
                      className="flex items-center gap-2 text-sm font-medium !text-slate-700"
                    >
                      <FaCheckCircle className="shrink-0 text-[#00AEEF]" />
                      {item}
                    </p>
                  ))}
                </div>
              </div>

              <a
                href="https://wa.me/923111444192"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-[5px] bg-[#FF6B00] px-6 py-3 text-sm font-medium text-white transition-colors duration-300 hover:bg-[#00AEEF]"
              >
                <FaWhatsapp />
                Customize Tour
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default ToursPage