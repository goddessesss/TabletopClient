import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

function AlertMessage({ message, variant, onClose, id }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 4500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isVisible) {
      const timer = setTimeout(() => {
        onClose(id);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose, id]);

  if (!message) return null;

  const alertClass = `alert ${variant === 'danger' ? 'alert-danger' : 'alert-success'} ${isVisible ? 'fade-in' : 'fade-out'}`;

  return (
    <div className={alertClass}>
      <span>{message}</span>
      <button className="close-btn" onClick={() => onClose(id)}>&times;</button>
    </div>
  );
}

AlertMessage.propTypes = {
  message: PropTypes.string.isRequired,
  variant: PropTypes.oneOf(['danger', 'success']).isRequired,
  onClose: PropTypes.func.isRequired,
  id: PropTypes.number.isRequired,
};

export default AlertMessage;
