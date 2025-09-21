import { useState, useEffect } from 'react';
import { Plus, Filter, Search, MoreVertical, Edit, Trash2, CheckCircle, Clock, Calendar } from 'lucide-react';
import { useHabits } from '../../contexts/HabitContext';
import { useMasterHabits } from '../../contexts/MasterHabitContext';
import { useSearch } from '../../contexts/SearchContext';
import HabitCard from '../ui/HabitCard';
import MasterHabitSelector from '../ui/MasterHabitSelector';
import DatePicker from '../ui/DatePicker';

const HabitsSection = ({ habits }) => {
    const { createHabit, updateHabit, deleteHabit, toggleHabit, getHabitsForDate } = useHabits();
    const { searchTerm, searchResults, getSearchStats } = useSearch();
    const [showMasterHabitSelector, setShowMasterHabitSelector] = useState(false);
    const [filter, setFilter] = useState('all');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [dateFilteredHabits, setDateFilteredHabits] = useState(habits);
    const [isLoadingDate, setIsLoadingDate] = useState(false);

    // Load habits for selected date
    useEffect(() => {
        const loadHabitsForDate = async () => {
            if (!selectedDate) return;

            setIsLoadingDate(true);
            try {
                const result = await getHabitsForDate(selectedDate);
                if (result.success) {
                    setDateFilteredHabits(result.habits);
                }
            } catch (error) {
                console.error('Error loading habits for date:', error);
                setDateFilteredHabits(habits);
            } finally {
                setIsLoadingDate(false);
            }
        };

        loadHabitsForDate();
    }, [selectedDate, getHabitsForDate]);

    // Update dateFilteredHabits when habits prop changes
    useEffect(() => {
        setDateFilteredHabits(habits);
    }, [habits]);

    // Use search results if there's a search term, otherwise use dateFilteredHabits
    const habitsToFilter = searchTerm ? searchResults : dateFilteredHabits;

    const filteredHabits = habitsToFilter.filter(habit => {
        switch (filter) {
            case 'completed':
                return habit.completedForDate || habit.history?.find(h =>
                    h.date === selectedDate
                )?.completed;
            case 'pending':
                return !(habit.completedForDate || habit.history?.find(h =>
                    h.date === selectedDate
                )?.completed);
            case 'active':
                return habit.isActive;
            case 'inactive':
                return !habit.isActive;
            default:
                return true;
        }
    });

    const handleSelectMasterHabit = async (habitData) => {
        const result = await createHabit(habitData);
        if (result.success) {
            setShowMasterHabitSelector(false);
        }
        return result;
    };

    const handleToggleHabit = async (habitId) => {
        await toggleHabit(habitId, selectedDate);
    };

    const handleUpdateHabit = async (habitId, habitData) => {
        return await updateHabit(habitId, habitData);
    };

    const handleDeleteHabit = async (habitId) => {
        if (window.confirm('Are you sure you want to delete this habit?')) {
            await deleteHabit(habitId);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">My Habits</h2>
                    <p className="text-gray-600">Track and manage your daily habits</p>
                </div>
                <button
                    onClick={() => setShowMasterHabitSelector(true)}
                    className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Add Habit
                </button>
            </div>

            {/* Date Picker */}
            <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-red-600" />
                        <span className="text-sm font-medium text-gray-700">View habits for:</span>
                    </div>
                    <div className="flex-1 max-w-xs">
                        <DatePicker
                            selectedDate={selectedDate}
                            onDateChange={setSelectedDate}
                            className="w-full"
                        />
                    </div>
                    {isLoadingDate && (
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                            Loading...
                        </div>
                    )}
                </div>
            </div>

            {/* Filters and Search Status */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                    {searchTerm ? (
                        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <Search className="h-5 w-5 text-red-600" />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-red-900">
                                    Searching for "{searchTerm}"
                                </p>
                                <p className="text-xs text-red-600">
                                    {getSearchStats().found} of {getSearchStats().total} habits found
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="text-sm text-gray-500 p-3">
                            Use the search bar above to find specific habits
                        </div>
                    )}
                </div>
                <div className="flex gap-2">
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    >
                        <option value="all">All Habits</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="completed">Completed</option>
                        <option value="pending">Pending</option>
                    </select>
                </div>
            </div>

            {/* Master Habit Selector */}
            {showMasterHabitSelector && (
                <MasterHabitSelector
                    onSelectHabit={handleSelectMasterHabit}
                    onClose={() => setShowMasterHabitSelector(false)}
                    selectedHabits={habits}
                />
            )}

            {/* Habits Grid */}
            {filteredHabits.length === 0 ? (
                <div className="text-center py-12">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Clock className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {searchTerm ? 'No habits found' : 'No habits yet'}
                    </h3>
                    <p className="text-gray-600 mb-6">
                        {searchTerm
                            ? 'Try adjusting your search terms'
                            : 'Start building better habits by creating your first one'
                        }
                    </p>
                    {!searchTerm && (
                        <button
                            onClick={() => setShowMasterHabitSelector(true)}
                            className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            Choose Your First Habit
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredHabits.map((habit) => (
                        <HabitCard
                            key={habit._id}
                            habit={habit}
                            selectedDate={selectedDate}
                            onToggle={() => handleToggleHabit(habit._id)}
                            onUpdate={(data) => handleUpdateHabit(habit._id, data)}
                            onDelete={() => handleDeleteHabit(habit._id)}
                        />
                    ))}
                </div>
            )}

            {/* Stats Summary */}
            {habits.length > 0 && (
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-gray-900">{habits.length}</div>
                            <div className="text-sm text-gray-600">Total Habits</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">
                                {habits.filter(h => h.isActive).length}
                            </div>
                            <div className="text-sm text-gray-600">Active</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-red-600">
                                {habits.filter(h => !h.isActive).length}
                            </div>
                            <div className="text-sm text-gray-600">Inactive</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">
                                {habits.reduce((sum, h) => sum + h.currentStreak, 0)}
                            </div>
                            <div className="text-sm text-gray-600">Total Streak</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HabitsSection;
