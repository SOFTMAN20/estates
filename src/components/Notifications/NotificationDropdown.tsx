import { useState } from 'react';
import { X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useNotifications } from '@/hooks/useNotifications';
import { NotificationItem } from './NotificationItem';
import { groupNotificationsByDate } from '@/lib/notificationHelpers';
import { Link } from 'react-router-dom';

interface NotificationDropdownProps {
  onClose: () => void;
}

export function NotificationDropdown({ onClose }: NotificationDropdownProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');
  const { 
    notifications, 
    unreadCount, 
    markAllAsRead, 
    isLoading 
  } = useNotifications(activeTab);

  const groupedNotifications = groupNotificationsByDate(notifications);

  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };

  return (
    <div className="absolute top-full right-0 mt-2 w-[400px] max-w-[calc(100vw-2rem)] bg-white rounded-lg shadow-xl border border-gray-200 z-50 animate-in slide-in-from-top-2 duration-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="font-semibold text-lg">Notifications</h3>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllAsRead}
              className="text-xs"
            >
              <Check className="w-3 h-3 mr-1" />
              Mark all read
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'all' | 'unread')}>
        <div className="px-4 pt-2">
          <TabsList className="w-full">
            <TabsTrigger value="all" className="flex-1">
              All
            </TabsTrigger>
            <TabsTrigger value="unread" className="flex-1">
              Unread
              {unreadCount > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                  {unreadCount}
                </span>
              )}
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Content */}
        <div className="max-h-[500px] overflow-y-auto">
          <TabsContent value="all" className="mt-0">
            {isLoading ? (
              <div className="p-8 text-center text-gray-500">
                Loading notifications...
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-500 mb-2">No notifications yet</p>
                <p className="text-sm text-gray-400">
                  We'll notify you when something happens
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {Object.entries(groupedNotifications).map(([group, items]) => {
                  if (items.length === 0) return null;
                  return (
                    <div key={group}>
                      <div className="px-4 py-2 bg-gray-50">
                        <p className="text-xs font-medium text-gray-500 uppercase">
                          {group}
                        </p>
                      </div>
                      {items.map(notification => (
                        <NotificationItem
                          key={notification.id}
                          notification={notification}
                          onClick={onClose}
                        />
                      ))}
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="unread" className="mt-0">
            {isLoading ? (
              <div className="p-8 text-center text-gray-500">
                Loading notifications...
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-500 mb-2">No unread notifications</p>
                <p className="text-sm text-gray-400">
                  You're all caught up!
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map(notification => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onClick={onClose}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </div>
      </Tabs>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="p-3 border-t border-gray-200 text-center">
          <Link
            to="/notifications"
            onClick={onClose}
            className="text-sm text-primary hover:underline font-medium"
          >
            View All Notifications
          </Link>
        </div>
      )}
    </div>
  );
}
