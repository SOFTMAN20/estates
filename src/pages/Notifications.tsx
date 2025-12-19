import { useState } from 'react';
import { Bell, Check, Trash2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useNotifications } from '@/hooks/useNotifications';
import { NotificationItem } from '@/components/Notifications/NotificationItem';
import type { NotificationFilter } from '@/types/notification';
import { cn } from '@/lib/utils';

export default function Notifications() {
  const [filter, setFilter] = useState<NotificationFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const { 
    notifications, 
    unreadCount, 
    markAllAsRead, 
    deleteAllRead,
    isLoading 
  } = useNotifications(filter);

  // Filter by search query
  const filteredNotifications = notifications.filter(n =>
    n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectAll = () => {
    if (selectedIds.size === filteredNotifications.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredNotifications.map(n => n.id)));
    }
  };

  const handleToggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Notifications</h1>
              <p className="text-xs sm:text-sm text-gray-500">
                {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
              </p>
            </div>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 mb-4">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search notifications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 text-sm"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
              {selectedIds.size > 0 ? (
                <>
                  <span className="text-xs sm:text-sm text-gray-600">
                    {selectedIds.size} selected
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedIds(new Set())}
                    className="text-xs sm:text-sm"
                  >
                    Clear
                  </Button>
                </>
              ) : (
                <>
                  {unreadCount > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={markAllAsRead}
                      className="text-xs sm:text-sm flex-1 sm:flex-none"
                    >
                      <Check className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      <span className="hidden sm:inline">Mark all read</span>
                      <span className="sm:hidden">Mark read</span>
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={deleteAllRead}
                    className="text-xs sm:text-sm flex-1 sm:flex-none"
                  >
                    <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Clear read</span>
                    <span className="sm:hidden">Clear</span>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={filter} onValueChange={(v) => setFilter(v as NotificationFilter)}>
          <TabsList className="mb-4 w-full overflow-x-auto flex-nowrap justify-start">
            <TabsTrigger value="all" className="text-xs sm:text-sm">All</TabsTrigger>
            <TabsTrigger value="unread" className="text-xs sm:text-sm">
              Unread
              {unreadCount > 0 && (
                <span className="ml-1 sm:ml-2 px-1.5 sm:px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                  {unreadCount}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="booking" className="text-xs sm:text-sm">Bookings</TabsTrigger>
            <TabsTrigger value="payment" className="text-xs sm:text-sm">Payments</TabsTrigger>
            <TabsTrigger value="property" className="text-xs sm:text-sm">Properties</TabsTrigger>
            <TabsTrigger value="system" className="text-xs sm:text-sm">System</TabsTrigger>
          </TabsList>

          {/* Content */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {isLoading ? (
              <div className="p-8 sm:p-12 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-sm sm:text-base text-gray-500">Loading notifications...</p>
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div className="p-8 sm:p-12 text-center">
                <Bell className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
                  {searchQuery ? 'No matching notifications' : 'No notifications'}
                </h3>
                <p className="text-sm sm:text-base text-gray-500">
                  {searchQuery 
                    ? 'Try adjusting your search query' 
                    : "You're all caught up! We'll notify you when something happens."}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredNotifications.map(notification => (
                  <div
                    key={notification.id}
                    className={cn(
                      'relative',
                      selectedIds.has(notification.id) && 'bg-blue-50'
                    )}
                  >
                    <div className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4">
                      {/* Checkbox */}
                      <input
                        type="checkbox"
                        checked={selectedIds.has(notification.id)}
                        onChange={() => handleToggleSelect(notification.id)}
                        className="mt-3 sm:mt-4 rounded border-gray-300 text-primary focus:ring-primary flex-shrink-0"
                      />
                      
                      {/* Notification Item */}
                      <div className="flex-1 min-w-0">
                        <NotificationItem
                          notification={notification}
                          showDelete={true}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Tabs>

        {/* Pagination info */}
        {filteredNotifications.length > 0 && (
          <div className="mt-4 text-center text-xs sm:text-sm text-gray-500">
            Showing {filteredNotifications.length} notification{filteredNotifications.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>
    </div>
  );
}
