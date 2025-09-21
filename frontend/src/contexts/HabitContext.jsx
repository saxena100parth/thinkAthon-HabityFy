import { createContext, useContext, useState, useEffect } from 'react';
import { habitsAPI } from '../utils/api';
import { useAuth } from './AuthContext';

const HabitContext = createContext();

export const useHabits = () => {
    const context = useContext(HabitContext);
    if (!context) {
        throw new Error('useHabits must be used within a HabitProvider');
    }
    return context;
};

export const HabitProvider = ({ children }) => {
    const [habits, setHabits] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    // Fetch habits
    const fetchHabits = async (params = {}) => {
        if (!user) return;

        setLoading(true);
        setError(null);
        try {
            const response = await habitsAPI.getHabits(params);
            setHabits(response.data.habits);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch habits');
        } finally {
            setLoading(false);
        }
    };

    // Fetch habit stats
    const fetchStats = async () => {
        if (!user) return;

        try {
            const response = await habitsAPI.getHabitStats();
            setStats(response.data.stats);
        } catch (err) {
            console.error('Failed to fetch stats:', err);
        }
    };

    // Create habit
    const createHabit = async (habitData) => {
        try {
            const response = await habitsAPI.createHabit(habitData);
            setHabits(prev => [response.data.habit, ...prev]);
            await fetchStats(); // Refresh stats
            return { success: true, data: response.data };
        } catch (err) {
            return {
                success: false,
                error: err.response?.data?.message || 'Failed to create habit'
            };
        }
    };

    // Update habit
    const updateHabit = async (id, habitData) => {
        try {
            const response = await habitsAPI.updateHabit(id, habitData);
            setHabits(prev =>
                prev.map(habit =>
                    habit._id === id ? response.data.habit : habit
                )
            );
            await fetchStats(); // Refresh stats
            return { success: true, data: response.data };
        } catch (err) {
            return {
                success: false,
                error: err.response?.data?.message || 'Failed to update habit'
            };
        }
    };

    // Delete habit
    const deleteHabit = async (id) => {
        try {
            await habitsAPI.deleteHabit(id);
            setHabits(prev => prev.filter(habit => habit._id !== id));
            await fetchStats(); // Refresh stats
            return { success: true };
        } catch (err) {
            return {
                success: false,
                error: err.response?.data?.message || 'Failed to delete habit'
            };
        }
    };

    // Toggle habit completion
    const toggleHabit = async (id, date = null) => {
        try {
            const response = await habitsAPI.toggleHabit(id, date);
            setHabits(prev =>
                prev.map(habit =>
                    habit._id === id ? { ...habit, ...response.data.habit } : habit
                )
            );
            await fetchStats(); // Refresh stats
            return { success: true, data: response.data };
        } catch (err) {
            return {
                success: false,
                error: err.response?.data?.message || 'Failed to toggle habit'
            };
        }
    };

    // Get habits for specific date
    const getHabitsForDate = async (date, params = {}) => {
        if (!user) return { success: false, error: 'User not authenticated' };

        try {
            const response = await habitsAPI.getHabitsForDate(date, params);
            return { success: true, habits: response.data.habits, targetDate: response.data.targetDate };
        } catch (err) {
            return {
                success: false,
                error: err.response?.data?.message || 'Failed to fetch habits for date'
            };
        }
    };

    // Get today's completion status for a habit
    const getTodayStatus = (habit) => {
        const today = new Date().toISOString().split('T')[0];
        const todayEntry = habit.history?.find(entry => entry.date === today);
        return todayEntry?.completed || false;
    };

    // Get habits completed today
    const getTodayCompletedHabits = () => {
        return habits.filter(habit => getTodayStatus(habit));
    };

    // Get active habits
    const getActiveHabits = () => {
        return habits.filter(habit => habit.isActive);
    };

    // Load data when user changes
    useEffect(() => {
        if (user) {
            fetchHabits();
            fetchStats();
        } else {
            setHabits([]);
            setStats(null);
        }
    }, [user]);

    const value = {
        habits,
        stats,
        loading,
        error,
        fetchHabits,
        fetchStats,
        createHabit,
        updateHabit,
        deleteHabit,
        toggleHabit,
        getHabitsForDate,
        getTodayStatus,
        getTodayCompletedHabits,
        getActiveHabits,
    };

    return (
        <HabitContext.Provider value={value}>
            {children}
        </HabitContext.Provider>
    );
};
