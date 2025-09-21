# HabityFy - Habit Tracking Application

![HabityFy Logo](https://via.placeholder.com/200x80/D32F2F/FFFFFF?text=HabityFy)

A comprehensive habit tracking application built with the MERN stack, designed to help users build and maintain positive habits through an intuitive interface and powerful analytics.

## 🚀 Features

### Core Functionality
- **User Authentication**: Secure signup, login, and password reset with OTP verification
- **Master Habits Library**: 25+ professionally curated habits across 5 categories
- **Custom Habit Creation**: Full customization of habits with multiple times, targets, and priorities
- **Progress Tracking**: Daily habit completion tracking with streak calculations
- **Analytics Dashboard**: Comprehensive insights into habit performance and trends
- **Smart Notifications**: Reminder system for habit completion
- **Responsive Design**: Mobile-first design that works on all devices

### Habit Categories
- **💪 Health & Fitness**: Exercise, hydration, sleep, walking, yoga
- **🧠 Mental Well-being**: Meditation, journaling, digital detox, affirmations
- **📚 Learning & Growth**: Reading, skill development, podcasts, hobbies
- **💼 Productivity & Career**: Planning, time management, networking, budgeting
- **🏡 Lifestyle & Relationships**: Healthy eating, family time, decluttering, kindness

## 🛠️ Tech Stack

### Frontend
- **React 18** with Vite for fast development
- **Tailwind CSS** for styling and responsive design
- **React Router** for navigation
- **Axios** for API communication
- **Lucide React** for icons
- **Context API** for state management

### Backend
- **Node.js** with Express.js framework
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Joi** for input validation
- **Node-cron** for scheduled tasks
- **Nodemailer** for email services

### Database Collections
- **Users**: User profiles and authentication data
- **OTP**: One-time password verification system
- **MasterHabits**: Predefined habit templates
- **Habits**: User's personalized habits
- **DailyStats**: Daily progress and analytics data
- **Notifications**: Reminder and notification system

## 📁 Project Structure

```
HabityFy/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   │   ├── dashboard/    # Dashboard-specific components
│   │   │   └── ui/          # Generic UI components
│   │   ├── contexts/        # React Context providers
│   │   ├── pages/           # Page components
│   │   ├── utils/           # Utility functions and API calls
│   │   └── main.jsx         # Application entry point
│   ├── public/              # Static assets
│   └── package.json
├── backend/                 # Node.js backend application
│   ├── controllers/         # Route controllers
│   ├── middleware/          # Custom middleware
│   ├── models/              # Database models
│   ├── routes/              # API routes
│   ├── scripts/             # Database seeding scripts
│   └── server.js            # Server entry point
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account or local MongoDB
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd HabityFy
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Environment Setup**
   
   Create a `.env` file in the backend directory:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/habityfy
   JWT_SECRET=your-super-secret-jwt-key
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   ```

5. **Seed the database**
   ```bash
   cd backend
   npm run seed-master-habits
   ```

6. **Start the development servers**
   
   Backend (Terminal 1):
   ```bash
   cd backend
   npm run dev
   ```
   
   Frontend (Terminal 2):
   ```bash
   cd frontend
   npm run dev
   ```

7. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 📱 Usage Guide

### Getting Started
1. **Sign Up**: Create an account with email, username, and mobile number
2. **Verify OTP**: Enter the OTP sent to your email
3. **Set Password**: Create a secure password
4. **Login**: Access your dashboard

### Creating Habits
1. **Choose from Master Habits**: Browse 25+ predefined habits across 5 categories
2. **Customize Your Habit**:
   - Set custom title and description
   - Choose frequency (daily/weekly/custom)
   - Set multiple times of day
   - Define duration and targets
   - Add custom tags
   - Set priority level
3. **Save**: Your habit is added to your dashboard

### Tracking Progress
- **Daily Completion**: Click the habit card to mark as complete
- **Streak Tracking**: View current and best streaks
- **Analytics**: Monitor your progress over time
- **Categories**: See performance across different habit categories

## 🔧 API Documentation

### Authentication Endpoints
- `POST /api/auth/signup` - User registration
- `POST /api/auth/verify-otp` - OTP verification
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Password reset with OTP

### Habit Endpoints
- `GET /api/habits` - Get user's habits
- `POST /api/habits` - Create new habit
- `PUT /api/habits/:id` - Update habit
- `DELETE /api/habits/:id` - Delete habit
- `POST /api/habits/:id/toggle` - Toggle habit completion

### Master Habits Endpoints
- `GET /api/master-habits` - Get all master habits
- `GET /api/master-habits/categories` - Get habit categories
- `GET /api/master-habits/:id` - Get specific master habit

### Analytics Endpoints
- `GET /api/daily-stats` - Get daily statistics
- `GET /api/daily-stats/today` - Get today's stats
- `PUT /api/daily-stats/today` - Update today's stats
- `GET /api/daily-stats/streak` - Get streak data
- `GET /api/daily-stats/category-performance` - Get category performance

## 🎨 Design System

### Color Palette
- **Primary Red**: #D32F2F (buttons, accents, headings)
- **Background**: White with subtle gray sections
- **Accent Green**: Soft green for highlights
- **Text**: Dark gray for body text

### Typography
- **Headings**: Bold, red color for emphasis
- **Body**: Clean, readable dark gray
- **Hierarchy**: Clear size and weight differences

### Components
- **Rounded Corners**: 6-8px for cards and sections
- **Soft Shadows**: Subtle elevation for depth
- **Hover Effects**: Smooth transitions and color changes
- **Mobile-First**: Responsive design for all screen sizes

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for secure password storage
- **Input Validation**: Joi schema validation for all inputs
- **CORS Protection**: Configured for secure cross-origin requests
- **OTP Verification**: Time-limited OTP for account verification

## 📊 Database Schema

### User Schema
```javascript
{
  email: String (required, unique)
  username: String (required, unique)
  mobile: String (required)
  passwordHash: String (required)
  isEmailVerified: Boolean
  isMobileVerified: Boolean
  createdAt: Date
  updatedAt: Date
}
```

### Habit Schema
```javascript
{
  userId: ObjectId (ref: User)
  masterHabitId: ObjectId (ref: MasterHabit)
  title: String (required)
  description: String
  category: String (enum)
  frequency: String (daily/weekly/custom)
  timeOfDay: [String] (array of times)
  primaryTime: String
  duration: String
  customDuration: Number
  targetValue: Number
  unit: String
  reminderEnabled: Boolean
  reminderTimes: [String]
  priority: String (low/medium/high)
  tags: [String]
  isActive: Boolean
  history: [{ date: String, completed: Boolean }]
  currentStreak: Number
  maxStreak: Number
  createdAt: Date
  updatedAt: Date
}
```

## 🚀 Deployment

### Backend Deployment (Heroku)
1. Create a Heroku app
2. Set environment variables
3. Connect to GitHub repository
4. Enable automatic deploys

### Frontend Deployment (Vercel/Netlify)
1. Connect repository to deployment platform
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Deploy

### Environment Variables for Production
```env
NODE_ENV=production
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=your-production-jwt-secret
EMAIL_HOST=your-smtp-host
EMAIL_PORT=587
EMAIL_USER=your-email
EMAIL_PASS=your-email-password
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Backend Development**: Node.js, Express.js, MongoDB
- **Frontend Development**: React, Tailwind CSS, Vite
- **UI/UX Design**: Modern, responsive, mobile-first design
- **Database Design**: Optimized MongoDB schemas

## 📞 Support

For support, email support@habityfy.com or create an issue in the repository.

## 🎯 Roadmap

### Phase 1 (Current)
- ✅ User authentication and authorization
- ✅ Master habits library
- ✅ Custom habit creation
- ✅ Progress tracking
- ✅ Basic analytics

### Phase 2 (Planned)
- [ ] Social features (friends, challenges)
- [ ] Advanced analytics and insights
- [ ] Mobile app (React Native)
- [ ] Habit templates sharing
- [ ] Integration with fitness trackers

### Phase 3 (Future)
- [ ] AI-powered habit recommendations
- [ ] Advanced scheduling (recurring patterns)
- [ ] Team/group habit tracking
- [ ] Gamification features
- [ ] API for third-party integrations

---

**Built with ❤️ for better habits and a better life.**