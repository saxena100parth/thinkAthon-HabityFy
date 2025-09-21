import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useHabits } from '../contexts/HabitContext';
import { useNotifications } from '../contexts/NotificationContext';
import Sidebar from '../components/dashboard/Sidebar';
import HabitsSection from '../components/dashboard/HabitsSection';
import CompletedHabits from '../components/dashboard/CompletedHabits';
import StatsSection from '../components/dashboard/StatsSection';
import TopNav from '../components/dashboard/TopNav';
import { Menu, X, CheckCircle, List } from 'lucide-react';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const { habits, stats, loading: habitsLoading } = useHabits();
    const { unreadCount } = useNotifications();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('habits'); // 'habits' or 'completed'

    // Add error boundary
    if (habitsLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading your habits...</p>
                </div>
            </div>
        );
    }

    // Add safety check for habits
    if (!habits) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="text-red-600 text-6xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Habits</h2>
                    <p className="text-gray-600">There was an error loading your habits. Please try refreshing the page.</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                        Refresh Page
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
                <Sidebar onClose={() => setSidebarOpen(false)} />
            </div>

            {/* Main content area */}
            <div className="flex-1 flex flex-col lg:ml-0">
                {/* Top Navigation */}
                <TopNav
                    user={user}
                    unreadCount={unreadCount}
                    onMenuClick={() => setSidebarOpen(true)}
                    onLogout={logout}
                />

                {/* Main Dashboard Content */}
                <main className="flex-1 p-6">
                    <div className="max-w-7xl mx-auto">
                        {/* Welcome Section */}
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-gray-900">
                                Welcome back, {user?.username}! 👋
                            </h1>
                            <p className="text-gray-600 mt-2">
                                {activeTab === 'habits'
                                    ? "Let's make today productive by completing your habits."
                                    : "Track your progress and view your habit completion history."
                                }
                            </p>
                        </div>

                        {/* Tab Navigation */}
                        <div className="mb-6">
                            <div className="border-b border-gray-200">
                                <nav className="-mb-px flex space-x-8">
                                    <button
                                        onClick={() => setActiveTab('habits')}
                                        className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${activeTab === 'habits'
                                            ? 'border-red-500 text-red-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                            }`}
                                    >
                                        <List className="w-5 h-5" />
                                        <span>My Habits</span>
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('completed')}
                                        className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${activeTab === 'completed'
                                            ? 'border-red-500 text-red-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                            }`}
                                    >
                                        <CheckCircle className="w-5 h-5" />
                                        <span>Completed</span>
                                    </button>
                                </nav>
                            </div>
                        </div>

                        {/* Tab Content */}
                        {activeTab === 'habits' ? (
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Left Column - Habits */}
                                <div className="lg:col-span-2">
                                    <HabitsSection habits={habits} />
                                </div>

                                {/* Right Column - Stats */}
                                <div className="lg:col-span-1" data-section="statistics">
                                    <StatsSection stats={stats} />
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                                {/* Left Column - Completed Habits */}
                                <div className="lg:col-span-3">
                                    <CompletedHabits />
                                </div>

                                {/* Right Column - Stats */}
                                <div className="lg:col-span-1" data-section="statistics">
                                    <StatsSection stats={stats} />
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>

            {/* Mobile menu button */}
            <button
                className="fixed top-4 left-4 z-50 lg:hidden bg-white p-2 rounded-lg shadow-lg"
                onClick={() => setSidebarOpen(true)}
            >
                <Menu className="h-6 w-6 text-gray-600" />
            </button>
        </div>
    );
};

export default Dashboard;
