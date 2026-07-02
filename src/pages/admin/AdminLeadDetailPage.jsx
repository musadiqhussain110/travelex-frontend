import { useEffect, useMemo, useState } from "react"
import { Link, useParams } from "react-router-dom"
import {
  FaArrowLeft,
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
  FaEnvelope,
  FaExclamationCircle,
  FaFileAlt,
  FaHotel,
  FaInfoCircle,
  FaPhoneAlt,
  FaPlane,
  FaPlaneArrival,
  FaRegStickyNote,
  FaRoute,
  FaStickyNote,
  FaUser,
  FaWhatsapp,
} from "react-icons/fa"

import AppDatePicker from "../../components/common/AppDatePicker"
import AppTimePicker from "../../components/common/AppTimePicker"
import { adminApi } from "../../services/api"
import Customer360Timeline from "../../components/admin/Customer360Timeline"
import LeadWhatsAppTemplates from "../../components/admin/LeadWhatsAppTemplates"
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

const followUpStatuses = ["Not Set", "Scheduled", "Completed", "Cancelled"]

const formatDateTime = (date) => {
  if (!date) return "-"
  return new Date(date).toLocaleString()
}

const formatDateOnly = (date) => {
  if (!date) return "-"
  return new Date(date).toLocaleDateString()
}

const formatDateForInput = (date) => {
  if (!date) return ""

  const parsedDate = new Date(date)

  if (Number.isNaN(parsedDate.getTime())) return ""

  const year = parsedDate.getFullYear()
  const month = String(parsedDate.getMonth() + 1).padStart(2, "0")
  const day = String(parsedDate.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

const parseDateInput = (value) => {
  if (!value) return null

  const cleanValue = String(value).trim()

  if (/^\d{4}-\d{2}-\d{2}$/.test(cleanValue)) {
    const date = new Date(`${cleanValue}T00:00:00`)
    return Number.isNaN(date.getTime()) ? null : date
  }

  const match = cleanValue.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/)

  if (!match) return null

  const [, day, month, year] = match
  const date = new Date(Number(year), Number(month) - 1, Number(day))

  return Number.isNaN(date.getTime()) ? null : date
}

const getDateIso = (value) => {
  const date = parseDateInput(value)
  return date ? date.toISOString() : null
}

const formatValue = (value) => {
  if (value === undefined || value === null || value === "") return "-"
  return value
}

const formatPriority = (priority = "") => {
  if (!priority) return "Medium"
  return priority.charAt(0).toUpperCase() + priority.slice(1)
}

const formatService = (serviceType = "") => {
  const labels = {
    umrah: "Umrah Package",
    tour: "Tour Package",
    visa: "Visa Application",
    hotel: "Hotel Booking",
    carRental: "Airport Transfer",
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
  return cleanPhone ? `https://wa.me/${cleanPhone}` : "https://wa.me/"
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

const getPriorityBadgeClass = (priority = "") => {
  const classes = {
    low: "bg-slate-100 text-slate-600",
    medium: "bg-sky-50 text-[#00AEEF]",
    high: "bg-orange-50 text-[#FF6B00]",
    urgent: "bg-red-50 text-red-700",
  }

  return classes[priority] || "bg-sky-50 text-[#00AEEF]"
}

const getFollowUpBadgeClass = (status = "") => {
  const classes = {
    "Not Set": "bg-slate-100 text-slate-600",
    Scheduled: "bg-sky-50 text-[#00AEEF]",
    Completed: "bg-emerald-50 text-emerald-700",
    Cancelled: "bg-red-50 text-red-700",
  }

  return classes[status] || "bg-slate-100 text-slate-600"
}

const isFollowUpOverdue = (lead) => {
  if (!lead?.followUpDate || lead.followUpStatus !== "Scheduled") return false

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const followUpDate = new Date(lead.followUpDate)
  followUpDate.setHours(0, 0, 0, 0)

  return followUpDate < today
}

const getServiceIcon = (serviceType = "") => {
  const icons = {
    umrah: <FaPlane />,
    tour: <FaRoute />,
    visa: <FaFileAlt />,
    hotel: <FaHotel />,
    carRental: <FaPlaneArrival />,
    ticket: <FaPlane />,
    contact: <FaEnvelope />,
    general: <FaInfoCircle />,
  }

  return icons[serviceType] || <FaInfoCircle />
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
    ([, value]) =>
      value !== undefined &&
      value !== null &&
      value !== "" &&
      value !== "-"
  )

  if (!visibleFields.length) {
    return (
      <div className="rounded-[5px] border border-dashed border-slate-200 bg-[#F8FAFC] p-6 text-center">
        <p className="font-poppins text-sm font-semibold text-slate-500">
          No service-specific details available.
        </p>
      </div>
    )
  }

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
      description="Customer requirements submitted from the Umrah inquiry form."
    >
      <FieldGrid
        fields={[
          ["City", lead.city],
          ["Adults", travelers.adults || lead.numberOfAdults],
          ["Children", travelers.children || lead.numberOfChildren],
          ["Infants", travelers.infants || lead.numberOfInfants],
          ["Preferred Departure City", lead.preferredDepartureCity || lead.departureCity],
          ["Preferred Departure Date", lead.preferredDepartureDate || formatDateOnly(lead.travelDate)],
          ["Duration of Stay", lead.durationOfStay],
          ["Package Required", lead.packageRequired],
          ["Hotel Preference", lead.hotelPreference || lead.preferredHotel],
          ["Visa Required", lead.visaRequired],
          ["Source", lead.source],
          ["Priority", formatPriority(lead.priority)],
        ]}
      />
    </SectionCard>
  )
}

const TourLeadDetails = ({ lead }) => {
  const travelers = lead?.travelers || {}

  return (
    <SectionCard
      title="Tour Package Details"
      description="Customer requirements submitted from the tour inquiry form."
    >
      <FieldGrid
        fields={[
          ["City", lead.city],
          ["Destination", lead.destination],
          ["Travel Date", lead.travelDateText || formatDateOnly(lead.travelDate)],
          ["Return Date", formatDateOnly(lead.returnDate)],
          ["Adults", travelers.adults || lead.numberOfAdults],
          ["Children", travelers.children || lead.numberOfChildren],
          ["Infants", travelers.infants || lead.numberOfInfants],
          ["Hotel Category", lead.hotelCategory],
          ["Interested In", lead.interestedIn],
          ["Source", lead.source],
          ["Priority", formatPriority(lead.priority)],
        ]}
      />
    </SectionCard>
  )
}

const TicketLeadDetails = ({ lead }) => {
  const travelers = lead?.travelers || {}

  return (
    <SectionCard
      title="Air Ticket Details"
      description="Flight inquiry details submitted by the customer."
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
          ["Priority", formatPriority(lead.priority)],
        ]}
      />
    </SectionCard>
  )
}

const VisaLeadDetails = ({ lead }) => {
  return (
    <SectionCard
      title="Visa Application Details"
      description="Visa inquiry and applicant details submitted by the customer."
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
          ["Priority", formatPriority(lead.priority)],
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
      description="Hotel stay details, guests, rooms, and special requests."
    >
      <FieldGrid
        fields={[
          ["City", lead.city],
          ["Destination", lead.destination],
          ["Hotel Name", lead.preferredHotel],
          ["Hotel Category", lead.hotelCategory],
          ["Check-in Date", formatDateOnly(lead.checkInDate || lead.travelDate)],
          ["Check-out Date", formatDateOnly(lead.checkOutDate || lead.returnDate)],
          ["Duration", lead.durationOfStay],
          ["Adults", travelers.adults],
          ["Children", travelers.children],
          ["Infants", travelers.infants],
          ["Total Guests", lead.numberOfGuests],
          ["Number of Rooms", lead.numberOfRooms],
          ["Room Type", lead.roomType],
          ["Meal Plan", lead.mealPlan],
          ["Booking Reference", lead.bookingReference],
          ["Source", lead.source],
          ["Priority", formatPriority(lead.priority)],
        ]}
      />
    </SectionCard>
  )
}

const AirportTransferLeadDetails = ({ lead }) => {
  const travelers = lead?.travelers || {}

  return (
    <SectionCard
      title="Airport Transfer Details"
      description="Pick-up/drop-off request, flight details, passengers, luggage, and vehicle preference."
    >
      <FieldGrid
        fields={[
          ["Service Required", lead.rentalType],
          ["Airline", lead.preferredAirline],
          ["Flight Number", lead.bookingReference],
          ["Arrival / Departure Date", formatDateOnly(lead.pickupDate || lead.travelDate)],
          ["Arrival / Departure Time", lead.pickupTime],
          ["Airport", lead.destination],
          ["Pickup Location", lead.pickupLocation],
          ["Drop-off Location", lead.dropoffLocation],
          ["Adults", travelers.adults],
          ["Children", travelers.children],
          ["Infants", travelers.infants],
          ["Total Passengers", lead.passengerCount],
          ["Luggage", lead.luggage],
          ["Vehicle Preference", lead.vehicleType],
          ["Source", lead.source],
          ["Priority", formatPriority(lead.priority)],
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
          ["Priority", formatPriority(lead.priority)],
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
  if (lead.serviceType === "carRental") {
    return <AirportTransferLeadDetails lead={lead} />
  }

  return <GenericLeadDetails lead={lead} />
}

const TimelineItem = ({ title, subtitle, meta, icon }) => {
  return (
    <div className="relative flex gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[5px] bg-[#00AEEF]/10 text-[#00AEEF]">
        {icon || <FaClock />}
      </div>

      <div className="min-w-0 flex-1 rounded-[5px] bg-[#F8FAFC] p-4">
        <p className="font-poppins text-sm font-bold text-slate-950">
          {title}
        </p>

        {subtitle && (
          <p className="mt-1 whitespace-pre-wrap font-poppins text-sm font-medium leading-6 text-slate-600">
            {subtitle}
          </p>
        )}

        {meta && (
          <p className="mt-2 font-poppins text-xs font-semibold text-slate-400">
            {meta}
          </p>
        )}
      </div>
    </div>
  )
}

const AdminLeadDetailPage = () => {
  const { id } = useParams()

  const [lead, setLead] = useState(null)
  const [selectedStatus, setSelectedStatus] = useState("")
  const [noteText, setNoteText] = useState("")
  const [followUpForm, setFollowUpForm] = useState({
    followUpDate: "",
    followUpTime: "",
    followUpNote: "",
    followUpStatus: "Not Set",
  })

  const [loading, setLoading] = useState(true)
  const [savingStatus, setSavingStatus] = useState(false)
  const [savingNote, setSavingNote] = useState(false)
  const [savingFollowUp, setSavingFollowUp] = useState(false)
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
        icon: getServiceIcon(lead.serviceType),
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

  const operationalSummary = useMemo(() => {
    if (!lead) return []

    return [
      {
        label: "Lead Priority",
        value: formatPriority(lead.priority || "medium"),
      },
      {
        label: "Lead Source",
        value: lead.source,
      },
      {
        label: "Follow-up Status",
        value: lead.followUpStatus || "Not Set",
      },
      {
        label: "Follow-up Date",
        value: lead.followUpDate ? formatDateOnly(lead.followUpDate) : "-",
      },
      {
        label: "Created",
        value: formatDateTime(lead.createdAt),
      },
      {
        label: "Last Updated",
        value: formatDateTime(lead.updatedAt),
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

      setFollowUpForm({
        followUpDate: formatDateForInput(leadData?.followUpDate),
        followUpTime: leadData?.followUpTime || "",
        followUpNote: leadData?.followUpNote || "",
        followUpStatus: leadData?.followUpStatus || "Not Set",
      })
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

  const handleFollowUpValueChange = (name, value) => {
    setFollowUpForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "followUpDate" && value && prev.followUpStatus === "Not Set"
        ? { followUpStatus: "Scheduled" }
        : {}),
    }))

    setError("")
    setSuccess("")
  }

  const handleFollowUpUpdate = async (event) => {
    event.preventDefault()

    if (!lead) return

    if (
      followUpForm.followUpStatus === "Scheduled" &&
      !followUpForm.followUpDate
    ) {
      setError("Please select follow-up date before scheduling.")
      return
    }

    setSavingFollowUp(true)
    setError("")
    setSuccess("")

    try {
      const payload = {
        followUpDate: followUpForm.followUpDate
          ? getDateIso(followUpForm.followUpDate)
          : null,
        followUpTime: followUpForm.followUpTime,
        followUpNote: followUpForm.followUpNote,
        followUpStatus: followUpForm.followUpDate
          ? followUpForm.followUpStatus || "Scheduled"
          : "Not Set",
      }

      await adminApi.updateLeadFollowUp(lead._id, payload)

      setSuccess("Follow-up updated successfully.")
      await loadLead()
    } catch (err) {
      setError(err.message || "Failed to update follow-up.")
    } finally {
      setSavingFollowUp(false)
    }
  }

  const handleClearFollowUp = async () => {
    if (!lead) return

    setSavingFollowUp(true)
    setError("")
    setSuccess("")

    try {
      await adminApi.updateLeadFollowUp(lead._id, {
        followUpDate: null,
        followUpTime: "",
        followUpNote: "",
        followUpStatus: "Not Set",
      })

      setSuccess("Follow-up cleared successfully.")
      await loadLead()
    } catch (err) {
      setError(err.message || "Failed to clear follow-up.")
    } finally {
      setSavingFollowUp(false)
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
      <div className="grid gap-4">
        <div className="rounded-[5px] border border-slate-100 bg-white p-6 shadow-sm">
          <p className="font-fredoka text-[28px] font-semibold text-slate-950">
            Loading lead details...
          </p>
          <p className="mt-1 font-poppins text-sm font-medium text-slate-500">
            Please wait while we prepare customer profile.
          </p>
        </div>

        <div className="h-64 animate-pulse rounded-[5px] bg-white" />
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
      {/* Header */}
      <section className="overflow-hidden rounded-[5px] bg-slate-950 shadow-[0_22px_60px_rgba(15,23,42,0.16)]">
        <div className="relative p-5 sm:p-7">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#00AEEF]/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 left-10 h-64 w-64 rounded-full bg-[#FF6B00]/20 blur-3xl" />

          <div className="relative z-10 flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <Link
                to={getBackUrl(lead?.serviceType)}
                className="inline-flex items-center gap-2 font-poppins text-sm font-semibold text-white/60 transition hover:text-[#FF6B00]"
              >
                <FaArrowLeft />
                Back to {formatService(lead?.serviceType)} Leads
              </Link>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-[5px] bg-white/10 px-3 py-1.5 font-poppins text-xs font-bold text-[#00AEEF] backdrop-blur">
                  {getServiceIcon(lead?.serviceType)}
                  {formatService(lead?.serviceType)}
                </span>

                <span
                  className={`rounded-[5px] px-3 py-1.5 font-poppins text-xs font-bold ${getStatusBadgeClass(
                    lead?.status
                  )}`}
                >
                  {lead?.status || "New"}
                </span>

                <span
                  className={`rounded-[5px] px-3 py-1.5 font-poppins text-xs font-bold ${getPriorityBadgeClass(
                    lead?.priority
                  )}`}
                >
                  {formatPriority(lead?.priority || "medium")}
                </span>

                <span
                  className={`rounded-[5px] px-3 py-1.5 font-poppins text-xs font-bold ${getFollowUpBadgeClass(
                    lead?.followUpStatus
                  )}`}
                >
                  Follow-up: {lead?.followUpStatus || "Not Set"}
                </span>

                {isFollowUpOverdue(lead) && (
                  <span className="rounded-[5px] bg-red-50 px-3 py-1.5 font-poppins text-xs font-bold text-red-700">
                    Overdue
                  </span>
                )}
              </div>

              <h1 className="mt-3 font-fredoka text-[34px] font-semibold leading-tight text-white sm:text-[46px]">
                {lead?.name || "Lead Details"}
              </h1>

              <p className="mt-2 max-w-3xl font-poppins text-sm font-medium leading-7 text-white/70 sm:text-base">
                View customer profile, service requirements, follow-up plan,
                communication actions, CRM status, and admin notes.
              </p>
            </div>

            <div className="grid gap-2 sm:grid-cols-3 xl:min-w-[500px]">
              <a
                href={getWhatsappUrl(lead.phone)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-[5px] bg-[#25D366] px-4 py-3 font-poppins text-sm font-semibold text-white transition hover:bg-[#00AEEF]"
              >
                <FaWhatsapp />
                WhatsApp
              </a>

              <a
                href={`tel:${lead.phone || ""}`}
                className="inline-flex items-center justify-center gap-2 rounded-[5px] bg-white/10 px-4 py-3 font-poppins text-sm font-semibold text-white backdrop-blur transition hover:bg-[#FF6B00]"
              >
                <FaPhoneAlt />
                Call
              </a>

              <a
                href={`mailto:${lead.email || ""}`}
                className="inline-flex items-center justify-center gap-2 rounded-[5px] bg-white/10 px-4 py-3 font-poppins text-sm font-semibold text-white backdrop-blur transition hover:bg-[#00AEEF]"
              >
                <FaEnvelope />
                Email
              </a>
            </div>
          </div>
        </div>
      </section>

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

      {/* CRM Controls */}
      <section className="grid gap-5 xl:grid-cols-[1fr_420px]">
        <SectionCard
          title="Customer Information"
          description="Primary customer contact and lead identity."
        >
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

        <div className="rounded-[5px] border border-slate-100 bg-white p-5 shadow-sm">
          <h2 className="font-fredoka text-[26px] font-semibold leading-tight text-slate-950">
            CRM Status Control
          </h2>

          <p className="mt-1 font-poppins text-sm font-medium text-slate-500">
            Move this lead through the TravelEx sales pipeline.
          </p>

          <div className="mt-4 grid gap-3">
            <select
              value={selectedStatus}
              onChange={(event) => setSelectedStatus(event.target.value)}
              className="h-12 rounded-[5px] border border-slate-200 bg-[#F8FAFC] px-3 font-poppins text-sm font-semibold text-slate-800 outline-none focus:border-[#00AEEF]"
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
              className="h-12 rounded-[5px] bg-[#FF6B00] px-4 font-poppins text-sm font-semibold text-white transition hover:bg-[#00AEEF] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {savingStatus ? "Updating Status..." : "Update Status"}
            </button>
          </div>

          <div className="mt-5 grid gap-3">
            {operationalSummary.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between gap-4 rounded-[5px] bg-[#F8FAFC] px-4 py-3"
              >
                <span className="font-poppins text-xs font-bold uppercase tracking-[0.06em] text-slate-400">
                  {item.label}
                </span>
                <span className="text-right font-poppins text-sm font-semibold text-slate-800">
                  {formatValue(item.value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Follow-up Planner */}
      <SectionCard
        title="Follow-up Planner"
        description="Schedule the next call, WhatsApp message, document reminder, or quotation follow-up."
      >
        <form onSubmit={handleFollowUpUpdate} className="grid gap-5">
          <div className="grid gap-4 lg:grid-cols-4">
            <AppDatePicker
              label="Follow-up Date"
              value={followUpForm.followUpDate}
              onChange={(value) =>
                handleFollowUpValueChange("followUpDate", value)
              }
              placeholder="Select follow-up date"
            />

            <AppTimePicker
              label="Follow-up Time"
              value={followUpForm.followUpTime}
              onChange={(value) =>
                handleFollowUpValueChange("followUpTime", value)
              }
              placeholder="Select follow-up time"
            />

            <div>
              <label className="mb-1.5 block font-poppins text-[9px] font-bold uppercase tracking-[0.08em] text-slate-400 sm:mb-2 sm:text-xs">
                Follow-up Status
              </label>

              <select
                value={followUpForm.followUpStatus}
                onChange={(event) =>
                  handleFollowUpValueChange("followUpStatus", event.target.value)
                }
                className="h-11 w-full rounded-[5px] border border-slate-200 bg-white px-3 font-poppins text-xs font-semibold text-slate-900 outline-none transition focus:border-[#00AEEF] focus:ring-2 focus:ring-[#00AEEF]/10 sm:h-12 sm:px-4 sm:text-sm"
              >
                {followUpStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div className="rounded-[5px] bg-[#F8FAFC] px-4 py-3">
              <p className="font-poppins text-[10px] font-bold uppercase tracking-[0.08em] text-slate-400">
                Current Follow-up
              </p>

              <p
                className={`mt-1 inline-flex rounded-[5px] px-2.5 py-1 font-poppins text-xs font-bold ${getFollowUpBadgeClass(
                  lead.followUpStatus
                )}`}
              >
                {lead.followUpStatus || "Not Set"}
              </p>

              <p className="mt-2 font-poppins text-xs font-semibold text-slate-500">
                {lead.followUpDate
                  ? `${formatDateOnly(lead.followUpDate)} ${
                      lead.followUpTime || ""
                    }`
                  : "No follow-up scheduled"}
              </p>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block font-poppins text-[9px] font-bold uppercase tracking-[0.08em] text-slate-400 sm:mb-2 sm:text-xs">
              Follow-up Note
            </label>

            <textarea
              value={followUpForm.followUpNote}
              onChange={(event) =>
                handleFollowUpValueChange("followUpNote", event.target.value)
              }
              placeholder="Example: Call customer tomorrow for quotation confirmation, remind documents, ask payment status..."
              rows={4}
              className="w-full resize-none rounded-[5px] border border-slate-200 bg-[#F8FAFC] px-4 py-3 font-poppins text-sm font-medium text-slate-800 outline-none transition focus:border-[#00AEEF] focus:bg-white"
            />
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="submit"
              disabled={savingFollowUp}
              className="inline-flex items-center justify-center gap-2 rounded-[5px] bg-[#FF6B00] px-5 py-3 font-poppins text-sm font-semibold text-white transition hover:bg-[#00AEEF] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FaCalendarAlt />
              {savingFollowUp ? "Saving Follow-up..." : "Save Follow-up"}
            </button>

            <button
              type="button"
              onClick={handleClearFollowUp}
              disabled={savingFollowUp}
              className="inline-flex items-center justify-center gap-2 rounded-[5px] border border-slate-200 bg-white px-5 py-3 font-poppins text-sm font-semibold text-slate-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Clear Follow-up
            </button>
          </div>
        </form>
      </SectionCard>

      <ServiceSpecificDetails lead={lead} />
<Customer360Timeline lead={lead} />
<LeadWhatsAppTemplates lead={lead} />
      <SectionCard
        title="Additional Requirements / Full Message"
        description="Complete customer request captured from the website form."
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-[5px] bg-[#F8FAFC] p-4">
            <p className="font-poppins text-[11px] font-bold uppercase tracking-[0.08em] text-slate-400">
              Additional Requirements
            </p>

            <p className="mt-2 whitespace-pre-wrap font-poppins text-sm font-medium leading-7 text-slate-700">
              {lead.additionalRequirements ||
                "No additional requirements added."}
            </p>
          </div>

          <div className="rounded-[5px] bg-[#F8FAFC] p-4">
            <p className="font-poppins text-[11px] font-bold uppercase tracking-[0.08em] text-slate-400">
              Full Message
            </p>

            <p className="mt-2 whitespace-pre-wrap font-poppins text-sm font-medium leading-7 text-slate-700">
              {lead.message || "No full message available."}
            </p>
          </div>
        </div>
      </SectionCard>

      <div className="grid gap-5 xl:grid-cols-[1fr_380px]">
        <SectionCard
          title="Admin Notes"
          description="Internal follow-up notes for TravelEx staff."
        >
          <form onSubmit={handleAddNote} className="grid gap-3">
            <textarea
              value={noteText}
              onChange={(event) => setNoteText(event.target.value)}
              placeholder="Add follow-up note, call summary, quotation update, document reminder..."
              rows={4}
              className="w-full resize-none rounded-[5px] border border-slate-200 bg-[#F8FAFC] px-4 py-3 font-poppins text-sm font-medium text-slate-800 outline-none transition focus:border-[#00AEEF] focus:bg-white"
            />

            <button
              type="submit"
              disabled={savingNote || !noteText.trim()}
              className="w-fit rounded-[5px] bg-[#FF6B00] px-5 py-2.5 font-poppins text-sm font-semibold text-white transition hover:bg-[#00AEEF] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {savingNote ? "Adding Note..." : "Add Note"}
            </button>
          </form>

          <div className="mt-5 grid gap-3">
            {lead.notes?.length ? (
              [...lead.notes].reverse().map((note) => (
                <TimelineItem
                  key={note._id}
                  icon={<FaRegStickyNote />}
                  title={`Note by ${note.createdBy?.name || "Admin"}`}
                  subtitle={note.text}
                  meta={formatDateTime(note.createdAt)}
                />
              ))
            ) : (
              <div className="rounded-[5px] border border-dashed border-slate-200 bg-[#F8FAFC] p-5 text-center">
                <p className="font-poppins text-sm font-semibold text-slate-500">
                  No notes added yet.
                </p>
              </div>
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
                href={`tel:${lead.phone || ""}`}
                className="inline-flex items-center justify-center gap-2 rounded-[5px] bg-slate-950 px-4 py-3 text-center font-poppins text-sm font-semibold text-white transition hover:bg-[#FF6B00]"
              >
                <FaPhoneAlt />
                Call Customer
              </a>

              <a
                href={`mailto:${lead.email || ""}`}
                className="inline-flex items-center justify-center gap-2 rounded-[5px] border border-slate-200 bg-white px-4 py-3 text-center font-poppins text-sm font-semibold text-slate-700 transition hover:border-[#00AEEF] hover:text-[#00AEEF]"
              >
                <FaEnvelope />
                Send Email
              </a>

              <Link
                to={getBackUrl(lead?.serviceType)}
                className="inline-flex items-center justify-center gap-2 rounded-[5px] border border-slate-200 bg-[#F8FAFC] px-4 py-3 text-center font-poppins text-sm font-semibold text-slate-700 transition hover:border-[#FF6B00] hover:text-[#FF6B00]"
              >
                <FaArrowLeft />
                Back to Lead List
              </Link>
            </div>
          </SectionCard>

          <SectionCard title="Follow-up History">
            <div className="grid gap-3">
              {lead.followUpHistory?.length ? (
                [...lead.followUpHistory].reverse().map((item) => (
                  <TimelineItem
                    key={item._id}
                    icon={<FaClock />}
                    title={item.followUpStatus || "Follow-up Updated"}
                    subtitle={[
                      item.followUpDate
                        ? `Date: ${formatDateOnly(item.followUpDate)}`
                        : "",
                      item.followUpTime ? `Time: ${item.followUpTime}` : "",
                      item.followUpNote ? `Note: ${item.followUpNote}` : "",
                    ]
                      .filter(Boolean)
                      .join("\n")}
                    meta={`${formatDateTime(item.updatedAt)}${
                      item.updatedBy?.name
                        ? ` • Updated by ${item.updatedBy.name}`
                        : ""
                    }`}
                  />
                ))
              ) : (
                <div className="rounded-[5px] border border-dashed border-slate-200 bg-[#F8FAFC] p-5 text-center">
                  <p className="font-poppins text-sm font-semibold text-slate-500">
                    No follow-up history found.
                  </p>
                </div>
              )}
            </div>
          </SectionCard>

          <SectionCard title="Status History">
            <div className="grid gap-3">
              {lead.statusHistory?.length ? (
                [...lead.statusHistory].reverse().map((item, index) => (
                  <TimelineItem
                    key={`${item.status}-${item.changedAt}-${index}`}
                    icon={<FaCheckCircle />}
                    title={item.status}
                    meta={`${formatDateTime(item.changedAt)}${
                      item.changedBy?.name
                        ? ` • Changed by ${item.changedBy.name}`
                        : ""
                    }`}
                  />
                ))
              ) : (
                <div className="rounded-[5px] border border-dashed border-slate-200 bg-[#F8FAFC] p-5 text-center">
                  <p className="font-poppins text-sm font-semibold text-slate-500">
                    No status history found.
                  </p>
                </div>
              )}
            </div>
          </SectionCard>

          <div className="rounded-[5px] border border-orange-100 bg-orange-50 p-5">
            <div className="flex items-start gap-3">
              <FaExclamationCircle className="mt-1 shrink-0 text-[#FF6B00]" />

              <div>
                <h3 className="font-fredoka text-[22px] font-semibold text-slate-950">
                  Staff Reminder
                </h3>

                <p className="mt-1 font-poppins text-sm font-medium leading-6 text-orange-800">
                  Set a follow-up date after every call or WhatsApp conversation
                  so no lead is missed by TravelEx staff.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminLeadDetailPage