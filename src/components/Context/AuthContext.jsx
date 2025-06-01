import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode as jwt_decode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(() => localStorage.getItem('authToken'));
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userProfile, setUserProfile] = useState(() => {
    const savedProfile = localStorage.getItem('userProfile');
    return savedProfile ? JSON.parse(savedProfile) : null;
  });

  useEffect(() => {
    if (authToken) {
      try {
        const decoded = jwt_decode(authToken);
        setUserId(decoded?.PlayerProfileId ?? null);
        setUserRole(+decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ?? null);
        console.log(decoded)
      } catch (error) {
        console.error('Error decoding token:', error);
        setUserId(null);
        setUserRole(null);
      }
    } else {
      setUserId(null);
      setUserRole(null);
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
    <AuthContext.Provider value={{ authToken, userId, userProfile, userRole, isAuthenticated, handleLogin, handleLogout, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
