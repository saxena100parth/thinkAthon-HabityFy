# HabityFy API Documentation

## Base URL
```
Development: http://localhost:5000/api
Production: https://api.habityfy.com/api
```

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Response Format
All API responses follow this format:
```json
{
  "success": boolean,
  "message": string,
  "data": object | array,
  "error": string (only on error)
}
```

---

## 🔐 Authentication Endpoints

### POST /auth/signup
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "username": "johndoe",
  "mobile": "1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent to your email address",
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "username": "johndoe",
      "mobile": "1234567890"
    }
  }
}
```

### POST /auth/verify-otp
Verify OTP and set password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "otp": "123456",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Account created successfully",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "username": "johndoe",
    "mobile": "1234567890",
    "isEmailVerified": true
  }
}
```

### POST /auth/login
Login with email/username and password.

**Request Body:**
```json
{
  "identifier": "user@example.com", // or username
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "username": "johndoe",
    "mobile": "1234567890",
    "isEmailVerified": true
  }
}
```

### POST /auth/forgot-password
Request password reset OTP.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password reset code sent to your email"
}
```

### POST /auth/reset-password
Reset password with OTP.

**Request Body:**
```json
{
  "email": "user@example.com",
  "otp": "123456",
  "newPassword": "newsecurepassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

---

## 🎯 Master Habits Endpoints

### GET /master-habits
Get all available master habits.

**Query Parameters:**
- `category` (optional): Filter by category
- `search` (optional): Search in title, description, or tags

**Example:**
```
GET /master-habits?category=health_fitness&search=water
```

**Response:**
```json
{
  "success": true,
  "count": 5,
  "habits": [
    {
      "_id": "habit_id",
      "title": "Drink 8 glasses of water",
      "description": "Stay hydrated by drinking 8 glasses of water throughout the day",
      "category": "health_fitness",
      "icon": "💧",
      "emoji": "💧",
      "suggestedFrequency": "daily",
      "suggestedTimeOfDay": "09:00",
      "suggestedDuration": "Throughout day",
      "difficulty": "easy",
      "tags": ["hydration", "health", "wellness"],
      "sortOrder": 1
    }
  ]
}
```

### GET /master-habits/categories
Get all available habit categories.

**Response:**
```json
{
  "success": true,
  "categories": [
    {
      "key": "health_fitness",
      "name": "Health & Fitness",
      "icon": "💪",
      "emoji": "💪"
    },
    {
      "key": "mental_wellbeing",
      "name": "Mental Well-being",
      "icon": "🧠",
      "emoji": "🧠"
    }
  ]
}
```

### GET /master-habits/:id
Get a specific master habit by ID.

**Response:**
```json
{
  "success": true,
  "habit": {
    "_id": "habit_id",
    "title": "Drink 8 glasses of water",
    "description": "Stay hydrated by drinking 8 glasses of water throughout the day",
    "category": "health_fitness",
    "icon": "💧",
    "emoji": "💧",
    "suggestedFrequency": "daily",
    "suggestedTimeOfDay": "09:00",
    "suggestedDuration": "Throughout day",
    "difficulty": "easy",
    "tags": ["hydration", "health", "wellness"],
    "sortOrder": 1
  }
}
```

---

## 📝 Habits Endpoints

### GET /habits
Get user's habits.

**Query Parameters:**
- `category` (optional): Filter by category
- `status` (optional): Filter by status (active, inactive, completed, pending)
- `sortBy` (optional): Sort field (createdAt, title, currentStreak)
- `sortOrder` (optional): Sort order (asc, desc)

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "count": 3,
  "habits": [
    {
      "_id": "habit_id",
      "userId": "user_id",
      "masterHabitId": {
        "_id": "master_habit_id",
        "title": "Drink 8 glasses of water",
        "description": "Stay hydrated...",
        "icon": "💧",
        "emoji": "💧",
        "category": "health_fitness"
      },
      "title": "Drink 8 glasses of water",
      "description": "Stay hydrated by drinking 8 glasses of water throughout the day",
      "category": "health_fitness",
      "frequency": "daily",
      "timeOfDay": ["09:00", "15:00", "21:00"],
      "primaryTime": "09:00",
      "duration": "Throughout day",
      "customDuration": null,
      "targetValue": 8,
      "unit": "glasses",
      "reminderEnabled": true,
      "reminderTimes": ["09:00", "15:00", "21:00"],
      "isActive": true,
      "priority": "high",
      "tags": ["hydration", "health"],
      "history": [
        {
          "date": "2024-01-15",
          "completed": true,
          "completedAt": "2024-01-15T09:30:00.000Z"
        }
      ],
      "currentStreak": 5,
      "maxStreak": 12,
      "createdAt": "2024-01-10T00:00:00.000Z",
      "updatedAt": "2024-01-15T09:30:00.000Z"
    }
  ]
}
```

### POST /habits
Create a new habit from a master habit.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "masterHabitId": "master_habit_id",
  "title": "Custom Habit Title",
  "description": "Custom description",
  "frequency": "daily",
  "timeOfDay": ["09:00", "15:00"],
  "primaryTime": "09:00",
  "duration": "15 min",
  "customDuration": 15,
  "targetValue": 8,
  "unit": "glasses",
  "reminderEnabled": true,
  "reminderTimes": ["09:00", "15:00"],
  "priority": "high",
  "tags": ["custom", "health"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Habit created successfully",
  "habit": {
    "_id": "habit_id",
    "userId": "user_id",
    "masterHabitId": "master_habit_id",
    "title": "Custom Habit Title",
    "description": "Custom description",
    "category": "health_fitness",
    "frequency": "daily",
    "timeOfDay": ["09:00", "15:00"],
    "primaryTime": "09:00",
    "duration": "15 min",
    "customDuration": 15,
    "targetValue": 8,
    "unit": "glasses",
    "reminderEnabled": true,
    "reminderTimes": ["09:00", "15:00"],
    "isActive": true,
    "priority": "high",
    "tags": ["custom", "health"],
    "history": [],
    "currentStreak": 0,
    "maxStreak": 0,
    "createdAt": "2024-01-15T10:00:00.000Z",
    "updatedAt": "2024-01-15T10:00:00.000Z"
  }
}
```

