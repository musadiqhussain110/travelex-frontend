const STORAGE_KEY = "travelex_lead_source"

const safeJsonParse = (value) => {
  try {
    return JSON.parse(value)
  } catch {
    return null
  }
}

const detectSourceFromReferrer = (referrer = "") => {
  const value = referrer.toLowerCase()

  if (value.includes("instagram")) return "instagram"
  if (value.includes("facebook") || value.includes("fb.com")) return "facebook"
  if (value.includes("tiktok")) return "tiktok"
  if (value.includes("youtube")) return "youtube"
  if (value.includes("google")) return "google"
  if (value.includes("whatsapp")) return "whatsapp"

  return referrer ? "referral" : "direct"
}

export const captureLeadSource = () => {
  if (typeof window === "undefined") return null

  const params = new URLSearchParams(window.location.search)

  const utmSource = params.get("utm_source") || ""
  const utmMedium = params.get("utm_medium") || ""
  const utmCampaign = params.get("utm_campaign") || ""
  const utmContent = params.get("utm_content") || ""
  const utmTerm = params.get("utm_term") || ""

  const hasUtm =
    utmSource || utmMedium || utmCampaign || utmContent || utmTerm

  const existingSource = safeJsonParse(localStorage.getItem(STORAGE_KEY))

  const sourceData = {
    source: utmSource || detectSourceFromReferrer(document.referrer),
    medium: utmMedium || "",
    campaign: utmCampaign || "",
    content: utmContent || "",
    term: utmTerm || "",
    referrer: document.referrer || "",
    landingPage: window.location.href,
    landingPath: window.location.pathname,
    capturedAt: new Date().toISOString(),
  }

  if (!existingSource || hasUtm) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sourceData))
    return sourceData
  }

  return existingSource
}

export const getLeadSource = () => {
  if (typeof window === "undefined") return null

  const storedSource =
    safeJsonParse(localStorage.getItem(STORAGE_KEY)) || captureLeadSource()

  return {
    ...storedSource,
    formPage: window.location.href,
    formPath: window.location.pathname,
    submittedAt: new Date().toISOString(),
  }
}