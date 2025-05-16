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
    const authToken = localStorage.getItem('authToken');
    const headers = authToken ? { Authorization: `Bearer ${authToken}` } : {};

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

export const toggleFavoriteGame = async (boardGameId) => {
  try {
    const authToken = localStorage.getItem('authToken');
    const headers = authToken ? { Authorization: `Bearer ${authToken}` } : {};

    const response = await axios.post(
      `${BASE_URL}/PlayerProfiles/favourite-games/${boardGameId}`,
      {},
      { headers }
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("Error changing favorite game status:", error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to change game status.',
    };
  }
};

export const getFavoriteBoardGames = async () => {
  try {
    const authToken = localStorage.getItem('authToken');
    const headers = authToken ? { Authorization: `Bearer ${authToken}` } : {};
    
    const response = await axios.get(`${BASE_URL}/PlayerProfiles/favourite-games`, { headers });

    return {
      success: true,
      favorites: response.data.favorites || [],
    };
  } catch (error) {
    console.error("Error fetching favorite games:", error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to get favorite games.',
    };
  }
};
