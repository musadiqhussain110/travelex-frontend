const STORAGE_KEY = "travelex_lead_source"

// Prevent the same document.referrer from being re-processed on every
// React SPA route change. This resets automatically on a real page load.
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

const isSameSite = (hostA = "", hostB = "") => {
  const a = normalizeHostname(hostA)
  const b = normalizeHostname(hostB)

  if (!a || !b) return false
  if (a === b) return true

  return a.endsWith(`.${b}`) || b.endsWith(`.${a}`)
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
      source: "",
      medium: "",
      isExternal: false,
    }
  }

  try {
    const referrerUrl = new URL(referrer)
    const referrerHost = normalizeHostname(referrerUrl.hostname)
    const currentHost =
      typeof window !== "undefined"
        ? normalizeHostname(window.location.hostname)
        : ""

    // Never treat another TravelEx page as a new marketing source.
    if (isSameSite(referrerHost, currentHost)) {
      return {
        source: "",
        medium: "",
        isExternal: false,
      }
    }

    if (isFacebookHost(referrerHost)) {
      return {
        source: "facebook",
        medium: "social",
        isExternal: true,
      }
    }

    if (isInstagramHost(referrerHost)) {
      return {
        source: "instagram",
        medium: "social",
        isExternal: true,
      }
    }

    if (isTikTokHost(referrerHost)) {
      return {
        source: "tiktok",
        medium: "social",
        isExternal: true,
      }
    }

    if (isYouTubeHost(referrerHost)) {
      return {
        source: "youtube",
        medium: "social",
        isExternal: true,
      }
    }

    if (isLinkedInHost(referrerHost)) {
      return {
        source: "linkedin",
        medium: "social",
        isExternal: true,
      }
    }

    if (isXHost(referrerHost)) {
      return {
        source: "x",
        medium: "social",
        isExternal: true,
      }
    }

    if (isGoogleHost(referrerHost)) {
      return {
        source: "google",
        medium: "organic",
        isExternal: true,
      }
    }

    if (isBingHost(referrerHost)) {
      return {
        source: "bing",
        medium: "organic",
        isExternal: true,
      }
    }

    if (isWhatsappHost(referrerHost)) {
      return {
        source: "whatsapp",
        medium: "referral",
        isExternal: true,
      }
    }

    // Unknown external website.
    return {
      source: "referral",
      medium: "referral",
      isExternal: true,
    }
  } catch {
    return {
      source: "",
      medium: "",
      isExternal: false,
    }
  }
}

const getClickIdAttribution = (params) => {
  // Google Ads / Google campaign click identifiers
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

  // Facebook / Meta outbound click identifier.
  // Note: fbclid can also appear through Meta-owned traffic,
  // so UTM parameters remain more precise when available.
  if (params.get("fbclid")) {
    return {
      source: "facebook",
      medium: "social",
    }
  }

  // TikTok click identifier
  if (params.get("ttclid")) {
    return {
      source: "tiktok",
      medium: "paid_social",
    }
  }

  // Microsoft / Bing Ads click identifier
  if (params.get("msclkid")) {
    return {
      source: "bing",
      medium: "paid",
    }
  }

  // LinkedIn click identifier
  if (params.get("li_fat_id")) {
    return {
      source: "linkedin",
      medium: "paid_social",
    }
  }

  // X / Twitter click identifier
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
      typeof window !== "undefined" ? window.location.href : "",
    landingPath:
      typeof window !== "undefined" ? window.location.pathname : "",
    capturedAt: new Date().toISOString(),

    // Internal localStorage-only metadata.
    // Removed before sending data to backend.
    _captureMethod: captureMethod,
  }
}

const saveSourceData = (sourceData) => {
  if (typeof window === "undefined") return sourceData

  localStorage.setItem(STORAGE_KEY, JSON.stringify(sourceData))
  return sourceData
}

const getStoredSource = () => {
  if (typeof window === "undefined") return null

  return safeJsonParse(localStorage.getItem(STORAGE_KEY))
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

  const params = new URLSearchParams(window.location.search)
  const existingSource = getStoredSource()

  const utmSource = params.get("utm_source")?.trim() || ""
  const utmMedium = params.get("utm_medium")?.trim() || ""
  const utmCampaign = params.get("utm_campaign")?.trim() || ""
  const utmContent = params.get("utm_content")?.trim() || ""
  const utmTerm = params.get("utm_term")?.trim() || ""

  const hasUtm = Boolean(
    utmSource ||
      utmMedium ||
      utmCampaign ||
      utmContent ||
      utmTerm
  )

  /*
  |--------------------------------------------------------------------------
  | Priority 1: UTM parameters
  |--------------------------------------------------------------------------
  | Strongest signal. Always overwrite older attribution.
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
    return getPublicSourceData(saveSourceData(sourceData))
  }

  /*
  |--------------------------------------------------------------------------
  | Priority 2: Platform click IDs
  |--------------------------------------------------------------------------
  | Example:
  | fbclid
  | gclid
  | ttclid
  | msclkid
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
    return getPublicSourceData(saveSourceData(sourceData))
  }

  /*
  |--------------------------------------------------------------------------
  | Prevent repeated referrer processing during React SPA navigation
  |--------------------------------------------------------------------------
  | document.referrer belongs to the original document.
  | Without this guard, route changes could repeatedly overwrite landing data.
  */
  if (hasCapturedCurrentDocument) {
    return getPublicSourceData(existingSource)
  }

  /*
  |--------------------------------------------------------------------------
  | Priority 3: External referrer
  |--------------------------------------------------------------------------
  | This is the important improvement for plain links posted on:
  | Facebook
  | Instagram
  | TikTok
  | Google
  | etc.
  */
  const referrerAttribution = getReferrerAttribution(
    document.referrer || ""
  )

  if (referrerAttribution.isExternal) {
    const sourceData = createSourceData({
      source: referrerAttribution.source,
      medium: referrerAttribution.medium,
      referrer: document.referrer || "",
      captureMethod: "referrer",
    })

    hasCapturedCurrentDocument = true
    return getPublicSourceData(saveSourceData(sourceData))
  }

  /*
  |--------------------------------------------------------------------------
  | Priority 4: Keep existing attribution
  |--------------------------------------------------------------------------
  | Example:
  | Customer originally came from Facebook,
  | then browsed around the TravelEx website.
  |
  | Do not reset them to direct.
  */
  if (existingSource) {
    hasCapturedCurrentDocument = true
    return getPublicSourceData(existingSource)
  }

  /*
  |--------------------------------------------------------------------------
  | Priority 5: Direct
  |--------------------------------------------------------------------------
  | Only used when absolutely no marketing signal exists.
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
  return getPublicSourceData(saveSourceData(directSource))
}

export const getLeadSource = () => {
  if (typeof window === "undefined") return null

  const storedSource = getStoredSource()
  const capturedSource = storedSource || captureLeadSource()

  const publicSource =
    getPublicSourceData(capturedSource) || {
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
    ...publicSource,
    formPage: window.location.href,
    formPath: window.location.pathname,
    submittedAt: new Date().toISOString(),
  }
}