import apiClient from "./apiClient"

export const createLead = async (leadData) => {
  const response = await apiClient.post("/leads", leadData)
  return response.data
}