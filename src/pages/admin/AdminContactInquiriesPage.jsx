import { useEffect, useState } from "react"
import {
  FaEnvelope,
  FaPhoneAlt,
  FaSearch,
  FaUser,
} from "react-icons/fa"
import { adminApi } from "../../services/api"

const statuses = ["All", "New", "Read", "Replied", "Closed"]

const statusStyles = {
  New: "bg-orange-50 text-[#FF6B00]",
  Read: "bg-sky-50 text-[#00AEEF]",
  Replied: "bg-emerald-50 text-emerald-700",
  Closed: "bg-slate-100 text-slate-600",
}

const AdminContactInquiriesPage = () => {
  const [inquiries, setInquiries] = useState([])
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("All")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const loadInquiries = async () => {
    setLoading(true)
    setError("")

    try {
      const params = new URLSearchParams()
      params.set("limit", "50")

      if (search.trim()) {
        params.set("search", search.trim())
      }

      if (status !== "All") {
        params.set("status", status)
      }

      const data = await adminApi.getContactInquiries(`?${params.toString()}`)
      setInquiries(data.inquiries || data.contactInquiries || data.data?.inquiries || [])
    } catch (err) {
      setError(err.message || "Failed to load contact inquiries.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadInquiries()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status])

  const handleSearchSubmit = (event) => {
    event.preventDefault()
    loadInquiries()
  }

  const handleStatusChange = async (id, nextStatus) => {
    setError("")
    setSuccess("")

    try {
      await adminApi.updateContactInquiryStatus(id, nextStatus)
      setSuccess("Inquiry status updated successfully.")
      await loadInquiries()
    } catch (err) {
      setError(err.message || "Failed to update inquiry status.")
    }
  }

  return (
    <div className="grid gap-5">
      <div className="rounded-[16px] border border-slate-100 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="font-fredoka text-[28px] font-semibold text-slate-950">
              Contact Inquiries
            </h1>

            <p className="mt-1 text-sm font-medium text-slate-500">
              View and manage messages submitted through the TravelEx contact
              page.
            </p>
          </div>

          <form
            onSubmit={handleSearchSubmit}
            className="flex w-full gap-2 lg:max-w-md"
          >
            <div className="flex h-11 flex-1 items-center gap-2 rounded-[10px] border border-slate-200 bg-[#F8FAFC] px-3">
              <FaSearch className="text-xs text-slate-400" />

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search name, phone, email..."
                className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-slate-700 outline-none placeholder:text-slate-400"
              />
            </div>

            <button
              type="submit"
              className="rounded-[10px] bg-[#FF6B00] px-4 text-sm font-semibold text-white transition hover:bg-[#00AEEF]"
            >
              Search
            </button>
          </form>
        </div>

        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
          {statuses.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setStatus(item)}
              className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition ${
                status === item
                  ? "bg-[#00AEEF] text-white"
                  : "bg-[#F8FAFC] text-slate-700 hover:bg-slate-100"
              }`}
            >
              {item}
            </button>
          ))}
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

      {loading ? (
        <div className="rounded-[16px] bg-white p-6 text-sm font-semibold text-slate-600 shadow-sm">
          Loading contact inquiries...
        </div>
      ) : (
        <div className="overflow-hidden rounded-[16px] border border-slate-100 bg-white shadow-sm">
          <div className="hidden grid-cols-[1fr_1fr_1fr_1fr_1fr] border-b border-slate-100 bg-[#F8FAFC] px-5 py-3 text-xs font-bold uppercase tracking-[0.06em] text-slate-400 lg:grid">
            <span>Customer</span>
            <span>Contact</span>
            <span>Subject</span>
            <span>Status</span>
            <span>Date</span>
          </div>

          <div className="divide-y divide-slate-100">
            {inquiries.length === 0 ? (
              <div className="p-6 text-center text-sm font-semibold text-slate-500">
                No contact inquiries found.
              </div>
            ) : (
              inquiries.map((inquiry) => (
                <div
                  key={inquiry._id}
                  className="grid gap-4 px-5 py-5 lg:grid-cols-[1fr_1fr_1fr_1fr_1fr] lg:items-start"
                >
                  <div>
                    <p className="flex items-center gap-2 text-sm font-bold text-slate-950">
                      <FaUser className="text-xs text-[#00AEEF]" />
                      {inquiry.name}
                    </p>

                    <p className="mt-2 line-clamp-4 text-xs font-medium leading-5 text-slate-500 lg:hidden">
                      {inquiry.message}
                    </p>
                  </div>

                  <div className="grid gap-1">
                    <p className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                      <FaPhoneAlt className="text-[10px] text-[#FF6B00]" />
                      {inquiry.phone || "-"}
                    </p>

                    <p className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                      <FaEnvelope className="text-[10px] text-[#00AEEF]" />
                      {inquiry.email || "-"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-bold text-slate-950">
                      {inquiry.subject || "Contact Inquiry"}
                    </p>

                    <p className="mt-1 hidden line-clamp-3 text-xs font-medium leading-5 text-slate-500 lg:block">
                      {inquiry.message}
                    </p>
                  </div>

                  <div>
                    <select
                      value={inquiry.status || "New"}
                      onChange={(event) =>
                        handleStatusChange(inquiry._id, event.target.value)
                      }
                      className={`h-9 rounded-full border-0 px-3 text-xs font-bold outline-none ${
                        statusStyles[inquiry.status || "New"] ||
                        "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {statuses
                        .filter((item) => item !== "All")
                        .map((item) => (
                          <option key={item} value={item}>
                            {item}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className="text-xs font-semibold text-slate-500">
                    {inquiry.createdAt
                      ? new Date(inquiry.createdAt).toLocaleString()
                      : "-"}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminContactInquiriesPage