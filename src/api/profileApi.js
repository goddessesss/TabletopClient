import axios from 'axios';
import { BASE_URL } from '../utils/apiConfig';

export const getUserProfile = async () => {
  try {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      console.error("No authToken found.");
      return { success: false, message: "No authToken found" };
    }

    const response = await axios.get(`${BASE_URL}/PlayerProfiles/my`, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Accept': 'application/json',
      },
    });

    if (response.status === 200 && response.data) {
      return { success: true, data: response.data };
    } else {
      return { success: false, message: 'Invalid response data format' };
    }
  } catch (error) {
    const serverMsg = error.response?.data?.message || error.message || "Fetching user profile failed";
    console.error("Error fetching user profile:", serverMsg);
    return { success: false, message: serverMsg };
  }
};

export const updateUserProfile = async (data) => {
  try {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      console.error("No authToken found.");
      return { success: false, message: "No authToken found" };
    }

    const response = await axios.put(`${BASE_URL}/PlayerProfiles`, data, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 200) {
      return { success: true, data: response.data };
    } else {
      return { success: false, message: "Unexpected response status" };
    }
  } catch (error) {
    const serverMsg = error.response?.data?.message || error.message || "Profile update failed";
    console.error("Error updating profile:", serverMsg);
    return { success: false, message: serverMsg };
  }
};

export const uploadProfilePicture = async (formData) => {
  try {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      return { success: false, message: "No authToken found" };
    }

    const response = await axios.post(`${BASE_URL}/PlayerProfiles/profile-picture`, formData, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.status === 200) {
      return { success: true, data: response.data };
    } else {
      return { success: false, message: "Unexpected response status" };
    }
  } catch (error) {
    const serverMsg = error.response?.data?.message || error.message || "Profile picture upload failed";
    console.error("Error uploading profile picture:", serverMsg);
    return { success: false, message: serverMsg };
  }
};

export const sendEmailConfirmation = async () => {
  const authToken = localStorage.getItem('authToken');

  if (!authToken || typeof authToken !== 'string') {
    return { success: false, message: 'Authorization token is missing or invalid.' };
  }

  const url = `${BASE_URL}/Auth/email-confirmation/send`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });

    if (!response.ok) {
      const errorData = await response.json();
      if (errorData.validationErrors?.length > 0) {
        return { success: false, message: errorData.validationErrors[0].message };
      }
      return { success: false, message: errorData.message || 'Email confirmation error' };
    }

    return { success: true };
  } catch (error) {
    console.error("Email confirmation error:", error);
    return { success: false, message: 'Server error during email confirmation' };
  }
};

export const confirmEmailToken = async (token) => {
  const authToken = localStorage.getItem('authToken');

  try {
    const response = await axios.post(
      `${BASE_URL}/Auth/email-confirmation/confirm/${token}`,
      {},
      {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Accept': 'application/json',
        },
      }
    );

    return {
      success: true,
      message: response.data.message,
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Помилка при підтвердженні email",
    };
  }
};

export const getSettings = async () => {
  try {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      console.error("No authToken found.");
      return { success: false, message: "No authToken found" };
    }

    const response = await axios.get(`${BASE_URL}/Auth/settings`, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Accept': 'application/json',
      },
    });

    if (response.status === 200 && response.data) {
      return { success: true, data: response.data };
    } else {
      return { success: false, message: 'Invalid response data format' };
    }
  } catch (error) {
    const serverMsg = error.response?.data?.message || error.message || "Fetching settings failed";
    console.error("Error fetching settings:", serverMsg);
    return { success: false, message: serverMsg };
  }
};
