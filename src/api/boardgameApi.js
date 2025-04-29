import axios from 'axios';
import { BASE_URL } from '../utils/apiConfig';

export async function getAllBoardGames(pageNumber, pageSize, search, filters) {
    try {
  
      const response = await axios.post(`${BASE_URL}/BoardGames/filtered`, {
        pageNumber,
        pageSize,
        search,
        filter: filters,
      });
    
      return response.data;
    } catch (error) {
      console.error('Error fetching board games:', error);
      throw error;
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
  