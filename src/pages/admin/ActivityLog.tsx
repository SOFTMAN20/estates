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
  User, Home, Calendar, Settings, Shield, Ban, Eye 
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

// Mock activity log data
const activityLogs = [
  {
    id: '1',
    admin_id: 'admin-1',
    admin_name: 'Admin User',
    action_type: 'approve_property',
    target_type: 'property',
    target_id: 'prop-123',
    description: 'Approved property "Modern 3BR Apartment in Masaki"',
    ip_address: '192.168.1.100',
    created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    status: 'success',
  },
  {
    id: '2',
    admin_id: 'admin-1',
    admin_name: 'Admin User',
    action_type: 'reject_property',
    target_type: 'property',
    target_id: 'prop-124',
    description: 'Rejected property "Single Room in Kinondoni" - Incomplete information',
    ip_address: '192.168.1.100',
    created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    status: 'success',
  },
  {
    id: '3',
    admin_id: 'admin-2',
    admin_name: 'Super Admin',
    action_type: 'suspend_user',
    target_type: 'user',
    target_id: 'user-456',
    description: 'Suspended user account "grace.wanjiru@example.com" - Policy violation',
    ip_address: '192.168.1.105',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    status: 'success',
  },
  {
    id: '4',
    admin_id: 'admin-1',
    admin_name: 'Admin User',
    action_type: 'update_settings',
    target_type: 'settings',
    target_id: 'settings-1',
    description: 'Updated platform commission rate from 10% to 12%',
    ip_address: '192.168.1.100',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    status: 'success',
  },
  {
    id: '5',
    admin_id: 'admin-2',
    admin_name: 'Super Admin',
    action_type: 'activate_user',
    target_type: 'user',
    target_id: 'user-789',
    description: 'Activated user account "peter.kamau@example.com"',
    ip_address: '192.168.1.105',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    status: 'success',
  },
  {
    id: '6',
    admin_id: 'admin-1',
    admin_name: 'Admin User',
    action_type: 'cancel_booking',
    target_type: 'booking',
    target_id: 'booking-321',
    description: 'Cancelled booking #321 - Customer request',
    ip_address: '192.168.1.100',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    status: 'success',
  },
  {
    id: '7',
    admin_id: 'admin-2',
    admin_name: 'Super Admin',
    action_type: 'process_refund',
    target_type: 'payment',
    target_id: 'payment-654',
    description: 'Processed refund of TZS 1,500,000 for booking #321',
    ip_address: '192.168.1.105',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    status: 'success',
  },
  {
    id: '8',
    admin_id: 'admin-1',
    admin_name: 'Admin User',
    action_type: 'approve_property',
    target_type: 'property',
    target_id: 'prop-125',
    description: 'Approved property "Luxury Villa in Mbezi Beach"',
    ip_address: '192.168.1.100',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    status: 'success',
  },
  {
    id: '9',
    admin_id: 'admin-1',
    admin_name: 'Admin User',
    action_type: 'update_settings',
    target_type: 'settings',
    target_id: 'settings-2',
    description: 'Enabled M-Pesa payment method',
    ip_address: '192.168.1.100',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    status: 'success',
  },
  {
    id: '10',
    admin_id: 'admin-2',
    admin_name: 'Super Admin',
    action_type: 'approve_property',
    target_type: 'property',
    target_id: 'prop-126',
    description: 'Approved property "Cozy Studio in Mikocheni"',
    ip_address: '192.168.1.105',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    status: 'success',
  },
];

const actionTypeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  approve_property: CheckCircle,
  reject_property: XCircle,
  suspend_user: Ban,
  activate_user: CheckCircle,
  update_settings: Settings,
  cancel_booking: XCircle,
  process_refund: AlertCircle,
};

const actionTypeColors: Record<string, string> = {
  approve_property: 'text-green-600 bg-green-100',
  reject_property: 'text-red-600 bg-red-100',
  suspend_user: 'text-orange-600 bg-orange-100',
  activate_user: 'text-green-600 bg-green-100',
  update_settings: 'text-blue-600 bg-blue-100',
  cancel_booking: 'text-red-600 bg-red-100',
  process_refund: 'text-yellow-600 bg-yellow-100',
};

export default function AdminActivityLog() {
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [adminFilter, setAdminFilter] = useState('all');

  const filteredLogs = activityLogs.filter((log) => {
    const matchesSearch = log.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         log.admin_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAction = actionFilter === 'all' || log.action_type === actionFilter;
    const matchesAdmin = adminFilter === 'all' || log.admin_id === adminFilter;
    
    return matchesSearch && matchesAction && matchesAdmin;
  });

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

  // Statistics
  const totalActions = activityLogs.length;
  const todayActions = activityLogs.filter(log => 
    new Date(log.created_at).toDateString() === new Date().toDateString()
  ).length;
  const uniqueAdmins = new Set(activityLogs.map(log => log.admin_id)).size;

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
              <div className="text-2xl font-bold">{totalActions}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Actions</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todayActions}</div>
              <p className="text-xs text-muted-foreground">Last 24 hours</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Admins</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{uniqueAdmins}</div>
              <p className="text-xs text-muted-foreground">Unique administrators</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
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

              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Filter by action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  <SelectItem value="approve_property">Approve Property</SelectItem>
                  <SelectItem value="reject_property">Reject Property</SelectItem>
                  <SelectItem value="suspend_user">Suspend User</SelectItem>
                  <SelectItem value="activate_user">Activate User</SelectItem>
                  <SelectItem value="update_settings">Update Settings</SelectItem>
                  <SelectItem value="cancel_booking">Cancel Booking</SelectItem>
                  <SelectItem value="process_refund">Process Refund</SelectItem>
                </SelectContent>
              </Select>

              <Select value={adminFilter} onValueChange={setAdminFilter}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Filter by admin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Admins</SelectItem>
                  <SelectItem value="admin-1">Admin User</SelectItem>
                  <SelectItem value="admin-2">Super Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Activity Log Table */}
        <Card>
          <CardHeader>
            <CardTitle>Activity History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Admin</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                        <Eye className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>No activity logs found</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredLogs.map((log) => {
                      const Icon = getActionIcon(log.action_type);
                      return (
                        <TableRow key={log.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="text-xs">
                                  {log.admin_name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <span className="font-medium text-sm">{log.admin_name}</span>
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
                          <TableCell className="max-w-md">
                            <p className="text-sm">{log.description}</p>
                          </TableCell>
                          <TableCell className="text-sm text-gray-500 font-mono">
                            {log.ip_address}
                          </TableCell>
                          <TableCell className="text-sm text-gray-500">
                            {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-green-600 border-green-600">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Success
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>

            {filteredLogs.length > 0 && (
              <div className="mt-4 text-sm text-gray-500 text-center">
                Showing {filteredLogs.length} of {totalActions} activities
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
