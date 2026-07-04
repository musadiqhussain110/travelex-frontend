const SESSION_STORAGE_KEY = "travelex_current_visit_source"
const LEGACY_STORAGE_KEY = "travelex_lead_source"

// React SPA route changes happen inside the same document.
// This prevents document.referrer from being processed repeatedly.
let hasCapturedCurrentDocument = false

const safeJsonParse = (value) => {
  try {
    return JSON.parse(value)
  } catch {
    return null
  }
}

const normalizeHostname = (hostname = "") => {
  return String(hostname)
    .trim()
    .toLowerCase()
    .replace(/^www\./, "")
}

const normalizeTrackingValue = (value = "") => {
  return String(value).trim()
}

const normalizeSourceValue = (value = "") => {
  return normalizeTrackingValue(value).toLowerCase()
}

const isSameSite = (hostA = "", hostB = "") => {
  const a = normalizeHostname(hostA)
  const b = normalizeHostname(hostB)

  if (!a || !b) return false
  if (a === b) return true

  return a.endsWith(`.${b}`) || b.endsWith(`.${a}`)
}

const clearLegacyLocalStorage = () => {
  if (typeof window === "undefined") return

  try {
    // Removes stale attribution created by the old tracker.
    localStorage.removeItem(LEGACY_STORAGE_KEY)
  } catch {
    // Ignore storage access errors.
  }
}

const getStoredSource = () => {
  if (typeof window === "undefined") return null

  try {
    return safeJsonParse(sessionStorage.getItem(SESSION_STORAGE_KEY))
  } catch {
    return null
  }
}

