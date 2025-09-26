# AI-Powered Diet Chart Feature - HabityFy

## 🍎 Overview

The AI-Powered Diet Chart feature is a revolutionary addition to HabityFy that leverages artificial intelligence to generate personalized diet recommendations based on comprehensive user inputs. This feature transforms HabityFy from a habit tracking app into a complete wellness platform.

## ✨ Key Features

### 🤖 AI-Powered Generation
- **Smart Input Collection**: Comprehensive questionnaire gathering personal details, health goals, and dietary preferences
- **OpenAPI Integration**: Advanced AI generates personalized 7-day meal plans
- **Multiple Diet Types**: Support for various dietary preferences (vegetarian, vegan, keto, paleo, Mediterranean, etc.)
- **Real-time Generation**: Diet charts generated in under 30 seconds

### 📊 Comprehensive Input Collection
- **Personal Information**: Age, gender, height, weight, activity level
- **Health Goals**: Weight loss, muscle gain, maintenance, specific conditions
- **Dietary Preferences**: Food restrictions, allergies, cuisine preferences
- **Lifestyle Factors**: Meal frequency, cooking time, budget constraints

### 🔗 Seamless Integration
- **Habit Conversion**: Automatically converts diet recommendations into trackable habits
- **Progress Tracking**: Monitor adherence to AI-generated diet recommendations
- **Analytics Integration**: Correlate diet habits with existing health habits
- **Export Capabilities**: PDF export and sharing of diet charts

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account or local MongoDB
- OpenAPI API key
- Existing HabityFy application

### Installation

1. **Install Dependencies**
   ```bash
   cd backend
   npm install openai
   ```

2. **Environment Variables**
   Add to your `.env` file:
   ```env
   OPENAI_API_KEY=your_openai_api_key
   OPENAI_MODEL=gpt-4
   ```

3. **Database Setup**
   The feature will automatically create the required collections when first used.

## 📁 Project Structure

```
diet-chart-feature/
├── backend/
│   ├── models/
│   │   ├── DietPreferences.js      # User diet preferences
│   │   ├── DietChart.js           # Generated diet charts
│   │   └── DietHabit.js           # Diet-related habits
│   ├── controllers/
│   │   ├── dietPreferencesController.js
│   │   ├── dietChartController.js
│   │   └── dietHabitController.js
│   ├── routes/
│   │   └── diet.js                # Diet-related API routes
│   ├── services/
│   │   ├── openaiService.js       # OpenAPI integration
│   │   └── dietGenerationService.js
│   └── middleware/
│       └── dietValidation.js      # Input validation
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── diet/
│   │   │   │   ├── DietInputForm.jsx
│   │   │   │   ├── DietChartDisplay.jsx
│   │   │   │   ├── DietPreferences.jsx
│   │   │   │   └── DietHabits.jsx
│   │   │   └── ui/
│   │   │       ├── ProgressStepper.jsx
│   │   │       └── NutritionCard.jsx
│   │   ├── pages/
│   │   │   ├── DietDashboard.jsx
│   │   │   └── DietGenerator.jsx
│   │   └── contexts/
│   │       └── DietContext.jsx
└── docs/
    ├── API.md
    └── USER_GUIDE.md
```

## 🛠️ Technical Implementation

### Data Models

#### DietPreferences Schema
```javascript
const DietPreferencesSchema = {
  userId: ObjectId,
  personalInfo: {
    age: Number,
    gender: String,
    height: Number,
    weight: Number,
    activityLevel: String,
    bmr: Number,
    tdee: Number
  },
  healthGoals: {
    primaryGoal: String,
    targetWeight: Number,
    timeline: Number,
    medicalConditions: [String],
    medications: [String]
  },
  dietaryPreferences: {
    dietType: String,
    restrictions: [String],
    allergies: [String],
    dislikedFoods: [String],
    preferredCuisines: [String]
  },
  lifestyle: {
    mealFrequency: Number,
    cookingTime: String,
    budget: String,
    prepDays: [String],
    kitchenEquipment: [String]
  }
}
```

#### DietChart Schema
```javascript
const DietChartSchema = {
  userId: ObjectId,
  preferencesId: ObjectId,
  title: String,
  description: String,
  duration: Number,
  totalCalories: Number,
  macroBreakdown: {
    protein: { grams: Number, percentage: Number },
    carbs: { grams: Number, percentage: Number },
    fat: { grams: Number, percentage: Number }
  },
  dailyPlans: [{
    day: Number,
    date: String,
    meals: [{
      mealType: String,
      time: String,
      foods: [{
        name: String,
        quantity: String,
        calories: Number,
        protein: Number,
        carbs: Number,
        fat: Number
      }],
      instructions: String
    }]
  }],
  shoppingList: [{
    category: String,
    items: [{
      name: String,
      quantity: String,
      estimatedCost: Number
    }]
  }]
}
```

### API Endpoints

#### Diet Preferences
- `POST /api/diet/preferences` - Save user diet preferences
- `GET /api/diet/preferences` - Get user preferences
- `PUT /api/diet/preferences/:id` - Update preferences

#### Diet Charts
- `POST /api/diet/generate` - Generate new diet chart
- `GET /api/diet/charts` - Get user's diet charts
- `GET /api/diet/charts/:id` - Get specific diet chart
- `PUT /api/diet/charts/:id` - Update diet chart
- `DELETE /api/diet/charts/:id` - Delete diet chart

#### Diet Habits
- `POST /api/diet/charts/:id/habits` - Convert to trackable habits
- `GET /api/diet/habits` - Get diet-related habits

### OpenAPI Integration

```javascript
// Example OpenAPI service implementation
const openaiService = {
  async generateDietChart(preferences) {
    const prompt = this.buildPrompt(preferences);
    
    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a professional nutritionist and dietitian. Generate detailed, personalized diet charts based on user preferences."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 4000
    });
    
    return this.parseDietResponse(response.choices[0].message.content);
  }
};
```

## 🎯 User Flow

### 1. Input Collection
1. **Welcome Screen** - Introduction to AI diet generation
2. **Personal Information** - Basic health metrics
3. **Health Goals** - Primary objectives and timeline
4. **Dietary Preferences** - Food restrictions and preferences
5. **Lifestyle Factors** - Cooking time, budget, equipment
6. **Review & Confirm** - Summary before generation

### 2. Diet Generation
1. **AI Processing** - Generate personalized diet chart
2. **Review Results** - Display generated recommendations
3. **Customize** - Make adjustments if needed
4. **Save & Convert** - Save chart and create habits

### 3. Habit Integration
1. **Auto-Create Habits** - Convert recommendations to trackable habits
2. **Progress Tracking** - Monitor adherence to diet plan
3. **Analytics** - View comprehensive wellness reports

## 📱 Frontend Components

### Core Components

#### DietInputForm.jsx
```jsx
const DietInputForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  
  const steps = [
    'Personal Information',
    'Health Goals',
    'Dietary Preferences',
    'Lifestyle Factors',
    'Review & Confirm'
  ];
  
  return (
    <div className="diet-input-form">
      <ProgressStepper steps={steps} currentStep={currentStep} />
      {/* Form content based on current step */}
    </div>
  );
};
```

#### DietChartDisplay.jsx
```jsx
const DietChartDisplay = ({ dietChart }) => {
  return (
    <div className="diet-chart-display">
      <div className="chart-overview">
        <h2>{dietChart.title}</h2>
        <NutritionCard nutrition={dietChart.macroBreakdown} />
      </div>
      
      <div className="daily-plans">
        {dietChart.dailyPlans.map(day => (
          <DailyPlan key={day.day} plan={day} />
        ))}
      </div>
      
      <div className="shopping-list">
        <ShoppingList items={dietChart.shoppingList} />
      </div>
    </div>
  );
};
```

## 🔧 Configuration

### Environment Variables
```env
# OpenAPI Configuration
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4
OPENAI_MAX_TOKENS=4000
OPENAI_TEMPERATURE=0.7

# Diet Chart Settings
DIET_CHART_DURATION=7
DIET_CHART_EXPIRY_DAYS=30
MAX_DIET_CHARTS_PER_USER=5
```

### Feature Flags
```javascript
const dietFeatureFlags = {
  enableBarcodeScanning: false,
  enableGroceryIntegration: false,
  enableSocialSharing: true,
  enableExportPDF: true,
  enableHabitConversion: true
};
```

## 📊 Analytics & Metrics

