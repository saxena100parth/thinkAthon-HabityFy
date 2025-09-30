# HabityFy Mobile App

A React Native mobile application built with Expo for habit tracking and management. This app integrates with the HabityFy backend API to provide a seamless habit tracking experience.

## Features

- **Authentication**: Sign up, login, OTP verification, password reset
- **Habit Management**: Create, update, delete, and track habits
- **Dashboard**: View daily progress, streaks, and statistics
- **Notifications**: Stay updated with habit reminders
- **Settings**: Manage account and preferences

## Tech Stack

- **React Native** with Expo
- **TypeScript** for type safety
- **React Navigation** for navigation
- **Expo Secure Store** for secure token storage
- **Axios** for API communication
- **React Context** for state management

## Project Structure

```
src/
├── contexts/           # React Context providers
│   ├── AuthContext.tsx
│   └── HabitContext.tsx
├── navigation/         # Navigation configuration
│   └── RootNavigator.tsx
├── screens/           # Screen components
│   ├── auth/          # Authentication screens
│   │   ├── LoginScreen.tsx
│   │   ├── SignupScreen.tsx
│   │   ├── VerifyOTPScreen.tsx
│   │   ├── ForgotPasswordScreen.tsx
│   │   └── ResetPasswordScreen.tsx
│   └── main/          # Main app screens
│       ├── DashboardScreen.tsx
│       ├── HabitsScreen.tsx
│       ├── NotificationsScreen.tsx
│       └── SettingsScreen.tsx
└── utils/             # Utility functions
    └── api.ts         # API configuration and endpoints
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio/Emulator (for Android development)

### Installation

1. Navigate to the mobile directory:

   ```bash
   cd mobile/HabityFyMobile
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm start
   ```

4. Run on your preferred platform:
   ```bash
   npm run ios     # For iOS
   npm run android # For Android
   npm run web     # For web
   ```

## API Configuration

The app is configured to connect to your backend API. Update the API base URL in `src/utils/api.ts`:

```typescript
const getApiBaseUrl = () => {
  return __DEV__
    ? "http://localhost:5000/api" // Development
    : "https://your-production-api.com/api"; // Production
};
```

For device testing, replace `localhost` with your computer's IP address.

## Backend Integration

This mobile app integrates with the HabityFy backend API endpoints:

- **Authentication**: `/api/auth/*`
- **Habits**: `/api/habits/*`
- **Notifications**: `/api/notifications/*`
- **Master Habits**: `/api/master-habits/*`
- **Daily Stats**: `/api/daily-stats/*`

## Features Overview

### Authentication Flow

1. User signs up with email, username, mobile, and password
2. OTP verification via email
3. Login with email and password
4. Password reset functionality

### Habit Management

- Create habits with categories, frequency, and reminders
- Track daily/weekly completion
- View streaks and statistics
- Toggle habit completion

### Dashboard

- Daily habit overview
- Progress statistics
- Streak tracking
- Completion rates

## Development Notes

- The app uses Expo Secure Store for secure token storage
- All API calls include automatic token management
- Error handling is implemented throughout the app
- TypeScript provides type safety for all components

## Building for Production

1. Configure your app in `app.json`
2. Build for your target platform:
   ```bash
   expo build:ios     # For iOS
   expo build:android # For Android
   ```

## Contributing

1. Follow the existing code style and patterns
2. Use TypeScript for all new components
3. Test on both iOS and Android platforms
4. Ensure proper error handling and user feedback

## License

This project is part of the HabityFy application suite.