const saveSourceData = (sourceData) => {
  if (typeof window === "undefined") return sourceData

  try {
    sessionStorage.setItem(
      SESSION_STORAGE_KEY,
      JSON.stringify(sourceData)
    )
  } catch {
    // Attribution still works for current function call
    // even if browser storage is unavailable.
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
  return host === "instagram.com" || host.endsWith(".instagram.com")
}

const isTikTokHost = (host = "") => {
  return host === "tiktok.com" || host.endsWith(".tiktok.com")
}

const isYouTubeHost = (host = "") => {
  return (
    host === "youtube.com" ||
    host.endsWith(".youtube.com") ||
    host === "youtu.be"
  )
}

const isLinkedInHost = (host = "") => {
  return host === "linkedin.com" || host.endsWith(".linkedin.com")
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
  return host === "bing.com" || host.endsWith(".bing.com")
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
    const referrerHost = normalizeHostname(referrerUrl.hostname)

    const currentHost =
      typeof window !== "undefined"
        ? normalizeHostname(window.location.hostname)
        : ""

    /*
    |--------------------------------------------------------------------------
    | Internal TravelEx navigation
    |--------------------------------------------------------------------------
    | Example:
    | / → /tickets → /visa-application
    |
    | This must not replace the original marketing source.
    */
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

    /*
    |--------------------------------------------------------------------------
    | Unknown external website
    |--------------------------------------------------------------------------
    */
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

const getClickIdAttribution = (params) => {
  /*
  |--------------------------------------------------------------------------
  | Google Ads
  |--------------------------------------------------------------------------
  */
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

  /*
  |--------------------------------------------------------------------------
  | Meta / Facebook click identifier
  |--------------------------------------------------------------------------
  */
  if (params.get("fbclid")) {
    return {
      source: "facebook",
      medium: "social",
    }
  }

  /*
  |--------------------------------------------------------------------------
  | TikTok
  |--------------------------------------------------------------------------
  */
  if (params.get("ttclid")) {
    return {
      source: "tiktok",
      medium: "paid_social",
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Microsoft / Bing Ads
  |--------------------------------------------------------------------------
  */
  if (params.get("msclkid")) {
    return {
      source: "bing",
      medium: "paid",
    }
  }

  /*
  |--------------------------------------------------------------------------
  | LinkedIn
  |--------------------------------------------------------------------------
  */
  if (params.get("li_fat_id")) {
    return {
      source: "linkedin",
      medium: "paid_social",
    }
  }

  /*
  |--------------------------------------------------------------------------
  | X / Twitter
  |--------------------------------------------------------------------------
  */
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
  captureMethod = "direct",
}) => {
  return {
    source: source || "direct",
    medium,
    campaign,
    content,
    term,
    referrer,

    landingPage:
      typeof window !== "undefined"
        ? window.location.href
        : "",

    landingPath:
      typeof window !== "undefined"
        ? window.location.pathname
        : "",

    capturedAt: new Date().toISOString(),

    /*
    |--------------------------------------------------------------------------
    | Internal frontend metadata
    |--------------------------------------------------------------------------
    | This is removed before sending to backend.
    */
    _captureMethod: captureMethod,
  }
}

const getPublicSourceData = (sourceData) => {
  if (!sourceData) return null

  const {
    _captureMethod,
    ...publicSourceData
  } = sourceData

  return publicSourceData
}

export const captureLeadSource = () => {
  if (typeof window === "undefined") return null

  /*
  |--------------------------------------------------------------------------
  | Remove stale data from old localStorage-based implementation
  |--------------------------------------------------------------------------
  */
  clearLegacyLocalStorage()

  const params = new URLSearchParams(window.location.search)
  const existingSource = getStoredSource()

  const utmSource = normalizeSourceValue(params.get("utm_source") || "")
  const utmMedium = normalizeSourceValue(params.get("utm_medium") || "")

  const utmCampaign = normalizeTrackingValue(
    params.get("utm_campaign") || ""
  )

  const utmContent = normalizeTrackingValue(
    params.get("utm_content") || ""
  )

  const utmTerm = normalizeTrackingValue(
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
  | PRIORITY 1 — UTM PARAMETERS
  |--------------------------------------------------------------------------
  | Always replace previous source.
  */
  if (hasUtm) {
    const sourceData = createSourceData({
      source: utmSource || "direct",
      medium: utmMedium,
      campaign: utmCampaign,
      content: utmContent,
      term: utmTerm,
      referrer: document.referrer || "",
      captureMethod: "utm",
    })

    hasCapturedCurrentDocument = true

    return getPublicSourceData(
      saveSourceData(sourceData)
    )
  }

  /*
  |--------------------------------------------------------------------------
  | Check external referrer before generic click fallback
  |--------------------------------------------------------------------------
  | This helps distinguish:
  | Facebook → facebook
  | Instagram → instagram
  */
  const referrerAttribution = getReferrerAttribution(
    document.referrer || ""
  )

  /*
  |--------------------------------------------------------------------------
  | PRIORITY 2 — EXTERNAL REFERRER
  |--------------------------------------------------------------------------
  | A new external source ALWAYS replaces previous attribution.
  |
  | Example:
  | Yesterday: Instagram
  | Today: Facebook
  | Result: Facebook ✅
  */
  if (referrerAttribution.type === "external") {
    const sourceData = createSourceData({
      source: referrerAttribution.source,
      medium: referrerAttribution.medium,
      referrer: document.referrer || "",
      captureMethod: "referrer",
    })

    hasCapturedCurrentDocument = true

    return getPublicSourceData(
      saveSourceData(sourceData)
    )
  }

  /*
  |--------------------------------------------------------------------------
  | PRIORITY 3 — PLATFORM CLICK IDs
  |--------------------------------------------------------------------------
  */
  const clickIdAttribution = getClickIdAttribution(params)

  if (clickIdAttribution) {
    const sourceData = createSourceData({
      source: clickIdAttribution.source,
      medium: clickIdAttribution.medium,
      referrer: document.referrer || "",
      captureMethod: "click_id",
    })

    hasCapturedCurrentDocument = true

    return getPublicSourceData(
      saveSourceData(sourceData)
    )
  }

  /*
  |--------------------------------------------------------------------------
  | React SPA navigation protection
  |--------------------------------------------------------------------------
  | App.jsx calls captureLeadSource() on pathname/search changes.
  |
  | Once current document is captured, internal route changes must preserve
  | the active visit source.
  */
  if (hasCapturedCurrentDocument) {
    return getPublicSourceData(existingSource)
  }

  const navigationType = getNavigationType()

  /*
  |--------------------------------------------------------------------------
  | INTERNAL WEBSITE NAVIGATION
  |--------------------------------------------------------------------------
  | Example:
  |
  | Facebook
  | ↓
  | TravelEx /
  | ↓
  | /tickets
  | ↓
  | /visa-application
  |
  | Keep Facebook.
  */
  if (
    referrerAttribution.type === "internal" &&
    existingSource
  ) {
    hasCapturedCurrentDocument = true
    return getPublicSourceData(existingSource)
  }

  /*
  |--------------------------------------------------------------------------
  | PAGE RELOAD / BACK-FORWARD
  |--------------------------------------------------------------------------
  | Reloading a page must not destroy current visit attribution.
  */
  if (
    existingSource &&
    (navigationType === "reload" ||
      navigationType === "back_forward")
  ) {
    hasCapturedCurrentDocument = true
    return getPublicSourceData(existingSource)
  }

  /*
  |--------------------------------------------------------------------------
  | NEW VISIT WITH NO TRACKING SIGNAL
  |--------------------------------------------------------------------------
  | THIS IS THE PERMANENT FIX FOR YOUR BUG.
  |
  | Example:
  |
  | Old source: Instagram
  | New navigation: no Instagram signal
  | Result: Direct
  |
  | We DO NOT reuse old Instagram.
  |--------------------------------------------------------------------------
  */
  const directSource = createSourceData({
    source: "direct",
    medium: "",
    campaign: "",
    content: "",
    term: "",
    referrer: "",
    captureMethod: "direct",
  })

  hasCapturedCurrentDocument = true

  return getPublicSourceData(
    saveSourceData(directSource)
  )
}

export const getLeadSource = () => {
  if (typeof window === "undefined") return null

  /*
  |--------------------------------------------------------------------------
  | Always capture current document first
  |--------------------------------------------------------------------------
  | Do not blindly trust previously stored attribution.
  */
  const currentSource =
    captureLeadSource() ||
    getPublicSourceData(getStoredSource())

  const safeSource =
    currentSource || {
      source: "direct",
      medium: "",
      campaign: "",
      content: "",
      term: "",
      referrer: "",
      landingPage: window.location.href,
      landingPath: window.location.pathname,
      capturedAt: new Date().toISOString(),
    }

  return {
    ...safeSource,

    formPage: window.location.href,
    formPath: window.location.pathname,

    submittedAt: new Date().toISOString(),
  }
}