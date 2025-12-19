import { 
  isToday, 
  isYesterday, 
  isThisWeek, 
  startOfWeek 
} from 'date-fns';
import type { Notification, GroupedNotifications } from '@/types/notification';

export function groupNotificationsByDate(notifications: Notification[]): GroupedNotifications {
  const grouped: GroupedNotifications = {
    today: [],
    yesterday: [],
    thisWeek: [],
    older: [],
  };

  notifications.forEach(notification => {
    const date = new Date(notification.created_at);

    if (isToday(date)) {
      grouped.today.push(notification);
    } else if (isYesterday(date)) {
      grouped.yesterday.push(notification);
    } else if (isThisWeek(date, { weekStartsOn: 1 })) {
      grouped.thisWeek.push(notification);
    } else {
      grouped.older.push(notification);
    }
  });

  return grouped;
}

export function getNotificationIcon(type: Notification['type']): string {
  const icons = {
    booking: '📅',
    payment: '💰',
    property: '🏠',
    system: 'ℹ️',
    message: '💬',
  };
  return icons[type];
}

export function getNotificationColor(type: Notification['type']): string {
  const colors = {
    booking: 'blue',
    payment: 'green',
    property: 'orange',
    system: 'gray',
    message: 'purple',
  };
  return colors[type];
}

export function truncateMessage(message: string, maxLength: number = 100): string {
  if (message.length <= maxLength) return message;
  return message.substring(0, maxLength) + '...';
}
