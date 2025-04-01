import axios from 'axios';
import { BASE_URL } from '../utils/apiConfig';

export const authenticate = async (isLoginMode, email, password) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/Auth/${isLoginMode ? 'login' : 'register'}`,
      { email, password },
      { headers: { 'Content-Type': 'application/json' } }
    );

    if (response.status === 200 && response.data.token) {
      return { success: true, token: response.data.token };
    } else {
      return { success: false, message: 'Token not received' };
    }
  } catch (error) {
    console.error("Auth error:", error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || "Authentication failed"
    };
  }
};
