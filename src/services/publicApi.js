import { API_BASE_URL } from "../config/apiConfig"

const apiRequest = async (endpoint, options = {}) => {
  const normalizedEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  }

  const response = await fetch(`${API_BASE_URL}${normalizedEndpoint}`, {
    ...options,
    headers,
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    console.error("Public API error:", data)

    const message =
      data?.message ||
      data?.error ||
      data?.errors?.[0]?.message ||
      "Something went wrong. Please try again."

    throw new Error(message)
  }

  return data
}

export const publicApi = {
  createLead: (payload) =>
    apiRequest("/leads", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  createContactInquiry: (payload) =>
    apiRequest("/contact-inquiries", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
}