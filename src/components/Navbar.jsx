import { useEffect, useState } from "react"
import { HiX } from "react-icons/hi"
import {
  FaArrowRight,
  FaCar,
  FaChevronDown,
  FaGlobeAsia,
  FaHotel,
  FaKaaba,
  FaPassport,
  FaSearch,
  FaWhatsapp,
} from "react-icons/fa"
import { Link, useLocation, useNavigate } from "react-router-dom"

import logo from "../assets/logo.webp"

const services = [
  {
    label: "Umrah Packages",
    link: "/umrah",
    icon: <FaKaaba />,
    desc: "Visa, hotel and travel support",
  },
  {
    label: "International Tours",
    link: "/tours",
    icon: <FaGlobeAsia />,
    desc: "Customized international trips",
  },
  {
    label: "Visa Assistance",
    link: "/visa",
    icon: <FaPassport />,
    desc: "Visa process and documents",
  },
  {
    label: "Hotel Booking",
    link: "/hotels",
    icon: <FaHotel />,
    desc: "Hotel options and stays",
  },
  {
    label: "Transport Services",
    link: "/car-rental",
    icon: <FaCar />,
    desc: "Cars, vans and transfers",
  },
]

const navLinks = [
  ["Home", "/"],
  ["Umrah", "/umrah"],
  ["Tours", "/tours"],
  ["Visa", "/visa"],
  ["Contact", "/contact"],
]

const resourceLinks = [
  ["Blogs", "/blogs"],
  ["FAQ", "/faq"],
]

const ProfessionalMenuIcon = () => {
  return (
    <span className="flex h-[14px] w-[18px] flex-col items-end justify-between">
      <span className="block h-[2px] w-[18px] rounded-full bg-slate-800" />
      <span className="block h-[2px] w-[13px] rounded-full bg-[#FF6B00]" />
      <span className="block h-[2px] w-[16px] rounded-full bg-slate-800" />
    </span>
  )
}

const Navbar = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const [menuOpen, setMenuOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const [resourcesOpen, setResourcesOpen] = useState(false)
  const [activeMobileDropdown, setActiveMobileDropdown] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    if (location.pathname === "/search") {
      const params = new URLSearchParams(location.search)
      const queryFromUrl = params.get("q") || ""
      setSearchQuery(queryFromUrl)
    }
  }, [location.pathname, location.search])

  useEffect(() => {
    setMenuOpen(false)
    setServicesOpen(false)
    setResourcesOpen(false)
    setActiveMobileDropdown(null)
  }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : ""

    return () => {
      document.body.style.overflow = ""
    }
  }, [menuOpen])

  const closeMenus = () => {
    setMenuOpen(false)
    setServicesOpen(false)
    setResourcesOpen(false)
    setActiveMobileDropdown(null)
  }

  const toggleMobileDropdown = (name) => {
    setActiveMobileDropdown((current) => (current === name ? null : name))
  }

  const handleMobileSearch = (event) => {
    event.preventDefault()

    const query = searchQuery.trim()
    if (!query) return

    navigate(`/search?q=${encodeURIComponent(query)}`)
    closeMenus()
  }

  const clearSearch = () => {
    setSearchQuery("")
  }

  const navLinkClass =
    "group relative py-1 transition-colors duration-300 hover:text-[#00AEEF]"

  const underline =
    "absolute -bottom-1 left-1/2 h-[2px] w-0 -translate-x-1/2 rounded-full bg-[#00AEEF] transition-all duration-300 group-hover:w-full"

  return (
    <header className="fixed left-0 top-0 z-[1100] w-full border-b border-slate-100 bg-white/95 shadow-[0_8px_26px_rgba(15,23,42,0.07)] backdrop-blur-xl">
      <div className="mx-auto flex h-[56px] max-w-[1340px] items-center justify-between px-3 sm:h-[72px] sm:px-6 lg:px-8">
        <Link
          to="/"
          onClick={closeMenus}
          className="flex h-full shrink-0 items-center justify-center"
        >
          <img
            src={logo}
            alt="TravelEx"
            className="block h-[42px] w-auto object-contain sm:h-[64px]"
          />
        </Link>

        {/* Mobile Search */}
        <form
          onSubmit={handleMobileSearch}
          className="mx-2 flex h-[32px] min-w-0 flex-1 items-center gap-2 rounded-full border border-slate-200 bg-[#F8FAFC] px-3 shadow-[0_4px_12px_rgba(15,23,42,0.05)] lg:hidden"
        >
          <button
            type="submit"
            className="shrink-0 text-[#FF6B00]"
            aria-label="Search"
          >
            <FaSearch className="text-[11px]" />
          </button>

          <input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search trips"
            className="min-w-0 flex-1 bg-transparent font-poppins text-[11px] font-semibold text-slate-700 outline-none placeholder:text-slate-400"
          />

          {searchQuery && (
            <button
              type="button"
              onClick={clearSearch}
              className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-600 transition active:scale-95"
              aria-label="Clear search"
            >
              <HiX className="text-[12px]" />
            </button>
          )}
        </form>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-7 font-poppins text-[14px] font-semibold text-slate-800 lg:flex">
          <Link to="/" onClick={closeMenus} className={navLinkClass}>
            Home
            <span className={underline} />
          </Link>

          <div
            className="relative"
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={() => setServicesOpen(false)}
          >
            <button
              type="button"
              onClick={() => setServicesOpen((prev) => !prev)}
              className="group relative flex items-center gap-1.5 py-1 transition-colors duration-300 hover:text-[#00AEEF]"
            >
              Services
              <FaChevronDown
                className={`text-[10px] transition-transform duration-300 ${
                  servicesOpen ? "rotate-180" : ""
                }`}
              />
              <span className={underline} />
            </button>

            <div
              className={`absolute left-1/2 top-full z-[1200] w-[680px] -translate-x-1/2 pt-5 transition-all duration-200 ${
                servicesOpen
                  ? "visible translate-y-0 opacity-100"
                  : "invisible translate-y-2 opacity-0"
              }`}
            >
              <div className="rounded-[5px] border border-slate-100 bg-white p-5 text-slate-900 shadow-[0_24px_70px_rgba(15,23,42,0.16)]">
                <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <p className="font-poppins text-[11px] font-bold uppercase tracking-[0.28em] text-[#00AEEF]">
                      TravelEx Services
                    </p>

                    <h3 className="mt-1 font-fredoka text-2xl font-semibold text-slate-950">
                      Plan every part of your journey
                    </h3>
                  </div>

                  <Link
                    to="/contact"
                    onClick={closeMenus}
                    className="inline-flex items-center gap-2 rounded-[5px] bg-[#FF6B00] px-4 py-2.5 font-poppins text-xs font-semibold text-white transition hover:bg-[#00AEEF]"
                  >
                    Talk to Expert
                    <FaArrowRight className="text-[10px]" />
                  </Link>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {services.map((item) => (
                    <Link
                      key={item.label}
                      to={item.link}
                      onClick={closeMenus}
                      className="group flex gap-4 rounded-[5px] border border-slate-100 bg-white p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#00AEEF]/30 hover:shadow-md"
                    >
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[5px] bg-sky-50 text-lg text-[#00AEEF] transition group-hover:bg-[#FF6B00] group-hover:text-white">
                        {item.icon}
                      </span>

                      <span>
                        <span className="block font-poppins text-sm font-bold text-slate-950">
                          {item.label}
                        </span>

                        <span className="mt-1 block font-poppins text-xs font-medium leading-5 text-slate-500">
                          {item.desc}
                        </span>
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {navLinks.slice(1).map(([label, link]) => (
            <Link
              key={label}
              to={link}
              onClick={closeMenus}
              className={navLinkClass}
            >
              {label}
              <span className={underline} />
            </Link>
          ))}

          <div
            className="relative"
            onMouseEnter={() => setResourcesOpen(true)}
            onMouseLeave={() => setResourcesOpen(false)}
          >
            <button
              type="button"
              onClick={() => setResourcesOpen((prev) => !prev)}
              className="group relative flex items-center gap-1.5 py-1 transition-colors duration-300 hover:text-[#00AEEF]"
            >
              Resources
              <FaChevronDown
                className={`text-[10px] transition-transform duration-300 ${
                  resourcesOpen ? "rotate-180" : ""
                }`}
              />
              <span className={underline} />
            </button>

            <div
              className={`absolute left-1/2 top-full z-[1200] w-52 -translate-x-1/2 pt-5 transition-all duration-200 ${
                resourcesOpen
                  ? "visible translate-y-0 opacity-100"
                  : "invisible translate-y-2 opacity-0"
              }`}
            >
              <div className="rounded-[5px] border border-slate-100 bg-white p-2 text-slate-900 shadow-[0_18px_45px_rgba(15,23,42,0.16)]">
                {resourceLinks.map(([label, link]) => (
                  <Link
                    key={label}
                    to={link}
                    onClick={closeMenus}
                    className="block rounded-[5px] px-4 py-3 font-poppins text-sm font-semibold transition hover:bg-sky-50 hover:text-[#00AEEF]"
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-2.5 lg:flex">
          <a
            href="https://wa.me/923111444192"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-[5px] border border-slate-200 px-3 py-2 font-poppins text-[13px] font-semibold text-slate-800 transition hover:border-[#00AEEF] hover:text-[#00AEEF]"
          >
            <FaWhatsapp className="text-[15px] text-[#25D366]" />
            WhatsApp
          </a>

          <Link
            to="/contact"
            onClick={closeMenus}
            className="rounded-[5px] bg-[#FF6B00] px-4 py-2 font-poppins text-[13px] font-semibold text-white shadow-[0_10px_26px_rgba(255,107,0,0.25)] transition hover:bg-[#00AEEF] hover:shadow-[0_10px_26px_rgba(0,174,239,0.25)]"
          >
            Plan My Trip
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          className="flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-[7px] border border-slate-200 bg-[#F8FAFC] text-slate-900 shadow-[0_4px_12px_rgba(15,23,42,0.05)] transition active:scale-95 lg:hidden"
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <HiX className="text-[18px]" />
          ) : (
            <ProfessionalMenuIcon />
          )}
        </button>
      </div>

      {/* Mobile Overlay */}
      <div
        onClick={closeMenus}
        className={`fixed inset-0 z-[1190] bg-slate-950/35 backdrop-blur-[2px] transition-opacity duration-300 lg:hidden ${
          menuOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      />

      {/* Mobile Right Drawer */}
      <aside
        className={`fixed right-0 top-0 z-[1200] h-dvh w-[84%] max-w-[330px] bg-white shadow-[0_25px_80px_rgba(15,23,42,0.28)] transition-transform duration-300 ease-out lg:hidden ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Drawer Header */}
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <div>
              <p className="font-poppins text-[8.5px] font-bold uppercase tracking-[0.22em] text-[#00AEEF]">
                TravelEx.pk
              </p>

              <p className="mt-0.5 font-poppins text-[10.5px] font-semibold text-slate-600">
                Simple travel support
              </p>
            </div>

            <button
              type="button"
              onClick={closeMenus}
              className="flex h-8 w-8 items-center justify-center rounded-[7px] border border-slate-200 bg-[#F8FAFC] text-slate-800"
              aria-label="Close menu"
            >
              <HiX className="text-[17px]" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto px-4 py-3 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <div className="grid gap-1.5">
              {navLinks.map(([label, link]) => {
                const active = location.pathname === link

                return (
                  <Link
                    key={label}
                    to={link}
                    onClick={closeMenus}
                    className={`flex items-center justify-between rounded-[8px] px-3.5 py-2.5 font-poppins text-[12px] font-semibold transition ${
                      active
                        ? "bg-[#00AEEF] text-white"
                        : "bg-[#F8FAFC] text-slate-800"
                    }`}
                  >
                    {label}
                    <FaArrowRight
                      className={`text-[9px] ${
                        active ? "text-white" : "text-slate-300"
                      }`}
                    />
                  </Link>
                )
              })}
            </div>

            {/* Services Dropdown */}
            <div className="mt-2.5 rounded-[10px] border border-slate-100 bg-white">
              <button
                type="button"
                onClick={() => toggleMobileDropdown("services")}
                className="flex w-full items-center justify-between px-3.5 py-2.5 font-poppins text-[12px] font-semibold text-slate-900"
              >
                Services
                <FaChevronDown
                  className={`text-[10px] text-slate-400 transition-transform duration-300 ${
                    activeMobileDropdown === "services" ? "rotate-180" : ""
                  }`}
                />
              </button>

              <div
                className={`grid overflow-hidden transition-all duration-300 ${
                  activeMobileDropdown === "services"
                    ? "grid-rows-[1fr]"
                    : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="grid gap-1.5 border-t border-slate-100 p-2">
                    {services.map((item) => (
                      <Link
                        key={item.label}
                        to={item.link}
                        onClick={closeMenus}
                        className="flex items-center gap-2.5 rounded-[7px] bg-[#F8FAFC] px-2.5 py-2"
                      >
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[5px] bg-white text-[12px] text-[#00AEEF] shadow-sm">
                          {item.icon}
                        </span>

                        <span className="min-w-0">
                          <span className="block font-poppins text-[11.5px] font-semibold leading-4 text-slate-900">
                            {item.label}
                          </span>

                          <span className="mt-0.5 block truncate font-poppins text-[9.5px] font-medium text-slate-500">
                            {item.desc}
                          </span>
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Resources Dropdown */}
            <div className="mt-2.5 rounded-[10px] border border-slate-100 bg-white">
              <button
                type="button"
                onClick={() => toggleMobileDropdown("resources")}
                className="flex w-full items-center justify-between px-3.5 py-2.5 font-poppins text-[12px] font-semibold text-slate-900"
              >
                Resources
                <FaChevronDown
                  className={`text-[10px] text-slate-400 transition-transform duration-300 ${
                    activeMobileDropdown === "resources" ? "rotate-180" : ""
                  }`}
                />
              </button>

              <div
                className={`grid overflow-hidden transition-all duration-300 ${
                  activeMobileDropdown === "resources"
                    ? "grid-rows-[1fr]"
                    : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="grid gap-1.5 border-t border-slate-100 p-2">
                    {resourceLinks.map(([label, link]) => (
                      <Link
                        key={label}
                        to={link}
                        onClick={closeMenus}
                        className="flex items-center justify-between rounded-[7px] bg-[#F8FAFC] px-2.5 py-2 font-poppins text-[11.5px] font-semibold text-slate-900"
                      >
                        {label}
                        <FaArrowRight className="text-[9px] text-slate-300" />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Drawer Footer */}
          <div className="border-t border-slate-100 p-3">
            <div className="grid grid-cols-2 gap-2">
              <a
                href="https://wa.me/923111444192"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-[5px] border border-slate-200 bg-white px-3 py-2.5 font-poppins text-[10.5px] font-semibold text-slate-900"
              >
                <FaWhatsapp className="text-[13px] text-[#25D366]" />
                WhatsApp
              </a>

              <Link
                to="/contact"
                onClick={closeMenus}
                className="inline-flex items-center justify-center gap-2 rounded-[5px] bg-[#FF6B00] px-3 py-2.5 font-poppins text-[10.5px] font-semibold text-white"
              >
                Plan Trip
                <FaArrowRight className="text-[8px]" />
              </Link>
            </div>
          </div>
        </div>
      </aside>
    </header>
  )
}

export default Navbar