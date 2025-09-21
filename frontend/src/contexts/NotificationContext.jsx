import { createContext, useContext, useState, useEffect } from 'react';
import { notificationsAPI } from '../utils/api';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    // Fetch notifications
    const fetchNotifications = async (params = {}) => {
        if (!user) return;

        setLoading(true);
        setError(null);
        try {
            const response = await notificationsAPI.getNotifications(params);
            setNotifications(response.data.notifications);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch notifications');
        } finally {
            setLoading(false);
        }
    };

    // Fetch unread count
    const fetchUnreadCount = async () => {
        if (!user) return;

        try {
            const response = await notificationsAPI.getUnreadCount();
            setUnreadCount(response.data.unreadCount);
        } catch (err) {
            console.error('Failed to fetch unread count:', err);
        }
    };

    // Mark notification as read
    const markAsRead = async (id) => {
        try {
            await notificationsAPI.markAsRead(id);
            setNotifications(prev =>
                prev.map(notification =>
                    notification._id === id
                        ? { ...notification, read: true, readAt: new Date() }
                        : notification
                )
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
            return { success: true };
        } catch (err) {
            return {
                success: false,
                error: err.response?.data?.message || 'Failed to mark as read'
            };
        }
    };

    // Mark all notifications as read
    const markAllAsRead = async () => {
        try {
            await notificationsAPI.markAllAsRead();
            setNotifications(prev =>
                prev.map(notification => ({
                    ...notification,
                    read: true,
                    readAt: new Date()
                }))
            );
            setUnreadCount(0);
            return { success: true };
        } catch (err) {
            return {
                success: false,
                error: err.response?.data?.message || 'Failed to mark all as read'
            };
        }
    };

    // Delete notification
    const deleteNotification = async (id) => {
        try {
            await notificationsAPI.deleteNotification(id);
            setNotifications(prev => prev.filter(notification => notification._id !== id));
            return { success: true };
        } catch (err) {
            return {
                success: false,
                error: err.response?.data?.message || 'Failed to delete notification'
            };
        }
    };

    // Create notification
    const createNotification = async (notificationData) => {
        try {
            const response = await notificationsAPI.createNotification(notificationData);
            setNotifications(prev => [response.data.notification, ...prev]);
            return { success: true, data: response.data };
        } catch (err) {
            return {
                success: false,
                error: err.response?.data?.message || 'Failed to create notification'
            };
        }
    };

    // Get unread notifications
    const getUnreadNotifications = () => {
        return notifications.filter(notification => !notification.read);
    };

    // Get notifications by type
    const getNotificationsByType = (type) => {
        return notifications.filter(notification => notification.type === type);
    };

    // Load data when user changes
    useEffect(() => {
        if (user) {
            fetchNotifications();
            fetchUnreadCount();
        } else {
            setNotifications([]);
            setUnreadCount(0);
        }
    }, [user]);

    // Refresh notifications every 30 seconds
    useEffect(() => {
        if (!user) return;

        const interval = setInterval(() => {
            fetchNotifications();
            fetchUnreadCount();
        }, 30000);

        return () => clearInterval(interval);
    }, [user]);

    const value = {
        notifications,
        unreadCount,
        loading,
        error,
        fetchNotifications,
        fetchUnreadCount,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        createNotification,
        getUnreadNotifications,
        getNotificationsByType,
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};
