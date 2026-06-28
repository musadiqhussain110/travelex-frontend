import { NavLink } from "react-router-dom"
import { FaGlobeAsia, FaHeadset, FaHome, FaKaaba } from "react-icons/fa"

const navLinkClass = ({ isActive }) =>
  `flex h-[44px] flex-col items-center justify-center gap-0.5 rounded-[8px] font-poppins text-[8.5px] font-bold leading-none transition active:scale-95 ${
    isActive
      ? "border border-[#FF6B00]/20 bg-[#FF6B00]/10 text-[#FF6B00]"
      : "text-slate-500"
  }`

const iconClass = "text-[17px] leading-none"

const MobileBottomNav = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-[1200] border-t border-slate-200 bg-white/95 px-3 pb-1.5 pt-1 shadow-[0_-8px_24px_rgba(15,23,42,0.08)] backdrop-blur-xl lg:hidden">
      <div className="mx-auto grid max-w-md grid-cols-4 gap-1">
        <NavLink to="/" className={navLinkClass}>
          <FaHome className={iconClass} />
          <span>Home</span>
        </NavLink>

        <NavLink to="/umrah" className={navLinkClass}>
          <FaKaaba className={iconClass} />
          <span>Umrah</span>
        </NavLink>

        <NavLink to="/tours" className={navLinkClass}>
          <FaGlobeAsia className={iconClass} />
          <span>Tours</span>
        </NavLink>

        <a
          href="https://wa.me/923111444192"
          target="_blank"
          rel="noreferrer"
          className="flex h-[44px] flex-col items-center justify-center gap-0.5 rounded-[8px] font-poppins text-[8.5px] font-bold leading-none text-slate-500 transition active:scale-95"
        >
          <FaHeadset className={iconClass} />
          <span>Support</span>
        </a>
      </div>
    </div>
  )
}

export default MobileBottomNav