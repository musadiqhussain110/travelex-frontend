const STORAGE_KEY = "travelex_visit_source_v4"

// Old keys from our previous implementations.
// These are permanently removed so stale Instagram data cannot return.
const LEGACY_LOCAL_STORAGE_KEYS = [
  "travelex_lead_source",
]

const LEGACY_SESSION_STORAGE_KEYS = [
  "travelex_current_visit_source",
  "travelex_lead_source",
]

// Current source for the currently loaded React document.
// SPA route changes preserve this in memory.
let currentVisitSource = null

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

const normalizeSource = (value = "") => {
  return String(value).trim().toLowerCase()
}

const normalizeValue = (value = "") => {
  return String(value).trim()
}

const isSameSite = (hostA = "", hostB = "") => {
  const a = normalizeHostname(hostA)
  const b = normalizeHostname(hostB)

  if (!a || !b) return false
  if (a === b) return true

  return a.endsWith(`.${b}`) || b.endsWith(`.${a}`)
}

const clearOldTrackingStorage = () => {
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

const getStoredVisitSource = () => {
  if (typeof window === "undefined") return null

  try {
    return safeJsonParse(sessionStorage.getItem(STORAGE_KEY))
  } catch {
    return null
  }
}

const saveVisitSource = (sourceData) => {
  currentVisitSource = sourceData

  if (typeof window !== "undefined") {
    try {
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(sourceData)
      )
    } catch {
      // Current in-memory attribution still works.
    }
  }

  return sourceData
}

const getNavigationType = () => {
  if (typeof window === "undefined") return "navigate"

  try {
    const navigationEntries =
      performance.getEntriesByType("navigation")

    return navigationEntries?.[0]?.type || "navigate"
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

    // TravelEx → TravelEx
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

    // Unknown external website
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
  // Google Ads
  if (
    params.get("gclid") ||
    params.get("dclid") ||
    params.get("gbraid") ||
    params.get("wbraid")
  ) {
    return {
      source: "google",
      medium: "paid",
      clickIdType: "google",
    }
  }

  // Meta click identifier.
  // When a known Facebook / Instagram referrer exists,
  // use it to distinguish the actual Meta platform.
  if (params.get("fbclid")) {
    const metaReferrerSource =
      referrerAttribution?.source === "instagram" ||
      referrerAttribution?.source === "facebook"
        ? referrerAttribution.source
        : "facebook"

    return {
      source: metaReferrerSource,
      medium: "social",
      clickIdType: "meta",
    }
  }

  // TikTok
  if (params.get("ttclid")) {
    return {
      source: "tiktok",
      medium: "paid_social",
      clickIdType: "tiktok",
    }
  }

  // Microsoft / Bing
  if (params.get("msclkid")) {
    return {
      source: "bing",
      medium: "paid",
      clickIdType: "microsoft",
    }
  }

  // LinkedIn
  if (params.get("li_fat_id")) {
    return {
      source: "linkedin",
      medium: "paid_social",
      clickIdType: "linkedin",
    }
  }

  // X / Twitter
  if (params.get("twclid")) {
    return {
      source: "x",
      medium: "social",
      clickIdType: "x",
    }
  }

  return null
}

const getTrackingSignature = (params) => {
  const trackingKeys = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_content",
    "utm_term",
    "gclid",
    "dclid",
    "gbraid",
    "wbraid",
    "fbclid",
    "ttclid",
    "msclkid",
    "li_fat_id",
    "twclid",
  ]

  return trackingKeys
    .map((key) => `${key}=${params.get(key) || ""}`)
    .join("&")
}

const createSourceData = ({
  source,
  medium = "",
  campaign = "",
  content = "",
  term = "",
  referrer = "",
  captureMethod = "direct",
  trackingSignature = "",
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

    // Internal-only metadata.
    // Removed before sending to backend.
    _captureMethod: captureMethod,
    _trackingSignature: trackingSignature,
    _trackerVersion: 4,
  }
}

const getPublicSourceData = (sourceData) => {
  if (!sourceData) return null

  const {
    _captureMethod,
    _trackingSignature,
    _trackerVersion,
    ...publicSourceData
  } = sourceData

  return publicSourceData
}

