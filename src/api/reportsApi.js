import axios from 'axios';
import { BASE_URL } from '../utils/apiConfig';

export async function downloadPlayerEventsReport(playerId) {
  try {
    const authToken = localStorage.getItem('authToken');
    const headers = authToken ? { Authorization: `Bearer ${authToken}` } : {};

    const response = await axios.get(`${BASE_URL}/Reports/player/${playerId}/events`, {
      headers,
      responseType: 'blob',
    });

    const fileURL = URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
    window.open(fileURL, '_blank');
  } catch (error) {
    console.error('Error:', error);
  }
};


export async function downloadEventParticipantsReport(eventId) {
  try {
    const authToken = localStorage.getItem('authToken');
    const headers = authToken ? { Authorization: `Bearer ${authToken}` } : {};

    const response = await axios.get(`${BASE_URL}/Reports/events/${eventId}/participants`, {
      headers,
      responseType: 'blob',
    });

    const fileURL = URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
    window.open(fileURL, '_blank');
  } catch (error) {
    console.error('Error:', error);
  }
};