import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import {
  FaArrowLeft,
  FaCalendarAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaStickyNote,
  FaUser,
  FaUsers,
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

const formatDate = (date) => {
  if (!date) return "-"
  return new Date(date).toLocaleString()
}

const formatService = (serviceType = "") => {
  const labels = {
    umrah: "Umrah Package",
    tour: "International Tour",
    visa: "Visa Assistance",
    hotel: "Hotel Booking",
    carRental: "Car Rental / Transport",
    contact: "Contact Inquiry",
    general: "General Inquiry",
  }

  return labels[serviceType] || serviceType || "-"
}

const InfoCard = ({ icon, label, value }) => {
  return (
    <div className="rounded-[14px] border border-slate-100 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[#00AEEF]/10 text-[#00AEEF]">
          {icon}
        </span>

        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-[0.05em] text-slate-400">
            {label}
          </p>
          <p className="mt-1 break-words text-sm font-semibold text-slate-900">
            {value || "-"}
          </p>
        </div>
      </div>
    </div>
  )
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
      <div className="rounded-[16px] bg-white p-6 text-sm font-semibold text-slate-600 shadow-sm">
        Loading lead details...
      </div>
    )
  }

  if (error && !lead) {
    return (
      <div className="grid gap-4">
        <Link
          to="/admin/leads"
          className="inline-flex w-fit items-center gap-2 rounded-[10px] bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:text-[#FF6B00]"
        >
          <FaArrowLeft />
          Back to Leads
        </Link>

        <div className="rounded-[16px] border border-red-100 bg-red-50 p-6 text-sm font-semibold text-red-600">
          {error}
        </div>
      </div>
    )
  }

  const travelers = lead?.travelers || {}

  return (
    <div className="grid gap-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <Link
            to="/admin/leads"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-[#FF6B00]"
          >
            <FaArrowLeft />
            Back to Leads
          </Link>

          <h1 className="mt-3 font-fredoka text-[30px] font-semibold text-slate-950">
            Lead Details
          </h1>

          <p className="mt-1 text-sm font-medium text-slate-500">
            View customer information, update CRM status, and add follow-up
            notes.
          </p>
        </div>

        <div className="rounded-[14px] border border-slate-100 bg-white p-4 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-[0.05em] text-slate-400">
            Current Status
          </p>

          <div className="mt-2 flex flex-col gap-2 sm:flex-row">
            <select
              value={selectedStatus}
              onChange={(event) => setSelectedStatus(event.target.value)}
              className="h-11 rounded-[10px] border border-slate-200 bg-[#F8FAFC] px-3 text-sm font-semibold text-slate-800 outline-none focus:border-[#00AEEF]"
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
              className="h-11 rounded-[10px] bg-[#FF6B00] px-4 text-sm font-semibold text-white transition hover:bg-[#00AEEF] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {savingStatus ? "Updating..." : "Update"}
            </button>
          </div>
        </div>
      </div>

      {success && (
        <div className="rounded-[14px] border border-emerald-100 bg-emerald-50 px-5 py-4 text-sm font-semibold text-emerald-700">
          {success}
        </div>
      )}

      {error && (
        <div className="rounded-[14px] border border-red-100 bg-red-50 px-5 py-4 text-sm font-semibold text-red-600">
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <InfoCard icon={<FaUser />} label="Customer Name" value={lead.name} />
        <InfoCard icon={<FaPhoneAlt />} label="Phone" value={lead.phone} />
        <InfoCard icon={<FaEnvelope />} label="Email" value={lead.email} />
        <InfoCard
          icon={<FaCalendarAlt />}
          label="Submitted At"
          value={formatDate(lead.createdAt)}
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="grid gap-5">
          <div className="rounded-[16px] border border-slate-100 bg-white p-5 shadow-sm">
            <h2 className="font-fredoka text-[24px] font-semibold text-slate-950">
              Travel Request
            </h2>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <InfoCard
                icon={<FaStickyNote />}
                label="Service"
                value={formatService(lead.serviceType)}
              />

              <InfoCard
                icon={<FaMapMarkerAlt />}
                label="Destination"
                value={lead.destination}
              />

              <InfoCard
                icon={<FaCalendarAlt />}
                label="Travel Date"
                value={
                  lead.travelDate
                    ? new Date(lead.travelDate).toLocaleDateString()
                    : "-"
                }
              />

              <InfoCard
                icon={<FaUsers />}
                label="Travelers"
                value={`${travelers.adults || 1} adult(s), ${
                  travelers.children || 0
                } child(ren), ${travelers.infants || 0} infant(s)`}
              />

              <InfoCard label="Budget" value={lead.budget} />
              <InfoCard label="Preferred Hotel" value={lead.preferredHotel} />
              <InfoCard label="Makkah Nights" value={lead.makkahNights} />
              <InfoCard label="Madinah Nights" value={lead.madinahNights} />
              <InfoCard label="Pickup Location" value={lead.pickupLocation} />
              <InfoCard label="Drop-off Location" value={lead.dropoffLocation} />
              <InfoCard label="Source" value={lead.source} />
              <InfoCard label="Priority" value={lead.priority} />
            </div>

            <div className="mt-4 rounded-[14px] bg-[#F8FAFC] p-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.05em] text-slate-400">
                Message
              </p>
              <p className="mt-2 whitespace-pre-wrap text-sm font-medium leading-7 text-slate-700">
                {lead.message || "No message added."}
              </p>
            </div>
          </div>

          <div className="rounded-[16px] border border-slate-100 bg-white p-5 shadow-sm">
            <h2 className="font-fredoka text-[24px] font-semibold text-slate-950">
              Admin Notes
            </h2>

            <form onSubmit={handleAddNote} className="mt-4 grid gap-3">
              <textarea
                value={noteText}
                onChange={(event) => setNoteText(event.target.value)}
                placeholder="Add follow-up note..."
                rows={4}
                className="w-full resize-none rounded-[12px] border border-slate-200 bg-[#F8FAFC] px-4 py-3 text-sm font-medium text-slate-800 outline-none transition focus:border-[#00AEEF] focus:bg-white"
              />

              <button
                type="submit"
                disabled={savingNote || !noteText.trim()}
                className="w-fit rounded-[10px] bg-[#FF6B00] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#00AEEF] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {savingNote ? "Adding..." : "Add Note"}
              </button>
            </form>

            <div className="mt-5 grid gap-3">
              {lead.notes?.length ? (
                [...lead.notes].reverse().map((note) => (
                  <div
                    key={note._id}
                    className="rounded-[12px] border border-slate-100 bg-[#F8FAFC] p-4"
                  >
                    <p className="whitespace-pre-wrap text-sm font-medium leading-6 text-slate-700">
                      {note.text}
                    </p>

                    <p className="mt-3 text-xs font-semibold text-slate-400">
                      By {note.createdBy?.name || "Admin"} •{" "}
                      {formatDate(note.createdAt)}
                    </p>
                  </div>
                ))
              ) : (
                <p className="rounded-[12px] bg-[#F8FAFC] p-4 text-sm font-semibold text-slate-500">
                  No notes added yet.
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-5">
          <div className="rounded-[16px] border border-slate-100 bg-white p-5 shadow-sm">
            <h2 className="font-fredoka text-[24px] font-semibold text-slate-950">
              Status History
            </h2>

            <div className="mt-4 grid gap-3">
              {lead.statusHistory?.length ? (
                [...lead.statusHistory].reverse().map((item, index) => (
                  <div
                    key={`${item.status}-${item.changedAt}-${index}`}
                    className="rounded-[12px] bg-[#F8FAFC] p-4"
                  >
                    <p className="text-sm font-bold text-slate-950">
                      {item.status}
                    </p>

                    <p className="mt-1 text-xs font-semibold text-slate-500">
                      {formatDate(item.changedAt)}
                    </p>

                    {item.changedBy && (
                      <p className="mt-1 text-xs font-semibold text-slate-400">
                        Changed by {item.changedBy.name}
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <p className="rounded-[12px] bg-[#F8FAFC] p-4 text-sm font-semibold text-slate-500">
                  No status history found.
                </p>
              )}
            </div>
          </div>

          <div className="rounded-[16px] border border-slate-100 bg-white p-5 shadow-sm">
            <h2 className="font-fredoka text-[24px] font-semibold text-slate-950">
              Quick Actions
            </h2>

            <div className="mt-4 grid gap-3">
              <a
                href={`https://wa.me/${String(lead.phone).replace(
                  /[^\d]/g,
                  ""
                )}`}
                target="_blank"
                rel="noreferrer"
                className="rounded-[10px] bg-[#25D366] px-4 py-3 text-center text-sm font-semibold text-white transition hover:opacity-90"
              >
                Open WhatsApp Chat
              </a>

              <a
                href={`tel:${lead.phone}`}
                className="rounded-[10px] bg-slate-950 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-[#FF6B00]"
              >
                Call Customer
              </a>

              <a
                href={`mailto:${lead.email}`}
                className="rounded-[10px] border border-slate-200 bg-white px-4 py-3 text-center text-sm font-semibold text-slate-700 transition hover:border-[#00AEEF] hover:text-[#00AEEF]"
              >
                Send Email
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminLeadDetailPage