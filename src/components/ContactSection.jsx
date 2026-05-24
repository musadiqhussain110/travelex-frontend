import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaWhatsapp,
  FaEnvelope,
} from "react-icons/fa"
import { Link } from "react-router-dom"

const ContactSection = () => {
  return (
    <section id="contact" className="bg-white py-12 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          {/* Left Form */}
          <div>
            <p className="mb-3 text-xs font-black uppercase tracking-[0.25em] text-[#00AEEF] sm:text-sm">
              Contact Us
            </p>

            <h2 className="text-3xl font-black leading-tight text-slate-950 sm:text-4xl md:text-5xl">
              We'd love to hear from you
            </h2>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
              Send us a message and TravelEx will guide you with suitable travel
              options, package details, and WhatsApp support.
            </p>

            <form className="mt-8 grid gap-4">
              <input
                type="text"
                placeholder="Full Name"
                className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-semibold text-slate-900 outline-none transition focus:border-[#00AEEF]"
              />

              <input
                type="email"
                placeholder="Email Address"
                className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-semibold text-slate-900 outline-none transition focus:border-[#00AEEF]"
              />

              <input
                type="tel"
                placeholder="Phone / WhatsApp Number"
                className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-semibold text-slate-900 outline-none transition focus:border-[#00AEEF]"
              />

              <select className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-semibold text-slate-500 outline-none transition focus:border-[#00AEEF]">
                <option>Interested in</option>
                <option>Umrah Package</option>
                <option>Customized Tour</option>
                <option>Visa Assistance</option>
                <option>Hotel Booking</option>
                <option>Flight Booking</option>
                <option>Car Rental</option>
              </select>

              <textarea
                rows="6"
                placeholder="Message / Travel Requirements"
                className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-semibold text-slate-900 outline-none transition focus:border-[#00AEEF]"
              />

              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="submit"
                  className="rounded-full bg-[#FF6B00] px-6 py-4 text-sm font-black uppercase text-white transition-colors duration-300 hover:bg-[#00AEEF]"
                >
                  Send Message
                </button>

                <a
                  href="https://wa.me/923111444192"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-4 text-sm font-black text-white transition-colors duration-300 hover:bg-[#00AEEF]"
                >
                  <FaWhatsapp />
                  WhatsApp Us
                </a>
              </div>

              <Link
                to="/contact"
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-4 text-sm font-black text-slate-900 transition-colors duration-300 hover:border-[#00AEEF] hover:text-[#00AEEF]"
              >
                View Full Contact Page
              </Link>
            </form>
          </div>

          {/* Right Contact Card */}
          <div className="relative">
            <div className="overflow-hidden rounded-[2rem] shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c"
                alt="TravelEx contact"
                className="h-[420px] w-full object-cover"
              />
            </div>

            <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 rounded-[1.5rem] bg-[#FF6B00] p-6 text-white shadow-2xl sm:left-10 sm:right-auto sm:w-[360px] sm:p-8">
              <h3 className="text-2xl font-black">TravelEx Air Service</h3>

              <div className="mt-8 grid gap-4 text-sm leading-7">
                <a
                  href="tel:03111444192"
                  className="flex items-start gap-3 font-semibold text-white"
                >
                  <FaPhoneAlt className="mt-1 shrink-0" />
                  <span>+92 3 111 444 192</span>
                </a>

                <div className="flex items-start gap-3 font-semibold text-white">
                  <FaEnvelope className="mt-1 shrink-0" />
                  <span>info@travelex.pk</span>
                </div>

                <div className="flex items-start gap-3 font-semibold text-white">
                  <FaMapMarkerAlt className="mt-1 shrink-0" />
                  <span>
                    TravelEx Air Services, Shakeel Plaza, Opposite Islamia
                    College, University Road, Peshawar.
                  </span>
                </div>
              </div>

              <a
                href="https://wa.me/923111444192"
                target="_blank"
                rel="noreferrer"
                className="mt-7 inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-black text-slate-950 transition-colors duration-300 hover:bg-[#00AEEF] hover:text-white"
              >
                <FaWhatsapp />
                Continue on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ContactSection