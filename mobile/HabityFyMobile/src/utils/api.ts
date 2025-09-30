import axios from "axios";
import * as SecureStore from "expo-secure-store";

// Get the API base URL - adjust this based on your backend setup
const getApiBaseUrl = () => {
  // For development, use your computer's IP address for device testing
  // Replace with your actual IP address when testing on physical devices
  return __DEV__
    ? "http://192.168.1.54:5000/api"
    : "https://your-production-api.com/api";
};

// Create axios instance with base configuration
const API = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 second timeout
});

// Add token to requests if it exists
API.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStore.getItemAsync("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Error getting token:", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      try {
        await SecureStore.deleteItemAsync("token");
        await SecureStore.deleteItemAsync("user");
      } catch (secureError) {
        console.error("Error clearing secure storage:", secureError);
      }
      // You might want to navigate to login screen here
      // NavigationService.navigate('Login');
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  signup: (userData: { email: string; username: string; mobile: string }) =>
    API.post("/auth/signup", userData),
  verifyOTP: (otpData: { email: string; otp: string; password: string }) =>
    API.post("/auth/verify-otp", otpData),
  login: (credentials: { emailOrUsername: string; password: string }) =>
    API.post("/auth/login", credentials),
  forgotPassword: (email: string) =>
    API.post("/auth/forgot-password", { email }),
  resetPassword: (resetData: {
    email: string;
    otp: string;
    password: string;
  }) => API.post("/auth/reset-password", resetData),
  getProfile: () => API.get("/auth/me"),
  updateProfile: (profileData: any) => API.put("/auth/profile", profileData),
  resetUserPassword: (passwordData: any) =>
    API.put("/auth/change-password", passwordData),
  deleteAccount: () => API.delete("/auth/delete-account"),
};

// Habits API calls
export const habitsAPI = {
  getHabits: (params: any = {}) => API.get("/habits", { params }),
  getHabitsForDate: (date: string, params: any = {}) =>
    API.get("/habits", { params: { ...params, date } }),
  getHabit: (id: string) => API.get(`/habits/${id}`),
  createHabit: (habitData: any) => API.post("/habits", habitData),
  updateHabit: (id: string, habitData: any) =>
    API.put(`/habits/${id}`, habitData),
  deleteHabit: (id: string) => API.delete(`/habits/${id}`),
  toggleHabit: (id: string, date: string | null = null) =>
    API.post(`/habits/${id}/toggle`, date ? { date } : {}),
  getHabitStats: () => API.get("/habits/stats"),
};

// Notifications API calls
export const notificationsAPI = {
  getNotifications: (params: any = {}) => API.get("/notifications", { params }),
  getUnreadCount: () => API.get("/notifications/unread-count"),
  markAsRead: (id: string) => API.put(`/notifications/${id}/read`),
  markAllAsRead: () => API.put("/notifications/mark-all-read"),
  deleteNotification: (id: string) => API.delete(`/notifications/${id}`),
  createNotification: (notificationData: any) =>
    API.post("/notifications", notificationData),
};

// Master Habits API calls
export const masterHabitsAPI = {
  getMasterHabits: (params: any = {}) => API.get("/master-habits", { params }),
  getCategories: () => API.get("/master-habits/categories"),
  getMasterHabit: (id: string) => API.get(`/master-habits/${id}`),
};

// Daily Stats API calls
export const dailyStatsAPI = {
  getDailyStats: (params: any = {}) => API.get("/daily-stats", { params }),
  getTodayStats: () => API.get("/daily-stats/today"),
  updateTodayStats: (data: any) => API.put("/daily-stats/today", data),
  getStreakData: () => API.get("/daily-stats/streak"),
  getCategoryPerformance: (params: any = {}) =>
    API.get("/daily-stats/category-performance", { params }),
};

export default API;
