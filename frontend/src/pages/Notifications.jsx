import React, { useState, useEffect } from 'react';
import {
    Bell,
    ArrowLeft,
    CheckCircle,
    Clock,
    AlertCircle,
    Star,
    Trash2,
    RefreshCw,
    Eye,
    EyeOff
} from 'lucide-react';
import { useNotifications } from '../contexts/NotificationContext';
import { useAuth } from '../contexts/AuthContext';

const Notifications = () => {
    const {
        notifications,
        loading,
        error,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        fetchNotifications,
        unreadCount
    } = useNotifications();

    const { user } = useAuth();

    // State management
    const [filter, setFilter] = useState('all'); // all, unread, read
    const [selectedNotifications, setSelectedNotifications] = useState(new Set());

    // Fetch notifications on component mount
    useEffect(() => {
        fetchNotifications();
    }, []);

    // Filter notifications based on current filter
    const filteredNotifications = notifications?.filter(notification => {
        if (filter === 'unread') return !notification.read;
        if (filter === 'read') return notification.read;
        return true;
    }) || [];

    // Handle notification actions
    const handleMarkAsRead = async (notificationId) => {
        try {
            await markAsRead(notificationId);
            setSelectedNotifications(prev => {
                const newSet = new Set(prev);
                newSet.delete(notificationId);
                return newSet;
            });
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    };

    const handleDelete = async (notificationId) => {
        try {
            await deleteNotification(notificationId);
            setSelectedNotifications(prev => {
                const newSet = new Set(prev);
                newSet.delete(notificationId);
                return newSet;
            });
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    };

    const handleSelectAll = () => {
        if (selectedNotifications.size === filteredNotifications.length) {
            setSelectedNotifications(new Set());
        } else {
            setSelectedNotifications(new Set(filteredNotifications.map(n => n._id)));
        }
    };

    const handleSelectNotification = (notificationId) => {
        setSelectedNotifications(prev => {
            const newSet = new Set(prev);
            if (newSet.has(notificationId)) {
                newSet.delete(notificationId);
            } else {
                newSet.add(notificationId);
            }
            return newSet;
        });
    };

    // Get notification icon based on type
    const getNotificationIcon = (type) => {
        const iconClass = "w-5 h-5 text-gray-600";

        switch (type) {
            case 'reminder':
                return <Clock className={iconClass} />;
            case 'achievement':
                return <Star className={iconClass} />;
            case 'motivation':
                return <Bell className={iconClass} />;
            default:
                return <Bell className={iconClass} />;
        }
    };

    // Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

        if (diffInHours < 1) {
            return 'Just now';
        } else if (diffInHours < 24) {
            return `${diffInHours}h ago`;
        } else if (diffInHours < 48) {
            return 'Yesterday';
        } else {
            return date.toLocaleDateString();
        }
    };

    // Get type color
    const getTypeColor = (type) => {
        switch (type) {
            case 'reminder':
                return 'bg-yellow-100 text-yellow-800';
            case 'achievement':
                return 'bg-green-100 text-green-800';
            case 'motivation':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading && !notifications) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <RefreshCw className="w-8 h-8 text-red-600 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Loading notifications...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <button
                                onClick={() => window.location.href = '/dashboard'}
                                className="mr-4 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                                title="Back to Dashboard"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                            <Bell className="w-8 h-8 text-red-600 mr-3" />
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                                <p className="text-gray-600">
                                    {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => fetchNotifications()}
                                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                                title="Refresh"
                            >
                                <RefreshCw className="w-5 h-5" />
                            </button>

                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllAsRead}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                >
                                    Mark All as Read
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
                    <div className="flex space-x-1">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'all'
                                    ? 'bg-red-600 text-white'
                                    : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            All ({notifications?.length || 0})
                        </button>
                        <button
                            onClick={() => setFilter('unread')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'unread'
                                    ? 'bg-red-600 text-white'
                                    : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            Unread ({unreadCount})
                        </button>
                        <button
                            onClick={() => setFilter('read')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'read'
                                    ? 'bg-red-600 text-white'
                                    : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            Read ({(notifications?.length || 0) - unreadCount})
                        </button>
                    </div>
                </div>

                {/* Notifications List */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    {filteredNotifications.length === 0 ? (
                        <div className="p-12 text-center">
                            <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications found</h3>
                            <p className="text-gray-600">
                                {filter !== 'all'
                                    ? 'Try changing your filter to see more notifications.'
                                    : 'You\'re all caught up! New notifications will appear here.'}
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200">
                            {/* Select All Header */}
                            <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={selectedNotifications.size === filteredNotifications.length && filteredNotifications.length > 0}
                                        onChange={handleSelectAll}
                                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                                    />
                                    <span className="ml-2 text-sm text-gray-600">
                                        Select all ({filteredNotifications.length})
                                    </span>
                                </div>
                            </div>

                            {/* Notification Items */}
                            {filteredNotifications.map((notification) => (
                                <div
                                    key={notification._id}
                                    className={`px-6 py-4 hover:bg-gray-50 transition-colors ${!notification.read ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                                        }`}
                                >
                                    <div className="flex items-start space-x-4">
                                        {/* Checkbox */}
                                        <input
                                            type="checkbox"
                                            checked={selectedNotifications.has(notification._id)}
                                            onChange={() => handleSelectNotification(notification._id)}
                                            className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded mt-1"
                                        />

                                        {/* Icon */}
                                        <div className="flex-shrink-0">
                                            {getNotificationIcon(notification.type)}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <p className="text-sm text-gray-900 mb-2">
                                                        {notification.message}
                                                    </p>

                                                    {/* Tags */}
                                                    <div className="flex items-center space-x-2 mb-2">
                                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(notification.type)}`}>
                                                            {notification.type}
                                                        </span>
                                                        {notification.habitId && (
                                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                                {notification.habitId.title}
                                                            </span>
                                                        )}
                                                    </div>

                                                    {/* Time */}
                                                    <p className="text-xs text-gray-500">
                                                        {formatDate(notification.createdAt)}
                                                    </p>
                                                </div>

                                                {/* Actions */}
                                                <div className="flex items-center space-x-2">
                                                    {!notification.read ? (
                                                        <button
                                                            onClick={() => handleMarkAsRead(notification._id)}
                                                            className="p-1 text-gray-400 hover:text-gray-600"
                                                            title="Mark as read"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleMarkAsRead(notification._id)}
                                                            className="p-1 text-gray-400 hover:text-gray-600"
                                                            title="Mark as unread"
                                                        >
                                                            <EyeOff className="w-4 h-4" />
                                                        </button>
                                                    )}

                                                    <button
                                                        onClick={() => handleDelete(notification._id)}
                                                        className="p-1 text-gray-400 hover:text-red-600"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Error Display */}
                {error && (
                    <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex">
                            <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                            <p className="text-red-800">{error}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notifications;