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

// Rest of your code remains the same...
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
      url: "/auth/admin/invite",
      data: { email },
    });
  },
};

export const articlesApi = {
  getArticles: async (category) => {
    return requestWithAuth({
      method: "get",
      url: "/articles",
      params: category ? { category } : {},
    });
  },

  getArticle: async (id) => {
    return requestWithAuth({
      method: "get",
      url: `/articles/${id}`,
    });
  },

  createArticle: async (articleData) => {
    return requestWithAuth({
      method: "post",
      url: "/admin/articles",
      data: articleData,
    });
  },

  updateArticle: async (id, articleData) => {
    return requestWithAuth({
      method: "put",
      url: `/admin/articles/${id}`,
      data: articleData,
    });
  },
};

export const researchersApi = {
  getResearchers: async () => {
    return requestWithAuth({
      method: "get",
      url: "/researchers",
    });
  },

  getResearcher: async (id) => {
    return requestWithAuth({
      method: "get",
      url: `/researchers/${id}`,
    });
  },

  getResearcherArticles: async (id) => {
    return requestWithAuth({
      method: "get",
      url: `/researchers/${id}/articles`,
    });
  },
};