### GET /habits/:id
Get a specific habit by ID.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "habit": {
    "_id": "habit_id",
    "userId": "user_id",
    "masterHabitId": {
      "_id": "master_habit_id",
      "title": "Drink 8 glasses of water",
      "description": "Stay hydrated...",
      "icon": "💧",
      "emoji": "💧",
      "category": "health_fitness"
    },
    "title": "Drink 8 glasses of water",
    "description": "Stay hydrated by drinking 8 glasses of water throughout the day",
    "category": "health_fitness",
    "frequency": "daily",
    "timeOfDay": ["09:00", "15:00", "21:00"],
    "primaryTime": "09:00",
    "duration": "Throughout day",
    "customDuration": null,
    "targetValue": 8,
    "unit": "glasses",
    "reminderEnabled": true,
    "reminderTimes": ["09:00", "15:00", "21:00"],
    "isActive": true,
    "priority": "high",
    "tags": ["hydration", "health"],
    "history": [
      {
        "date": "2024-01-15",
        "completed": true,
        "completedAt": "2024-01-15T09:30:00.000Z"
      }
    ],
    "currentStreak": 5,
    "maxStreak": 12,
    "createdAt": "2024-01-10T00:00:00.000Z",
    "updatedAt": "2024-01-15T09:30:00.000Z"
  }
}
```

### PUT /habits/:id
Update an existing habit.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Updated Habit Title",
  "description": "Updated description",
  "frequency": "daily",
  "timeOfDay": ["08:00", "16:00"],
  "primaryTime": "08:00",
  "duration": "20 min",
  "customDuration": 20,
  "targetValue": 10,
  "unit": "glasses",
  "reminderEnabled": true,
  "reminderTimes": ["08:00", "16:00"],
  "priority": "medium",
  "tags": ["updated", "health"],
  "isActive": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Habit updated successfully",
  "habit": {
    "_id": "habit_id",
    "userId": "user_id",
    "masterHabitId": "master_habit_id",
    "title": "Updated Habit Title",
    "description": "Updated description",
    "category": "health_fitness",
    "frequency": "daily",
    "timeOfDay": ["08:00", "16:00"],
    "primaryTime": "08:00",
    "duration": "20 min",
    "customDuration": 20,
    "targetValue": 10,
    "unit": "glasses",
    "reminderEnabled": true,
    "reminderTimes": ["08:00", "16:00"],
    "isActive": true,
    "priority": "medium",
    "tags": ["updated", "health"],
    "history": [
      {
        "date": "2024-01-15",
        "completed": true,
        "completedAt": "2024-01-15T09:30:00.000Z"
      }
    ],
    "currentStreak": 5,
    "maxStreak": 12,
    "createdAt": "2024-01-10T00:00:00.000Z",
    "updatedAt": "2024-01-15T11:00:00.000Z"
  }
}
```

