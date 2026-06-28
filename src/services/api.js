const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1"

const getAdminToken = () => {
  return localStorage.getItem("travelex_admin_token")
}

export const apiRequest = async (endpoint, options = {}) => {
  const token = getAdminToken()

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    const message =
      data?.message ||
      data?.error ||
      "Something went wrong. Please try again."

    throw new Error(message)
  }

  return data
}

export const adminApi = {
  login: (payload) =>
    apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  me: () => apiRequest("/auth/me"),

  getLeadStats: () => apiRequest("/leads/stats"),

  getLeads: (query = "") => apiRequest(`/leads${query}`),

  getLeadById: (id) => apiRequest(`/leads/${id}`),

  updateLeadStatus: (id, status) =>
    apiRequest(`/leads/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),

  addLeadNote: (id, text) =>
    apiRequest(`/leads/${id}/notes`, {
      method: "POST",
      body: JSON.stringify({ text }),
    }),

  getWhatsappLogs: (query = "") => apiRequest(`/whatsapp/logs${query}`),

  getWhatsappStats: () => apiRequest("/whatsapp/logs/stats"),

  getContactInquiries: (query = "") =>
  apiRequest(`/contact-inquiries${query}`),

getContactInquiryById: (id) =>
  apiRequest(`/contact-inquiries/${id}`),

updateContactInquiryStatus: (id, status) =>
  apiRequest(`/contact-inquiries/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  }),
}
