import axios from "axios";
import { BASE_URL } from "../utils/apiConfig";

export async function getAllGameClubs() {
  try {
    const resp = await axios.get(
      `${BASE_URL}/GameClubs`,
    );
    if (!resp.status === 200)
        return { success: false }
    return { success: true, data: resp.data };
  } catch (e) {
    return { success: false }
  }
}

export async function getClubOwnerGameClubs() {
  try {
    const authToken = localStorage.getItem('authToken');
    const resp = await axios.get(
      `${BASE_URL}/GameClubs`, {
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json',
                'accept': '*/*',
            }
       }
    );
    if (!resp.status === 200)
        return { success: false }
    return { success: true, data: resp.data };
  } catch (e) {
    return { success: false }
  }
}