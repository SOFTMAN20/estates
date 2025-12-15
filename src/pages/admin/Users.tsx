/**
 * Admin Users Management Page
 * Manage all platform users
 */

import { useState } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Search, MoreVertical, Shield, Ban, CheckCircle, Loader2, Users, UserCheck, UserX, UserCog, Mail, Phone, Home, Calendar, DollarSign, TrendingUp, Activity } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import { useAdminUsers, useUserStats, useSuspendUser, useActivateUser, useUpdateUserRole, useUserDetails, type AdminUser } from '@/hooks/useAdminUsers';

export default function AdminUsers() {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'user' | 'admin'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'suspended'>('all');
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showSuspendDialog, setShowSuspendDialog] = useState(false);
  const [showActivateDialog, setShowActivateDialog] = useState(false);
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [suspensionReason, setSuspensionReason] = useState('');
  const [newRole, setNewRole] = useState<'user' | 'admin'>('user');

  // Fetch users with filters
  const { data: users = [], isLoading } = useAdminUsers({
    role: roleFilter,
    status: statusFilter,
    search: searchQuery,
  });

  // Fetch user statistics
  const { data: stats } = useUserStats();

  // Fetch user details for modal
  const { data: userDetails, isLoading: detailsLoading } = useUserDetails(selectedUserId);

  // Mutations
  const suspendMutation = useSuspendUser();
  const activateMutation = useActivateUser();
  const updateRoleMutation = useUpdateUserRole();

  const handleViewDetails = (user: AdminUser) => {
    setSelectedUserId(user.id);
    setShowDetailsDialog(true);
  };

  const handleSuspend = (user: AdminUser) => {
    setSelectedUser(user);
    setShowSuspendDialog(true);
  };

  const confirmSuspend = () => {
    if (!selectedUser) return;
    if (!suspensionReason.trim()) {
      toast.error('Please provide a suspension reason');
      return;
    }

    suspendMutation.mutate(
      { userId: selectedUser.id, reason: suspensionReason },
      {
        onSuccess: () => {
          setShowSuspendDialog(false);
          setSuspensionReason('');
          setSelectedUser(null);
        },
      }
    );
  };

  const handleActivate = (user: AdminUser) => {
    setSelectedUser(user);
    setShowActivateDialog(true);
  };

  const confirmActivate = () => {
    if (!selectedUser) return;

    activateMutation.mutate(selectedUser.id, {
      onSuccess: () => {
        setShowActivateDialog(false);
        setSelectedUser(null);
      },
    });
  };

  const handleChangeRole = (user: AdminUser) => {
    setSelectedUser(user);
    setNewRole(user.role as 'user' | 'admin');
    setShowRoleDialog(true);
  };

  const confirmRoleChange = () => {
    if (!selectedUser) return;

    updateRoleMutation.mutate(
      { userId: selectedUser.id, role: newRole },
      {
        onSuccess: () => {
          setShowRoleDialog(false);
          setSelectedUser(null);
        },
      }
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      
      <div className="flex-1 p-4 md:p-8">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-1 md:mt-2">Manage all platform users and permissions</p>
        </div>

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Total Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Users className="h-8 w-8 text-blue-600" />
                  <span className="text-3xl font-bold">{stats.totalUsers}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Active Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <UserCheck className="h-8 w-8 text-green-600" />
                  <span className="text-3xl font-bold">{stats.activeUsers}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Suspended</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <UserX className="h-8 w-8 text-red-600" />
                  <span className="text-3xl font-bold">{stats.suspendedUsers}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Hosts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <UserCog className="h-8 w-8 text-purple-600" />
                  <span className="text-3xl font-bold">{stats.totalHosts}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Admins</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Shield className="h-8 w-8 text-orange-600" />
                  <span className="text-3xl font-bold">{stats.totalAdmins}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <Card>
          <CardContent className="pt-6">
            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Search by name, email, or phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select
                value={roleFilter}
                onValueChange={(value) => setRoleFilter(value as 'all' | 'user' | 'admin')}
              >
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="user">Users</SelectItem>
                  <SelectItem value="admin">Admins</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={statusFilter}
                onValueChange={(value) => setStatusFilter(value as 'all' | 'active' | 'suspended')}
              >
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Users Table */}
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Properties</TableHead>
                      <TableHead>Bookings</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users?.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              {user.avatar_url && (
                                <AvatarImage src={user.avatar_url} alt={user.name || 'User'} />
                              )}
                              <AvatarFallback>{user.name?.[0] || '?'}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{user.name || 'Unnamed User'}</p>
                              {user.is_host && (
                                <Badge variant="outline" className="text-xs">Host</Badge>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-gray-600">
                            <Mail className="h-3 w-3 inline mr-1" />
                            {user.email || 'N/A'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-gray-600">
                            <Phone className="h-3 w-3 inline mr-1" />
                            {user.phone || 'N/A'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                            <Shield className="h-3 w-3 mr-1" />
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-gray-600">
                            <Home className="h-3 w-3 inline mr-1" />
                            {user.properties_count || 0}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-gray-600">
                            <Calendar className="h-3 w-3 inline mr-1" />
                            {user.bookings_count || 0}
                          </div>
                        </TableCell>
                        <TableCell>
                          {user.is_suspended ? (
                            <div className="space-y-1">
                              <Badge variant="destructive">
                                <Ban className="h-3 w-3 mr-1" />
                                Suspended
                              </Badge>
                              {user.suspension_reason && (
                                <p className="text-xs text-gray-500">{user.suspension_reason}</p>
                              )}
                            </div>
                          ) : (
                            <Badge variant="outline" className="text-green-600 border-green-600">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Active
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {formatDistanceToNow(new Date(user.created_at), { addSuffix: true })}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewDetails(user)}>
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleChangeRole(user)}>
                                Change Role
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {user.is_suspended ? (
                                <DropdownMenuItem 
                                  className="text-green-600"
                                  onClick={() => handleActivate(user)}
                                >
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Activate Account
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem 
                                  className="text-red-600"
                                  onClick={() => handleSuspend(user)}
                                >
                                  <Ban className="h-4 w-4 mr-2" />
                                  Suspend Account
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {!isLoading && users?.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-12 w-12 mx-auto mb-2 opacity-50 text-gray-400" />
                <p className="text-gray-500">No users found</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* User Details Modal */}
        <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">User Details</DialogTitle>
            </DialogHeader>
            {detailsLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : userDetails ? (
              <div className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-16 w-16">
                        {userDetails.avatar_url && (
                          <AvatarImage src={userDetails.avatar_url} alt={userDetails.name || 'User'} />
                        )}
                        <AvatarFallback className="text-2xl">{userDetails.name?.[0] || '?'}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-lg">{userDetails.name || 'Unnamed User'}</p>
                        <Badge variant={userDetails.role === 'admin' ? 'default' : 'secondary'}>
                          {userDetails.role}
                        </Badge>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">Email:</span>
                        <span>{userDetails.email || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">Phone:</span>
                        <span>{userDetails.phone || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">Joined:</span>
                        <span>{formatDistanceToNow(new Date(userDetails.created_at), { addSuffix: true })}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Account Statistics */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Account Statistics
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <Home className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                          <p className="text-2xl font-bold">{userDetails.properties_count}</p>
                          <p className="text-sm text-gray-600">Properties Listed</p>
                          {userDetails.is_host && (
                            <Badge variant="outline" className="mt-2">As Host</Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <Calendar className="h-8 w-8 mx-auto mb-2 text-green-600" />
                          <p className="text-2xl font-bold">{userDetails.bookings_count}</p>
                          <p className="text-sm text-gray-600">Bookings Made</p>
                          <Badge variant="outline" className="mt-2">As Guest</Badge>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <DollarSign className="h-8 w-8 mx-auto mb-2 text-red-600" />
                          <p className="text-2xl font-bold">
                            {new Intl.NumberFormat('en-TZ', {
                              style: 'currency',
                              currency: 'TZS',
                              minimumFractionDigits: 0,
                            }).format(userDetails.total_spent || 0)}
                          </p>
                          <p className="text-sm text-gray-600">Total Spent</p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <DollarSign className="h-8 w-8 mx-auto mb-2 text-green-600" />
                          <p className="text-2xl font-bold">
                            {new Intl.NumberFormat('en-TZ', {
                              style: 'currency',
                              currency: 'TZS',
                              minimumFractionDigits: 0,
                            }).format(userDetails.total_earned || 0)}
                          </p>
                          <p className="text-sm text-gray-600">Total Earned</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Activity Log */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Recent Activity
                  </h3>
                  <div className="text-center py-8 text-gray-500">
                    <Activity className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Activity log coming soon</p>
                  </div>
                </div>

                {/* Admin Actions */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">Admin Actions</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Change Role</label>
                      <Select 
                        value={userDetails.role} 
                        onValueChange={(value) => {
                          setSelectedUser(userDetails as AdminUser);
                          setNewRole(value as 'user' | 'admin');
                          setShowDetailsDialog(false);
                          setShowRoleDialog(true);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex gap-2">
                      {userDetails.is_suspended ? (
                        <Button
                          className="flex-1 bg-green-600 hover:bg-green-700"
                          onClick={() => {
                            setSelectedUser(userDetails as AdminUser);
                            setShowDetailsDialog(false);
                            setShowActivateDialog(true);
                          }}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Activate Account
                        </Button>
                      ) : (
                        <Button
                          variant="destructive"
                          className="flex-1"
                          onClick={() => {
                            setSelectedUser(userDetails as AdminUser);
                            setShowDetailsDialog(false);
                            setShowSuspendDialog(true);
                          }}
                        >
                          <Ban className="h-4 w-4 mr-2" />
                          Suspend Account
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <p>User not found</p>
              </div>
            )}
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowDetailsDialog(false);
                  setSelectedUserId(null);
                }}
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Suspend User Dialog */}
        <Dialog open={showSuspendDialog} onOpenChange={setShowSuspendDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Suspend User Account</DialogTitle>
              <DialogDescription>
                Please provide a reason for suspending "{selectedUser?.name}". The user will not be able to access the platform.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <label className="text-sm font-medium mb-2 block">Suspension Reason *</label>
              <Textarea
                placeholder="Enter suspension reason..."
                value={suspensionReason}
                onChange={(e) => setSuspensionReason(e.target.value)}
                rows={4}
                className="resize-none"
              />
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setShowSuspendDialog(false);
                  setSuspensionReason('');
                  setSelectedUser(null);
                }}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmSuspend}
                disabled={!suspensionReason.trim() || suspendMutation.isPending}
              >
                {suspendMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Suspending...
                  </>
                ) : (
                  <>
                    <Ban className="h-4 w-4 mr-2" />
                    Suspend Account
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Activate User Dialog */}
        <AlertDialog open={showActivateDialog} onOpenChange={setShowActivateDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Activate User Account</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to activate "{selectedUser?.name}"? They will regain full access to the platform.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setSelectedUser(null)}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmActivate}
                className="bg-green-600 hover:bg-green-700"
                disabled={activateMutation.isPending}
              >
                {activateMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Activating...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Activate Account
                  </>
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Change Role Dialog */}
        <Dialog open={showRoleDialog} onOpenChange={setShowRoleDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Change User Role</DialogTitle>
              <DialogDescription>
                Update the role for "{selectedUser?.name}". This will change their permissions on the platform.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <label className="text-sm font-medium mb-2 block">Select Role</label>
              <Select value={newRole} onValueChange={(value) => setNewRole(value as 'user' | 'admin')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>User</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="admin">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      <span>Admin</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500 mt-2">
                {newRole === 'admin' 
                  ? 'Admins have full access to manage the platform.' 
                  : 'Users have standard access to browse and book properties.'}
              </p>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setShowRoleDialog(false);
                  setSelectedUser(null);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={confirmRoleChange}
                disabled={updateRoleMutation.isPending}
              >
                {updateRoleMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Updating...
                  </>
                ) : (
                  'Update Role'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
