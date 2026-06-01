import { Link } from "react-router-dom"
import { FaWhatsapp, FaCheckCircle } from "react-icons/fa"
import { packages } from "../data/packages"
import PageHero from "../components/PageHero"
import ServiceSearchBar from "../components/ServiceSearchBar"

import Umrah2 from "../assets/Umrah/Umrah11.webp"
import Umrah3 from "../assets/Umrah/Umrah12.jpg"
import Umrah4 from "../assets/Umrah/Umrah4.jpg"
import Umrah5 from "../assets/Umrah/Umrah5.webp"
import Umrah6 from "../assets/Umrah/Umrah6.webp"
import Umrah7 from "../assets/Umrah/Umrah7.webp"

const umrahHeroImages = [Umrah2, Umrah3]

const packageImages = [Umrah4, Umrah5, Umrah6, Umrah7]

const BrandName = () => (
  <span className="font-semibold">
    <span className="text-[#FF6B00]">Travel</span>
    <span className="text-[#00AEEF]">Ex</span>
  </span>
)

const UmrahPage = () => {
  return (
    <main className="bg-[#F8FAFC]">
      <PageHero
        eyebrow="Umrah Packages"
        title="CHOOSE AN UMRAH PLAN ACCORDING TO YOUR COMFORT AND BUDGET"
        mobileTitle="Choose your Umrah"
        description="Explore TravelEx Umrah packages with hotel guidance, visa support, travel planning, and WhatsApp consultation for families, groups, and individual travelers."
        images={umrahHeroImages}
        variant="umrah-mobile-tight"
      >
        <ServiceSearchBar defaultService="Umrah" glass={false} />
      </PageHero>

      {/* Packages */}
      <section className="relative pt-56 pb-12 sm:pt-32 sm:pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-8 sm:mb-12">
            <p className="eyebrow mb-3 text-[#00AEEF]">Available Plans</p>

            <h2 className="text-slate-950">
              Umrah packages by <BrandName />
            </h2>

            <p className="mt-4 max-w-3xl !text-slate-600">
              Select a ready package or request a customized Umrah plan based on
              travel dates, hotel preference, number of passengers, and budget.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {packages.map((pkg, index) => (
              <article
                key={pkg.id}
                className="group overflow-hidden rounded-[5px] bg-white shadow-md shadow-slate-200/70 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={packageImages[index % packageImages.length]}
                    alt={pkg.title}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />

                  <div className="badge-label absolute left-4 top-4 rounded-[5px] bg-white px-3 py-1.5 text-[#00AEEF] shadow-md">
                    {pkg.type}
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="text-slate-950">{pkg.title}</h3>

                  <p className="mt-1 text-xs font-medium !text-slate-500">
                    {pkg.from}
                  </p>

                  <p className="mt-3 text-base font-semibold !text-[#FF6B00]">
                    {pkg.price}
                  </p>

                  <div className="mt-4 grid gap-2">
                    {pkg.highlights.map((item) => (
                      <p
                        key={item}
                        className="rounded-[5px] bg-slate-50 px-3 py-2 text-xs font-medium !text-slate-600"
                      >
                        ✓ {item}
                      </p>
                    ))}
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <Link
                      to={`/package/${pkg.id}`}
                      className="rounded-[5px] border border-slate-200 px-3 py-2.5 text-center text-xs font-medium text-slate-800 transition-colors duration-300 hover:border-[#00AEEF] hover:text-[#00AEEF]"
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

      {/* Trust CTA */}
      <section className="pb-6 sm:pb-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="rounded-[5px] bg-white p-6 shadow-md shadow-slate-200/70 sm:p-8">
            <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <h3 className="text-slate-950">
                  Not sure which Umrah package is right for you?
                </h3>

                <p className="mt-3 max-w-3xl !text-slate-600">
                  Share your departure city, travel date, number of adults and
                  children, and hotel preference. <BrandName /> can guide you
                  with a suitable package through WhatsApp or phone support.
                </p>

                <div className="mt-4 grid gap-2 sm:grid-cols-3">
                  {[
                    "17+ years serving travelers",
                    "24/7 support",
                    "Transparent package guidance",
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
                Get Guidance
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default UmrahPage