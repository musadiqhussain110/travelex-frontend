import apiClient from "./apiClient";

export const createContactInquiry = async (contactData) => {
  const response = await apiClient.post("/contact-inquiries", contactData);
  return response.data;
};