### DELETE /habits/:id
Delete a habit.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Habit deleted successfully"
}
```

### POST /habits/:id/toggle
Toggle habit completion for today.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Habit completion toggled successfully",
  "habit": {
    "_id": "habit_id",
    "userId": "user_id",
    "masterHabitId": "master_habit_id",
    "title": "Drink 8 glasses of water",
    "description": "Stay hydrated by drinking 8 glasses of water throughout the day",
    "category": "health_fitness",
    "frequency": "daily",
    "timeOfDay": ["09:00", "15:00", "21:00"],
    "primaryTime": "09:00",
    "duration": "Throughout day",
    "customDuration": null,
    "targetValue": 8,
    "unit": "glasses",
    "reminderEnabled": true,
    "reminderTimes": ["09:00", "15:00", "21:00"],
    "isActive": true,
    "priority": "high",
    "tags": ["hydration", "health"],
    "history": [
      {
        "date": "2024-01-15",
        "completed": true,
        "completedAt": "2024-01-15T09:30:00.000Z"
      },
      {
        "date": "2024-01-16",
        "completed": true,
        "completedAt": "2024-01-16T09:00:00.000Z"
      }
    ],
    "currentStreak": 6,
    "maxStreak": 12,
    "createdAt": "2024-01-10T00:00:00.000Z",
    "updatedAt": "2024-01-16T09:00:00.000Z"
  }
}
```

### GET /habits/stats
Get habit statistics for the user.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "stats": {
    "totalHabits": 5,
    "activeHabits": 4,
    "completedToday": 3,
    "completionRate": 75,
    "currentStreak": 5,
    "longestStreak": 12,
    "categoryStats": {
      "health_fitness": {
        "total": 2,
        "completed": 1,
        "completionRate": 50
      },
      "mental_wellbeing": {
        "total": 1,
        "completed": 1,
        "completionRate": 100
      },
      "learning_growth": {
        "total": 1,
        "completed": 1,
        "completionRate": 100
      },
      "productivity_career": {
        "total": 1,
        "completed": 0,
        "completionRate": 0
      },
      "lifestyle_relationships": {
        "total": 0,
        "completed": 0,
        "completionRate": 0
      }
    }
  }
}
```

---

## 📊 Daily Stats Endpoints

### GET /daily-stats
Get daily statistics for the user.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `startDate` (optional): Start date (YYYY-MM-DD)
- `endDate` (optional): End date (YYYY-MM-DD)

**Response:**
```json
{
  "success": true,
  "count": 7,
  "stats": [
    {
      "_id": "stats_id",
      "userId": "user_id",
      "date": "2024-01-15",
      "habitsCompleted": 3,
      "totalHabits": 4,
      "completionRate": 75,
      "streakDays": 5,
      "totalMinutes": 45,
      "categoryStats": {
        "health_fitness": {
          "completed": 1,
          "total": 2,
          "minutes": 20
        },
        "mental_wellbeing": {
          "completed": 1,
          "total": 1,
          "minutes": 10
        },
        "learning_growth": {
          "completed": 1,
          "total": 1,
          "minutes": 15
        },
        "productivity_career": {
          "completed": 0,
          "total": 0,
          "minutes": 0
        },
        "lifestyle_relationships": {
          "completed": 0,
          "total": 0,
          "minutes": 0
        }
      },
      "mood": "good",
      "notes": "Had a productive day!",
      "achievements": [
        {
          "type": "streak",
          "message": "5 day streak!",
          "value": 5,
          "category": "health_fitness"
        }
      ],
      "createdAt": "2024-01-15T00:00:00.000Z",
      "updatedAt": "2024-01-15T23:59:59.000Z"
    }
  ]
}
```

### GET /daily-stats/today
Get today's statistics.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "stats": {
    "_id": "stats_id",
    "userId": "user_id",
    "date": "2024-01-16",
    "habitsCompleted": 2,
    "totalHabits": 4,
    "completionRate": 50,
    "streakDays": 6,
    "totalMinutes": 30,
    "categoryStats": {
      "health_fitness": {
        "completed": 1,
        "total": 2,
        "minutes": 15
      },
      "mental_wellbeing": {
        "completed": 1,
        "total": 1,
        "minutes": 10
      },
      "learning_growth": {
        "completed": 0,
        "total": 1,
        "minutes": 0
      },
      "productivity_career": {
        "completed": 0,
        "total": 0,
        "minutes": 0
      },
      "lifestyle_relationships": {
        "completed": 0,
        "total": 0,
        "minutes": 0
      }
    },
    "mood": null,
    "notes": "",
    "achievements": [],
    "createdAt": "2024-01-16T00:00:00.000Z",
    "updatedAt": "2024-01-16T00:00:00.000Z"
  }
}
```

