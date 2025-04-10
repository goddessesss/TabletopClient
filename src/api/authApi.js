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
