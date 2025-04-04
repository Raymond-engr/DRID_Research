import { getToken, saveToken, removeToken } from './indexdb';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

async function fetchWithAuth(endpoint, options = {}) {
  const accessToken = await getToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }
  
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include',  // Include cookies for refresh token
  });
  
  // If unauthorized and not already attempting to refresh token
  if (response.status === 401 && endpoint !== '/auth/refresh-token') {
    try {
      const refreshed = await refreshAccessToken();
      if (refreshed) {
        // Retry the original request with new access token
        return fetchWithAuth(endpoint, options);
      } else {
        throw new ApiError('Session expired', 401);
      }
    } catch (error) {
      await removeToken();
      throw new ApiError('Authentication failed', 401);
    }
  }
  
  // Handle other errors
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new ApiError(error.message || 'Something went wrong', response.status);
  }
  
  return response.json();
}

export async function refreshAccessToken() {
  try {
    const response = await fetch(`${API_URL}/auth/refresh-token`, {
      method: 'POST',
      credentials: 'include',
    });
    
    if (!response.ok) return false;
    
    const data = await response.json();
    await saveToken(data.accessToken);
    return true;
  } catch (error) {
    return false;
  }
}

// Auth API endpoints
export const authApi = {
  adminLogin: async (email, password) => {
    const data = await fetchWithAuth('/auth/admin/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (data.accessToken) {
      await saveToken(data.accessToken);
    }
    
    return data;
  },
  
  researcherLogin: async (email, password) => {
    const data = await fetchWithAuth('/auth/researcher/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (data.accessToken) {
      await saveToken(data.accessToken);
    }
    
    return data;
  },
  
  logout: async () => {
    await fetchWithAuth('/auth/logout', { method: 'POST' });
    await removeToken();
  },
  
  completeProfile: async (token, formData) => {
    // Using fetch directly since this doesn't require auth
    const response = await fetch(`${API_URL}/auth/complete-profile/${token}`, {
      method: 'POST',
      body: formData, // FormData for file upload
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new ApiError(error.message || 'Failed to complete profile', response.status);
    }
    
    return response.json();
  },
  
  inviteResearcher: async (email) => {
    return fetchWithAuth('/auth/admin/invite', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },
};

// Articles API endpoints
export const articlesApi = {
  getArticles: async (category) => {
    const queryParams = category ? `?category=${category}` : '';
    return fetchWithAuth(`/articles${queryParams}`);
  },
  
  getArticle: async (id) => {
    return fetchWithAuth(`/articles/${id}`);
  },
  
  createArticle: async (articleData) => {
    return fetchWithAuth('/admin/articles', {
      method: 'POST',
      body: JSON.stringify(articleData),
    });
  },
  
  updateArticle: async (id, articleData) => {
    return fetchWithAuth(`/admin/articles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(articleData),
    });
  },
  
  addComment: async (articleId, text) => {
    return fetchWithAuth(`/articles/${articleId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
  },
  
  deleteComment: async (commentId) => {
    return fetchWithAuth(`/admin/comments/${commentId}`, {
      method: 'DELETE',
    });
  },
};

// Researchers API endpoints
export const researchersApi = {
  getResearchers: async () => {
    return fetchWithAuth('/researchers');
  },
  
  getResearcher: async (id) => {
    return fetchWithAuth(`/researchers/${id}`);
  },
  
  getResearcherArticles: async (id) => {
    return fetchWithAuth(`/researchers/${id}/articles`);
  },
};