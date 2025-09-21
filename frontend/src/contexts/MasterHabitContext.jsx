import { createContext, useContext, useState, useEffect } from 'react';
import { masterHabitsAPI } from '../utils/api';

const MasterHabitContext = createContext();

export const useMasterHabits = () => {
    const context = useContext(MasterHabitContext);
    if (!context) {
        throw new Error('useMasterHabits must be used within a MasterHabitProvider');
    }
    return context;
};

export const MasterHabitProvider = ({ children }) => {
    const [masterHabits, setMasterHabits] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch master habits
    const fetchMasterHabits = async (params = {}) => {
        setLoading(true);
        setError(null);
        try {
            const response = await masterHabitsAPI.getMasterHabits(params);
            setMasterHabits(response.data.habits);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch master habits');
        } finally {
            setLoading(false);
        }
    };

    // Fetch categories
    const fetchCategories = async () => {
        try {
            const response = await masterHabitsAPI.getCategories();
            setCategories(response.data.categories);
        } catch (err) {
            console.error('Failed to fetch categories:', err);
        }
    };

    // Get habits by category
    const getHabitsByCategory = (category) => {
        return masterHabits.filter(habit => habit.category === category);
    };

    // Search habits
    const searchHabits = (query) => {
        if (!query) return masterHabits;

        return masterHabits.filter(habit =>
            habit.title.toLowerCase().includes(query.toLowerCase()) ||
            habit.description.toLowerCase().includes(query.toLowerCase()) ||
            habit.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
        );
    };

    // Get habit by ID
    const getHabitById = (id) => {
        return masterHabits.find(habit => habit._id === id);
    };

    // Load data on mount
    useEffect(() => {
        fetchMasterHabits();
        fetchCategories();
    }, []);

    const value = {
        masterHabits,
        categories,
        loading,
        error,
        fetchMasterHabits,
        fetchCategories,
        getHabitsByCategory,
        searchHabits,
        getHabitById,
    };

    return (
        <MasterHabitContext.Provider value={value}>
            {children}
        </MasterHabitContext.Provider>
    );
};
