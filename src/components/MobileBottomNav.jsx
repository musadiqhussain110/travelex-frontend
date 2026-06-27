import { NavLink } from "react-router-dom"
import { FaHome, FaKaaba, FaGlobeAsia, FaHeadset } from "react-icons/fa"

const navLinkClass = ({ isActive }) =>
  `flex h-[52px] flex-col items-center justify-center gap-1 rounded-[9px] font-poppins text-[9px] font-bold transition active:scale-95 ${
    isActive
      ? "border border-[#FF6B00]/20 bg-[#FF6B00]/10 text-[#FF6B00]"
      : "text-slate-500"
  }`

const iconClass = "text-[20px] leading-none"

const MobileBottomNav = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-[1200] border-t border-slate-200 bg-white/95 px-3 pb-2 pt-1.5 shadow-[0_-10px_30px_rgba(15,23,42,0.10)] backdrop-blur-xl lg:hidden">
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
          className="flex h-[52px] flex-col items-center justify-center gap-1 rounded-[9px] font-poppins text-[9px] font-bold text-slate-500 transition active:scale-95"
        >
          <FaHeadset className={iconClass} />
          <span>Support</span>
        </a>
      </div>
    </div>
  )
}

export default MobileBottomNav