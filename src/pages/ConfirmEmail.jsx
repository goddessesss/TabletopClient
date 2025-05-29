import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { confirmEmailToken } from '../api/profileApi.js';

export default function EmailConfirmationPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const token = new URLSearchParams(location.search).get('token');
  const [status, setStatus] = useState('pending'); 

  useEffect(() => {
    if (!token) {
      setStatus('no-token');
      return;
    }
    async function confirm() {
      try {
        await confirmEmailToken(token);
        setStatus('success');
      } catch {
        setStatus('error');
      }
    }
    confirm();
  }, [token]);

  const handleGoHome = () => {
    navigate('/');
  };

  if (status === 'pending') {
    return (
      <div className="container">
        <p className="message">Confirming email...</p>
      </div>
    );
  }

  if (status === 'no-token' || status === 'error') {
    return (
      <div className="confirmation-container">
        <ErrorIcon />
        <p className="message errorMessage">
          {status === 'no-token'
            ? 'Failed to retrieve confirmation token.'
            : 'An error occurred during email confirmation.'}
        </p>
        <button className="errorButton" onClick={handleGoHome}>
          Go back to homepage
        </button>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="confirmation-container">
        <SuccessIcon />
        <h1 className="title">Email successfully confirmed!</h1>
        <p className="subtitle">
          Thank you for confirming your email address.
        </p>
        <button className="button" onClick={handleGoHome}>
          Go back to homepage
        </button>
      </div>
    );
  }

  return null;
}

function SuccessIcon() {
  return (
    <svg
      style={{ marginBottom: 20 }}
      xmlns="http://www.w3.org/2000/svg"
      width="100"
      height="100"
      fill="none"
      viewBox="0 0 24 24"
      stroke="#27ae60"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" stroke="#27ae60" strokeWidth="2" fill="#2ecc71" />
      <path d="M16 9l-5 5-3-3" stroke="#fff" strokeWidth="2" />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg
      style={{ marginBottom: 20 }}
      xmlns="http://www.w3.org/2000/svg"
      width="100"
      height="100"
      fill="none"
      viewBox="0 0 24 24"
      stroke="#e74c3c"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" stroke="#e74c3c" strokeWidth="2" fill="#f1948a" />
      <line x1="15" y1="9" x2="9" y2="15" stroke="#fff" strokeWidth="2" />
      <line x1="9" y1="9" x2="15" y2="15" stroke="#fff" strokeWidth="2" />
    </svg>
  );
}
