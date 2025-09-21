import axios from 'axios';

// Get the current hostname/IP for API calls
const getApiBaseUrl = () => {
    // In development, use the current hostname with port 5000
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return 'http://localhost:5000/api';
    }
    // For network access, use the same hostname with port 5000
    return `http://${window.location.hostname}:5000/api`;
};

// Create axios instance with base configuration
const API = axios.create({
    baseURL: getApiBaseUrl(),
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests if it exists
API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
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
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth API calls
export const authAPI = {
    signup: (userData) => API.post('/auth/signup', userData),
    verifyOTP: (otpData) => API.post('/auth/verify-otp', otpData),
    login: (credentials) => API.post('/auth/login', credentials),
    forgotPassword: (email) => API.post('/auth/forgot-password', { email }),
    resetPassword: (resetData) => API.post('/auth/reset-password', resetData),
    getProfile: () => API.get('/auth/me'),
    updateProfile: (profileData) => API.put('/auth/profile', profileData),
    resetUserPassword: (passwordData) => API.put('/auth/change-password', passwordData),
    deleteAccount: () => API.delete('/auth/delete-account'),
};

// Habits API calls
export const habitsAPI = {
    getHabits: (params = {}) => API.get('/habits', { params }),
    getHabitsForDate: (date, params = {}) => API.get('/habits', { params: { ...params, date } }),
    getHabit: (id) => API.get(`/habits/${id}`),
    createHabit: (habitData) => API.post('/habits', habitData),
    updateHabit: (id, habitData) => API.put(`/habits/${id}`, habitData),
    deleteHabit: (id) => API.delete(`/habits/${id}`),
    toggleHabit: (id, date = null) => API.post(`/habits/${id}/toggle`, date ? { date } : {}),
    getHabitStats: () => API.get('/habits/stats'),
};

// Notifications API calls
export const notificationsAPI = {
    getNotifications: (params = {}) => API.get('/notifications', { params }),
    getUnreadCount: () => API.get('/notifications/unread-count'),
    markAsRead: (id) => API.put(`/notifications/${id}/read`),
    markAllAsRead: () => API.put('/notifications/mark-all-read'),
    deleteNotification: (id) => API.delete(`/notifications/${id}`),
    createNotification: (notificationData) => API.post('/notifications', notificationData),
};

// Master Habits API calls
export const masterHabitsAPI = {
    getMasterHabits: (params = {}) => API.get('/master-habits', { params }),
    getCategories: () => API.get('/master-habits/categories'),
    getMasterHabit: (id) => API.get(`/master-habits/${id}`),
};

// Daily Stats API calls
export const dailyStatsAPI = {
    getDailyStats: (params = {}) => API.get('/daily-stats', { params }),
    getTodayStats: () => API.get('/daily-stats/today'),
    updateTodayStats: (data) => API.put('/daily-stats/today', data),
    getStreakData: () => API.get('/daily-stats/streak'),
    getCategoryPerformance: (params = {}) => API.get('/daily-stats/category-performance', { params }),
};

export default API;
