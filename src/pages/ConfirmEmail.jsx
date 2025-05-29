import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { confirmEmailToken } from '../api/profileApi.js';

export default function ConfirmEmail() {
  const [searchParams] = useSearchParams();
  const [statusMessage, setStatusMessage] = useState('Confirmation in progress...');

  useEffect(() => {
    const token = searchParams.get('token');

    if (token) {
      console.log('Token from URL:', token);

      confirmEmailToken(token).then(result => {
        if (result.success) {
          setStatusMessage(`Success: ${result.message}`);
        } else {
          setStatusMessage(`Error: ${result.message}`);
        }
      });
    } else {
      setStatusMessage('Token not found in URL');
    }
  }, [searchParams]);

  return (
    <div>
      <h1>Email Confirmation</h1>
      <p>{statusMessage}</p>
    </div>
  );
}
