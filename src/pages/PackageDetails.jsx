import { Link, useParams } from "react-router-dom"
import {
  FaArrowLeft,
  FaCheckCircle,
  FaHotel,
  FaPhoneAlt,
  FaPlaneDeparture,
  FaRegClock,
  FaWhatsapp,
} from "react-icons/fa"

const packages = [
  {
    id: "15-days-umrah-package",
    title: "15 Days Umrah Package",
    from: "Departure from Peshawar",
    price: "Starting from PKR 255,000",
    type: "Economy / Sharing",
    duration: "15 Days",
    image: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa",
    overview:
      "A budget-friendly Umrah package for travelers who want clear guidance, hotel support, visa assistance, and WhatsApp consultation before booking.",
    highlights: [
      "Hotel + visa guidance",
      "Transparent package details",
      "WhatsApp booking support",
      "Suitable for individual travelers and groups",
    ],
    inclusions: [
      "Umrah visa assistance",
      "Hotel stay guidance",
      "Flight support",
      "Transport guidance",
      "Consultant support",
    ],
    note:
      "Final package price may vary according to travel dates, airline, hotel category, room sharing, and availability.",
  },
  {
    id: "15-days-family-umrah",
    title: "15 Days Family Umrah",
    from: "Multiple hotel options",
    price: "Starting from PKR 263,500",
    type: "Family / Quad",
    duration: "15 Days",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c",
    overview:
      "A family-focused Umrah option for travelers who need hotel choices, room sharing guidance, and flexible planning based on family comfort.",
    highlights: [
      "Customized family planning",
      "Hotel + transport assistance",
      "Clear room sharing options",
      "WhatsApp consultation for families",
    ],
    inclusions: [
      "Family-friendly planning",
      "Hotel option guidance",
      "Visa assistance",
      "Room sharing support",
      "WhatsApp consultation",
    ],
    note:
      "Family package pricing depends on room type, travel dates, airline, and hotel distance from Haram.",
  },
  {
    id: "premium-umrah-package",
    title: "Premium Umrah Package",
    from: "Near Haram options",
    price: "Starting from PKR 296,000",
    type: "Premium / Double",
    duration: "Flexible",
    image: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff",
    overview:
      "A comfort-focused Umrah package for travelers who prefer better hotel options, priority guidance, and convenient planning.",
    highlights: [
      "Comfort-focused planning",
      "Expert consultant support",
      "Priority WhatsApp guidance",
      "Better hotel distance options",
    ],
    inclusions: [
      "Premium hotel options",
      "Near Haram stay guidance",
      "Visa assistance",
      "Flight support",
      "Priority consultant support",
    ],
    note:
      "Premium package price varies according to selected hotel category, travel month, and airline availability.",
  },
  {
    id: "custom-umrah-plan",
    title: "Custom Umrah Plan",
    from: "Based on your budget",
    price: "Custom quote available",
    type: "Customized",
    duration: "Flexible",
    image: "https://images.unsplash.com/photo-1564769625905-50e93615e769",
    overview:
      "A fully customized Umrah planning option where TravelEx helps visitors build a package according to budget, hotel preference, dates, and travelers.",
    highlights: [
      "Flexible hotel options",
      "Custom travel dates",
      "Consultant support",
      "Budget-based planning",
    ],
    inclusions: [
      "Custom travel dates",
      "Budget-based hotel options",
      "Visa guidance",
      "Family/group planning",
      "WhatsApp support",
    ],
    note:
      "Share your budget, preferred dates, departure city, and number of travelers to receive a suitable quote.",
  },
]

const PackageDetails = () => {
  const { id } = useParams()
  const pkg = packages.find((item) => item.id === id)

  if (!pkg) {
    return (
      <main className="bg-[#F8FAFC] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="rounded-[2rem] bg-white p-8 text-center shadow-md shadow-slate-200/70">
            <h1 className="text-3xl font-black text-slate-950">
              Package not found
            </h1>

            <p className="mt-3 text-sm leading-7 text-slate-600">
              The package you are looking for does not exist or may have been
              moved.
            </p>

            <Link
              to="/umrah"
              className="mt-6 inline-flex rounded-full bg-[#FF6B00] px-6 py-3 text-sm font-black text-white transition-colors duration-300 hover:bg-[#00AEEF]"
            >
              Back to Umrah Packages
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="bg-[#F8FAFC]">
      {/* Detail Hero */}
      <section className="relative overflow-hidden bg-slate-950 py-14 text-white sm:py-20">
        <img
          src={pkg.image}
          alt={pkg.title}
          className="absolute inset-0 h-full w-full object-cover opacity-35"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/40" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
          <Link
            to="/umrah"
            className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-slate-300 transition-colors duration-300 hover:text-[#00AEEF]"
          >
            <FaArrowLeft />
            Back to packages
          </Link>

          <p className="mb-3 inline-flex rounded-full bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-wider text-[#00AEEF]">
            {pkg.type}
          </p>

          <h1 className="max-w-3xl text-4xl font-black leading-tight sm:text-5xl md:text-6xl">
            {pkg.title}
          </h1>

          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 md:text-base">
            {pkg.overview}
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

      {/* Main Details */}
      <section className="py-12 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-[1fr_0.42fr]">
          <div className="grid gap-6">
            <div className="overflow-hidden rounded-[2rem] bg-white shadow-md shadow-slate-200/70">
              <img
                src={pkg.image}
                alt={pkg.title}
                className="h-72 w-full object-cover"
              />

              <div className="p-6 sm:p-8">
                <h2 className="text-2xl font-black text-slate-950">
                  Package Overview
                </h2>

                <p className="mt-3 text-sm leading-7 text-slate-600 md:text-base">
                  {pkg.overview}
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <FaRegClock className="text-xl text-[#00AEEF]" />
                    <p className="mt-3 text-xs font-black uppercase tracking-wider text-slate-400">
                      Duration
                    </p>
                    <p className="mt-1 text-sm font-black text-slate-950">
                      {pkg.duration}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4">
                    <FaPlaneDeparture className="text-xl text-[#00AEEF]" />
                    <p className="mt-3 text-xs font-black uppercase tracking-wider text-slate-400">
                      Departure
                    </p>
                    <p className="mt-1 text-sm font-black text-slate-950">
                      {pkg.from}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4">
                    <FaHotel className="text-xl text-[#00AEEF]" />
                    <p className="mt-3 text-xs font-black uppercase tracking-wider text-slate-400">
                      Plan Type
                    </p>
                    <p className="mt-1 text-sm font-black text-slate-950">
                      {pkg.type}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] bg-white p-6 shadow-md shadow-slate-200/70 sm:p-8">
              <h2 className="text-2xl font-black text-slate-950">
                Package Highlights
              </h2>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {pkg.highlights.map((item) => (
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
                {pkg.inclusions.map((item) => (
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
                {pkg.note}
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="h-fit rounded-[2rem] bg-white p-6 shadow-md shadow-slate-200/70 lg:sticky lg:top-28">
            <p className="text-xs font-black uppercase tracking-wider text-slate-400">
              Starting Price
            </p>

            <p className="mt-2 text-2xl font-black text-[#FF6B00]">
              {pkg.price}
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
                Need customization?
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Share your departure city, travel date, hotel preference, and
                number of passengers. TravelEx can customize your Umrah plan.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  )
}

export default PackageDetails