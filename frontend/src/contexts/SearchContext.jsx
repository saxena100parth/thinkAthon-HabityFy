import { createContext, useContext, useState, useEffect } from 'react';
import { useHabits } from './HabitContext';

const SearchContext = createContext();

export const useSearch = () => {
    const context = useContext(SearchContext);
    if (!context) {
        throw new Error('useSearch must be used within a SearchProvider');
    }
    return context;
};

export const SearchProvider = ({ children }) => {
    const { habits, loading } = useHabits();
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    // Search function
    const searchHabits = (query) => {
        if (!query || !habits) return [];

        const searchQuery = query.toLowerCase().trim();

        return habits.filter(habit => {
            // Search in title
            const titleMatch = habit.title.toLowerCase().includes(searchQuery);

            // Search in description
            const descriptionMatch = habit.description?.toLowerCase().includes(searchQuery);

            // Search in tags
            const tagsMatch = habit.tags?.some(tag =>
                tag.toLowerCase().includes(searchQuery)
            );

            // Search in frequency
            const frequencyMatch = habit.frequency?.toLowerCase().includes(searchQuery);

            // Search in time of day
            const timeMatch = Array.isArray(habit.timeOfDay)
                ? habit.timeOfDay.some(time => time.toLowerCase().includes(searchQuery))
                : habit.timeOfDay?.toLowerCase().includes(searchQuery);

            return titleMatch || descriptionMatch || tagsMatch || frequencyMatch || timeMatch;
        });
    };

    // Update search results when search term changes
    useEffect(() => {
        if (searchTerm.trim()) {
            setIsSearching(true);
            const results = searchHabits(searchTerm);
            setSearchResults(results);
            setIsSearching(false);
        } else {
            setSearchResults([]);
            setIsSearching(false);
        }
    }, [searchTerm, habits]);

    // Clear search
    const clearSearch = () => {
        setSearchTerm('');
        setSearchResults([]);
        setIsSearching(false);
    };

    // Get search statistics
    const getSearchStats = () => {
        if (!searchTerm.trim()) {
            return { total: 0, found: 0, percentage: 0 };
        }

        const total = habits?.length || 0;
        const found = searchResults.length;
        const percentage = total > 0 ? Math.round((found / total) * 100) : 0;

        return { total, found, percentage };
    };

    const value = {
        searchTerm,
        setSearchTerm,
        searchResults,
        isSearching,
        clearSearch,
        searchHabits,
        getSearchStats
    };

    return (
        <SearchContext.Provider value={value}>
            {children}
        </SearchContext.Provider>
    );
};
