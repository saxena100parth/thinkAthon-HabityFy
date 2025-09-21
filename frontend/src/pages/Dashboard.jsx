import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useHabits } from '../contexts/HabitContext';
import { useNotifications } from '../contexts/NotificationContext';
import Sidebar from '../components/dashboard/Sidebar';
import HabitsSection from '../components/dashboard/HabitsSection';
import StatsSection from '../components/dashboard/StatsSection';
import TopNav from '../components/dashboard/TopNav';
import { Menu, X } from 'lucide-react';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const { habits, stats, loading: habitsLoading } = useHabits();
    const { unreadCount } = useNotifications();
    const [sidebarOpen, setSidebarOpen] = useState(false);

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
            <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${
                sidebarOpen ? 'translate-x-0' : '-translate-x-full'
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
                                Let's make today productive by completing your habits.
                            </p>
                        </div>

                        {/* Dashboard Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Left Column - Habits */}
                            <div className="lg:col-span-2">
                                <HabitsSection habits={habits} />
                            </div>

                            {/* Right Column - Stats */}
                            <div className="lg:col-span-1">
                                <StatsSection stats={stats} />
                            </div>
                        </div>
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
