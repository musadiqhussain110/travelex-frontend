import {
  FaArrowRight,
  FaEnvelope,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaMapMarkerAlt,
  FaPaperPlane,
  FaPhoneAlt,
  FaWhatsapp,
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
  ["International Tours", "/tours"],
  ["Visa Assistance", "/visa"],
  ["Hotel Support", "/hotels"],
  ["Travel Consultation", "/contact"],
]

const socialLinks = [
  [
    "https://www.facebook.com/TravelExAirServices",
    FaFacebookF,
    "Facebook",
  ],
  [
    "https://www.instagram.com/travelexpk?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
    FaInstagram,
    "Instagram",
  ],
  ["#", FaLinkedinIn, "LinkedIn"],
]

const bottomLinks = [
  ["FAQ", "/faq"],
  ["Contact", "/contact"],
  ["Blogs", "/blogs"],
  ["Services", "/services"],
]

const Footer = () => {
  const handleSubscribe = (event) => {
    event.preventDefault()
  }

  return (
    <footer className="bg-[#F8FAFC] text-slate-700">
      {/* Newsletter */}
      <div className="px-4 py-5 sm:px-6 sm:py-8 lg:px-8">
        <div className="mx-auto max-w-[1180px]">
          <div className="grid gap-4 rounded-[12px] border border-slate-100 bg-white p-4 shadow-[0_14px_36px_rgba(15,23,42,0.06)] sm:p-5 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[5px] bg-[#00AEEF]/10 text-base text-[#00AEEF] sm:h-12 sm:w-12 sm:text-lg">
                <FaPaperPlane />
              </div>

              <div>
                <h3 className="font-fredoka text-[19px] font-semibold leading-tight text-slate-950 sm:text-[22px]">
                  Get Travel Updates
                </h3>

                <p className="mt-1 font-poppins text-[11px] font-medium leading-5 text-slate-500 sm:text-sm">
                  Umrah, visa, hotel and tour updates.
                </p>
              </div>
            </div>

            <form
              onSubmit={handleSubscribe}
              className="grid gap-2 sm:grid-cols-[1fr_auto]"
            >
              <input
                type="email"
                placeholder="Enter your email"
                className="h-11 w-full rounded-[5px] border border-slate-200 bg-white px-3 font-poppins text-xs font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#00AEEF] sm:h-12 sm:px-4 sm:text-sm"
              />

              <button
                type="submit"
                className="h-11 rounded-[5px] bg-[#FF6B00] px-5 font-poppins text-xs font-bold uppercase tracking-[0.04em] text-white transition hover:bg-[#00AEEF] sm:h-12 sm:px-7"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Footer Main */}
      <div className="border-t border-slate-100 bg-white">
        <div className="mx-auto max-w-[1180px] px-4 py-8 pb-24 sm:px-6 sm:py-10 sm:pb-10 lg:px-8">
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-[1.15fr_0.72fr_0.78fr_1.2fr] lg:gap-8">
            {/* Brand */}
            <div>
              <Link to="/" className="inline-flex">
                <img
                  src={logo}
                  alt="TravelEx"
                  className="h-12 w-auto object-contain sm:h-14"
                />
              </Link>

              <p className="mt-3 max-w-sm font-poppins text-[12.5px] font-medium leading-6 text-slate-600 sm:text-sm">
                TravelEx specializes in Umrah packages, visa assistance, hotel
                support and customized international tours.
              </p>

              <div className="mt-4 flex gap-2">
                {socialLinks.map(([href, Icon, label]) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-[5px] border border-slate-200 bg-[#F8FAFC] text-xs text-slate-700 transition hover:border-[#00AEEF]/40 hover:bg-[#00AEEF] hover:text-white sm:h-10 sm:w-10 sm:text-sm"
                    aria-label={label}
                  >
                    <Icon />
                  </a>
                ))}

                <a
                  href="https://wa.me/923111444192"
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-[5px] bg-[#25D366] text-xs text-white transition hover:bg-[#00AEEF] sm:h-10 sm:w-10 sm:text-sm"
                  aria-label="WhatsApp"
                >
                  <FaWhatsapp />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-fredoka text-[18px] font-semibold text-slate-950">
                Quick Links
              </h3>

              <ul className="mt-3 grid gap-2 sm:mt-4">
                {quickLinks.map(([label, link]) => (
                  <li key={label}>
                    <Link
                      to={link}
                      className="font-poppins text-[12.5px] font-semibold text-slate-600 transition hover:text-[#00AEEF] sm:text-sm"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h3 className="font-fredoka text-[18px] font-semibold text-slate-950">
                Services
              </h3>

              <ul className="mt-3 grid gap-2 sm:mt-4">
                {services.map(([label, link]) => (
                  <li key={label}>
                    <Link
                      to={link}
                      className="font-poppins text-[12.5px] font-semibold text-slate-600 transition hover:text-[#00AEEF] sm:text-sm"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-fredoka text-[18px] font-semibold text-slate-950">
                Contact TravelEx
              </h3>

              <div className="mt-3 grid gap-2.5 sm:mt-4">
                <a
                  href="tel:03111444192"
                  className="flex items-start gap-3 font-poppins text-[12.5px] font-semibold leading-5 text-slate-600 transition hover:text-slate-950 sm:text-sm sm:leading-6"
                >
                  <FaPhoneAlt className="mt-1 shrink-0 text-[#00AEEF]" />
                  <span>03 111 444 192</span>
                </a>

                <a
                  href="https://wa.me/923111444192"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-start gap-3 font-poppins text-[12.5px] font-semibold leading-5 text-slate-600 transition hover:text-slate-950 sm:text-sm sm:leading-6"
                >
                  <FaWhatsapp className="mt-1 shrink-0 text-[#25D366]" />
                  <span>WhatsApp Inquiry</span>
                </a>

                <a
                  href="mailto:info@travelex.pk"
                  className="flex items-start gap-3 font-poppins text-[12.5px] font-semibold leading-5 text-slate-600 transition hover:text-slate-950 sm:text-sm sm:leading-6"
                >
                  <FaEnvelope className="mt-1 shrink-0 text-[#FF6B00]" />
                  <span>info@travelex.pk</span>
                </a>

                <div className="flex items-start gap-3 font-poppins text-[12.5px] font-semibold leading-5 text-slate-600 sm:text-sm sm:leading-6">
                  <FaMapMarkerAlt className="mt-1 shrink-0 text-[#00AEEF]" />
                  <span>
                    TravelEx Air Services, Shakeel Plaza, Opposite Islamia
                    College, University Road, Peshawar.
                  </span>
                </div>
              </div>

              <div className="mt-4 rounded-[8px] border border-slate-100 bg-[#F8FAFC] p-3.5 sm:p-4">
                <p className="font-poppins text-[9px] font-bold uppercase tracking-[0.16em] text-[#00AEEF] sm:text-[10px]">
                  Need quick help?
                </p>

                <p className="mt-1.5 font-poppins text-[11px] font-medium leading-5 text-slate-600 sm:text-xs sm:leading-6">
                  Share your travel plan and get quick guidance.
                </p>

                <Link
                  to="/contact"
                  className="mt-3 inline-flex items-center gap-2 rounded-[5px] bg-[#FF6B00] px-3.5 py-2 font-poppins text-xs font-semibold text-white transition hover:bg-[#00AEEF]"
                >
                  Send Inquiry
                  <FaArrowRight className="text-[10px]" />
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom */}
          <div className="mt-7 border-t border-slate-100 pt-4 sm:mt-8 sm:pt-5">
            <div className="flex flex-col justify-between gap-3 font-poppins text-[12px] font-semibold text-slate-500 sm:text-sm md:flex-row md:items-center">
              <div>
                <p>TravelEx © 2026. All Rights Reserved.</p>

                <p className="mt-1">
                  Powered by{" "}
                  <a
                    href="#"
                    className="font-bold text-[#00AEEF] transition hover:text-[#FF6B00]"
                  >
                    The Order Of Pen (TOOP)
                  </a>
                </p>
              </div>

              <div className="flex flex-wrap gap-x-4 gap-y-2">
                {bottomLinks.map(([label, link]) => (
                  <Link
                    key={label}
                    to={link}
                    className="transition hover:text-[#00AEEF]"
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer