import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api/v1",
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const payload = error.response?.data || {
      message: error.message || "Network Error",
      success: false,
    };
    return Promise.reject(payload);
  }
);

export default apiClient;