export const captureLeadSource = () => {
  if (typeof window === "undefined") return null

  /*
  |--------------------------------------------------------------------------
  | STEP 0 — permanently remove old stale storage
  |--------------------------------------------------------------------------
  */
  clearOldTrackingStorage()

  const params = new URLSearchParams(window.location.search)

  const trackingSignature = getTrackingSignature(params)

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
  | PRIORITY 1 — UTM
  |--------------------------------------------------------------------------
  */
  if (hasUtm) {
    // React StrictMode / repeated effect protection
    if (
      currentVisitSource &&
      currentVisitSource._trackingSignature ===
        trackingSignature
    ) {
      return getPublicSourceData(currentVisitSource)
    }

    const sourceData = createSourceData({
      source: utmSource || "direct",
      medium: utmMedium,
      campaign: utmCampaign,
      content: utmContent,
      term: utmTerm,
      referrer: document.referrer || "",
      captureMethod: "utm",
      trackingSignature,
    })

    return getPublicSourceData(
      saveVisitSource(sourceData)
    )
  }

  /*
  |--------------------------------------------------------------------------
  | Calculate referrer only for initial-document decisions
  |--------------------------------------------------------------------------
  */
  const referrerAttribution = getReferrerAttribution(
    document.referrer || ""
  )

  /*
  |--------------------------------------------------------------------------
  | PRIORITY 2 — CLICK IDENTIFIERS
  |--------------------------------------------------------------------------
  */
  const clickIdAttribution = getClickIdAttribution(
    params,
    referrerAttribution
  )

  if (clickIdAttribution) {
    if (
      currentVisitSource &&
      currentVisitSource._trackingSignature ===
        trackingSignature
    ) {
      return getPublicSourceData(currentVisitSource)
    }

    const sourceData = createSourceData({
      source: clickIdAttribution.source,
      medium: clickIdAttribution.medium,
      referrer: document.referrer || "",
      captureMethod: "click_id",
      trackingSignature,
    })

    return getPublicSourceData(
      saveVisitSource(sourceData)
    )
  }

  /*
  |--------------------------------------------------------------------------
  | CRITICAL SPA GUARD
  |--------------------------------------------------------------------------
  | Once this document has captured a source, do not process the same
  | document.referrer again during:
  |
  | / → /tickets → /hotels → /visa-application
  |
  | This was one of the bugs in the previous version.
  |--------------------------------------------------------------------------
  */
  if (currentVisitSource) {
    return getPublicSourceData(currentVisitSource)
  }

  /*
  |--------------------------------------------------------------------------
  | PRIORITY 3 — EXTERNAL REFERRER
  |--------------------------------------------------------------------------
  | Only processed once per actual document load.
  |--------------------------------------------------------------------------
  */
  if (referrerAttribution.type === "external") {
    const sourceData = createSourceData({
      source: referrerAttribution.source,
      medium: referrerAttribution.medium,
      referrer: document.referrer || "",
      captureMethod: "referrer",
    })

    return getPublicSourceData(
      saveVisitSource(sourceData)
    )
  }

  /*
  |--------------------------------------------------------------------------
  | Stored source is NOT trusted by default
  |--------------------------------------------------------------------------
  | It may belong to an old Instagram visit.
  |--------------------------------------------------------------------------
  */
  const storedSource = getStoredVisitSource()
  const navigationType = getNavigationType()

  /*
  |--------------------------------------------------------------------------
  | Genuine full-page same-site navigation
  |--------------------------------------------------------------------------
  | Example:
  | TravelEx page A → TravelEx page B with a real page load
  |
  | Preserve current website visit.
  |--------------------------------------------------------------------------
  */
  if (
    referrerAttribution.type === "internal" &&
    storedSource
  ) {
    return getPublicSourceData(
      saveVisitSource(storedSource)
    )
  }

  /*
  |--------------------------------------------------------------------------
  | Genuine browser reload
  |--------------------------------------------------------------------------
  | Preserve only on actual reload.
  |
  | IMPORTANT:
  | We intentionally do NOT preserve on "back_forward".
  | That could resurrect stale Instagram attribution.
  |--------------------------------------------------------------------------
  */
  if (
    navigationType === "reload" &&
    storedSource
  ) {
    return getPublicSourceData(
      saveVisitSource(storedSource)
    )
  }

  /*
  |--------------------------------------------------------------------------
  | PERMANENT STALE-SOURCE FIX
  |--------------------------------------------------------------------------
  | New navigation + no marketing evidence = DIRECT.
  |
  | Old Instagram is explicitly overwritten.
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

  return getPublicSourceData(
    saveVisitSource(directSource)
  )
}

export const getLeadSource = () => {
  if (typeof window === "undefined") return null

  const capturedSource = captureLeadSource()

  const safeSource =
    capturedSource || {
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