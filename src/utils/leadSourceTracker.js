const CURRENT_VISIT_KEY = "travelex_attribution_v1"

const LEGACY_LOCAL_STORAGE_KEYS = [
  "travelex_lead_source",
]

const LEGACY_SESSION_STORAGE_KEYS = [
  "travelex_lead_source",
  "travelex_current_visit_source",
  "travelex_visit_source_v4",
]

// Source captured for the currently loaded React document.
// Internal SPA navigation keeps this value.
let currentDocumentSource = null
let hasCapturedCurrentDocument = false

const safeJsonParse = (value) => {
  try {
    return JSON.parse(value)
  } catch {
    return null
  }
}

const normalizeValue = (value = "") => {
  return String(value).trim()
}

const normalizeSource = (value = "") => {
  return normalizeValue(value).toLowerCase()
}

const normalizeHostname = (hostname = "") => {
  return String(hostname)
    .trim()
    .toLowerCase()
    .replace(/^www\./, "")
}

const isSameSite = (hostA = "", hostB = "") => {
  const a = normalizeHostname(hostA)
  const b = normalizeHostname(hostB)

  if (!a || !b) return false
  if (a === b) return true

  return a.endsWith(`.${b}`) || b.endsWith(`.${a}`)
}

const clearLegacyTrackingStorage = () => {
  if (typeof window === "undefined") return

  try {
    LEGACY_LOCAL_STORAGE_KEYS.forEach((key) => {
      localStorage.removeItem(key)
    })
  } catch {
    // Ignore blocked localStorage access.
  }

  try {
    LEGACY_SESSION_STORAGE_KEYS.forEach((key) => {
      sessionStorage.removeItem(key)
    })
  } catch {
    // Ignore blocked sessionStorage access.
  }
}

const getStoredSource = () => {
  if (typeof window === "undefined") return null

  try {
    return safeJsonParse(
      sessionStorage.getItem(CURRENT_VISIT_KEY)
    )
  } catch {
    return null
  }
}

const saveSource = (sourceData) => {
  currentDocumentSource = sourceData

  if (typeof window !== "undefined") {
    try {
      sessionStorage.setItem(
        CURRENT_VISIT_KEY,
        JSON.stringify(sourceData)
      )
    } catch {
      // In-memory attribution still works.
    }
  }

  return sourceData
}

const getNavigationType = () => {
  if (typeof window === "undefined") return "navigate"

  try {
    const entries = performance.getEntriesByType("navigation")
    return entries?.[0]?.type || "navigate"
  } catch {
    return "navigate"
  }
}

const isFacebookHost = (host = "") => {
  return (
    host === "facebook.com" ||
    host.endsWith(".facebook.com") ||
    host === "fb.com" ||
    host.endsWith(".fb.com") ||
    host === "fb.me"
  )
}

const isInstagramHost = (host = "") => {
  return (
    host === "instagram.com" ||
    host.endsWith(".instagram.com")
  )
}

const isTikTokHost = (host = "") => {
  return (
    host === "tiktok.com" ||
    host.endsWith(".tiktok.com")
  )
}

const isYouTubeHost = (host = "") => {
  return (
    host === "youtube.com" ||
    host.endsWith(".youtube.com") ||
    host === "youtu.be"
  )
}

const isLinkedInHost = (host = "") => {
  return (
    host === "linkedin.com" ||
    host.endsWith(".linkedin.com")
  )
}

const isXHost = (host = "") => {
  return (
    host === "x.com" ||
    host.endsWith(".x.com") ||
    host === "twitter.com" ||
    host.endsWith(".twitter.com") ||
    host === "t.co"
  )
}

const isGoogleHost = (host = "") => {
  return (
    host === "google.com" ||
    host.endsWith(".google.com") ||
    host.startsWith("google.") ||
    host.includes(".google.")
  )
}

const isBingHost = (host = "") => {
  return (
    host === "bing.com" ||
    host.endsWith(".bing.com")
  )
}

const isWhatsappHost = (host = "") => {
  return (
    host === "whatsapp.com" ||
    host.endsWith(".whatsapp.com") ||
    host === "wa.me"
  )
}

