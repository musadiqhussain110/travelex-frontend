import apiClient from "./apiClient";

export const getUmrahPackages = async (params = {}) => {
  const response = await apiClient.get("/umrah-packages", { params });
  return response.data;
};

export const getUmrahPackageBySlug = async (slug) => {
  const response = await apiClient.get(`/umrah-packages/${slug}`);
  return response.data;
};

export const getTours = async (params = {}) => {
  const response = await apiClient.get("/tours", { params });
  return response.data;
};

export const getTourBySlug = async (slug) => {
  const response = await apiClient.get(`/tours/${slug}`);
  return response.data;
};

export const getVisaServices = async (params = {}) => {
  const response = await apiClient.get("/visa-services", { params });
  return response.data;
};

export const getVisaServiceBySlug = async (slug) => {
  const response = await apiClient.get(`/visa-services/${slug}`);
  return response.data;
};

export const getBlogs = async (params = {}) => {
  const response = await apiClient.get("/blogs", { params });
  return response.data;
};

export const getBlogBySlug = async (slug) => {
  const response = await apiClient.get(`/blogs/${slug}`);
  return response.data;
};

export const getFaqs = async (params = {}) => {
  const response = await apiClient.get("/faqs", { params });
  return response.data;
};

export const getFaqBySlug = async (slug) => {
  const response = await apiClient.get(`/faqs/${slug}`);
  return response.data;
};