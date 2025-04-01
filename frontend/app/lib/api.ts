import axios from 'axios';

// Determine if we're in a browser or server environment
const isBrowser = typeof window !== 'undefined';

// Use environment variable for API URL with fallbacks
// Using a relative path to ensure requests go through Next.js API routes
const API_URL = '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Add timeout to prevent long-hanging requests
  timeout: 10000,
});

// Add request interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log requests in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Enhanced error logging
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout: The server took too long to respond');
    } else if (error.code === 'ERR_NETWORK') {
      console.error('Network Error: Please check if the backend server is running and accessible');
      console.error('Backend URL should be: http://backend:8000 in Docker or http://localhost:8000 in local dev');
    } else if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Response error:', error.response.status, error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Request error: No response received');
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error:', error.message);
    }
    
    // Handle 401 Unauthorized errors by redirecting to login
    if (error.response && error.response.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default api; 