import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import {
  FaCalendarAlt,
  FaEnvelope,
  FaEye,
  FaPhoneAlt,
  FaSearch,
  FaWhatsapp,
} from "react-icons/fa"
import { adminApi } from "../../services/api"

const statuses = [
  "All",
  "New",
  "Contacted",
  "Interested",
  "Awaiting Documents",
  "Quoted",
  "Payment Pending",
  "Confirmed",
  "Booked",
  "Lost",
  "Cancelled",
]

const serviceConfig = {
  all: {
    title: "All Leads",
    description: "All customer inquiries from TravelEx website.",
  },
  umrah: {
    title: "Umrah Leads",
    description: "Manage Umrah package inquiries and booking requests.",
  },
  tour: {
    title: "Tour Leads",
    description: "Manage tour package inquiries and travel requests.",
  },
  visa: {
    title: "Visa Leads",
    description: "Manage visa application inquiries and applicant details.",
  },
  ticket: {
    title: "Air Ticket Leads",
    description: "Manage domestic and international ticket inquiries.",
  },
  hotel: {
    title: "Hotel Leads",
    description: "Manage hotel booking inquiries.",
  },
  carRental: {
    title: "Car Rental Leads",
    description: "Manage car rental, chauffeur and airport transfer inquiries.",
  },
}

const formatService = (serviceType = "") => {
  const labels = {
    umrah: "Umrah",
    tour: "Tour",
    visa: "Visa",
    hotel: "Hotel",
    carRental: "Car Rental",
    ticket: "Air Ticket",
    contact: "Contact",
    general: "General",
  }

  return labels[serviceType] || serviceType || "-"
}

const formatDate = (date) => {
  if (!date) return "-"
  return new Date(date).toLocaleString()
}

const formatShortDate = (date) => {
  if (!date) return "-"
  return new Date(date).toLocaleDateString()
}

const getWhatsappUrl = (phone = "") => {
  const cleanPhone = String(phone).replace(/[^\d]/g, "")
  return `https://wa.me/${cleanPhone}`
}

const getServiceBadgeClass = (serviceType = "") => {
  const classes = {
    umrah: "bg-orange-50 text-[#FF6B00]",
    tour: "bg-sky-50 text-[#00AEEF]",
    visa: "bg-purple-50 text-purple-700",
    ticket: "bg-emerald-50 text-emerald-700",
    hotel: "bg-amber-50 text-amber-700",
    carRental: "bg-slate-100 text-slate-700",
    general: "bg-slate-100 text-slate-700",
    contact: "bg-blue-50 text-blue-700",
  }

  return classes[serviceType] || "bg-slate-100 text-slate-700"
}

const getStatusBadgeClass = (status = "") => {
  const classes = {
    New: "bg-orange-50 text-[#FF6B00]",
    Contacted: "bg-sky-50 text-[#00AEEF]",
    Interested: "bg-emerald-50 text-emerald-700",
    "Awaiting Documents": "bg-amber-50 text-amber-700",
    Quoted: "bg-indigo-50 text-indigo-700",
    "Payment Pending": "bg-yellow-50 text-yellow-700",
    Confirmed: "bg-green-50 text-green-700",
    Booked: "bg-green-50 text-green-700",
    Lost: "bg-red-50 text-red-700",
    Cancelled: "bg-red-50 text-red-700",
  }

  return classes[status] || "bg-slate-100 text-slate-700"
}

const getLeadSubtitle = (lead) => {
  if (!lead) return ""

  if (lead.serviceType === "umrah") {
    return [
      lead.city,
      lead.preferredDepartureCity || lead.departureCity,
      lead.preferredDepartureDate || formatShortDate(lead.travelDate),
      lead.packageRequired,
    ]
      .filter(Boolean)
      .join(" • ")
  }

  if (lead.serviceType === "tour") {
    return [
      lead.city,
      lead.destination,
      lead.travelDateText || formatShortDate(lead.travelDate),
      lead.interestedIn,
    ]
      .filter(Boolean)
      .join(" • ")
  }

  if (lead.serviceType === "ticket") {
    const route = [lead.departureCity, lead.destinationCity]
      .filter(Boolean)
      .join(" to ")

    return [
      route,
      lead.departureDate || formatShortDate(lead.travelDate),
      lead.returnDate ? `Return: ${formatShortDate(lead.returnDate)}` : "",
      lead.travelClass,
    ]
      .filter(Boolean)
      .join(" • ")
  }

  if (lead.serviceType === "visa") {
    return [
      lead.city,
      lead.nationality,
      lead.destinationCountry || lead.destination,
      lead.visaType,
    ]
      .filter(Boolean)
      .join(" • ")
  }

  if (lead.serviceType === "hotel") {
    return [
      lead.city,
      lead.preferredHotel,
      lead.destination,
      lead.checkInDate ? `Check-in: ${formatShortDate(lead.checkInDate)}` : "",
      lead.checkOutDate ? `Check-out: ${formatShortDate(lead.checkOutDate)}` : "",
    ]
      .filter(Boolean)
      .join(" • ")
  }

  if (lead.serviceType === "carRental") {
    return [
      lead.destinationCountry,
      lead.city,
      lead.pickupLocation,
      lead.pickupDate ? `Pickup: ${formatShortDate(lead.pickupDate)}` : "",
      lead.vehicleType || lead.rentalType,
    ]
      .filter(Boolean)
      .join(" • ")
  }

  return [lead.city, lead.destination].filter(Boolean).join(" • ")
}

const getLeadDetails = (lead) => {
  if (!lead) return []

  const travelers = lead.travelers || {}

  if (lead.serviceType === "umrah") {
    return [
      ["City", lead.city],
      ["Adults", travelers.adults],
      ["Children", travelers.children],
      ["Infants", travelers.infants],
      ["Departure City", lead.preferredDepartureCity || lead.departureCity],
      ["Departure Date", lead.preferredDepartureDate || formatShortDate(lead.travelDate)],
      ["Duration", lead.durationOfStay],
      ["Package", lead.packageRequired],
      ["Hotel", lead.hotelPreference || lead.preferredHotel],
      ["Visa Required", lead.visaRequired],
    ]
  }

  if (lead.serviceType === "tour") {
    return [
      ["City", lead.city],
      ["Destination", lead.destination],
      ["Travel Date", lead.travelDateText || formatShortDate(lead.travelDate)],
      ["Return Date", formatShortDate(lead.returnDate)],
      ["Adults", travelers.adults],
      ["Children", travelers.children],
      ["Infants", travelers.infants],
      ["Hotel", lead.hotelCategory],
      ["Interested In", lead.interestedIn],
    ]
  }

  if (lead.serviceType === "ticket") {
    return [
      ["Departure", lead.departureCity],
      ["Destination", lead.destinationCity || lead.destination],
      ["Departure Date", lead.departureDate || formatShortDate(lead.travelDate)],
      ["Return Date", formatShortDate(lead.returnDate)],
      ["Adults", travelers.adults],
      ["Children", travelers.children],
      ["Infants", travelers.infants],
      ["Airline", lead.preferredAirline],
      ["Class", lead.travelClass],
    ]
  }

  if (lead.serviceType === "visa") {
    return [
      ["City", lead.city],
      ["Nationality", lead.nationality],
      ["Country", lead.destinationCountry || lead.destination],
      ["Visa Type", lead.visaType],
      ["Travel Date", lead.intendedTravelDate || formatShortDate(lead.travelDate)],
      ["Duration", lead.durationOfStay],
      ["Applicants", lead.numberOfApplicants],
      ["Occupation", lead.currentOccupation],
      ["Income", lead.monthlyIncome],
    ]
  }

  if (lead.serviceType === "hotel") {
    return [
      ["City", lead.city],
      ["Hotel", lead.preferredHotel],
      ["Location", lead.destination],
      ["Category", lead.hotelCategory],
      ["Check-in", formatShortDate(lead.checkInDate || lead.travelDate)],
      ["Check-out", formatShortDate(lead.checkOutDate || lead.returnDate)],
      ["Rooms", lead.numberOfRooms],
      ["Guests", lead.numberOfGuests || travelers.adults],
      ["Room Type", lead.roomType],
      ["Meal Plan", lead.mealPlan],
      ["Estimated Total", lead.estimatedTotal || lead.budget],
      ["Booking Ref", lead.bookingReference],
    ]
  }

  if (lead.serviceType === "carRental") {
    return [
      ["Country", lead.destinationCountry],
      ["City", lead.city],
      ["Pickup", lead.pickupLocation],
      ["Drop-off", lead.dropoffLocation],
      ["Pickup Date", formatShortDate(lead.pickupDate || lead.travelDate)],
      ["Pickup Time", lead.pickupTime],
      ["Return Date", formatShortDate(lead.returnDate)],
      ["Return Time", lead.returnTime],
      ["Vehicle", lead.vehicleType],
      ["Driver Option", lead.driverOption],
      ["Passengers", lead.passengerCount || travelers.adults],
      ["Luggage", lead.luggage],
    ]
  }

  return [
    ["Destination", lead.destination],
    ["Travel Date", formatShortDate(lead.travelDate)],
    ["Budget", lead.budget],
    ["Preferred Hotel", lead.preferredHotel],
  ]
}

const StatCard = ({ label, value }) => {
  return (
    <div className="rounded-[5px] border border-slate-100 bg-white px-4 py-3 shadow-sm">
      <p className="font-poppins text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">
        {label}
      </p>
      <p className="mt-1 font-fredoka text-[24px] font-semibold text-slate-950">
        {value}
      </p>
    </div>
  )
}

const AdminLeadsPage = ({ serviceType = "all" }) => {
  const [leads, setLeads] = useState([])
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("All")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const currentConfig = useMemo(() => {
    return serviceConfig[serviceType] || serviceConfig.all
  }, [serviceType])

  const stats = useMemo(() => {
    return {
      total: leads.length,
      new: leads.filter((lead) => lead.status === "New").length,
      contacted: leads.filter((lead) => lead.status === "Contacted").length,
      interested: leads.filter((lead) => lead.status === "Interested").length,
    }
  }, [leads])

  const loadLeads = async () => {
    setLoading(true)
    setError("")

    try {
      const params = new URLSearchParams()
      params.set("limit", "100")
      params.set("sort", "-createdAt")

      if (serviceType !== "all") {
        params.set("serviceType", serviceType)
      }

      if (search.trim()) {
        params.set("search", search.trim())
      }

      if (status !== "All") {
        params.set("status", status)
      }

      const data = await adminApi.getLeads(`?${params.toString()}`)
      setLeads(data.leads || data.data?.leads || [])
    } catch (err) {
      setError(err.message || "Failed to load leads.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadLeads()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, serviceType])

  const handleSearch = (event) => {
    event.preventDefault()
    loadLeads()
  }

  return (
    <div className="grid gap-5">
      <div className="rounded-[5px] border border-slate-100 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h1 className="font-fredoka text-[34px] font-semibold leading-tight text-slate-950 sm:text-[42px]">
              {currentConfig.title}
            </h1>
            <p className="mt-1 font-poppins text-sm font-medium text-slate-500">
              {currentConfig.description}
            </p>
          </div>

          <form onSubmit={handleSearch} className="flex w-full gap-2 xl:max-w-xl">
            <div className="flex h-11 flex-1 items-center gap-2 rounded-[5px] border border-slate-200 bg-[#F8FAFC] px-3">
              <FaSearch className="text-xs text-slate-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search name, phone, email, city..."
                className="min-w-0 flex-1 bg-transparent font-poppins text-sm font-semibold text-slate-700 outline-none placeholder:text-slate-400"
              />
            </div>

            <button
              type="submit"
              className="rounded-[5px] bg-[#FF6B00] px-5 font-poppins text-sm font-semibold text-white transition hover:bg-[#00AEEF]"
            >
              Search
            </button>
          </form>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Shown Leads" value={stats.total} />
          <StatCard label="New" value={stats.new} />
          <StatCard label="Contacted" value={stats.contacted} />
          <StatCard label="Interested" value={stats.interested} />
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-poppins text-xs font-semibold text-slate-500">
            Showing latest {serviceType === "all" ? "customer" : formatService(serviceType)} leads
          </p>

          <div className="flex items-center gap-2">
            <label className="font-poppins text-xs font-bold uppercase tracking-[0.08em] text-slate-400">
              Status
            </label>

            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="h-10 rounded-[5px] border border-slate-200 bg-[#F8FAFC] px-3 font-poppins text-sm font-semibold text-slate-700 outline-none focus:border-[#00AEEF]"
            >
              {statuses.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="rounded-[5px] bg-white p-6 font-poppins text-sm font-semibold text-slate-600 shadow-sm">
          Loading leads...
        </div>
      ) : error ? (
        <div className="rounded-[5px] border border-red-100 bg-red-50 p-6 font-poppins text-sm font-semibold text-red-600">
          {error}
        </div>
      ) : leads.length === 0 ? (
        <div className="rounded-[5px] border border-slate-100 bg-white p-10 text-center shadow-sm">
          <h2 className="font-fredoka text-[28px] font-semibold text-slate-950">
            No leads found
          </h2>
          <p className="mt-2 font-poppins text-sm font-medium text-slate-500">
            No inquiry matches this service/status/search filter.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {leads.map((lead) => {
            const details = getLeadDetails(lead)
              .filter((item) => item[1] !== undefined && item[1] !== null && item[1] !== "")
              .slice(0, 9)

            return (
              <article
                key={lead._id}
                className="rounded-[5px] border border-slate-100 bg-white p-5 shadow-sm transition hover:border-[#00AEEF]/30 hover:shadow-[0_14px_36px_rgba(15,23,42,0.06)]"
              >
                <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-fredoka text-[24px] font-semibold leading-tight text-slate-950">
                        {lead.name || "Unnamed Customer"}
                      </h2>

                      {serviceType === "all" && (
                        <span
                          className={`rounded-[5px] px-3 py-1 font-poppins text-xs font-bold ${getServiceBadgeClass(
                            lead.serviceType
                          )}`}
                        >
                          {formatService(lead.serviceType)}
                        </span>
                      )}

                      <span
                        className={`rounded-[5px] px-3 py-1 font-poppins text-xs font-bold ${getStatusBadgeClass(
                          lead.status
                        )}`}
                      >
                        {lead.status}
                      </span>
                    </div>

                    {getLeadSubtitle(lead) && (
                      <p className="mt-1.5 font-poppins text-sm font-semibold leading-6 text-slate-500">
                        {getLeadSubtitle(lead)}
                      </p>
                    )}

                    <div className="mt-3 grid gap-2 font-poppins text-sm font-medium text-slate-600 sm:grid-cols-2 xl:grid-cols-3">
                      <p className="flex items-center gap-2">
                        <FaPhoneAlt className="text-[#00AEEF]" />
                        {lead.phone || "-"}
                      </p>

                      <p className="flex items-center gap-2 break-all">
                        <FaEnvelope className="text-[#00AEEF]" />
                        {lead.email || "-"}
                      </p>

                      <p className="flex items-center gap-2">
                        <FaCalendarAlt className="text-[#00AEEF]" />
                        {formatDate(lead.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-wrap gap-2">
                    <a
                      href={getWhatsappUrl(lead.phone)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-[5px] bg-[#25D366] px-4 py-2.5 font-poppins text-xs font-semibold text-white transition hover:bg-[#00AEEF]"
                    >
                      <FaWhatsapp />
                      WhatsApp
                    </a>

                    <Link
                      to={`/admin/leads/${lead._id}`}
                      className="inline-flex items-center justify-center gap-2 rounded-[5px] bg-slate-950 px-4 py-2.5 font-poppins text-xs font-semibold text-white transition hover:bg-[#FF6B00]"
                    >
                      <FaEye />
                      View Details
                    </Link>
                  </div>
                </div>

                {details.length > 0 && (
                  <div className="mt-5 grid gap-3 border-t border-slate-100 pt-4 sm:grid-cols-2 xl:grid-cols-3">
                    {details.map(([label, value]) => (
                      <div
                        key={`${lead._id}-${label}`}
                        className="rounded-[5px] bg-[#F8FAFC] px-4 py-3"
                      >
                        <p className="font-poppins text-[10px] font-bold uppercase tracking-[0.08em] text-slate-400">
                          {label}
                        </p>
                        <p className="mt-1 break-words font-poppins text-sm font-semibold text-slate-800">
                          {value || "-"}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {(lead.additionalRequirements || lead.message) && (
                  <div className="mt-4 rounded-[5px] border border-slate-100 bg-white px-4 py-3">
                    <p className="font-poppins text-[10px] font-bold uppercase tracking-[0.08em] text-slate-400">
                      Additional Requirements
                    </p>
                    <p className="mt-1 whitespace-pre-wrap font-poppins text-sm font-medium leading-6 text-slate-600">
                      {lead.additionalRequirements || lead.message}
                    </p>
                  </div>
                )}
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default AdminLeadsPage
