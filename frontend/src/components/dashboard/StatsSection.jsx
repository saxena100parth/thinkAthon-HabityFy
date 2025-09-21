import { useState } from 'react';
import {
    TrendingUp,
    Target,
    Calendar,
    Award,
    Clock,
    BarChart3,
    Flame,
    CheckCircle
} from 'lucide-react';

const StatsSection = ({ stats }) => {
    const [selectedPeriod, setSelectedPeriod] = useState('week');

    if (!stats) {
        return (
            <div className="space-y-6">
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                        <div className="space-y-3">
                            <div className="h-3 bg-gray-200 rounded"></div>
                            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const statCards = [
        {
            title: 'Current Streak',
            value: stats.totalStreak,
            icon: <Flame className="w-6 h-6" />,
            color: 'text-orange-600',
            bgColor: 'bg-orange-100'
        },
        {
            title: 'Max Streak',
            value: stats.maxStreak,
            icon: <Award className="w-6 h-6" />,
            color: 'text-purple-600',
            bgColor: 'bg-purple-100'
        },
        {
            title: 'Today Completed',
            value: stats.todayCompleted,
            icon: <CheckCircle className="w-6 h-6" />,
            color: 'text-green-600',
            bgColor: 'bg-green-100'
        },
        {
            title: 'Completion Rate',
            value: `${stats.completionRate}%`,
            icon: <Target className="w-6 h-6" />,
            color: 'text-blue-600',
            bgColor: 'bg-blue-100'
        }
    ];

    return (
        <div className="space-y-6">
            {/* Overview Stats */}
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Overview</h3>
                <div className="grid grid-cols-2 gap-4">
                    {statCards.map((card, index) => (
                        <div key={index} className="text-center">
                            <div className={`w-12 h-12 ${card.bgColor} rounded-full flex items-center justify-center mx-auto mb-2 ${card.color}`}>
                                {card.icon}
                            </div>
                            <div className="text-2xl font-bold text-gray-900">{card.value}</div>
                            <div className="text-sm text-gray-600">{card.title}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Progress Chart Placeholder */}
            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Progress</h3>
                    <select
                        value={selectedPeriod}
                        onChange={(e) => setSelectedPeriod(e.target.value)}
                        className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    >
                        <option value="week">This Week</option>
                        <option value="month">This Month</option>
                        <option value="year">This Year</option>
                    </select>
                </div>

                {/* Simple progress bar representation */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Habit Completion</span>
                        <span className="font-medium text-gray-900">{stats.completionRate}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                            className="bg-gradient-to-r from-red-500 to-red-600 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${stats.completionRate}%` }}
                        />
                    </div>

                    {/* Weekly progress bars */}
                    <div className="space-y-2">
                        <div className="text-sm text-gray-600">This Week</div>
                        <div className="flex space-x-1">
                            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                                <div key={day} className="flex-1 text-center">
                                    <div className={`h-8 rounded mb-1 ${index < 5 ? 'bg-green-500' : 'bg-gray-200'
                                        }`} />
                                    <div className="text-xs text-gray-600">{day}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Achievements */}
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Achievements</h3>
                <div className="space-y-3">
                    <div className="flex items-center p-3 bg-green-50 rounded-lg">
                        <Award className="w-5 h-5 text-green-600 mr-3" />
                        <div>
                            <div className="text-sm font-medium text-gray-900">7-Day Streak!</div>
                            <div className="text-xs text-gray-600">Morning Exercise</div>
                        </div>
                    </div>
                    <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                        <Target className="w-5 h-5 text-blue-600 mr-3" />
                        <div>
                            <div className="text-sm font-medium text-gray-900">Goal Achieved</div>
                            <div className="text-xs text-gray-600">Read 20 pages daily</div>
                        </div>
                    </div>
                    <div className="flex items-center p-3 bg-purple-50 rounded-lg">
                        <Flame className="w-5 h-5 text-purple-600 mr-3" />
                        <div>
                            <div className="text-sm font-medium text-gray-900">30-Day Milestone</div>
                            <div className="text-xs text-gray-600">Meditation habit</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                    <button className="w-full flex items-center justify-center px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Mark All Complete
                    </button>
                    <button className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                        <BarChart3 className="w-5 h-5 mr-2" />
                        View Detailed Stats
                    </button>
                    <button className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                        <Calendar className="w-5 h-5 mr-2" />
                        View Calendar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StatsSection;
