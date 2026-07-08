import axios from "axios";

/**
 * Centrally managed Axios instance for application-wide endpoint interaction.
 * Configured automatically for Cross-Origin Resource Sharing (CORS) with stateful tokens/cookies.
 */
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api/v1",
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  const headers = config.headers || {};

  if (config.data instanceof FormData) {
    delete headers["Content-Type"];
  } else {
    headers["Content-Type"] = "application/json";
  }

  config.headers = headers;
  return config;
});

// Intercept outgoing responses to normalize backend validation anomalies
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Gracefully parse structured backend validation errors or map fallback network properties
    const payload = error.response?.data || {
      message: error.message || "An unexpected network error occurred.",
      success: false,
    };
    
    return Promise.reject(payload);
  }
);

export default apiClient;