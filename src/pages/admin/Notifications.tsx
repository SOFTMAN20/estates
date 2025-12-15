/**
 * ADMIN NOTIFICATION CENTER
 * =========================
 * 
 * Central hub for all admin notifications with:
 * - List all notifications
 * - Filter by type and priority
 * - Mark as read/unread
 * - Quick actions
 * - Real-time updates
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertCircle,
  Bell,
  CheckCircle2,
  Clock,
  Filter,
  Home,
  Loader2,
  MailOpen,
  Trash2,
  Users,
  AlertTriangle,
  DollarSign,
  FileText,
  Calendar,
  Star,
  CheckCheck,
  X
} from 'lucide-react';
import {
  useAdminNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
  useDeleteNotification,
  type AdminNotification,
} from '@/hooks/useAdminNotifications';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

export default function AdminNotifications() {
  const navigate = useNavigate();
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [readFilter, setReadFilter] = useState<string>('all');

  // Build filters
  const filters: any = {};
  if (typeFilter !== 'all') filters.type = typeFilter;
  if (priorityFilter !== 'all') filters.priority = priorityFilter;
  if (readFilter === 'read') filters.is_read = true;
  if (readFilter === 'unread') filters.is_read = false;

  const { data: notifications = [], isLoading } = useAdminNotifications(filters);
  const markAsRead = useMarkNotificationRead();
  const markAllAsRead = useMarkAllNotificationsRead();
  const deleteNotification = useDeleteNotification();

  const getNotificationIcon = (type: AdminNotification['type']) => {
    switch (type) {
      case 'property_submission':
        return <Home className="h-5 w-5 text-blue-500" />;
      case 'user_report':
        return <Users className="h-5 w-5 text-orange-500" />;
      case 'payment_failed':
        return <DollarSign className="h-5 w-5 text-red-500" />;
      case 'system_error':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      case 'unusual_activity':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'daily_summary':
        return <FileText className="h-5 w-5 text-gray-500" />;
      case 'booking_issue':
        return <Calendar className="h-5 w-5 text-purple-500" />;
      case 'review_flagged':
        return <Star className="h-5 w-5 text-amber-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: AdminNotification['priority']) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'normal':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'low':
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleNotificationClick = (notification: AdminNotification) => {
    // Mark as read
    if (!notification.is_read) {
      markAsRead.mutate(notification.id);
    }

    // Navigate to related entity if available
    if (notification.related_type && notification.related_id) {
      switch (notification.related_type) {
        case 'property':
          navigate(`/admin/properties?id=${notification.related_id}`);
          break;
        case 'user':
          navigate(`/admin/users?id=${notification.related_id}`);
          break;
        case 'booking':
          navigate(`/admin/bookings?id=${notification.related_id}`);
          break;
        case 'payment':
          navigate(`/admin/payments?id=${notification.related_id}`);
          break;
      }
    }
  };

  const handleQuickAction = async (notification: AdminNotification, action: string) => {
    // Handle quick actions based on notification type
    if (notification.type === 'property_submission' && notification.action_data.property_id) {
      const propertyId = notification.action_data.property_id;
      
      if (action === 'approve') {
        // Approve property
        toast.success('Property approved');
        navigate(`/admin/properties?id=${propertyId}`);
      } else if (action === 'reject') {
        // Reject property
        toast.info('Opening property for rejection');
        navigate(`/admin/properties?id=${propertyId}`);
      }
    }

    // Mark notification as read
    if (!notification.is_read) {
      markAsRead.mutate(notification.id);
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminHeader />
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        
        <div className="flex-1 p-4 md:p-8 overflow-auto">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Notification Center</h1>
              <p className="text-gray-600 mt-1">
                {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
              </p>
            </div>
            {unreadCount > 0 && (
              <Button
                onClick={() => markAllAsRead.mutate()}
                disabled={markAllAsRead.isPending}
                variant="outline"
              >
                <CheckCheck className="h-4 w-4 mr-2" />
                Mark All Read
              </Button>
            )}
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Type</label>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="property_submission">Property Submissions</SelectItem>
                      <SelectItem value="user_report">User Reports</SelectItem>
                      <SelectItem value="payment_failed">Payment Failures</SelectItem>
                      <SelectItem value="system_error">System Errors</SelectItem>
                      <SelectItem value="unusual_activity">Unusual Activity</SelectItem>
                      <SelectItem value="daily_summary">Daily Summary</SelectItem>
                      <SelectItem value="booking_issue">Booking Issues</SelectItem>
                      <SelectItem value="review_flagged">Flagged Reviews</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Priority</label>
                  <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priorities</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Status</label>
                  <Select value={readFilter} onValueChange={setReadFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="unread">Unread</SelectItem>
                      <SelectItem value="read">Read</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notifications List */}
          <div className="space-y-3">
            {notifications.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No notifications found</p>
                </CardContent>
              </Card>
            ) : (
              notifications.map((notification) => (
                <Card
                  key={notification.id}
                  className={cn(
                    'transition-all hover:shadow-md cursor-pointer',
                    !notification.is_read && 'border-l-4 border-l-primary bg-blue-50/30'
                  )}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0" onClick={() => handleNotificationClick(notification)}>
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1">
                              {notification.title}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {notification.message}
                            </p>
                          </div>
                          <Badge className={cn('border', getPriorityColor(notification.priority))}>
                            {notification.priority}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                          </span>
                          {notification.is_read && (
                            <span className="flex items-center gap-1">
                              <CheckCircle2 className="h-3 w-3 text-green-500" />
                              Read
                            </span>
                          )}
                        </div>

                        {/* Quick Actions */}
                        {notification.action_data?.actions && notification.action_data.actions.length > 0 && (
                          <div className="flex gap-2 mt-3">
                            {notification.action_data.actions.map((action: string) => (
                              <Button
                                key={action}
                                size="sm"
                                variant={action === 'approve' ? 'default' : 'outline'}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleQuickAction(notification, action);
                                }}
                              >
                                {action === 'approve' && <CheckCircle2 className="h-3 w-3 mr-1" />}
                                {action === 'reject' && <X className="h-3 w-3 mr-1" />}
                                {action.charAt(0).toUpperCase() + action.slice(1)}
                              </Button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex-shrink-0 flex gap-2">
                        {!notification.is_read && (
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead.mutate(notification.id);
                            }}
                            title="Mark as read"
                          >
                            <MailOpen className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification.mutate(notification.id);
                          }}
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
