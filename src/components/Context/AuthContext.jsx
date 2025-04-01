import { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode as jwt_decode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(() => {
    const storedToken = localStorage.getItem('authToken');
    return storedToken || null;
  });

  useEffect(() => {
    const extractUserInfoFromToken = (token) => {
      try {
        const decodedToken = jwt_decode(token);
        const userId = decodedToken?.userId ?? null;
        setUserId(userId);
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    };

    if (token) {
      extractUserInfoFromToken(token);
    } else {
      setUserId(null);
    }
  }, [token]);

  const handleLogin = (newToken) => {
    setToken(newToken);
    localStorage.setItem('authToken', newToken);

    try {
      const decodedToken = jwt_decode(newToken);
      const userId = decodedToken?.userId ?? null;
      setUserId(userId);
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  };

  const handleLogout = () => {
    setToken(null);
    setUserId(null);
    localStorage.removeItem('authToken');
  };

  return (
    <AuthContext.Provider value={{ token, userId, handleLogin, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
