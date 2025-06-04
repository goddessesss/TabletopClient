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

    return { success: false, message: 'Failed to create an event' };
  } catch (error) {
    const serverMsg = error.response?.data?.message || '';
    console.error("Error while creating event:", serverMsg);
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

export async function getAllEvents(pageNumber, pageSize, search, filters, sorting) {
  try {
    const response = await axios.post(`${BASE_URL}/Events/filtered`, {
      pageNumber,
      pageSize,
      search,
      Filter: filters || {},  // якщо filters null, то пустий об’єкт
      Sorting: sorting
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

export async function fetchCityName(latitude, longitude) {
  if (!latitude || !longitude) return null;

  const cacheKey = `cityName_${latitude}_${longitude}`;

  const cachedCity = localStorage.getItem(cacheKey);
  if (cachedCity) {
    return cachedCity;
  }

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
    );
    const data = await response.json();

    const cityName =
      data.address.city ||
      data.address.town ||
      data.address.village ||
      data.address.county ||
      'Unknown location';

    localStorage.setItem(cacheKey, cityName);

    return cityName;
  } catch (error) {
    console.error('Error fetching city name:', error);
    return null;
  }
}

export const getEventById = async (eventId) => {
  try {
    const authToken = localStorage.getItem('authToken');
    const response = await axios.get(
      `${BASE_URL}/Events/${eventId}`,
      {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'accept': '*/*',
        }
      }
    );

    if (response.status === 200 && response.data) {
      return { success: true, data: response.data };
    } else {
      return { success: false, message: 'Failed to fetch event details' };
    }
  } catch (error) {
    const serverMsg = error.response?.data?.message || '';
    console.error('Error fetching event by ID:', serverMsg);
    return {
      success: false,
      message: serverMsg || 'Fetching event details failed'
    };
  }
};

export const joinEvents = async (eventId, playerId) => {
  try {
    const authToken = localStorage.getItem('authToken');
    const response = await axios.post(
      `${BASE_URL}/Events/${eventId}/participations/${playerId}`,
      null,
      {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'accept': '*/*',
        }
      }
    );

    if (response.status === 200 || response.status === 201) {
      return { success: true, data: response.data };
    } else {
      return { success: false, message: 'Failed to join event' };
    }
  } catch (error) {
    const serverMsg = error.response?.data?.message || '';
    console.error('Error joining event:', serverMsg);
    return {
      success: false,
      message: serverMsg || 'Joining event failed',
    };
  }
};

export const getParticipants = async (eventId) => {
  try {
    const authToken = localStorage.getItem('authToken');
    const response = await axios.get(
      `${BASE_URL}/Events/${eventId}/participations`,
      {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'accept': '*/*',
        }
      }
    );

    if (response.status === 200 && response.data) {
      return { success: true, data: response.data };
    } else {
      return { success: false, message: 'Failed to fetch event details' };
    }
  } catch (error) {
    const serverMsg = error.response?.data?.message || '';
    console.error('Error fetching event by ID:', serverMsg);
    return {
      success: false,
      message: serverMsg || 'Fetching event details failed'
    };
  }
};

export async function deleteEventById(eventId) {
  try {
    const response = await axios.delete(`${BASE_URL}/Events/${eventId}`);
    return response.status === 204 ? true : response.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message || "Failed to delete event";
    throw new Error(message);
  }
}

export async function cancelEvent(eventId) {
  try {
    const response = await axios.post(`${BASE_URL}/Events/${eventId}/cancel`);
    return response.data;
  } catch (error) {
    throw error;
  }
}
export const updateEvents = async (id, eventData) => {
  try {
    const response = await axios.put(`${BASE_URL}/Events/${id}`, eventData);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Update event error:', error.response?.data || error.message);
    return { success: false, message: error.response?.data || error.message };
  }
};

export async function unjoinEvents(eventId, participantsId) {
  const authToken = localStorage.getItem('authToken');

  try {
    const response = await axios.delete(
      `${BASE_URL}/Events/${eventId}/participations/${participantsId}`, 
      {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        }
      }
    );
    return { success: true, data: response.data };
  } catch (error) {
    const message = error.response?.data || error.message || 'Unknown error';
    return { success: false, message };
  }
}

export const getCalendarEvents = async () => {
  try {
    const authToken = localStorage.getItem('authToken');
    const headers = authToken ? { Authorization: `Bearer ${authToken}` } : {};
    
    const response = await axios.get(`${BASE_URL}/PlayerProfiles/calendar-events`, { headers });

    return {
      success: true,
      data: response.data || [],
    };
  } catch (error) {
    console.error("Error fetching calendar events:", error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to get calendar events',
    };
  }
};