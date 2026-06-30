export const API_BASE_URL =
  window.TRAVELEX_CONFIG?.API_BASE_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  "https://travelex-backend.onrender.com/api/v1"