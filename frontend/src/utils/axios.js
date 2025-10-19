// src/utils/axios.js
import axios from 'axios';

// Axios instance configured for your API
const axiosClient = axios.create({
  baseURL: '/api', // Adjust if your API isn't proxied
  withCredentials: true, // ✅ Send cookies (access_token, refresh_token)
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optional: Add interceptors to handle auth errors globally
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('Unauthorized: Session may have expired.');
      // Optionally redirect or notify user
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
