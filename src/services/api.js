import { API_BASE_URL } from "../config/apiConfig"

const ADMIN_TOKEN_KEY = "travelex_admin_token"
const ADMIN_USER_KEY = "travelex_admin"

const getAdminToken = () => {
  return localStorage.getItem(ADMIN_TOKEN_KEY)
}

const buildQueryString = (params = {}) => {
  if (typeof params === "string") {
    if (!params.trim()) return ""
    return params.startsWith("?") ? params : `?${params}`
  }

  const query = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.append(key, value)
    }
  })

  const queryString = query.toString()

  return queryString ? `?${queryString}` : ""
}

export const apiRequest = async (endpoint, options = {}) => {
  const token = getAdminToken()
  const isFormData = options.body instanceof FormData

  const headers = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  }

  const normalizedEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`

  const response = await fetch(`${API_BASE_URL}${normalizedEndpoint}`, {
    ...options,
    headers,
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    const message =
      data?.message ||
      data?.error ||
      data?.errors?.[0]?.message ||
      data?.errors?.[0]?.path?.join?.(".") ||
      "Something went wrong. Please try again."

    throw new Error(message)
  }

  return data
}

export const apiDownload = async (
  endpoint,
  fallbackFilename = "download.csv"
) => {
  const token = getAdminToken()
  const normalizedEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`

  const response = await fetch(`${API_BASE_URL}${normalizedEndpoint}`, {
    method: "GET",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  })

  if (!response.ok) {
    const data = await response.json().catch(() => ({}))

    const message =
      data?.message ||
      data?.error ||
      data?.errors?.[0]?.message ||
      "Download failed. Please try again."

    throw new Error(message)
  }

  const blob = await response.blob()
  const contentDisposition = response.headers.get("Content-Disposition") || ""
  const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/)
  const filename = filenameMatch?.[1] || fallbackFilename

  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")

  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  URL.revokeObjectURL(url)

  return {
    success: true,
    filename,
  }
}

export const adminStorage = {
  saveSession: ({ token, admin }) => {
    if (token) {
      localStorage.setItem(ADMIN_TOKEN_KEY, token)
    }

    if (admin) {
      localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(admin))
    }
  },

  getToken: () => {
    return localStorage.getItem(ADMIN_TOKEN_KEY)
  },

  getAdmin: () => {
    const savedAdmin = localStorage.getItem(ADMIN_USER_KEY)

    if (!savedAdmin) return null

    try {
      return JSON.parse(savedAdmin)
    } catch {
      localStorage.removeItem(ADMIN_USER_KEY)
      return null
    }
  },

  clearSession: () => {
    localStorage.removeItem(ADMIN_TOKEN_KEY)
    localStorage.removeItem(ADMIN_USER_KEY)
  },
}

export const adminApi = {
  login: (payload) =>
    apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  me: () => apiRequest("/auth/me"),

  getDashboardOverview: (params = {}) =>
    apiRequest(`/dashboard/overview${buildQueryString(params)}`),

  getLeadStats: () => apiRequest("/leads/stats"),

  getLeads: (params = {}) => apiRequest(`/leads${buildQueryString(params)}`),

  exportLeadsCsv: (params = {}) =>
    apiDownload(
      `/leads/export${buildQueryString(params)}`,
      "travelex-leads.csv"
    ),

  getLeadById: (id) => apiRequest(`/leads/${id}`),

  updateLeadStatus: (id, status) =>
    apiRequest(`/leads/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),

  updateLeadFollowUp: (id, payload) =>
    apiRequest(`/leads/${id}/follow-up`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),

  addLeadNote: (id, text) =>
    apiRequest(`/leads/${id}/notes`, {
      method: "POST",
      body: JSON.stringify({ text }),
    }),

  assignLead: (id, assignedTo) =>
    apiRequest(`/leads/${id}/assign`, {
      method: "PATCH",
      body: JSON.stringify({ assignedTo }),
    }),

  archiveLead: (id) =>
    apiRequest(`/leads/${id}/archive`, {
      method: "PATCH",
    }),

  syncLeadPriorities: () =>
    apiRequest("/leads/sync-priorities", {
      method: "PATCH",
    }),

  getTeamAccessOptions: () => apiRequest("/team/access-options"),

  getTeamMembers: (params = {}) =>
    apiRequest(`/team${buildQueryString(params)}`),

  getTeamMemberById: (id) => apiRequest(`/team/${id}`),

  createTeamMember: (payload) =>
    apiRequest("/team", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  updateTeamMember: (id, payload) =>
    apiRequest(`/team/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),

  updateTeamMemberStatus: (id, isActive) =>
    apiRequest(`/team/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ isActive }),
    }),

  resetTeamMemberPassword: (id, password) =>
    apiRequest(`/team/${id}/reset-password`, {
      method: "PATCH",
      body: JSON.stringify({ password }),
    }),

  getNotifications: (params = {}) =>
    apiRequest(`/notifications${buildQueryString(params)}`),

  getUnreadNotificationCount: () =>
    apiRequest("/notifications/unread-count"),

  markNotificationAsRead: (id) =>
    apiRequest(`/notifications/${id}/read`, {
      method: "PATCH",
    }),

  markAllNotificationsAsRead: () =>
    apiRequest("/notifications/mark-all-read", {
      method: "PATCH",
    }),

  archiveNotification: (id) =>
    apiRequest(`/notifications/${id}/archive`, {
      method: "PATCH",
    }),

  getContactInquiries: (params = {}) =>
    apiRequest(`/contact-inquiries${buildQueryString(params)}`),

  getContactInquiryStats: () =>
    apiRequest("/contact-inquiries/stats/summary"),

  getContactInquiryById: (id) => apiRequest(`/contact-inquiries/${id}`),

  updateContactInquiryStatus: (id, status) =>
    apiRequest(`/contact-inquiries/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),

  addContactInquiryNote: (id, text) =>
    apiRequest(`/contact-inquiries/${id}/notes`, {
      method: "POST",
      body: JSON.stringify({ text }),
    }),

  assignContactInquiry: (id, assignedTo) =>
    apiRequest(`/contact-inquiries/${id}/assign`, {
      method: "PATCH",
      body: JSON.stringify({ assignedTo }),
    }),

  archiveContactInquiry: (id) =>
    apiRequest(`/contact-inquiries/${id}/archive`, {
      method: "PATCH",
    }),
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

  getUmrahPackages: (params = {}) =>
    apiRequest(`/umrah-packages${buildQueryString(params)}`),

  getTours: (params = {}) =>
    apiRequest(`/tours${buildQueryString(params)}`),

  getVisaServices: (params = {}) =>
    apiRequest(`/visa-services${buildQueryString(params)}`),

  getBlogs: (params = {}) =>
    apiRequest(`/blogs${buildQueryString(params)}`),

  getFaqs: (params = {}) =>
    apiRequest(`/faqs${buildQueryString(params)}`),
}