import axios from 'axios';
import { BASE_URL } from '../utils/apiConfig';

export const getUserProfile = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error("No token found.");
      return { success: false, message: "No token found" };
    }

    const response = await axios.get(`${BASE_URL}/PlayerProfiles/my`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'accept': '*/*',
      },
    });

    if (response.status === 200 && response.data) {
      return { success: true, data: response.data };
    } else {
      console.error('Unexpected response format:', response.data);
      return { success: false, message: 'Invalid response data format' };
    }
  } catch (error) {
    const serverMsg = error.response?.data?.message || '';
    console.error("Error fetching user profile:", serverMsg);
    return {
      success: false,
      message: serverMsg || "Fetching user profile failed"
    };
  }
};

export const updateUserProfile = async (data) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error("No token found.");
      return { success: false, message: "No token found" };
    }

    const response = await axios.put(`${BASE_URL}/PlayerProfiles`, data, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error updating profile:", error.response?.data?.message);
    return {
      success: false,
      message: error.response?.data?.message || "Profile update failed"
    };
  }
};

export const uploadProfilePicture = async (formData) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return { success: false, message: "No token found" };
    }

    const response = await axios.post(`${BASE_URL}/PlayerProfiles/profile-picture`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error uploading profile picture:", error.response?.data?.message);
    return {
      success: false,
      message: error.response?.data?.message || "Profile picture upload failed"
    };
  }
};