### Key Performance Indicators
- **User Adoption**: 60% of users complete diet preference questionnaire
- **Generation Success**: 95% successful diet chart generation rate
- **User Satisfaction**: 4.5+ star rating for generated diet charts
- **Habit Integration**: 70% of users convert diet recommendations to habits
- **Retention**: 40% increase in user retention after diet feature launch

### Tracking Events
```javascript
// Analytics events to track
const dietAnalyticsEvents = {
  'diet_preferences_started': 'User started diet preferences form',
  'diet_preferences_completed': 'User completed diet preferences form',
  'diet_chart_generated': 'AI successfully generated diet chart',
  'diet_chart_viewed': 'User viewed generated diet chart',
  'diet_habits_created': 'User converted diet to trackable habits',
  'diet_chart_exported': 'User exported diet chart as PDF',
  'diet_chart_shared': 'User shared diet chart with others'
};
```

## 🚨 Error Handling

### Common Error Scenarios
1. **OpenAPI Rate Limits**: Implement exponential backoff and retry logic
2. **Invalid User Input**: Comprehensive validation with helpful error messages
3. **Generation Failures**: Fallback responses and user-friendly error handling
4. **Network Issues**: Offline capability and sync when connection restored

### Error Response Format
```javascript
const errorResponse = {
  success: false,
  error: {
    code: 'DIET_GENERATION_FAILED',
    message: 'Unable to generate diet chart. Please try again.',
    details: 'OpenAPI service temporarily unavailable',
    retryAfter: 30 // seconds
  }
};
```

## 🔒 Security & Privacy

### Data Protection
- All personal health information encrypted in transit and at rest
- GDPR compliance for health data processing
- User data export and deletion capabilities
- Secure API key management

### Privacy Controls
```javascript
const privacySettings = {
  dataRetention: '30 days',
  anonymization: true,
  thirdPartySharing: false,
  dataExport: true,
  dataDeletion: true
};
```

## 🧪 Testing

### Unit Tests
```bash
# Run diet feature tests
npm test -- --grep "diet"

# Run specific test suites
npm test dietPreferences.test.js
npm test dietChart.test.js
npm test openaiService.test.js
```

### Integration Tests
```bash
# Test API endpoints
npm run test:integration -- --grep "diet-api"

# Test OpenAPI integration
npm run test:integration -- --grep "openai"
```

### E2E Tests
```bash
# Test complete user flow
npm run test:e2e -- --grep "diet-generation-flow"
```

## 📈 Performance Optimization

### Caching Strategy
- Cache generated diet charts for 24 hours
- Cache user preferences for 7 days
- Implement Redis for session management

### API Optimization
- Batch OpenAPI requests when possible
- Implement request queuing for high traffic
- Use connection pooling for database queries

## 🚀 Deployment

### Production Checklist
- [ ] OpenAPI API key configured
- [ ] Database migrations completed
- [ ] Feature flags enabled
- [ ] Analytics tracking implemented
- [ ] Error monitoring configured
- [ ] Performance monitoring active

### Rollout Strategy
1. **Phase 1**: Internal testing (Week 1)
2. **Phase 2**: Beta users (Week 2-3)
3. **Phase 3**: Gradual rollout (Week 4-6)
4. **Phase 4**: Full release (Week 7)

## 📚 Documentation

### API Documentation
- [API Reference](./docs/API.md)
- [OpenAPI Integration Guide](./docs/OPENAI_INTEGRATION.md)
- [Error Codes Reference](./docs/ERROR_CODES.md)

### User Guides
- [User Guide](./docs/USER_GUIDE.md)
- [FAQ](./docs/FAQ.md)
- [Troubleshooting](./docs/TROUBLESHOOTING.md)

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/diet-chart-enhancement`
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

### Code Standards
- Follow existing code style and conventions
- Add comprehensive tests for new features
- Update documentation for API changes
- Ensure all tests pass before submitting PR

## 📞 Support

### Getting Help
- **Documentation**: Check the docs folder for detailed guides
- **Issues**: Report bugs and feature requests via GitHub issues
- **Discussions**: Join community discussions for questions and ideas

### Contact
- **Technical Issues**: Create a GitHub issue
- **Feature Requests**: Use the feature request template
- **General Questions**: Join our community discussions

## 📄 License

This feature is part of the HabityFy project and follows the same licensing terms.

---

**Last Updated**: January 2025  
**Version**: 1.0.0  
**Maintainer**: HabityFy Development Team