### PUT /daily-stats/today
Update today's statistics.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "mood": "excellent",
  "notes": "Feeling great today! Completed most of my habits."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Daily stats updated successfully",
  "stats": {
    "_id": "stats_id",
    "userId": "user_id",
    "date": "2024-01-16",
    "habitsCompleted": 2,
    "totalHabits": 4,
    "completionRate": 50,
    "streakDays": 6,
    "totalMinutes": 30,
    "categoryStats": {
      "health_fitness": {
        "completed": 1,
        "total": 2,
        "minutes": 15
      },
      "mental_wellbeing": {
        "completed": 1,
        "total": 1,
        "minutes": 10
      },
      "learning_growth": {
        "completed": 0,
        "total": 1,
        "minutes": 0
      },
      "productivity_career": {
        "completed": 0,
        "total": 0,
        "minutes": 0
      },
      "lifestyle_relationships": {
        "completed": 0,
        "total": 0,
        "minutes": 0
      }
    },
    "mood": "excellent",
    "notes": "Feeling great today! Completed most of my habits.",
    "achievements": [],
    "createdAt": "2024-01-16T00:00:00.000Z",
    "updatedAt": "2024-01-16T10:30:00.000Z"
  }
}
```

### GET /daily-stats/streak
Get streak data for the user.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "currentStreak": 6,
  "streakData": [
    {
      "date": "2024-01-16",
      "completionRate": 50,
      "habitsCompleted": 2,
      "totalHabits": 4
    },
    {
      "date": "2024-01-15",
      "completionRate": 75,
      "habitsCompleted": 3,
      "totalHabits": 4
    }
  ]
}
```

### GET /daily-stats/category-performance
Get category performance analytics.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `days` (optional): Number of days to analyze (default: 30)

**Response:**
```json
{
  "success": true,
  "performance": {
    "health_fitness": 75.5,
    "mental_wellbeing": 85.2,
    "learning_growth": 60.8,
    "productivity_career": 45.3,
    "lifestyle_relationships": 90.1,
    "totalDays": 30,
    "avgCompletionRate": 71.4
  }
}
```

---

## 🔔 Notifications Endpoints

### GET /notifications
Get user's notifications.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `read` (optional): Filter by read status (true/false)
- `limit` (optional): Number of notifications to return
- `page` (optional): Page number for pagination

**Response:**
```json
{
  "success": true,
  "count": 5,
  "notifications": [
    {
      "_id": "notification_id",
      "userId": "user_id",
      "habitId": {
        "_id": "habit_id",
        "title": "Drink 8 glasses of water"
      },
      "message": "Time for \"Drink 8 glasses of water\"!",
      "scheduledAt": "2024-01-16T09:00:00.000Z",
      "read": false,
      "createdAt": "2024-01-16T08:55:00.000Z"
    }
  ]
}
```

### GET /notifications/unread-count
Get count of unread notifications.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "count": 3
}
```

### PUT /notifications/:id/read
Mark a notification as read.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Notification marked as read",
  "notification": {
    "_id": "notification_id",
    "userId": "user_id",
    "habitId": "habit_id",
    "message": "Time for \"Drink 8 glasses of water\"!",
    "scheduledAt": "2024-01-16T09:00:00.000Z",
    "read": true,
    "createdAt": "2024-01-16T08:55:00.000Z"
  }
}
```

### PUT /notifications/mark-all-read
Mark all notifications as read.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "All notifications marked as read"
}
```

### DELETE /notifications/:id
Delete a notification.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Notification deleted successfully"
}
```

---

## ❌ Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    },
    {
      "field": "password",
      "message": "Password must be at least 6 characters long"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "No token provided"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Access denied"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Habit not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Server Error",
  "error": "Detailed error message"
}
```

---

## 📝 Rate Limiting

The API implements rate limiting to prevent abuse:
- **Authentication endpoints**: 5 requests per minute per IP
- **General endpoints**: 100 requests per minute per user
- **File uploads**: 10 requests per minute per user

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

---

## 🔒 Security Headers

All responses include security headers:
```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

---

## 📱 SDK Examples

### JavaScript/React
```javascript
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Create a habit
const createHabit = async (habitData) => {
  try {
    const response = await API.post('/habits', habitData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Get habits
const getHabits = async () => {
  try {
    const response = await API.get('/habits');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
```

### Python
```python
import requests

class HabityFyAPI:
    def __init__(self, base_url, token=None):
        self.base_url = base_url
        self.token = token
        self.headers = {
            'Content-Type': 'application/json'
        }
        if token:
            self.headers['Authorization'] = f'Bearer {token}'
    
    def create_habit(self, habit_data):
        response = requests.post(
            f'{self.base_url}/habits',
            json=habit_data,
            headers=self.headers
        )
        return response.json()
    
    def get_habits(self):
        response = requests.get(
            f'{self.base_url}/habits',
            headers=self.headers
        )
        return response.json()

# Usage
api = HabityFyAPI('http://localhost:5000/api', 'your_token_here')
habits = api.get_habits()
```

---

This API documentation provides comprehensive information about all available endpoints, request/response formats, and usage examples. For additional support or questions, please contact the development team.
