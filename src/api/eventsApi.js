import axios from 'axios';
import { BASE_URL } from '../utils/apiConfig';

export const getAllEvents = async (pageNumber, pageSize) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/BoardGames/filtered`,
      {
        pageNumber,
        pageSize
      },
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );

    if (response.status === 200) {
      return { success: true, data: response.data };
    }

    return { success: false, message: 'Failed to fetch events' };
  } catch (error) {
    const serverMsg = error.response?.data?.message || '';
    console.error("Fetch error:", serverMsg);
    return {
      success: false,
      message: serverMsg || "Fetching events failed"
    };
  }
};
