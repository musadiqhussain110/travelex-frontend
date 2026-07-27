import { useEffect, useMemo, useState } from "react"
import { Link, useParams } from "react-router-dom"
import {
  FaArrowLeft,
  FaBullhorn,
  FaCalendarAlt,
  FaCheckCircle,
  FaEnvelope,
  FaExclamationCircle,
  FaPhoneAlt,
  FaReply,
  FaStickyNote,
  FaUser,
  FaWhatsapp,
} from "react-icons/fa"

import { adminApi } from "../../services/api"

const inquiryStatuses = ["New", "Read", "Replied", "Closed"]

const formatDateTime = (date) => {
  if (!date) return "-"

  const parsedDate = new Date(date)

  if (Number.isNaN(parsedDate.getTime())) return "-"

  return parsedDate.toLocaleString()
}

const formatValue = (value) => {
  if (value === undefined || value === null || value === "") return "-"
  return value
}

const getWhatsappUrl = (phone = "") => {
  const cleanPhone = String(phone).replace(/[^\d]/g, "")
  return cleanPhone ? `https://wa.me/${cleanPhone}` : "https://wa.me/"
}

const getStatusBadgeClass = (status = "") => {
  const classes = {
    New: "bg-orange-50 text-[#FF6B00]",
    Read: "bg-sky-50 text-[#00AEEF]",
    Replied: "bg-emerald-50 text-emerald-700",
    Closed: "bg-slate-100 text-slate-600",
  }

  return classes[status] || "bg-slate-100 text-slate-600"
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
          No tracking details available.
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

const MarketingSourceDetails = ({ inquiry }) => {
  const leadSource = inquiry?.leadSource || {}

  return (
    <SectionCard
      title="Marketing Source Tracking"
      description="UTM, referrer, landing page, and form submission tracking captured from website campaigns."
    >
      <div className="mb-4 rounded-[5px] border border-orange-100 bg-orange-50 p-4">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[5px] bg-[#FF6B00]/10 text-[#FF6B00]">
            <FaBullhorn />
          </span>

          <div className="min-w-0">
            <p className="font-poppins text-[11px] font-bold uppercase tracking-[0.08em] text-[#FF6B00]">
              Main Marketing Source
            </p>

            <h3 className="mt-1 break-words font-fredoka text-[26px] font-semibold text-slate-950">
              {formatValue(leadSource.source || "direct")}
            </h3>

            <p className="mt-1 break-words font-poppins text-sm font-semibold leading-6 text-orange-800">
              Campaign: {formatValue(leadSource.campaign)}
            </p>
          </div>
        </div>
      </div>

      <FieldGrid
        fields={[
          ["Marketing Source", leadSource.source || "direct"],
          ["Medium", leadSource.medium],
          ["Campaign", leadSource.campaign],
          ["Content", leadSource.content],
          ["Term", leadSource.term],
          ["Landing Path", leadSource.landingPath],
          ["Form Path", leadSource.formPath],
          ["Captured At", formatDateTime(leadSource.capturedAt)],
          ["Submitted At", formatDateTime(leadSource.submittedAt)],
          ["Referrer", leadSource.referrer],
          ["Landing Page", leadSource.landingPage],
          ["Form Page", leadSource.formPage],
          ["Page URL", inquiry?.pageUrl],
          ["Website Form Source", inquiry?.source],
        ]}
      />
    </SectionCard>
  )
}

const TimelineItem = ({ title, subtitle, meta, icon }) => {
  return (
    <div className="flex gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[5px] bg-[#00AEEF]/10 text-[#00AEEF]">
        {icon || <FaStickyNote />}
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

const AdminContactInquiryDetailPage = () => {
  const { id } = useParams()

  const [inquiry, setInquiry] = useState(null)
  const [selectedStatus, setSelectedStatus] = useState("New")
  const [noteText, setNoteText] = useState("")
  const [loading, setLoading] = useState(true)
  const [savingStatus, setSavingStatus] = useState(false)
  const [savingNote, setSavingNote] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const customerSummary = useMemo(() => {
    if (!inquiry) return []

    return [
      {
        icon: <FaUser />,
        label: "Customer Name",
        value: inquiry.name,
      },
      {
        icon: <FaPhoneAlt />,
        label: "Phone / WhatsApp",
        value: inquiry.phone,
      },
      {
        icon: <FaEnvelope />,
        label: "Email Address",
        value: inquiry.email || "Not provided",
      },
      {
        icon: <FaCalendarAlt />,
        label: "Submitted At",
        value: formatDateTime(inquiry.createdAt),
      },
      {
        icon: <FaStickyNote />,
        label: "Subject",
        value: inquiry.subject || "Contact Inquiry",
      },
      {
        icon: <FaCheckCircle />,
        label: "Current Status",
        value: inquiry.status || "New",
      },
    ]
  }, [inquiry])

  const loadInquiry = async () => {
    setLoading(true)
    setError("")

    try {
      const data = await adminApi.getContactInquiryById(id)

      const inquiryData =
        data.inquiry ||
        data.contactInquiry ||
        data.data?.inquiry ||
        data.data?.contactInquiry

      setInquiry(inquiryData)
      setSelectedStatus(inquiryData?.status || "New")
    } catch (err) {
      setError(err.message || "Failed to load contact inquiry.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadInquiry()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const handleStatusUpdate = async () => {
    if (!inquiry || selectedStatus === inquiry.status) return

    setSavingStatus(true)
    setError("")
    setSuccess("")

    try {
      await adminApi.updateContactInquiryStatus(inquiry._id, selectedStatus)
      setSuccess("Inquiry status updated successfully.")
      await loadInquiry()
    } catch (err) {
      setError(err.message || "Failed to update inquiry status.")
    } finally {
      setSavingStatus(false)
    }
  }

  const handleQuickStatus = async (nextStatus) => {
    if (!inquiry || inquiry.status === nextStatus) return

    setSavingStatus(true)
    setError("")
    setSuccess("")

    try {
      await adminApi.updateContactInquiryStatus(inquiry._id, nextStatus)
      setSuccess(`Inquiry marked as ${nextStatus}.`)
      await loadInquiry()
    } catch (err) {
      setError(err.message || `Failed to mark as ${nextStatus}.`)
    } finally {
      setSavingStatus(false)
    }
  }

  const handleAddNote = async (event) => {
    event.preventDefault()

    const text = noteText.trim()

    if (!text || !inquiry) return

    setSavingNote(true)
    setError("")
    setSuccess("")

    try {
      await adminApi.addContactInquiryNote(inquiry._id, text)
      setNoteText("")
      setSuccess("Note added successfully.")
      await loadInquiry()
    } catch (err) {
      setError(err.message || "Failed to add note.")
    } finally {
      setSavingNote(false)
    }
  }

  if (loading) {
    return (
      <div className="rounded-[5px] border border-slate-100 bg-white p-6 shadow-sm">
        <p className="font-fredoka text-[28px] font-semibold text-slate-950">
          Loading contact inquiry...
        </p>

        <p className="mt-1 font-poppins text-sm font-medium text-slate-500">
          Please wait while we prepare customer message details.
        </p>
      </div>
    )
  }

  if (error && !inquiry) {
    return (
      <div className="grid gap-4">
        <Link
          to="/admin/contact-inquiries"
          className="inline-flex w-fit items-center gap-2 rounded-[5px] bg-white px-4 py-2 font-poppins text-sm font-semibold text-slate-700 shadow-sm transition hover:text-[#FF6B00]"
        >
          <FaArrowLeft />
          Back to Contact Inquiries
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
                to="/admin/contact-inquiries"
                className="inline-flex items-center gap-2 font-poppins text-sm font-semibold text-white/60 transition hover:text-[#FF6B00]"
              >
                <FaArrowLeft />
                Back to Contact Inquiries
              </Link>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-[5px] px-3 py-1.5 font-poppins text-xs font-bold ${getStatusBadgeClass(
                    inquiry?.status || "New"
                  )}`}
                >
                  {inquiry?.status || "New"}
                </span>

                <span className="rounded-[5px] bg-white/10 px-3 py-1.5 font-poppins text-xs font-bold text-[#00AEEF] backdrop-blur">
                  Contact Message
                </span>

                <span className="rounded-[5px] bg-orange-50 px-3 py-1.5 font-poppins text-xs font-bold text-[#FF6B00]">
                  Source: {inquiry?.leadSource?.source || "direct"}
                </span>

                {inquiry?.leadSource?.campaign && (
                  <span className="rounded-[5px] bg-white/10 px-3 py-1.5 font-poppins text-xs font-bold text-white/80 backdrop-blur">
                    Campaign: {inquiry.leadSource.campaign}
                  </span>
                )}
              </div>

              <h1 className="mt-3 font-fredoka text-[34px] font-semibold leading-tight text-white sm:text-[46px]">
                {inquiry?.name || "Contact Inquiry"}
              </h1>

              <p className="mt-2 max-w-3xl font-poppins text-sm font-medium leading-7 text-white/70 sm:text-base">
                View customer message, contact details, CRM status, marketing
                source, internal notes, and quick communication actions.
              </p>
            </div>

            <div className="grid gap-2 sm:grid-cols-3 xl:min-w-[500px]">
              <a
                href={getWhatsappUrl(inquiry.phone)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-[5px] bg-[#25D366] px-4 py-3 font-poppins text-sm font-semibold text-white transition hover:bg-[#00AEEF]"
              >
                <FaWhatsapp />
                WhatsApp
              </a>

              <a
                href={`tel:${inquiry.phone || ""}`}
                className="inline-flex items-center justify-center gap-2 rounded-[5px] bg-white/10 px-4 py-3 font-poppins text-sm font-semibold text-white backdrop-blur transition hover:bg-[#FF6B00]"
              >
                <FaPhoneAlt />
                Call
              </a>

              {inquiry.email && (
                <a
                  href={`mailto:${inquiry.email}`}
                  className="inline-flex items-center justify-center gap-2 rounded-[5px] bg-white/10 px-4 py-3 font-poppins text-sm font-semibold text-white backdrop-blur transition hover:bg-[#00AEEF]"
                >
                  <FaEnvelope />
                  Email
                </a>
              )}
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

      {/* Customer + Status */}
      <section className="grid gap-5 xl:grid-cols-[1fr_420px]">
        <SectionCard
          title="Customer Information"
          description="Primary contact details submitted by the customer."
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
            Inquiry Status Control
          </h2>

          <p className="mt-1 font-poppins text-sm font-medium text-slate-500">
            Update this message status for admin tracking.
          </p>

          <div className="mt-4 grid gap-3">
            <select
              value={selectedStatus}
              onChange={(event) => setSelectedStatus(event.target.value)}
              className="h-12 rounded-[5px] border border-slate-200 bg-[#F8FAFC] px-3 font-poppins text-sm font-semibold text-slate-800 outline-none focus:border-[#00AEEF]"
            >
              {inquiryStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={handleStatusUpdate}
              disabled={savingStatus || selectedStatus === inquiry.status}
              className="h-12 rounded-[5px] bg-[#FF6B00] px-4 font-poppins text-sm font-semibold text-white transition hover:bg-[#00AEEF] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {savingStatus ? "Updating Status..." : "Update Status"}
            </button>
          </div>

          <div className="mt-5 grid gap-2">
            <button
              type="button"
              onClick={() => handleQuickStatus("Read")}
              disabled={savingStatus || inquiry.status === "Read"}
              className="inline-flex items-center justify-center gap-2 rounded-[5px] bg-sky-50 px-4 py-3 font-poppins text-sm font-bold text-[#00AEEF] transition hover:bg-[#00AEEF] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FaCheckCircle />
              Mark Read
            </button>

            <button
              type="button"
              onClick={() => handleQuickStatus("Replied")}
              disabled={savingStatus || inquiry.status === "Replied"}
              className="inline-flex items-center justify-center gap-2 rounded-[5px] bg-emerald-50 px-4 py-3 font-poppins text-sm font-bold text-emerald-700 transition hover:bg-emerald-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FaReply />
              Mark Replied
            </button>

            <button
              type="button"
              onClick={() => handleQuickStatus("Closed")}
              disabled={savingStatus || inquiry.status === "Closed"}
              className="inline-flex items-center justify-center gap-2 rounded-[5px] bg-slate-100 px-4 py-3 font-poppins text-sm font-bold text-slate-700 transition hover:bg-slate-950 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              Close Inquiry
            </button>
          </div>

          <div className="mt-5 grid gap-3">
            <div className="flex items-center justify-between gap-4 rounded-[5px] bg-[#F8FAFC] px-4 py-3">
              <span className="font-poppins text-xs font-bold uppercase tracking-[0.06em] text-slate-400">
                Form Source
              </span>

              <span className="text-right font-poppins text-sm font-semibold text-slate-800">
                {formatValue(inquiry.source)}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 rounded-[5px] bg-[#F8FAFC] px-4 py-3">
              <span className="font-poppins text-xs font-bold uppercase tracking-[0.06em] text-slate-400">
                Marketing Source
              </span>

              <span className="text-right font-poppins text-sm font-semibold text-slate-800">
                {inquiry.leadSource?.source || "direct"}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 rounded-[5px] bg-[#F8FAFC] px-4 py-3">
              <span className="font-poppins text-xs font-bold uppercase tracking-[0.06em] text-slate-400">
                Campaign
              </span>

              <span className="break-words text-right font-poppins text-sm font-semibold text-slate-800">
                {formatValue(inquiry.leadSource?.campaign)}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 rounded-[5px] bg-[#F8FAFC] px-4 py-3">
              <span className="font-poppins text-xs font-bold uppercase tracking-[0.06em] text-slate-400">
                Created
              </span>

              <span className="text-right font-poppins text-sm font-semibold text-slate-800">
                {formatDateTime(inquiry.createdAt)}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Message */}
      <SectionCard
        title="Customer Message"
        description="Complete message submitted through the contact form."
      >
        <div className="rounded-[5px] bg-[#F8FAFC] p-5">
          <p className="font-poppins text-[11px] font-bold uppercase tracking-[0.08em] text-slate-400">
            Subject
          </p>

          <p className="mt-1 font-poppins text-base font-bold text-slate-950">
            {inquiry.subject || "Contact Inquiry"}
          </p>

          <p className="mt-5 font-poppins text-[11px] font-bold uppercase tracking-[0.08em] text-slate-400">
            Message
          </p>

          <p className="mt-2 whitespace-pre-wrap font-poppins text-sm font-medium leading-7 text-slate-700">
            {inquiry.message || "No message available."}
          </p>
        </div>
      </SectionCard>

      {/* Marketing Tracking */}
      <MarketingSourceDetails inquiry={inquiry} />

      {/* Notes + Actions */}
      <div className="grid gap-5 xl:grid-cols-[1fr_380px]">
        <SectionCard
          title="Admin Notes"
          description="Internal notes for staff follow-up."
        >
          <form onSubmit={handleAddNote} className="grid gap-3">
            <textarea
              value={noteText}
              onChange={(event) => setNoteText(event.target.value)}
              placeholder="Add reply summary, call note, WhatsApp update..."
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
            {inquiry.notes?.length ? (
              [...inquiry.notes].reverse().map((note) => (
                <TimelineItem
                  key={note._id}
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
                href={getWhatsappUrl(inquiry.phone)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-[5px] bg-[#25D366] px-4 py-3 font-poppins text-sm font-semibold text-white transition hover:bg-[#00AEEF]"
              >
                <FaWhatsapp />
                Open WhatsApp
              </a>

              <a
                href={`tel:${inquiry.phone || ""}`}
                className="inline-flex items-center justify-center gap-2 rounded-[5px] bg-slate-950 px-4 py-3 font-poppins text-sm font-semibold text-white transition hover:bg-[#FF6B00]"
              >
                <FaPhoneAlt />
                Call Customer
              </a>

              {inquiry.email && (
                <a
                  href={`mailto:${inquiry.email}`}
                  className="inline-flex items-center justify-center gap-2 rounded-[5px] border border-slate-200 bg-white px-4 py-3 font-poppins text-sm font-semibold text-slate-700 transition hover:border-[#00AEEF] hover:text-[#00AEEF]"
                >
                  <FaEnvelope />
                  Send Email
                </a>
              )}

              <Link
                to="/admin/contact-inquiries"
                className="inline-flex items-center justify-center gap-2 rounded-[5px] border border-slate-200 bg-[#F8FAFC] px-4 py-3 font-poppins text-sm font-semibold text-slate-700 transition hover:border-[#FF6B00] hover:text-[#FF6B00]"
              >
                <FaArrowLeft />
                Back to List
              </Link>
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
                  After replying through WhatsApp, call, or email, mark this
                  inquiry as Replied and add a short note.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminContactInquiryDetailPage