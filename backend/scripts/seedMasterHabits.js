const mongoose = require('mongoose');
const dotenv = require('dotenv');
const MasterHabit = require('../models/MasterHabit');

// Load environment variables
dotenv.config();

// Master habits data
const masterHabitsData = [
    // Health & Fitness
    {
        title: "Drink 8 glasses of water",
        description: "Stay hydrated by drinking 8 glasses of water throughout the day",
        category: "health_fitness",
        icon: "💧",
        emoji: "💧",
        suggestedFrequency: "daily",
        suggestedTimeOfDay: "09:00",
        suggestedDuration: "Throughout day",
        difficulty: "easy",
        tags: ["hydration", "health", "wellness"],
        sortOrder: 1
    },
    {
        title: "Exercise / workout",
        description: "Get your body moving with 20-30 minutes of physical activity",
        category: "health_fitness",
        icon: "💪",
        emoji: "💪",
        suggestedFrequency: "daily",
        suggestedTimeOfDay: "07:00",
        suggestedDuration: "20-30 min",
        difficulty: "medium",
        tags: ["exercise", "fitness", "cardio", "strength"],
        sortOrder: 2
    },
    {
        title: "Walk 10,000 steps",
        description: "Aim for 10,000 steps daily to maintain an active lifestyle",
        category: "health_fitness",
        icon: "🚶",
        emoji: "🚶",
        suggestedFrequency: "daily",
        suggestedTimeOfDay: "18:00",
        suggestedDuration: "Throughout day",
        difficulty: "medium",
        tags: ["walking", "steps", "cardio", "outdoor"],
        sortOrder: 3
    },
    {
        title: "Sleep 7-8 hours",
        description: "Get adequate sleep for optimal health and recovery",
        category: "health_fitness",
        icon: "😴",
        emoji: "😴",
        suggestedFrequency: "daily",
        suggestedTimeOfDay: "22:00",
        suggestedDuration: "7-8 hours",
        difficulty: "easy",
        tags: ["sleep", "rest", "recovery", "health"],
        sortOrder: 4
    },
    {
        title: "Stretch / yoga",
        description: "Take 10 minutes to stretch or practice yoga for flexibility",
        category: "health_fitness",
        icon: "🧘",
        emoji: "🧘",
        suggestedFrequency: "daily",
        suggestedTimeOfDay: "19:00",
        suggestedDuration: "10 min",
        difficulty: "easy",
        tags: ["yoga", "stretching", "flexibility", "mindfulness"],
        sortOrder: 5
    },

    // Mental Well-being
    {
        title: "Meditation / deep breathing",
        description: "Practice mindfulness through meditation or deep breathing exercises",
        category: "mental_wellbeing",
        icon: "🧘‍♀️",
        emoji: "🧘‍♀️",
        suggestedFrequency: "daily",
        suggestedTimeOfDay: "08:00",
        suggestedDuration: "5-10 min",
        difficulty: "easy",
        tags: ["meditation", "mindfulness", "breathing", "calm"],
        sortOrder: 1
    },
    {
        title: "Journaling / gratitude writing",
        description: "Write down your thoughts, feelings, or things you're grateful for",
        category: "mental_wellbeing",
        icon: "📝",
        emoji: "📝",
        suggestedFrequency: "daily",
        suggestedTimeOfDay: "20:00",
        suggestedDuration: "10-15 min",
        difficulty: "easy",
        tags: ["journaling", "gratitude", "reflection", "writing"],
        sortOrder: 2
    },
    {
        title: "No phone for first 30 min after waking",
        description: "Start your day mindfully without immediately checking your phone",
        category: "mental_wellbeing",
        icon: "📱",
        emoji: "📱",
        suggestedFrequency: "daily",
        suggestedTimeOfDay: "06:00",
        suggestedDuration: "30 min",
        difficulty: "hard",
        tags: ["digital detox", "mindfulness", "morning routine", "focus"],
        sortOrder: 3
    },
    {
        title: "Screen-free bedtime routine",
        description: "Create a calming bedtime routine without screens 1 hour before sleep",
        category: "mental_wellbeing",
        icon: "🌙",
        emoji: "🌙",
        suggestedFrequency: "daily",
        suggestedTimeOfDay: "21:00",
        suggestedDuration: "1 hour",
        difficulty: "medium",
        tags: ["sleep", "digital detox", "bedtime", "routine"],
        sortOrder: 4
    },
    {
        title: "Daily affirmation / positive self-talk",
        description: "Practice positive self-talk and affirmations to boost confidence",
        category: "mental_wellbeing",
        icon: "✨",
        emoji: "✨",
        suggestedFrequency: "daily",
        suggestedTimeOfDay: "07:30",
        suggestedDuration: "5 min",
        difficulty: "easy",
        tags: ["affirmations", "positive thinking", "confidence", "self-care"],
        sortOrder: 5
    },

    // Learning & Growth
    {
        title: "Read 10-20 pages daily",
        description: "Dedicate time to reading books for personal and professional growth",
        category: "learning_growth",
        icon: "📚",
        emoji: "📚",
        suggestedFrequency: "daily",
        suggestedTimeOfDay: "20:00",
        suggestedDuration: "15-30 min",
        difficulty: "easy",
        tags: ["reading", "learning", "books", "knowledge"],
        sortOrder: 1
    },
    {
        title: "Learn a new skill",
        description: "Spend time learning coding, a new language, or any skill you're interested in",
        category: "learning_growth",
        icon: "🎓",
        emoji: "🎓",
        suggestedFrequency: "daily",
        suggestedTimeOfDay: "19:00",
        suggestedDuration: "30-60 min",
        difficulty: "medium",
        tags: ["learning", "skills", "coding", "language", "development"],
        sortOrder: 2
    },
    {
        title: "Listen to a podcast / audiobook",
        description: "Expand your knowledge through educational podcasts or audiobooks",
        category: "learning_growth",
        icon: "🎧",
        emoji: "🎧",
        suggestedFrequency: "daily",
        suggestedTimeOfDay: "08:30",
        suggestedDuration: "20-30 min",
        difficulty: "easy",
        tags: ["podcasts", "audiobooks", "learning", "multitasking"],
        sortOrder: 3
    },
    {
        title: "Practice a hobby",
        description: "Dedicate time to music, art, writing, or any creative hobby",
        category: "learning_growth",
        icon: "🎨",
        emoji: "🎨",
        suggestedFrequency: "daily",
        suggestedTimeOfDay: "18:00",
        suggestedDuration: "30-45 min",
        difficulty: "medium",
        tags: ["hobby", "creativity", "art", "music", "writing"],
        sortOrder: 4
    },
    {
        title: "Reflect & review goals",
        description: "Take time to reflect on your day and review your long-term goals",
        category: "learning_growth",
        icon: "🎯",
        emoji: "🎯",
        suggestedFrequency: "daily",
        suggestedTimeOfDay: "21:30",
        suggestedDuration: "10-15 min",
        difficulty: "easy",
        tags: ["reflection", "goals", "planning", "review"],
        sortOrder: 5
    },

    // Productivity & Career
    {
        title: "Plan the day (top 3 tasks)",
        description: "Start each day by identifying and planning your top 3 most important tasks",
        category: "productivity_career",
        icon: "📋",
        emoji: "📋",
        suggestedFrequency: "daily",
        suggestedTimeOfDay: "08:00",
        suggestedDuration: "10 min",
        difficulty: "easy",
        tags: ["planning", "productivity", "tasks", "organization"],
        sortOrder: 1
    },
    {
        title: "No procrastination (Pomodoro sprints)",
        description: "Use Pomodoro technique to work in focused 25-minute sprints",
        category: "productivity_career",
        icon: "⏰",
        emoji: "⏰",
        suggestedFrequency: "daily",
        suggestedTimeOfDay: "09:00",
        suggestedDuration: "25 min sprints",
        difficulty: "medium",
        tags: ["pomodoro", "focus", "productivity", "time management"],
        sortOrder: 2
    },
    {
        title: "Inbox zero / clear emails",
        description: "Keep your email inbox organized and clear of unnecessary messages",
        category: "productivity_career",
        icon: "📧",
        emoji: "📧",
        suggestedFrequency: "daily",
        suggestedTimeOfDay: "17:00",
        suggestedDuration: "15-20 min",
        difficulty: "easy",
        tags: ["email", "organization", "productivity", "communication"],
        sortOrder: 3
    },
    {
        title: "Networking / professional learning",
        description: "Invest time in professional development and networking",
        category: "productivity_career",
        icon: "🤝",
        emoji: "🤝",
        suggestedFrequency: "daily",
        suggestedTimeOfDay: "12:00",
        suggestedDuration: "20-30 min",
        difficulty: "medium",
        tags: ["networking", "professional", "learning", "career"],
        sortOrder: 4
    },
    {
        title: "Track expenses & budget",
        description: "Monitor your daily expenses and maintain your budget",
        category: "productivity_career",
        icon: "💰",
        emoji: "💰",
        suggestedFrequency: "daily",
        suggestedTimeOfDay: "21:00",
        suggestedDuration: "10 min",
        difficulty: "easy",
        tags: ["finance", "budgeting", "expenses", "money management"],
        sortOrder: 5
    },

    // Lifestyle & Relationships
    {
        title: "Healthy meal / avoid junk food",
        description: "Make conscious food choices and avoid processed or junk food",
        category: "lifestyle_relationships",
        icon: "🥗",
        emoji: "🥗",
        suggestedFrequency: "daily",
        suggestedTimeOfDay: "12:30",
        suggestedDuration: "30 min",
        difficulty: "medium",
        tags: ["nutrition", "healthy eating", "food", "wellness"],
        sortOrder: 1
    },
    {
        title: "Call or message family/friend",
        description: "Stay connected with loved ones through regular communication",
        category: "lifestyle_relationships",
        icon: "👨‍👩‍👧‍👦",
        emoji: "👨‍👩‍👧‍👦",
        suggestedFrequency: "daily",
        suggestedTimeOfDay: "19:30",
        suggestedDuration: "15-30 min",
        difficulty: "easy",
        tags: ["family", "friends", "relationships", "communication"],
        sortOrder: 2
    },
    {
        title: "Declutter / clean for 10 minutes",
        description: "Spend 10 minutes daily tidying up and decluttering your space",
        category: "lifestyle_relationships",
        icon: "🧹",
        emoji: "🧹",
        suggestedFrequency: "daily",
        suggestedTimeOfDay: "18:30",
        suggestedDuration: "10 min",
        difficulty: "easy",
        tags: ["cleaning", "decluttering", "organization", "home"],
        sortOrder: 3
    },
    {
        title: "Practice kindness (help someone)",
        description: "Do something kind for someone else, no matter how small",
        category: "lifestyle_relationships",
        icon: "❤️",
        emoji: "❤️",
        suggestedFrequency: "daily",
        suggestedTimeOfDay: "16:00",
        suggestedDuration: "5-15 min",
        difficulty: "easy",
        tags: ["kindness", "helping", "community", "service"],
        sortOrder: 4
    },
    {
        title: "Quality offline time with loved ones",
        description: "Spend meaningful time with family or friends without digital distractions",
        category: "lifestyle_relationships",
        icon: "👨‍👩‍👧‍👦",
        emoji: "👨‍👩‍👧‍👦",
        suggestedFrequency: "daily",
        suggestedTimeOfDay: "20:00",
        suggestedDuration: "30-60 min",
        difficulty: "medium",
        tags: ["family time", "offline", "relationships", "quality time"],
        sortOrder: 5
    }
];

async function seedMasterHabits() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ Connected to MongoDB');

        // Clear existing master habits
        await MasterHabit.deleteMany({});
        console.log('🗑️  Cleared existing master habits');

        // Create master habits
        const masterHabits = await MasterHabit.insertMany(masterHabitsData);
        console.log(`🎯 Created ${masterHabits.length} master habits`);

        // Display categories
        const categories = await MasterHabit.distinct('category');
        console.log('\n📂 Categories created:');
        categories.forEach(category => {
            const count = masterHabits.filter(h => h.category === category).length;
            console.log(`  - ${category}: ${count} habits`);
        });

        console.log('\n🎉 Master habits seeded successfully!');

    } catch (error) {
        console.error('❌ Error seeding master habits:', error);
    } finally {
        await mongoose.connection.close();
        console.log('📦 Database connection closed');
        process.exit(0);
    }
}

// Run seed function
seedMasterHabits();
