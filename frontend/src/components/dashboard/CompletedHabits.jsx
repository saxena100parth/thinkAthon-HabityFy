import { useState, useEffect } from 'react';
import { CheckCircle, Calendar, Clock, Filter, Search, ChevronDown, ChevronUp, Trophy, Flame, Star, Target } from 'lucide-react';
import { useHabits } from '../../contexts/HabitContext';
import { useSearch } from '../../contexts/SearchContext';

const CompletedHabits = () => {
    const { habits, loading } = useHabits();
    const { searchTerm, searchResults, getSearchStats } = useSearch();
    const [filterPeriod, setFilterPeriod] = useState('all'); // all, today, week, month, year
    const [sortBy, setSortBy] = useState('date'); // date, streak, title
    const [sortOrder, setSortOrder] = useState('desc'); // asc, desc
    const [expandedHabits, setExpandedHabits] = useState(new Set());

    // Debug logging
    console.log('CompletedHabits - habits:', habits);
    console.log('CompletedHabits - loading:', loading);

    // Add safety check for habits
    if (!habits) {
        console.log('CompletedHabits - habits is null/undefined');
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading habits...</p>
                </div>
            </div>
        );
    }

    // Get all completed habits with their history
    const getCompletedHabits = () => {
        const habitsToSearch = searchTerm ? searchResults : habits;
        return habitsToSearch.filter(habit => {
            const hasCompletions = habit.history && habit.history.some(entry => entry.completed);
            return hasCompletions;
        });
    };

    // Filter habits based on search and period
    const getFilteredHabits = () => {
        let filtered = getCompletedHabits();

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(habit =>
                habit.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                habit.description?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter by period
        const now = new Date();
        const today = now.toISOString().split('T')[0];
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

        filtered = filtered.filter(habit => {
            const completions = habit.history.filter(entry => entry.completed);

            switch (filterPeriod) {
                case 'today':
                    return completions.some(entry => entry.date === today);
                case 'week':
                    return completions.some(entry => entry.date >= weekAgo);
                case 'month':
                    return completions.some(entry => entry.date >= monthAgo);
                case 'year':
                    return completions.some(entry => entry.date >= yearAgo);
                default:
                    return true;
            }
        });

        // Sort habits
        filtered.sort((a, b) => {
            let aValue, bValue;

            switch (sortBy) {
                case 'streak':
                    aValue = a.currentStreak || 0;
                    bValue = b.currentStreak || 0;
                    break;
                case 'title':
                    aValue = a.title.toLowerCase();
                    bValue = b.title.toLowerCase();
                    break;
                case 'date':
                default:
                    const aLatest = a.history?.filter(h => h.completed).sort((x, y) => new Date(y.date) - new Date(x.date))[0];
                    const bLatest = b.history?.filter(h => h.completed).sort((x, y) => new Date(y.date) - new Date(x.date))[0];
                    aValue = aLatest ? new Date(aLatest.date) : new Date(0);
                    bValue = bLatest ? new Date(bLatest.date) : new Date(0);
                    break;
            }

            if (sortOrder === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });

        return filtered;
    };

    // Get completion statistics
    const getStats = () => {
        const completedHabits = getCompletedHabits();
        const today = new Date().toISOString().split('T')[0];
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

        const todayCompletions = completedHabits.filter(habit =>
            habit.history?.some(entry => entry.date === today && entry.completed)
        ).length;

        const weekCompletions = completedHabits.filter(habit =>
            habit.history?.some(entry => entry.date >= weekAgo && entry.completed)
        ).length;

        const monthCompletions = completedHabits.filter(habit =>
            habit.history?.some(entry => entry.date >= monthAgo && entry.completed)
        ).length;

        const totalCompletions = completedHabits.reduce((sum, habit) =>
            sum + (habit.history?.filter(entry => entry.completed).length || 0), 0
        );

        return {
            todayCompletions,
            weekCompletions,
            monthCompletions,
            totalCompletions,
            totalHabits: completedHabits.length
        };
    };

    // Toggle habit expansion
    const toggleExpansion = (habitId) => {
        const newExpanded = new Set(expandedHabits);
        if (newExpanded.has(habitId)) {
            newExpanded.delete(habitId);
        } else {
            newExpanded.add(habitId);
        }
        setExpandedHabits(newExpanded);
    };

    // Get streak icon and color
    const getStreakDisplay = (streak) => {
        if (streak >= 30) return { icon: Trophy, color: 'text-purple-600', text: 'Legendary' };
        if (streak >= 14) return { icon: Flame, color: 'text-orange-600', text: 'On Fire' };
        if (streak >= 7) return { icon: Star, color: 'text-blue-600', text: 'Streaking' };
        if (streak >= 3) return { icon: Target, color: 'text-green-600', text: 'Building' };
        return { icon: CheckCircle, color: 'text-gray-600', text: 'Starting' };
    };

    // Format date for display
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (dateString === today.toISOString().split('T')[0]) {
            return 'Today';
        } else if (dateString === yesterday.toISOString().split('T')[0]) {
            return 'Yesterday';
        } else {
            return date.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric'
            });
        }
    };

    // Add try-catch for error handling
    let filteredHabits, stats;
    try {
        filteredHabits = getFilteredHabits();
        stats = getStats();
    } catch (error) {
        console.error('Error in CompletedHabits:', error);
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="text-red-600 text-4xl mb-4">⚠️</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Data</h3>
                    <p className="text-gray-600">There was an error loading the completed habits data.</p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Completed Habits</h2>
                    <p className="text-gray-600">View your habit completion history and progress</p>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
                    <div className="flex items-center">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-600">Today</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.todayCompletions}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
                    <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Calendar className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-600">This Week</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.weekCompletions}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
                    <div className="flex items-center">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <Trophy className="w-6 h-6 text-purple-600" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-600">This Month</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.monthCompletions}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
                    <div className="flex items-center">
                        <div className="p-2 bg-red-100 rounded-lg">
                            <Flame className="w-6 h-6 text-red-600" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-600">Total</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.totalCompletions}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
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
                                Use the search bar above to find specific completed habits
                            </div>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <select
                            value={filterPeriod}
                            onChange={(e) => setFilterPeriod(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        >
                            <option value="all">All Time</option>
                            <option value="today">Today</option>
                            <option value="week">This Week</option>
                            <option value="month">This Month</option>
                            <option value="year">This Year</option>
                        </select>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        >
                            <option value="date">Sort by Date</option>
                            <option value="streak">Sort by Streak</option>
                            <option value="title">Sort by Title</option>
                        </select>
                        <button
                            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        >
                            {sortOrder === 'asc' ? '↑' : '↓'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Habits List */}
            {filteredHabits.length === 0 ? (
                <div className="text-center py-12">
                    <CheckCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No completed habits found</h3>
                    <p className="text-gray-600">
                        {searchTerm || filterPeriod !== 'all'
                            ? 'Try adjusting your search or filter criteria'
                            : 'Start completing some habits to see them here!'
                        }
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredHabits.map((habit) => {
                        const completions = habit.history?.filter(entry => entry.completed).sort((a, b) => new Date(b.date) - new Date(a.date)) || [];
                        const latestCompletion = completions[0];
                        const isExpanded = expandedHabits.has(habit._id);
                        const streakDisplay = getStreakDisplay(habit.currentStreak || 0);

                        return (
                            <div key={habit._id} className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
                                {/* Habit Header */}
                                <div className="p-4 border-b border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className="flex-shrink-0">
                                                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                                    <CheckCircle className="w-6 h-6 text-green-600" />
                                                </div>
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900">{habit.title}</h3>
                                                <p className="text-sm text-gray-600">{habit.description}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <div className="text-right">
                                                <div className="flex items-center space-x-2">
                                                    <streakDisplay.icon className={`w-5 h-5 ${streakDisplay.color}`} />
                                                    <span className={`text-sm font-medium ${streakDisplay.color}`}>
                                                        {habit.currentStreak || 0} {habit.frequency === 'weekly' ? 'weeks' : 'days'}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-500">{streakDisplay.text}</p>
                                            </div>
                                            <button
                                                onClick={() => toggleExpansion(habit._id)}
                                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                            >
                                                {isExpanded ? (
                                                    <ChevronUp className="w-5 h-5 text-gray-400" />
                                                ) : (
                                                    <ChevronDown className="w-5 h-5 text-gray-400" />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Latest Completion Info */}
                                {latestCompletion && (
                                    <div className="px-4 py-3 bg-gray-50">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                <Clock className="w-4 h-4 text-gray-500" />
                                                <span className="text-sm text-gray-600">
                                                    Last completed: {formatDate(latestCompletion.date)}
                                                </span>
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {completions.length} total completion{completions.length !== 1 ? 's' : ''}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Expanded History */}
                                {isExpanded && (
                                    <div className="p-4 bg-gray-50">
                                        <h4 className="text-sm font-medium text-gray-900 mb-3">Completion History</h4>
                                        <div className="space-y-2 max-h-64 overflow-y-auto">
                                            {completions.map((completion, index) => (
                                                <div key={index} className="flex items-center justify-between py-2 px-3 bg-white rounded-lg border border-gray-200">
                                                    <div className="flex items-center space-x-3">
                                                        <CheckCircle className="w-4 h-4 text-green-600" />
                                                        <span className="text-sm font-medium text-gray-900">
                                                            {formatDate(completion.date)}
                                                        </span>
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {completion.completedAt ?
                                                            new Date(completion.completedAt).toLocaleTimeString('en-US', {
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            }) :
                                                            'Time not recorded'
                                                        }
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default CompletedHabits;
