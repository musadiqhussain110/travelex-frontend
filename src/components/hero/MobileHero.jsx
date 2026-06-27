import { Link } from "react-router-dom"
import {
  FaKaaba,
  FaPassport,
  FaGlobeAsia,
  FaHotel,
  FaCar,
  FaWhatsapp,
  FaArrowRight,
  FaCalendarAlt,
  FaMapMarkerAlt,
} from "react-icons/fa"
import umrahAsset from "../../assets/hero/umrah/finals.png"

const services = [
  { name: "Umrah", icon: <FaKaaba />, link: "/umrah" },
  { name: "Visa", icon: <FaPassport />, link: "/visa" },
  { name: "Tours", icon: <FaGlobeAsia />, link: "/tours" },
  { name: "Hotels", icon: <FaHotel />, link: "/hotels" },
  { name: "Cars", icon: <FaCar />, link: "/car-rental" },
  { name: "Support", icon: <FaWhatsapp />, link: "https://wa.me/923111444192" },
]

const MobileHero = () => {
  return (
    <section className="bg-[#F8FAFC] px-3 pb-5 pt-3 lg:hidden">
      {/* Promo Card */}
      <div className="relative overflow-hidden rounded-[18px] bg-[#EAF8FD] p-4 shadow-[0_12px_30px_rgba(15,23,42,0.10)]">
        <div className="relative z-10 max-w-[58%]">
          <p className="font-poppins text-[9px] font-bold uppercase tracking-[0.22em] text-[#00AEEF]">
            Umrah Experiences
          </p>

          <h1 className="mt-2 font-fredoka text-[22px] font-semibold leading-tight text-slate-950">
            Plan Your{" "}
            <span className="rounded-[5px] bg-[#FF6B00] px-2 py-1 text-white">
              Umrah
            </span>
          </h1>

          <p className="mt-2 font-poppins text-[11px] font-medium leading-5 text-slate-600">
            Trusted packages with visa, hotels and travel support.
          </p>

          <Link
            to="/umrah"
            className="mt-3 inline-flex items-center gap-2 rounded-[5px] bg-[#FF6B00] px-3.5 py-2 font-poppins text-[11px] font-semibold text-white"
          >
            Explore
            <FaArrowRight className="text-[9px]" />
          </Link>
        </div>

        <img
          src={umrahAsset}
          alt="Umrah"
          className="absolute bottom-[-28px] right-[-26px] w-[185px]"
        />
      </div>

      {/* Services Grid */}
      <div className="mt-4 grid grid-cols-3 gap-2.5">
        {services.map((item) => {
          const external = item.link.startsWith("http")

          const card = (
            <div className="flex h-[76px] flex-col items-center justify-center rounded-[14px] bg-white shadow-[0_8px_22px_rgba(15,23,42,0.08)] active:scale-[0.98]">
              <span className="text-[18px] text-[#FF6B00]">{item.icon}</span>
              <span className="mt-2 font-poppins text-[10.5px] font-semibold text-slate-800">
                {item.name}
              </span>
            </div>
          )

          return external ? (
            <a key={item.name} href={item.link} target="_blank" rel="noreferrer">
              {card}
            </a>
          ) : (
            <Link key={item.name} to={item.link}>
              {card}
            </Link>
          )
        })}
      </div>

      {/* Planner Card */}
      <div className="mt-4 rounded-[18px] bg-white p-4 shadow-[0_10px_28px_rgba(15,23,42,0.08)]">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="font-fredoka text-[19px] font-semibold text-slate-950">
              Start planning
            </p>
            <p className="font-poppins text-[11px] font-medium text-slate-500">
              Get suitable package options
            </p>
          </div>
          <span className="rounded-full bg-orange-50 px-3 py-1 font-poppins text-[10px] font-bold text-[#FF6B00]">
            Quick
          </span>
        </div>

        <div className="grid gap-2.5">
          <div className="flex items-center gap-3 rounded-[5px] border border-slate-200 px-3 py-2.5">
            <FaMapMarkerAlt className="text-[#00AEEF]" />
            <div>
              <p className="font-poppins text-[9px] font-bold uppercase tracking-wide text-slate-400">
                Departure City
              </p>
              <p className="font-poppins text-xs font-semibold text-slate-800">
                Select your city
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-[5px] border border-slate-200 px-3 py-2.5">
            <FaCalendarAlt className="text-[#00AEEF]" />
            <div>
              <p className="font-poppins text-[9px] font-bold uppercase tracking-wide text-slate-400">
                Travel Month
              </p>
              <p className="font-poppins text-xs font-semibold text-slate-800">
                Choose a month
              </p>
            </div>
          </div>

          <Link
            to="/umrah"
            className="rounded-[5px] bg-[#00AEEF] py-3 text-center font-poppins text-xs font-semibold text-white"
          >
            Get Package Options
          </Link>
        </div>
      </div>
    </section>
  )
}

export default MobileHero