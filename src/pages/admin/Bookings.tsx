/**
 * Admin Bookings Management Page
 * Manage all platform bookings
 */

import { useState } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatDistanceToNow, format } from 'date-fns';
import { Calendar, Search, Loader2, MoreVertical, Eye, CreditCard, XCircle, Mail, MapPin, User, Home, DollarSign } from 'lucide-react';
import { useAdminBookings, useBookingStats, type AdminBooking } from '@/hooks/useAdminBookings';

export default function AdminBookings() {
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<AdminBooking | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);

  // Fetch bookings with filters
  const { data: bookings = [], isLoading } = useAdminBookings({
    status: statusFilter,
    search: searchQuery,
  });

  // Fetch booking statistics
  const { data: stats } = useBookingStats();

  const handleViewDetails = (booking: AdminBooking) => {
    setSelectedBooking(booking);
    setShowDetailsDialog(true);
  };

  const handleViewPayment = (booking: AdminBooking) => {
    setSelectedBooking(booking);
    setShowPaymentDialog(true);
  };
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-blue-500">Confirmed</Badge>;
      case 'completed':
        return <Badge className="bg-green-500">Completed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="outline" className="text-green-600 border-green-600">Paid</Badge>;
      case 'pending':
        return <Badge variant="outline" className="text-yellow-600 border-yellow-600">Pending</Badge>;
      case 'failed':
        return <Badge variant="outline" className="text-red-600 border-red-600">Failed</Badge>;
      case 'refunded':
        return <Badge variant="outline" className="text-gray-600 border-gray-600">Refunded</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };



  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      
      <div className="flex-1 p-4 md:p-8">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Booking Management</h1>
          <p className="text-gray-600 mt-1 md:mt-2">Track and manage all platform bookings</p>
        </div>

        {/* Summary Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalBookings}</div>
                <p className="text-xs text-muted-foreground">All time</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.confirmedBookings}</div>
                <p className="text-xs text-muted-foreground">Active bookings</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.completedBookings}</div>
                <p className="text-xs text-muted-foreground">Finished stays</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cancelled</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.cancelledBookings}</div>
                <p className="text-xs text-muted-foreground">Cancelled bookings</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Bookings Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Search */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Search by booking ID, property, guest, or host..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Status Tabs */}
            <Tabs value={statusFilter} onValueChange={(value) => setStatusFilter(value as typeof statusFilter)} className="mb-6">
              <TabsList>
                <TabsTrigger value="all">
                  All {stats && `(${stats.totalBookings})`}
                </TabsTrigger>
                <TabsTrigger value="confirmed">
                  Confirmed {stats && `(${stats.confirmedBookings})`}
                </TabsTrigger>
                <TabsTrigger value="completed">
                  Completed {stats && `(${stats.completedBookings})`}
                </TabsTrigger>
                <TabsTrigger value="cancelled">
                  Cancelled {stats && `(${stats.cancelledBookings})`}
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Booking ID</TableHead>
                      <TableHead>Property</TableHead>
                      <TableHead>Guest</TableHead>
                      <TableHead>Host</TableHead>
                      <TableHead>Check-in</TableHead>
                      <TableHead>Check-out</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell className="font-mono text-xs">
                          {booking.id.slice(0, 8)}...
                        </TableCell>
                        <TableCell className="font-medium max-w-xs">
                          <div>
                            <p className="truncate">{booking.property_title}</p>
                            <p className="text-xs text-gray-500 truncate">{booking.property_location}</p>
                          </div>
                        </TableCell>
                        <TableCell>{booking.guest_name}</TableCell>
                        <TableCell>{booking.host_name}</TableCell>
                        <TableCell className="text-sm">
                          {format(new Date(booking.check_in), 'MMM d, yyyy')}
                        </TableCell>
                        <TableCell className="text-sm">
                          {format(new Date(booking.check_out), 'MMM d, yyyy')}
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatPrice(booking.total_amount)}
                        </TableCell>
                        <TableCell>{getPaymentStatusBadge(booking.payment_status || 'pending')}</TableCell>
                        <TableCell>{getStatusBadge(booking.status)}</TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {formatDistanceToNow(new Date(booking.created_at), { addSuffix: true })}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewDetails(booking)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <CreditCard className="mr-2 h-4 w-4" />
                                View Payment Info
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <Mail className="mr-2 h-4 w-4" />
                                Contact Guest
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Mail className="mr-2 h-4 w-4" />
                                Contact Host
                              </DropdownMenuItem>
                              {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-red-600">
                                    <XCircle className="mr-2 h-4 w-4" />
                                    Cancel Booking
                                  </DropdownMenuItem>
                                </>
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

            {!isLoading && bookings.length === 0 && (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50 text-gray-400" />
                <p className="text-gray-500">No bookings found</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Booking Details Modal */}
        <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Booking Details</DialogTitle>
              <DialogDescription>
                Complete information about this booking
              </DialogDescription>
            </DialogHeader>

            {selectedBooking && (
              <div className="space-y-6">
                {/* Booking Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Booking Information</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Booking ID</p>
                      <p className="font-mono">{selectedBooking.id}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Status</p>
                      <div className="mt-1">{getStatusBadge(selectedBooking.status)}</div>
                    </div>
                    <div>
                      <p className="text-gray-500">Check-in Date</p>
                      <p className="font-medium">{format(new Date(selectedBooking.check_in), 'MMMM d, yyyy')}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Check-out Date</p>
                      <p className="font-medium">{format(new Date(selectedBooking.check_out), 'MMMM d, yyyy')}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Duration</p>
                      <p className="font-medium">{selectedBooking.total_months} month(s)</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Created</p>
                      <p>{format(new Date(selectedBooking.created_at), 'MMM d, yyyy HH:mm')}</p>
                    </div>
                  </div>
                </div>

                {/* Property Details */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Home className="h-5 w-5" />
                    Property Details
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <p className="font-medium text-lg">{selectedBooking.property_title}</p>
                    <p className="text-gray-600 flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {selectedBooking.property_location}
                    </p>
                    <p className="text-sm text-gray-500">Property ID: {selectedBooking.property_id}</p>
                  </div>
                </div>

                {/* Guest Details */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Guest Details
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <p className="font-medium">{selectedBooking.guest_name}</p>
                    <p className="text-sm text-gray-500">Guest ID: {selectedBooking.guest_id}</p>
                  </div>
                </div>

                {/* Host Details */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Host Details
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <p className="font-medium">{selectedBooking.host_name}</p>
                    <p className="text-sm text-gray-500">Host ID: {selectedBooking.host_id}</p>
                  </div>
                </div>

                {/* Payment Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Payment Information
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Monthly Rent</span>
                      <span className="font-medium">{formatPrice(selectedBooking.monthly_rent)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration</span>
                      <span>{selectedBooking.total_months} month(s)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Service Fee</span>
                      <span className="font-medium">{formatPrice(selectedBooking.service_fee)}</span>
                    </div>
                    <div className="border-t pt-3 flex justify-between">
                      <span className="font-semibold">Total Amount</span>
                      <span className="font-bold text-lg">{formatPrice(selectedBooking.total_amount)}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-gray-600">Payment Status</span>
                      {getPaymentStatusBadge(selectedBooking.payment_status || 'pending')}
                    </div>
                    {selectedBooking.payment_method && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Payment Method</span>
                        <span className="capitalize">{selectedBooking.payment_method}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Special Requests */}
                {selectedBooking.special_requests && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Special Requests</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-700">{selectedBooking.special_requests}</p>
                    </div>
                  </div>
                )}

                {/* Cancellation Info */}
                {selectedBooking.status === 'cancelled' && selectedBooking.cancellation_reason && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-red-600">Cancellation Information</h3>
                    <div className="bg-red-50 p-4 rounded-lg space-y-2">
                      <p className="text-gray-700">{selectedBooking.cancellation_reason}</p>
                      {selectedBooking.cancellation_date && (
                        <p className="text-sm text-gray-500">
                          Cancelled on {format(new Date(selectedBooking.cancellation_date), 'MMMM d, yyyy HH:mm')}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Timeline */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Timeline</h3>
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                      <div>
                        <p className="font-medium">Booking Created</p>
                        <p className="text-sm text-gray-500">
                          {format(new Date(selectedBooking.created_at), 'MMMM d, yyyy HH:mm')}
                        </p>
                      </div>
                    </div>
                    {selectedBooking.status === 'confirmed' && (
                      <div className="flex gap-3">
                        <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                        <div>
                          <p className="font-medium">Booking Confirmed</p>
                          <p className="text-sm text-gray-500">Payment completed</p>
                        </div>
                      </div>
                    )}
                    {selectedBooking.status === 'cancelled' && selectedBooking.cancellation_date && (
                      <div className="flex gap-3">
                        <div className="w-2 h-2 rounded-full bg-red-500 mt-2"></div>
                        <div>
                          <p className="font-medium">Booking Cancelled</p>
                          <p className="text-sm text-gray-500">
                            {format(new Date(selectedBooking.cancellation_date), 'MMMM d, yyyy HH:mm')}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Admin Actions */}
                <div className="flex gap-3 pt-4 border-t">
                  <Button variant="outline" className="flex-1">
                    <Mail className="mr-2 h-4 w-4" />
                    Contact Guest
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Mail className="mr-2 h-4 w-4" />
                    Contact Host
                  </Button>
                  {selectedBooking.status !== 'cancelled' && selectedBooking.status !== 'completed' && (
                    <Button variant="destructive" className="flex-1">
                      <XCircle className="mr-2 h-4 w-4" />
                      Cancel Booking
                    </Button>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
