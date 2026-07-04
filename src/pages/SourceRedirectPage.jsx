import { useEffect, useRef } from "react"
import { useNavigate, useParams, useSearchParams } from "react-router-dom"

import { captureManualLeadSource } from "../utils/leadSourceTracker"

const allowedSources = new Set([
  "facebook",
  "instagram",
  "whatsapp",
  "google",
  "tiktok",
  "youtube",
  "linkedin",
  "x",
  "email",
  "partner",
])

const defaultMediumBySource = {
  facebook: "social",
  instagram: "social",
  whatsapp: "dm",
  google: "referral",
  tiktok: "social",
  youtube: "social",
  linkedin: "social",
  x: "social",
  email: "email",
  partner: "referral",
}

const getSafeTargetPath = (destination = "") => {
  const cleanDestination = String(destination)
    .trim()
    .replace(/^\/+/, "")

  if (!cleanDestination) {
    return "/"
  }

  // Prevent protocol-style or unsafe external redirects.
  if (
    cleanDestination.includes("://") ||
    cleanDestination.startsWith("//")
  ) {
    return "/"
  }

  return `/${cleanDestination}`
}

const SourceRedirectPage = () => {
  const navigate = useNavigate()
  const params = useParams()
  const [searchParams] = useSearchParams()
  const hasRun = useRef(false)

  useEffect(() => {
    if (hasRun.current) return
    hasRun.current = true

    const source = String(params.source || "")
      .trim()
      .toLowerCase()

    const destination = params["*"] || ""

    const targetPath = getSafeTargetPath(destination)

    if (!allowedSources.has(source)) {
      navigate("/", {
        replace: true,
      })
      return
    }

    const medium =
      searchParams.get("medium") ||
      defaultMediumBySource[source] ||
      "referral"

    const campaign =
      searchParams.get("campaign") || ""

    const content =
      searchParams.get("content") || ""

    const term =
      searchParams.get("term") || ""

    const landingPage = `${window.location.origin}${targetPath}`

    captureManualLeadSource({
      source,
      medium,
      campaign,
      content,
      term,
      landingPage,
      landingPath: targetPath,
    })

    navigate(targetPath, {
      replace: true,
    })
  }, [navigate, params, searchParams])

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F8FAFC] px-4">
      <div className="rounded-[5px] border border-slate-100 bg-white px-6 py-5 text-center shadow-sm">
        <p className="font-fredoka text-[24px] font-semibold text-slate-950">
          Opening TravelEx...
        </p>

        <p className="mt-1 font-poppins text-sm font-medium text-slate-500">
          Please wait a moment.
        </p>
      </div>
    </main>
  )
}

export default SourceRedirectPage