const getReferrerAttribution = (referrer = "") => {
  if (!referrer) {
    return {
      type: "none",
      source: "",
      medium: "",
    }
  }

  try {
    const referrerUrl = new URL(referrer)
    const referrerHost = normalizeHostname(
      referrerUrl.hostname
    )

    const currentHost =
      typeof window !== "undefined"
        ? normalizeHostname(window.location.hostname)
        : ""

    if (isSameSite(referrerHost, currentHost)) {
      return {
        type: "internal",
        source: "",
        medium: "",
      }
    }

    if (isFacebookHost(referrerHost)) {
      return {
        type: "external",
        source: "facebook",
        medium: "social",
      }
    }

    if (isInstagramHost(referrerHost)) {
      return {
        type: "external",
        source: "instagram",
        medium: "social",
      }
    }

    if (isTikTokHost(referrerHost)) {
      return {
        type: "external",
        source: "tiktok",
        medium: "social",
      }
    }

    if (isYouTubeHost(referrerHost)) {
      return {
        type: "external",
        source: "youtube",
        medium: "social",
      }
    }

    if (isLinkedInHost(referrerHost)) {
      return {
        type: "external",
        source: "linkedin",
        medium: "social",
      }
    }

    if (isXHost(referrerHost)) {
      return {
        type: "external",
        source: "x",
        medium: "social",
      }
    }

    if (isGoogleHost(referrerHost)) {
      return {
        type: "external",
        source: "google",
        medium: "organic",
      }
    }

    if (isBingHost(referrerHost)) {
      return {
        type: "external",
        source: "bing",
        medium: "organic",
      }
    }

    if (isWhatsappHost(referrerHost)) {
      return {
        type: "external",
        source: "whatsapp",
        medium: "referral",
      }
    }

    return {
      type: "external",
      source: "referral",
      medium: "referral",
    }
  } catch {
    return {
      type: "none",
      source: "",
      medium: "",
    }
  }
}

const getClickIdAttribution = (
  params,
  referrerAttribution
) => {
  if (
    params.get("gclid") ||
    params.get("dclid") ||
    params.get("gbraid") ||
    params.get("wbraid")
  ) {
    return {
      source: "google",
      medium: "paid",
    }
  }

  if (params.get("fbclid")) {
    // fbclid is a Meta identifier.
    // Referrer helps distinguish Facebook from Instagram.
    if (
      referrerAttribution?.source === "facebook" ||
      referrerAttribution?.source === "instagram"
    ) {
      return {
        source: referrerAttribution.source,
        medium: "social",
      }
    }

    return {
      source: "meta",
      medium: "social",
    }
  }

  if (params.get("ttclid")) {
    return {
      source: "tiktok",
      medium: "paid_social",
    }
  }

  if (params.get("msclkid")) {
    return {
      source: "bing",
      medium: "paid",
    }
  }

  if (params.get("li_fat_id")) {
    return {
      source: "linkedin",
      medium: "paid_social",
    }
  }

  if (params.get("twclid")) {
    return {
      source: "x",
      medium: "social",
    }
  }

  return null
}

const createSourceData = ({
  source,
  medium = "",
  campaign = "",
  content = "",
  term = "",
  referrer = "",
  landingPage,
  landingPath,
}) => {
  return {
    source: normalizeSource(source) || "direct",
    medium: normalizeSource(medium),
    campaign: normalizeValue(campaign),
    content: normalizeValue(content),
    term: normalizeValue(term),
    referrer: normalizeValue(referrer),

    landingPage:
      landingPage ||
      (typeof window !== "undefined"
        ? window.location.href
        : ""),

    landingPath:
      landingPath ||
      (typeof window !== "undefined"
        ? window.location.pathname
        : ""),

    capturedAt: new Date().toISOString(),
  }
}

export const captureManualLeadSource = ({
  source,
  medium = "",
  campaign = "",
  content = "",
  term = "",
  landingPage = "",
  landingPath = "",
} = {}) => {
  if (typeof window === "undefined") return null

  clearLegacyTrackingStorage()

  const normalizedSource = normalizeSource(source)

  if (!normalizedSource) {
    return captureLeadSource()
  }

  const sourceData = createSourceData({
    source: normalizedSource,
    medium,
    campaign,
    content,
    term,
    referrer: document.referrer || "",
    landingPage:
      landingPage || window.location.href,
    landingPath:
      landingPath || window.location.pathname,
  })

  hasCapturedCurrentDocument = true

  return saveSource(sourceData)
}

