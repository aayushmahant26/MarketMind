import React, { createContext, useState, useEffect } from 'react';
import api from '../api/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          // Call the protected endpoint to verify the token is valid
          const response = await api.get('/api/protected/');
          // Response is: { message: "Hello <username>, token works!" }
          const message = response.data.message;
          const usernameMatch = message.match(/Hello (.*?),/);
          const username = usernameMatch ? usernameMatch[1] : 'User';
          
          setUser({ username });
          setIsAuthenticated(true);
        } catch (err) {
          console.error("Token verification failed:", err);
          // Token expired or invalid, clear localStorage
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          setUser(null);
          setIsAuthenticated(false);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (username, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/api/login/', { username, password });
      const { access, refresh } = response.data;
      
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      
      // Fetch user detail using the protected endpoint
      const profileResponse = await api.get('/api/protected/');
      const message = profileResponse.data.message;
      const usernameMatch = message.match(/Hello (.*?),/);
      const loggedInUsername = usernameMatch ? usernameMatch[1] : username;

      setUser({ username: loggedInUsername });
      setIsAuthenticated(true);
      setLoading(false);
      return true;
    } catch (err) {
      console.error("Login failed:", err);
      const errMsg = err.response?.data?.detail || 'Invalid username or password';
      setError(errMsg);
      setLoading(false);
      throw new Error(errMsg);
    }
  };

  const register = async (username, email, password) => {
    setLoading(true);
    setError(null);
    try {
      await api.post('/api/register/', { username, email, password });
      setLoading(false);
      return true;
    } catch (err) {
      console.error("Registration failed:", err);
      // Backend might return errors like {"username": ["A user with that username already exists."]}
      let errMsg = 'Registration failed';
      if (err.response?.data) {
        const errors = err.response.data;
        if (typeof errors === 'object') {
          errMsg = Object.entries(errors)
            .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(' ') : msgs}`)
            .join(' | ');
        } else {
          errMsg = errors;
        }
      }
      setError(errMsg);
      setLoading(false);
      throw new Error(errMsg);
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        error,
        login,
        register,
        logout,
        setError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
