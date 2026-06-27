import { Link } from "react-router-dom"
import {
  FaArrowLeft,
  FaArrowRight,
  FaHome,
  FaSearch,
  FaWhatsapp,
} from "react-icons/fa"

import Footer from "../components/Footer"

const NotFoundPage = () => {
  return (
    <main className="bg-[#F8FAFC]">
      <section className="relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,174,239,0.24),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(255,107,0,0.22),transparent_32%)]" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/95 to-slate-900" />

        <div className="relative z-10 mx-auto max-w-[1180px] px-4 py-12 sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[18px] border border-white/10 bg-white/10 text-[#00AEEF] backdrop-blur sm:h-20 sm:w-20">
              <FaSearch className="text-2xl sm:text-3xl" />
            </div>

            <p className="mt-5 font-poppins text-[9px] font-bold uppercase tracking-[0.28em] text-[#00AEEF] sm:text-xs">
              Page Not Found
            </p>

            <h1 className="mt-2 font-fredoka text-[40px] font-semibold leading-none text-white sm:text-[72px]">
              404
            </h1>

            <h2 className="mt-3 font-fredoka text-[24px] font-semibold leading-tight text-white sm:text-[42px]">
              This travel route does not exist
            </h2>

            <p className="mx-auto mt-3 max-w-2xl font-poppins text-[11.5px] font-medium leading-5 text-white/75 sm:mt-4 sm:text-base sm:leading-7">
              The page you are looking for may have been moved, removed, or the
              link may be incorrect. You can return home or contact TravelEx for
              quick guidance.
            </p>

            <div className="mt-6 flex flex-col justify-center gap-2 sm:mt-8 sm:flex-row sm:gap-3">
              <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 rounded-[5px] bg-[#FF6B00] px-5 py-2.5 font-poppins text-xs font-semibold text-white transition hover:bg-[#00AEEF] sm:px-6 sm:py-3 sm:text-sm"
              >
                <FaHome className="text-[10px] sm:text-xs" />
                Back to Home
              </Link>

              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-[5px] border border-white/15 bg-white/10 px-5 py-2.5 font-poppins text-xs font-semibold text-white transition hover:border-[#00AEEF] hover:text-[#00AEEF] sm:px-6 sm:py-3 sm:text-sm"
              >
                Contact TravelEx
                <FaArrowRight className="text-[10px] sm:text-xs" />
              </Link>

              <a
                href="https://wa.me/923111444192"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-[5px] bg-[#25D366] px-5 py-2.5 font-poppins text-xs font-semibold text-white transition hover:bg-[#00AEEF] sm:px-6 sm:py-3 sm:text-sm"
              >
                <FaWhatsapp />
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#F8FAFC] px-4 py-8 sm:px-6 sm:py-14 lg:px-8">
        <div className="mx-auto max-w-[1180px]">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Umrah Packages", "/umrah"],
              ["International Tours", "/tours"],
              ["Visa Assistance", "/visa"],
              ["Hotel Support", "/hotels"],
            ].map(([label, link]) => (
              <Link
                key={label}
                to={link}
                className="group rounded-[12px] border border-slate-100 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.06)] transition hover:-translate-y-1 hover:shadow-[0_18px_44px_rgba(0,174,239,0.12)]"
              >
                <p className="font-poppins text-[9px] font-bold uppercase tracking-[0.18em] text-[#00AEEF]">
                  Explore
                </p>

                <div className="mt-2 flex items-center justify-between gap-3">
                  <h3 className="font-fredoka text-[20px] font-semibold text-slate-950">
                    {label}
                  </h3>

                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#00AEEF]/10 text-[#00AEEF] transition group-hover:bg-[#FF6B00] group-hover:text-white">
                    <FaArrowRight className="text-[10px]" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

export default NotFoundPage