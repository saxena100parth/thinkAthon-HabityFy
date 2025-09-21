# HabityFy - Technical Documentation

## 🏗️ Architecture Overview

HabityFy follows a modern MERN stack architecture with a clear separation of concerns between frontend and backend, utilizing MongoDB for data persistence and React for the user interface.

### System Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React SPA     │    │   Express API   │    │   MongoDB       │
│   (Frontend)    │◄──►│   (Backend)     │◄──►│   (Database)    │
│   Port: 5173    │    │   Port: 5000    │    │   Atlas/Cloud   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🗄️ Database Design

### Collection Relationships
```
Users (1) ──► (N) Habits
Users (1) ──► (N) DailyStats
Users (1) ──► (N) Notifications
Habits (N) ──► (1) MasterHabits
Habits (N) ──► (N) Notifications (optional)
```

### Detailed Schema Documentation

#### Users Collection
```javascript
{
  _id: ObjectId,
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  mobile: {
    type: String,
    required: true,
    trim: true,
    match: /^[0-9]{10,15}$/
  },
  passwordHash: {
    type: String,
    required: true,
    select: false
  },
  isPasswordSet: {
    type: Boolean,
    default: false
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  isMobileVerified: {
    type: Boolean,
    default: false
  },
  createdAt: Date,
  updatedAt: Date
}
```

#### OTP Collection
```javascript
{
  _id: ObjectId,
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    index: true
  },
  otp: {
    type: String,
    required: true,
    length: 6
  },
  type: {
    type: String,
    enum: ['signup', 'forgot_password', 'email_verification'],
    required: true
  },
  expiresAt: {
    type: Date,
    required: true,
    default: () => new Date(Date.now() + 10 * 60 * 1000)
  },
  isUsed: {
    type: Boolean,
    default: false
  },
  attempts: {
    type: Number,
    default: 0,
    max: 5
  },
  createdAt: Date
}
```

#### MasterHabits Collection
```javascript
{
  _id: ObjectId,
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  category: {
    type: String,
    required: true,
    enum: [
      'health_fitness',
      'mental_wellbeing',
      'learning_growth',
      'productivity_career',
      'lifestyle_relationships'
    ]
  },
  icon: String (required),
  emoji: String (required),
  suggestedFrequency: {
    type: String,
    enum: ['daily', 'weekly', 'custom'],
    default: 'daily'
  },
  suggestedTimeOfDay: {
    type: String,
    match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
    default: '09:00'
  },
  suggestedDuration: {
    type: String,
    default: '15 min'
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  tags: [String],
  isActive: {
    type: Boolean,
    default: true
  },
  sortOrder: {
    type: Number,
    default: 0
  },
  createdAt: Date,
  updatedAt: Date
}
```

#### Habits Collection
```javascript
{
  _id: ObjectId,
  userId: {
    type: ObjectId,
    ref: 'User',
    required: true
  },
  masterHabitId: {
    type: ObjectId,
    ref: 'MasterHabit',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  category: {
    type: String,
    required: true,
    enum: [
      'health_fitness',
      'mental_wellbeing',
      'learning_growth',
      'productivity_career',
      'lifestyle_relationships'
    ]
  },
  frequency: {
    type: String,
    enum: ['daily', 'weekly', 'custom'],
    default: 'daily'
  },
  timeOfDay: [{
    type: String,
    match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
  }],
  primaryTime: {
    type: String,
    match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
    default: '09:00'
  },
  duration: {
    type: String,
    default: '15 min'
  },
  customDuration: {
    type: Number,
    min: 1,
    max: 1440
  },
  targetValue: {
    type: Number,
    min: 1
  },
  unit: {
    type: String,
    trim: true
  },
  reminderEnabled: {
    type: Boolean,
    default: true
  },
  reminderTimes: [{
    type: String,
    match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: 20
  }],
  history: [{
    date: {
      type: String, // YYYY-MM-DD format
      required: true
    },
    completed: {
      type: Boolean,
      default: false
    },
    completedAt: Date
  }],
  currentStreak: {
    type: Number,
    default: 0
  },
  maxStreak: {
    type: Number,
    default: 0
  },
  createdAt: Date,
  updatedAt: Date
}
```

#### DailyStats Collection
```javascript
{
  _id: ObjectId,
  userId: {
    type: ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  date: {
    type: String, // YYYY-MM-DD format
    required: true,
    index: true
  },
  habitsCompleted: {
    type: Number,
    default: 0
  },
  totalHabits: {
    type: Number,
    default: 0
  },
  completionRate: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  streakDays: {
    type: Number,
    default: 0
  },
  totalMinutes: {
    type: Number,
    default: 0
  },
  categoryStats: {
    health_fitness: {
      completed: Number,
      total: Number,
      minutes: Number
    },
    mental_wellbeing: {
      completed: Number,
      total: Number,
      minutes: Number
    },
    learning_growth: {
      completed: Number,
      total: Number,
      minutes: Number
    },
    productivity_career: {
      completed: Number,
      total: Number,
      minutes: Number
    },
    lifestyle_relationships: {
      completed: Number,
      total: Number,
      minutes: Number
    }
  },
  mood: {
    type: String,
    enum: ['excellent', 'good', 'okay', 'poor', 'terrible']
  },
  notes: {
    type: String,
    maxlength: 500
  },
  achievements: [{
    type: {
      type: String,
      enum: ['streak', 'milestone', 'category_complete', 'perfect_day']
    },
    message: String,
    value: Number,
    category: String
  }],
  createdAt: Date,
  updatedAt: Date
}
```

## 🔐 Authentication & Security

### JWT Implementation
```javascript
// Token Generation
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};

// Token Verification Middleware
const protect = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.userId).select('-passwordHash');
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};
```

### Password Security
```javascript
// Password Hashing
userSchema.pre('save', async function(next) {
  if (!this.isModified('passwordHash')) return next();
  this.passwordHash = await bcrypt.hash(this.passwordHash, 12);
  next();
});

// Password Comparison
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.passwordHash);
};
```

## 🛠️ API Architecture

### Route Structure
```
/api/auth/
├── POST /signup
├── POST /verify-otp
├── POST /login
├── POST /forgot-password
└── POST /reset-password

/api/habits/
├── GET /
├── POST /
├── GET /:id
├── PUT /:id
├── DELETE /:id
├── POST /:id/toggle
└── GET /stats

/api/master-habits/
├── GET /
├── GET /categories
└── GET /:id

/api/daily-stats/
├── GET /
├── GET /today
├── PUT /today
├── GET /streak
└── GET /category-performance

/api/notifications/
├── GET /
├── POST /
├── PUT /:id/read
├── PUT /mark-all-read
└── DELETE /:id
```

### Request/Response Format
```javascript
// Success Response
{
  success: true,
  message: "Operation successful",
  data: { /* response data */ }
}

// Error Response
{
  success: false,
  message: "Error description",
  error: "Detailed error message"
}

// Validation Error Response
{
  success: false,
  message: "Validation failed",
  errors: [
    {
      field: "fieldName",
      message: "Error message"
    }
  ]
}
```

## 🎨 Frontend Architecture

### Component Hierarchy
```
App
├── AuthProvider
├── MasterHabitProvider
├── HabitProvider
├── NotificationProvider
└── Router
    ├── Landing
    ├── Signup
    ├── VerifyOTP
    ├── Login
    ├── ForgotPassword
    ├── ResetPassword
    └── Dashboard
        ├── TopNav
        ├── Sidebar
        ├── HabitsSection
        │   ├── MasterHabitSelector
        │   ├── HabitCreationForm
        │   └── HabitCard
        └── StatsSection
```

### State Management
```javascript
// Context Pattern
const HabitContext = createContext();

export const HabitProvider = ({ children }) => {
  const [habits, setHabits] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);
  
  const value = {
    habits,
    stats,
    loading,
    createHabit,
    updateHabit,
    deleteHabit,
    toggleHabit,
    fetchHabits,
    fetchStats
  };
  
  return (
    <HabitContext.Provider value={value}>
      {children}
    </HabitContext.Provider>
  );
};
```

### API Integration
```javascript
// Centralized API Client
const API = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request Interceptor
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

## 📊 Data Flow

### Habit Creation Flow
```
1. User clicks "Add Habit"
   ↓
2. MasterHabitSelector opens
   ↓
3. User selects master habit
   ↓
4. HabitCreationForm opens
   ↓
5. User customizes habit details
   ↓
6. Form validation
   ↓
7. API call to POST /api/habits
   ↓
8. Backend validation & creation
   ↓
9. Response with created habit
   ↓
10. Frontend updates state
    ↓
11. Modal closes, habit appears in dashboard
```

### Habit Completion Flow
```
1. User clicks habit card
   ↓
2. Frontend calls POST /api/habits/:id/toggle
   ↓
3. Backend updates habit history
   ↓
4. Backend recalculates streaks
   ↓
5. Backend updates daily stats
   ↓
6. Response with updated habit
   ↓
