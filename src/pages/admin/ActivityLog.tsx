/**
 * Admin Activity Log Page
 * Track all admin actions and system events
 */

import { useState } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Search, Filter, CheckCircle, XCircle, AlertCircle, 
  User, Home, Calendar, Settings, Shield, Ban, Eye, Loader2, Download,
  Calendar as CalendarIcon, ExternalLink
} from 'lucide-react';
import { formatDistanceToNow, format as formatDate } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import {
  useAdminActivityLogs,
  useActivityLogStatistics,
  useAdminsList,
  type ActivityLog,
} from '@/hooks/useAdminActivityLog';



const actionTypeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  approve_property: CheckCircle,
  reject_property: XCircle,
  suspend_user: Ban,
  activate_user: CheckCircle,
  update_settings: Settings,
  cancel_booking: XCircle,
  process_refund: AlertCircle,
  change_user_role: User,
  delete_property: XCircle,
};

const actionTypeColors: Record<string, string> = {
  approve_property: 'text-green-600 bg-green-100',
  reject_property: 'text-red-600 bg-red-100',
  suspend_user: 'text-orange-600 bg-orange-100',
  activate_user: 'text-green-600 bg-green-100',
  update_settings: 'text-blue-600 bg-blue-100',
  cancel_booking: 'text-red-600 bg-red-100',
  process_refund: 'text-yellow-600 bg-yellow-100',
  change_user_role: 'text-purple-600 bg-purple-100',
  delete_property: 'text-red-600 bg-red-100',
};

export default function AdminActivityLog() {
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [adminFilter, setAdminFilter] = useState('all');
  const [targetTypeFilter, setTargetTypeFilter] = useState('all');
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  // Fetch data
  const { data: activityLogs = [], isLoading: logsLoading } = useAdminActivityLogs({
    searchQuery,
    actionFilter,
    adminFilter,
    targetTypeFilter,
    startDate,
    endDate,
  });
  const { data: statistics } = useActivityLogStatistics();
  const { data: adminsList = [] } = useAdminsList();

  // Export to CSV
  const handleExportCSV = () => {
    if (activityLogs.length === 0) {
      toast.error('No data to export');
      return;
    }

    try {
      // Create CSV content
      const headers = ['Date/Time', 'Admin Name', 'Admin Email', 'Action', 'Target Type', 'Description', 'IP Address'];
      const csvRows = [
        headers.join(','),
        ...activityLogs.map(log => [
          new Date(log.created_at).toLocaleString(),
          `"${log.admin_name}"`,
          `"${log.admin_email || 'N/A'}"`,
          `"${log.action_type.replace(/_/g, ' ')}"`,
          log.target_type,
          `"${log.description.replace(/"/g, '""')}"`,
          log.ip_address || 'N/A',
        ].join(','))
      ];

      const csvContent = csvRows.join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `activity-log-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('Activity log exported successfully');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export activity log');
    }
  };

  // Get target link
  const getTargetLink = (log: ActivityLog): string | null => {
    if (!log.target_id) return null;

    switch (log.target_type) {
      case 'property':
        return `/admin/properties`;
      case 'user':
        return `/admin/users`;
      case 'booking':
        return `/admin/bookings`;
      default:
        return null;
    }
  };

  const getActionIcon = (actionType: string) => {
    const Icon = actionTypeIcons[actionType] || AlertCircle;
    return Icon;
  };

  const getActionBadge = (actionType: string) => {
    const label = actionType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    return (
      <Badge variant="outline" className={actionTypeColors[actionType] || 'text-gray-600 bg-gray-100'}>
        {label}
      </Badge>
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      
      <div className="flex-1 p-4 md:p-8 overflow-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Activity Log</h1>
          <p className="text-gray-600 mt-1">Track all admin actions and system events</p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Actions</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statistics?.totalActions || 0}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Actions</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statistics?.todayActions || 0}</div>
              <p className="text-xs text-muted-foreground">Last 24 hours</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Admins</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statistics?.uniqueAdmins || 0}</div>
              <p className="text-xs text-muted-foreground">Unique administrators</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="space-y-4">
              {/* Search and Export */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    placeholder="Search by action, admin, or description..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button onClick={handleExportCSV} variant="outline" className="md:w-auto">
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </div>

              {/* Filters Row 1 */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Select value={actionFilter} onValueChange={setActionFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Actions</SelectItem>
                    <SelectItem value="approve_property">Approve Property</SelectItem>
                    <SelectItem value="reject_property">Reject Property</SelectItem>
                    <SelectItem value="suspend_user">Suspend User</SelectItem>
                    <SelectItem value="activate_user">Activate User</SelectItem>
                    <SelectItem value="change_user_role">Change User Role</SelectItem>
                    <SelectItem value="delete_property">Delete Property</SelectItem>
                    <SelectItem value="update_settings">Update Settings</SelectItem>
                    <SelectItem value="cancel_booking">Cancel Booking</SelectItem>
                    <SelectItem value="process_refund">Process Refund</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={adminFilter} onValueChange={setAdminFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by admin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Admins</SelectItem>
                    {adminsList.map((admin) => (
                      <SelectItem key={admin.id} value={admin.id}>
                        {admin.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={targetTypeFilter} onValueChange={setTargetTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by target" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Targets</SelectItem>
                    <SelectItem value="property">Property</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="booking">Booking</SelectItem>
                    <SelectItem value="review">Review</SelectItem>
                    <SelectItem value="settings">Settings</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery('');
                    setActionFilter('all');
                    setAdminFilter('all');
                    setTargetTypeFilter('all');
                    setStartDate(undefined);
                    setEndDate(undefined);
                  }}
                >
                  Clear Filters
                </Button>
              </div>

              {/* Date Range Filters */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Start Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !startDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? formatDate(startDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">End Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !endDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? formatDate(endDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Activity Log Table */}
        <Card>
          <CardHeader>
            <CardTitle>Activity History</CardTitle>
          </CardHeader>
          <CardContent>
            {logsLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date/Time</TableHead>
                      <TableHead>Admin</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Target</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>IP Address</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activityLogs.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                          <Eye className="h-12 w-12 mx-auto mb-2 opacity-50" />
                          <p>No activity logs found</p>
                          <p className="text-sm mt-1">Admin actions will appear here</p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      activityLogs.map((log) => {
                        const Icon = getActionIcon(log.action_type);
                        const targetLink = getTargetLink(log);
                        
                        return (
                          <TableRow key={log.id}>
                            <TableCell className="text-sm text-gray-500">
                              <div>{formatDate(new Date(log.created_at), 'MMM dd, yyyy')}</div>
                              <div className="text-xs text-gray-400">
                                {formatDate(new Date(log.created_at), 'HH:mm:ss')}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback className="text-xs">
                                    {log.admin_name.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium text-sm">{log.admin_name}</div>
                                  {log.admin_email && (
                                    <div className="text-xs text-gray-500">{log.admin_email}</div>
                                  )}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className={`p-1.5 rounded ${actionTypeColors[log.action_type] || 'text-gray-600 bg-gray-100'}`}>
                                  <Icon className="h-4 w-4" />
                                </div>
                                {getActionBadge(log.action_type)}
                              </div>
                            </TableCell>
                            <TableCell>
                              {targetLink ? (
                                <a
                                  href={targetLink}
                                  className="flex items-center gap-1 text-primary hover:underline"
                                >
                                  <Badge variant="secondary" className="text-xs">
                                    {log.target_type}
                                  </Badge>
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              ) : (
                                <Badge variant="secondary" className="text-xs">
                                  {log.target_type}
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="max-w-md">
                              <p className="text-sm">{log.description}</p>
                            </TableCell>
                            <TableCell className="text-sm text-gray-500 font-mono">
                              {log.ip_address || 'N/A'}
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            )}

            {activityLogs.length > 0 && (
              <div className="mt-4 text-sm text-gray-500 text-center">
                Showing {activityLogs.length} activities
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
