import { getToken, saveToken, removeToken } from './indexdb';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Include cookies for refresh token
  headers: {
    'Content-Type': 'application/json',
  },
});

export class ApiError extends Error {
    constructor(message, status) {
      super(message);
      this.status = status;
    }
  }

  async function requestWithAuth(config) {
    const accessToken = await getToken();
    
    // Add authorization header if token exists
    if (accessToken) {
      config.headers = {
        ...config.headers,
        'Authorization': `Bearer ${accessToken}`
      };
    }
  
    try {
      const response = await apiClient(config);
      return response.data;
    } catch (error) {
      // Handle 401 Unauthorized (token refresh logic)
      if (error.response?.status === 401 && config.url !== '/auth/refresh-token') {
        try {
          const refreshed = await refreshAccessToken();
          if (refreshed) {
            // Retry the original request with new access token
            return requestWithAuth(config);
          } else {
            await removeToken();
            throw new ApiError('Session expired', 401);
          }
        } catch (refreshError) {
          await removeToken();
          throw new ApiError('Authentication failed', 401);
        }
      }
  
      // Handle other errors
      throw new ApiError(
        error.response?.data?.message || 'Something went wrong',
        error.response?.status || 500
      );
    }
  }

  export async function refreshAccessToken() {
    try {
      const response = await apiClient.post('/auth/refresh-token');
      await saveToken(response.data.accessToken);
      return true;
    } catch (error) {
      return false;
    }
  }

  export const authApi = {
    adminLogin: async (email, password) => {
      try {
        const response = await apiClient.post('/auth/admin/login', { email, password });
        if (response.data.accessToken) {
          await saveToken(response.data.accessToken);
        }
        return response.data;
      } catch (error) {
        throw new ApiError(
          error.response?.data?.message || 'Login failed',
          error.response?.status || 500
        );
      }
    },
    
    researcherLogin: async (email, password) => {
      try {
        const response = await apiClient.post('/auth/researcher/login', { email, password });
        if (response.data.accessToken) {
          await saveToken(response.data.accessToken);
        }
        return response.data;
      } catch (error) {
        throw new ApiError(
          error.response?.data?.message || 'Login failed',
          error.response?.status || 500
        );
      }
    },
    
    logout: async () => {
      try {
        await apiClient.post('/auth/logout');
        await removeToken();
      } catch (error) {
        throw new ApiError(
          error.response?.data?.message || 'Logout failed',
          error.response?.status || 500
        );
      }
    },
    
    completeProfile: async (token, formData) => {
      try {
        // Special axios instance for form data
        const response = await axios.post(`${API_URL}/auth/complete-profile/${token}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        return response.data;
      } catch (error) {
        throw new ApiError(
          error.response?.data?.message || 'Failed to complete profile',
          error.response?.status || 500
        );
      }
    },
    
    inviteResearcher: async (email) => {
      return requestWithAuth({
        method: 'post',
        url: '/auth/admin/invite',
        data: { email }
      });
    },
  };

  export const articlesApi = {
    getArticles: async (category) => {
      return requestWithAuth({
        method: 'get',
        url: '/articles',
        params: category ? { category } : {}
      });
    },
    
    getArticle: async (id) => {
      return requestWithAuth({
        method: 'get',
        url: `/articles/${id}`
      });
    },
    
    createArticle: async (articleData) => {
      return requestWithAuth({
        method: 'post',
        url: '/admin/articles',
        data: articleData
      });
    },
    
    updateArticle: async (id, articleData) => {
      return requestWithAuth({
        method: 'put',
        url: `/admin/articles/${id}`,
        data: articleData
      });
    },
    
    addComment: async (articleId, text) => {
      return requestWithAuth({
        method: 'post',
        url: `/articles/${articleId}/comments`,
        data: { text }
      });
    },
    
    deleteComment: async (commentId) => {
      return requestWithAuth({
        method: 'delete',
        url: `/admin/comments/${commentId}`
      });
    },
  };

  export const researchersApi = {
    getResearchers: async () => {
      return requestWithAuth({
        method: 'get',
        url: '/researchers'
      });
    },
    
    getResearcher: async (id) => {
      return requestWithAuth({
        method: 'get',
        url: `/researchers/${id}`
      });
    },
    
    getResearcherArticles: async (id) => {
      return requestWithAuth({
        method: 'get',
        url: `/researchers/${id}/articles`
      });
    },
  };