7. Frontend updates UI
```

## 🔄 Background Jobs

### Scheduled Tasks
```javascript
// Daily habit reminders (runs at 9 AM)
cron.schedule('0 9 * * *', async () => {
  console.log('Running daily habit reminders...');
  
  const habits = await Habit.find({
    reminderEnabled: true,
    isActive: true
  }).populate('userId');
  
  for (const habit of habits) {
    const user = habit.userId;
    const reminderTime = new Date();
    const [hours, minutes] = habit.primaryTime.split(':');
    reminderTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    
    if (reminderTime <= new Date()) {
      await Notification.createHabitReminder(
        user._id,
        habit._id,
        `Time for "${habit.title}"!`,
        reminderTime
      );
    }
  }
});
```

## 🧪 Testing Strategy

### Backend Testing
```javascript
// Example test structure
describe('Habit Controller', () => {
  beforeEach(async () => {
    await setupTestDB();
  });
  
  afterEach(async () => {
    await cleanupTestDB();
  });
  
  describe('POST /api/habits', () => {
    it('should create a new habit', async () => {
      const habitData = {
        masterHabitId: 'valid-id',
        title: 'Test Habit',
        frequency: 'daily'
      };
      
      const response = await request(app)
        .post('/api/habits')
        .set('Authorization', `Bearer ${validToken}`)
        .send(habitData)
        .expect(201);
      
      expect(response.body.success).toBe(true);
      expect(response.body.habit.title).toBe('Test Habit');
    });
  });
});
```

### Frontend Testing
```javascript
// Example component test
import { render, screen, fireEvent } from '@testing-library/react';
import { HabitCard } from '../HabitCard';

describe('HabitCard', () => {
  const mockHabit = {
    _id: '1',
    title: 'Test Habit',
    description: 'Test Description',
    timeOfDay: ['09:00'],
    currentStreak: 5
  };
  
  it('renders habit information correctly', () => {
    render(<HabitCard habit={mockHabit} />);
    
    expect(screen.getByText('Test Habit')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });
});
```

## 🚀 Performance Optimizations

### Database Optimizations
- **Indexes**: Strategic indexing on frequently queried fields
- **Aggregation**: Efficient aggregation pipelines for analytics
- **Pagination**: Implemented for large datasets
- **Connection Pooling**: MongoDB connection pooling

### Frontend Optimizations
- **Code Splitting**: Lazy loading of components
- **Memoization**: React.memo for expensive components
- **Virtual Scrolling**: For large lists
- **Image Optimization**: Optimized images and icons

### Caching Strategy
- **API Caching**: Redis for frequently accessed data
- **Browser Caching**: Static assets caching
- **CDN**: Content delivery network for global access

## 🔧 Development Tools

### Backend Tools
- **Nodemon**: Auto-restart during development
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting
- **Jest**: Testing framework
- **Supertest**: API testing

### Frontend Tools
- **Vite**: Fast build tool and dev server
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Jest**: Testing framework
- **React Testing Library**: Component testing

## 📈 Monitoring & Analytics

### Application Metrics
- **Performance**: Response times, throughput
- **Errors**: Error rates and types
- **Usage**: User engagement metrics
- **Database**: Query performance, connection usage

### Logging Strategy
```javascript
// Structured logging
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

## 🔒 Security Considerations

### Data Protection
- **Encryption**: Sensitive data encryption at rest
- **HTTPS**: All communications encrypted in transit
- **Input Sanitization**: All inputs validated and sanitized
- **Rate Limiting**: API rate limiting to prevent abuse

### Authentication Security
- **JWT Expiration**: Short-lived tokens with refresh mechanism
- **Password Policies**: Strong password requirements
- **OTP Security**: Time-limited OTPs with attempt limits
- **Session Management**: Secure session handling

## 📱 Mobile Responsiveness

### Breakpoints
```css
/* Mobile First Approach */
@media (min-width: 640px) { /* sm */ }
@media (min-width: 768px) { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
```

### Touch Interactions
- **Touch Targets**: Minimum 44px touch targets
- **Swipe Gestures**: Intuitive swipe interactions
- **Hover States**: Appropriate hover states for touch devices

## 🌐 Deployment Architecture

### Production Environment
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   CDN/CloudFlare│    │   Load Balancer │    │   App Servers   │
│   (Static Assets)│◄──►│   (Nginx)       │◄──►│   (Node.js)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │   MongoDB       │
                       │   (Atlas)       │
                       └─────────────────┘
```

### Environment Configuration
- **Development**: Local development with hot reload
- **Staging**: Production-like environment for testing
- **Production**: Optimized for performance and security

---

This technical documentation provides a comprehensive overview of the HabityFy application architecture, implementation details, and best practices. For specific implementation questions or additional details, please refer to the source code or contact the development team.
