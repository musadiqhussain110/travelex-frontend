import { useState } from "react"
import { Navigate, useLocation, useNavigate } from "react-router-dom"

import { useAdminAuth } from "../../context/AdminAuthContext"
import logo from "../../assets/logo.webp"

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
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#F8FAFC] px-4 py-10">
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-[#00AEEF]/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-[#FF6B00]/10 blur-3xl" />

      <div className="relative w-full max-w-md rounded-[5px] border border-slate-100 bg-white px-6 pb-8 pt-[190px] shadow-[0_24px_70px_rgba(15,23,42,0.10)] sm:px-8 sm:pb-10 sm:pt-[210px]">
        <img
          src={logo}
          alt="TravelEx.pk"
          className="absolute left-1/2 top-[95px] h-20 w-auto -translate-x-1/2 object-contain sm:top-[105px] sm:h-24"
        />

        <div className="mb-7 text-center">
          <h1 className="font-fredoka text-[30px] font-semibold leading-tight text-slate-950">
            Admin Login
          </h1>

        </div>

        {error && (
          <div className="mb-4 rounded-[5px] border border-red-100 bg-red-50 px-4 py-3 font-poppins text-sm font-semibold text-red-600">
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
              placeholder="Enter email"
              className="h-12 w-full rounded-[5px] border border-slate-200 bg-[#F8FAFC] px-4 font-poppins text-sm font-semibold text-slate-800 outline-none transition focus:border-[#00AEEF] focus:bg-white focus:ring-2 focus:ring-[#00AEEF]/10"
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
              className="h-12 w-full rounded-[5px] border border-slate-200 bg-[#F8FAFC] px-4 font-poppins text-sm font-semibold text-slate-800 outline-none transition focus:border-[#00AEEF] focus:bg-white focus:ring-2 focus:ring-[#00AEEF]/10"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 h-12 rounded-[5px] bg-[#FF6B00] font-poppins text-sm font-semibold text-white shadow-[0_14px_30px_rgba(255,107,0,0.25)] transition hover:bg-[#00AEEF] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </main>
  )
}

export default AdminLoginPage