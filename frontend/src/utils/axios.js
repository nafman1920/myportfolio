// src/utils/axios.js
import axios from 'axios';

// ✅ Axios instance configured without forcing Content-Type
const axiosClient = axios.create({
  //baseURL: '/api', // Adjust if not using proxy
  withCredentials: true, // Send cookies (access_token, refresh_token)
  // ❌ DO NOT set Content-Type here — let axios set it dynamically
});

// ✅ Optional: Add interceptors to handle auth globally
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('Unauthorized: Session may have expired.');
      // Optional: Redirect to login or show a toast
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
