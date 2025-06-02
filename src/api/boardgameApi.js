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

export const addFavoriteGame = async (boardGameId) => {
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

export const getBoardGamesNames = async (search = "") => {
  try {
    const authToken = localStorage.getItem('authToken');
    const response = await axios.post(
      `${BASE_URL}/BoardGames/names`,
      { search },
      {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
          'accept': '*/*',
        }
      }
    );

    if (response.status === 200 && response.data && Array.isArray(response.data.boardGames)) {
      return { success: true, data: response.data.boardGames, total: response.data.total };
    } else {
      return { success: false, message: 'Invalid response data format' };
    }
  } catch (error) {
    const serverMsg = error.response?.data?.message || '';
    console.error("Error fetching board games:", serverMsg);
    return {
      success: false,
      message: serverMsg || "Fetching board games failed"
    };
  }
};
export const getRecommendations = async () => {
  try {
    const authToken = localStorage.getItem("authToken");

    const response = await axios.get(`${BASE_URL}/BoardGames/recommendations`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        Accept: "*/*",
      },
    });

    if (response.status === 200 && Array.isArray(response.data)) {
      return { success: true, data: response.data };
    } else {
      return { success: false, message: "Failed to fetch recommendations." };
    }
  } catch (error) {
    const serverMsg = error.response?.data?.message || "";
    console.error("Error fetching recommendations:", serverMsg);
    return {
      success: false,
      message: serverMsg || "Server request failed.",
    };
  }
};

export const getBoardGameUpdateDetails = async (bggId) => {
  try {
    const authToken = localStorage.getItem('authToken');
    const response = await axios.get(
      `${BASE_URL}/BoardGames/${bggId}/update-details`,
      {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
          'accept': '*/*',
        }
      }
    );

    if (response.status === 200 && response.data) {
      return { success: true, data: response.data };
    } else {
      return { success: false, message: 'Invalid response data format' };
    }
  } catch (error) {
    console.error("Error fetching board games update details:", error);
    return {
      success: false,
      message: "Error fetching board games update details"
    };
  }
};

export const deleteBoardGame = async (id) => {
  try {
    const authToken = localStorage.getItem('authToken');
    const response = await axios.delete(
      `${BASE_URL}/BoardGames/${id}`,
      {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        }
      }
    );
    return response.status === 200;
  } catch {
    console.log(`Error while deleting board game with id ${id}`);
    return false;
  }
};

export const createOrUpdateBoardGame = async (bggId) => {
  try {
    const authToken = localStorage.getItem('authToken');
    const response = await axios.post(
      `${BASE_URL}/BoardGames/${bggId}/create-or-update`,
      null,
      {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        }
      }
    );
    return response.status === 200;
  } catch {
    console.log(`Error while creating/updating board game with bgg id ${bggId}`);
    return false;
  }
};

export const getBoardGameFromBggSearch = async (search = "") => {
  try{
    const authToken = localStorage.getItem('authToken');
    const response = await axios.get(
      `${BASE_URL}/Bgg/search`,
      {
        params: { search },
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
          'accept': '*/*',
        }
      }
    );

    if (response.status === 200 && response.data && Array.isArray(response.data))
      return { success: true, data: response.data };
    else
      return { success: false, message: 'Invalid response data format' };
  }
  catch {
    const serverMsg = error.response?.data?.message || '';
    console.error("Error fetching board games from BGG:", serverMsg);
  }
}