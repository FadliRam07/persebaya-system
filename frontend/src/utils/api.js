// frontend/src/utils/api.js
import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor for adding auth token if needed
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      console.error('API Error:', error.response.status, error.response.data);
    } else if (error.request) {
      // Request made but no response
      console.error('No response received:', error.request);
    } else {
      // Error in request setup
      console.error('Request error:', error.message);
    }
    return Promise.reject(error);
  }
);

/**
 * Helper function for file uploads
 * @param {string} endpoint - API endpoint
 * @param {FormData} formData - FormData object with file
 * @param {number|null} id - Optional ID for PUT requests
 * @param {string} method - HTTP method (post/put)
 */
export const uploadFile = async (endpoint, formData, id = null, method = 'post') => {
  return api({
    method,
    url: id ? `${endpoint}/${id}` : endpoint,
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    timeout: 15000 // Longer timeout for uploads
  });
};

export default api;