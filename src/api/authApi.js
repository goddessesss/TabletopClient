import axios from 'axios';
import { BASE_URL } from '../utils/apiConfig';

export const authenticate = async (isLoginMode, email, password) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/Auth/${isLoginMode ? 'login' : 'register'}`,
      { email, password },
      { headers: { 'Content-Type': 'application/json' } }
    );

    if (isLoginMode && response.status === 200 && response.data.token) {
      return { success: true, token: response.data.token };
    }

    if (!isLoginMode && response.status === 200) {
      return { success: true, message: 'Registration successful' };
    }

    return { success: false, message: 'Something went wrong' };
  } catch (error) {
    const serverMsg = error.response?.data?.message || '';
    console.error("Auth error:", serverMsg);
    return {
      success: false,
      message: serverMsg || "Authentication failed"
    };
  }
};

export const authenticateWithGoogle = async (googleToken) => {
  try {
    const response = await axios.post(`${BASE_URL}/Auth/google-login`, {
      token: googleToken,
    });

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error('Google authentication failed');
    }
  } catch (error) {
    console.error('Error during Google login:', error);
    throw error;
  }
};

export async function linkGoogleAccount(GoogleToken) {
  const authToken = localStorage.getItem('authToken');
  if (!authToken) {
    return { success: false, message: 'Failed to obtain authToken' };
  }

  try {
    const response = await fetch(`${BASE_URL}/Auth/link-google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify({ googleToken: GoogleToken }), 
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, message: errorData.message || 'Request failed' };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, message: error.message || 'Error during request' };
  }
}

export const sendPasswordResetEmail = async (email) => {
  try {
    const encodedEmail = encodeURIComponent(email);

    const response = await axios.post(
      `${BASE_URL}/Auth/${encodedEmail}/password-reset/send`,
      {},
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );

    if (response.status === 200) {
      return { success: true, message: 'Password reset email sent successfully' };
    }

    return { success: false, message: 'Failed to send password reset email' };
  } catch (error) {
    const serverMsg = error.response?.data?.message || 'Error resetting password';
    console.error('Password reset error:', serverMsg);
    console.error('Error details:', error.response?.data);

    if (error.response) {
      return {
        success: false,
        message: error.response?.data?.message || "Password reset failed, please try again."
      };
    } else if (error.request) {
      console.error('No response from server:', error.request);
      return { success: false, message: 'No response from server, please try again later.' };
    } else {
      console.error('Request setup error:', error.message);
      return { success: false, message: 'An error occurred while sending the request.' };
    }
  }
};

export const sendEmailConfirmation = async () => {
  const authToken = localStorage.getItem('authToken'); 

  if (!authToken || typeof authToken !== 'string') {
    return { success: false, message: 'Authorization token is missing or invalid.' };
  }

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/send-confirmation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, message: errorData.message || 'Email confirmation error' };
    }

    return { success: true };
  } catch (error) {
    return { success: false, message: 'Server error during email confirmation' };
  }
};
