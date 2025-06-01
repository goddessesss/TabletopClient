import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode as jwt_decode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(() => localStorage.getItem('authToken'));
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
    if (authToken) {
      const id = extractUserIdFromToken(authToken);
      setUserId(id);
    } else {
      setUserId(null);
      console.log('No authToken found, userId set to null');
    }
  }, [authToken]);

  const updateUserProfile = (profileData) => {
    setUserProfile(profileData);
    localStorage.setItem('userProfile', JSON.stringify(profileData));
  };

  const handleLogin = (newAuthToken) => {
    localStorage.setItem('authToken', newAuthToken);
    setAuthToken(newAuthToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userProfile');
    setAuthToken(null);
    setUserId(null);
    setUserProfile(null);
  };

  const isAuthenticated = !!authToken;

  return (
    <AuthContext.Provider value={{ authToken, userId, userProfile, isAuthenticated, handleLogin, handleLogout, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);