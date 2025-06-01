import axios from 'axios';
import { BASE_URL } from '../utils/apiConfig';

export async function getAllUsers() {
  try {
    const authToken = localStorage.getItem('authToken');
    const resp = await axios.get(
      `${BASE_URL}/Users`,
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

export async function changeUserRole(userId, role) {
  try {
    const token = localStorage.getItem('authToken');
    await axios.put(
      `${BASE_URL}/Users/${userId}/role`, 
      { role },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return { success: true };
  } catch (e) {
    return { success: false }
  }
}