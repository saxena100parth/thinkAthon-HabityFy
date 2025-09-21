# HabityFy Testing Guide

## 🧪 Manual Testing for Daily Habit Completion

### **Understanding Daily Habit Behavior:**

When you mark a habit as completed for today:
1. ✅ **Today**: Habit shows as completed with a checkmark
2. ✅ **Streak**: Your current streak increases by 1
3. ✅ **History**: A record is added to the habit's history for today's date
4. 🔄 **Tomorrow**: The habit resets and shows as not completed for the new day

---

## 🎯 **Step-by-Step Manual Testing**

### **Test 1: Basic Daily Completion**

#### **Setup:**
1. **Start the application:**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev
   
   # Terminal 2 - Frontend  
   cd frontend
   npm run dev
   ```

2. **Create a test account:**
   - Go to http://localhost:5173
   - Sign up with a test email
   - Verify OTP and set password
   - Login to dashboard

3. **Create a test habit:**
   - Click "Add Habit"
   - Select any master habit (e.g., "Drink 8 glasses of water")
   - Customize if needed
   - Click "Create Habit"

#### **Test Steps:**

**Day 1 (Today):**
1. **Check Initial State:**
   - Habit should show as "Not Completed"
   - Current Streak: 0
   - Best Streak: 0

2. **Mark as Complete:**
   - Click on the habit card
   - Habit should show checkmark ✅
   - Current Streak should become 1
   - Best Streak should become 1

3. **Verify in Database:**
   ```bash
   # Check MongoDB (if using local MongoDB)
   mongo
   use habityfy
   db.habits.findOne({title: "Drink 8 glasses of water"})
   ```
   
   You should see:
   ```json
   {
     "history": [
       {
         "date": "2024-01-16", // Today's date
         "completed": true,
         "completedAt": "2024-01-16T10:30:00.000Z"
       }
     ],
     "currentStreak": 1,
     "maxStreak": 1
   }
   ```

**Day 2 (Tomorrow):**
1. **Wait until next day OR simulate tomorrow:**
   - Option A: Wait until actual tomorrow
   - Option B: Manually change system date (advanced)
   - Option C: Use API to test (see below)

2. **Check Tomorrow's State:**
   - Habit should show as "Not Completed" again
   - Current Streak should still be 1 (until you complete it)
   - Best Streak should still be 1

3. **Mark as Complete for Day 2:**
   - Click on the habit card
   - Habit should show checkmark ✅
   - Current Streak should become 2
   - Best Streak should become 2

---

## 🔬 **Advanced Testing Methods**

### **Method 1: API Testing (Recommended)**

Use Postman or curl to test the toggle functionality:

#### **Get Your Habit ID:**
```bash
curl -X GET "http://localhost:5000/api/habits" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

#### **Toggle Habit Completion:**
```bash
curl -X POST "http://localhost:5000/api/habits/HABIT_ID/toggle" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

#### **Check Habit Status:**
```bash
curl -X GET "http://localhost:5000/api/habits/HABIT_ID" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

### **Method 2: Database Direct Testing**

#### **Check Today's Completion:**
```javascript
// In MongoDB shell or MongoDB Compass
db.habits.findOne(
  {title: "Drink 8 glasses of water"},
  {history: 1, currentStreak: 1, maxStreak: 1}
)
```

#### **Simulate Different Dates:**
```javascript
// Add completion for yesterday
db.habits.updateOne(
  {title: "Drink 8 glasses of water"},
  {
    $push: {
      history: {
        date: "2024-01-15", // Yesterday
        completed: true,
        completedAt: new Date("2024-01-15T10:00:00.000Z")
      }
    }
  }
)

// Add completion for day before yesterday
db.habits.updateOne(
  {title: "Drink 8 glasses of water"},
  {
    $push: {
      history: {
        date: "2024-01-14", // Day before yesterday
        completed: true,
        completedAt: new Date("2024-01-14T10:00:00.000Z")
      }
    }
  }
)
```

---

## 📊 **Testing Scenarios**

### **Scenario 1: Perfect Streak**
1. **Day 1**: Complete habit → Streak: 1
2. **Day 2**: Complete habit → Streak: 2
3. **Day 3**: Complete habit → Streak: 3
4. **Day 4**: Complete habit → Streak: 4
5. **Day 5**: Complete habit → Streak: 5

**Expected Result:**
- Current Streak: 5
- Best Streak: 5
- History: 5 completed entries

### **Scenario 2: Broken Streak**
1. **Day 1**: Complete habit → Streak: 1
2. **Day 2**: Complete habit → Streak: 2
3. **Day 3**: Complete habit → Streak: 3
4. **Day 4**: Miss habit → Streak: 0
5. **Day 5**: Complete habit → Streak: 1

**Expected Result:**
- Current Streak: 1
- Best Streak: 3
- History: 4 completed entries (Day 4 missing)

### **Scenario 3: Toggle Same Day**
1. **Day 1**: Complete habit → Streak: 1
2. **Day 1**: Toggle again (uncomplete) → Streak: 0
3. **Day 1**: Toggle again (complete) → Streak: 1

**Expected Result:**
- Current Streak: 1
- Best Streak: 1
- History: 1 completed entry for Day 1

---

## 🐛 **Common Issues to Test**

### **Issue 1: Timezone Problems**
- **Test**: Complete habit at different times of day
- **Check**: Date should be consistent (YYYY-MM-DD format)
- **Fix**: Ensure server uses consistent timezone

### **Issue 2: Streak Calculation**
- **Test**: Complete habits on non-consecutive days
- **Check**: Streak should reset correctly
- **Fix**: Verify streak calculation logic

### **Issue 3: Multiple Toggles**
- **Test**: Toggle same habit multiple times in one day
- **Check**: Should only count as one completion
- **Fix**: Ensure toggle logic works correctly

---

## 🔍 **Debugging Tools**

### **Frontend Console Logs**
Open browser DevTools (F12) and check console for:
```javascript
// Look for these logs when toggling habits
console.log('Toggling habit:', habitId);
console.log('Habit updated:', updatedHabit);
console.log('Streak updated:', currentStreak);
```

### **Backend Logs**
Check terminal running the backend for:
```bash
# Look for these logs
POST /api/habits/:id/toggle
Habit completion toggled successfully
Streak updated: 1
```

### **Database Queries**
```javascript
// Check habit history
db.habits.find(
  {title: "Drink 8 glasses of water"},
  {history: 1, currentStreak: 1, maxStreak: 1, updatedAt: 1}
).sort({updatedAt: -1})

// Check daily stats
db.dailystats.find(
  {userId: ObjectId("USER_ID")},
  {date: 1, habitsCompleted: 1, totalHabits: 1, completionRate: 1}
).sort({date: -1})
```

---

## ✅ **Testing Checklist**

### **Basic Functionality**
- [ ] Can create a habit
- [ ] Can mark habit as complete
- [ ] Can mark habit as incomplete (toggle)
- [ ] Streak updates correctly
- [ ] History records correctly
- [ ] Daily stats update

### **Edge Cases**
- [ ] Toggle same day multiple times
- [ ] Complete habit on consecutive days
- [ ] Miss habit and check streak reset
- [ ] Complete habit after missing days
- [ ] Check timezone handling

### **UI/UX**
- [ ] Visual feedback on completion
- [ ] Streak display updates
- [ ] Loading states work
- [ ] Error handling works
- [ ] Mobile responsiveness

---

## 🚀 **Quick Test Script**

Here's a simple test script you can run:

```bash
#!/bin/bash
# Quick test script for habit completion

echo "🧪 Testing HabityFy Daily Completion..."

# 1. Get JWT token (replace with actual login)
TOKEN="your_jwt_token_here"
HABIT_ID="your_habit_id_here"

# 2. Get initial habit state
echo "📊 Getting initial habit state..."
curl -s -X GET "http://localhost:5000/api/habits/$HABIT_ID" \
  -H "Authorization: Bearer $TOKEN" | jq '.habit.currentStreak, .habit.maxStreak'

# 3. Toggle habit completion
echo "🔄 Toggling habit completion..."
curl -s -X POST "http://localhost:5000/api/habits/$HABIT_ID/toggle" \
  -H "Authorization: Bearer $TOKEN" | jq '.message'

# 4. Check updated state
echo "📈 Checking updated state..."
curl -s -X GET "http://localhost:5000/api/habits/$HABIT_ID" \
  -H "Authorization: Bearer $TOKEN" | jq '.habit.currentStreak, .habit.maxStreak, .habit.history[-1]'

echo "✅ Test completed!"
```

---

## 🎯 **Expected Results Summary**

### **When you complete a habit today:**
- ✅ Habit shows as completed
- ✅ Current streak increases by 1
- ✅ Best streak updates if current > best
- ✅ History entry added for today
- ✅ Daily stats updated

### **Tomorrow:**
- 🔄 Habit shows as not completed
- 🔄 You can complete it again
- 🔄 Streak continues if you complete it
- 🔄 Streak resets if you miss it

This is the expected behavior for daily habits - they reset each day and you need to complete them again to maintain your streak! 🎉
