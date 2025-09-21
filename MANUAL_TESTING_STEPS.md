# 🧪 Manual Testing Steps for Daily Habit Completion

## 🎯 **Quick Answer to Your Question:**

**When you mark a task as completed today:**
- ✅ **Today**: Shows as completed with checkmark
- ✅ **Streak**: Increases by 1
- 🔄 **Tomorrow**: The task resets and shows as NOT completed
- 🔄 **You need to complete it again tomorrow** to maintain your streak

---

## 🚀 **Step-by-Step Manual Testing**

### **Step 1: Start the Application**

1. **Backend** (Terminal 1):
   ```bash
   cd backend
   npm run dev
   ```
   Should show: `🚀 HabityFy server is running on 0.0.0.0:5000`

2. **Frontend** (Terminal 2):
   ```bash
   cd frontend
   npm run dev
   ```
   Should show: `Local: http://localhost:5173/`

### **Step 2: Create Test Account**

1. **Open Browser**: Go to http://localhost:5173
2. **Sign Up**:
   - Email: `test@example.com`
   - Username: `testuser`
   - Mobile: `1234567890`
   - Click "Send OTP"
3. **Check Console**: Look for OTP in backend terminal
4. **Verify OTP**:
   - Enter the OTP from console
   - Password: `testpassword123`
   - Click "Create Account"
5. **Login**: You should be automatically logged in

### **Step 3: Create a Test Habit**

1. **Click "Add Habit"** on dashboard
2. **Select a Master Habit**:
   - Choose "Drink 8 glasses of water" (or any habit)
   - Click on the habit card
3. **Customize** (optional):
   - Change title if you want
   - Set reminder times
   - Click "Create Habit"
4. **Verify**: Habit should appear on your dashboard

### **Step 4: Test Daily Completion**

#### **Initial State Check:**
- **Current Streak**: Should show `0`
- **Best Streak**: Should show `0`
- **Habit Status**: Should show as "Not Completed" (no checkmark)

#### **Complete the Habit:**
1. **Click on the habit card**
2. **Watch for changes**:
   - ✅ Checkmark should appear
   - **Current Streak**: Should become `1`
   - **Best Streak**: Should become `1`
   - **Visual feedback**: Card should show completed state

#### **Toggle Test (Optional):**
1. **Click the habit card again**
2. **Watch for changes**:
   - ❌ Checkmark should disappear
   - **Current Streak**: Should go back to `0`
   - **Best Streak**: Should remain `1`

3. **Click again to complete**:
   - ✅ Checkmark should reappear
   - **Current Streak**: Should become `1` again

### **Step 5: Test Tomorrow's Behavior**

#### **Option A: Wait Until Tomorrow**
- Come back tomorrow and check:
  - Habit should show as "Not Completed"
  - You can complete it again
  - Streak continues if you complete it

#### **Option B: Simulate Tomorrow (Advanced)**
1. **Stop the backend** (Ctrl+C)
2. **Change system date** to tomorrow
3. **Restart backend**:
   ```bash
   cd backend
   npm run dev
   ```
4. **Refresh frontend**
5. **Check habit**: Should show as not completed

---

## 🔍 **What to Look For**

### **✅ Successful Completion:**
- Habit card shows checkmark
- Streak increases by 1
- History record is created for today
- Daily stats update

### **❌ Common Issues:**
- **No visual change**: Check browser console for errors
- **Streak not updating**: Check backend logs
- **Database not updating**: Verify MongoDB connection

---

## 🐛 **Debugging Tips**

### **Check Browser Console (F12):**
```javascript
// Look for these messages:
"Toggling habit: habit_id"
"Habit updated successfully"
"Streak updated: 1"
```

### **Check Backend Logs:**
```bash
# Look for these messages:
POST /api/habits/:id/toggle
Habit completion toggled successfully
Streak updated: 1
```

### **Check Database (Optional):**
```bash
# If using local MongoDB
mongo
use habityfy
db.habits.findOne({title: "Drink 8 glasses of water"})
```

---

## 📊 **Expected Results Summary**

### **Today (When you complete):**
- ✅ Habit shows as completed
- ✅ Current streak: 1
- ✅ Best streak: 1
- ✅ History: 1 entry for today

### **Tomorrow (When you check):**
- 🔄 Habit shows as NOT completed
- 🔄 Current streak: 1 (until you complete it)
- 🔄 Best streak: 1
- 🔄 You can complete it again

### **Tomorrow (When you complete again):**
- ✅ Habit shows as completed
- ✅ Current streak: 2
- ✅ Best streak: 2
- ✅ History: 2 entries (today + yesterday)

---

## 🎯 **Key Points to Remember**

1. **Daily Habits Reset**: Each day, habits show as not completed
2. **Streak Tracking**: Streaks continue only if you complete consecutively
3. **History Records**: Each completion creates a history entry
4. **Toggle Function**: You can uncomplete and recomplete the same day
5. **Tomorrow's Behavior**: The habit will be available to complete again

---

## 🚀 **Quick Test Script**

If you want to test programmatically, run:

```bash
# Make sure backend is running first
node test-habit-completion.js
```

This will:
- Create a test user
- Create a test habit
- Test completion toggling
- Show you the results

---

**That's it!** This is how daily habit completion works in HabityFy. Each day is a fresh start, and you need to complete your habits again to maintain your streaks! 🎉
