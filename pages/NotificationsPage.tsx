import React from 'react';
import { useNavigate } from 'react-router-dom';

interface Notification {
    id: string;
    type: 'reminder' | 'insight' | 'achievement' | 'system';
    title: string;
    message: string;
    time: string;
    read: boolean;
    icon: string;
    colorClass: string;
}

const MOCK_NOTIFICATIONS: Notification[] = [
    {
        id: '1',
        type: 'reminder',
        title: 'Evening Reflection Time',
        message: 'Don\'t forget to write your evening reflection. It\'s been a productive day!',
        time: '2 hours ago',
        read: false,
        icon: 'notifications',
        colorClass: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
    },
    {
        id: '2',
        type: 'insight',
        title: 'Weekly Insight Ready',
        message: 'Your mood has improved by 15% this week. View your detailed insights.',
        time: '5 hours ago',
        read: false,
        icon: 'insights',
        colorClass: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'
    },
    {
        id: '3',
        type: 'achievement',
        title: 'Streak Achievement! 🎉',
        message: 'Congratulations! You\'ve maintained a 7-day journaling streak.',
        time: '1 day ago',
        read: true,
        icon: 'emoji_events',
        colorClass: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400'
    },
    {
        id: '4',
        type: 'system',
        title: 'New Template Available',
        message: 'Check out the new "Gratitude Journal" template in your templates library.',
        time: '2 days ago',
        read: true,
        icon: 'grid_view',
        colorClass: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
    }
];

export const NotificationsPage: React.FC = () => {
    const navigate = useNavigate();
    const [notifications, setNotifications] = React.useState(MOCK_NOTIFICATIONS);

    const markAsRead = (id: string) => {
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, read: true } : n)
        );
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div className="p-6 lg:p-10 max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Notifications</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
                    </p>
                </div>
                {unreadCount > 0 && (
                    <button
                        onClick={markAllAsRead}
                        className="px-4 py-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                    >
                        Mark all as read
                    </button>
                )}
            </div>

            {/* Notifications List */}
            <div className="space-y-3">
                {notifications.map((notification) => (
                    <div
                        key={notification.id}
                        onClick={() => markAsRead(notification.id)}
                        className={`bg-card-light dark:bg-card-dark rounded-xl border ${notification.read
                                ? 'border-gray-100 dark:border-gray-800'
                                : 'border-primary/30 bg-primary/5 dark:bg-primary/10'
                            } p-5 hover:shadow-md transition-all cursor-pointer group`}
                    >
                        <div className="flex gap-4">
                            <div className={`${notification.colorClass} p-3 rounded-xl h-fit flex-shrink-0`}>
                                <span className="material-symbols-outlined text-xl">{notification.icon}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-3 mb-1">
                                    <h3 className="font-bold text-gray-900 dark:text-white">{notification.title}</h3>
                                    {!notification.read && (
                                        <span className="flex-shrink-0 w-2 h-2 bg-primary rounded-full mt-2"></span>
                                    )}
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                    {notification.message}
                                </p>
                                <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-500">
                                    <span className="flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[14px]">schedule</span>
                                        {notification.time}
                                    </span>
                                    <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-[10px] font-bold uppercase tracking-wide">
                                        {notification.type}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {notifications.length === 0 && (
                <div className="text-center py-20">
                    <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-600 mb-4">notifications_off</span>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No notifications</h3>
                    <p className="text-gray-500 dark:text-gray-400">You're all caught up!</p>
                </div>
            )}
        </div>
    );
};
