import axios from 'axios';
import { BASE_URL } from '../utils/apiConfig';

export async function getClassifiers(type) {
  try {
    const resp = await axios.get(
      `${BASE_URL}/Classifiers/${type}`,
    );
    return { success: true, data: resp.data };
  } catch (e) {
    return { success: false }
  }
}

export async function createClassifier(type, payload) {
  try {
    const token = localStorage.getItem('authToken');
    await axios.post(
      `${BASE_URL}/Classifiers/${type}`, 
      payload,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return { success: true };
  } catch (e) {
    return { success: false }
  }
}

export async function updateClassifier(type, id, payload) {
  try {
    const token = localStorage.getItem('authToken');
    await axios.put(
      `${BASE_URL}/Classifiers/${type}/${id}`, 
      payload,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return { success: true };
  } catch (e) {
    return { success: false }
  }
}

export async function deleteClassifier(type, id) {
  try {
    const token = localStorage.getItem('authToken');
    await axios.delete(
      `${BASE_URL}/Classifiers/${type}/${id}`, 
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return { success: true };
  } catch (e) {
    return { success: false }
  }
}