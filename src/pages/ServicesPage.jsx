import {
  FaPlaneDeparture,
  FaHotel,
  FaPassport,
  FaCar,
  FaKaaba,
  FaRoute,
  FaShieldAlt,
  FaWhatsapp,
  FaPhoneAlt,
  FaCheckCircle,
} from "react-icons/fa"
import { Link } from "react-router-dom"

const services = [
  {
    title: "Umrah Packages",
    text: "Explore economy, family, premium, and customized Umrah packages with hotel, visa, and travel guidance.",
    icon: <FaKaaba />,
    link: "/umrah",
    color: "text-[#00AEEF]",
  },
  {
    title: "Customized Tours",
    text: "Plan local and international tours according to your budget, comfort, dates, hotel preference, and group size.",
    icon: <FaRoute />,
    link: "/tours",
    color: "text-[#FF6B00]",
  },
  {
    title: "Flight Booking",
    text: "Get flight booking support for domestic and international travel with consultant guidance.",
    icon: <FaPlaneDeparture />,
    link: "/contact",
    color: "text-[#00AEEF]",
  },
  {
    title: "Hotel Booking",
    text: "Find suitable hotel options based on location, comfort, room type, budget, and travel purpose.",
    icon: <FaHotel />,
    link: "/contact",
    color: "text-[#FF6B00]",
  },
  {
    title: "Visa Assistance",
    text: "Get guidance for visa requirements, documents, application process, and travel preparation.",
    icon: <FaPassport />,
    link: "/contact",
    color: "text-[#00AEEF]",
  },
  {
    title: "Car Rental",
    text: "Arrange car rental support for airport pickup, city travel, family trips, and customized travel needs.",
    icon: <FaCar />,
    link: "/contact",
    color: "text-[#FF6B00]",
  },
  {
    title: "Travel Insurance",
    text: "Ask TravelEx about travel insurance options for added safety and peace of mind during your journey.",
    icon: <FaShieldAlt />,
    link: "/contact",
    color: "text-[#00AEEF]",
  },
]

const ServicesPage = () => {
  return (
    <main className="bg-[#F8FAFC]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-950 py-16 text-white sm:py-20">
        <img
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
          alt="TravelEx Services"
          className="absolute inset-0 h-full w-full object-cover opacity-30"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/50" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.25em] text-[#00AEEF] sm:text-sm">
            Our Services
          </p>

          <h1 className="max-w-3xl text-4xl font-black leading-tight sm:text-5xl md:text-6xl">
            Complete travel support in one place
          </h1>

          <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-300 md:text-base">
            TravelEx provides Umrah packages, customized tours, visa assistance,
            hotel booking, flight support, car rental, and travel consultation
            for individuals, families, and groups.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <a
              href="https://wa.me/923111444192"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-black text-white transition-colors duration-300 hover:bg-[#00AEEF]"
            >
              <FaWhatsapp />
              Ask on WhatsApp
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

      {/* Services Grid */}
      <section className="py-12 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-8 text-center sm:mb-12">
            <p className="mb-3 text-xs font-black uppercase tracking-[0.25em] text-[#00AEEF] sm:text-sm">
              What We Provide
            </p>

            <h2 className="text-3xl font-black leading-tight text-slate-950 sm:text-4xl md:text-5xl">
              TravelEx service categories
            </h2>

            <p className="mx-auto mt-4 max-w-3xl text-sm leading-7 text-slate-600 md:text-base">
              Choose the service you need and continue through package pages,
              inquiry form, phone support, or WhatsApp consultation.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <article
                key={service.title}
                className="group rounded-[1.5rem] bg-white p-6 shadow-md shadow-slate-200/70 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
              >
                <div
                  className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-2xl ${service.color} transition-colors duration-300 group-hover:bg-[#00AEEF] group-hover:text-white`}
                >
                  {service.icon}
                </div>

                <h3 className="text-xl font-black text-slate-950">
                  {service.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {service.text}
                </p>

                <Link
                  to={service.link}
                  className="mt-5 inline-flex rounded-full border border-slate-200 px-5 py-3 text-sm font-black text-slate-900 transition-colors duration-300 hover:border-[#00AEEF] hover:text-[#00AEEF]"
                >
                  Explore Service
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Why Services CTA */}
      <section className="pb-12 sm:pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="rounded-[2rem] bg-white p-6 shadow-md shadow-slate-200/70 sm:p-8">
            <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <h3 className="text-2xl font-black text-slate-950">
                  Not sure which service you need?
                </h3>

                <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
                  Share your destination, travel date, number of travelers,
                  budget, and requirements. TravelEx can guide you toward the
                  right service or package.
                </p>

                <div className="mt-4 grid gap-2 sm:grid-cols-3">
                  {[
                    "24/7 support",
                    "WhatsApp consultation",
                    "Customized planning",
                  ].map((item) => (
                    <p
                      key={item}
                      className="flex items-center gap-2 text-sm font-bold text-slate-700"
                    >
                      <FaCheckCircle className="text-[#00AEEF]" />
                      {item}
                    </p>
                  ))}
                </div>
              </div>

              <Link
                to="/contact"
                className="inline-flex items-center justify-center rounded-full bg-[#FF6B00] px-6 py-3 text-sm font-black text-white transition-colors duration-300 hover:bg-[#00AEEF]"
              >
                Send Inquiry
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default ServicesPage