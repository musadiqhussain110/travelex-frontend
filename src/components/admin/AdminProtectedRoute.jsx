import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useAdminAuth } from "../../context/AdminAuthContext"

const AdminProtectedRoute = () => {
  const { loading, isAuthenticated } = useAdminAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC]">
        <div className="rounded-[12px] bg-white px-6 py-5 text-center shadow-[0_16px_40px_rgba(15,23,42,0.08)]">
          <p className="font-poppins text-sm font-semibold text-slate-700">
            Checking admin session...
          </p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />
  }

  return <Outlet />
}

export default AdminProtectedRoute