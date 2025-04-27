import axios from 'axios';
import { BASE_URL } from '../utils/apiConfig';

export async function getAllEvents(pageNumber, pageSize) {
  try {
    const response = await axios.post(`${BASE_URL}/BoardGames/filtered`, {
      pageNumber: pageNumber,
      pageSize: pageSize
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log("Response data:", response.data);
    return response.data;
  } catch (error) {
    console.error('Fetch error: ', error);
    return { success: false, message: error.message };
  }
}

export const getBoardGameById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/BoardGames/${id}`);
    if (response.status === 200) {
      return { success: true, data: response.data };
    }

    return { success: false, message: 'Failed to fetch board game details' };
  } catch (error) {
    const serverMsg = error.response?.data?.message || '';
    console.error("Fetch error by ID:", serverMsg);
    return {
      success: false,
      message: serverMsg || "Fetching board game failed"
    };
  }
};

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

export const fetchClassifiers = async () => {
  try {
    const token = localStorage.getItem('authToken'); 

    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const [genreData, designerData, familyData, mechanicData, themeData, publisherData] = await Promise.all([
      axios.get(`${BASE_URL}/Classifiers/categories`, { headers }),
      axios.get(`${BASE_URL}/Classifiers/designers`, { headers }),
      axios.get(`${BASE_URL}/Classifiers/families`, { headers }),
      axios.get(`${BASE_URL}/Classifiers/mechanics`, { headers }),
      axios.get(`${BASE_URL}/Classifiers/themes`, { headers }),
      axios.get(`${BASE_URL}/Classifiers/publishers`, { headers })
    ]);

    return {
      genres: genreData.data,
      designers: designerData.data,
      families: familyData.data,
      mechanics: mechanicData.data,
      themes: themeData.data,
      publishers: publisherData.data,
    };
  } catch (error) {
    console.error('Error fetching classifiers:', error);
    throw new Error('Error fetching classifiers');
  }
};
