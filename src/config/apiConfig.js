const runtimeApiUrl = window.TRAVELEX_CONFIG?.API_BASE_URL
const environmentApiUrl = import.meta.env.VITE_API_BASE_URL

export const API_BASE_URL = runtimeApiUrl || environmentApiUrl

if (!API_BASE_URL) {
  throw new Error(
    "API_BASE_URL is not configured. Set VITE_API_BASE_URL for this environment."
  )
}