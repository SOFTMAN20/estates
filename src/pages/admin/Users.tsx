/**
 * Admin Users Management Page
 * Manage all platform users
 */

import { useState } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
import { Search, Filter, MoreVertical, Shield, Ban, CheckCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

// Mock data for UI preview
const mockUsers = [
  {
    user_id: '1',
    name: 'John Mwangi',
    phone: '+255 712 345 678',
    role: 'user',
    is_host: true,
    is_suspended: false,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
    avatar_url: null,
  },
  {
    user_id: '2',
    name: 'Sarah Kimani',
    phone: '+255 713 456 789',
    role: 'user',
    is_host: true,
    is_suspended: false,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45).toISOString(),
    avatar_url: null,
  },
  {
    user_id: '3',
    name: 'Admin User',
    phone: '+255 714 567 890',
    role: 'admin',
    is_host: false,
    is_suspended: false,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 180).toISOString(),
    avatar_url: null,
  },
  {
    user_id: '4',
    name: 'Grace Wanjiru',
    phone: '+255 715 678 901',
    role: 'user',
    is_host: false,
    is_suspended: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString(),
    avatar_url: null,
  },
  {
    user_id: '5',
    name: 'Peter Kamau',
    phone: '+255 716 789 012',
    role: 'user',
    is_host: true,
    is_suspended: false,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(),
    avatar_url: null,
  },
];

export default function AdminUsers() {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  // Using mock data for UI preview
  const isLoading = false;
  const users = mockUsers;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      
      <div className="flex-1 p-4 md:p-8">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-1 md:mt-2">Manage all platform users and permissions</p>
        </div>

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
                onValueChange={(value) => setRoleFilter(value)}
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

              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </div>

            {/* Users Table */}
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users?.map((user) => (
                      <TableRow key={user.user_id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              <AvatarFallback>{user.name?.[0] || '?'}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{user.name}</p>
                              {user.is_host && (
                                <Badge variant="outline" className="text-xs">Host</Badge>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p className="text-gray-600">{user.phone || 'N/A'}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                            <Shield className="h-3 w-3 mr-1" />
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {user.is_suspended ? (
                            <Badge variant="destructive">
                              <Ban className="h-3 w-3 mr-1" />
                              Suspended
                            </Badge>
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
                              <DropdownMenuItem onClick={() => toast.info('View details (Mock action)')}>
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => toast.info('Edit role (Mock action)')}>
                                Edit Role
                              </DropdownMenuItem>
                              {user.is_suspended ? (
                                <DropdownMenuItem 
                                  className="text-green-600"
                                  onClick={() => toast.success('Account activated (Mock action)')}
                                >
                                  Activate Account
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem 
                                  className="text-red-600"
                                  onClick={() => toast.success('Account suspended (Mock action)')}
                                >
                                  Suspend Account
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem onClick={() => toast.info('Send message (Mock action)')}>
                                Send Message
                              </DropdownMenuItem>
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
                <p className="text-gray-500">No users found</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
