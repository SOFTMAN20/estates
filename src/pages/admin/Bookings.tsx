/**
 * Admin Bookings Management Page
 * Manage all platform bookings
 */

import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatDistanceToNow, format } from 'date-fns';
import { Calendar } from 'lucide-react';

// Mock booking data
const mockBookings = [
  {
    id: '1',
    property_title: 'Modern 3BR Apartment in Masaki',
    guest_name: 'John Mwangi',
    host_name: 'Sarah Kimani',
    check_in: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(),
    check_out: new Date(Date.now() + 1000 * 60 * 60 * 24 * 37).toISOString(),
    total_amount: 1500000,
    status: 'confirmed',
    payment_status: 'completed',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
  },
  {
    id: '2',
    property_title: 'Cozy Studio in Mikocheni',
    guest_name: 'Grace Wanjiru',
    host_name: 'Peter Kamau',
    check_in: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString(),
    check_out: new Date(Date.now() + 1000 * 60 * 60 * 24 * 44).toISOString(),
    total_amount: 650000,
    status: 'pending',
    payment_status: 'pending',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
  {
    id: '3',
    property_title: 'Spacious 4BR House in Oysterbay',
    guest_name: 'David Omondi',
    host_name: 'John Mwangi',
    check_in: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
    check_out: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
    total_amount: 2500000,
    status: 'completed',
    payment_status: 'completed',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 35).toISOString(),
  },
  {
    id: '4',
    property_title: 'Luxury Villa in Mbezi Beach',
    guest_name: 'Sarah Kimani',
    host_name: 'Grace Wanjiru',
    check_in: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString(),
    check_out: new Date(Date.now() + 1000 * 60 * 60 * 24 * 33).toISOString(),
    total_amount: 3200000,
    status: 'cancelled',
    payment_status: 'refunded',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
  },
];

export default function AdminBookings() {
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

  const totalBookings = mockBookings.length;
  const confirmedBookings = mockBookings.filter(b => b.status === 'confirmed').length;
  const completedBookings = mockBookings.filter(b => b.status === 'completed').length;
  const cancelledBookings = mockBookings.filter(b => b.status === 'cancelled').length;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      
      <div className="flex-1 p-4 md:p-8">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Booking Management</h1>
          <p className="text-gray-600 mt-1 md:mt-2">Track and manage all platform bookings</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalBookings}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{confirmedBookings}</div>
              <p className="text-xs text-muted-foreground">Active bookings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedBookings}</div>
              <p className="text-xs text-muted-foreground">Finished stays</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cancelled</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{cancelledBookings}</div>
              <p className="text-xs text-muted-foreground">Cancelled bookings</p>
            </CardContent>
          </Card>
        </div>

        {/* Bookings Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Property</TableHead>
                    <TableHead>Guest</TableHead>
                    <TableHead>Host</TableHead>
                    <TableHead>Check-in</TableHead>
                    <TableHead>Check-out</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockBookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-medium max-w-xs truncate">
                        {booking.property_title}
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
                      <TableCell>{getStatusBadge(booking.status)}</TableCell>
                      <TableCell>{getPaymentStatusBadge(booking.payment_status)}</TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {formatDistanceToNow(new Date(booking.created_at), { addSuffix: true })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
