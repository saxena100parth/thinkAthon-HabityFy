# 📅 Weekly Habits Feature Guide

## 🎯 **Overview**

The HabityFy app now supports **weekly habits** - habits that can be completed once per week and remain visible throughout the entire week. This is perfect for tasks like meal prep, grocery shopping, therapy sessions, or any other weekly activities.

---

## ✨ **Key Features**

### **Weekly Habit Behavior:**
- ✅ **Once per week**: Can only be completed once per week (Monday-Sunday)
- 📅 **Week-long visibility**: Remains visible throughout the entire week
- 🔄 **Flexible timing**: Can be completed on any day of the week
- 📊 **Weekly streaks**: Streaks are calculated based on consecutive weeks
- 🏷️ **Visual indicators**: Clear "Weekly" badge and appropriate button text

### **User Experience:**
- **Button text**: "Mark Complete for Week" / "Completed This Week"
- **Badge**: Blue "Weekly" badge on habit cards
- **Streak display**: Shows "Current Week" and "Best Week" instead of "Streak"
- **Completion status**: Shows as completed for the entire week once marked

---

## 🚀 **How It Works**

### **Backend Logic:**

1. **Week Calculation**: 
   - Week starts on Monday and ends on Sunday
   - Uses `getWeekStart()` method to calculate week boundaries

2. **Completion Tracking**:
   - `isCompletedForWeek()` checks if habit is completed for the current week
   - `toggleWeeklyCompletion()` handles weekly completion logic
   - Only one completion per week is allowed

3. **Streak Calculation**:
   - `updateWeeklyStreaks()` calculates streaks based on consecutive weeks
   - Current streak: consecutive weeks from current week backwards
   - Best streak: longest consecutive week streak ever achieved

### **Frontend Display:**

1. **Habit Card**:
   - Shows "Weekly" badge for weekly habits
   - Button text changes to "Mark Complete for Week"
   - Streak labels show "Week" instead of "Streak"

2. **Date Picker**:
   - Works the same as daily habits
   - Shows completion status for the selected week

---

## 🧪 **Testing Weekly Habits**

### **Manual Testing:**

1. **Start the application:**
   ```bash
   # Backend
   cd backend && npm run dev
   
   # Frontend
   cd frontend && npm run dev
   ```

2. **Go to:** http://localhost:5173

3. **Create a weekly habit:**
   - Click "Add Habit"
   - Select a weekly master habit (e.g., "Weekly meal prep")
   - Customize and create the habit

4. **Test weekly completion:**
   - Notice the "Weekly" badge on the habit card
   - Click "Mark Complete for Week"
   - Button should change to "Completed This Week"
   - Try clicking on different days - should remain completed

5. **Test different weeks:**
   - Use date picker to go to next week
   - Habit should show as not completed
   - Complete it for the new week
   - Go back to previous week - should still show as completed

### **Automated Testing:**

```bash
# Run the weekly habits test
node test-weekly-habits.js
```

This will test:
- Weekly completion across different days
- Week boundary calculations
- Streak calculations
- History tracking
- Different week behavior

---

## 📊 **API Usage Examples**

### **Create Weekly Habit:**
```bash
curl -X POST "http://localhost:5000/api/habits" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "masterHabitId": "master_habit_id",
    "title": "Weekly Meal Prep",
    "frequency": "weekly",
    "timeOfDay": ["10:00"],
    "primaryTime": "10:00"
  }'
```

### **Toggle Weekly Completion:**
```bash
curl -X POST "http://localhost:5000/api/habits/habit_id/toggle" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"date": "2024-01-15"}'
```

**Response:**
```json
{
  "success": true,
  "message": "Habit completed for 2024-01-15",
  "habit": {
    "id": "habit_id",
    "title": "Weekly Meal Prep",
    "frequency": "weekly",
    "currentStreak": 3,
    "maxStreak": 5,
    "completedForDate": true,
    "completedAtForDate": "2024-01-15T10:30:00.000Z",
    "targetDate": "2024-01-15",
    "isWeeklyCompleted": true
  }
}
```

---

## 🎨 **UI Components**

### **Weekly Habit Card:**
```jsx
<HabitCard
  habit={{
    title: "Weekly Meal Prep",
    frequency: "weekly",
    completedForDate: true,
    isWeeklyCompleted: true
  }}
  selectedDate="2024-01-15"
  onToggle={() => handleToggleHabit(habit._id)}
/>
```

### **Visual Indicators:**
- **Badge**: `<span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">Weekly</span>`
- **Button**: `{isWeekly ? 'Mark Complete for Week' : 'Mark Complete'}`
- **Streak**: `Current {isWeekly ? 'Week' : 'Streak'}`

---

## 📈 **Master Habits with Weekly Frequency**

The following weekly habits are available in the master habits:

### **Health & Fitness:**
- Weekly meal prep
- Weekly grocery shopping

### **Mental Well-being:**
- Weekly therapy session
- Weekly digital detox

### **Learning & Growth:**
- Weekly skill practice
- Weekly goal review

### **Productivity & Career:**
- Weekly planning session
- Weekly expense tracking

### **Lifestyle & Relationships:**
- Weekly family time
- Weekly decluttering

---

## 🔧 **Technical Implementation**

### **Backend Changes:**

1. **Habit Model**:
   - `getWeekStart()` - Calculate week start (Monday)
   - `isCompletedForWeek()` - Check weekly completion
   - `toggleWeeklyCompletion()` - Handle weekly toggling
   - `updateWeeklyStreaks()` - Calculate weekly streaks

2. **Habit Controller**:
   - Updated `toggleHabit()` to handle weekly frequency
   - Enhanced `getHabits()` to show weekly completion status
   - Added `isWeeklyCompleted` field to responses

### **Frontend Changes:**

1. **HabitCard Component**:
   - Added weekly frequency detection
   - Updated button text and styling
   - Added "Weekly" badge
   - Updated streak labels

2. **Master Habits**:
   - Added weekly master habits to seed data
   - Different suggested frequencies (daily vs weekly)

---

## 🎯 **Use Cases**

### **Perfect for Weekly Habits:**
- 🍽️ **Meal prep** - Prepare meals for the week
- 🛒 **Grocery shopping** - Weekly shopping trips
- 🛋️ **Therapy sessions** - Weekly counseling
- 📱 **Digital detox** - Weekly device-free time
- 🧹 **House cleaning** - Weekly deep clean
- 📊 **Budget review** - Weekly financial check-in
- 👨‍👩‍👧‍👦 **Family time** - Weekly quality time
- 🎯 **Goal review** - Weekly progress assessment

### **Benefits:**
- **Flexibility**: Complete on any day of the week
- **Visibility**: Always visible throughout the week
- **Motivation**: Clear weekly goals and progress
- **Organization**: Perfect for weekly routines
- **Balance**: Less pressure than daily habits

---

## 🐛 **Troubleshooting**

### **Common Issues:**

1. **Weekly habit not showing as completed**:
   - Check that `frequency` is set to "weekly"
   - Verify the week calculation is correct
   - Ensure the habit is using weekly completion logic

2. **Streaks not calculating correctly**:
   - Check that `updateWeeklyStreaks()` is being called
   - Verify week boundary calculations
   - Ensure history entries are properly grouped by week

3. **Button text not updating**:
   - Check that `isWeekly` is correctly calculated
   - Verify the habit frequency is "weekly"
   - Ensure the component is re-rendering

### **Debug Commands:**

```bash
# Check habit details
curl -X GET "http://localhost:5000/api/habits/habit_id" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Test weekly completion
curl -X POST "http://localhost:5000/api/habits/habit_id/toggle" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"date": "2024-01-15"}'
```

---

## 🎉 **Summary**

Weekly habits provide a perfect balance between daily habits and monthly goals. They offer:

- **Flexibility**: Complete on any day of the week
- **Consistency**: Regular weekly routine
- **Visibility**: Always present throughout the week
- **Achievement**: Clear weekly completion goals
- **Progress**: Weekly streak tracking

**This makes HabityFy even more versatile for different types of habits and user preferences!** 🚀
