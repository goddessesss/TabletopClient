import React, { useEffect } from 'react';
import { Alert } from 'react-bootstrap';

export default function NotificationContainer({ notifications, removeNotification }) {
  useEffect(() => {
    notifications.forEach(n => {
      if (!n._timeout) {
        const timeout = setTimeout(() => {
          removeNotification(n.id);
        }, 4000);
        n._timeout = timeout;
      }
    });
  }, [notifications, removeNotification]);

  return (
    <div style={{
      position: 'fixed',
      top: 20,
      right: 20,
      zIndex: 9999,
      width: 320,
    }}>
      {notifications.map(({ id, message, variant }) => (
        <Alert
          key={id}
          variant={variant}
          onClose={() => removeNotification(id)}
          dismissible
        >
          {message}
        </Alert>
      ))}
    </div>
  );
}