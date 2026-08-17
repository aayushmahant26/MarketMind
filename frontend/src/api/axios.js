import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add authorization token
// This is a function that will be called before every request is sent.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

let isRefreshing = false; // Keeps track of whether a refresh request is already in progress.
let failedQueue = []; // Stores all the requests that failed due to token expiration.

const processQueue = (error, token = null) => {
  // After a new access token is received: Wake up all waiting requests. Give them the new token. Retry them.
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = []; // Clears the queue for the next round of failures.
};

// Response interceptor to handle token expiration/unauthorized errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If it's a 401 error and the request has not been retried yet
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      // Don't try to refresh if the request was to the refresh or login endpoints themselves
      if (originalRequest.url.includes('/api/refresh/') || originalRequest.url.includes('/api/login/')) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;  // Prevents infinite retry loops.
      isRefreshing = true; // Stops multiple refresh requests from happening simultaneously.

      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          // Use axios directly instead of the 'api' instance to avoid interceptor loop
          const response = await axios.post('http://localhost:8000/api/refresh/', {
            refresh: refreshToken,
          });
          const newAccessToken = response.data.access;
          localStorage.setItem('access_token', newAccessToken);

          api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          processQueue(null, newAccessToken);
          isRefreshing = false;
          return api(originalRequest);
        } catch (refreshError) {
          console.error("Token refresh failed:", refreshError);
          processQueue(refreshError, null);
          isRefreshing = false;

          // Clear credentials and logout
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user');
          if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
            window.location.href = '/login';
          }
          return Promise.reject(refreshError);
        }
      } else {
        // No refresh token available, redirect to login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