export const captureLeadSource = () => {
  if (typeof window === "undefined") return null

  clearLegacyTrackingStorage()

  const params = new URLSearchParams(
    window.location.search
  )

  const utmSource = normalizeSource(
    params.get("utm_source") || ""
  )

  const utmMedium = normalizeSource(
    params.get("utm_medium") || ""
  )

  const utmCampaign = normalizeValue(
    params.get("utm_campaign") || ""
  )

  const utmContent = normalizeValue(
    params.get("utm_content") || ""
  )

  const utmTerm = normalizeValue(
    params.get("utm_term") || ""
  )

  const hasUtm = Boolean(
    utmSource ||
      utmMedium ||
      utmCampaign ||
      utmContent ||
      utmTerm
  )

  /*
  |--------------------------------------------------------------------------
  | 1. UTM parameters
  |--------------------------------------------------------------------------
  | Always replace previous attribution.
  */
  if (hasUtm) {
    const sourceData = createSourceData({
      source: utmSource || "direct",
      medium: utmMedium,
      campaign: utmCampaign,
      content: utmContent,
      term: utmTerm,
      referrer: document.referrer || "",
    })

    hasCapturedCurrentDocument = true
    return saveSource(sourceData)
  }

  const referrerAttribution = getReferrerAttribution(
    document.referrer || ""
  )

  /*
  |--------------------------------------------------------------------------
  | 2. Platform click IDs
  |--------------------------------------------------------------------------
  */
  const clickIdAttribution = getClickIdAttribution(
    params,
    referrerAttribution
  )

  if (clickIdAttribution) {
    const sourceData = createSourceData({
      source: clickIdAttribution.source,
      medium: clickIdAttribution.medium,
      referrer: document.referrer || "",
    })

    hasCapturedCurrentDocument = true
    return saveSource(sourceData)
  }

  /*
  |--------------------------------------------------------------------------
  | 3. SPA route protection
  |--------------------------------------------------------------------------
  | After source has been captured for this document:
  |
  | / → /tickets → /visa-application
  |
  | keep the current attribution.
  */
  if (
    hasCapturedCurrentDocument &&
    currentDocumentSource
  ) {
    return currentDocumentSource
  }

  /*
  |--------------------------------------------------------------------------
  | 4. External referrer
  |--------------------------------------------------------------------------
  */
  if (referrerAttribution.type === "external") {
    const sourceData = createSourceData({
      source: referrerAttribution.source,
      medium: referrerAttribution.medium,
      referrer: document.referrer || "",
    })

    hasCapturedCurrentDocument = true
    return saveSource(sourceData)
  }

  const storedSource = getStoredSource()
  const navigationType = getNavigationType()

  /*
  |--------------------------------------------------------------------------
  | 5. Full-page internal TravelEx navigation
  |--------------------------------------------------------------------------
  */
  if (
    referrerAttribution.type === "internal" &&
    storedSource
  ) {
    currentDocumentSource = storedSource
    hasCapturedCurrentDocument = true

    return storedSource
  }

  /*
  |--------------------------------------------------------------------------
  | 6. Reload
  |--------------------------------------------------------------------------
  | Preserve active visit only on genuine reload.
  */
  if (
    navigationType === "reload" &&
    storedSource
  ) {
    currentDocumentSource = storedSource
    hasCapturedCurrentDocument = true

    return storedSource
  }

  /*
  |--------------------------------------------------------------------------
  | 7. No source evidence
  |--------------------------------------------------------------------------
  | New visit with no signal = DIRECT.
  |
  | Never reuse previous Instagram/Facebook source.
  */
  const directSource = createSourceData({
    source: "direct",
    medium: "",
    campaign: "",
    content: "",
    term: "",
    referrer: "",
  })

  hasCapturedCurrentDocument = true
  return saveSource(directSource)
}

export const getLeadSource = () => {
  if (typeof window === "undefined") return null

  const sourceData =
    currentDocumentSource ||
    captureLeadSource() ||
    getStoredSource()

  const safeSource =
    sourceData ||
    createSourceData({
      source: "direct",
    })

  return {
    ...safeSource,

    formPage: window.location.href,
    formPath: window.location.pathname,

    submittedAt: new Date().toISOString(),
  }
}