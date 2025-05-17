import axios from 'axios';
import { BASE_URL } from '../utils/apiConfig';

export const getCitiesBySearch = async (searchTerm) => {
  try {
    const authToken = localStorage.getItem('authToken');
    const response = await axios.get(
      `${BASE_URL}/Geo/locations?search=${encodeURIComponent(searchTerm)}&limit=10`,
      {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'accept': '*/*',
        }
      }
    );

    console.log('API Response data:', response.data);

    if (response.status === 200 && Array.isArray(response.data)) {
      return { success: true, data: response.data };
    } else {
      return { success: false, message: 'Invalid response data format' };
    }
  } catch (error) {
    const serverMsg = error.response?.data?.message || '';
    console.error("Error fetching cities:", serverMsg);
    return {
      success: false,
      message: serverMsg || "Fetching cities failed"
    };
  }
};

export const addEvent = async (eventData) => {
  try {
    const authToken = localStorage.getItem('authToken');
    const response = await axios.post(
      `${BASE_URL}/Events`,
      eventData,
      {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
          'accept': '*/*',
        }
      }
    );

    if (response.status === 200 || response.status === 201) {
      return { success: true, data: response.data };
    }

    return { success: false, message: 'Failed to add event' };
  } catch (error) {
    const serverMsg = error.response?.data?.message || '';
    console.error("Error adding event:", serverMsg);
    return {
      success: false,
      message: serverMsg || "Adding event failed"
    };
  }
};

export const getEventTypes = async () => {
  try {
    const authToken = localStorage.getItem('authToken'); 
    const response = await axios.get(
      `${BASE_URL}/Classifiers/categories`,
      {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching event types:', error);
    throw error;
  }
};

export async function getAllEvents(pageNumber, pageSize, search, filters) {
  try {
    const response = await axios.post(`${BASE_URL}/Events/filtered`, {
      pageNumber,
      pageSize,
      search,
      Filter: filters,
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
}

export const getCreatedEvents = async () => {
  try {
    const authToken = localStorage.getItem('authToken');

    const response = await axios.get(
      `${BASE_URL}/PlayerProfiles/created-events`,
      {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'accept': '*/*'
        }
      }
    );

    if (response.status === 200) {
      return { success: true, data: response.data };
    }

    return { success: false, message: 'Failed to fetch created events' };
  } catch (error) {
    const serverMsg = error.response?.data?.message || 'Error loading created events';
    console.error("Error fetching created events:", serverMsg);
    return {
      success: false,
      message: serverMsg,
    };
  }
};
export const getBoardGamesNames = async (search = "") => {
  try {
    const authToken = localStorage.getItem('authToken');
    const response = await axios.post(
      `${BASE_URL}/BoardGames/names`,
      { search },
      {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
          'accept': '*/*',
        }
      }
    );

    if (response.status === 200 && response.data && Array.isArray(response.data.boardGames)) {
      return { success: true, data: response.data.boardGames, total: response.data.total };
    } else {
      return { success: false, message: 'Invalid response data format' };
    }
  } catch (error) {
    const serverMsg = error.response?.data?.message || '';
    console.error("Error fetching board games:", serverMsg);
    return {
      success: false,
      message: serverMsg || "Fetching board games failed"
    };
  }
};
