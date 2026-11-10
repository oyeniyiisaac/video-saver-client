import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://video-saver-server.onrender.com/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor to format all errors into clear, friendly messages
api.interceptors.response.use(
  response => response,
  error => {
    let message = 'An unexpected error occurred.';

    if (error.response) {
      // The server responded with a non-2xx status code
      const status = error.response.status;
      const serverError = error.response.data?.error;

      if (serverError) {
        message = serverError;
      } else if (status === 429) {
        message = 'Too many requests. Please wait a moment and try again.';
      } else if (status === 404) {
        message = 'The requested endpoint or resource was not found.';
      } else if (status >= 500) {
        message = 'The server encountered an error processing your request. Please try again later.';
      } else {
        message = `Request failed with status ${status}.`;
      }
    } else if (error.request) {
      // The request was made but no response was received (server down, network error, CORS)
      message = 'Server is unreachable. Please verify that the server is online and reachable.';
    } else {
      // Error setting up the request
      message = error.message || 'Network request failed.';
    }

    const enhancedError = new Error(message);
    enhancedError.originalError = error;
    enhancedError.status = error.response?.status;
    return Promise.reject(enhancedError);
  }
);

export default api;
