import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Home,
    Plus,
    Bell,
    Settings,
    X,
    Target,
    Calendar,
    TrendingUp,
    Utensils
} from 'lucide-react';
import { useHabits } from '../../contexts/HabitContext';
import { useNotifications } from '../../contexts/NotificationContext';

const Sidebar = ({ onClose }) => {
    const { getActiveHabits, getTodayCompletedHabits } = useHabits();
    const { unreadCount } = useNotifications();
    const [showCreateHabit, setShowCreateHabit] = useState(false);
    const [activeSection, setActiveSection] = useState('habits');

    const activeHabits = getActiveHabits();
    const todayCompleted = getTodayCompletedHabits();

    const menuItems = [
        {
            name: 'All Habits',
            icon: <Home className="w-5 h-5" />,
            count: activeHabits.length,
            active: activeSection === 'habits',
            onClick: () => {
                setActiveSection('habits');
                if (onClose) onClose();
            }
        },
        {
            name: 'Notifications',
            icon: <Bell className="w-5 h-5" />,
            count: unreadCount,
            active: activeSection === 'notifications',
            onClick: () => {
                setActiveSection('notifications');
                if (onClose) onClose();
                // Navigate to notifications page
                window.location.href = '/notifications';
            }
        },
        {
            name: 'Settings',
            icon: <Settings className="w-5 h-5" />,
            count: null,
            active: activeSection === 'settings',
            onClick: () => {
                setActiveSection('settings');
                if (onClose) onClose();
                // Navigate to settings page
                window.location.href = '/settings';
            }
        },
        {
            name: 'Diet Chart',
            icon: <Utensils className="w-5 h-5" />,
            count: null,
            active: activeSection === 'diet-chart',
            onClick: () => {
                setActiveSection('diet-chart');
                if (onClose) onClose();
                // Navigate to diet chart page
                window.location.href = '/diet-chart';
            }
        }
    ];

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-red-600">HabityFy</h2>
                <button
                    onClick={onClose}
                    className="lg:hidden p-1 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                >
                    <X className="h-6 w-6" />
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-6 space-y-2">
                {menuItems.map((item, index) => (
                    <button
                        key={index}
                        onClick={item.onClick}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-colors ${item.active
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : 'text-gray-700 hover:bg-gray-100'
                            }`}
                    >
                        <div className="flex items-center">
                            <span className="mr-3">{item.icon}</span>
                            <span className="font-medium">{item.name}</span>
                        </div>
                        {item.count !== null && (
                            <span className={`px-2 py-1 text-xs rounded-full ${item.active ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'
                                }`}>
                                {item.count}
                            </span>
                        )}
                    </button>
                ))}
            </nav>

            {/* Quick Actions */}
            <div className="p-6 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Quick Actions</h3>

                <button
                    onClick={() => setShowCreateHabit(true)}
                    className="w-full flex items-center justify-center px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors mb-3"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Create New Habit
                </button>

                <button className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    <Target className="w-5 h-5 mr-2" />
                    Mark Complete
                </button>
            </div>

            {/* Today's Progress */}
            <div className="p-6 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Today's Progress</h3>
                <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Completed</span>
                        <span className="font-medium text-green-600">{todayCompleted.length}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Total Habits</span>
                        <span className="font-medium text-gray-900">{activeHabits.length}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-red-600 h-2 rounded-full transition-all duration-300"
                            style={{
                                width: activeHabits.length > 0
                                    ? `${(todayCompleted.length / activeHabits.length) * 100}%`
                                    : '0%'
                            }}
                        />
                    </div>
                    <p className="text-xs text-gray-500 text-center">
                        {activeHabits.length > 0
                            ? `${Math.round((todayCompleted.length / activeHabits.length) * 100)}% complete`
                            : 'No active habits'
                        }
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
