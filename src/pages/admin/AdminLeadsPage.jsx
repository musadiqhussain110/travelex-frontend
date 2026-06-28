import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { FaEye, FaSearch } from "react-icons/fa"
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

const AdminLeadsPage = () => {
  const [leads, setLeads] = useState([])
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("All")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const loadLeads = async () => {
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
  }, [status])

  const handleSubmit = (event) => {
    event.preventDefault()
    loadLeads()
  }

  return (
    <div className="grid gap-5">
      <div className="rounded-[16px] border border-slate-100 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="font-fredoka text-[28px] font-semibold text-slate-950">
              Leads
            </h1>
            <p className="mt-1 text-sm font-medium text-slate-500">
              View and manage TravelEx customer inquiries.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
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

      {loading ? (
        <div className="rounded-[16px] bg-white p-6 text-sm font-semibold text-slate-600 shadow-sm">
          Loading leads...
        </div>
      ) : error ? (
        <div className="rounded-[16px] border border-red-100 bg-red-50 p-6 text-sm font-semibold text-red-600">
          {error}
        </div>
      ) : (
        <div className="overflow-hidden rounded-[16px] border border-slate-100 bg-white shadow-sm">
          <div className="hidden grid-cols-[1.2fr_1fr_1fr_1fr_0.7fr] border-b border-slate-100 bg-[#F8FAFC] px-5 py-3 text-xs font-bold uppercase tracking-[0.06em] text-slate-400 lg:grid">
            <span>Customer</span>
            <span>Service</span>
            <span>Status</span>
            <span>Date</span>
            <span>Action</span>
          </div>

          <div className="divide-y divide-slate-100">
            {leads.length === 0 ? (
              <div className="p-6 text-center text-sm font-semibold text-slate-500">
                No leads found.
              </div>
            ) : (
              leads.map((lead) => (
                <div
                  key={lead._id}
                  className="grid gap-3 px-5 py-4 lg:grid-cols-[1.2fr_1fr_1fr_1fr_0.7fr] lg:items-center"
                >
                  <div>
                    <p className="text-sm font-bold text-slate-950">
                      {lead.name}
                    </p>
                    <p className="mt-0.5 text-xs font-medium text-slate-500">
                      {lead.phone}
                    </p>
                    <p className="text-xs font-medium text-slate-500">
                      {lead.email}
                    </p>
                  </div>

                  <div>
                    <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-bold capitalize text-[#00AEEF]">
                      {lead.serviceType}
                    </span>
                  </div>

                  <div>
                    <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-[#FF6B00]">
                      {lead.status}
                    </span>
                  </div>

                  <div className="text-xs font-semibold text-slate-500">
                    {lead.createdAt
                      ? new Date(lead.createdAt).toLocaleString()
                      : "-"}
                  </div>

                  <div>
                    <Link
                      to={`/admin/leads/${lead._id}`}
                      className="inline-flex items-center gap-2 rounded-[8px] bg-slate-950 px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#FF6B00]"
                    >
                      <FaEye />
                      View
                    </Link>
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

export default AdminLeadsPage