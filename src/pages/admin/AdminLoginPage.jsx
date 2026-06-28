import { useState } from "react"
import { Navigate, useLocation, useNavigate } from "react-router-dom"
import { FaLock } from "react-icons/fa"
import { useAdminAuth } from "../../context/AdminAuthContext"

const AdminLoginPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, isAuthenticated } = useAdminAuth()

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const from = location.state?.from?.pathname || "/admin/dashboard"

  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />
  }

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError("")
    setLoading(true)

    try {
      await login(formData)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.message || "Login failed.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F8FAFC] px-4 py-10">
      <div className="w-full max-w-md rounded-[18px] border border-slate-100 bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.10)] sm:p-8">
        <div className="mb-6 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#FF6B00]/10 text-[#FF6B00]">
            <FaLock />
          </div>

          <h1 className="mt-4 font-fredoka text-[30px] font-semibold text-slate-950">
            Admin Login
          </h1>

          <p className="mt-1 font-poppins text-sm font-medium text-slate-500">
            Login to manage TravelEx CRM.
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-[10px] border border-red-100 bg-red-50 px-4 py-3 font-poppins text-sm font-semibold text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid gap-4">
          <div>
            <label className="mb-1.5 block font-poppins text-sm font-semibold text-slate-700">
              Email Address
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="admin@travelex.pk"
              className="h-12 w-full rounded-[8px] border border-slate-200 bg-[#F8FAFC] px-4 font-poppins text-sm font-semibold text-slate-800 outline-none transition focus:border-[#00AEEF] focus:bg-white"
            />
          </div>

          <div>
            <label className="mb-1.5 block font-poppins text-sm font-semibold text-slate-700">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter password"
              className="h-12 w-full rounded-[8px] border border-slate-200 bg-[#F8FAFC] px-4 font-poppins text-sm font-semibold text-slate-800 outline-none transition focus:border-[#00AEEF] focus:bg-white"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 h-12 rounded-[8px] bg-[#FF6B00] font-poppins text-sm font-semibold text-white shadow-[0_14px_30px_rgba(255,107,0,0.25)] transition hover:bg-[#00AEEF] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </main>
  )
}

export default AdminLoginPage