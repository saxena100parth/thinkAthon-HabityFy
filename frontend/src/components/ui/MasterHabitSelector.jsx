import { useState, useEffect } from 'react';
import { useMasterHabits } from '../../contexts/MasterHabitContext';
import { Search, Filter, Plus, Clock, Target } from 'lucide-react';
import HabitCreationForm from './HabitCreationForm';

const MasterHabitSelector = ({ onSelectHabit, onClose, selectedHabits = [] }) => {
    const { masterHabits, categories, loading, searchHabits } = useMasterHabits();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [filteredHabits, setFilteredHabits] = useState([]);
    const [selectedMasterHabit, setSelectedMasterHabit] = useState(null);
    const [showCreationForm, setShowCreationForm] = useState(false);

    useEffect(() => {
        let habits = searchTerm ? searchHabits(searchTerm) : masterHabits;

        if (selectedCategory !== 'all') {
            habits = habits.filter(habit => habit.category === selectedCategory);
        }

        // Filter out already selected habits
        const selectedIds = selectedHabits.map(h => h.masterHabitId);
        habits = habits.filter(habit => !selectedIds.includes(habit._id));

        setFilteredHabits(habits);
    }, [masterHabits, searchTerm, selectedCategory, selectedHabits, searchHabits]);

    const handleSelectHabit = (habit) => {
        setSelectedMasterHabit(habit);
        setShowCreationForm(true);
    };

    const handleCreateHabit = async (habitData) => {
        const result = await onSelectHabit(habitData);
        if (result?.success) {
            setShowCreationForm(false);
            setSelectedMasterHabit(null);
        }
        return result;
    };

    const handleCloseCreationForm = () => {
        setShowCreationForm(false);
        setSelectedMasterHabit(null);
    };

    const getCategoryColor = (category) => {
        const colors = {
            'health_fitness': 'bg-green-100 text-green-800',
            'mental_wellbeing': 'bg-blue-100 text-blue-800',
            'learning_growth': 'bg-purple-100 text-purple-800',
            'productivity_career': 'bg-orange-100 text-orange-800',
            'lifestyle_relationships': 'bg-pink-100 text-pink-800'
        };
        return colors[category] || 'bg-gray-100 text-gray-800';
    };

    const getDifficultyColor = (difficulty) => {
        const colors = {
            'easy': 'text-green-600',
            'medium': 'text-yellow-600',
            'hard': 'text-red-600'
        };
        return colors[difficulty] || 'text-gray-600';
    };

    if (showCreationForm && selectedMasterHabit) {
        return (
            <HabitCreationForm
                masterHabit={selectedMasterHabit}
                onSubmit={handleCreateHabit}
                onCancel={handleCloseCreationForm}
            />
        );
    }

    if (loading) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading habits...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-gray-900">Choose Your Habits</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 text-2xl"
                        >
                            ×
                        </button>
                    </div>

                    {/* Search and Filter */}
                    <div className="mt-4 flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search habits..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                            />
                        </div>
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        >
                            <option value="all">All Categories</option>
                            {categories.map(category => (
                                <option key={category.key} value={category.key}>
                                    {category.emoji} {category.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 max-h-[60vh] overflow-y-auto">
                    {filteredHabits.length === 0 ? (
                        <div className="text-center py-12">
                            <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                {searchTerm ? 'No habits found' : 'All habits selected'}
                            </h3>
                            <p className="text-gray-600">
                                {searchTerm
                                    ? 'Try adjusting your search terms'
                                    : 'You have already selected all available habits'
                                }
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {filteredHabits.map((habit) => (
                                <div
                                    key={habit._id}
                                    className="border border-gray-200 rounded-lg p-4 hover:border-red-300 hover:shadow-md transition-all duration-200 cursor-pointer"
                                    onClick={() => handleSelectHabit(habit)}
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center">
                                            <span className="text-2xl mr-3">{habit.emoji}</span>
                                            <div>
                                                <h3 className="font-semibold text-gray-900">{habit.title}</h3>
                                                <p className="text-sm text-gray-600">{habit.description}</p>
                                            </div>
                                        </div>
                                        <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                            <Plus className="w-5 h-5" />
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center space-x-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(habit.category)}`}>
                                                {habit.category.split('_').map(word =>
                                                    word.charAt(0).toUpperCase() + word.slice(1)
                                                ).join(' & ')}
                                            </span>
                                            <span className={`font-medium ${getDifficultyColor(habit.difficulty)}`}>
                                                {habit.difficulty}
                                            </span>
                                        </div>
                                        <div className="flex items-center text-gray-500">
                                            <Clock className="w-4 h-4 mr-1" />
                                            <span>{habit.suggestedDuration}</span>
                                        </div>
                                    </div>

                                    {habit.tags && habit.tags.length > 0 && (
                                        <div className="mt-3 flex flex-wrap gap-1">
                                            {habit.tags.slice(0, 3).map((tag, index) => (
                                                <span
                                                    key={index}
                                                    className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                                                >
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-200 bg-gray-50">
                    <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-600">
                            {filteredHabits.length} habits available
                        </p>
                        <button
                            onClick={onClose}
                            className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                        >
                            Done
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MasterHabitSelector;
