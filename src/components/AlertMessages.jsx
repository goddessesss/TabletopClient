import React, { useEffect, useState } from 'react';
import { Alert } from 'react-bootstrap';

function AlertMessage({ message, onClose }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (message) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        if (onClose) onClose();
      }, 3000); 

      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!visible || !message) return null;

  const variant = message.toLowerCase().includes('успішн') ? 'success' : 'danger';

  return (
    <div
      style={{
        position: 'fixed',
        top: '200px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        width: '70%',
      }}
    >
      <Alert
        variant={variant}
        onClose={() => setVisible(false)}
        dismissible
      >
        {message}
      </Alert>
    </div>
  );
}

export default AlertMessage;
