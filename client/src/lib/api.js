import { getToken, saveToken, removeToken } from "./indexdb";
import axios from "axios";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1";

const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

const MAX_RETRY_ATTEMPTS = 1;

async function requestWithAuth(config, retryCount = 0) {
  try {
    const accessToken = await getToken();
    console.log(
      "Token in requestWithAuth:",
      accessToken ? "Token exists" : "No token"
    );

    if (accessToken) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${accessToken}`,
      };
    } else {
      console.warn("No access token found when making authenticated request");
      if (config.url !== "/auth/refresh-token") {
        // Try to refresh token if we don't have one
        try {
          const refreshed = await refreshAccessToken();
          if (refreshed) {
            // Retry with the new token
            return requestWithAuth(config, retryCount);
          }
        } catch (refreshError) {
          console.error("Failed to refresh token:", refreshError);
          throw new ApiError("Authentication required", 401);
        }
      }
    }

    try {
      const response = await apiClient(config);
      return response.data;
    } catch (error) {
      // Handle 401 Unauthorized (token refresh logic)
      if (
        error.response?.status === 401 &&
        retryCount < MAX_RETRY_ATTEMPTS &&
        config.url !== "/auth/refresh-token"
      ) {
        console.log("Got 401, attempting token refresh...");
        try {
          const refreshed = await refreshAccessToken();
          if (refreshed) {
            // Retry the original request with new access token
            console.log("Token refreshed, retrying original request");
            return requestWithAuth(config, retryCount + 1);
          } else {
            console.log("Token refresh failed");
            await removeToken();
            throw new ApiError("Session expired", 401);
          }
        } catch (refreshError) {
          console.error("Error during token refresh:", refreshError);
          await removeToken();
          throw new ApiError("Authentication failed", 401);
        }
      }

      // Improved error handling with more specific information
      let errorMessage = "An unexpected error occurred";
      let errorStatus = error.response?.status || 500;

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
        // Network errors don't have response status
        if (error.message.includes("Network Error")) {
          errorStatus = 0;
          errorMessage =
            "Unable to connect to server. Please check your internet connection.";
        }
      }

      console.error(`API Error: ${errorStatus} - ${errorMessage}`);
      throw new ApiError(errorMessage, errorStatus);
    }
  } catch (error) {
    console.error("Error in requestWithAuth:", error);
    throw error;
  }
}

export async function refreshAccessToken() {
  try {
    console.log("Attempting to refresh token...");

    const response = await apiClient.post(
      "/auth/refresh-token",
      {},
      {
        withCredentials: true,
      }
    );

    console.log("Refresh response:", response.data);

    if (response.data.accessToken) {
      console.log("New access token received");
      await saveToken(response.data.accessToken);
      return true;
    } else {
      console.warn("No access token in refresh response");
      return false;
    }
  } catch (error) {
    console.error("Failed to refresh token:", error);
    console.error("Response data:", error.response?.data);
    console.error("Status code:", error.response?.status);
    return false;
  }
}

// Auth API remains the same
export const authApi = {
  adminLogin: async (email, password) => {
    try {
      const response = await apiClient.post("/auth/admin/login", {
        email,
        password,
      });
      if (response.data.accessToken) {
        await saveToken(response.data.accessToken);
      }
      return response.data;
    } catch (error) {
      throw new ApiError(
        error.response?.data?.message || "Login failed",
        error.response?.status || 500
      );
    }
  },

  researcherLogin: async (email, password) => {
    try {
      const response = await apiClient.post("/auth/researcher/login", {
        email,
        password,
      });
      if (response.data.accessToken) {
        await saveToken(response.data.accessToken);
      }
      return response.data;
    } catch (error) {
      throw new ApiError(
        error.response?.data?.message || "Login failed",
        error.response?.status || 500
      );
    }
  },

  // Verify token endpoint
  verifyToken: async () => {
    return requestWithAuth({
      method: "get",
      url: "/auth/verify-token",
    });
  },

  logout: async () => {
    try {
      await apiClient.post("/auth/logout");
      await removeToken();
    } catch (error) {
      throw new ApiError(
        error.response?.data?.message || "Logout failed",
        error.response?.status || 500
      );
    }
  },

  completeProfile: async (token, formData) => {
    try {
      // Special axios instance for form data
      const response = await axios.post(
        `${API_URL}/auth/complete-profile/${token}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new ApiError(
        error.response?.data?.message || "Failed to complete profile",
        error.response?.status || 500
      );
    }
  },

  inviteResearcher: async (email) => {
    return requestWithAuth({
      method: "post",
      url: "/admin/researchers/invite",
      data: { email },
    });
  },

  getInvitations: async () => {
    return requestWithAuth({
      method: "get",
      url: "/admin/invitations",
    });
  },

  resendInvitation: async (id) => {
    return requestWithAuth({
      method: "post",
      url: `/admin/invitations/${id}/resend`,
    });
  },

  deleteInvitation: async (id) => {
    return requestWithAuth({
      method: "delete",
      url: `/admin/invitations/${id}`,
    });
  },

  addResearcherProfile: async (formData) => {
    // Special instance for multipart/form-data
    return requestWithAuth({
      method: "post",
      url: "/admin/researchers/add",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};

// Updated Articles API
export const articlesApi = {
  // Get all articles with optional category filter
  getArticles: async (filters = {}) => {
    return requestWithAuth({
      method: "get",
      url: "/articles",
      params: filters,
    });
  },

  // Get a specific article by ID
  getArticle: async (id) => {
    return requestWithAuth({
      method: "get",
      url: `/articles/${id}`,
    });
  },

  // Create a new article (admin only)
  createArticle: async (formData) => {
    // For multipart form data with file uploads
    return requestWithAuth({
      method: "post",
      url: "/articles",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Update an existing article (admin only)
  updateArticle: async (id, formData) => {
    // For multipart form data with file uploads
    return requestWithAuth({
      method: "put",
      url: `/articles/${id}`,
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Delete an article (admin only)
  deleteArticle: async (id) => {
    return requestWithAuth({
      method: "delete",
      url: `/articles/${id}`,
    });
  },

  // Get dashboard data for articles
  getDashboardData: async (query) => {
    return requestWithAuth({
      method: "get",
      url: "/articles/dashboard",
      params: query ? { q: query } : {},
    });
  },
};

// New Article Views API
export const articleViewsApi = {
  // Record a view for an article (public)
  recordView: async (articleId) => {
    return apiClient.post(`/article-views/${articleId}/view`);
  },

  // Get popular articles (public)
  getPopularArticles: async (limit = 5, period = "all") => {
    return apiClient.get(`/article-views/popular`, {
      params: { limit, period },
    });
  },

  // Get view stats for a specific article (admin/researcher only)
  getArticleViewStats: async (articleId) => {
    return requestWithAuth({
      method: "get",
      url: `/article-views/${articleId}/stats`,
    });
  },
};

// New Faculty API
export const facultyApi = {
  // Get all faculties
  getFaculties: async () => {
    return apiClient.get("/faculty");
  },

  // Get a specific faculty by code
  getFacultyByCode: async (code) => {
    return apiClient.get(`/faculty/${code}`);
  },

  getFacultyById: async (id) => {
    return apiClient.get(`/faculty/id/${id}`);
  },
};

// New Department API
export const departmentApi = {
  // Get all departments
  getDepartments: async () => {
    return apiClient.get("/department");
  },

  // Get a specific department by code
  getDepartmentByCode: async (code) => {
    return apiClient.get(`/department/${code}`);
  },
};

// Researchers API (mostly the same but with added functionality)
export const researchersApi = {
  getResearchers: async () => {
    return requestWithAuth({
      method: "get",
      url: "/admin/researchers",
    });
  },

  getResearcher: async (id) => {
    return requestWithAuth({
      method: "get",
      url: `/researchers/${id}`,
    });
  },

  deleteResearcher: async (id) => {
    return requestWithAuth({
      method: "delete",
      url: `/admin/researchers/${id}`,
    });
  },

  getResearcherArticles: async (id) => {
    return requestWithAuth({
      method: "get",
      url: `/researchers/${id}/articles`,
    });
  },
};

// Adding a new section for researcher-specific API calls
export const researcherDashboardApi = {
  getProfile: async () => {
    return requestWithAuth({
      method: "get",
      url: "/researcher/profile",
    });
  },

  // Get researcher's popular articles
  getPopularArticles: async (limit = 5) => {
    return requestWithAuth({
      method: "get",
      url: "/researcher/popular-articles",
      params: { limit },
    });
  },

  // Get researcher's analytics
  getAnalytics: async () => {
    return requestWithAuth({
      method: "get",
      url: "/researcher/analytics",
    });
  },

  // Get all articles for the researcher
  getMyArticles: async () => {
    return requestWithAuth({
      method: "get",
      url: "/researcher/profile",
    }).then((response) => {
      // Extract articles from the profile response
      return response.data.articles || [];
    });
  },
};
