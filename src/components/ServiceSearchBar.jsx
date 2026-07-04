import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  FaCar,
  FaGlobeAsia,
  FaHotel,
  FaKaaba,
  FaPassport,
  FaSearch,
  FaTicketAlt,
} from "react-icons/fa"

import { umrahPackages } from "../data/umrahPackagesData"
import { tours } from "../data/tours"
import { hotels } from "../data/hotelsData"

const getIndexedPath = (
  items = [],
  index,
  pathTemplate,
  fallbackPath
) => {
  const selectedItem = items?.[index]

  return selectedItem?.id
    ? pathTemplate.replace(":id", selectedItem.id)
    : fallbackPath
}

const getFirstPath = (
  items = [],
  pathTemplate,
  fallbackPath
) => {
  return items?.[0]?.id
    ? pathTemplate.replace(":id", items[0].id)
    : fallbackPath
}

const services = [
  {
    name: "Umrah",
    icon: <FaKaaba />,
    // 4th Umrah package = index 3
    path: getIndexedPath(
      umrahPackages,
      3,
      "/package/:id",
      "/umrah"
    ),
    buttonLabel: "Book Umrah Package",
  },
  {
    name: "Visa Assistance",
    icon: <FaPassport />,
    path: "/visa-application",
    buttonLabel: "Apply for Visa Assistance",
  },
  {
    name: "International Tours",
    icon: <FaGlobeAsia />,
    // 4th Tour = index 3
    path: getIndexedPath(
      tours,
      3,
      "/tours/:id",
      "/tours"
    ),
    buttonLabel: "Book International Tour",
  },
  {
    name: "Tickets",
    icon: <FaTicketAlt />,
    path: "/tickets",
    buttonLabel: "Request Ticket Booking",
  },
  {
    name: "Hotel Booking",
    icon: <FaHotel />,
    // First hotel details page
    path: getFirstPath(
      hotels,
      "/hotels/:id",
      "/hotels"
    ),
    buttonLabel: "Request Hotel Booking",
  },
  {
    name: "Transport Services",
    icon: <FaCar />,
    path: "/car-rental",
    buttonLabel: "Book Transport Service",
  },
]

const ServiceSearchBar = ({ defaultService = "Umrah" }) => {
  const navigate = useNavigate()

  const [service, setService] = useState(defaultService)

  useEffect(() => {
    setService(defaultService)
  }, [defaultService])

  const activeService =
    services.find((item) => item.name === service) ||
    services[0]

  const handleServiceClick = (item) => {
    setService(item.name)
    navigate(item.path)
  }

  return (
    <div className="relative z-[80] mx-auto w-full max-w-[1080px] overflow-hidden rounded-[10px] border border-white/70 bg-white/95 shadow-[0_24px_60px_rgba(15,23,42,0.10)] backdrop-blur">
      {/* Service buttons */}
      <div className="flex flex-wrap gap-1 border-b border-slate-100 px-3 pt-1">
        {services.map((item) => {
          const isActive = service === item.name

          return (
            <button
              key={item.name}
              type="button"
              onClick={() => handleServiceClick(item)}
              className={`relative flex items-center gap-2 px-5 py-3.5 text-[13px] font-semibold transition-colors duration-200 ${
                isActive
                  ? "text-[#FF6B00]"
                  : "text-slate-500 hover:text-[#00AEEF]"
              }`}
            >
              <span className="text-[18px]">
                {item.icon}
              </span>

              {item.name}

              <span
                className={`absolute bottom-0 left-3 right-3 h-[2.5px] origin-center rounded-full bg-[#FF6B00] transition-transform duration-300 ${
                  isActive
                    ? "scale-x-100"
                    : "scale-x-0"
                }`}
              />
            </button>
          )
        })}
      </div>

      {/* Main CTA */}
      <div className="p-3.5">
        <Link
          to={activeService.path}
          className="inline-flex h-12 w-full items-center justify-center gap-2 whitespace-nowrap rounded-[5px] bg-[#FF6B00] px-7 text-[13px] font-semibold uppercase text-white shadow-[0_10px_26px_rgba(255,107,0,0.25)] transition-all duration-300 hover:bg-[#00AEEF] hover:shadow-[0_10px_26px_rgba(0,174,239,0.25)]"
        >
          <FaSearch />
          {activeService.buttonLabel}
        </Link>
      </div>
    </div>
  )
}

export default ServiceSearchBar