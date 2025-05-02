import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
console.log(API_BASE_URL);
console.log(import.meta.env);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const healthCheck = async () => {
  const response = await api.get("/api/health");
  return response.data;
};

export const getHousehold = async () => {
  const response = await api.get("/api/household");
  return response.data;
};

export const getNem = async () => {
  const response = await api.get("/api/nem");
  return response.data;
};

export const getPrimitive = async () => {
  const response = await api.get("/api/primitive");
  return response.data;
};

export default api;
