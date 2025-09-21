import { useState } from 'react';
import {
    CheckCircle,
    Clock,
    Edit,
    Trash2,
    MoreVertical,
    Bell,
    BellOff,
    Target,
    Calendar
} from 'lucide-react';
import { useHabits } from '../../contexts/HabitContext';

const HabitCard = ({ habit, onToggle, onUpdate, onDelete, selectedDate = null }) => {
    const { getTodayStatus } = useHabits();
    const [showMenu, setShowMenu] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
        title: habit.title,
        description: habit.description || '',
        timeOfDay: habit.timeOfDay,
        duration: habit.duration || '',
        targetValue: habit.targetValue || '',
        unit: habit.unit || '',
        reminderEnabled: habit.reminderEnabled
    });

    // Get completion status for selected date or today
    const getCompletionStatus = () => {
        if (selectedDate) {
            // Use date-specific completion status if available
            if (habit.completedForDate !== undefined) {
                return habit.completedForDate;
            }
            // Fallback to history lookup
            const dateEntry = habit.history?.find(entry => entry.date === selectedDate);
            return dateEntry?.completed || false;
        }
        return getTodayStatus(habit);
    };

    const isCompleted = getCompletionStatus();
    const isActive = habit.isActive;
    const isWeekly = habit.frequency === 'weekly';

    const handleToggle = () => {
        onToggle();
    };

    const handleSaveEdit = () => {
        onUpdate(editData);
        setIsEditing(false);
    };

    const handleCancelEdit = () => {
        setEditData({
            title: habit.title,
            description: habit.description || '',
            timeOfDay: habit.timeOfDay,
            duration: habit.duration || '',
            targetValue: habit.targetValue || '',
            unit: habit.unit || '',
            reminderEnabled: habit.reminderEnabled
        });
        setIsEditing(false);
    };

    const handleDelete = () => {
        onDelete();
    };

    const getStreakColor = (streak) => {
        if (streak >= 30) return 'text-purple-600';
        if (streak >= 14) return 'text-blue-600';
        if (streak >= 7) return 'text-green-600';
        if (streak >= 3) return 'text-yellow-600';
        return 'text-gray-600';
    };

    const getStreakIcon = (streak) => {
        if (streak >= 30) return '🏆';
        if (streak >= 14) return '🔥';
        if (streak >= 7) return '⭐';
        if (streak >= 3) return '💪';
        return '📈';
    };

    return (
        <div className={`bg-white rounded-lg shadow-lg p-6 transition-all duration-200 hover:shadow-xl ${!isActive ? 'opacity-60' : ''
            }`}>
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    {isEditing ? (
                        <input
                            type="text"
                            value={editData.title}
                            onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
                            className="w-full text-lg font-semibold text-gray-900 border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                            autoFocus
                        />
                    ) : (
                        <div className="flex items-center gap-2">
                            <h3 className="text-lg font-semibold text-gray-900">{habit.title}</h3>
                            {isWeekly && (
                                <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                    Weekly
                                </span>
                            )}
                        </div>
                    )}
                    {isEditing ? (
                        <textarea
                            value={editData.description}
                            onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Add a description..."
                            className="w-full mt-2 text-sm text-gray-600 border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                            rows="2"
                        />
                    ) : (
                        habit.description && (
                            <p className="text-sm text-gray-600 mt-1">{habit.description}</p>
                        )
                    )}
                </div>

                <div className="relative">
                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        className="p-1 text-gray-400 hover:text-gray-600 rounded"
                    >
                        <MoreVertical className="w-5 h-5" />
                    </button>

                    {showMenu && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-10">
                            <button
                                onClick={() => {
                                    setIsEditing(true);
                                    setShowMenu(false);
                                }}
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                                <Edit className="w-4 h-4 mr-3" />
                                Edit Habit
                            </button>
                            <button
                                onClick={() => {
                                    onUpdate({ isActive: !isActive });
                                    setShowMenu(false);
                                }}
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                                {isActive ? (
                                    <>
                                        <Clock className="w-4 h-4 mr-3" />
                                        Pause Habit
                                    </>
                                ) : (
                                    <>
                                        <Target className="w-4 h-4 mr-3" />
                                        Activate Habit
                                    </>
                                )}
                            </button>
                            <button
                                onClick={() => {
                                    handleDelete();
                                    setShowMenu(false);
                                }}
                                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                            >
                                <Trash2 className="w-4 h-4 mr-3" />
                                Delete Habit
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                    <div className={`text-2xl font-bold ${getStreakColor(habit.currentStreak)}`}>
                        {habit.currentStreak}
                    </div>
                    <div className="text-xs text-gray-600">
                        Current {isWeekly ? 'Week' : 'Streak'}
                    </div>
                </div>
                <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{habit.maxStreak}</div>
                    <div className="text-xs text-gray-600">
                        Best {isWeekly ? 'Week' : 'Streak'}
                    </div>
                </div>
            </div>

            {/* Time and Reminder */}
            <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
                <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {isEditing ? (
                        <input
                            type="time"
                            value={editData.timeOfDay}
                            onChange={(e) => setEditData(prev => ({ ...prev, timeOfDay: e.target.value }))}
                            className="border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        />
                    ) : (
                        <span>{Array.isArray(habit.timeOfDay) ? habit.timeOfDay.join(', ') : habit.timeOfDay}</span>
                    )}
                </div>
                <div className="flex items-center">
                    {isEditing ? (
                        <button
                            onClick={() => setEditData(prev => ({ ...prev, reminderEnabled: !prev.reminderEnabled }))}
                            className={`flex items-center ${editData.reminderEnabled ? 'text-red-600' : 'text-gray-400'}`}
                        >
                            {editData.reminderEnabled ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
                        </button>
                    ) : (
                        <div className={`flex items-center ${habit.reminderEnabled ? 'text-red-600' : 'text-gray-400'}`}>
                            {habit.reminderEnabled ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
                        </div>
                    )}
                </div>
            </div>

            {/* Duration and Target */}
            {(habit.duration || habit.targetValue) && (
                <div className="mb-4 space-y-2">
                    {habit.duration && (
                        <div className="flex items-center text-sm text-gray-600">
                            <Target className="w-4 h-4 mr-2" />
                            <span>Duration: {habit.duration}</span>
                        </div>
                    )}
                    {habit.targetValue && habit.unit && (
                        <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="w-4 h-4 mr-2" />
                            <span>Target: {habit.targetValue} {habit.unit}</span>
                        </div>
                    )}
                </div>
            )}

            {/* Tags */}
            {habit.tags && habit.tags.length > 0 && (
                <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                        {habit.tags.map((tag, index) => (
                            <span
                                key={index}
                                className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Streak Indicator */}
            {habit.currentStreak > 0 && (
                <div className="flex items-center justify-center mb-4 p-2 bg-gray-50 rounded-lg">
                    <span className="text-2xl mr-2">{getStreakIcon(habit.currentStreak)}</span>
                    <span className="text-sm font-medium text-gray-700">
                        {habit.currentStreak} day{habit.currentStreak !== 1 ? 's' : ''} streak!
                    </span>
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2">
                {isEditing ? (
                    <>
                        <button
                            onClick={handleSaveEdit}
                            className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                        >
                            Save
                        </button>
                        <button
                            onClick={handleCancelEdit}
                            className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors text-sm font-medium"
                        >
                            Cancel
                        </button>
                    </>
                ) : (
                    <button
                        onClick={handleToggle}
                        disabled={!isActive}
                        className={`flex-1 flex items-center justify-center py-3 px-4 rounded-lg font-medium transition-colors ${isCompleted
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : isActive
                                ? 'bg-red-600 text-white hover:bg-red-700'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                    >
                        <CheckCircle className="w-5 h-5 mr-2" />
                        {isCompleted
                            ? (isWeekly
                                ? (selectedDate ? 'Completed This Week' : 'Completed This Week')
                                : (selectedDate ? 'Completed' : 'Completed Today')
                            )
                            : (isWeekly ? 'Mark Complete for Week' : 'Mark Complete')
                        }
                    </button>
                )}
            </div>

            {/* Status Badge */}
            <div className="mt-3 flex justify-center">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${isActive
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                    }`}>
                    {isActive ? 'Active' : 'Paused'}
                </span>
            </div>
        </div>
    );
};

export default HabitCard;
