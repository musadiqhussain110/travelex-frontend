import { FaFacebookF, FaGoogle, FaTimes, FaKey } from "react-icons/fa"
import { useNavigate } from "react-router-dom"

const AuthModal = ({ isOpen, onClose, bookingPath }) => {
  const navigate = useNavigate()

  if (!isOpen) return null

const continueBooking = () => {
  localStorage.setItem("travelexUserLoggedIn", "true")
  onClose()
  navigate(bookingPath)
}
  return (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-black/60 px-4 py-6">
      <div className="relative w-full max-w-2xl rounded-[1.5rem] bg-white p-6 shadow-2xl sm:p-8">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 text-2xl text-slate-900 transition hover:text-[#FF6B00]"
          aria-label="Close login modal"
        >
          <FaTimes />
        </button>

        <div className="text-center">
          <h2 className="text-3xl font-medium text-slate-950 sm:text-4xl">
            Welcome to TravelEx
          </h2>

          <p className="mt-2 text-sm font-semibold text-slate-500">
            Please login or sign up to continue your booking
          </p>
        </div>

        <div className="mt-8 grid gap-5">
          <div>
            <label className="text-sm font-black text-slate-950">
              Phone Number
            </label>

            <div className="mt-2 flex h-14 items-center rounded-2xl border border-slate-200 bg-slate-50 px-4">
              <span className="mr-3">🇵🇰 +92</span>
              <input
                type="tel"
                placeholder="Enter phone number"
                className="min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-black text-slate-950">
              Enter Password
            </label>

            <div className="mt-2 flex h-14 items-center rounded-2xl border border-slate-200 bg-slate-50 px-4">
              <FaKey className="mr-3 text-slate-400" />
              <input
                type="password"
                placeholder="Enter Password"
                className="min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none"
              />
            </div>
          </div>

          <div className="text-right">
            <button className="text-sm font-black text-[#00AEEF]">
              Forgot Password?
            </button>
          </div>

          <button
            type="button"
            onClick={continueBooking}
            className="rounded-2xl bg-[#00AEEF] px-6 py-4 text-sm font-black text-white transition hover:bg-[#FF6B00]"
          >
            Sign in
          </button>

          <div className="text-center text-sm font-semibold text-slate-400">
            or continue with
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={continueBooking}
              className="flex items-center justify-center gap-3 rounded-2xl border border-slate-200 px-5 py-4 text-sm font-black text-slate-900 transition hover:border-[#00AEEF] hover:text-[#00AEEF]"
            >
              <FaGoogle />
              Sign In with Google
            </button>

            <button
              type="button"
              onClick={continueBooking}
              className="flex items-center justify-center gap-3 rounded-2xl border border-slate-200 px-5 py-4 text-sm font-black text-slate-900 transition hover:border-[#00AEEF] hover:text-[#00AEEF]"
            >
              <FaFacebookF />
              Sign In with Facebook
            </button>
          </div>

          <p className="text-center text-sm font-semibold text-slate-500">
            Don&apos;t have an account?{" "}
            <button
              type="button"
              onClick={continueBooking}
              className="font-black text-[#00AEEF]"
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default AuthModal