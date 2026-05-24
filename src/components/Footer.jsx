import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaPhoneAlt,
  FaWhatsapp,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPaperPlane,
} from "react-icons/fa"
import { Link } from "react-router-dom"
import logo from "../assets/logo.webp"

const quickLinks = [
  ["Home", "/"],
  ["Services", "/services"],
  ["Umrah Packages", "/umrah"],
  ["Customized Tours", "/tours"],
  ["Blogs", "/blogs"],
  ["FAQ", "/faq"],
  ["Contact", "/contact"],
]

const services = [
  ["Umrah Packages", "/umrah"],
  ["Tour Packages", "/tours"],
  ["Flight Booking", "/contact"],
  ["Hotel Booking", "/contact"],
  ["Visa Assistance", "/contact"],
  ["Car Rental", "/contact"],
]

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-white">
      {/* Newsletter Strip */}
      <div className="bg-[#F8FAFC] py-10 text-slate-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-6 rounded-[2rem] bg-white p-6 shadow-md shadow-slate-200/70 md:grid-cols-[1fr_1.1fr] md:items-center md:p-8">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-2xl text-[#00AEEF]">
                <FaPaperPlane />
              </div>

              <div>
                <h3 className="text-2xl font-black text-slate-950">
                  Get Updates & More
                </h3>

                <p className="mt-1 text-sm font-semibold text-slate-500">
                  Travel tips, package updates, and offers straight to your inbox.
                </p>
              </div>
            </div>

            <form className="flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                placeholder="Your Email"
                className="min-h-14 flex-1 rounded-2xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-900 outline-none transition focus:border-[#00AEEF]"
              />

              <button
                type="submit"
                className="min-h-14 rounded-2xl bg-slate-950 px-7 text-sm font-black uppercase text-white transition-colors duration-300 hover:bg-[#FF6B00]"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr_1.2fr]">
          {/* Brand */}
          <div>
            <Link to="/" className="inline-flex">
              <img
                src={logo}
                alt="TravelEx"
                className="h-20 w-auto object-contain"
              />
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-7 text-slate-300">
              TravelEx helps travelers explore Umrah packages, customized tours,
              visa assistance, hotel support, flights, and travel consultation
              with quick WhatsApp follow-up.
            </p>

            <div className="mt-6 flex gap-3">
              <a
                href="https://www.facebook.com/TravelExAirServices"
                target="_blank"
                rel="noreferrer"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors duration-300 hover:bg-[#00AEEF]"
                aria-label="Facebook"
              >
                <FaFacebookF />
              </a>

              <a
                href="https://www.instagram.com/travelexpk?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                target="_blank"
                rel="noreferrer"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors duration-300 hover:bg-[#00AEEF]"
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>

              <a
                href="#"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors duration-300 hover:bg-[#00AEEF]"
                aria-label="LinkedIn"
              >
                <FaLinkedinIn />
              </a>

              <a
                href="https://wa.me/923111444192"
                target="_blank"
                rel="noreferrer"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-[#25D366] text-white transition-transform duration-300 hover:scale-105"
                aria-label="WhatsApp"
              >
                <FaWhatsapp />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-black text-white">Quick Links</h3>

            <ul className="mt-5 grid gap-3">
              {quickLinks.map(([label, link]) => (
                <li key={label}>
                  <Link
                    to={link}
                    className="text-sm font-semibold text-slate-300 transition-colors duration-300 hover:text-[#00AEEF]"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-black text-white">Services</h3>

            <ul className="mt-5 grid gap-3">
              {services.map(([label, link]) => (
                <li key={label}>
                  <Link
                    to={link}
                    className="text-sm font-semibold text-slate-300 transition-colors duration-300 hover:text-[#00AEEF]"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-black text-white">Contact TravelEx</h3>

            <div className="mt-5 grid gap-4">
              <a
                href="tel:03111444192"
                className="flex items-start gap-3 text-sm font-semibold leading-6 text-slate-300 transition-colors duration-300 hover:text-white"
              >
                <FaPhoneAlt className="mt-1 shrink-0 text-[#00AEEF]" />
                <span>03 111 444 192</span>
              </a>

              <a
                href="https://wa.me/923111444192"
                target="_blank"
                rel="noreferrer"
                className="flex items-start gap-3 text-sm font-semibold leading-6 text-slate-300 transition-colors duration-300 hover:text-white"
              >
                <FaWhatsapp className="mt-1 shrink-0 text-[#25D366]" />
                <span>WhatsApp Inquiry</span>
              </a>

              <div className="flex items-start gap-3 text-sm font-semibold leading-6 text-slate-300">
                <FaEnvelope className="mt-1 shrink-0 text-[#FF6B00]" />
                <span>info@travelex.pk</span>
              </div>

              <div className="flex items-start gap-3 text-sm font-semibold leading-6 text-slate-300">
                <FaMapMarkerAlt className="mt-1 shrink-0 text-[#00AEEF]" />
                <span>
                  TravelEx Air Services, Shakeel Plaza, Opposite Islamia
                  College, University Road, Peshawar.
                </span>
              </div>
            </div>

            <div className="mt-6 rounded-[1.5rem] bg-white/10 p-4">
              <p className="text-xs font-black uppercase tracking-wider text-[#00AEEF]">
                Need quick help?
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-300">
                Share your travel plan and TravelEx will guide you through
                WhatsApp or phone support.
              </p>

              <Link
                to="/contact"
                className="mt-4 inline-flex rounded-full bg-[#FF6B00] px-5 py-3 text-sm font-black text-white transition-colors duration-300 hover:bg-[#00AEEF]"
              >
                Send Inquiry
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6">
          <div className="flex flex-col justify-between gap-4 text-sm font-semibold text-slate-400 md:flex-row md:items-center">
            <div>
              <p>Travelex©2026. All Rights reserved.</p>
              <p className="mt-1">
                Powered by{" "}
                <a
                  href="https://stackexpert.pk"
                  target="_blank"
                  rel="noreferrer"
                  className="font-black text-[#00AEEF] transition-colors duration-300 hover:text-[#FF6B00]"
                >
                  The Order Of Pen (Toop)
                </a>
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link to="/faq" className="hover:text-[#00AEEF]">
                FAQ
              </Link>
              <Link to="/contact" className="hover:text-[#00AEEF]">
                Contact
              </Link>
              <Link to="/blogs" className="hover:text-[#00AEEF]">
                Blogs
              </Link>
              <Link to="/services" className="hover:text-[#00AEEF]">
                Services
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer