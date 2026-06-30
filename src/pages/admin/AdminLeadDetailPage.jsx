import { useEffect, useMemo, useState } from "react"
import { Link, useParams } from "react-router-dom"
import {
  FaArrowLeft,
  FaCalendarAlt,
  FaEnvelope,
  FaInfoCircle,
  FaPhoneAlt,
  FaStickyNote,
  FaUser,
  FaWhatsapp,
} from "react-icons/fa"
import { adminApi } from "../../services/api"

const leadStatuses = [
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

const formatDateTime = (date) => {
  if (!date) return "-"
  return new Date(date).toLocaleString()
}

const formatDateOnly = (date) => {
  if (!date) return "-"
  return new Date(date).toLocaleDateString()
}

const formatValue = (value) => {
  if (value === undefined || value === null || value === "") return "-"
  return value
}

const formatService = (serviceType = "") => {
  const labels = {
    umrah: "Umrah Package",
    tour: "Tour Package",
    visa: "Visa Application",
    hotel: "Hotel Booking",
    carRental: "Car Rental / Transport",
    ticket: "Air Ticket",
    contact: "Contact Inquiry",
    general: "General Inquiry",
  }

  return labels[serviceType] || serviceType || "-"
}

const getBackUrl = (serviceType = "") => {
  const paths = {
    umrah: "/admin/leads/umrah",
    tour: "/admin/leads/tour",
    visa: "/admin/leads/visa",
    ticket: "/admin/leads/ticket",
    hotel: "/admin/leads/hotel",
    carRental: "/admin/leads/car-rental",
  }

  return paths[serviceType] || "/admin/leads"
}

const getWhatsappUrl = (phone = "") => {
  const cleanPhone = String(phone).replace(/[^\d]/g, "")
  return `https://wa.me/${cleanPhone}`
}

const InfoCard = ({ icon, label, value }) => {
  return (
    <div className="rounded-[5px] border border-slate-100 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
      <div className="flex items-start gap-3">
        {icon && (
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[5px] bg-[#00AEEF]/10 text-[#00AEEF]">
            {icon}
          </span>
        )}

        <div className="min-w-0">
          <p className="font-poppins text-[11px] font-bold uppercase tracking-[0.05em] text-slate-400">
            {label}
          </p>
          <p className="mt-1 break-words font-poppins text-sm font-semibold text-slate-900">
            {formatValue(value)}
          </p>
        </div>
      </div>
    </div>
  )
}

const SectionCard = ({ title, description, children }) => {
  return (
    <div className="rounded-[5px] border border-slate-100 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="font-fredoka text-[26px] font-semibold leading-tight text-slate-950">
          {title}
        </h2>

        {description && (
          <p className="mt-1 font-poppins text-sm font-medium text-slate-500">
            {description}
          </p>
        )}
      </div>

      {children}
    </div>
  )
}

const FieldGrid = ({ fields }) => {
  const visibleFields = fields.filter(
    ([, value]) => value !== undefined && value !== null && value !== ""
  )

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {visibleFields.map(([label, value]) => (
        <InfoCard key={label} label={label} value={value} />
      ))}
    </div>
  )
}

const UmrahLeadDetails = ({ lead }) => {
  const travelers = lead?.travelers || {}

  return (
    <SectionCard
      title="Umrah Inquiry Details"
      description="Specific fields submitted from the Umrah inquiry form."
    >
      <FieldGrid
        fields={[
          ["City", lead.city],
          ["Number of Adults", travelers.adults || lead.numberOfAdults],
          ["Number of Children", travelers.children || lead.numberOfChildren],
          ["Number of Infants", travelers.infants || lead.numberOfInfants],
          ["Preferred Departure City", lead.preferredDepartureCity || lead.departureCity],
          ["Preferred Departure Date", lead.preferredDepartureDate || formatDateOnly(lead.travelDate)],
          ["Duration of Stay", lead.durationOfStay],
          ["Package Required", lead.packageRequired],
          ["Hotel Preference", lead.hotelPreference || lead.preferredHotel],
          ["Visa Required", lead.visaRequired],
          ["Source", lead.source],
          ["Priority", lead.priority],
        ]}
      />
    </SectionCard>
  )
}

const TourLeadDetails = ({ lead }) => {
  const travelers = lead?.travelers || {}

  return (
    <SectionCard
      title="Tour Package Inquiry Details"
      description="Specific fields submitted from the Tour package inquiry form."
    >
      <FieldGrid
        fields={[
          ["City", lead.city],
          ["Destination", lead.destination],
          ["Travel Date", lead.travelDateText || formatDateOnly(lead.travelDate)],
          ["Return Date", formatDateOnly(lead.returnDate)],
          ["Number of Adults", travelers.adults || lead.numberOfAdults],
          ["Number of Children", travelers.children || lead.numberOfChildren],
          ["Number of Infants", travelers.infants || lead.numberOfInfants],
          ["Hotel Category", lead.hotelCategory],
          ["Interested In", lead.interestedIn],
          ["Source", lead.source],
          ["Priority", lead.priority],
        ]}
      />
    </SectionCard>
  )
}

const TicketLeadDetails = ({ lead }) => {
  const travelers = lead?.travelers || {}

  return (
    <SectionCard
      title="Air Ticket Booking Details"
      description="Specific fields submitted from the Air ticket booking form."
    >
      <FieldGrid
        fields={[
          ["Departure City", lead.departureCity],
          ["Destination City", lead.destinationCity || lead.destination],
          ["Departure Date", lead.departureDate || formatDateOnly(lead.travelDate)],
          ["Return Date", formatDateOnly(lead.returnDate)],
          ["Adults", travelers.adults || lead.numberOfAdults],
          ["Children", travelers.children || lead.numberOfChildren],
          ["Infants", travelers.infants || lead.numberOfInfants],
          ["Preferred Airline", lead.preferredAirline],
          ["Class", lead.travelClass],
          ["Source", lead.source],
          ["Priority", lead.priority],
        ]}
      />
    </SectionCard>
  )
}

const VisaLeadDetails = ({ lead }) => {
  return (
    <SectionCard
      title="Visa Application Inquiry Details"
      description="Specific fields submitted from the Visa application inquiry form."
    >
      <FieldGrid
        fields={[
          ["City", lead.city],
          ["Nationality", lead.nationality],
          ["Destination Country", lead.destinationCountry || lead.destination],
          ["Visa Type", lead.visaType],
          ["Intended Travel Date", lead.intendedTravelDate || formatDateOnly(lead.travelDate)],
          ["Duration of Stay", lead.durationOfStay],
          ["Number of Applicants", lead.numberOfApplicants],
          ["Traveled Abroad Before", lead.traveledAbroadBefore],
          ["Visa Refused Before", lead.visaRefusedBefore],
          ["Current Occupation", lead.currentOccupation],
          ["Monthly Income", lead.monthlyIncome],
          ["Flight Booking Assistance", lead.flightBookingAssistance],
          ["Hotel Booking Assistance", lead.hotelBookingAssistance],
          ["Source", lead.source],
          ["Priority", lead.priority],
        ]}
      />
    </SectionCard>
  )
}

const HotelLeadDetails = ({ lead }) => {
  const travelers = lead?.travelers || {}

  return (
    <SectionCard
      title="Hotel Booking Details"
      description="Specific fields submitted from the Hotel booking form."
    >
      <FieldGrid
        fields={[
          ["City", lead.city],
          ["Hotel Name", lead.preferredHotel],
          ["Hotel Location", lead.destination],
          ["Hotel Category", lead.hotelCategory],
          ["Check-in Date", formatDateOnly(lead.checkInDate || lead.travelDate)],
          ["Check-out Date", formatDateOnly(lead.checkOutDate || lead.returnDate)],
          ["Number of Rooms", lead.numberOfRooms],
          ["Number of Guests", lead.numberOfGuests || travelers.adults],
          ["Room Type", lead.roomType],
          ["Meal Plan", lead.mealPlan],
          ["Booking Reference", lead.bookingReference],
          ["Payment Method", lead.paymentMethod],
          ["Estimated Total", lead.estimatedTotal || lead.budget],
          ["Source", lead.source],
          ["Priority", lead.priority],
        ]}
      />
    </SectionCard>
  )
}

const CarRentalLeadDetails = ({ lead }) => {
  const travelers = lead?.travelers || {}

  return (
    <SectionCard
      title="Car Rental Inquiry Details"
      description="Specific fields submitted from the Car rental quote form."
    >
      <FieldGrid
        fields={[
          ["Destination Country", lead.destinationCountry],
          ["Destination City", lead.city],
          ["Pickup Location", lead.pickupLocation],
          ["Drop-off Location", lead.dropoffLocation],
          ["Pickup Date", formatDateOnly(lead.pickupDate || lead.travelDate)],
          ["Pickup Time", lead.pickupTime],
          ["Return Date", formatDateOnly(lead.returnDate)],
          ["Return Time", lead.returnTime],
          ["Vehicle Required", lead.vehicleType],
          ["Rental Type", lead.rentalType],
          ["Driver Option", lead.driverOption],
          ["Passengers", lead.passengerCount || travelers.adults],
          ["Luggage", lead.luggage],
          ["Source", lead.source],
          ["Priority", lead.priority],
        ]}
      />
    </SectionCard>
  )
}

const GenericLeadDetails = ({ lead }) => {
  const travelers = lead?.travelers || {}

  return (
    <SectionCard
      title="Inquiry Details"
      description="General inquiry details submitted from the website."
    >
      <FieldGrid
        fields={[
          ["Destination", lead.destination],
          ["Travel Date", formatDateOnly(lead.travelDate)],
          ["Adults", travelers.adults],
          ["Children", travelers.children],
          ["Infants", travelers.infants],
          ["Budget", lead.budget],
          ["Preferred Hotel", lead.preferredHotel],
          ["Pickup Location", lead.pickupLocation],
          ["Drop-off Location", lead.dropoffLocation],
          ["Source", lead.source],
          ["Priority", lead.priority],
        ]}
      />
    </SectionCard>
  )
}

const ServiceSpecificDetails = ({ lead }) => {
  if (lead.serviceType === "umrah") return <UmrahLeadDetails lead={lead} />
  if (lead.serviceType === "tour") return <TourLeadDetails lead={lead} />
  if (lead.serviceType === "ticket") return <TicketLeadDetails lead={lead} />
  if (lead.serviceType === "visa") return <VisaLeadDetails lead={lead} />
  if (lead.serviceType === "hotel") return <HotelLeadDetails lead={lead} />
  if (lead.serviceType === "carRental") return <CarRentalLeadDetails lead={lead} />

  return <GenericLeadDetails lead={lead} />
}

const AdminLeadDetailPage = () => {
  const { id } = useParams()

  const [lead, setLead] = useState(null)
  const [selectedStatus, setSelectedStatus] = useState("")
  const [noteText, setNoteText] = useState("")
  const [loading, setLoading] = useState(true)
  const [savingStatus, setSavingStatus] = useState(false)
  const [savingNote, setSavingNote] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const customerSummary = useMemo(() => {
    if (!lead) return []

    return [
      {
        icon: <FaUser />,
        label: "Customer Name",
        value: lead.name,
      },
      {
        icon: <FaPhoneAlt />,
        label: "Mobile / WhatsApp",
        value: lead.phone,
      },
      {
        icon: <FaEnvelope />,
        label: "Email Address",
        value: lead.email,
      },
      {
        icon: <FaCalendarAlt />,
        label: "Submitted At",
        value: formatDateTime(lead.createdAt),
      },
      {
        icon: <FaInfoCircle />,
        label: "Service",
        value: formatService(lead.serviceType),
      },
      {
        icon: <FaStickyNote />,
        label: "Current Status",
        value: lead.status,
      },
    ]
  }, [lead])

  const loadLead = async () => {
    setLoading(true)
    setError("")

    try {
      const data = await adminApi.getLeadById(id)
      const leadData = data.lead || data.data?.lead

      setLead(leadData)
      setSelectedStatus(leadData?.status || "New")
    } catch (err) {
      setError(err.message || "Failed to load lead details.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadLead()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const handleStatusUpdate = async () => {
    if (!lead || selectedStatus === lead.status) return

    setSavingStatus(true)
    setError("")
    setSuccess("")

    try {
      await adminApi.updateLeadStatus(lead._id, selectedStatus)
      setSuccess("Lead status updated successfully.")
      await loadLead()
    } catch (err) {
      setError(err.message || "Failed to update lead status.")
    } finally {
      setSavingStatus(false)
    }
  }

  const handleAddNote = async (event) => {
    event.preventDefault()

    const text = noteText.trim()
    if (!text || !lead) return

    setSavingNote(true)
    setError("")
    setSuccess("")

    try {
      await adminApi.addLeadNote(lead._id, text)
      setNoteText("")
      setSuccess("Note added successfully.")
      await loadLead()
    } catch (err) {
      setError(err.message || "Failed to add note.")
    } finally {
      setSavingNote(false)
    }
  }

  if (loading) {
    return (
      <div className="rounded-[5px] bg-white p-6 font-poppins text-sm font-semibold text-slate-600 shadow-sm">
        Loading lead details...
      </div>
    )
  }

  if (error && !lead) {
    return (
      <div className="grid gap-4">
        <Link
          to="/admin/leads"
          className="inline-flex w-fit items-center gap-2 rounded-[5px] bg-white px-4 py-2 font-poppins text-sm font-semibold text-slate-700 shadow-sm transition hover:text-[#FF6B00]"
        >
          <FaArrowLeft />
          Back to Leads
        </Link>

        <div className="rounded-[5px] border border-red-100 bg-red-50 p-6 font-poppins text-sm font-semibold text-red-600">
          {error}
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <Link
            to={getBackUrl(lead?.serviceType)}
            className="inline-flex items-center gap-2 font-poppins text-sm font-semibold text-slate-500 transition hover:text-[#FF6B00]"
          >
            <FaArrowLeft />
            Back to Leads
          </Link>

          <h1 className="mt-3 font-fredoka text-[34px] font-semibold leading-tight text-slate-950">
            Lead Details
          </h1>

          <p className="mt-1 font-poppins text-sm font-medium text-slate-500">
            View customer information, service-specific details, status, and follow-up notes.
          </p>
        </div>

        <div className="rounded-[5px] border border-slate-100 bg-white p-4 shadow-sm">
          <p className="font-poppins text-[11px] font-bold uppercase tracking-[0.05em] text-slate-400">
            Update Status
          </p>

          <div className="mt-2 flex flex-col gap-2 sm:flex-row">
            <select
              value={selectedStatus}
              onChange={(event) => setSelectedStatus(event.target.value)}
              className="h-11 rounded-[5px] border border-slate-200 bg-[#F8FAFC] px-3 font-poppins text-sm font-semibold text-slate-800 outline-none focus:border-[#00AEEF]"
            >
              {leadStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={handleStatusUpdate}
              disabled={savingStatus || selectedStatus === lead.status}
              className="h-11 rounded-[5px] bg-[#FF6B00] px-4 font-poppins text-sm font-semibold text-white transition hover:bg-[#00AEEF] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {savingStatus ? "Updating..." : "Update"}
            </button>
          </div>
        </div>
      </div>

      {success && (
        <div className="rounded-[5px] border border-emerald-100 bg-emerald-50 px-5 py-4 font-poppins text-sm font-semibold text-emerald-700">
          {success}
        </div>
      )}

      {error && (
        <div className="rounded-[5px] border border-red-100 bg-red-50 px-5 py-4 font-poppins text-sm font-semibold text-red-600">
          {error}
        </div>
      )}

      <SectionCard title="Customer Information">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {customerSummary.map((item) => (
            <InfoCard
              key={item.label}
              icon={item.icon}
              label={item.label}
              value={item.value}
            />
          ))}
        </div>
      </SectionCard>

      <ServiceSpecificDetails lead={lead} />

      <SectionCard title="Additional Requirements / Message">
        <div className="rounded-[5px] bg-[#F8FAFC] p-4">
          <p className="whitespace-pre-wrap font-poppins text-sm font-medium leading-7 text-slate-700">
            {lead.additionalRequirements || lead.message || "No additional requirements added."}
          </p>
        </div>
      </SectionCard>

      <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <SectionCard title="Admin Notes">
          <form onSubmit={handleAddNote} className="grid gap-3">
            <textarea
              value={noteText}
              onChange={(event) => setNoteText(event.target.value)}
              placeholder="Add follow-up note..."
              rows={4}
              className="w-full resize-none rounded-[5px] border border-slate-200 bg-[#F8FAFC] px-4 py-3 font-poppins text-sm font-medium text-slate-800 outline-none transition focus:border-[#00AEEF] focus:bg-white"
            />

            <button
              type="submit"
              disabled={savingNote || !noteText.trim()}
              className="w-fit rounded-[5px] bg-[#FF6B00] px-5 py-2.5 font-poppins text-sm font-semibold text-white transition hover:bg-[#00AEEF] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {savingNote ? "Adding..." : "Add Note"}
            </button>
          </form>

          <div className="mt-5 grid gap-3">
            {lead.notes?.length ? (
              [...lead.notes].reverse().map((note) => (
                <div
                  key={note._id}
                  className="rounded-[5px] border border-slate-100 bg-[#F8FAFC] p-4"
                >
                  <p className="whitespace-pre-wrap font-poppins text-sm font-medium leading-6 text-slate-700">
                    {note.text}
                  </p>

                  <p className="mt-3 font-poppins text-xs font-semibold text-slate-400">
                    By {note.createdBy?.name || "Admin"} • {formatDateTime(note.createdAt)}
                  </p>
                </div>
              ))
            ) : (
              <p className="rounded-[5px] bg-[#F8FAFC] p-4 font-poppins text-sm font-semibold text-slate-500">
                No notes added yet.
              </p>
            )}
          </div>
        </SectionCard>

        <div className="grid gap-5">
          <SectionCard title="Quick Actions">
            <div className="grid gap-3">
              <a
                href={getWhatsappUrl(lead.phone)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-[5px] bg-[#25D366] px-4 py-3 font-poppins text-sm font-semibold text-white transition hover:bg-[#00AEEF]"
              >
                <FaWhatsapp />
                Open WhatsApp Chat
              </a>

              <a
                href={`tel:${lead.phone}`}
                className="rounded-[5px] bg-slate-950 px-4 py-3 text-center font-poppins text-sm font-semibold text-white transition hover:bg-[#FF6B00]"
              >
                Call Customer
              </a>

              <a
                href={`mailto:${lead.email}`}
                className="rounded-[5px] border border-slate-200 bg-white px-4 py-3 text-center font-poppins text-sm font-semibold text-slate-700 transition hover:border-[#00AEEF] hover:text-[#00AEEF]"
              >
                Send Email
              </a>
            </div>
          </SectionCard>

          <SectionCard title="Status History">
            <div className="grid gap-3">
              {lead.statusHistory?.length ? (
                [...lead.statusHistory].reverse().map((item, index) => (
                  <div
                    key={`${item.status}-${item.changedAt}-${index}`}
                    className="rounded-[5px] bg-[#F8FAFC] p-4"
                  >
                    <p className="font-poppins text-sm font-bold text-slate-950">
                      {item.status}
                    </p>

                    <p className="mt-1 font-poppins text-xs font-semibold text-slate-500">
                      {formatDateTime(item.changedAt)}
                    </p>

                    {item.changedBy && (
                      <p className="mt-1 font-poppins text-xs font-semibold text-slate-400">
                        Changed by {item.changedBy.name}
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <p className="rounded-[5px] bg-[#F8FAFC] p-4 font-poppins text-sm font-semibold text-slate-500">
                  No status history found.
                </p>
              )}
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  )
}

export default AdminLeadDetailPage
