import axios from 'axios';
import { BASE_URL } from '../utils/apiConfig';

export const getCitiesBySearch = async (searchTerm) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(
      `${BASE_URL}/Geo/locations?search=${searchTerm}&limit=10`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'accept': '*/*',
        }
      }
    );

    console.log('API Response:', response);  
    if (response.status === 200 && Array.isArray(response.data)) {
      return { success: true, data: response.data };
    } else {
      console.error('Unexpected response data format:', response.data);
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
    const token = localStorage.getItem('token');
    const response = await axios.post(
      `${BASE_URL}/Events`,
      eventData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
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
    const token = localStorage.getItem('token'); 
    const response = await axios.get(
      `${BASE_URL}/Classifiers/categories`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching event types:', error);
    throw error;
  }
};

export async function getAllEvents() {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(
      `${BASE_URL}/Events/filtered`, 
      {}, 
      {
        headers: {
          'Authorization': `Bearer ${token}`,  
        }
      }
    );

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error fetching events:', error);
    return {
      success: false,
      message: 'Error fetching events'
    };
  }
}
