import axios from 'axios';
import { BASE_URL } from '../utils/apiConfig';

export async function getOverallStatistics() {
  try {
    const authToken = localStorage.getItem('authToken');
    const resp = await axios.get(
      `${BASE_URL}/Statistics/overall`,
       {
        headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json',
            'accept': '*/*',
            }
       }
    );
    if (resp.status === 200)
        return { success: true, data: resp.data };
    else
        return { success: false }
  } catch (e) {
    return { success: false }
  }
}

export async function getEventPlayersStatistics() {
  try {
    const authToken = localStorage.getItem('authToken');
    const resp = await axios.get(
      `${BASE_URL}/Statistics/event-players`,
       {
        headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json',
            'accept': '*/*',
            }
       }
    );
    if (resp.status === 200)
        return { success: true, data: resp.data };
    else
        return { success: false }
  } catch (e) {
    return { success: false }
  }
}

export async function getEventTypesStatistics() {
  try {
    const authToken = localStorage.getItem('authToken');
    const resp = await axios.get(
      `${BASE_URL}/Statistics/event-types`,
       {
        headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json',
            'accept': '*/*',
            }
       }
    );
    if (resp.status === 200)
        return { success: true, data: resp.data };
    else
        return { success: false }
  } catch (e) {
    return { success: false }
  }
}