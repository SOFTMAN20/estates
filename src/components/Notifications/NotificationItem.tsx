import { useNavigate } from 'react-router-dom';
import { Calendar, DollarSign, Home, Info, MessageSquare, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import type { Notification } from '@/types/notification';
import { useNotifications } from '@/hooks/useNotifications';
import { Button } from '@/components/ui/button';

interface NotificationItemProps {
  notification: Notification;
  onClick?: () => void;
  showDelete?: boolean;
}

export function NotificationItem({ notification, onClick, showDelete = false }: NotificationItemProps) {
  const navigate = useNavigate();
  const { markAsRead, deleteNotification } = useNotifications();

  const icons = {
    booking: { icon: Calendar, color: 'text-blue-500 bg-blue-50' },
    payment: { icon: DollarSign, color: 'text-green-500 bg-green-50' },
    property: { icon: Home, color: 'text-orange-500 bg-orange-50' },
    system: { icon: Info, color: 'text-gray-500 bg-gray-50' },
    message: { icon: MessageSquare, color: 'text-purple-500 bg-purple-50' },
  };

  const { icon: Icon, color } = icons[notification.type];

  const handleClick = () => {
    if (!notification.is_read) {
      markAsRead(notification.id);
    }

    if (notification.action_url) {
      navigate(notification.action_url);
    }

    onClick?.();
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteNotification(notification.id);
  };

  const timeAgo = formatDistanceToNow(new Date(notification.created_at), { addSuffix: true });

  return (
    <div
      onClick={handleClick}
      className={cn(
        'p-4 hover:bg-gray-50 transition-colors cursor-pointer relative group',
        !notification.is_read && 'bg-blue-50/30'
      )}
    >
      <div className="flex gap-3">
        {/* Icon */}
        <div className={cn('flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center', color)}>
          <Icon className="w-5 h-5" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className={cn(
              'text-sm line-clamp-1',
              !notification.is_read ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'
            )}>
              {notification.title}
            </h4>
            {!notification.is_read && (
              <span className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-1.5" />
            )}
          </div>
          
          <p className="text-sm text-gray-600 line-clamp-2 mt-0.5">
            {notification.message}
          </p>
          
          <div className="flex items-center justify-between mt-2">
            <p className="text-xs text-gray-400">
              {timeAgo}
            </p>
            
            {notification.priority === 'high' && (
              <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-0.5 rounded">
                Important
              </span>
            )}
            
            {notification.priority === 'urgent' && (
              <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded">
                Urgent
              </span>
            )}
          </div>
        </div>

        {/* Delete button */}
        {showDelete && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 flex-shrink-0"
          >
            <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
          </Button>
        )}
      </div>
    </div>
  );
}
