import axios from 'axios';

// Remove non-standard headers globally to prevent CORS preflight issues
delete axios.defaults.headers.common['X-Requested-With'];

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5247',
});



api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);