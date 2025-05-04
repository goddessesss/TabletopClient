import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode as jwt_decode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('authToken'));
  const [userId, setUserId] = useState(null);
  const [userProfile, setUserProfile] = useState(() => {
    const savedProfile = localStorage.getItem('userProfile');
    return savedProfile ? JSON.parse(savedProfile) : null;
  });

  const extractUserIdFromToken = (jwtToken) => {
    try {
      const decoded = jwt_decode(jwtToken);
      return decoded?.PlayerProfileId ?? null;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };

  useEffect(() => {
    if (token) {
      const id = extractUserIdFromToken(token);
      setUserId(id);
    } else {
      setUserId(null);
      console.log('No token found, userId set to null');
    }
  }, [token]);

  const updateUserProfile = (profileData) => {
    setUserProfile(profileData);
    localStorage.setItem('userProfile', JSON.stringify(profileData));
  };

  const handleLogin = (newToken) => {
    localStorage.setItem('authToken', newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userProfile');
    setToken(null);
    setUserId(null);
    setUserProfile(null);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ token, userId, userProfile, isAuthenticated, handleLogin, handleLogout, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
