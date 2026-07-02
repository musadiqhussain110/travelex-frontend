import {
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
  FaExchangeAlt,
  FaFileAlt,
  FaStickyNote,
  FaUserCheck,
  FaUserPlus,
} from "react-icons/fa"

const formatDateTime = (date) => {
  if (!date) return "-"
  return new Date(date).toLocaleString()
}

const getEventStyle = (type = "") => {
  const styles = {
    submitted: {
      icon: <FaFileAlt />,
      iconClass: "bg-[#00AEEF]/10 text-[#00AEEF]",
      lineClass: "bg-[#00AEEF]",
    },
    status: {
      icon: <FaExchangeAlt />,
      iconClass: "bg-orange-50 text-[#FF6B00]",
      lineClass: "bg-[#FF6B00]",
    },
    note: {
      icon: <FaStickyNote />,
      iconClass: "bg-slate-100 text-slate-700",
      lineClass: "bg-slate-300",
    },
    followUpScheduled: {
      icon: <FaCalendarAlt />,
      iconClass: "bg-purple-50 text-purple-700",
      lineClass: "bg-purple-500",
    },
    followUpCompleted: {
      icon: <FaCheckCircle />,
      iconClass: "bg-emerald-50 text-emerald-700",
      lineClass: "bg-emerald-500",
    },
    followUpCancelled: {
      icon: <FaClock />,
      iconClass: "bg-red-50 text-red-700",
      lineClass: "bg-red-500",
    },
    assigned: {
      icon: <FaUserCheck />,
      iconClass: "bg-sky-50 text-[#00AEEF]",
      lineClass: "bg-[#00AEEF]",
    },
  }

  return (
    styles[type] || {
      icon: <FaUserPlus />,
      iconClass: "bg-slate-100 text-slate-600",
      lineClass: "bg-slate-300",
    }
  )
}

const buildTimelineEvents = (lead = {}) => {
  const events = []

  if (lead.createdAt) {
    events.push({
      id: `submitted-${lead._id}`,
      type: "submitted",
      title: "Lead Submitted",
      description: `${lead.name || "Customer"} submitted a ${lead.serviceType || "general"} inquiry.`,
      meta: "Website Lead",
      date: lead.createdAt,
    })
  }

  if (lead.assignedTo) {
    events.push({
      id: `assigned-${lead.assignedTo?._id || lead._id}`,
      type: "assigned",
      title: "Lead Assigned",
      description: `Assigned to ${lead.assignedTo?.name || "admin"}.`,
      meta: lead.assignedTo?.email || "Assigned Admin",
      date: lead.updatedAt || lead.createdAt,
    })
  }

  if (Array.isArray(lead.statusHistory)) {
    lead.statusHistory.forEach((item, index) => {
      events.push({
        id: `status-${item._id || index}`,
        type: "status",
        title: `Status changed to ${item.status}`,
        description: item.changedBy?.name
          ? `Updated by ${item.changedBy.name}.`
          : "Status updated in CRM.",
        meta: "Status Update",
        date: item.changedAt || item.createdAt,
      })
    })
  }

  if (Array.isArray(lead.notes)) {
    lead.notes.forEach((note, index) => {
      events.push({
        id: `note-${note._id || index}`,
        type: "note",
        title: "Note Added",
        description: note.text || "Admin added a note.",
        meta: note.createdBy?.name ? `By ${note.createdBy.name}` : "Admin Note",
        date: note.createdAt,
      })
    })
  }

  if (Array.isArray(lead.followUpHistory)) {
    lead.followUpHistory.forEach((item, index) => {
      const status = item.followUpStatus || "Scheduled"

      const type =
        status === "Completed"
          ? "followUpCompleted"
          : status === "Cancelled"
            ? "followUpCancelled"
            : "followUpScheduled"

      events.push({
        id: `follow-up-${item._id || index}`,
        type,
        title:
          status === "Completed"
            ? "Follow-up Completed"
            : status === "Cancelled"
              ? "Follow-up Cancelled"
              : "Follow-up Scheduled",
        description:
          item.followUpNote ||
          `Follow-up ${status.toLowerCase()} for this customer.`,
        meta: [
          item.followUpDate ? formatDateTime(item.followUpDate) : "",
          item.followUpTime || "",
          item.updatedBy?.name ? `By ${item.updatedBy.name}` : "",
        ]
          .filter(Boolean)
          .join(" • "),
        date: item.updatedAt || item.followUpDate,
      })
    })
  }

  return events
    .filter((event) => event.date)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
}

const Customer360Timeline = ({ lead }) => {
  const timeline = buildTimelineEvents(lead)

  return (
    <div className="rounded-[5px] border border-slate-100 bg-white p-5 shadow-sm">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-poppins text-[10px] font-bold uppercase tracking-[0.12em] text-[#00AEEF]">
            Customer 360
          </p>

          <h2 className="mt-1 font-fredoka text-[30px] font-semibold leading-tight text-slate-950">
            Activity Timeline
          </h2>

          <p className="mt-1 font-poppins text-sm font-medium leading-6 text-slate-500">
            Complete customer journey from inquiry submission to status updates,
            notes, follow-ups, and assignment.
          </p>
        </div>

        <span className="w-fit rounded-[5px] bg-[#F8FAFC] px-3 py-2 font-poppins text-xs font-bold text-slate-500">
          {timeline.length} event{timeline.length === 1 ? "" : "s"}
        </span>
      </div>

      {timeline.length === 0 ? (
        <div className="rounded-[5px] border border-dashed border-slate-200 bg-[#F8FAFC] p-6 text-center">
          <FaClock className="mx-auto text-2xl text-slate-300" />

          <p className="mt-3 font-poppins text-sm font-semibold text-slate-500">
            No timeline activity found yet.
          </p>
        </div>
      ) : (
        <div className="relative">
          <div className="absolute left-[18px] top-2 h-[calc(100%-16px)] w-px bg-slate-200" />

          <div className="grid gap-4">
            {timeline.map((event, index) => {
              const style = getEventStyle(event.type)

              return (
                <div key={event.id} className="relative flex gap-4">
                  <div className="relative z-10">
                    <span
                      className={`flex h-9 w-9 items-center justify-center rounded-[5px] ${style.iconClass}`}
                    >
                      {style.icon}
                    </span>

                    {index !== timeline.length - 1 && (
                      <span
                        className={`mx-auto mt-2 block h-8 w-0.5 rounded-full ${style.lineClass}`}
                      />
                    )}
                  </div>

                  <div className="min-w-0 flex-1 rounded-[5px] border border-slate-100 bg-[#F8FAFC] p-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <h3 className="font-fredoka text-[22px] font-semibold leading-tight text-slate-950">
                          {event.title}
                        </h3>

                        <p className="mt-1 whitespace-pre-wrap font-poppins text-sm font-medium leading-6 text-slate-600">
                          {event.description}
                        </p>

                        {event.meta && (
                          <p className="mt-2 font-poppins text-xs font-bold uppercase tracking-[0.05em] text-slate-400">
                            {event.meta}
                          </p>
                        )}
                      </div>

                      <span className="shrink-0 rounded-[5px] bg-white px-3 py-1 font-poppins text-[11px] font-bold text-slate-500">
                        {formatDateTime(event.date)}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default Customer360Timeline