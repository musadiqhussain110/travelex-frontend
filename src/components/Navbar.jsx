import { useEffect, useState } from "react"
import { HiMenu, HiX } from "react-icons/hi"
import { FaChevronDown } from "react-icons/fa"
import { Link } from "react-router-dom"
import logo from "../assets/logo.webp"

const navLinks = [
  ["Home", "/"],
  ["Umrah", "/umrah"],
  ["Tours", "/tours"],
  ["Blogs", "/blogs"],
  ["FAQ", "/faq"],
  ["Contact Us", "/contact"],
]

const mainServiceLinks = [
  ["Umrah Packages", "/umrah"],
  ["Hotels", "/hotels"],
  ["Tours", "/tours"],
  ["Flights", "/flights"],
  ["Car Rental", "/car-rental"],
]

const stickerVisaLinks = [
  ["Spain", "/visa?country=Spain&type=Sticker%20Visa#visa-details"],
  ["Egypt", "/visa?country=Egypt&type=Sticker%20Visa#visa-details"],
  ["Turkey", "/visa?country=Turkey&type=Sticker%20Visa#visa-details"],
]

const eVisaLinks = [
  ["UAE / Dubai", "/visa?country=UAE&type=E-Visa#visa-details"],
  ["Sri Lanka", "/visa?country=Sri%20Lanka&type=E-Visa#visa-details"],
  ["Malaysia", "/visa?country=Malaysia&type=E-Visa#visa-details"],
]

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false)
  const [mobileVisaOpen, setMobileVisaOpen] = useState(false)
  const [desktopServicesOpen, setDesktopServicesOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const closeMenus = () => {
    setMenuOpen(false)
    setMobileServicesOpen(false)
    setMobileVisaOpen(false)
    setDesktopServicesOpen(false)
  }

  return (
    <header
      className={`fixed left-0 top-0 z-[1100] h-20 w-full transition-colors duration-300 ${
        isScrolled
          ? "bg-white shadow-lg"
          : "bg-[#07111f]/95 backdrop-blur-xl"
      }`}
    >
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link to="/" onClick={closeMenus} className="flex items-center">
          <img
  src={logo}
  alt="TravelEx"
  className="h-[72px] w-auto object-contain sm:h-24"
/>
        </Link>

        {/* Desktop nav */}
        <nav
          className={`hidden items-center gap-7 rounded-full px-8 py-3 transition-colors duration-300 md:flex ${
            isScrolled
              ? "bg-slate-100 text-slate-900"
              : "border border-white/15 bg-white/10 text-white backdrop-blur-xl"
          }`}
        >
          <Link
            to="/"
            onClick={closeMenus}
            className="transition-colors duration-300 hover:text-[#00AEEF]"
          >
            Home
          </Link>

          {/* Services Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setDesktopServicesOpen(true)}
            onMouseLeave={() => setDesktopServicesOpen(false)}
          >
            <button
              type="button"
              onClick={() => setDesktopServicesOpen(!desktopServicesOpen)}
              className="flex items-center gap-1 transition-colors duration-300 hover:text-[#00AEEF]"
              aria-label="Open services menu"
            >
              Services
              <FaChevronDown
                className={`text-[10px] transition-transform duration-300 ${
                  desktopServicesOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Main dropdown */}
            <div
              className={`absolute left-1/2 top-full z-[1200] w-64 -translate-x-1/2 pt-4 transition-all duration-200 ${
                desktopServicesOpen
                  ? "visible opacity-100"
                  : "invisible opacity-0"
              }`}
            >
              <div className="rounded-2xl border border-slate-100 bg-white p-2 text-slate-900 shadow-2xl">
                {mainServiceLinks.map(([label, link]) => (
                  <Link
                    key={label}
                    to={link}
                    onClick={closeMenus}
                    className="block rounded-xl px-4 py-3 transition-colors duration-300 hover:bg-sky-50 hover:text-[#00AEEF]"
                  >
                    {label}
                  </Link>
                ))}

                {/* Visa nested dropdown */}
                <div className="group/visa relative">
                  <Link
                    to="/visa"
                    onClick={closeMenus}
                    className="flex items-center justify-between rounded-xl px-4 py-3 transition-colors duration-300 hover:bg-sky-50 hover:text-[#00AEEF]"
                  >
                    Visa Assistance
                    <FaChevronDown className="-rotate-90 text-[10px]" />
                  </Link>

                  <div className="invisible absolute left-full top-0 z-[1300] w-[30rem] pl-3 opacity-0 transition-all duration-200 group-hover/visa:visible group-hover/visa:opacity-100">
                    <div className="grid grid-cols-2 gap-4 rounded-2xl border border-slate-100 bg-white p-5 text-slate-950 shadow-2xl">
                      {/* Sticker Visa */}
                      <div>
                        <Link
                          to="/visa?type=Sticker%20Visa"
                          onClick={closeMenus}
                          className="eyebrow mb-3 flex items-center justify-between rounded-xl bg-orange-50 px-4 py-3 text-[#FF6B00]"
                        >
                          Visa
                          <FaChevronDown className="text-[10px]" />
                        </Link>

                        <div className="grid gap-1">
                          {stickerVisaLinks.map(([label, link]) => (
                            <Link
                              key={label}
                              to={link}
                              onClick={closeMenus}
                              className="border-b border-slate-100 px-4 py-3 uppercase tracking-wide text-slate-800 transition hover:bg-orange-50 hover:text-[#FF6B00]"
                            >
                              {label}
                            </Link>
                          ))}
                        </div>
                      </div>

                      {/* E-Visa */}
                      <div>
                        <Link
                          to="/visa?type=E-Visa"
                          onClick={closeMenus}
                          className="eyebrow mb-3 flex items-center justify-between rounded-xl bg-sky-50 px-4 py-3 text-[#00AEEF]"
                        >
                          E-Visa
                          <FaChevronDown className="text-[10px]" />
                        </Link>

                        <div className="grid gap-1">
                          {eVisaLinks.map(([label, link]) => (
                            <Link
                              key={label}
                              to={link}
                              onClick={closeMenus}
                              className="border-b border-slate-100 px-4 py-3 uppercase tracking-wide text-slate-800 transition hover:bg-sky-50 hover:text-[#00AEEF]"
                            >
                              {label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {navLinks.slice(1).map(([label, link]) => (
            <Link
              key={label}
              to={link}
              onClick={closeMenus}
              className="transition-colors duration-300 hover:text-[#00AEEF]"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Desktop auth */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            to="/login"
            className={`rounded-full border px-5 py-2.5 transition-colors duration-300 ${
              isScrolled
                ? "border-slate-200 text-slate-900 hover:bg-slate-900 hover:text-white"
                : "border-white/25 text-white hover:bg-white hover:text-slate-900"
            }`}
          >
            Login
          </Link>

          <Link
            to="/signup"
            className={`rounded-full px-5 py-2.5 transition-colors duration-300 ${
              isScrolled
                ? "bg-[#00AEEF] text-white hover:bg-[#FF6B00]"
                : "bg-white text-slate-900 hover:bg-[#00AEEF] hover:text-white"
            }`}
          >
            Sign Up
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className={`flex h-11 w-11 items-center justify-center rounded-full border text-2xl transition-colors duration-300 md:hidden ${
            isScrolled
              ? "border-slate-200 bg-slate-100 text-slate-900"
              : "border-white/20 bg-white/10 text-white backdrop-blur-xl"
          }`}
          aria-label="Toggle menu"
        >
          {menuOpen ? <HiX /> : <HiMenu />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="absolute left-4 right-4 top-24 max-h-[calc(100vh-7rem)] overflow-y-auto rounded-3xl border border-slate-100 bg-white p-4 shadow-2xl backdrop-blur-xl md:hidden">
          <div className="grid gap-2">
            <Link
              to="/"
              onClick={closeMenus}
              className="rounded-2xl px-4 py-3 text-slate-900 hover:bg-sky-50 hover:text-[#00AEEF]"
            >
              Home
            </Link>

            {/* Mobile Services */}
            <button
              type="button"
              onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
              className="flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-slate-900 hover:bg-sky-50 hover:text-[#00AEEF]"
              aria-label="Open services menu"
            >
              Services
              <FaChevronDown
                className={`text-xs transition-transform duration-300 ${
                  mobileServicesOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {mobileServicesOpen && (
              <div className="grid gap-1 rounded-2xl bg-slate-50 p-2">
                {mainServiceLinks.map(([label, link]) => (
                  <Link
                    key={label}
                    to={link}
                    onClick={closeMenus}
                    className="rounded-xl px-4 py-3 text-slate-700 hover:bg-white hover:text-[#00AEEF]"
                  >
                    {label}
                  </Link>
                ))}

                <div className="overflow-hidden rounded-xl">
                  <div className="flex items-center hover:bg-white">
                    <Link
                      to="/visa"
                      onClick={closeMenus}
                      className="flex-1 px-4 py-3 text-[#00AEEF]"
                    >
                      Visa Assistance
                    </Link>

                    <button
                      type="button"
                      onClick={() => setMobileVisaOpen(!mobileVisaOpen)}
                      className="px-4 py-3 text-[#00AEEF]"
                      aria-label="Open visa menu"
                    >
                      <FaChevronDown
                        className={`text-xs transition-transform duration-300 ${
                          mobileVisaOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  </div>

                  {mobileVisaOpen && (
                    <div className="rounded-2xl bg-white p-3">
                      <p className="eyebrow mb-2 text-[#FF6B00]">
                        Visa Countries
                      </p>

                      <div className="grid grid-cols-2 gap-1">
                        {stickerVisaLinks.map(([label, link]) => (
                          <Link
                            key={label}
                            to={link}
                            onClick={closeMenus}
                            className="rounded-xl px-3 py-2 text-slate-700 hover:bg-orange-50 hover:text-[#FF6B00]"
                          >
                            {label}
                          </Link>
                        ))}
                      </div>

                      <p className="eyebrow mb-2 mt-4 text-[#00AEEF]">
                        E-Visa Countries
                      </p>

                      <div className="grid grid-cols-2 gap-1">
                        {eVisaLinks.map(([label, link]) => (
                          <Link
                            key={label}
                            to={link}
                            onClick={closeMenus}
                            className="rounded-xl px-3 py-2 text-slate-700 hover:bg-sky-50 hover:text-[#00AEEF]"
                          >
                            {label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {navLinks.slice(1).map(([label, link]) => (
              <Link
                key={label}
                to={link}
                onClick={closeMenus}
                className="rounded-2xl px-4 py-3 text-slate-900 hover:bg-sky-50 hover:text-[#00AEEF]"
              >
                {label}
              </Link>
            ))}
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <Link
              to="/login"
              onClick={closeMenus}
              className="rounded-2xl border border-slate-200 px-4 py-3 text-center text-slate-900"
            >
              Login
            </Link>

            <Link
              to="/signup"
              onClick={closeMenus}
              className="rounded-2xl bg-[#00AEEF] px-4 py-3 text-center text-white"
            >
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar