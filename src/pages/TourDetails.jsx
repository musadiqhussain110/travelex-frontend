import { Link, useParams } from "react-router-dom"
import {
  FaArrowLeft,
  FaCheckCircle,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaRegClock,
  FaRoute,
  FaWhatsapp,
} from "react-icons/fa"
import { tours } from "../data/tours"

const TourDetails = () => {
  const { id } = useParams()
  const tour = tours.find((item) => item.id === id)

  if (!tour) {
    return (
      <main className="bg-[#F8FAFC] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="rounded-[2rem] bg-white p-8 text-center shadow-md shadow-slate-200/70">
            <h1 className="text-3xl font-black text-slate-950">
              Tour not found
            </h1>

            <p className="mt-3 text-sm leading-7 text-slate-600">
              The tour you are looking for does not exist or may have been
              moved.
            </p>

            <Link
              to="/tours"
              className="mt-6 inline-flex rounded-full bg-[#FF6B00] px-6 py-3 text-sm font-black text-white transition-colors duration-300 hover:bg-[#00AEEF]"
            >
              Back to Tours
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="bg-[#F8FAFC]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-950 py-14 text-white sm:py-20">
        <img
          src={tour.image}
          alt={tour.title}
          className="absolute inset-0 h-full w-full object-cover opacity-35"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/40" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
          <Link
            to="/tours"
            className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-slate-300 transition-colors duration-300 hover:text-[#00AEEF]"
          >
            <FaArrowLeft />
            Back to tours
          </Link>

          <p className="mb-3 inline-flex rounded-full bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-wider text-[#00AEEF]">
            {tour.type}
          </p>

          <h1 className="max-w-3xl text-4xl font-black leading-tight sm:text-5xl md:text-6xl">
            {tour.title}
          </h1>

          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 md:text-base">
            {tour.overview}
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <a
              href="https://wa.me/923111444192"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-black text-white transition-colors duration-300 hover:bg-[#00AEEF]"
            >
              <FaWhatsapp />
              Plan on WhatsApp
            </a>

            <a
              href="tel:03111444192"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-black text-slate-950 transition-colors duration-300 hover:bg-[#FF6B00] hover:text-white"
            >
              <FaPhoneAlt />
              Call 03 111 444 192
            </a>
          </div>
        </div>
      </section>

      {/* Details */}
      <section className="py-12 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-[1fr_0.42fr]">
          <div className="grid gap-6">
            <div className="overflow-hidden rounded-[2rem] bg-white shadow-md shadow-slate-200/70">
              <img
                src={tour.image}
                alt={tour.title}
                className="h-72 w-full object-cover"
              />

              <div className="p-6 sm:p-8">
                <h2 className="text-2xl font-black text-slate-950">
                  Tour Overview
                </h2>

                <p className="mt-3 text-sm leading-7 text-slate-600 md:text-base">
                  {tour.overview}
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <FaRegClock className="text-xl text-[#00AEEF]" />
                    <p className="mt-3 text-xs font-black uppercase tracking-wider text-slate-400">
                      Duration
                    </p>
                    <p className="mt-1 text-sm font-black text-slate-950">
                      {tour.duration}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4">
                    <FaMapMarkerAlt className="text-xl text-[#00AEEF]" />
                    <p className="mt-3 text-xs font-black uppercase tracking-wider text-slate-400">
                      Tour Type
                    </p>
                    <p className="mt-1 text-sm font-black text-slate-950">
                      {tour.type}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4">
                    <FaRoute className="text-xl text-[#00AEEF]" />
                    <p className="mt-3 text-xs font-black uppercase tracking-wider text-slate-400">
                      Plan
                    </p>
                    <p className="mt-1 text-sm font-black text-slate-950">
                      Customizable
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] bg-white p-6 shadow-md shadow-slate-200/70 sm:p-8">
              <h2 className="text-2xl font-black text-slate-950">
                Tour Highlights
              </h2>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {tour.points.map((item) => (
                  <p
                    key={item}
                    className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700"
                  >
                    <FaCheckCircle className="shrink-0 text-[#00AEEF]" />
                    {item}
                  </p>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] bg-white p-6 shadow-md shadow-slate-200/70 sm:p-8">
              <h2 className="text-2xl font-black text-slate-950">
                What can be included?
              </h2>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {tour.inclusions.map((item) => (
                  <p
                    key={item}
                    className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700"
                  >
                    <FaCheckCircle className="shrink-0 text-[#FF6B00]" />
                    {item}
                  </p>
                ))}
              </div>

              <p className="mt-6 rounded-2xl bg-sky-50 px-4 py-4 text-sm font-semibold leading-7 text-slate-600">
                {tour.note}
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="h-fit rounded-[2rem] bg-white p-6 shadow-md shadow-slate-200/70 lg:sticky lg:top-28">
            <p className="text-xs font-black uppercase tracking-wider text-slate-400">
              Starting Price
            </p>

            <p className="mt-2 text-2xl font-black text-[#FF6B00]">
              {tour.price}
            </p>

            <div className="mt-5 grid gap-3">
              <a
                href="https://wa.me/923111444192"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-black text-white transition-colors duration-300 hover:bg-[#00AEEF]"
              >
                <FaWhatsapp />
                WhatsApp Inquiry
              </a>

              <a
                href="tel:03111444192"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 px-6 py-3 text-sm font-black text-slate-900 transition-colors duration-300 hover:bg-slate-950 hover:text-white"
              >
                <FaPhoneAlt />
                Call Now
              </a>

              <Link
                to="/contact"
                className="inline-flex items-center justify-center rounded-full bg-[#FF6B00] px-6 py-3 text-sm font-black text-white transition-colors duration-300 hover:bg-[#00AEEF]"
              >
                Send Inquiry
              </Link>
            </div>

            <div className="mt-6 rounded-2xl bg-slate-50 p-4">
              <p className="text-sm font-black text-slate-950">
                Want changes in this tour?
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Share your travel date, number of travelers, hotel preference,
                and budget. TravelEx can customize your tour plan.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  )
}

export default TourDetails