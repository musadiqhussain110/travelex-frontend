import { Navigate, useLocation } from "react-router-dom"
import { useAdminAuth } from "../../context/AdminAuthContext"

const ProtectedAdminRoute = ({ children }) => {
  const location = useLocation()
  const { admin, token, loading } = useAdminAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] font-poppins">
        <div className="rounded-[5px] bg-white px-6 py-5 text-center shadow-sm">
          <p className="font-fredoka text-xl font-semibold text-slate-950">
            Loading Admin...
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Please wait while we verify your session.
          </p>
        </div>
      </div>
    )
  }

  if (!admin || !token) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />
  }

  return children
}

export default ProtectedAdminRoute