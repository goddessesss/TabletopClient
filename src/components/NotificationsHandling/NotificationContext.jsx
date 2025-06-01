import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import NotificationContainer from './NotificationContainer';

const NotificationContext = createContext({
  notifications: [],            // [{ id, message, code?, variant }]
  addNotification: () => {},    // ({ message, code?, variant }) => void
  removeNotification: () => {}  // id => void
});

export function useNotifications() {
  return useContext(NotificationContext);
}

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  const addNotification = ({ message, code, variant = 'danger' }) => {
    const id = Date.now() + Math.random();
    setNotifications(prev => [...prev, { id, message, code, variant }]);
  };

  const removeNotification = id => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      resp => resp,
      err => {
        const resp = err.response;
        if (
          resp &&
          resp.data &&
          typeof resp.data === 'object'
        ) {
          if (resp.status === 400 && typeof resp.data.message === 'string') {
            addNotification({ message: resp.data.message, variant: 'danger' });
          }
          if (Array.isArray(resp.data.validationErrors)) {
            resp.data.validationErrors.forEach(item => {
              if (item && typeof item.message === 'string') {
                addNotification({ message: item.message, variant: 'danger' });
              }
            });
          }
        }
        return Promise.reject(err);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []); 

  return (
    <NotificationContext.Provider value={{
      notifications,
      addNotification,
      removeNotification
    }}>
      {children}
      <NotificationContainer 
        notifications={notifications}
        removeNotification={removeNotification}
      />
    </NotificationContext.Provider>
  );
}